# Challenge Prompts

Five prompts. Each competitor is assigned exactly one at T+0h. All five are published here in
full — there are no hidden requirements, and nothing in a brief changes after T-0.

---

## The Five

| # | Challenge | Difficulty | Distinguishing feature |
|---|-----------|-----------|------------------------|
| 1 | [The Forgotten Stove Problem](01-forgotten-stove.md) | ●●●○○ | Safety-critical intervention on a high-power appliance |
| 2 | [Laundry Guardian](02-laundry-guardian.md) | ●●○○○ | Signal-processing problem disguised as a sensor problem |
| 3 | [Nighttime Bathroom Safety](03-nighttime-bathroom-safety.md) | ●●●●○ | Power budget vs. response latency, in direct conflict |
| 4 | [Phantom Power Killer](04-phantom-power-killer.md) | ●●●●● | Mains-side design with real regulatory weight |
| 5 | [Pet Home Alone Companion](05-pet-home-alone.md) | ●●●○○ | The only prompt with a load-bearing mechanism to design |

Difficulty ratings are guidance, not handicaps. **Scoring is not adjusted for difficulty** —
every submission is judged against the same six criteria. A clean, well-argued CH-02 will beat
a sprawling half-finished CH-04.

---

## Brief Structure

Every brief has the same seven sections, so you can navigate them identically:

1. **The Problem** — real-world context and why existing solutions fall short
2. **Target Users** — primary and secondary, plus the constraint that follows from them
3. **Functional Requirements** — Must / Should / Out of scope
4. **Failure Modes You Must Address** — treat as design inputs, not an appendix
5. **Decisions Left Entirely to You** — the open design space
6. **Approaches Worth Considering** — starting points to argue past, not a menu to pick from
7. **What Judges Will Look For** — per-criterion guidance, weighted

The "Approaches Worth Considering" section deliberately lists options **with their drawbacks**
and does not tell you which is correct. Picking a listed approach earns you nothing on its own;
defending your pick against the named drawback is the actual work.

---

## Assignment Protocol

With three competitors and five prompts, two prompts go unassigned. Assignment must be visibly
fair, so it is derived from a value nobody can know in advance and everybody can check afterward.

### Method: T-0 commit hash

1. **Before T-0**, competitors are listed in the organizer's fixed order — alphabetical by
   first name, recorded in the tracker issue. This order is public and locked in advance.
2. **At T+0h exactly**, the organizer pushes a commit titled `T-0: start of event`. Its SHA is
   not knowable ahead of time by anyone, including the organizer.
3. Assignment is computed from that SHA:

```bash
# Run at T-0, after the start commit exists.
SHA=$(git rev-parse HEAD)
echo "Seed commit: $SHA"

# Take hex digits from the SHA, map each into the remaining prompt pool.
python3 - "$SHA" <<'PY'
import sys
sha = sys.argv[1]
competitors = ["alice", "bob", "caleb"]   # locked alphabetical order
pool = [1, 2, 3, 4, 5]
digits = [int(c, 16) for c in sha if c in "0123456789abcdef"]

for i, who in enumerate(competitors):
    pick = pool.pop(digits[i] % len(pool))
    print(f"{who:10s} -> Challenge #{pick}")
PY
```

4. The organizer pastes the command output into the tracker issue. Anyone can re-run it against
   the same SHA and get the same result — that is the point.

**Why not just roll a die?** Because this is auditable after the fact and leaves a permanent
record in the repo. A die roll on a video call works fine too; the tracker issue is the record
either way. Use whichever you prefer, but decide **before** T-0, not after.

### Re-rolls

None. The first computed assignment stands. If somebody draws CH-04 and hates it, that is the
event working as intended.

---

## Choosing vs. Drawing

The default is random assignment, because designing under a constraint you did not pick is
closer to real engineering work and makes the comparison between submissions meaningful.

If all three competitors agree **before T-0**, you may instead let everyone pick freely, with the
rule that **no two competitors may take the same prompt**. Record the choice of method in the
tracker issue. Do not change methods mid-event.

---

*Deliverables and submission mechanics: [CONTRIBUTING.md](../CONTRIBUTING.md).
Scoring: [admin/scoring-sheet.md](../admin/scoring-sheet.md).
Hour-12 twist: [admin/twist-voting.md](../admin/twist-voting.md).*
