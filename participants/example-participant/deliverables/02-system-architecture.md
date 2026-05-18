# 2. System Architecture

## Block Diagram

> Replace with your actual diagram — paste an image link or upload a PNG to this folder.
> Example: `![Block Diagram](./system-architecture.png)`

```
[SENSOR 1]──┐
            ├──► [MICROCONTROLLER / LOGIC] ──► [ACTUATOR / OUTPUT]
[SENSOR 2]──┘          │
                   [POWER MGT]
                        │
                   [POWER SOURCE]
```

## Subsystem Breakdown

| Subsystem | Function | Key Component |
|-----------|----------|---------------|
| Sensing | [What it detects] | [Component, e.g., PIR sensor HC-SR501] |
| Processing | [How decisions are made] | [Component, e.g., ATtiny85] |
| Output / Actuation | [What it does when triggered] | [Component] |
| Power | [How it's powered] | [Component / source] |
| Communication | [How it notifies user] | [Protocol / component] |

## Signal Flow

1. [Sensor detects X]
2. [Microcontroller reads signal via [interface]]
3. [Decision logic: if condition → action]
4. [Output triggered: [buzzer/relay/LED/notification]]
5. [State resets when: condition]

## Key Design Choices

- **[Choice 1]:** Why you picked this architecture over alternatives.
- **[Choice 2]:** Trade-offs considered.

## Interfaces

| Interface | Protocol | Pins |
|-----------|----------|------|
| Sensor → MCU | [I2C / SPI / ADC / GPIO] | [Pin #] |
| MCU → Output | [GPIO / PWM] | [Pin #] |
