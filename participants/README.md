# Participants

This folder contains each participant's submission. Each subfolder follows this structure:

```
participants/
└── your-name/
    ├── README.md                        ← Project overview
    └── deliverables/
        ├── 01-problem-statement.md
        ├── 02-system-architecture.md
        ├── 03-electrical-design.md
        ├── 04-mechanical-design.md
        ├── 05-firmware-logic.md
        ├── 06-simulation-validation.md
        └── 07-pitch-deck.md
```

See the [`example-participant`](example-participant/) folder for a template with placeholder content.

See [`CONTRIBUTING.md`](../CONTRIBUTING.md) for step-by-step submission instructions.

---

## Competitors

Folder names must match the `slug` values in
[`event.config.json`](../event.config.json) — the workflows key off them.

| Competitor | Folder | Challenge | Status |
|------------|--------|:---:|--------|
| Caleb | `caleb/` | drawn at T-0 | Pending |
| Friend One | `friend-one/` | drawn at T-0 | Pending |
| Friend Two | `friend-two/` | drawn at T-0 | Pending |

> **Organizer:** replace the placeholder names and slugs in `event.config.json`, `docs/app.js`,
> and this table before T-0. CI fails if the first two disagree. Note that the `tally-scores`
> workflow **refuses to run** while the `github` handles in the config are still placeholders —
> self-scoring cannot be detected without them.

Folders are created by the competitor's first push; see
[CONTRIBUTING.md](../CONTRIBUTING.md) for how to do that with no git experience.
