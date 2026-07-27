# Judging Protocol

Everyone competing is also judging. That creates two problems this protocol exists to solve:
you cannot score yourself, and with a field this small a single harsh or generous rater can
decide the outcome. Read this before scoring anything.

---

## The Six Criteria

Weights are deliberate. The event is an engineering sprint, so demonstrated function leads;
commercial viability is weighted heavily because it is the hardest thing to fake in 24 hours.

| # | Criterion | Points | The question it answers |
|---|-----------|:---:|-------------------------|
| 1 | **Does It Work** | 25 | Is this technically valid and validated, or asserted? |
| 2 | **Creativity** | 20 | Is this original, or the first thing anyone would think of? |
| 3 | **Sellable Product** | 20 | Could this actually be sold at a price someone would pay? |
| 4 | **Problem Fit** | 15 | Does it solve the stated problem, or an adjacent easier one? |
| 5 | **Who It's For** | 10 | Is there a real, specific user — and was the design shaped by them? |
| 6 | **The Why** | 10 | Does this need to exist? Is the justification honest? |
| | **Total** | **100** | |

Full per-band criteria are in [`scoring-sheet.md`](scoring-sheet.md). Use the bands — do not
freehand a number and rationalize it after.

---

## Rules

### 1. You may not score yourself
Non-negotiable. With three competitors, each person scores the **other two**. Each submission
therefore receives **two independent scores**.

### 2. Every category score requires a written comment
A bare number is not a score. If you cannot articulate why a submission earned 14/20 on
Creativity rather than 17/20, you have not judged it — you have ranked your friends. Comments
are the only real defense against bias at this scale, because nothing here can be blind.

### 3. Score against the brief, not against each other
Each competitor had a different prompt with different difficulty. Score each submission against
**its own brief's requirements**, not against the other submissions. There is no difficulty
handicap and no curve.

### 4. Score before you discuss
Submit your scoring issue **before** talking to the other judge about the submissions. Once you
have heard someone else's opinion your independent signal is gone, and two correlated scores are
worth about as much as one.

### 5. Missing deliverables are a documentation penalty, not a zero
A missing deliverable costs **3 points off the total** per missing file, applied after scoring.
It does not zero out a category. Someone who ships six excellent deliverables and runs out of
time on the pitch deck should not lose to someone who shipped seven thin ones.

### 6. The twist must be addressed
If a submission does not visibly respond to the Hour-12 twist constraint, cap **Does It Work**
at 15/25 and say so in your comments. Ignoring the twist means the final 12 hours were not spent
on the actual assignment.

---

## Normalization

Two judges, different standards. One person's 80 is another's 65 for the same work, and with only
two scores per submission that spread decides the winner. So raw scores get corrected for
judge bias before ranking.

### The method: additive mean-centering

For each judge, compute how far their average score sits from the overall average, then shift
their scores by that difference.

```
S(j,c)  = judge j's raw total for competitor c
M(j)    = mean of judge j's scores            (across the 2 they scored)
G       = mean of all scores submitted        (all 6 total)

A(j,c)  = S(j,c) + ( G − M(j) )               ← bias-corrected score
Final(c) = mean of A(j,c) over the judges who scored c
```

**Why additive and not a z-score?** A z-score also rescales for spread, which needs a reliable
variance estimate. Each judge here produces exactly **two** numbers — a variance estimate from
n=2 is noise, and dividing by it would amplify the bias rather than remove it. Additive centering
corrects the thing we can actually measure (systematic harshness) and leaves alone the thing we
cannot (spread). This is the honest choice at this sample size, not the sophisticated-looking one.

### Worked example

Three competitors: A, B, C. Judge A scores B and C; judge B scores A and C; judge C scores A and B.

| Judge | Scored | Raw | Judge mean M(j) |
|---|---|---|---|
| A | B: 72, C: 65 | | 68.5 |
| B | A: 88, C: 84 | | 86.0 |
| C | A: 79, B: 74 | | 76.5 |

Global mean G = (72 + 65 + 88 + 84 + 79 + 74) / 6 = **77.0**

Offsets: judge A `+8.5` · judge B `−9.0` · judge C `+0.5`

| Competitor | Corrected scores | Final | Raw average |
|---|---|---|---|
| A | 88 − 9.0 = 79.0 · 79 + 0.5 = 79.5 | **79.3** | 83.5 |
| B | 72 + 8.5 = 80.5 · 74 + 0.5 = 74.5 | **77.5** | 73.0 |
| C | 65 + 8.5 = 73.5 · 84 − 9.0 = 75.0 | **74.3** | 74.5 |

Judge B graded soft (mean 86) and judge A graded hard (mean 68.5). Look at what that does:

```
RAW order        A (83.5)  >  C (74.5)  >  B (73.0)
CORRECTED order  A (79.3)  >  B (77.5)  >  C (74.3)
```

**Second and third place swap.** C's raw average was inflated by drawing the generous judge for
their higher score, while B was scored only by the harsh judge and the neutral one. Nothing about
the submissions changed — the difference was entirely *who happened to score whom*. Correcting for
that is the whole reason this step exists.

A wins either way here, which is the normal case. But with three competitors and two cards each,
the gap between second and third is routinely smaller than the gap between two judges' personal
scales, and that is precisely the situation where raw averages rank the judges instead of the work.

The [`tally-scores.yml`](../.github/workflows/tally-scores.yml) workflow does this arithmetic for
you and posts the table.

---

## Tiebreakers

Applied in order, stopping at the first that resolves:

1. Higher **Does It Work** subtotal — it is the heaviest category and the most objective.
2. Higher **Sellable Product** subtotal.
3. Fewer missing deliverables.
4. Earlier final commit timestamp — rewards finishing rather than editing to the buzzer.
5. Coin flip, executed on camera, recorded in the results issue.

---

## Conflicts of Interest

At this scale, everyone knows everyone and blind judging is impossible. Nobody is pretending
otherwise. The mitigations are:

- **All scores are public** in their scoring issues, with names attached.
- **Written justification is mandatory** per category.
- **Scores are submitted before discussion.**

If a score cannot be defended in writing to the person it was given to, it should not be
submitted. That is the whole enforcement mechanism, and among three friends it is sufficient.

---

## Timeline

| When | What |
|---|---|
| T+24h | Submissions close. Scoring issues auto-created by workflow. |
| T+24h → T+72h | Judges score independently. No discussion. |
| T+72h | All scoring issues submitted. Deadline is firm. |
| T+72h → T+80h | Organizer runs the tally workflow; results posted. |
| After results | Open discussion, calibration talk, and a written retro. |

A judge who misses the T+72h deadline forfeits their scores, and affected submissions are
ranked on the remaining judge's score alone. Say this out loud before the event starts so
nobody is surprised.

---

*Scoring form: [`scoring-sheet.md`](scoring-sheet.md) · Runbook: [`organizer-runbook.md`](organizer-runbook.md)*
