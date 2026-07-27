# Hour 12 Twist — Voting Instructions

**Voting opens:** T+12h · Saturday, August 22, 2026 · 5:00 AM CDT
**Voting closes:** T+12h30m · Saturday, August 22, 2026 · 5:30 AM CDT
**Applies for:** The final 12 hours

> Yes, 5:00 AM. That is the point — the twist lands when you are 12 hours deep and least
> prepared to re-architect. Set an alarm.

---

## How to Vote

The vote issue is **posted automatically** by the
[`twist-vote`](../.github/workflows/twist-vote.yml) workflow — the organizer does not hand-write
16 comments at five in the morning.

1. At T+12h an issue titled **⚡ HOUR 12 TWIST VOTE** appears, with each of the 16 constraints
   as its own comment.
2. React 👍 on the **one** constraint you want.
3. **One vote each.** Reacting to more than one **voids your entire ballot** — the tally
   workflow detects this and names you in the results. Pick one.
4. Most 👍 wins. A tie is broken by the organizer flipping a coin on camera, recorded in the thread.
5. The [`twist-tally`](../.github/workflows/twist-tally.yml) workflow counts and announces at T+12h30m.

If nobody votes, the organizer picks. Do not let that happen.

---

## Twist Options

The definitive machine-readable list is [`twists.json`](twists.json) — that is what the vote
workflow posts from. The text below mirrors it.

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

5. **Organizer:** set `WINNING_TWIST` in `docs/app.js` to the winning ID and push, so the
   dashboard shows it.

There is no penalty for pivoting hard — the opposite. Judges reward honest documentation of
what the constraint forced you to change, including things you had to abandon.

**But a submission that does not visibly address the twist is capped at 15/25 on
"Does It Work."** Ignoring it means the final 12 hours were not spent on the assignment.

---

## Past Twists

| Event | Winning Twist | Votes |
|-------|---------------|-------|
| 2026 Inaugural | _pending_ | — |
