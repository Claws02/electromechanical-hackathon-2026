# Organizer Runbook

You are competing *and* running this. That means every organizer action has to be either done
in advance or reduced to one click, because at T+12h you will be twelve hours into your own
design and in no state to improvise.

Read this once a week out, then follow it.

**Event window:** Friday, August 21, 2026 · 17:00 CDT → Saturday, August 22, 2026 · 17:00 CDT

| Marker | Local (CDT) | UTC |
|---|---|---|
| T+0h — start | Fri Aug 21, 17:00 | Fri Aug 21, 22:00 |
| T+12h — twist vote opens | Sat Aug 22, 05:00 | Sat Aug 22, 10:00 |
| T+12h30m — twist announced | Sat Aug 22, 05:30 | Sat Aug 22, 10:30 |
| T+24h — submissions close | Sat Aug 22, 17:00 | Sat Aug 22, 22:00 |
| Scoring deadline | Tue Aug 25, 17:00 | Tue Aug 25, 22:00 |

---

## One Week Out

- [ ] **Confirm all three competitors** in writing. Three is the design point; at two the peer
      judging degenerates (each person scores one submission, and bias correction needs n≥2 per
      judge to do anything). If you drop to two, recruit a non-competing judge instead.
- [ ] **Fill in the real roster** in both places:
      - `event.config.json` → `competitors[]` — name, slug, **github handle**
      - `docs/app.js` → `PARTICIPANTS` — name, slug
      - Also update the table in `participants/README.md`.
- [ ] **The GitHub handles are not optional.** The `tally-scores` workflow refuses to run while
      they are placeholders, because self-score detection is blind without them. Get them now.
- [ ] **Confirm the timezone.** Both files use `-05:00` (US Central Daylight). If your group is
      not in Central time, change the offset in both. A bare timestamp with no offset resolves in
      each viewer's own timezone — that bug is what the CI check exists to catch.
- [ ] **Push and confirm CI is green.** The `config-consistency` job fails if the two config
      copies disagree.
- [ ] **Verify GitHub Pages.** Settings → Pages → deploy from `main` / `docs`. Load the dashboard
      and check the countdown shows a sane number of days.
- [ ] **Confirm everyone can push.** Have each competitor make a trivial commit now, not at T+0h.
- [ ] **Send everyone the briefs.** All five, in advance. There is no advantage to surprise here —
      the surprise is which one you draw.
- [ ] **Decide the assignment method** — commit-hash draw (default) or free pick. Decide *now*,
      record it in the tracker issue, and do not change it after T-0.

## Two Days Out

- [ ] **Create the tracker issue** from the `Submission Tracker` template. Exactly one, left open.
      The validator posts deliverable checklists there on every push.
- [ ] **Test the automation.** Run `validate-submissions` manually from the Actions tab and
      confirm it comments on the tracker. Finding out the token permissions are wrong now is
      much better than finding out at T+24h.
- [ ] **Dry-run the tally.** Run `tally-scores` with `dry_run: true`. It will fail with "no
      scoring issues" — that is the correct answer, and it proves the workflow can run.
- [ ] **Confirm the sleep plan.** The twist lands at 05:00. Decide whether you are sleeping
      before or after it and tell everyone, so nobody is waiting on a silent organizer.

---

## T-30min

- [ ] Everyone online and confirmed present.
- [ ] Dashboard open. Countdown under an hour.
- [ ] Locked competitor order recorded in the tracker issue (alphabetical by first name).

## T+0h — Start

1. **Push the start commit.** This is what seeds the assignment draw, so it must happen at T-0
   and not before:
   ```bash
   git commit --allow-empty -m "T-0: start of event"
   git push origin main
   ```
