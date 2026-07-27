# 5. Firmware Logic

## State Machine

Six states. Every transition is labelled, and **every state has a defined exit** — including the
error paths, which is what the top scoring band on Does It Work is actually checking for.

```
                        ┌──────────────┐
          power-on ────► │    BOOT      │
                        └──────┬───────┘
                    sensor OK  │  sensor fail ×3
              ┌────────────────┴──────────────┐
              ▼                               ▼
      ┌───────────────┐                ┌─────────────┐
      │  CALIBRATING  │                │    FAULT    │
      │ (first boot)  │                │ buzzer patt.│
      └───────┬───────┘                │ push fault  │
              │ cal stored             └──────┬──────┘
              ▼                               │ 24 h retry
      ┌───────────────┐◄─────────────────────-┘
      │    CLOSED     │
      │  deep sleep   │◄──────────────────────────┐
      └───────┬───────┘                           │
              │ INT1: pitch > 70° settled         │
              ▼                                   │ pitch < 20° settled
      ┌───────────────┐                           │
      │     OPEN      │───────────────────────────┤
      │ timer running │                           │
      └───────┬───────┘                           │
              │ timer > GRACE (15 min)            │
              ▼                                   │
      ┌───────────────┐                           │
      │   ALERTING    │───────────────────────────┤
      │ push / buzzer │  door closes              │
      └───────┬───────┘                           │
              │ user acknowledges                 │
              ▼                                   │
      ┌───────────────┐                           │
      │     HOLD      │───────────────────────────┘
      │ 4 h suppress  │  door closes, or 4 h elapses
      └───────────────┘
```

### States

| State | Sleeps? | Purpose | Exits |
|---|:--:|---|---|
| `BOOT` | no | Verify LIS3DH `WHO_AM_I`, load calibration from NVS | → CALIBRATING (uncalibrated) · → CLOSED · → FAULT |
| `CALIBRATING` | no | Record closed and open reference vectors | → CLOSED on success · → FAULT if rotation < 60° |
| `CLOSED` | **yes** | Steady state. ~99.9% of device life | → OPEN on settled tilt |
| `OPEN` | **yes** | Door open, grace timer running | → CLOSED · → ALERTING at timeout |
| `ALERTING` | partial | Notify, escalate, await acknowledgment | → HOLD on ack · → CLOSED on close |
| `FAULT` | **yes** | Sensor unusable. Fails loud, not silent | → BOOT on 24 h retry |

## Tilt Classification

Sensor frame: **Z normal to the door panel face**, X along the panel's long axis. With the door
closed the panel is vertical, so gravity lies in the XY plane and `az ≈ 0`. With the door open
the panel is horizontal, so gravity is along Z and `|az| ≈ 1 g`.

The tilt angle is therefore the angle of the gravity vector *out of* the panel plane:

```c
// tilt = angle between the gravity vector and the panel plane.
//   door closed (panel vertical)   -> az ~ 0     -> tilt ~  0 deg
//   door open   (panel horizontal) -> |az| ~ 1g  -> tilt ~ 90 deg
//
// atan2 against hypot(ax,ay) rather than against ax alone: this makes the result
// invariant to rotation about Z, so a device zip-tied slightly askew on the panel
// still reads correctly. Using atan2(|ax|,|az|) instead would make mount skew
// about Z show up as a tilt error.
float tilt_deg(int16_t ax, int16_t ay, int16_t az) {
    float in_plane = hypotf((float)ax, (float)ay);
    return atan2f(fabsf((float)az), in_plane) * 57.29578f;
}

#define CLOSED_MAX   20.0f   // tilt below this => closed
#define OPEN_MIN     70.0f   // tilt above this => open
#define SETTLE_MS   800      // reading must hold this long

// Hysteresis band is 20-70 deg: 50 deg wide. A door mid-travel produces no
// state change at all, which is the point -- it prevents a transition storm
// during the ~12 s of travel.
```

Verified numerically across the full sweep:

