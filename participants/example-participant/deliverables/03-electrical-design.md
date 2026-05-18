# 3. Electrical Design

## Schematic

> Attach your schematic here (KiCad export, EasyEDA screenshot, or hand-drawn + photographed).
> `![Schematic](./schematic.png)`

## Component Selection

| Component | Part # | Qty | Unit Cost | Justification |
|-----------|--------|-----|-----------|---------------|
| [Microcontroller] | [e.g., ATtiny85] | 1 | $0.85 | [Why this MCU] |
| [Sensor 1] | [e.g., PIR HC-SR501] | 1 | $1.20 | [Why] |
| [Sensor 2] | | 1 | | |
| [Actuator] | | 1 | | |
| [Regulator] | | 1 | | |
| [Passives] | Resistors/Caps | assorted | $0.50 | Decoupling, pull-ups |
| **TOTAL BOM** | | | **$X.XX** | |

## Power Budget

| Component | Voltage | Current (active) | Current (sleep) | Duty Cycle | Avg Current |
|-----------|---------|-----------------|-----------------|------------|-------------|
| MCU | 3.3V | Xmα | XμA | X% | XμA |
| Sensor 1 | 3.3V | XmA | XμA | X% | XμA |
| Output | 3.3V | XmA | 0 | X% | XμA |
| **TOTAL** | | | | | **XmA** |

**Battery life estimate:** [Battery capacity mAh] ÷ [Avg current mA] = **[X hours / days]**

## Protection & Filtering

- **Decoupling caps:** [Value] on each VCC rail
- **Reverse polarity protection:** [Method or N/A]
- **ESD protection:** [Method or N/A]
- **Pull-up/down resistors:** [Where and why]

## Key Electrical Decisions

- **[Decision 1]:** e.g., chose 3.3V over 5V to [reason]
- **[Decision 2]:** e.g., used N-MOSFET for relay drive because [reason]

## Twist Impact on Electrical Design

Describe how the Hour-12 twist constraint changed your electrical design choices.
