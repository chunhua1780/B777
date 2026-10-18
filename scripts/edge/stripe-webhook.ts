// Supabase Edge Function: stripe-webhook
// Receives Stripe's webhook events for completed Payment Link checkouts and
// grants paid access automatically -- this is what makes "Grant paid" in the
// Admin Dashboard optional instead of mandatory for every real payment.
//
// Setup (all one-time, done by the admin -- Claude cannot do any of this,
// it requires your own Stripe account):
//   1. In Stripe Dashboard, create a Payment Link for each plan you want to
//      sell (e.g. a yearly plan). Note its "plink_..." ID (shown in the
//      Payment Link's own settings / API, not the checkout URL itself).
//   2. In the Admin Dashboard's new Pricing card, add a plan row with that
//      same stripe_payment_link_id, plus the duration and the full
//      checkout URL.
//   3. Deploy -- Dashboard -> Edge Functions -> Deploy new function -> name
//      it exactly: stripe-webhook. IMPORTANT: turn OFF "Enforce JWT
//      verification" for this function -- Stripe calls it directly, with
//      no Supabase login, so a JWT check would reject every delivery.
//   4. Set two function secrets (Edge Functions -> stripe-webhook -> Secrets):
//        STRIPE_WEBHOOK_SECRET  -- from the webhook endpoint you create next
//        STRIPE_SECRET_KEY      -- your Stripe secret key (sk_live_... / sk_test_...)
//   5. In Stripe Dashboard -> Developers -> Webhooks, add an endpoint
//      pointing at this function's URL (shown after deploy), subscribed to
//      the "checkout.session.completed" event. Stripe gives you the signing
//      secret for step 4 at that point.
//
// What it does on each completed checkout: looks up which plan was bought
// (by the Payment Link id), and upserts a row into b777_paid_users for the
// buyer (identified by client_reference_id -- the app appends
// ?client_reference_id=<their user id> to the Payment Link URL before
// sending them to pay), with an expiry computed from that plan's
// duration_days (null duration = lifetime).
import { createClient } from 'npm:@supabase/supabase-js@2'
import Stripe from 'npm:stripe@17'

function json(o: unknown, s = 200) {
  return new Response(JSON.stringify(o), { status: s, headers: { 'content-type': 'application/json' } })
}

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

  if (event.type !== 'checkout.session.completed') return json({ ok: true, ignored: event.type })

  const session = event.data.object as Stripe.Checkout.Session
  const userId = session.client_reference_id
  const paymentLinkId = typeof session.payment_link === 'string' ? session.payment_link : session.payment_link?.id
  if (!userId || !paymentLinkId) return json({ ok: true, ignored: 'missing client_reference_id or payment_link' })

  const url = Deno.env.get('SUPABASE_URL')!
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  const admin = createClient(url, serviceKey)

  const { data: plan, error: planErr } = await admin
    .from('b777_plans')
    .select('id, duration_days')
    .eq('stripe_payment_link_id', paymentLinkId)
    .maybeSingle()
  if (planErr || !plan) return json({ ok: true, ignored: 'no matching plan for payment_link ' + paymentLinkId })

  const expiresAt = plan.duration_days
    ? new Date(Date.now() + plan.duration_days * 86400000).toISOString()
    : null

  const { error } = await admin.from('b777_paid_users').upsert({
    user_id: userId,
    plan_id: plan.id,
    expires_at: expiresAt,
    note: 'stripe checkout ' + session.id,
  })
  if (error) return json({ error: error.message }, 500)

  return json({ ok: true })
})
