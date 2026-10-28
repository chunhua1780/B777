// Supabase Edge Function: stripe-webhook
// Receives Stripe's webhook events for Payment Link checkouts (one-time OR
// recurring subscriptions) and grants/renews/revokes paid access
// automatically -- this is what makes "Grant paid" in the Admin Dashboard
// optional instead of mandatory for every real payment.
//
// Setup (all one-time, done by the admin -- Claude cannot do any of this,
// it requires your own Stripe account):
//   1. In Stripe Dashboard, create a recurring Price (e.g. monthly or
//      yearly) and a Payment Link for it, for each plan you want to sell.
//      Note the Payment Link's "plink_..." ID (shown in the Payment Link's
//      own settings / API, not the checkout URL itself).
//   2. In the Admin Dashboard's Pricing Plans card, add a plan row with
//      that same stripe_payment_link_id, plus the checkout URL and which
//      membership tier it grants (Membership Tiers card, right above --
//      define the tier there first). For a subscription, duration_days is
//      only the fallback grant window used the instant checkout completes,
//      before Stripe's first subscription.updated event lands (which then
//      takes over as the real source of truth for the expiry, renewing it
//      every cycle) -- set it to roughly one billing period, e.g. 31 for
//      monthly.
//   3. Deploy -- Dashboard -> Edge Functions -> Deploy new function -> name
//      it exactly: stripe-webhook. IMPORTANT: turn OFF "Enforce JWT
//      verification" for this function -- Stripe calls it directly, with
//      no Supabase login, so a JWT check would reject every delivery.
//   4. Set two function secrets (Edge Functions -> stripe-webhook -> Secrets):
//        STRIPE_WEBHOOK_SECRET  -- from the webhook endpoint you create next
//        STRIPE_SECRET_KEY      -- your Stripe secret key (sk_live_... / sk_test_...)
//   5. In Stripe Dashboard -> Developers -> Webhooks, add an endpoint
//      pointing at this function's URL (shown after deploy), subscribed to
//      THREE events: "checkout.session.completed",
//      "customer.subscription.updated", "customer.subscription.deleted".
//      Stripe gives you the signing secret for step 4 at that point.
//   6. Run scripts/setup_subscriptions.sql AND scripts/setup_membership_tiers.sql
//      in Supabase SQL Editor (adds the stripe_subscription_id column this
//      function needs, and the tier_id columns on b777_paid_users/b777_plans).
//
// Lifecycle:
//   checkout.session.completed -- first payment. Looks up which plan was
//     bought (by the Payment Link id) and upserts b777_paid_users for the
//     buyer (identified by client_reference_id -- the app appends
//     ?client_reference_id=<their user id> to the Payment Link URL before
//     sending them to pay), remembering the subscription id for the events
//     below. Initial expiry is the plan's duration_days (null = lifetime,
//     for a genuinely one-time Payment Link with no recurring price).
//   customer.subscription.updated -- fires on renewal (and on creation,
//     redundantly with checkout.session.completed). Sets expires_at to the
//     subscription's current_period_end, which is Stripe's own answer to
//     "paid through when" -- this is what actually keeps access alive
//     across billing cycles. A non-renewing status (canceled, unpaid,
//     incomplete_expired) revokes access immediately instead.
//   customer.subscription.deleted -- the subscription has actually ended
//     (cancelled immediately, or a scheduled cancellation reaching its
//     period end). Revokes access immediately.
import { createClient } from 'npm:@supabase/supabase-js@2'
import Stripe from 'npm:stripe@17'

function json(o: unknown, s = 200) {
  return new Response(JSON.stringify(o), { status: s, headers: { 'content-type': 'application/json' } })
}

const LIVE_STATUSES = new Set(['active', 'trialing', 'past_due'])

Deno.serve(async (req) => {
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405)

  const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')
  const stripeSecret = Deno.env.get('STRIPE_SECRET_KEY')
  if (!webhookSecret || !stripeSecret) return json({ error: 'Not configured' }, 500)

  const stripe = new Stripe(stripeSecret, { apiVersion: '2024-06-20' })
  const signature = req.headers.get('stripe-signature') || ''
  const body = await req.text()

  let event: Stripe.Event
  try {
    event = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret)
  } catch (err) {
    return json({ error: 'Signature verification failed: ' + (err as Error).message }, 400)
  }

  const url = Deno.env.get('SUPABASE_URL')!
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  const admin = createClient(url, serviceKey)

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const userId = session.client_reference_id
    const paymentLinkId = typeof session.payment_link === 'string' ? session.payment_link : session.payment_link?.id
    const subscriptionId = typeof session.subscription === 'string' ? session.subscription : session.subscription?.id
    if (!userId || !paymentLinkId) return json({ ok: true, ignored: 'missing client_reference_id or payment_link' })

    const { data: plan, error: planErr } = await admin
      .from('b777_plans')
      .select('id, duration_days, tier_id')
      .eq('stripe_payment_link_id', paymentLinkId)
      .maybeSingle()
    if (planErr || !plan) return json({ ok: true, ignored: 'no matching plan for payment_link ' + paymentLinkId })

    const expiresAt = plan.duration_days
      ? new Date(Date.now() + plan.duration_days * 86400000).toISOString()
      : null

    const { error } = await admin.from('b777_paid_users').upsert({
      user_id: userId,
      plan_id: plan.id,
      tier_id: plan.tier_id,
      expires_at: expiresAt,
      stripe_subscription_id: subscriptionId || null,
      note: 'stripe checkout ' + session.id,
    })
    if (error) return json({ error: error.message }, 500)
    return json({ ok: true })
  }

  if (event.type === 'customer.subscription.updated' || event.type === 'customer.subscription.deleted') {
    const sub = event.data.object as Stripe.Subscription
    const expiresAt = (event.type === 'customer.subscription.deleted' || !LIVE_STATUSES.has(sub.status))
      ? new Date().toISOString()
      : new Date(sub.current_period_end * 1000).toISOString()

    const { error } = await admin
      .from('b777_paid_users')
      .update({ expires_at: expiresAt })
      .eq('stripe_subscription_id', sub.id)
    if (error) return json({ error: error.message }, 500)
    return json({ ok: true })
  }

  return json({ ok: true, ignored: event.type })
})
