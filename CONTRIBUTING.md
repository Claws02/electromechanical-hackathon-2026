# How to Submit Your Deliverables

This guide explains how to push your files to the hackathon repository. **No git experience required** — use the web browser method below.

---

## Method 1: Web Browser (Drag & Drop) — Easiest

This is the recommended method if you've never used git.

### Step 1 — Go to the Repository

Open: `https://github.com/claws02/electromechanical-hackathon-2026`

### Step 2 — Navigate to the Participants Folder

Click on the `participants/` folder, then click on your folder (e.g. `caleb/`). Your folder name
is the `slug` listed for you in [`event.config.json`](event.config.json) — use exactly that, since
the automation keys off it.

> **If your folder doesn't exist yet**, see the "Creating Your Folder" section below.

### Step 3 — Upload Files

1. Click the **`deliverables/`** folder inside your participant folder.
2. Click the **Add file** button (top right).
3. Choose **Upload files**.
4. **Drag and drop** your files onto the page — or click to browse.
5. Scroll down to "Commit changes", add a short message like `Add electrical design deliverable`, and click **Commit changes**.

Repeat for each deliverable file.

---

## Creating Your Folder (First Time Setup)

GitHub doesn't let you create empty folders through the web UI. Here's the trick:

1. In the repository, click **Add file → Create new file**.
2. In the "Name your file..." box, type:
   ```
   participants/your-name/deliverables/01-problem-statement.md
   ```
   (Replace `your-name` with your actual name, no spaces — use hyphens.)
3. Add some placeholder content (e.g., `# Work in progress`).
4. Commit the file. This will auto-create all the folders.

---

## Method 2: GitHub Desktop (GUI App)

If you're comfortable with a GUI but not the command line:

1. Download [GitHub Desktop](https://desktop.github.com/) and sign in.
2. Clone the repository: **File → Clone Repository → URL** → paste the repo URL.
3. Copy your files into `participants/your-name/deliverables/`.
4. In GitHub Desktop, you'll see your changes listed on the left.
5. Add a summary message and click **Commit to main**.
6. Click **Push origin** to upload.

---

## Method 3: Command Line (Git)

For those comfortable with the terminal:

```bash
# 1. Clone the repo (first time only)
git clone https://github.com/claws02/electromechanical-hackathon-2026.git
cd electromechanical-hackathon-2026

# 2. Create your folder and copy in your files
mkdir -p participants/your-name/deliverables
cp /path/to/your/files/* participants/your-name/deliverables/

# 3. Stage, commit, and push
git add participants/your-name/
git commit -m "Add [your-name] deliverables — Hour X submission"
git push origin main
```

---

## Required Deliverable Filenames

Please name your files exactly as shown (the number prefix keeps them sorted):

```
participants/
└── your-name/
    ├── README.md                          ← Brief overview of your project
    └── deliverables/
        ├── 01-problem-statement.md
        ├── 02-system-architecture.md      ← or .png / .pdf
        ├── 03-electrical-design.md        ← or include schematic images here
        ├── 04-mechanical-design.md        ← or link to Fusion360/Onshape
        ├── 05-firmware-logic.md           ← or .ino / .py
        ├── 06-simulation-validation.md    ← include screenshots
        └── 07-pitch-deck.md               ← or .pdf / link to Google Slides
```

**Tip:** You can include images by dragging them into a GitHub markdown file's editor, or by uploading them to your `deliverables/` folder and linking with `![alt text](./image.png)`.

---

## Tips for Non-Git Users

- **Large files (CAD, video):** GitHub has a 25MB file upload limit via the web UI. For large CAD files, upload to Google Drive or Onshape and paste the share link in your markdown file instead.
- **PDF pitch decks:** Upload the PDF directly. GitHub renders PDFs in the browser.
- **Images:** PNG or JPEG work best for schematics and diagrams.
- **Updating a file:** Navigate to the file, click the pencil icon (Edit), make changes, commit.
- **Overwriting a file:** Use Method 1 to re-upload — GitHub will ask if you want to replace it.

---

## Submission Validation

A GitHub Actions bot will automatically check your folder after each push and verify that all 7 deliverable files are present. You'll see a green checkmark on your commit when validation passes.

If files are missing, the bot will post a comment on the main tracking issue listing what's needed.

---

## Deadline

All files must be committed **before T+24h — Saturday, August 22, 2026 · 5:00 PM CDT**.

Commits after the deadline stay visible in the repo but do not count for judging. The
`post-deadline` workflow timestamps the close, so there is no ambiguity about what landed in time.

**Do not save the whole push for Hour 23.** Push each deliverable as you finish it. Three reasons:
the validator tells you what is still missing, a late merge conflict is a disaster at T+23h, and
the tiebreak rules reward an earlier final commit.

---

## Missing a Deliverable

Each missing file costs **3 points off your total** — it does not zero out a category. If you are
out of time, **ship six strong deliverables rather than seven thin ones.** That is the scoring-optimal
choice and it is deliberately designed that way.

If you are going to miss one, say so in your `README.md`. Judges score honesty about gaps more
kindly than a padded file that pretends to be finished.

---

*Questions? Open an issue.*
