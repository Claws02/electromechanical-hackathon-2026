#!/usr/bin/env python3
"""Generate the 1200x630 Open Graph card for the hackathon site.

Matches the dashboard's dark instrument-panel palette so the shared link and the
page it opens look like the same product. Re-run after changing the date or roster:
    python3 make_og.py <output-path>
"""
import sys
from PIL import Image, ImageDraw, ImageFont

W, H = 1200, 630

BG       = (10, 13, 18)
SURFACE  = (17, 19, 24)
BORDER   = (37, 43, 54)
TEXT     = (226, 232, 240)
MUTED    = (107, 118, 133)
SUBTLE   = (61, 71, 88)
CYAN     = (34, 211, 238)
YELLOW   = (245, 184, 32)

SANS_B = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
SANS   = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
MONO   = "/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf"
MONO_B = "/usr/share/fonts/truetype/dejavu/DejaVuSansMono-Bold.ttf"

f = lambda p, s: ImageFont.truetype(p, s)

img = Image.new("RGB", (W, H), BG)
d = ImageDraw.Draw(img, "RGBA")

# ── Ambient corner glows, mirroring the page's radial gradients ──────────────
for cx, cy, rad, col in [(150, 90, 420, (34, 211, 238, 13)), (1080, 560, 460, (96, 165, 250, 11))]:
    for i in range(46, 0, -1):
        r = rad * i / 46
        a = int(col[3] * (1 - i / 46) ** 1.5)
        if a > 0:
            d.ellipse([cx - r, cy - r, cx + r, cy + r], fill=(*col[:3], a))

# ── Faint engineering grid ──────────────────────────────────────────────────
for x in range(0, W, 40):
    d.line([(x, 0), (x, H)], fill=(20, 24, 31), width=1)
for y in range(0, H, 40):
    d.line([(0, y), (W, y)], fill=(20, 24, 31), width=1)

PAD = 72

# ── Eyebrow: live dot + label ───────────────────────────────────────────────
d.ellipse([PAD, 88, PAD + 10, 98], fill=CYAN)
d.text((PAD + 22, 84), "24-HOUR ENGINEERING SPRINT", font=f(MONO_B, 19), fill=CYAN)

# ── Title ───────────────────────────────────────────────────────────────────
d.text((PAD, 132), "Electromechanical", font=f(SANS_B, 76), fill=TEXT)
d.text((PAD, 216), "Design Hackathon", font=f(SANS_B, 76), fill=YELLOW)

# ── Rule ────────────────────────────────────────────────────────────────────
d.line([(PAD, 330), (W - PAD, 330)], fill=BORDER, width=1)

# ── Subtitle ────────────────────────────────────────────────────────────────
d.text((PAD, 354), "Three engineers.  Five challenges.  One twist at Hour 12.",
       font=f(SANS, 30), fill=MUTED)

# ── Stat tiles ──────────────────────────────────────────────────────────────
tiles = [("24", "HOURS"), ("5", "CHALLENGES"), ("16", "TWISTS"), ("7", "DELIVERABLES")]
tw, th, gap = 176, 104, 18
ty = 424

for i, (num, label) in enumerate(tiles):
    tx = PAD + i * (tw + gap)
    d.rounded_rectangle([tx, ty, tx + tw, ty + th], radius=10, fill=SURFACE, outline=BORDER, width=1)

    nf = f(MONO_B, 42)
    nb = d.textbbox((0, 0), num, font=nf)
    d.text((tx + (tw - (nb[2] - nb[0])) / 2 - nb[0], ty + 16), num, font=nf, fill=TEXT)

    lf = f(MONO, 15)
    lb = d.textbbox((0, 0), label, font=lf)
    d.text((tx + (tw - (lb[2] - lb[0])) / 2 - lb[0], ty + 68), label, font=lf, fill=SUBTLE)

# ── Date, bottom right ──────────────────────────────────────────────────────
date = "AUG 21 – 22, 2026"
df = f(MONO_B, 26)
db = d.textbbox((0, 0), date, font=df)
d.text((W - PAD - (db[2] - db[0]), ty + 20), date, font=df, fill=YELLOW)

sub = "FRI 17:00  ->  SAT 17:00  CDT"
sf = f(MONO, 17)
sb = d.textbbox((0, 0), sub, font=sf)
# MUTED, not SUBTLE: this sits on top of the blue corner glow, where SUBTLE
# drops below a readable contrast ratio.
d.text((W - PAD - (sb[2] - sb[0]), ty + 58), sub, font=sf, fill=MUTED)

# ── Accent bar along the bottom edge ────────────────────────────────────────
for x in range(W):
    t = x / W
    d.line([(x, H - 5), (x, H)], fill=(
        int(CYAN[0] + (YELLOW[0] - CYAN[0]) * t),
        int(CYAN[1] + (YELLOW[1] - CYAN[1]) * t),
        int(CYAN[2] + (YELLOW[2] - CYAN[2]) * t),
    ))

out = sys.argv[1] if len(sys.argv) > 1 else "og-image.png"
img.save(out, "PNG", optimize=True)
print(f"wrote {out}  {img.size[0]}x{img.size[1]}")
