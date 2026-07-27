# Reference Submission — "Was It Left Open?" Garage Door Monitor

> ### 📖 Read this first
>
> This is a **complete worked submission**, included to show the quality bar. Unlike
> [`example-participant/`](../example-participant/) — which is a blank template of headings —
> every section here is filled in with real components, real arithmetic, and real conclusions.
>
> **It is deliberately written for a challenge that is NOT in the assignment pool.** A worked
> example of one of the [five real briefs](../../challenges/) would hand the answer to whoever
> draws it. So this solves an adjacent problem in the same domain: same skills demanded, zero
> overlap with anything you might be assigned.
>
> The validator and the tally workflow both skip this folder.

| Field | Value |
|-------|-------|
| **Challenge** | Off-pool reference — "The Garage Door Left Open Problem" |
| **Twist Applied** | `P1` Battery Only *(simulated, for demonstration)* |
| **Author** | Reference material |

---

## The One-Sentence Version

A magnetless, alignment-free garage door monitor that detects door position from the **tilt of
the door panel itself**, notifies you when the door has been open longer than you intended, and
runs 769 days on a single 18650 cell — in a temperate climate. Less in Phoenix, and
[the budget says so](deliverables/03-electrical-design.md#the-finding-worth-stating-plainly).

---

## Why This Design

The obvious solution is a reed switch and a magnet — cheap, reliable, and what every existing
product uses. It also has a genuine weakness: it needs two parts mounted in alignment on a moving
assembly, it drifts out of alignment as the door settles over years, and it tells you only about
one point on the track.

This design puts a **3-axis accelerometer on the top door panel** instead. On a sectional garage
door, that panel rotates roughly 90° between closed (vertical) and open (horizontal). Gravity is
the reference, so there is nothing to align, one part to mount, and no second component to fall off.

That single decision drives everything else in this submission.

---

## Key Design Decisions

| Decision | Choice | Why |
|---|---|---|
| **Sensing** | LIS3DH 3-axis accelerometer, tilt from gravity vector | Single part, no alignment, no magnet. Also detects *motion*, which a reed switch cannot. |
| **Position logic** | Angle thresholds with 15° hysteresis | Sectional door panel rotates ~90°. Hysteresis prevents chatter mid-travel. |
| **MCU** | ESP32-C3 | Integrated WiFi, 5 µA deep sleep, hardware interrupt wake from the accelerometer. |
| **Wake strategy** | Accelerometer interrupt, not polling | Radio and CPU stay asleep until the door physically moves. This is what makes the power budget work. |
| **Power** | 1× 18650 Li-ion, 2200 mAh usable | Two-year target with no maintenance. See [the budget](deliverables/03-electrical-design.md#power-budget). |
| **Notification** | WiFi push to phone, local buzzer as fallback | Buyer is phone-native. Buzzer covers the WiFi-down case. |
| **Enclosure** | Snap-fit PETG, zip-tie mount | No adhesive on a vibrating panel, no drilling into a door. |

---

## The Honest Objection

**"A reed switch and an ESP32 costs \$8 and works fine. Why does this exist?"**

Partly it does not — for a new installation, the reed switch is the right engineering answer and
this submission says so plainly in
[the problem statement](deliverables/01-problem-statement.md#why-not-just-use-a-reed-switch).

Where this design wins is retrofit onto doors where the track geometry makes reed alignment
awkward, and in giving *motion* data the reed switch cannot — distinguishing "open" from "opening",
which is what lets it avoid notifying you while you are standing there watching it open.

That is a narrower claim than "better product," and it is the correct size of claim. Judges score
this kind of honesty higher than an unsupported advantage — see
[criterion 6](../../admin/scoring-sheet.md#6-the-why--10).

---

## Deliverables

| # | File | What it demonstrates |
|---|------|---------------------|
| 1 | [Problem Statement](deliverables/01-problem-statement.md) | User research, gap analysis, honest competitive comparison |
| 2 | [System Architecture](deliverables/02-system-architecture.md) | Block diagram, signal flow, power domains |
| 3 | [Electrical Design](deliverables/03-electrical-design.md) | Priced BOM, full power budget, protection, derating |
| 4 | [Mechanical Design](deliverables/04-mechanical-design.md) | Enclosure, mounting, vibration and thermal reasoning |
| 5 | [Firmware Logic](deliverables/05-firmware-logic.md) | Complete state machine including error and reset paths |
| 6 | [Simulation & Validation](deliverables/06-simulation-validation.md) | Tilt-math verification, power model, threshold derivation |
| 7 | [Pitch Deck](deliverables/07-pitch-deck.md) | 3-minute narrative with the commercial case |

---

## What Makes This Score Well

Mapped to the [six criteria](../../admin/scoring-sheet.md), so you can see what each one is
actually asking for:

- **Does It Work (25)** — the tilt math is derived and checked numerically, the power budget adds
  up to a stated battery life, and the state machine has explicit error and reset paths.
- **Creativity (20)** — tilt instead of a magnet is a real departure from the obvious answer,
  and it is defended rather than just asserted as clever.
- **Sellable Product (20)** — priced BOM, stated retail price, named competitors, and an honest
  statement of where it loses.
- **Problem Fit (15)** — every Must requirement is traced to where it is satisfied.
- **Who It's For (10)** — the 15-minute grace period exists *because* of a specific user behavior,
  not because it seemed like a nice number.
- **The Why (10)** — the strongest objection is stated in the author's own words and answered.

**The single highest-value habit visible here: every number is derived, not asserted.**
Not "low power" but 10.16 µA sleep. Not "long battery life" but 769 days, from a budget you can
re-add yourself. That is the difference between the 17–21 band and the 22–25 band on Does It Work.

**The second-highest: state where your design loses.** This one misses its own battery
requirement in a hot climate, and says so in the deliverable rather than quoting the flattering
number. Judges score that higher than a clean claim they cannot verify.
