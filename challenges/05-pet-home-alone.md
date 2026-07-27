# Challenge #5 — Pet Home Alone Companion

| | |
|---|---|
| **Challenge ID** | `CH-05` |
| **Primary domains** | Activity sensing · Mechanism design · Actuation · Remote telemetry |
| **Difficulty** | ●●●○○ — Moderate electrically, but the only prompt with a real **mechanism** to design. |
| **Revealed** | T+0h |

---

## The Problem

A dog left alone for a full workday is the default condition for most working pet owners. For
animals with separation anxiety the consequences are concrete: destructive behavior, sustained
distress vocalization, house soiling, and self-injury. The owner has no visibility and no ability
to intervene, and the guilt is a genuine purchase driver — pet owners spend readily on this
category.

Existing products split into two unsatisfying halves. Cameras give you visibility and no ability
to act. Automatic treat dispensers act on a fixed schedule with no idea whether the animal needs
anything. Almost nothing closes the loop between *sensing the animal's state* and *doing something
useful about it*.

**Your mission:** monitor a pet's well-being while the owner is away, detect meaningful states,
intervene usefully, and report back.

---

## Target Users

**Primary:** Single-dog households where the owner works 8–10 hours away from home, dog aged 1–8,
with known or suspected mild separation anxiety. High willingness to pay; strong emotional driver.

**Secondary:** Multi-pet households (which breaks per-animal attribution — note it if you scope
to one pet); cat owners, whose activity signatures differ substantially; foster and rescue
situations monitoring a new animal's adjustment.

**Constraint that follows from this:** **the user cannot be present when the device operates.**
It must work unattended for a full workday, and the animal is an adversarial user — it will chew,
knock over, scratch, and attempt to defeat your enclosure to get at the food inside. Nothing else
in this challenge set has a user actively trying to break the hardware.

---

## Functional Requirements

### Must
- Detect at least two **distinct, meaningful** pet states — e.g. activity vs. prolonged inactivity,
  distress vs. calm, present vs. absent from the room.
- Provide at least one **intervention** (treat, toy activation, sound, owner's recorded voice)
  triggered by detected state rather than only by a clock.
- Report status to the owner remotely with enough context to be reassuring rather than alarming.
- Be **safe for unsupervised animal contact**: no accessible small parts, no chewable cable runs,
  no pinch points that can catch a paw, tongue, or tail.
- **Fail safe.** On power loss or fault, document what happens — critically, whether the food
  reservoir can dump its entire contents.

### Should
- Distinguish the pet from a human, a robot vacuum, or another pet.
- Rate-limit interventions so the device cannot overfeed.
- Log a timeline the owner can review after the fact.

### Out of scope
- Veterinary diagnosis or health claims of any kind.
- Litter, waste, or elimination handling.
- Physical restraint or aversive correction of any kind. **Interventions must be positive only.**

---

## The Mechanism Requirement

This is the one prompt where **mechanical design is load-bearing**, and it is deliberately
weighted that way. If your intervention dispenses anything, you must actually design the
mechanism, not gesture at it:

- **Portion control** — one treat per actuation, not a variable handful. Specify the geometry
  that achieves this.
- **Jam resistance** — irregular kibble bridges and jams. What is your anti-bridging feature?
- **Reservoir capacity** — sized to your intervention rate over a full workday.
- **Actuator sizing** — the torque or force required, with your basis for the number.
- **Chew and tamper resistance** — an 80 lb dog will apply meaningful force to get at food.
- **Cleanability** — food-contact surfaces need to be serviceable. Pet owners care about this.

An auger, a rotating drum with a pocket, a gated hopper, and an escapement are all valid.
Pick one and dimension it. "Servo opens a flap" without portion analysis will not score.

---

## Failure Modes You Must Address

| Failure | Why it matters | What we want to see |
|---|---|---|
| **Overfeeding / reservoir dump** | Actual health risk (bloat, pancreatitis) and the highest-consequence failure in this challenge. | Hard mechanical limit, not just a firmware counter. |
| **Jam mid-dispense** | Device stops working silently for the whole day. | Detection and recovery, or a documented safe stall. |
| **Mistaking one pet for another** | Wrong animal fed; the anxious one gets nothing. | Attribution method or an explicit single-pet scope. |
| **Distress misclassification** | Owner alarmed by nothing, or real distress missed entirely. | Which direction you biased, and why. |
| **Pet defeats the enclosure** | Food access, or ingestion of a broken part. | Materials, fastening, and what happens when it is chewed. |
| **Connectivity loss** | Owner gets silence and assumes the worst. | Local autonomy — does the device keep working with no network? |
| **Power loss with food loaded** | Gravity plus an open gate equals the whole reservoir on the floor. | Mechanism default state when unpowered. |

---

## Decisions Left Entirely to You

Sensing modality · state classification approach · intervention type · dispensing mechanism and
its geometry · connectivity and telemetry · power architecture · enclosure materials and
construction · BOM.

---

## Approaches Worth Considering

**Sensing:** PIR or mmWave for room-level activity · accelerometer on a collar (direct and
accurate, but now you have a second powered device to design) · load cell under a bed or bowl
(elegant — presence, weight, and restlessness from one sensor) · acoustic classification for
barking and whining (the most direct distress signal available, and separating a bark from a
doorbell is genuinely interesting signal work) · floor vibration for pacing detection ·
camera plus on-device vision (accurate, expensive, and a privacy question even in your own home).

**Intervention:** treat dispense · toy or ball actuation · owner's recorded voice on trigger
(cheapest and often most effective — worth arguing for) · calming audio · scent release.

**A note on scoring strategy:** a simple, well-executed intervention with a rigorously designed
mechanism will beat an ambitious one that is hand-waved. Depth beats breadth here.

---

## What Judges Will Look For

- **Does It Work (25)** — State detection logic **and** the mechanism. Both must be real. This is
  the prompt where a dimensioned mechanical drawing carries the most weight.
- **Creativity (20)** — Closing the sense→intervene→verify loop is the interesting part. Does your
  device check whether the intervention *helped*?
- **Sellable Product (20)** — This category has high willingness to pay and established
  competitors in the \$100–250 range. Where do you sit and why?
- **Problem Fit (15)** — Does it address separation anxiety, or is it a treat dispenser with a
  sensor bolted on?
- **Who It's For (10)** — Note that your buyer and your user are different species with
  different needs. Address both.
- **The Why (10)** — Why does a camera plus a scheduled dispenser not already solve this?

---

## Stretch Goals

- Closed-loop verification: measure whether the intervention actually reduced distress.
- Learn the individual animal's baseline and flag deviations from it.
- Owner-in-the-loop: push a notification offering the intervention, let the owner approve it.

---

*Deliverable requirements: see [CONTRIBUTING.md](../CONTRIBUTING.md). Judging: see
[admin/scoring-sheet.md](../admin/scoring-sheet.md).*
