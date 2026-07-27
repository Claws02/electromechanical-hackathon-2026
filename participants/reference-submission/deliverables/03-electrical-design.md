# 3. Electrical Design

## Schematic

> In a real submission, attach the schematic export here:
> `![Schematic](./schematic.png)`
>
> A hand-drawn schematic, photographed legibly, is acceptable and scores fine. An absent
> schematic does not.

Net-level description, sufficient to redraw:

```
VBATT (3.0–4.2 V)
 ├─ C1 100 µF electrolytic  ──┐ bulk, sized for WiFi TX current steps
 ├─ C2 10 µF ceramic         ─┤
 ├─ DW01A/FS8205 protection ──┘ in series with cell negative
 └─ TPS62840 (EN tied high)
      ├─ L1 22 µH  →  SW
      ├─ C3 22 µF ceramic on VOUT
      └─ +3V3
           ├─ ESP32-C3-MINI-1
           │    ├─ C4 10 µF + C5 100 nF at module VDD
           │    ├─ GPIO3  ◄── LIS3DH INT1        (RTC-capable, wake source)
           │    ├─ GPIO4/5 ◄─► I²C SDA/SCL       (R1,R2 4.7 kΩ pull-ups to +3V3)
           │    ├─ GPIO6  ──► Q1 gate via R3 100 Ω, R4 10 kΩ pulldown  →  buzzer
           │    ├─ GPIO7  ──► Q2 gate, enables the VBATT sense divider
           │    ├─ GPIO0  ◄── R5/R6 divider from VBATT (ADC, switched by Q2)
           │    └─ GPIO8  ──► status LED + R7 1 kΩ
           ├─ LIS3DH
           │    └─ C6 100 nF at VDD, C7 100 nF at VDD_IO
           └─ Q1 2N7002 ──► BZ1 piezo, D1 flyback not required (piezo is capacitive)
```

## Component Selection

| Component | Part # | Qty | Unit | Justification |
|---|---|:--:|---:|---|
| MCU module | ESP32-C3-MINI-1 | 1 | \$2.20 | 5 µA deep sleep with RTC GPIO wake; integrated 2.4 GHz WiFi avoids a second radio; certified module skips RF layout risk |
| Accelerometer | LIS3DH (LGA-16) | 1 | \$1.80 | 2 µA at 10 Hz low-power; on-chip motion interrupt is what lets the MCU sleep; ±2 g range gives best tilt resolution |
| Buck regulator | TPS62840DLCR | 1 | \$1.10 | **60 nA quiescent.** The single most consequential part choice — see the note below |
| Inductor | 22 µH shielded, 1.0 A sat | 1 | \$0.15 | Per TPS62840 datasheet for 3.3 V out; shielded to avoid coupling into the accelerometer |
| Cell protection | DW01A + FS8205A | 1 | \$0.30 | Over-discharge, over-charge, over-current. Mandatory on a lithium cell in an uncooled garage |
| Cell | 18650 Li-ion, 2600 mAh nominal | 1 | \$3.50 | 2200 mAh usable after derating; widely replaceable by the user |
| Cell holder | 18650 PCB clip | 1 | \$0.45 | User-replaceable without soldering |
| Buzzer | Piezo, 85 dB @ 10 cm | 1 | \$0.35 | Local fallback when WiFi is unavailable |
| MOSFETs | 2N7002 ×2 | 2 | \$0.05 | Buzzer drive; switched battery-sense divider |
| Passives | caps, resistors | ~14 | \$0.40 | Decoupling, pull-ups, gate resistors, divider |
| PCB | 2-layer, 25×35 mm | 1 | \$1.50 | Amortized at qty 5 from a prototype house |
| Enclosure | PETG, printed | 1 | \$0.60 | Filament cost; see [deliverable 04](04-mechanical-design.md) |
| Mounting | Zip ties, foam pad | — | \$0.20 | Non-destructive, renter-safe |
| | **TOTAL BOM** | | **\$12.60** | |

