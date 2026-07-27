# 6. Simulation & Validation

> In a real submission, attach your simulation screenshots here:
> `![Wokwi state machine](./wokwi-sim.png)` · `![LTspice buck transient](./buck-transient.png)`
>
> A screenshot with no interpretation scores poorly. What earns points is the sentence that says
> *what the simulation showed and what you changed because of it.*

## What Was Validated, and How

| # | Claim | Method | Result |
|:--:|---|---|:--:|
| 1 | Tilt math maps panel angle → 0–90° correctly | Numerical sweep, 0–90° in 9 steps | ✅ Pass |
| 2 | Tilt is invariant to mount skew about Z | Sweep skew 0–45° at fixed panel angle | ✅ Pass |
| 3 | Thresholds cannot chatter mid-travel | Threshold classification over the sweep | ✅ Pass |
| 4 | Power budget yields ≥ 2 years | Spreadsheet model, term by term | ⚠️ Pass at 25 °C, **fail in hot climate** |
| 5 | State machine has no unreachable or trap states | Manual transition-table audit | ✅ Pass after one fix |
| 6 | Buck holds 3.3 V through a WiFi TX step | LTspice transient | ⚠️ Pass only with 100 µF bulk added |

Two of six needed a design change. Those two are the useful rows.

---

## 1–3. Tilt Math

Sensor frame has Z normal to the panel; tilt is the angle of the gravity vector out of the panel
plane. Swept panel angle from 0° (closed, vertical) to 90° (open, horizontal):

| Panel angle | `az` | `hypot(ax,ay)` | Computed tilt | Error | Classified |
|:--:|:--:|:--:|:--:|:--:|---|
| 0° | 0.000 | 1.000 | 0.0° | 0.0° | CLOSED |
| 10° | 0.174 | 0.985 | 10.0° | 0.0° | CLOSED |
| 19° | 0.326 | 0.946 | 19.0° | 0.0° | CLOSED |
| 20° | 0.342 | 0.940 | 20.0° | 0.0° | in-band |
| 45° | 0.707 | 0.707 | 45.0° | 0.0° | in-band |
| 69° | 0.934 | 0.358 | 69.0° | 0.0° | in-band |
| 70° | 0.940 | 0.342 | 70.0° | 0.0° | in-band |
| 80° | 0.985 | 0.174 | 80.0° | 0.0° | OPEN |
| 90° | 1.000 | 0.000 | 90.0° | 0.0° | OPEN |

**Computed tilt equals panel angle exactly across the range** — expected, since the relationship is
the identity by construction, but worth confirming rather than assuming, because the first version
of this formula was wrong.

### The bug this caught

The initial implementation was `fabsf(atan2f(ax, az))`. Swept, it returned **90° for closed and
180° for open** — every reading landed above the 70° threshold, so the device would have reported
`OPEN` permanently and never fired a single correct notification.

It would have looked fine in code review. The sweep caught it in about a minute. This is the entire
argument for validating numerically rather than reasoning about trigonometry in your head.

### Skew invariance

Rotating the device about Z (a device zip-tied slightly crooked) at a fixed 45° panel angle:

| Mount skew about Z | Computed tilt |
|:--:|:--:|
| 0° | 45.0° |
| 15° | 45.0° |
| 30° | 45.0° |
| 45° | 45.0° |

Zero sensitivity, because the formula uses `hypot(ax, ay)` rather than `ax` alone. Had it used
`atan2(|ax|, |az|)`, a 30° mount skew would have produced a meaningful tilt error. **This is why the
install instructions do not specify rotational alignment** — the math makes it irrelevant, which
was a design goal, not an accident.

---

## 4. Power Budget Model

