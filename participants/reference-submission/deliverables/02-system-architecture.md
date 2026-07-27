# 2. System Architecture

## Block Diagram

```
                            ┌──────────────────────────────┐
      ┌── ALWAYS ON ────────┤   18650 Li-ion  3.0–4.2 V    │
      │   (µA domain)       │   2200 mAh usable            │
      │                     └──────────────┬───────────────┘
      │                                    │
      │                     ┌──────────────▼───────────────┐
      │                     │  Protection: DW01A + FS8205  │
      │                     │  over-discharge / over-current│
      │                     └──────────────┬───────────────┘
      │                                    │  VBATT
      │                     ┌──────────────▼───────────────┐
      │                     │  TPS62840 buck → 3.3 V       │
      │                     │  60 nA quiescent             │
      │                     └──────────────┬───────────────┘
      │                                    │  +3V3
      │        ┌───────────────────────────┼──────────────────────┐
      │        │                           │                      │
┌─────▼────────▼──────┐        ┌───────────▼──────────┐   ┌───────▼────────┐
│  LIS3DH             │        │  ESP32-C3            │   │  Buzzer +      │
│  3-axis accel       │  I²C   │  RISC-V + WiFi       │   │  MOSFET drive  │
│  low-power 10 Hz    │◄──────►│  deep sleep 5 µA     │──►│  85 dB @ 10 cm │
│  ~2 µA              │        │                      │   └────────────────┘
│                     │  INT1  │  GPIO3 (RTC wake)    │
│  motion interrupt   ├───────►│                      │   ┌────────────────┐
└─────────────────────┘        │                      │──►│  Status LED    │
                               │                      │   │  (install only)│
                               └───────────┬──────────┘   └────────────────┘
                                           │
                                    ┌──────▼───────┐
                                    │  WiFi 2.4GHz │
                                    │  → webhook   │
                                    └──────────────┘
```

## Signal Flow

```
  Door panel rotates
         │
         ▼
  Gravity vector shifts relative to the PCB
         │
         ▼
  LIS3DH detects |Δa| above threshold  ──►  INT1 asserts
         │
         ▼
  ESP32-C3 wakes from deep sleep (GPIO3, RTC domain)
         │
         ▼
  Read ax, ay, az over I²C  ──►  compute pitch = atan2(ax, az)
         │
         ▼
  Classify: CLOSED (<20°) / OPEN (>70°) / MOVING (between, changing)
         │
         ├──► state unchanged ────────────────►  back to deep sleep
         │
         └──► state changed
                    │
                    ▼
            Start / stop the open-duration timer
                    │
                    ▼
            Timer > 15 min AND state == OPEN
                    │
         ┌──────────┴──────────┐
         ▼                     ▼
   WiFi available        WiFi unavailable
         │                     │
         ▼                     ▼
   POST to webhook       Sound local buzzer
         │                     │
         └──────────┬──────────┘
                    ▼
             Await acknowledgment → HOLD (4 h suppress)
                    │
                    ▼
              back to deep sleep
```

## Subsystems

### 1. Sensing — LIS3DH
Three-axis MEMS accelerometer in low-power mode at 10 Hz ODR. Two jobs:

- **Position:** the static gravity vector gives absolute panel tilt. No reference needed, no drift.
- **Wake:** the on-chip motion-detection interrupt asserts INT1 when acceleration changes beyond
  a programmed threshold, so the MCU sleeps until the door physically moves.

Chosen over a cheaper single-axis tilt switch because a mercury or ball tilt switch gives a binary
state with unpredictable hysteresis, and cannot distinguish "moving" from "at an angle."

### 2. Compute — ESP32-C3
Selected for three reasons in priority order: **5 µA deep sleep** with RTC GPIO wake, integrated
2.4 GHz WiFi (no separate radio), and native I²C. An nRF52840 would beat it on sleep current but
needs a BLE gateway, which pushes a second device onto the user.

The CPU is asleep more than 99.9% of the time. It is a notification engine, not a control loop.

### 3. Power
- **Cell:** single 18650 Li-ion, 2200 mAh usable of ~2600 nominal.
- **Protection:** DW01A + FS8205 dual MOSFET — over-discharge, over-charge, over-current. Not
  optional on a lithium cell in a garage that reaches 50 °C in summer.
- **Regulation:** TPS62840 synchronous buck, **60 nA quiescent current**. This part choice matters
  more than it looks: a commodity LDO with 50 µA quiescent would consume 5× the entire rest of the
  sleeping circuit and cut battery life by roughly 80%.

Full arithmetic in [deliverable 03](03-electrical-design.md#power-budget).

### 4. Output
- **Primary:** WiFi POST to a user-configured webhook.
- **Fallback:** piezo buzzer, MOSFET-driven, ~85 dB at 10 cm. Covers the router-down and
  WiFi-misconfigured cases so the device degrades to useful rather than to silent.
- **Install only:** single status LED for calibration feedback. Firmware-disabled after setup so it
  contributes nothing to the steady-state budget.

## Power Domains

| Domain | Rail | Sleep | Active |
|---|---|---|---|
| Cell + protection | VBATT 3.0–4.2 V | always on | always on |
| Buck regulator | — | 60 nA quiescent | ~90% efficient |
| LIS3DH | +3V3 | 2 µA (10 Hz LP) | 2 µA |
| ESP32-C3 | +3V3 | 5 µA (deep sleep) | 120 mA (WiFi TX) |
| Buzzer | +3V3 | 0 | 30 mA |
| LED | +3V3 | 0 (disabled) | 5 mA |

**Design consequence:** there is no switched power domain, because the two always-on parts already
sit in the microamp range. Adding a load switch would cost more quiescent current than it saves.
That is a decision worth stating explicitly — the absence of a subsystem is a design choice too.

## Interfaces

| From | To | Protocol | Notes |
|---|---|---|---|
| LIS3DH | ESP32-C3 | I²C @ 400 kHz | 4.7 kΩ pull-ups on SDA/SCL |
| LIS3DH INT1 | ESP32-C3 GPIO3 | Level | Must be an RTC-capable GPIO to wake from deep sleep |
| ESP32-C3 | Buzzer | GPIO → MOSFET | Gate resistor 100 Ω, pulldown 10 kΩ |
| ESP32-C3 | User | WiFi / HTTPS | Credentials in NVS, provisioned over SoftAP at install |

## Failure Behavior by Subsystem

| Subsystem fails | Detected how | System response |
|---|---|---|
| LIS3DH unresponsive | I²C NACK, or WHO_AM_I mismatch | Retry ×3, then buzzer error pattern + push a fault message |
| Interrupt never fires | 24-hour watchdog heartbeat | Force a wake, re-read, re-arm the interrupt |
| WiFi unavailable | Association timeout | Buzzer fallback; queue the event and retry on next wake |
| Battery low | ADC on VBATT under load | Push a low-battery warning at 3.4 V; stop buzzing at 3.2 V to preserve the radio |
| Firmware hangs | Hardware watchdog timer | Reset to CLOSED-unknown, re-read the sensor, do not alert on the reset itself |
