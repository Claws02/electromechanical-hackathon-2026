# Challenge #3 — Nighttime Bathroom Safety

| | |
|---|---|
| **Challenge ID** | `CH-03` |
| **Primary domains** | Ultra-low-power design · Presence detection · Human-centered lighting · Optics |
| **Difficulty** | ●●●●○ — The power budget and the human factors fight each other. |
| **Revealed** | T+0h |

---

## The Problem

Falls are the leading cause of injury-related death among adults 65 and older, and the
nighttime bathroom trip is a notorious setting: the user is drowsy, possibly on medication or
recently upright from lying down, navigating a hard-surfaced room in the dark. The two available
options are both bad. Navigate in darkness and risk a fall. Or hit the main light — which at
full brightness suppresses melatonin, wrecks dark adaptation for several minutes, and makes
returning to sleep materially harder.

Commodity motion-activated nightlights exist and are largely unsatisfying: they trigger on the
wrong things, they are too bright or too dim with no middle ground, and the good ones need wiring.

**Your mission:** design a low-power device that detects nighttime entry into a room and provides
lighting that is genuinely safe to walk by while minimizing sleep disruption.

---

## Target Users

**Primary:** Adults 65+, often with reduced night vision, slower dark adaptation, and possibly
a mobility aid. They take this trip one to three times a night, every night. Their adult
children may be the buyer.

**Secondary:** Pregnant people in the third trimester; parents of small children doing night
check-ins; anyone sharing a bedroom with a partner whose sleep must not be disturbed.

**Constraint that follows from this:** the user is at their least capable when they interact with
this device — half-asleep, in the dark, possibly without glasses. Any interaction more complex
than "walk into the room" is likely to fail. Barefoot-in-the-dark is your design context.

---

## Functional Requirements

### Must
- Detect room entry reliably enough that the user **never has to wait in the dark** for it.
- Only operate during **night hours** — daytime activation is wasted energy and an annoyance.
- Provide illumination sufficient for safe footing on a hard floor.
- Choose a spectrum and intensity that **minimizes melatonin suppression and preserves dark
  adaptation** — justify both numbers.
- Turn off automatically after exit, with no user action.
- Fail to a **known state**: document what happens on power loss and whether the user is left
  in darkness.

### Should
- Ramp rather than snap on, to avoid startling a drowsy user and to protect dark adaptation.
- Distinguish a person from a pet.
- Install with no wiring and no wall damage.

### Out of scope
- Fall detection or emergency alerting. That is a different product; do not scope-creep into it.
- Replacing the room's main light fixture.
- Anything the user must remember to switch on.

---

## Failure Modes You Must Address

| Failure | Why it matters | What we want to see |
|---|---|---|
| **Late trigger** | User is already three steps into a dark room before light arrives. Directly causes the fall you are preventing. | Detection latency budget, end to end. |
| **Failure to detect a slow-moving person** | PIR keys on motion rate; an elderly user shuffling slowly may not register. | Why your sensor sees slow movement. |
| **Too bright** | Wrecks sleep. The user stops using it or goes back to the main light. | Your lux target at floor level and its basis. |
| **Too dim** | Does not prevent the fall. Fails silently and invisibly. | Same — defend the number in both directions. |
| **Dead battery** | Device is dark exactly when needed, and the user does not know until mid-trip. | Low-power warning that does not itself disturb sleep. |
| **Pet triggers all night** | Battery drains in days. | Discrimination strategy or an accepted limitation. |

---

## The Central Tension

This challenge is a genuine engineering conflict, and naming it is part of the work:

**Always-on sensing that responds instantly** wants a continuously powered, fast, sensitive
detector. **Multi-month battery life** wants everything asleep almost all the time. These are
opposed. Resolving it — a tiered wake scheme, a passive first-stage trigger, an honest choice to
use wall power and defend it — is the core of a strong submission.

Do not pretend the tension does not exist. Show the power budget arithmetic.

---

## Decisions Left Entirely to You

Sensor choice and wake architecture · light source, spectrum, and intensity · optics and
diffusion · night-hours determination · power source · mounting · BOM.

---

## Approaches Worth Considering

**Detection:** PIR (cheap, ubiquitous, weak on slow movement and thermally-similar rooms) ·
mmWave radar (sees stillness and slow motion, higher idle draw, needs tuning) · pressure mat at
the bedside (catches intent *before* entry — earliest possible trigger, but a trip hazard itself) ·
ToF / IR beam break at the doorway (precise, needs alignment) · bed-exit sensing under the mattress.

**Light:** amber or red-shifted LED (long-wavelength light suppresses melatonin far less than
blue-white, and preserves rod-mediated dark adaptation better) · floor-level wash versus
downward pool · indirect bounce off a wall or ceiling to eliminate glare from a drowsy user's
low viewing angle. Glare control matters as much as total output here.

**Night determination:** RTC (deterministic, needs setting) · ambient light sensor with a long
averaging window (self-configuring, confusable by a left-on hall light) · learned schedule.

---

## What Judges Will Look For

- **Does It Work (25)** — Two numbers carry this category: your **detection latency** and your
  **power budget with battery life**. Show the arithmetic, including sleep-current assumptions.
- **Creativity (20)** — The tiered-wake or pre-entry-detection ideas are where originality lives.
- **Sellable Product (20)** — Plug-in motion nightlights retail for under \$15. If yours costs
  more, what justifies it, and who pays?
- **Problem Fit (15)** — Does this prevent falls, or is it a nightlight with extra steps?
- **Who It's For (10)** — Design decisions traceable to reduced night vision and slow dark
  adaptation, not just "for seniors" as a label.
- **The Why (10)** — Why does the \$8 hardware-store nightlight not already solve this?
  Answer honestly; this is the strongest objection to the product.

---

## Stretch Goals

- Path lighting: a second unit that lights the route, sequenced with the first.
- Adaptive brightness that tracks the user's dark adaptation over the trip.
- Passively harvested power so the device never needs a battery change.

---

*Deliverable requirements: see [CONTRIBUTING.md](../CONTRIBUTING.md). Judging: see
[admin/scoring-sheet.md](../admin/scoring-sheet.md).*
