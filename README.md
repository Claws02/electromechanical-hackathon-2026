# ⚡ Electromechanical Design Hackathon 2026

> A 24-hour competitive engineering sprint. Three engineers. Five challenges. One twist at the halfway mark.

| | |
|---|---|
| **Start** | Friday, August 21, 2026 · 5:00 PM CDT |
| **End** | Saturday, August 22, 2026 · 5:00 PM CDT |
| **Format** | Async / remote |
| **Competitors** | 3 — everyone builds, everyone judges |
| **Submit** | Push a folder to `participants/your-name/` |

**[→ Open the live dashboard](https://claws02.github.io/electromechanical-hackathon-2026/)**
— countdown, phase tracker, twist status, submission board.

---

## Read This First

| If you are… | Start here |
|---|---|
| **Competing** | [Challenge briefs](challenges/) → [How to submit](CONTRIBUTING.md) → [What you're scored on](admin/scoring-sheet.md) |
| **Organizing** | [Organizer runbook](admin/organizer-runbook.md) — hour-by-hour, including the pre-event checklist |
| **Judging** | [Judging protocol](admin/judging-protocol.md) — read before scoring anything |
| **Just curious** | The [live dashboard](https://claws02.github.io/electromechanical-hackathon-2026/) |

---

## The Five Challenges

All five briefs are published **in full**, in advance. Nothing is hidden and no requirement
changes at T-0. Each competitor draws one; with three competitors, two go unused.

| # | Challenge | Difficulty | The core difficulty |
|---|-----------|:---:|---------------------|
| 1 | [The Forgotten Stove Problem](challenges/01-forgotten-stove.md) | ●●●○○ | Intervening safely on a 240 V appliance |
| 2 | [Laundry Guardian](challenges/02-laundry-guardian.md) | ●●○○○ | Telling a soak pause from a finished cycle |
| 3 | [Nighttime Bathroom Safety](challenges/03-nighttime-bathroom-safety.md) | ●●●●○ | Battery life and response latency are in direct conflict |
| 4 | [Phantom Power Killer](challenges/04-phantom-power-killer.md) | ●●●●● | Standby and light use look identical on RMS current |
| 5 | [Pet Home Alone Companion](challenges/05-pet-home-alone.md) | ●●●○○ | A real dispensing mechanism, and a user who chews it |

**Difficulty is guidance, not a handicap** — scoring is not adjusted for it. A clean, well-argued
#2 beats a sprawling half-finished #4.

Assignment is derived from the T-0 commit hash so it is random and independently verifiable —
see [the assignment protocol](challenges/README.md#assignment-protocol).

---

## Timeline

```
 T+0h        T+2h              T+10h        T+12h        T+18h            T+24h
  |───────────|─────────────────|────────────|────────────|────────────────|
  │ Research  │   Engineering   │  Prototype & Simulation │  Package &     │
  │ & Ideate  │   Design        │      ⚡ TWIST @ T+12     │  Pitch         │
```

| Phase | Hours | What you produce |
|-------|:---:|------------------|
| Research & Ideation | 0 – 2 | Deliverable 1 — problem statement |
| Engineering Design | 2 – 10 | Deliverables 2, 3, 4 — architecture, electrical, mechanical |
| Prototype & Simulation | 10 – 18 | Deliverables 5, 6 — firmware logic, simulation |
| **⚡ THE TWIST** | **12** | **Live vote. Winning constraint applies to every design.** |
| Packaging & Pitch | 18 – 24 | Deliverable 7 — pitch deck, plus documentation polish |

Commits after T+24h stay in the repo but are not judged.

---

## The Hour-12 Twist

At Hour 12 a vote issue is posted automatically with all 16 constraints as separate comments.
React 👍 to one. Most votes wins, and the winner applies to **every** design for the final
12 hours.

| Category | Constraints |
|---|---|
| **Power** | `P1` Battery Only · `P2` Solar Powered · `P3` 5mW Budget |
| **Connectivity** | `C1` No WiFi · `C2` Offline Only · `C3` One-Wire Output |
| **Mechanical** | `M1` No Screws · `M2` 100mm Cube Max · `M3` Repurposed Enclosure |
| **Cost** | `$1` \$15 BOM Cap · `$2` 3-Component Rule · `$3` No Microcontroller |
| **Scope** | `S1` Accessibility · `S2` Child Safe · `S3` Rental Friendly · `S4` Fail Safe |

Full text of each: [`admin/twist-voting.md`](admin/twist-voting.md).
Source of truth: [`admin/twists.json`](admin/twists.json).

> **A submission that does not visibly address the winning twist is capped at 15/25 on
> "Does It Work."** Pivoting hard is expected and rewarded — judges want honest documentation
> of what the twist forced you to change.

---

## The 7 Deliverables

Push to `participants/[your-name]/deliverables/`. Any extension satisfies a slot —
`.md`, `.png`, `.pdf`, `.ino`, `.py` all count.

| # | File | Contents |
|---|------|----------|
| 1 | `01-problem-statement` | Problem definition, user stories, existing solutions, gap analysis |
| 2 | `02-system-architecture` | Block diagram, signal flow, subsystem breakdown |
| 3 | `03-electrical-design` | Schematic, component selection with justification, power budget |
| 4 | `04-mechanical-design` | CAD or dimensioned sketch, assembly strategy, enclosure |
| 5 | `05-firmware-logic` | State machine, pseudocode, or working code |
| 6 | `06-simulation-validation` | Wokwi / LTspice / Falstad results and what they showed |
| 7 | `07-pitch-deck` | 3-minute pitch — slides, PDF, or markdown outline |

A bot checks your folder on every push and reports status on the tracker issue.
**Missing deliverables cost 3 points each off your total** — they do not zero a category.
Six strong files beat seven thin ones.

---

## Judging

Everyone competing is also judging. **You may not score yourself**, every category needs a
written comment, and you submit your card before discussing submissions with the other judge.

| Criterion | Pts | The question |
|-----------|:---:|--------------|
| **Does It Work** | 25 | Is this technically valid and validated, or asserted? |
| **Creativity** | 20 | Is this original, or the first thing anyone would think of? |
| **Sellable Product** | 20 | Could this be sold at a price someone would pay? |
| **Problem Fit** | 15 | Does it solve the stated problem, or an easier adjacent one? |
| **Who It's For** | 10 | Is there a specific user, and did the design change because of them? |
| **The Why** | 10 | Does this need to exist? Is the justification honest? |
| | **100** | |

Raw scores are **bias-corrected** across judges before ranking, so one harsh or generous rater
cannot decide the outcome. With two cards per submission that correction routinely changes the
order — the [worked example](admin/judging-protocol.md#normalization) shows it flipping second
and third place.

Rules and math: [`admin/judging-protocol.md`](admin/judging-protocol.md) ·
Scoring form: [`admin/scoring-sheet.md`](admin/scoring-sheet.md)

---

## Allowed Tools

| Category | Tools |
|----------|-------|
| CAD / Mechanical | Fusion 360, FreeCAD, Onshape |
| Electronics / PCB | KiCad, EasyEDA, LTspice, Falstad, TinkerCAD Circuits |
| Embedded / Firmware | Arduino IDE, MicroPython, Wokwi, PlatformIO |
| Docs / Visualization | Blender, Inkscape, Figma, Google Slides, Notion |

Anything in these categories is fair game. AI assistance is allowed — document where you used it.

---

## Automation

The event runs itself so the organizer can compete too.

| Workflow | Trigger | What it does |
|----------|---------|--------------|
| [`validate-submissions`](.github/workflows/validate-submissions.yml) | push | Checks all 7 deliverables, verifies config consistency, lints the dashboard JS |
| [`twist-vote`](.github/workflows/twist-vote.yml) | T+12h | Posts the vote issue with all 16 constraints as comments |
| [`twist-tally`](.github/workflows/twist-tally.yml) | T+12h30m | Counts 👍, voids double-votes, announces the winner |
| [`post-deadline`](.github/workflows/post-deadline.yml) | T+24h | Creates scoring issues, closes submissions |
| [`tally-scores`](.github/workflows/tally-scores.yml) | manual | Parses score cards, bias-corrects, posts the leaderboard |

Scheduled runs only fire from the default branch and GitHub can delay them under load, so the
[runbook](admin/organizer-runbook.md) has you trigger each one manually. The cron is a backstop.

### Configuration

[`event.config.json`](event.config.json) holds the dates and roster and is read by the workflows.
The dashboard keeps its own copy inline in [`docs/app.js`](docs/app.js) so the countdown cannot
break on a failed network request. **Change both** — CI fails the build if they drift apart.

---

## Repo Layout

```
├── challenges/            # The 5 briefs, published in full
├── participants/          # One folder per competitor
│   └── example-participant/  # Blank template to copy
├── admin/
│   ├── organizer-runbook.md  # Hour-by-hour run sheet
│   ├── judging-protocol.md   # Peer-scoring rules + normalization math
│   ├── scoring-sheet.md      # The scoring form
│   ├── twist-voting.md       # All 16 constraints in full
│   └── twists.json           # Machine-readable twist source
├── docs/                  # GitHub Pages dashboard
├── event.config.json      # Dates + roster (read by workflows)
└── CONTRIBUTING.md         # How to submit, including a no-git method
```

---

*Built for the 2026 Electromechanical Design Hackathon. Questions? Open an issue.*
