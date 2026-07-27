# Scoring Sheet — Electromechanical Design Hackathon 2026

**Judges:** read [`judging-protocol.md`](judging-protocol.md) first. The rules that matter:
you may not score yourself, every category needs a written comment, and you score
**before** discussing submissions with the other judge.

A scoring issue is auto-created for each competitor at T+24h. Fill in your copy and submit it.

---

## ⚙️ Machine-Readable Block — Required

The tally workflow reads **this block only**. Fill in every number. Keep the fence, the keys,
and the spelling exactly as written — if the block does not parse, your scores are not counted.

```yaml
judge: your-github-username
competitor: competitor-folder-slug
scores:
  does_it_work: 0      # out of 25
  creativity: 0        # out of 20
  sellable: 0          # out of 20
  problem_fit: 0       # out of 15
  who_its_for: 0       # out of 10
  the_why: 0           # out of 10
missing_deliverables: 0
twist_addressed: true
```

Everything below the block is for the human being scored. Write it anyway — the comments are
worth more to them than the number.

---

## Participant Information

| Field | Value |
|-------|-------|
| **Competitor** | _(fill in)_ |
| **Challenge Prompt** | _(1–5)_ |
| **Twist Applied** | _(e.g. M2 — 100mm Cube Max)_ |
| **Judge** | _(your name)_ |
| **Scoring Date** | _(fill in)_ |

---

## 1. Does It Work — /25

*Is this technically valid and validated, or merely asserted?*

The heaviest category, and the most objective. "Works" for a 24-hour design sprint means
**validated in simulation or by defensible calculation** — nobody is expected to have built
hardware. What separates the bands is evidence.

| Score | Criteria |
|-------|----------|
| 22–25 | Simulation or calculation actually validates the core function. State machine is complete including reset and error paths. Power budget arithmetic present and correct. Component ratings appropriate with derating shown. Failure modes analyzed, not listed. |
| 17–21 | Sound design with real validation, minor gaps. Most numbers defended. State machine covers the happy path plus obvious errors. |
| 11–16 | Plausible design, thin validation. Numbers asserted rather than derived. Error and reset paths missing. |
| 6–10 | Significant technical gaps or errors. Simulation absent or unrelated to the claimed function. |
| 0–5 | Not technically valid. Would not function as described. |

**Hard caps — apply these:**
- Twist constraint not visibly addressed → **cap at 15**
- Safety-critical function (mains switching, gas, high current) with no isolation or ratings
  discussion → **cap at 18**

**Score: ___/25**

**Comments** — name the strongest piece of evidence and the biggest hole:
> _(write here)_

---

## 2. Creativity — /20

*Is this original, or the first thing anyone would think of?*

Judge originality **relative to the obvious solution for that specific brief**. Each brief names
the approach most people would reach for; going beyond it is what scores. Novel-but-worse still
scores here — this category rewards the idea, and Does-It-Work handles the execution.

| Score | Criteria |
|-------|----------|
| 17–20 | Genuinely surprising approach that also holds up. Combines signals or techniques in a way that is not obvious in hindsight. Memorable. |
| 13–16 | Clear original thinking on at least one major subsystem. Went past the obvious answer deliberately. |
| 9–12 | Competent and conventional. The design most people would produce from this brief. |
| 5–8 | Derivative. Recognizably an existing product with minimal adaptation. |
| 0–4 | No original contribution. |

**Score: ___/20**

**Comments** — what specifically was original, and was it original *and* good?
> _(write here)_

---

## 3. Sellable Product — /20

*Could this actually be sold, at a price someone would pay?*

The hardest category to fake in 24 hours and the strongest skill signal in the set. Wants
honest commercial reasoning, not optimism. A submission that says "this cannot compete on price,
here is the niche where it wins anyway" scores **higher** than one claiming an unsupported
advantage.

| Score | Criteria |
|-------|----------|
| 17–20 | BOM with real prices. Stated retail price with margin reasoning. Named competitors with honest comparison. Clear-eyed about why someone buys this one instead of the incumbent. |
| 13–16 | Costed BOM and a defensible price. Some competitive awareness. Business case mostly holds. |
| 9–12 | Rough cost estimate. Price named but not justified. Competitive landscape acknowledged thinly. |
| 5–8 | No real cost work, or claims that do not survive contact with existing products. |
| 0–4 | No commercial reasoning at all. |

