// "Go to Know" — original, general 777 systems-knowledge questions.
// Not derived from any third-party study guide or copyrighted book: these
// are general, publicly-documented facts about the 777 airframe, written
// from scratch. They're a general-knowledge primer, not a substitute for
// your airline's own OM/FCOM/QRH — numbers and procedures in YOUR manuals
// always win if anything here ever looks different.
// IDs are prefixed "gtk-" so they never collide with the main question
// bank's IDs; the existing FSRS memory-scheduling (CARDS in index.html)
// works on these the same way it works on the main bank, keyed by id.
var GTK_CHAPTERS = [
  { key: 'engines',   label: 'Engines & Powerplant' },
  { key: 'electrical',label: 'Electrical' },
  { key: 'hydraulics',label: 'Hydraulics' },
  { key: 'flightctl', label: 'Flight Controls' },
  { key: 'fuel',      label: 'Fuel System' },
  { key: 'gear',      label: 'Landing Gear' }
];
var GTK_QUESTIONS = [

// ── Engines & Powerplant ──
{ id:'gtk-eng-01', chapter:'engines', question:'Which engine manufacturers has the 777 been certified with, depending on variant and customer?',
  options:{A:'General Electric only', B:'General Electric, Pratt & Whitney, and Rolls-Royce', C:'Pratt & Whitney and CFM International', D:'Rolls-Royce only'}, answer:'B' },
{ id:'gtk-eng-02', chapter:'engines', question:'What does FADEC stand for?',
  options:{A:'Full Authority Digital Engine Control', B:'Flight Augmented Digital Engine Computer', C:'Forward Auxiliary Drive Engine Control', D:'Fuel And Drive Engine Converter'}, answer:'A' },
{ id:'gtk-eng-03', chapter:'engines', question:'The GE90-115B, used on the 777-300ER, is notable for being:',
  options:{A:'The lightest turbofan ever certified', B:'The most powerful commercial turbofan engine ever certified', C:'The first turboprop fitted to a widebody', D:'Only usable for ground testing, not revenue flights'}, answer:'B' },
{ id:'gtk-eng-04', chapter:'engines', question:'At its entry into service in 1995, the 777 was notable as the first airliner to be:',
  options:{A:'Certified for 180-minute ETOPS from entry into service', B:'Flown without any pilot type rating', C:'Powered entirely by electric motors', D:'Exempt from all maintenance checks'}, answer:'A' },
{ id:'gtk-eng-05', chapter:'engines', question:'ETOPS ratings exist primarily to govern:',
  options:{A:'How far a twin-engine airplane may fly from a suitable diversion airport', B:'The maximum cabin noise level', C:'How many flight attendants are required', D:'The color scheme an airline may use'}, answer:'A' },
{ id:'gtk-eng-06', chapter:'engines', question:'The 777 is a twin-engine widebody. Where are its engines mounted?',
  options:{A:'On pylons under the wings', B:'On the aft fuselage, either side of the tail', C:'Buried in the wing roots', D:'On top of the fuselage'}, answer:'A' },
{ id:'gtk-eng-07', chapter:'engines', question:'What is the main purpose of thrust reversers on landing?',
  options:{A:'To redirect engine exhaust forward, helping decelerate the airplane on the runway', B:'To increase climb thrust', C:'To cool the engines after shutdown', D:'To pressurize the cabin'}, answer:'A' },
{ id:'gtk-eng-08', chapter:'engines', question:'Which of these is typically used to start a 777 engine on the ground?',
  options:{A:'Pneumatic (air-driven) starter, fed by APU or ground air', B:'A hand crank', C:'The RAT', D:'A second engine\'s thrust reverser'}, answer:'A' },

// ── Electrical ──
{ id:'gtk-elec-01', chapter:'electrical', question:'Each 777 engine drives what type of primary AC generator?',
  options:{A:'An Integrated Drive Generator (IDG)', B:'A ram air turbine', C:'A battery charger only', D:'A hydraulic motor pump'}, answer:'A' },
{ id:'gtk-elec-02', chapter:'electrical', question:'Besides the two engine-driven IDGs, which other generator can supply the main AC busses on the ground or in flight?',
  options:{A:'The APU generator', B:'A generator on the nose gear', C:'The fuel pump motor', D:'There is no other generator'}, answer:'A' },
{ id:'gtk-elec-03', chapter:'electrical', question:'If both engine-driven generators and the APU generator were lost in flight, which device deploys automatically to help restore power?',
  options:{A:'The Ram Air Turbine (RAT)', B:'A spare IDG stored in the cargo hold', C:'The weather radar', D:'The fuel jettison system'}, answer:'A' },
{ id:'gtk-elec-04', chapter:'electrical', question:'On the 777, the Ram Air Turbine (RAT), once deployed, can supply:',
  options:{A:'Both electrical power and hydraulic power to the center system', B:'Only cabin lighting', C:'Only fuel pump power', D:'Only APU starting power'}, answer:'A' },
{ id:'gtk-elec-05', chapter:'electrical', question:'What is the purpose of splitting the electrical system into left and right buses fed by separate generators?',
  options:{A:'So a single generator failure does not black out the entire airplane', B:'To make the airplane lighter', C:'To reduce fuel burn', D:'It has no operational purpose, it is just wiring convention'}, answer:'A' },
{ id:'gtk-elec-06', chapter:'electrical', question:'In addition to the main generators, the 777 electrical system includes backup generators intended to:',
  options:{A:'Supply essential loads if the main generator sources are lost', B:'Replace the APU entirely', C:'Power only the entertainment system', D:'Start the engines'}, answer:'A' },
{ id:'gtk-elec-07', chapter:'electrical', question:'Which of these would NOT normally be considered a source of electrical power on the 777?',
  options:{A:'A dedicated windmilling propeller', B:'Engine-driven IDGs', C:'The APU generator', D:'The RAT'}, answer:'A' },
{ id:'gtk-elec-08', chapter:'electrical', question:'Aircraft batteries are primarily relied on for:',
  options:{A:'Essential power during APU/engine start and as a short-term backup source', B:'Driving the main engines', C:'Pressurizing the cabin', D:'Operating the weather radar exclusively'}, answer:'A' },

// ── Hydraulics ──
{ id:'gtk-hyd-01', chapter:'hydraulics', question:'How many independent hydraulic systems does the 777 have?',
  options:{A:'Three — left, center, and right', B:'One', C:'Two — left and right only', D:'Five'}, answer:'A' },
{ id:'gtk-hyd-02', chapter:'hydraulics', question:'What is the rated operating pressure of the 777\'s hydraulic systems?',
  options:{A:'Approximately 3,000 psi', B:'Approximately 500 psi', C:'Approximately 15,000 psi', D:'Approximately 100 psi'}, answer:'A' },
{ id:'gtk-hyd-03', chapter:'hydraulics', question:'The left and right hydraulic systems are each normally pressurized primarily by:',
  options:{A:'An engine-driven pump, backed up by an electric motor pump', B:'A single battery', C:'The APU only', D:'Wind power from a RAT, at all times'}, answer:'A' },
{ id:'gtk-hyd-04', chapter:'hydraulics', question:'Which of these is NOT typically powered by the hydraulic systems on the 777?',
  options:{A:'Cabin lighting', B:'Flight controls', C:'Landing gear retraction/extension', D:'Wheel brakes'}, answer:'A' },
{ id:'gtk-hyd-05', chapter:'hydraulics', question:'If normal hydraulic power for gear extension were lost, what backup method typically exists on large transport aircraft like the 777?',
  options:{A:'An alternate (gravity/free-fall) gear extension system', B:'Jettisoning the landing gear entirely', C:'Using engine thrust to push the gear down', D:'There is no backup; the flight must divert immediately'}, answer:'A' },
{ id:'gtk-hyd-06', chapter:'hydraulics', question:'Why does Boeing design the 777 with three separate, physically distinct hydraulic systems rather than one large system?',
  options:{A:'To preserve redundancy — a leak or failure in one system should not take down the others', B:'To reduce the weight of the aircraft', C:'Because a single system cannot be certified', D:'Purely for maintenance convenience, with no safety benefit'}, answer:'A' },
{ id:'gtk-hyd-07', chapter:'hydraulics', question:'In an emergency where engine-driven hydraulic pumps on both sides are lost, which additional source can supply the center system?',
  options:{A:'The RAT-driven hydraulic pump', B:'The weather radar', C:'The passenger oxygen system', D:'The galley power bus'}, answer:'A' },
{ id:'gtk-hyd-08', chapter:'hydraulics', question:'Carbon brakes on the 777 are actuated using:',
  options:{A:'Hydraulic pressure, with anti-skid protection', B:'Compressed air only', C:'A purely mechanical cable system', D:'Electric motors with no hydraulic involvement'}, answer:'A' },

// ── Flight Controls ──
{ id:'gtk-fc-01', chapter:'flightctl', question:'The 777 was significant in Boeing\'s history as:',
  options:{A:'Boeing\'s first commercial fly-by-wire airplane', B:'Boeing\'s first turboprop', C:'Boeing\'s first single-engine jet', D:'Boeing\'s first airplane without hydraulics'}, answer:'A' },
{ id:'gtk-fc-02', chapter:'flightctl', question:'Despite being fly-by-wire, the 777 flight deck retains:',
  options:{A:'Conventional control columns, control wheels, and rudder pedals (not sidesticks)', B:'A single joystick shared by both pilots', C:'No manual flight controls at all', D:'Sidesticks like an Airbus'}, answer:'A' },
{ id:'gtk-fc-03', chapter:'flightctl', question:'A "flaperon" on the 777 is best described as:',
  options:{A:'A control surface, inboard of the aileron, that works with the flaps at low speed', B:'A type of weather radar antenna', C:'A backup fuel pump', D:'A cockpit display mode'}, answer:'A' },
{ id:'gtk-fc-04', chapter:'flightctl', question:'In Boeing\'s fly-by-wire philosophy (as opposed to some other manufacturers\'), pilot control inputs are generally:',
  options:{A:'Still felt through a conventional-feeling yoke, even though signals are sent electrically', B:'Never connected to any feel system', C:'Transmitted only by voice command', D:'Mechanically linked directly to control surfaces with no computers involved'}, answer:'A' },
{ id:'gtk-fc-05', chapter:'flightctl', question:'Which of these is a primary flight control surface used for roll control on the 777?',
  options:{A:'Ailerons', B:'Rudder', C:'Elevator', D:'Landing gear doors'}, answer:'A' },
{ id:'gtk-fc-06', chapter:'flightctl', question:'Spoilers on the 777 are used for purposes that include:',
  options:{A:'Roll control assistance and speed brake/lift-dump functions on the ground', B:'Generating electrical power', C:'Cooling the APU', D:'Pressurizing the fuel tanks'}, answer:'A' },
{ id:'gtk-fc-07', chapter:'flightctl', question:'The horizontal stabilizer on the 777 is:',
  options:{A:'A trimmable surface, adjustable to help balance the airplane in pitch', B:'A fixed surface that never moves', C:'Only used during pushback', D:'Part of the fuel system'}, answer:'A' },
{ id:'gtk-fc-08', chapter:'flightctl', question:'Flight control computers on a fly-by-wire airplane like the 777 are typically designed with:',
  options:{A:'Multiple redundant computers so no single computer failure disables flight control', B:'Only one computer, with no backup', C:'No electronic monitoring of pilot inputs', D:'A single point of failure by design'}, answer:'A' },

// ── Fuel System ──
{ id:'gtk-fuel-01', chapter:'fuel', question:'Where is fuel normally stored on the 777?',
  options:{A:'In the left wing tank, right wing tank, and a center tank', B:'Only in the tail cone', C:'Only in the nose', D:'Fuel is not stored on board; it is pumped continuously from the ground'}, answer:'A' },
{ id:'gtk-fuel-02', chapter:'fuel', question:'A crossfeed valve on the 777 fuel system allows:',
  options:{A:'Fuel to be shared between the left and right wing tanks', B:'Fuel to be dumped overboard instantly from any tank', C:'The APU to run on hydraulic fluid', D:'The center tank to feed the cabin pressurization system'}, answer:'A' },
{ id:'gtk-fuel-03', chapter:'fuel', question:'A fuel jettison system on a long-range airplane like the 777 exists mainly to:',
  options:{A:'Allow fuel to be dumped quickly to reduce weight for an earlier-than-planned landing', B:'Refuel the airplane in flight', C:'Transfer fuel to another aircraft', D:'Cool the engines in cruise'}, answer:'A' },
{ id:'gtk-fuel-04', chapter:'fuel', question:'Engine fuel feed is normally arranged so that:',
  options:{A:'Each engine is fed from its own wing tank, with crossfeed available if needed', B:'Both engines always draw only from the center tank', C:'Fuel feed is random and uncontrolled', D:'Only the APU tank feeds the engines'}, answer:'A' },
{ id:'gtk-fuel-05', chapter:'fuel', question:'Electric fuel boost pumps inside the fuel tanks exist mainly to provide:',
  options:{A:'Reliable fuel pressure to the engines, with redundancy if one pump fails', B:'Cabin air conditioning', C:'Hydraulic pressure for the landing gear', D:'Electrical power for the autopilot'}, answer:'A' },
{ id:'gtk-fuel-06', chapter:'fuel', question:'Modern airliner fuel quantity indicating systems, including on the 777, typically measure fuel by:',
  options:{A:'Mass, using capacitance-type probes compensated for fuel density', B:'Counting individual fuel molecules', C:'Weighing the entire aircraft before and after each flight', D:'Visual dipstick checks only, with no electronic system'}, answer:'A' },
{ id:'gtk-fuel-07', chapter:'fuel', question:'Why does the fuel jettison system limit how much fuel can be dumped from the wing tanks?',
  options:{A:'To ensure a minimum safe amount of fuel always remains available to the engines', B:'Because the jettison nozzles physically cannot open fully', C:'There is no such limit', D:'To comply with noise regulations'}, answer:'A' },
{ id:'gtk-fuel-08', chapter:'fuel', question:'Center tank fuel on the 777 is generally handled by:',
  options:{A:'Its own pumps, feeding into the system separately from direct wing-to-wing crossfeed', B:'Gravity alone, with no pumps at all', C:'The same pumps used for hydraulic fluid', D:'Manual transfer by the cabin crew'}, answer:'A' },

// ── Landing Gear ──
{ id:'gtk-gear-01', chapter:'gear', question:'How many wheels does each 777 main landing gear bogie have?',
  options:{A:'Six', B:'Two', C:'Four', D:'Eight'}, answer:'A' },
{ id:'gtk-gear-02', chapter:'gear', question:'How many wheels does the 777 nose gear have?',
  options:{A:'Two', B:'One', C:'Four', D:'Six'}, answer:'A' },
{ id:'gtk-gear-03', chapter:'gear', question:'Counting both main gear bogies and the nose gear, how many wheels does a 777 have in total?',
  options:{A:'14', B:'6', C:'10', D:'20'}, answer:'A' },
{ id:'gtk-gear-04', chapter:'gear', question:'Why does the 777 use a six-wheel main gear bogie instead of a simpler two- or four-wheel design?',
  options:{A:'To spread the airplane\'s weight over more tires, reducing load per tire and pavement stress', B:'To make the airplane lighter overall', C:'Purely for appearance', D:'Because four wheels could not physically fit under the wing'}, answer:'A' },
{ id:'gtk-gear-05', chapter:'gear', question:'If hydraulic pressure for gear extension is lost, the landing gear can typically still be extended by:',
  options:{A:'Releasing uplocks so gear free-falls and locks down under gravity', B:'Reversing engine thrust', C:'Using the fuel jettison system', D:'There is no alternate extension method'}, answer:'A' },
{ id:'gtk-gear-06', chapter:'gear', question:'What type of brakes does the 777 use?',
  options:{A:'Carbon brakes with anti-skid protection', B:'Simple drum brakes with no anti-skid', C:'Water-cooled brakes', D:'The 777 has no wheel brakes; reverse thrust alone stops it'}, answer:'A' },
{ id:'gtk-gear-07', chapter:'gear', question:'After the landing gear retracts, the gear doors:',
  options:{A:'Close to reduce aerodynamic drag', B:'Stay open permanently', C:'Are jettisoned overboard', D:'Serve as additional fuel tanks'}, answer:'A' },
{ id:'gtk-gear-08', chapter:'gear', question:'On some 777 variants, the aft axle of each main gear bogie can:',
  options:{A:'Steer, to help tighten the turning radius on the ground', B:'Retract independently mid-flight', C:'Generate electrical power', D:'Rotate 360 degrees continuously'}, answer:'A' }
];
