# ⚡ Electromechanical Design Hackathon 2026

> A 24-hour competitive engineering sprint. Five engineers. Five challenges. One winner.

| | |
|---|---|
| **Start** | May 18, 2026 · 5:00 PM |
| **End** | May 19, 2026 · 5:00 PM |
| **Format** | Async / Remote |
| **Submissions** | Push a folder to `/participants/your-name/` |

---

## Live Dashboard

**[Open the Live Hackathon Dashboard →](https://claws02.github.io/electromechanical-hackathon-2026/)**

Real-time countdown, phase tracker, twist voting, and submission board.

---

## The 5 Challenge Prompts

Prompts are revealed at T-0. Each participant is randomly assigned one.

| # | Challenge | Summary |
|---|-----------|---------|
| 1 | **The Forgotten Stove Problem** | Retrofittable smart add-on that prevents kitchen fires from unattended stoves via presence/cooking detection and automatic intervention. |
| 2 | **Laundry Guardian** | Detects washer/dryer cycle completion without modifying the appliance, notifies the user, and prevents mildew or rewashing. |
| 3 | **Nighttime Bathroom Safety** | Low-power device for elderly or tired users that detects nighttime room entry and provides safe illumination with minimal sleep disruption. |
| 4 | **Phantom Power Killer** | Eliminates vampire power draw by detecting room occupancy and cutting power to idle devices without disrupting active ones. |
| 5 | **Pet Home Alone Companion** | Monitors pet well-being remotely, detects activity/inactivity, provides interventions (toy/treat/sound), and gives the owner real-time feedback. |

---

## Competition Timeline

```
 T+0h         T+2h          T+10h       T+12h      T+18h         T+24h
  |------------|-------------|-----------|-----------|-------------|
  | Research & |  Engineering |  Prototype & Sim     | Packaging & |
  | Ideation   |  Design      |  (+ TWIST at T+12)   | Pitch       |
```

| Phase | Hours | Activities |
|-------|-------|------------|
| Research & Ideation | 0 – 2 | Define the problem, research existing solutions, sketch concepts |
| Engineering Design | 2 – 10 | Electrical design, schematic, component selection, CAD |
| Prototype & Simulation | 10 – 18 | Wokwi/LTspice simulation, validate architecture |
| **THE TWIST** | **Hour 12** | **Participants vote live — apply winning constraint to your design** |
| Packaging & Pitch | 18 – 24 | Pitch deck, documentation polish, final deliverable push |

---

## Hour 12 Twist Options

At Hour 12, participants vote on one constraint to apply to ALL designs for the final 12 hours.  
See [`admin/twist-voting.md`](admin/twist-voting.md) for voting instructions.

### Power Constraints
| ID | Name | Rule |
|----|------|------|
| P1 | Battery Only | Must run on a single CR2032 or AA. No wall power. |
| P2 | Solar Powered | Must function on ambient light energy harvesting only. |
| P3 | 5mW Budget | Total device power consumption cannot exceed 5mW. |

### Connectivity Constraints
| ID | Name | Rule |
|----|------|------|
| C1 | No WiFi | Remove WiFi/internet. BLE or LoRa only. |
| C2 | Offline Only | No cloud, no app, no phone. All intelligence is local. |
| C3 | One-Wire Output | Only output to user is a single LED or buzzer. |

### Mechanical Constraints
| ID | Name | Rule |
|----|------|------|
| M1 | No Screws | Enclosure must be tool-free (snap fits, magnets, friction only). |
| M2 | 100mm Cube Max | Entire device must fit in a 100×100×100mm envelope. |
| M3 | Repurposed Enclosure | Housing must reuse an existing household object. |

### Cost Constraints
| ID | Name | Rule |
|----|------|------|
| $1 | $15 BOM Cap | Total bill of materials cannot exceed $15 USD. |
| $2 | 3-Component Rule | Active component count capped at 3 ICs/modules. |
| $3 | No Microcontroller | Core logic must use analog circuitry (555, op-amp, etc.). |

### Scope / Behavior Constraints
| ID | Name | Rule |
|----|------|------|
| S1 | Add Accessibility | Must be operable by someone with limited vision or hand mobility. |
| S2 | Child Safe | Safe for children under 5. No exposed connectors, low-voltage only. |
| S3 | Rental Friendly | Cannot attach permanently to any surface. |
| S4 | Fail Safe Mode | Must fail to a safe state automatically on power loss. |

---

## 7 Required Deliverables

Each participant must push a folder to `/participants/[your-name]/deliverables/` containing:

| # | File | Description |
|---|------|-------------|
| 1 | `01-problem-statement.md` | Problem definition, user stories, existing solutions, gap analysis |
| 2 | `02-system-architecture.md` or `.png` | Block diagram, signal flow, subsystem breakdown |
| 3 | `03-electrical-design.md` | Schematic, component selection, power budget |
| 4 | `04-mechanical-design.md` | CAD overview, exploded view, enclosure concept |
| 5 | `05-firmware-logic.md` | Pseudocode, state machine, or flowchart |
| 6 | `06-simulation-validation.md` | Wokwi/LTspice/Falstad screenshots, test results |
| 7 | `07-pitch-deck.md` or `.pdf` | 3-minute pitch slides |

---

## Judging Rubric

| Category | Points |
|----------|--------|
| Problem Relevance | 15 |
| Creativity | 20 |
| Electrical Engineering Quality | 15 |
| Mechanical Design Quality | 15 |
| Feasibility / Manufacturability | 20 |
| Documentation & Presentation | 15 |
| **TOTAL** | **100** |

See [`admin/scoring-sheet.md`](admin/scoring-sheet.md) for the judge scoring template.

---

## Allowed Tool Stack

| Category | Tools |
|----------|-------|
| CAD / Mechanical | Fusion 360, FreeCAD, Onshape |
| Electronics / PCB | KiCad, EasyEDA, LTspice, Falstad, TinkerCAD Circuits |
| Embedded / Firmware | Arduino IDE, MicroPython, Wokwi, PlatformIO |
| Docs / Viz | Blender, Inkscape, Figma, Google Slides/Docs, Notion |

---

## How to Submit

See **[CONTRIBUTING.md](CONTRIBUTING.md)** for step-by-step instructions — including a drag-and-drop method that requires no git knowledge.

---

## Participants

| Name | Prompt Assigned | Submission |
|------|-----------------|------------|
| Participant 1 | TBD at T-0 | [/participants/participant-1](participants/participant-1/) |
| Participant 2 | TBD at T-0 | [/participants/participant-2](participants/participant-2/) |
| Participant 3 | TBD at T-0 | [/participants/participant-3](participants/participant-3/) |
| Participant 4 | TBD at T-0 | [/participants/participant-4](participants/participant-4/) |
| Participant 5 | TBD at T-0 | [/participants/participant-5](participants/participant-5/) |

---

## Admin

- [Twist Voting Instructions](admin/twist-voting.md)
- [Scoring Sheet Template](admin/scoring-sheet.md)
- [Submission Validator](https://github.com/claws02/electromechanical-hackathon-2026/actions)

---

*Built for the 2026 Electromechanical Design Hackathon. Questions? Open an issue.*