2. **Run the assignment.** Copy the command from
   [`challenges/README.md`](../challenges/README.md#assignment-protocol) and run it against the
   commit you just pushed.
3. **Paste the full output into the tracker issue**, including the seed SHA. That is the audit
   record — anyone can re-run it later and get the same draw.
4. **Update `docs/app.js`** — set each competitor's `prompt` to their challenge number, and push.
5. **Say go.** Post in the group chat with a link to each person's brief.

> ⏱️ Budget 10 minutes for all of this, and do steps 1–3 before you look at your own brief.
> The temptation to start designing immediately is the main risk to the assignment being clean.

## T+2h, T+10h — Phase Boundaries

Nothing required. The dashboard advances phases on its own. Glance at the tracker issue to see
whether people are pushing; if someone has pushed nothing by T+10h, check on them privately.

---

## T+12h — The Twist ⚡ (05:00 CDT)

This is the only time-critical action in the event. Two clicks.

1. **Actions → `Open Hour-12 Twist Vote` → Run workflow.** It posts the issue and all 16
   constraint comments. Do not wait for the cron — scheduled runs on GitHub can be delayed by
   many minutes under load, and you do not want a 30-minute voting window to start late.
2. **Pin the issue** and post the link in the group chat. Say "voting closes in 30 minutes."
3. **Vote yourself.** You are a competitor. One 👍, one constraint.

### T+12h30m

4. **Actions → `Tally Hour-12 Twist Vote` → Run workflow.** It counts 👍, voids anyone who
   reacted to more than one, announces the winner, and closes the vote.
5. **If it reports a tie:** flip a coin on camera, then re-run the workflow with the winning ID
   in the `tiebreak` input. Do not just declare it — the recorded flip is the point.
6. **Set `WINNING_TWIST` in `docs/app.js`** to the winning ID and push, so the dashboard shows it.
7. Go back to your own design. You now have the same 12 hours as everyone else.

> **If Actions is down:** use the `Hour 12 Twist Vote (manual fallback)` issue template and post
> the 16 constraint comments by hand from `admin/twists.json`, formatted as `` ## `ID` — Name ``
> so the tally workflow can still match them if it recovers.

---

## T+18h — Packaging Phase

Post a reminder: **six strong deliverables beat seven thin ones.** Missing files cost 3 points
each; a padded file that pretends to be finished costs more than that in the Documentation-adjacent
categories. Tell people to push what they have now rather than saving it all for T+23h.

## T+24h — Close

1. **Actions → `Post-Deadline Scoring Setup` → Run workflow.** It creates one scoring issue per
   competitor and posts the closing announcement. It refuses to run before the deadline unless
   you pass `force: true`.
2. **Confirm three scoring issues exist**, labeled `scoring`. If someone never pushed a folder,
   they get no issue — that is intended.
3. **Post the judging reminder.** The three rules that matter, in your own words:
   - You score everyone **except yourself**.
   - Every category needs a **written comment**.
   - **Score before you discuss.** Once you have heard the other judge's take, your card is no
     longer independent and is worth much less.
4. **Do not close the tracker issue yet.**

---

## Scoring Window (T+24h → T+72h)

- Judges post **one comment per submission** containing their filled-in ```yaml score block.
  They comment rather than editing the issue body, because a judge without write access cannot
  edit an issue you created.
- Nudge at 24h and 40h if cards are missing. A judge who misses the deadline forfeits, and the
  affected submissions rank on the remaining card alone — say this out loud in advance so it is
  not a surprise.
- **Resist discussing submissions** until all six cards are in. This is the rule you personally
  are most likely to break, since you are in the group chat all day.

## Results

1. **Actions → `Tally Final Scores` → Run with `dry_run: true`** first. Read the run summary.
   Check for a "Rejected or ignored" section — a mistyped slug or a rejected self-score means
   somebody's card did not count, and you want to fix that before publishing.
2. **Run again with `dry_run: false`.** It posts the results issue with the leaderboard, the
   category breakdown, and the per-judge bias correction shown openly.
3. **Update `docs/app.js`** — fill in the `RESULTS` array with each slug, final score, and rank.
   The results section on the dashboard is hidden until you do. Push.
4. **Update `admin/twist-voting.md`** — record the winning twist in the Past Twists table.
5. **Close the tracker issue.**

---

## Post-Event

Do this while it is fresh. It is what makes a second edition better than the first.

- [ ] **Open a retro issue.** Four questions: what was the best submission and why; which
      criterion was hardest to score consistently; was the twist a good disruption or just
      annoying; would you do 24 hours again or change the format.
- [ ] **Record what the rubric got wrong.** With six criteria and three submissions you will
      find at least one category where all three scored nearly the same — that category did no
      work and should be reweighted or cut next time.
- [ ] **Note which challenges went unused.** Two of five were never drawn. Were they the two
      nobody wanted, or just unlucky?
- [ ] **Archive.** Tag the repo `v2026.1` so the state at judging time is permanently recoverable.

---

## Failure Modes

Things that actually go wrong at small events, and what to do.

| Problem | Response |
|---|---|
| **Someone drops out day-of** | Two competitors still works but bias correction stops helping (each judge scores one submission, n=1, so no offset is applied). Recruit any non-competing engineer to submit a third card. |
| **Nobody votes on the twist** | The tally reports "no valid votes" and does not pick. You pick, announce it in the thread, and say you picked. |
| **Two people 👍 everything** | Both ballots void, and the tally names them. If that leaves zero valid votes, see above. |
| **A judge misses the deadline** | Affected submissions rank on one card. Note it in the results issue so the asymmetry is visible. |
| **A score block will not parse** | The workflow ignores it silently — which is why you run `dry_run` first. Ask the judge to repost; the later comment wins. |
| **Actions is down at T+12h** | Manual fallback template. See the twist section above. |
| **Pages is not deploying** | The repo is the source of truth for everything that matters. Run the event from issues and fix the dashboard later. |
| **Someone pushes after T+24h** | It stays in the repo and does not count. The close announcement timestamps the boundary; do not relitigate it. |
| **A tie for first** | Tiebreak order: Does It Work → Sellable Product → fewer missing deliverables → earlier final commit → coin flip on camera. |

---

*Judging rules: [`judging-protocol.md`](judging-protocol.md) · Scoring form:
[`scoring-sheet.md`](scoring-sheet.md) · Twist constraints: [`twist-voting.md`](twist-voting.md)*
