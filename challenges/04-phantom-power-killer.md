# Challenge #4 — Phantom Power Killer

| | |
|---|---|
| **Challenge ID** | `CH-04` |
| **Primary domains** | AC power measurement · Switching · Occupancy sensing · Load classification |
| **Difficulty** | ●●●●● — Hardest of the five. Mains-adjacent, and the payback math is brutal. |
| **Revealed** | T+0h |

---

## The Problem

Standby power — "vampire draw" — is the energy consumed by devices that are plugged in and
nominally off. Studies of residential loads put idle consumption at a meaningful single-digit to
low-double-digit percentage of household electricity, spread across dozens of small always-on
draws: set-top boxes, chargers with no load attached, monitors in standby, printers, soundbars,
game consoles in fast-resume mode.

Switched power strips already exist and cost almost nothing. They fail for a behavioral reason:
nobody switches them. The device that works is the one requiring no habit change.

**Your mission:** cut power to genuinely idle devices based on room occupancy or load state,
without ever interrupting something that is actually in use.

---

## Target Users

**Primary:** Cost- and energy-conscious homeowners aged 30–55 in a home office or media room —
somewhere with a cluster of six-plus devices, most idle most of the time. They will do a small
amount of setup work once if the payoff is automatic afterward.

**Secondary:** Small office managers with many identical desk setups; landlords paying utilities
on a shared meter.

**Constraint that follows from this:** this user tolerates a *setup* burden but zero *ongoing*
burden, and has near-zero tolerance for the device cutting power to something mid-use. One
interrupted download or one lost game save and it comes off the wall permanently.

---

## Functional Requirements

### Must
- Detect that a connected load is **idle rather than off or active** — this is the hard part, since
  many loads draw single-digit watts in both standby and light use.
- Detect **room occupancy** or another gating signal before cutting anything.
- Cut power **only** to loads confirmed idle. Never interrupt an active load.
- Restore power **automatically** on occupancy return or user request, and restore it fast enough
  that the user does not perceive a fault.
- Provide a **manual override** and a documented **always-on** path for loads that must never be cut.
- Consume less power itself than it saves. **Show this arithmetic** — a device that idles at 2 W to
  save 3 W is not a product.

### Should
- Classify what kind of device is attached from its power signature.
- Learn per-outlet usage patterns and adapt.
- Report savings to the user in a way that sustains trust.

### Out of scope
- Panel-level or whole-home monitoring. Outlet or strip level only.
- Solar, storage, or generation.
- Any load over 15 A, and any hardwired fixture.

---

## ⚠️ Safety and Regulatory — Read Before Designing

This challenge puts you on the line side of a mains circuit, which makes it the only prompt in
the set with real regulatory weight. Take this seriously in your documentation; judges will.

- **You are not expected to build or energize this.** Simulation and documented design only.
- Any switching element carrying mains must be specified with correct **voltage and current
  ratings, plus derating** — a relay rated 10 A resistive is not a 10 A inductive-load relay,
  and inrush on a switching supply can be many times steady-state current.
- **Isolation is mandatory** between the mains side and any low-voltage logic or user-touchable
  surface. Name your isolation method (optocoupler, transformer, isolated supply) and the
  creepage/clearance you are designing to.
- Relevant standards to cite: **UL 498** (attachment plugs and receptacles), **UL 1449** if you
  include surge protection, **IEC 60950 / 62368-1** for creepage and clearance guidance,
  and **NEC Article 406** for receptacle requirements.
- Zero-cross switching, snubbing, and arc considerations matter for relay life on inductive loads.
  Mention them.

A submission that says "relay on GPIO 4" and stops there will lose most of the Does-It-Work
category. A submission that specifies the relay part number, the drive circuit, the isolation
barrier, and the standard it is designed against will win it.

---

## Failure Modes You Must Address

| Failure | Why it matters | What we want to see |
|---|---|---|
| **Cutting an active load** | Lost work, corrupted firmware update, dead game save. Single worst outcome; product-killing. | Your confidence threshold and the safety margin on it. |
| **Standby indistinguishable from light use** | A soundbar at 3 W idle and 4 W quiet playback. The core technical difficulty. | Discrimination method and where it breaks down. |
| **Occupancy false-negative while present** | User sits still at a desk; PIR sees nothing; power cuts under them. | Why your occupancy sensing sees a motionless person. |
| **Inrush on restore** | Six devices repower simultaneously; nuisance breaker trip or relay welding. | Staggered restore or inrush limiting. |
| **Device's own consumption** | Net-negative savings. | Full power budget with a payback-period calculation. |
| **Relay fails closed / welded contacts** | Silent loss of function, or worse. | Failure mode of your specific switching element. |

---

## Decisions Left Entirely to You

Power measurement method · idle-detection algorithm and thresholds · switching element ·
occupancy sensing · number of independently switched outlets · isolation architecture ·
user interface · BOM.

---

## Approaches Worth Considering

**Power measurement:** dedicated energy-metering IC (accurate, handles power factor properly,
higher part cost) · current transformer plus ADC (cheap, needs calibration and burden resistor
sizing) · hall-effect current sensor (isolated by nature, less sensitive at low currents — and low
currents are exactly your signal) · shunt resistor plus isolated amplifier.

**A note on the hard part:** distinguishing standby from light use on raw RMS current alone is
often not possible — the magnitudes overlap. **Power factor**, harmonic content, and the *temporal
pattern* of draw carry much more information than magnitude. A design that recognizes this and
measures something richer than RMS amps is doing real engineering.

**Switching:** mechanical relay (true isolation when open, finite cycle life, audible click) ·
latching relay (near-zero holding power — worth serious consideration given your own power
budget) · solid-state relay or TRIAC (silent, long life, leakage current when off and needs
heatsinking).

**Occupancy:** mmWave radar (sees a still person at a desk — a real advantage here) · PIR
(cheap, fails on stillness) · desk-device activity as an occupancy proxy · BLE presence from a
phone or wearable.

---

## What Judges Will Look For

- **Does It Work (25)** — Two things: the **idle-vs-active discrimination** with real thresholds,
  and the **safety-rated switching design**. Weakest submissions hand-wave both.
- **Creativity (20)** — Load classification from power signature, or using something other than
  RMS current as the discriminator.
- **Sellable Product (20)** — Compute the **payback period** honestly. Smart plugs cost \$10–25.
  If your device costs \$40 and saves \$15/year, say so and argue the case anyway.
- **Problem Fit (15)** — Does it beat a \$7 switched power strip? The strip's failure is
  behavioral, so your advantage must be behavioral too. Make that argument.
- **Who It's For (10)** — Whose electricity bill, and is the saving material to them?
- **The Why (10)** — Why now, and why has this category not already won?

---

## Stretch Goals

- Per-outlet device fingerprinting with automatic policy assignment.
- Scheduled plus occupancy-based hybrid control.
- Aggregate reporting across multiple units.

---

*Deliverable requirements: see [CONTRIBUTING.md](../CONTRIBUTING.md). Judging: see
[admin/scoring-sheet.md](../admin/scoring-sheet.md).*
