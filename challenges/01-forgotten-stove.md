# Challenge #1 — The Forgotten Stove Problem

| | |
|---|---|
| **Challenge ID** | `CH-01` |
| **Primary domains** | Thermal sensing · Presence detection · Actuation · Fail-safe logic |
| **Difficulty** | ●●●○○ — Moderate. Sensing is easy; *safe* intervention is hard. |
| **Revealed** | T+0h |

---

## The Problem

Cooking is the leading cause of home structure fires in the United States, and the dominant
factor is not equipment failure — it is unattended cooking. Someone starts a pan, walks out
to answer the door or check on a kid, gets pulled into something else, and forgets.

The people most at risk are the ones least served by existing solutions. Smart stoves exist,
but they require replacing a major appliance. Stove-top fire suppression canisters exist, but
they activate *after* there is already a fire. Smoke alarms are, by definition, a late warning.

**Your mission:** design a retrofittable device that detects when a stove is on and unattended,
then intervenes early enough to prevent a fire — without modifying or replacing the appliance.

---

## Target Users

**Primary:** Adults aged 70+ living independently, with mild cognitive decline or memory
issues, who cook for themselves daily and want to keep doing so. Their adult children are
often the ones who would buy and install this.

**Secondary:** Households with young children where the cook is routinely interrupted; people
with ADHD who task-switch away from the kitchen; anyone in a rental who cannot modify the
appliance.

**Constraint that follows from this:** the primary user may not own a smartphone, may not
reliably hear a quiet chirp, and will not tolerate a device that cries wolf. If your design
depends on an app as the main interaction, you have designed for the buyer and not the user.
Say so explicitly if that is a deliberate choice.

---

## Functional Requirements

### Must
- Detect that the stove is **actively heating** — not merely that the kitchen is warm.
- Detect that the user has **left the cooking area** or is otherwise not attending.
- **Escalate** through at least two stages before any drastic action (e.g. local alert → louder
  alert → intervention).
- Allow the user to **acknowledge or dismiss** an alert intentionally, and reset cleanly.
- Require **zero permanent modification** to the stove or its wiring.
- Define and document a **safe state on power loss**.

### Should
- Distinguish a deliberate long cook (simmering stock, slow reduction) from an abandoned pan.
- Function on both gas and electric ranges, or explicitly scope to one and justify it.
- Install in under five minutes by a non-technical person.

### Out of scope
- Suppressing an existing fire. You are preventing ignition, not fighting flame.
- Detecting oven-interior conditions. Cooktop only.
- Anything requiring an electrician or a permit.

---

## Failure Modes You Must Address

Treat these as first-class design inputs, not an appendix. This is the section that separates
a demo from a product.

| Failure | Why it matters | What we want to see |
|---|---|---|
| **False positive** | Alarm fires while the user is standing right there. Two of these and the device gets unplugged forever. | Your presence-detection confidence strategy and hysteresis. |
| **False negative** | Stove left on, device says nothing. This is the failure that burns the house down. | Which direction you biased, and why. |
| **Power loss mid-alert** | Device dies at the worst moment. | Defined safe state; does the stove stay powered or not? |
| **Sensor occlusion / drift** | Steam, grease film, a pot moved in front of the sensor. | Self-check or degradation behavior. |
| **User defeats the device** | Annoyed user tapes over the buzzer. | Why your escalation is tolerable enough not to be defeated. |

> ⚠️ **Safety note — read this.** If your intervention involves cutting mains power to an
> electric range or actuating a gas valve, you are designing a safety-critical function on a
> high-current or combustible-fuel circuit. You are **not** expected to build this live. Document
> the failure mode, name the interlock you would need, and note the relevant standard
> (UL 858 for household electric ranges, ANSI Z21.1 for gas). Judges reward the design that
> knows what it would take to be legal; they do not reward a hand-wave past a 240 V 40 A circuit.

---

## Decisions Left Entirely to You

Sensing strategy · intervention method · MCU or no MCU · power source · connectivity ·
enclosure and mounting · escalation timing · BOM.

There is no single correct answer. Judges score your **reasoning** as heavily as your outcome —
a well-argued design that picks the "wrong" sensor beats an unjustified one that picks the right sensor.

---

## Sensing Approaches Worth Considering

Not a menu to pick from — a starting point to argue past. Any of these can be made to work,
and each has a real drawback you should name.

- **Thermal:** non-contact IR thermopile aimed at the burner surface; thermistor on a magnetic
  puck. Cheap and direct. Placement-sensitive and confusable by residual heat.
- **Current sensing:** clamp-on CT around the range cord or a plug-through module. Unambiguous
  on electric. Useless on gas, and a 240 V range plug is not a casual connector.
- **Environmental:** humidity and VOC rise from active cooking. Non-line-of-sight. Slow, and
  a boiling kettle looks like a cooking pan.
- **Presence:** PIR is cheap and immediately available but blind to a motionless person. mmWave
  radar sees stillness and breathing but costs more and needs tuning. Camera-based is accurate
  and a privacy nightmare in a kitchen.
- **Acoustic:** range hood fan noise as a cooking proxy. Clever, indirect, fragile.

---

## What Judges Will Look For

Scored against the [six criteria](../admin/scoring-sheet.md) — weighted toward whether it works
and whether it could sell:

- **Does It Work (25)** — Did you validate the sensing threshold in simulation? Is the state
  machine actually complete, including the reset and error paths?
- **Creativity (20)** — Is your sensing or intervention approach something other than "PIR plus
  a relay"? Surprising is good if it is defensible.
- **Sellable Product (20)** — Would an adult child buy this for their parent at your BOM cost
  plus margin? What is the retail price and who is the channel?
- **Problem Fit (15)** — Does this prevent the actual failure, or just detect it?
- **Who It's For (10)** — Have you designed for the 78-year-old, or for yourself?
- **The Why (10)** — Why does this need to exist given that smoke alarms are already mandatory?

---

## Stretch Goals

Only after all seven deliverables are complete.

- Learn the household's normal cooking duration and adapt the timeout.
- Multi-burner discrimination from a single sensing point.
- A path to the same hardware detecting a second hazard (running tap, space heater).

---

*Deliverable requirements: see [CONTRIBUTING.md](../CONTRIBUTING.md). Judging: see
[admin/scoring-sheet.md](../admin/scoring-sheet.md).*
