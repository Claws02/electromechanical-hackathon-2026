# 7. Pitch Deck — "Was It Left Open?"

> 3-minute pitch, 10 slides. Speaker notes are what you actually say; the slide content is what
> goes on screen. Submit as slides, PDF, or this outline — all three score the same.
>
> **Timing is a real constraint.** 3 minutes is roughly 420 spoken words. This outline is budgeted
> to fit; if yours runs long, cut the technical detail, not the problem or the ask.

---

## Slide 1 — The Moment (0:00–0:20)

> ### You're 20 minutes from home.
> ### Did you close the garage?

**Speaker notes:** Everyone in this room has had this exact thought. And the honest answer is you
don't know — because once you're out of the driveway, there's no way to find out. That's not a
hardware problem. That's a missing feedback loop.

*Visual: dark photo, open garage at dusk, empty driveway.*

---

## Slide 2 — Why It Matters (0:20–0:40)

> - An open garage is the **most common unlocked entry** on a suburban house
> - Behind it: tools, bikes, a second car — and usually an **unlocked interior door**
> - The opener didn't fail. **Attention** failed.

**Speaker notes:** This isn't a reliability problem. Openers work. The failure is that a person got
distracted for eight seconds. You can't engineer distraction away — so you close the loop instead.

---

## Slide 3 — Who It's For (0:40–0:55)

> **Suburban homeowner, 30–55.** Attached garage, two-plus daily users, phone-native.
> Buys their own smart-home hardware. Will do a 15-minute install once.
>
> **Also: renters** — which is why nothing here drills, glues, or leaves residue.

**Speaker notes:** That renter constraint isn't a nice-to-have. It's why the mount is a zip tie.
One user fact, one design consequence.

---

## Slide 4 — What Exists Today (0:55–1:15)

| | Cost | Problem |
|---|---|---|
| Smart opener replacement | \$150–300 | Replaces working hardware |
| Ecosystem add-on sensor | \$30–50 | Locked to one platform |
| **Reed switch + magnet** | **\$8** | **Two parts, needs alignment, drifts** |
| Nothing | \$0 | ← the real competitor |

**Speaker notes:** I want to be straight about the third row, because it's the one that matters. A
reed switch is cheap and it works. If you're installing on a well-aligned door, it's the better
engineering answer. I'm not going to stand here and pretend otherwise.

---

## Slide 5 — The Idea (1:15–1:40)

> ## Don't sense the track. Sense the door.
>
> A 3-axis accelerometer on the top panel reads **tilt from gravity**.
>
> Closed = panel vertical = 0°  ·  Open = panel horizontal = 90°
>
> **One part. Nothing to align. Gravity doesn't drift.**

**Speaker notes:** The panel rotates ninety degrees between closed and open. Gravity is a free,
absolute, permanent reference. So instead of two parts that have to stay lined up, there's one part
that just needs to be on the door. And because it's an accelerometer, it knows the door is *moving* —
which a reed switch fundamentally cannot tell you.

*Visual: the two-position diagram from [deliverable 04](04-mechanical-design.md#orientation--the-load-bearing-mechanical-decision).*

---

## Slide 6 — Why Motion Matters (1:40–2:00)

> **Reed switch:** door is open. Notify.
> **This:** door is *opening*, and you're standing right there. Say nothing.
>
> - 15-minute grace period
> - Acknowledge → 4-hour hold
> - Escalation **capped at 6**, then silence

**Speaker notes:** This is the part that decides whether the product survives contact with a real
user. A monitor that nags you while you're working in the garage gets muted in a week, and a muted
monitor protects nothing. So it knows the difference between open and abandoned.

---

## Slide 7 — It Actually Works (2:00–2:25)

> | Claim | Number |
> |---|---|
> | Tilt accuracy across 0–90° | **0.0° error**, verified numerically |
> | Invariant to crooked mounting | **0° drift** across 45° skew |
> | Sleep current | **10.16 µA** |
> | Battery life | **769 days** on one 18650 |
>
> Two bugs caught in simulation: an inverted tilt formula, and a 4-hour
> window where alerts were silently suppressed.

**Speaker notes:** Every one of those is derived, not asserted — the power budget adds up term by
term and you can check it. And I'll flag the two bugs simulation caught, because the tilt formula
bug would have shipped a device that reported "open" permanently and never worked once.

---

## Slide 8 — The Honest Number (2:25–2:45)

> ### 769 days — at 25 °C.
> ### 479 days in a hot garage.
>
> Self-discharge is **60% of the power budget.** Cell quality outweighs every
> circuit optimization I made, by 8×.
>
> **In Phoenix, this misses its own spec.** Fix: a \$2 larger cell.

**Speaker notes:** I'd rather tell you this than have you find it. Once sleep current is down at ten
microamps, the cell is losing charge faster than the circuit uses it — so the biggest lever isn't
engineering, it's purchasing. Halving my sleep current bought 35 days. Choosing a decent cell is
worth 290.

---

## Slide 9 — The Business Case (2:45–3:00)

> **BOM \$12.60** → **retail \$39**
>
> - Undercuts ecosystem sensors, no subscription, platform-agnostic webhook
> - Loses to a \$8 reed switch on price. **Wins on retrofit and on motion data.**
> - Real market: doors where reed alignment is awkward, and anyone who wants
>   one part instead of two
>
> Narrower claim than "better product" — and the right size of claim.

**Speaker notes:** Three-times BOM is normal for hardware at this volume. I'm not claiming this beats
the cheapest option on cost, because it doesn't. I'm claiming it wins in a specific segment, and I
can tell you exactly which one.

---

## Slide 10 — The Ask (3:00)

> ## Next step: one measurement.
>
> **Does 2.4 GHz get out of a steel garage door?**
>
> If yes → build it. If no → the whole notification path needs rethinking.
>
> Everything else is validated. That one isn't.

**Speaker notes:** That's the biggest unvalidated risk in the design, and it's a thirty-minute test
with an RSSI meter at the mount point. I'd do that before spending another dollar on this. Thanks.

---

## Delivery Notes

Things that make a 3-minute pitch land, learned the hard way:

- **Lead with the moment, not the technology.** Slide 1 has no engineering on it at all. Nobody
  cares about your accelerometer until they care about the problem.
- **Name your weakness before a judge does.** Slides 4, 8, and 9 each concede something real. This
  buys enormous credibility and costs nothing, because the judges were going to find it anyway.
- **One number per claim, derived.** "769 days" beats "long battery life" every time, and it invites
  them to check rather than doubt.
- **End with a decision, not a summary.** Slide 10 asks for one specific action. A pitch that ends
  in "and that's my project" wastes its last ten seconds.
- **Rehearse against a clock.** Three minutes is much shorter than it reads. Cut the technical
  middle before you cut the problem or the ask.