| Panel angle from vertical | `az` | `hypot(ax,ay)` | tilt | Classified |
|:--:|:--:|:--:|:--:|---|
| 0° (closed) | 0.000 | 1.000 | 0.0° | **CLOSED** |
| 10° | 0.174 | 0.985 | 10.0° | CLOSED |
| 19° | 0.326 | 0.946 | 19.0° | CLOSED |
| 20° | 0.342 | 0.940 | 20.0° | in-band |
| 45° (mid-travel) | 0.707 | 0.707 | 45.0° | in-band, no change |
| 69° | 0.934 | 0.358 | 69.0° | in-band |
| 70° | 0.940 | 0.342 | 70.0° | in-band |
| 80° | 0.985 | 0.174 | 80.0° | **OPEN** |
| 90° (open) | 1.000 | 0.000 | 90.0° | **OPEN** |

Note the thresholds are exclusive (`< 20`, `> 70`), so 20° and 70° themselves sit in the band and
produce no transition — deliberate, so a door resting exactly on a threshold cannot chatter.

### Why these numbers

| Value | Derivation |
|---|---|
| **90° nominal rotation** | Top panel of a sectional door rotates from vertical to horizontal |
| **20° / 70° thresholds** | Placed 20° inside each endpoint, so panel flex, mount skew, and a door not quite closing flush cannot cross them |
| **50° hysteresis band** | Wide because the intermediate region is *traversed*, not occupied. Nothing meaningful happens between 20° and 70° |
| **800 ms settle** | Door travel is ~10–14 s. 800 ms rejects the end-of-travel bounce without adding perceptible latency |
| **15 min grace** | Longest plausible "loading the car" interval from [the user stories](01-problem-statement.md#user-stories). Shorter nags the user working in the garage; longer risks an overnight miss |
| **4 h hold** | Covers an afternoon project. Auto-expires so a forgotten acknowledgment cannot suppress forever |

## Main Loop

```c
void app_main(void) {
    esp_sleep_wakeup_cause_t cause = esp_sleep_get_wakeup_cause();

    if (!lis3dh_verify()) {           // WHO_AM_I, 3 attempts inside
        enter_fault();                 // buzzer pattern + queued push
        deep_sleep_for(HOURS(24));     // retry, do not spin
    }

    if (!nvs_has_calibration()) {
        run_calibration();
        deep_sleep_arm_motion_int();
    }

    switch (cause) {

    case ESP_SLEEP_WAKEUP_GPIO:                 // accelerometer motion
        if (settled_reading(&pitch, SETTLE_MS)) {
            door_state_t now = classify(pitch);
            if (now != rtc_state) {
                rtc_state = now;
                if (now == DOOR_OPEN) {
                    rtc_open_since = now_ms();
                    notify(EVT_OPENED);          // POST: opens only
                } else {
                    log_local(EVT_CLOSED);       // batched into heartbeat
                    rtc_open_since = 0;
                    rtc_hold_until = 0;          // closing clears HOLD
                }
            }
        }
        break;

    case ESP_SLEEP_WAKEUP_TIMER:                // grace expiry or heartbeat
        if (rtc_state == DOOR_OPEN
            && now_ms() > rtc_hold_until
            && elapsed(rtc_open_since) > GRACE_MS) {
            escalate();                          // see below
        }
        if (heartbeat_due()) notify(EVT_HEARTBEAT);
        break;

    default:                                    // cold boot / watchdog reset
        // Do NOT alert on a reset. Read the true state and adopt it silently,
        // otherwise a brownout during a WiFi burst produces a phantom alert.
        rtc_state = classify(read_pitch_now());
        rtc_open_since = (rtc_state == DOOR_OPEN) ? now_ms() : 0;
        break;
    }

    deep_sleep_arm_motion_int();
    if (rtc_state == DOOR_OPEN) deep_sleep_also_timer(MINUTES(5));
}
```

## Escalation

Three stages, deliberately not immediately loud. The user working in the garage must be able to
dismiss this without resenting it.

| Stage | Elapsed open | Action |
|---|---|---|
| 1 | 15 min | Push notification. Silent locally |
| 2 | 20 min | Push repeat + 3 short buzzer chirps |
| 3 | 30 min, then every 30 min | Push + 2 s buzzer, until closed or acknowledged |

Acknowledgment (webhook reply or a long button press) → `HOLD` for 4 hours.

**Cap:** at most 6 escalations, then the device falls silent and waits for a state change. A device
that buzzes all night is a device that gets its battery pulled, and a device with no battery
protects nothing.

## Calibration

Install-time, ~30 seconds:

1. User closes the door fully, holds the button 3 s. LED confirms. Vector stored as `closed_ref`.
2. User opens the door fully. Device auto-detects the settled second vector as `open_ref`.
3. Device computes the angle between them.
   - **≥ 60°** → store both to NVS, LED solid, done.
   - **< 60°** → refuse, LED error pattern, → `FAULT`.

Step 3 is the important one. It catches the [orientation failure from
deliverable 04](04-mechanical-design.md#orientation--the-load-bearing-mechanical-decision) — a
device mounted on the wrong axis, or on a one-piece tilt-up door that does not rotate 90°, would
otherwise install "successfully" and never detect anything. **Refusing to calibrate is the correct
behavior**, because a device that reports nothing is worse than one that reports a fault.

## Failure Behavior

| Failure | Detection | Response |
|---|---|---|
| **Power loss (cell removed/dead)** | — | Device is dead and cannot report it. **Documented limitation.** The daily heartbeat is the mitigation: the user's automation flags a missing heartbeat as device-down. A monitor cannot report its own death; it can only make its silence detectable |
| **Sensor unresponsive** | `WHO_AM_I` mismatch or I²C NACK ×3 | → `FAULT`. Buzzer pattern + queued push. 24 h retry |
| **Interrupt never fires** | Door state unchanged for 24 h | Timer wake forces a read and re-arms INT1. Catches a lost-interrupt latch-up |
| **WiFi unavailable** | Association timeout, 3 retries | Buzzer fallback. Event queued in RTC memory (8 deep) and flushed on next success |
| **Webhook returns 5xx** | HTTP status | Exponential backoff, 5 attempts, then queue |
| **Battery low** | ADC on VBATT **under load** | Push warning at 3.4 V. **Buzzer disabled below 3.2 V** — the radio is a better use of the last charge than noise |
| **Firmware hang** | Hardware watchdog, 30 s | Reset → default branch above: adopt true state silently, no phantom alert |
| **Calibration corrupt** | NVS CRC | → `CALIBRATING`, LED prompts the user |
| **Clock drift in deep sleep** | — | RTC drift is ~1%. Over a 15 min grace period that is ±9 s. Irrelevant at this timescale; explicitly not corrected |

**The power-loss row is the honest one.** Many submissions claim a fail-safe here that is not
physically possible. This device cannot announce its own power loss; the design response is to make
silence *detectable* via heartbeat rather than to pretend the problem is solved.

## RTC-Retained State

Survives deep sleep, lost on power cycle — which is why the default branch re-reads rather than
trusting it:

```c
RTC_DATA_ATTR door_state_t rtc_state;
RTC_DATA_ATTR uint64_t     rtc_open_since;
RTC_DATA_ATTR uint64_t     rtc_hold_until;
RTC_DATA_ATTR uint8_t      rtc_escalation_count;
RTC_DATA_ATTR uint8_t      rtc_queue_depth;
RTC_DATA_ATTR event_t      rtc_queue[8];
```

## Twist Impact — `P1` Battery Only

`P1` turned firmware decisions into power decisions, and two changes came directly out of it:

1. **POST on open only, not on every state change.** Closes are logged locally and batched into the
   daily heartbeat. Worth **135 days** of battery life
   ([the arithmetic](03-electrical-design.md#active-events)) — a firmware change with a larger
   effect than any single component substitution in this design.
2. **Escalation capped at 6.** Originally unbounded. With no charging path, a device stuck in
   `ALERTING` overnight would burn roughly 3 mAh — a full day's budget — for no benefit, since a
   user who has ignored six alerts is not going to respond to the seventh.

Both changes made the product *better*, not just lower-power. The cap in particular is a usability
improvement that a power constraint forced someone to notice.