### Why the regulator choice dominates

The TPS62840 costs about \$0.85 more than a commodity LDO. Substituting a typical LDO with 50 µA
quiescent current takes sleep current from **10.2 µA to 60.1 µA** — a 5.9× increase in the
always-on term, dropping battery life from **769 days to 542 days** and breaking the two-year
requirement outright.

An \$0.85 part decision is worth 227 days of battery life. This is the kind of trade that
distinguishes a costed design from a parts list.

## Power Budget

### Sleep (always-on) current

| Item | Current | Note |
|---|---:|---|
| ESP32-C3 deep sleep | 5.00 µA | RTC + GPIO wake enabled |
| LIS3DH low-power, 10 Hz ODR | 2.00 µA | Motion interrupt armed |
| DW01A protection IC | 3.00 µA | Datasheet typical operating current |
| TPS62840 quiescent | 0.06 µA | |
| Board leakage, misc | 0.10 µA | |
| VBATT sense divider | 0.00 µA | **Switched by Q2** — see below |
| **Total sleep** | **10.16 µA** | |

> **The divider is switched on purpose.** A naive 2× 1 MΩ divider from a 4.2 V cell draws 2.1 µA
> continuously — which would be the *second largest* item in this table, bigger than the
> accelerometer. Gating it with a MOSFET and enabling it only during the ~5 ms ADC read moves it
> to effectively zero.
>
> Worth being precise about the payoff: this recovers **13 days** (756 → 769), about 1.7%. It is a
> two-cent fix so it is still correct to do, but it is not where the battery life comes from —
> and claiming otherwise would be the kind of unexamined "optimization" this budget exists to
> expose. See [the finding below](#the-finding-worth-stating-plainly) for where the charge
> actually goes.

### Active events

| Event | Current | Duration | Charge | Per day | Daily total |
|---|---:|---:|---:|:--:|---:|
| Wake + I²C read, no radio | 20 mA | 50 ms | 0.00028 mAh | 12 | 0.003 mAh |
| WiFi connect + HTTPS POST | 110 mA | 4.0 s | 0.122 mAh | 7 | 0.854 mAh |
| Buzzer alert | 30 mA | 30 s | 0.250 mAh | 0.1 | 0.025 mAh |
| Status LED | — | — | — | 0 | 0 (disabled after install) |

WiFi is 110 mA averaged across scan, association, DHCP, TLS handshake, and POST — not the 240 mA
TX peak, which occupies only a few milliseconds of that window.

**Why 7 POSTs per day and not 12.** A 6-cycle day produces 12 settled state changes. Posting on
every one costs 1.467 mAh/day and yields only **634 days** — missing the two-year target. Since the
user only needs to be told when the door **opens** (a close is confirmation, not news), the firmware
posts on OPEN plus one daily heartbeat: 6 + 1 = 7. Closes are logged locally and batched into the
heartbeat. **This firmware decision alone is worth 135 days**, and it costs nothing in parts.

### Daily total and battery life

| Term | mAh/day | Share |
|---|---:|:--:|
| Sleep current (10.16 µA × 24 h) | 0.244 | 8.5% |
| WiFi events (7 × 0.122) | 0.856 | 29.9% |
| Wake/read + buzzer | 0.028 | 1.0% |
| **Circuit subtotal** | **1.128** | **39.4%** |
| **Cell self-discharge** (2%/month of 2600 mAh) | **1.733** | **60.6%** |
| **TOTAL** | **2.861 mAh/day** | 100% |

```
Battery life = 2200 mAh usable / 2.861 mAh/day = 769 days ≈ 2.1 years
```

**Requirement: 2 years minimum. Result: 769 days = 2.11 years. Met, with 5% margin.**

Five percent is thin. See the temperature caveat below — in a hot climate this design does *not*
meet the requirement, and that is stated rather than hidden.

### The finding worth stating plainly

**Cell self-discharge is 60.6% of the total budget — larger than everything the circuit does
combined.** Once sleep current is in the 10 µA range, further optimizing the electronics is nearly
pointless; the cell loses charge faster than the circuit consumes it.

The engineering consequences:

1. **Stop optimizing sleep current.** Halving it from 10.16 µA to 5 µA buys **35 days** — 4.5%.
   Not worth a more expensive part, and not worth more design time.
2. **Cell quality matters more than circuit design here.** A cheap cell at 4%/month self-discharge
   cuts life to **479 days**, missing the requirement outright, with *no change to the electronics
   at all.* Specify a reputable cell and treat it as a functional requirement, not a commodity line item.
3. **Temperature is the real risk.** Self-discharge roughly doubles per 10 °C rise. A garage
   averaging 40 °C through summer pushes the effective rate toward 4%/month seasonally.

**The honest range is 1.3–2.1 years depending on climate, and the 2.1-year headline assumes a
~25 °C annual average.** In Phoenix this design misses its own requirement. The mitigation is a
larger cell (a 3400 mAh 18650 restores the margin for \$2 more) or an explicit "replace annually
in hot climates" instruction. Either is acceptable; silently quoting 2.1 years is not.

This margin is thinner than the headline suggests, and that is the accurate picture.

## Protection & Filtering

| Concern | Method |
|---|---|
| **Decoupling** | 100 nF at every VDD pin; 10 µF bulk at the ESP32 module; 22 µF on the buck output |
| **WiFi current steps** | 100 µF electrolytic on VBATT. Without it, a 240 mA TX burst sags the cell and can brown-out the MCU mid-association |
| **Over-discharge** | DW01A cuts at 2.4 V, protecting the cell from damage that would otherwise be permanent |
| **Over-current** | FS8205A dual MOSFET, ~3 A trip |
| **Reverse polarity** | User-replaceable cell in a keyed holder; protection IC survives reversal |
| **ESD** | Enclosed, no user-accessible connectors in normal operation. Test points are internal |
| **I²C pull-ups** | 4.7 kΩ to +3V3. At 400 kHz with ~30 pF bus capacitance the rise time is well inside spec |
| **Gate drive** | 100 Ω series + 10 kΩ pulldown on both MOSFETs, so a floating GPIO during reset cannot sound the buzzer |

## Derating

| Part | Rated | Actual | Margin |
|---|---|---|:--:|
| TPS62840 | 750 mA out | 150 mA peak | 5.0× |
| L1 inductor | 1.0 A saturation | 220 mA peak | 4.5× |
| FS8205A | 3 A continuous | 250 mA peak | 12× |
| 2N7002 | 115 mA | 30 mA (buzzer) | 3.8× |
| C1 electrolytic | 6.3 V | 4.2 V max | 1.5× |
| All ceramics | 16 V | 4.2 V max | 3.8× |

**Temperature:** all parts specified to −40 °C … +85 °C industrial. A garage in a cold climate
reaches −20 °C, and Li-ion capacity falls roughly 20–30% at that temperature — a real seasonal
effect on the battery-life figure, and another reason the honest range is 1.4–2.1 years rather
than a single number.

## Twist Impact — `P1` Battery Only

`P1` removed the planned USB-C trickle-charge input. Consequences:

1. **Deleted:** USB-C connector, TP4056 charge controller, and associated passives — about \$0.90
   and 8 mm of board edge recovered.
2. **The budget had to actually be right.** With no charging path, an optimistic estimate becomes a
   product that dies in the field. This is what forced the self-discharge line item into the table.
3. **Discovered under the constraint:** self-discharge dominates the budget. Without `P1` that term
   would likely have been omitted, and the stated life would have been 2200 / 1.128 = **1950 days**
   — roughly **2.5× too optimistic**, and a product that dies well inside its claimed lifetime.

The constraint made the design worse on paper (no charging) and considerably more honest in
practice. That is the trade, stated as a trade.
