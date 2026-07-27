# Challenge #2 — Laundry Guardian

| | |
|---|---|
| **Challenge ID** | `CH-02` |
| **Primary domains** | Vibration / accelerometer sensing · Signal processing · Notification · Low power |
| **Difficulty** | ●●○○○ — Approachable. The trap is that the easy version is *too* easy. |
| **Revealed** | T+0h |

---

## The Problem

A washer finishes. Nobody notices. Four hours later the load is sour and has to be rewashed —
wasting a full cycle of water, energy, and detergent, and roughly an hour of someone's evening.
In shared laundry (apartment buildings, dorms, laundromats) the failure compounds: a finished
machine sitting full blocks the only washer on the floor, and the next person either waits or
handles a stranger's wet clothes.

Modern connected appliances solve this. The installed base does not — the median washer in
service is many years old, has no network stack, and will not be replaced for a decade.

**Your mission:** detect cycle completion on an **unmodified** washer or dryer and get the user's
attention, without opening the appliance or touching its electrical system.

---

## Target Users

**Primary:** Renters and apartment dwellers aged 22–40 with a shared or in-unit machine they do
not own and cannot modify. They are phone-native, and a push notification is a legitimate primary
interface for this user.

**Secondary:** Large households running back-to-back loads where the bottleneck is the handoff
between washer and dryer; laundromat operators who would want a per-machine version.

**Constraint that follows from this:** the user does not own the appliance. Anything requiring
warranty-voiding access, hard wiring, or a permanent fixture is dead on arrival. It also has to
survive being moved out and reinstalled.

---

## Functional Requirements

### Must
- Detect **cycle completion** on an unmodified machine, attaching nothing inside it.
- Distinguish **finished** from **paused mid-cycle** (many machines have long still periods
  during soak, drain, and between spin ramps — this is the core difficulty of the challenge).
- Notify the user through a channel they will actually receive while in another room.
- Handle **washer and dryer**, or scope to one with justification.
- Survive install and removal with no residue or damage.

### Should
- Self-calibrate to an unfamiliar machine without the user entering cycle times.
- Report *which* machine finished if more than one is monitored.
- Run for months on its power source without maintenance.

### Out of scope
- Controlling the appliance. Sensing and notification only.
- Detecting load contents, weight, or fabric type.
- Anything inside the appliance cabinet.

---

## Failure Modes You Must Address

| Failure | Why it matters | What we want to see |
|---|---|---|
| **Premature "done" during a soak pause** | The single most likely bug in this challenge. A 6-minute still period is not the end of the cycle. | Your quiet-period threshold and how you derived it. |
| **Missed completion** | Silent failure returns the user to the status quo. | Timeout backstop behavior. |
| **Neighboring machine cross-talk** | Vibration couples through a shared floor; the dryer next to it triggers the washer sensor. | Axis selection, thresholding, or physical isolation. |
| **Notification not received** | Phone on silent, out of WiFi range, cloud service down. | Fallback path and whether it degrades to local-only. |
| **Battery death** | Device silently stops working and the user does not learn this until a sour load. | Low-battery signaling. |

---

## Decisions Left Entirely to You

Sensing modality · detection algorithm · notification transport · power source and budget ·
mounting method · calibration strategy · BOM.

---

## Sensing Approaches Worth Considering

- **Accelerometer (the obvious one):** MEMS 3-axis on the cabinet, RMS energy over a window.
  Cheap, well-documented, works. **Because it is obvious, an accelerometer design will be scored
  hard on the algorithm, not the hardware** — the state machine that separates a soak pause from
  a finished cycle is where the points live.
- **Acoustic:** microphone plus band-limited energy detection. Can catch the end-of-cycle jingle
  many machines already play, which is a much stronger completion signal than stillness.
- **Current sensing:** clamp-on CT on the power cord. Very clean signal, near-zero ambiguity on a
  dryer. Requires cord access.
- **Thermal:** dryer exhaust temperature drop. Excellent for dryers specifically, blind on washers.
- **Magnetic:** field from the drum motor via a hall sensor or coil. Non-contact and immune to
  floor-coupled vibration.
- **Door state:** reed switch or light sensor to detect the user retrieving the load — useful as a
  *reset* signal even if it does not detect completion.

---

## What Judges Will Look For

- **Does It Work (25)** — Show the algorithm handling a realistic cycle profile including pauses.
  A timing diagram or simulated signal trace with your thresholds marked is the strongest evidence.
- **Creativity (20)** — This is the most obvious of the five prompts, so the bar for novelty is
  higher. Combining two weak signals into one reliable one counts.
- **Sellable Product (20)** — Products in this space already exist and sell for around \$30–50.
  What is your differentiation and your price?
- **Problem Fit (15)** — Does it solve the sour-load problem, or just report status?
- **Who It's For (10)** — Renter-specific design decisions called out explicitly.
- **The Why (10)** — Why not just set a phone timer? Answer this directly; it is the honest
  objection to this entire product category.

---

## Stretch Goals

- Learn a specific machine's cycle signature over several runs and predict time remaining.
- Multi-machine mesh for a shared laundry room.
- Escalating reminders until the load is actually retrieved (door-open detection closes the loop).

---

*Deliverable requirements: see [CONTRIBUTING.md](../CONTRIBUTING.md). Judging: see
[admin/scoring-sheet.md](../admin/scoring-sheet.md).*