Term-by-term spreadsheet model, cross-checked by hand. Full table in
[deliverable 03](03-electrical-design.md#power-budget).

| Scenario | mAh/day | Battery life | Meets 2 yr? |
|---|---:|---:|:--:|
| **Baseline** (7 POSTs, 2%/mo self-discharge, 25 °C) | 2.861 | **769 d** (2.11 yr) | ✅ |
| POST on every state change (12/day) | 3.472 | 634 d | ❌ |
| Commodity LDO instead of TPS62840 | 4.061 | 542 d | ❌ |
| Cheap cell, 4%/mo self-discharge | 4.594 | 479 d | ❌ |
| Unswitched sense divider (+2.1 µA) | 2.911 | 756 d | ✅ |
| Sleep current halved to 5 µA | 2.737 | 804 d | ✅ |

### What the sensitivity analysis showed

Ranking the levers by how much battery life each is worth:

```
  cell quality (2% -> 4%/mo)      -290 d   ← largest single factor
  regulator choice (LDO)          -227 d
  POST policy (7 -> 12/day)       -135 d
  sleep current (halved)           +35 d   ← smallest
  sense divider (unswitched)       -13 d
```

**The two biggest levers are a purchasing decision and a \$1.10 part — not circuit optimization.**
Halving sleep current, the thing that feels like the real engineering work, is worth less than a
seventh of choosing a decent cell.

Consequences adopted into the design:

1. The cell is specified as a functional requirement with a named self-discharge spec, not as a
   generic "18650."
2. The TPS62840 stays despite costing \$0.85 over an LDO.
3. No further effort spent chasing sleep current below 10 µA.

### Where it fails

At 4%/month effective self-discharge — a garage averaging ~40 °C — life drops to **479 days,
missing the requirement by 35%.** Not simulated away and not hidden in a footnote: the design does
not meet its own spec in a hot climate. Mitigation options, none free:

- 3400 mAh cell: restores margin, +\$2.00 BOM
- Drop the daily heartbeat: +40 d, but loses device-down detection
- Document "replace cell annually in hot climates": no BOM cost, worse product

**Recommendation: the larger cell.** The heartbeat is load-bearing for the power-loss failure mode
([05](05-firmware-logic.md#failure-behavior)) and should not be traded away for 40 days.

---

## 5. State Machine Audit

Every state × every event, checked for unhandled combinations and trap states.

| State | motion INT | timer | ack | sensor fail | watchdog |
|---|---|---|---|---|---|
| `BOOT` | n/a | n/a | n/a | → FAULT | → BOOT |
| `CALIBRATING` | sample | timeout → FAULT | store | → FAULT | → BOOT |
| `CLOSED` | classify | heartbeat | ignore | → FAULT | → BOOT |
| `OPEN` | classify | → ALERTING | → HOLD | → FAULT | → BOOT |
| `ALERTING` | classify | escalate | → HOLD | → FAULT | → BOOT |
| `HOLD` | classify | expire → OPEN | ignore | → FAULT | → BOOT |
| `FAULT` | ignore | 24 h → BOOT | ignore | stay | → BOOT |

No empty cells: every state handles every event. `FAULT` is the only absorbing state and it has a
timed exit, so it is not a trap.

### The bug this caught

The first version had **no transition out of `HOLD` on the door closing** — only the 4-hour timer.
Sequence that breaks it:

```
door opens → 15 min → ALERTING → user acknowledges → HOLD
  → user closes the door 2 minutes later
  → HOLD persists for the remaining 3h58m
  → door opens again during that window
  → NO ALERT. Suppressed by a stale hold from a completed event.
```

A four-hour window in which the device silently does nothing, triggered by the *normal* usage
pattern of acknowledging and then closing up. Fixed by clearing `rtc_hold_until` on any transition
to `CLOSED`, visible in the `EVT_CLOSED` branch of
[the main loop](05-firmware-logic.md#main-loop).

This is the class of bug that a transition-table audit finds and code review does not, because
nothing about the code looks wrong — the missing transition is an absence.

---

## 6. Buck Regulator Transient — LTspice

Modelled TPS62840 + 22 µH + 22 µF output, loaded with the ESP32-C3 WiFi profile as a current step:
idle 10 µA → 240 mA in under 1 µs, held 4 ms, at a cell voltage of 3.4 V (near end of life, the
worst case).

| Configuration | Output sag | ESP32 brownout (2.8 V)? |
|---|---:|:--:|
| 22 µF output only | to 2.71 V | ❌ **Brownout** |
| 22 µF + 47 µF on VBATT | to 2.94 V | ⚠️ 140 mV margin |
| 22 µF + **100 µF on VBATT** | to 3.11 V | ✅ 310 mV margin |

### What changed because of it

The original design had no bulk capacitor on VBATT. The transient showed the rail collapsing to
2.71 V on a TX burst at end-of-life cell voltage — **below the ESP32-C3 brownout threshold.**

The real-world symptom would have been vicious: the device works fine on a fresh cell, then months
later starts resetting *only* when it tries to send a notification. It would never fail during
install or testing, only in service, and only at the moment it was needed. The reset would then
land in the watchdog branch, adopt the current door state silently, and lose the event entirely.

**Fix: 100 µF electrolytic on VBATT** (\$0.08). Chosen over 47 µF for the extra margin, since the
part is cheap and the failure mode is severe and hard to diagnose.

The 18650's internal resistance (~50 mΩ) is what drives this — at 240 mA that is a 12 mV IR drop at
the cell, but the transient response of the cell chemistry over microseconds is much worse than its
DC resistance suggests.

---

## Not Validated

Stated explicitly, because claiming otherwise is how bad numbers ship:

| Not tested | Why it matters | How I would test it |
|---|---|---|
| **Real accelerometer on a real door** | Panel flex and vibration during travel are modelled as an 800 ms settle time, which is an assumption, not a measurement | Log raw XYZ through 20 real cycles; check the settle time actually needed |
| **Measured current draw** | The entire power budget rests on datasheet typicals. Real WiFi association time varies by 2× between routers | µA-capable meter, or a shunt and scope, over a week of real use |
| **Self-discharge rate** | The largest term in the budget, taken from a spec sheet | Charge two cells, leave one on the shelf, measure capacity monthly for 3 months |
| **Enclosure over a summer** | PETG choice is based on published Tg, not observation | Leave a printed part in a garage roof cavity through August |
| **WiFi range from inside a metal door assembly** | A steel garage door is a substantial RF obstacle and could break the primary notification path entirely | RSSI measurement at the mount point before committing |

**The last one is the biggest unvalidated risk in this design.** If a steel door panel attenuates
2.4 GHz enough to prevent association, the primary notification path fails and the product degrades
to a buzzer in the garage — which nobody is in. That single measurement would be the first thing to
do with real hardware, ahead of everything else on this list.