**Look for:** unit cost at low volume vs. at scale · payback period where the pitch is savings ·
whether buyer and user are the same person · regulatory or certification cost where it applies.

**Score: ___/20**

**Comments** — would *you* buy it at their stated price? Why or why not?
> _(write here)_

---

## 4. Problem Fit — /15

*Does it solve the stated problem, or an adjacent easier one?*

The classic failure is solving detection when the brief asked for prevention. Check the
requirements list in their brief and see what actually got addressed.

| Score | Criteria |
|-------|----------|
| 13–15 | Directly addresses the core problem. Every Must requirement handled. Scope discipline — did not drift into an easier adjacent problem. |
| 10–12 | Solves the stated problem with one or two Must items thin. |
| 6–9 | Partially on target. Solves a related but easier problem, or misses a Must requirement outright. |
| 3–5 | Substantially off-brief. |
| 0–2 | Does not address the assigned problem. |

**Score: ___/15**

**Comments** — which Must requirements were met, and which were not?
> _(write here)_

---

## 5. Who It's For — /10

*Is there a real, specific user — and did the design actually change because of them?*

The test is traceability. "Designed for seniors" as a label scores low. "Amber LED at 12 lux
because dark adaptation degrades with age and blue light suppresses melatonin" scores high —
that is a design decision you can trace back to a specific user's specific need.

| Score | Criteria |
|-------|----------|
| 9–10 | Specific user, well understood. Multiple design decisions traceable to their real constraints. Distinguishes buyer from user where they differ. |
| 7–8 | Clear user with some decisions traceable to them. |
| 4–6 | User named but generically. Design would be identical for any user. |
| 2–3 | Vague or contradictory user definition. |
| 0–1 | No identified user. |

**Score: ___/10**

**Comments** — name one decision that visibly came from the user definition, or note that none did.
> _(write here)_

---

## 6. The Why — /10

*Does this need to exist? Is the justification honest?*

Every brief ends with the strongest objection to its own product category — the \$8 nightlight,
the \$7 power strip, the phone timer. This category scores whether they **answered that
objection** or dodged it. Acknowledging a real weakness scores higher than pretending it away.

| Score | Criteria |
|-------|----------|
| 9–10 | Confronts the obvious objection directly and answers it convincingly. Honest about what the design does *not* do. Clear reason this should exist now. |
| 7–8 | Solid justification, engages the objection at least partly. |
| 4–6 | Generic motivation. Objection unaddressed. |
| 2–3 | Justification is asserted or overstated. |
| 0–1 | No case made, or claims that are not credible. |

**Score: ___/10**

**Comments** — did they answer the honest objection in their brief?
> _(write here)_

---

## Totals

| Criterion | Max | Score |
|-----------|:---:|:---:|
| Does It Work | 25 | ___ |
| Creativity | 20 | ___ |
| Sellable Product | 20 | ___ |
| Problem Fit | 15 | ___ |
| Who It's For | 10 | ___ |
| The Why | 10 | ___ |
| **Subtotal** | **100** | **___** |
| Missing-deliverable penalty | −3 each | −___ |
| **TOTAL** | | **___** |

> Raw totals are **not** the final ranking. Scores are bias-corrected across judges before
> ranking — see [`judging-protocol.md`](judging-protocol.md#normalization).

---

## Deliverables Checklist

| # | File | Present? |
|---|------|:---:|
| 1 | `01-problem-statement` | ☐ |
| 2 | `02-system-architecture` | ☐ |
| 3 | `03-electrical-design` | ☐ |
| 4 | `04-mechanical-design` | ☐ |
| 5 | `05-firmware-logic` | ☐ |
| 6 | `06-simulation-validation` | ☐ |
| 7 | `07-pitch-deck` | ☐ |

Count the unchecked boxes into `missing_deliverables` in the block at the top.

---

## Overall Comments

Two to four sentences. Required.

**The standout:** what was genuinely good here?
> _(write here)_

**The biggest gap:** what would you fix first?
> _(write here)_

**Would you build on this?** If this were a real product decision, would you continue it, pivot it,
or kill it — and why?
> _(write here)_
