# 1. Problem Statement

## The Problem

An open garage door is the most common unlocked entry point on a suburban house. It exposes
tools, bicycles, a second vehicle, and — on most homes — an interior door to the house that
people treat as secure precisely because the garage is normally closed.

The failure is not mechanical. Garage door openers are reliable. The failure is **attention**:
the door is opened, the person is carrying something or talking to someone, and it stays open.
The homeowner discovers it hours later, or in the morning, or does not discover it at all.

The specific gap: **the homeowner has no feedback once they are out of sight of the door.** A
closed-loop system needs a signal back, and the existing product does not provide one.

## User Stories

- *As a homeowner leaving for work,* I want to know within minutes if I left the door open, so I
  can turn around before I am 20 miles away.
- *As someone in bed,* I want to know the door is open **before** I fall asleep, not at 3 AM.
- *As a renter,* I need this to install without drilling into anything or leaving adhesive residue.
- *As someone working in the garage all afternoon,* I want the door to stay open without being
  nagged about it every ten minutes.

That last story is the one that kills most implementations. A monitor that cannot tell
"deliberately open" from "accidentally open" gets muted within a week, and a muted monitor is
worth nothing.

## Target User

**Primary:** Suburban homeowner, 30–55, attached garage, smartphone-native, two or more people
in the household using the door daily. Buys their own home-automation hardware and will do a
15-minute install.

**Secondary:** Renters in a house with a garage (constrains mounting to non-destructive).
Multi-vehicle households where door usage is frequent and irregular.

**Where the design changed because of this user:**

| User fact | Design consequence |
|---|---|
| Works in the garage for hours at a stretch | 15-minute grace period before first alert, and a "hold open" acknowledgment that suppresses for 4 hours |
| May be a renter | Zip-tie mount, no adhesive, no drilling, fully reversible |
| Phone-native | Push notification is a legitimate primary interface, unlike an elderly-user product |
| Will not maintain it | Two-year minimum battery life is a hard requirement, not a nice-to-have |
| Door is a vibrating, temperature-cycling assembly | Enclosure and mount specified for vibration; components rated for garage temperature range |

## Existing Solutions

| Solution | Cost | Where it falls short |
|---|---|---|
| **Smart opener replacement** (Chamberlain myQ etc.) | \$150–300 + install | Replaces working hardware. Overkill if you only want to know the door's state. |
| **myQ add-on sensor** | \$30–50 | Tilt-based, and genuinely good. Locked to the myQ ecosystem and a subscription for some features. |
| **Reed switch + DIY ESP32** | \$8–15 | Cheapest and completely adequate. Requires alignment of two parts, and drifts as the door settles. |
| **Camera pointed at the door** | \$30–100 | Requires you to look. Not a closed loop, and a privacy question. |
| **Nothing** | \$0 | The status quo, and the actual competition. |

## Why Not Just Use a Reed Switch?

This deserves a direct answer, because it is the obvious objection.

**For a new install on a well-aligned door, the reed switch is the better engineering choice.**
It is cheaper, simpler, draws effectively zero current, and has no failure mode more complex than
the magnet falling off. Any submission claiming otherwise is overselling.

The tilt approach earns its place in three specific situations:

1. **Alignment-hostile geometry.** Reed switches need the magnet within a few millimetres of the
   sensor at one point in travel. On doors where the track has been shimmed, or the header is
   uneven, that alignment is finicky to establish and worse to maintain.
2. **Drift over time.** A sectional door settles. A reed gap that was 4 mm at install is 9 mm two
   years later, and the failure is silent — the door reads permanently open or permanently closed.
   Gravity does not drift.
3. **Motion versus position.** The accelerometer knows the door is *moving*, not just where it
   ended up. That is what allows the "do not notify while the user is standing there watching it
   open" behavior, and a reed switch fundamentally cannot provide it.

**Where this design loses:** higher part cost (~\$3 more), more firmware complexity, and a
calibration step at install that the reed switch does not need. That is a real trade, stated plainly.

## Requirements Traceability

| Must requirement | Satisfied in |
|---|---|
| Detect open/closed without modifying the opener | [02 — Architecture](02-system-architecture.md), tilt sensing |
| Distinguish deliberate from accidental | [05 — Firmware](05-firmware-logic.md), grace period and HOLD state |
| Notify remotely | [02 — Architecture](02-system-architecture.md), WiFi path |
| Work with no network | [05 — Firmware](05-firmware-logic.md), local buzzer fallback |
| Two-year unattended battery life | [03 — Electrical](03-electrical-design.md#power-budget) — 815 days calculated |
| Non-destructive mounting | [04 — Mechanical](04-mechanical-design.md) |
| Defined behavior on power loss | [05 — Firmware](05-firmware-logic.md#failure-behavior) |

## Out of Scope

- **Closing the door remotely.** That is an actuator on a device that can crush a person, with a
  completely different safety and regulatory burden (UL 325 entrapment protection). Sensing only.
- Detecting people or vehicles in the doorway.
- Integration with any specific home-automation platform beyond a generic webhook.

## Twist Applied — `P1` Battery Only

*(Demonstration: this reference assumes `P1` won the Hour-12 vote.)*

The design was already battery-first, so `P1` did not force an architecture change. What it did
force was **removing the planned USB-C trickle-charge option**, which had been the hedge against
the power budget being wrong.

Losing that hedge meant the budget had to actually be right, which is why
[deliverable 03](03-electrical-design.md#power-budget) carries a line item for cell
self-discharge — a term that turned out to **dominate the circuit's own consumption by roughly
2×**. Without the twist forcing the issue, that term would probably have been left out, and the
stated battery life would have been optimistic by a factor of three.

Documenting a twist that improved the design is worth more than pretending it was painless.
