# Hour 12 Twist — Voting Instructions

**Voting opens at:** T+12h · May 19, 2026 · 5:00 AM  
**Voting closes at:** T+12h+30min · May 19, 2026 · 5:30 AM  
**Twist applied for:** The final 12 hours of the hackathon

---

## How to Vote

1. Go to the [Twist Vote Issue](https://github.com/claws02/electromechanical-hackathon-2026/issues) (organizer will pin it at Hour 12).
2. React with 👍 on the comment matching your chosen twist constraint.
3. **Each participant gets one vote.** Most votes wins.
4. In case of a tie, the organizer flips a coin (documented in the issue).
5. The winning twist is announced by **T+12h+30min** and applies immediately.

---

## Twist Options

Vote by reacting 👍 on the corresponding comment in the vote issue.

---

### Power Constraints

**P1 — Battery Only**
> Must run on a single CR2032 or AA cell. No wall power, no USB power bank.

**P2 — Solar Powered**
> Must function solely on ambient light energy harvesting. No backup battery.

**P3 — 5mW Budget**
> Total average device power consumption cannot exceed 5mW. Document your power budget.

---

### Connectivity Constraints

**C1 — No WiFi**
> Remove all WiFi/internet connectivity. BLE or LoRa communication only.

**C2 — Offline Only**
> No cloud, no app, no phone. All sensing, logic, and output must be local to the device.

**C3 — One-Wire Output**
> The only output to the user is a single LED or single buzzer. Nothing else.

---

### Mechanical Constraints

**M1 — No Screws**
> Enclosure must be entirely tool-free: snap fits, press fits, magnets, or friction only.

**M2 — 100mm Cube Max**
> The entire assembled device (including any external sensors/antennas) must fit inside a 100×100×100mm cube.

**M3 — Repurposed Enclosure**
> The device housing must reuse an existing household object (Altoids tin, pill bottle, etc.). Document what you used.

---

### Cost Constraints

**$1 — $15 BOM Cap**
> Total bill of materials (all components, PCB, enclosure) cannot exceed $15 USD. Include a BOM with prices.

**$2 — 3-Component Rule**
> Active component count (ICs, microcontrollers, modules, sensors) is capped at 3 total.

**$3 — No Microcontroller**
> Core logic must be implemented using discrete analog circuitry only (555 timers, op-amps, comparators, transistors). No MCU, no FPGA.

---

### Scope / Behavior Constraints

**S1 — Add Accessibility**
> The device must be fully operable by someone with limited or no vision, or with limited hand mobility. Document your accessibility features.

**S2 — Child Safe**
> Safe for unsupervised use by children under 5. No exposed connectors or bare wires, all voltages ≤5V, no sharp edges, no small parts.

**S3 — Rental Friendly**
> The device cannot attach permanently to any surface (no adhesives, no screws into walls, no drilled holes).

**S4 — Fail Safe Mode**
> On any power loss or system failure, the device must automatically transition to a defined safe state. Document the fail-safe behavior.

---

## Applying the Winning Twist

Once the winning twist is announced:

1. Open your `01-problem-statement.md` and add a **"Twist Applied"** section noting the winning constraint and how you're adapting your design.
2. Update your `03-electrical-design.md` or `05-firmware-logic.md` accordingly.
3. Flag any significant architectural changes in your `README.md`.
4. Continue building — you have 12 hours remaining.

There is no penalty for pivoting hard. Judges appreciate honest documentation of design changes made in response to the twist.

---

## Past Twists (for future reference)

| Event | Winning Twist | Votes |
|-------|---------------|-------|
| 2026 Inaugural | TBD | — |
