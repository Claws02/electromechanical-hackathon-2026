# 5. Firmware Logic

## Platform

**Language / Framework:** [Arduino C++ / MicroPython / CircuitPython / Pure C]  
**Simulator used:** [Wokwi / TinkerCAD Circuits / None]  
**Wokwi project link:** [paste URL or N/A]

---

## State Machine

```
         ┌─────────────────┐
         │                 │
    ┌────▼───┐         ┌───▼────┐
    │ IDLE   │─────────► ALERT  │
    │        ◄─────────│        │
    └────┬───┘  clear  └───┬────┘
         │                 │
         │ [trigger]       │ [escalate]
         │                 ▼
         │          ┌──────────────┐
         │          │  INTERVENE   │
         │          └──────────────┘
         │                 │
         └────────◄────────┘
                  reset
```

**States:**
| State | Description | Entry Condition | Exit Condition |
|-------|-------------|-----------------|----------------|
| IDLE | Monitoring, low power | On boot / after reset | [Trigger condition met] |
| ALERT | Condition detected, user notified | [Trigger] | [User acknowledges OR condition clears] |
| INTERVENE | Active intervention (relay/buzzer/motor) | Alert not cleared in Xs | Reset or manual override |

---

## Pseudocode

```
SETUP:
  init_sensors()
  set_sleep_mode(POWER_DOWN)
  attach_interrupt(SENSOR_PIN, on_trigger, CHANGE)

LOOP (main):
  if state == IDLE:
    go_to_sleep()            // wake on interrupt

  if state == ALERT:
    notify_user()
    start_timer(ALERT_TIMEOUT)
    if timer_expired() and not acknowledged:
      state = INTERVENE

  if state == INTERVENE:
    trigger_actuator()
    log_event()
    wait_for_manual_reset()

ON_TRIGGER interrupt:
  if reading_valid():
    state = ALERT
    wake_from_sleep()
```

---

## Actual Code (or Link)

> Paste key functions here or link to a `.ino` / `.py` file in this folder.

```cpp
// Example: Arduino — debounced sensor read with sleep
#include <avr/sleep.h>

const int SENSOR_PIN = 2;
const int ALERT_PIN  = 9;
volatile bool triggered = false;

void onTrigger() { triggered = true; }

void setup() {
  pinMode(SENSOR_PIN, INPUT_PULLUP);
  pinMode(ALERT_PIN, OUTPUT);
  attachInterrupt(digitalPinToInterrupt(SENSOR_PIN), onTrigger, RISING);
  set_sleep_mode(SLEEP_MODE_PWR_DOWN);
}

void loop() {
  if (!triggered) {
    sleep_enable();
    sleep_cpu();
    sleep_disable();
  }
  if (triggered) {
    digitalWrite(ALERT_PIN, HIGH);
    delay(5000);
    digitalWrite(ALERT_PIN, LOW);
    triggered = false;
  }
}
```

---

## Timing & Parameters

| Parameter | Value | Notes |
|-----------|-------|-------|
| Sensor poll interval | [Xms / interrupt-driven] | [Justification] |
| Alert timeout before intervention | [Xs] | [Tunable via #define] |
| Debounce time | [Xms] | [Prevents false triggers] |
| Sleep current | [XμA] | [Measured / estimated] |

---

## Twist Impact on Firmware

How the Hour-12 twist affected your firmware (e.g., removed WiFi calls, added analog-only logic, etc.).
