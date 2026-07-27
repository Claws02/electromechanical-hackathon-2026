// ── Anime.js v4 — progressive enhancement, NOT a dependency ─────────────────
//
// This was originally a static `import ... from 'https://esm.sh/animejs@4.4.1'`.
// A static import that fails takes the WHOLE module with it, so an esm.sh outage,
// a blocked network, or an unpublished version left the page with a frozen
// 00:00:00 countdown and every JS-rendered section empty — no dates, no twist
// list, no rubric, no board. Verified by loading the page with the CDN
// unreachable.
//
// The countdown is the centerpiece of a 24-hour event. It does not get to depend
// on a third party being up. So the import is now dynamic and optional: if it
// fails we install no-op shims with the same signatures, and every render path
// below runs identically without animation.

// The shims are the INITIAL values, not just the failure path. tick() runs before
// the dynamic import resolves, and it calls animate() on each changed digit — so
// these must already be callable at that point or the countdown throws on its
// first frame.
let animate        = () => {};
let stagger        = () => 0;
let createTimeline = () => { const chain = { add: () => chain }; return chain; };
let ANIM = false;

async function loadAnimations() {
  try {
    const m = await import('https://esm.sh/animejs@4.4.1');
    if (!m?.animate) throw new Error('animejs loaded but has no `animate` export');
    ({ animate, stagger, createTimeline } = m);
    ANIM = true;
  } catch (err) {
    console.warn('[hackathon] Animations unavailable, rendering statically:', err.message);
    ANIM = false;
  }
  return ANIM;
}

// ── Config ──────────────────────────────────────────────────────────────────
//
// ⚠️  MIRROR ANY CHANGE HERE INTO event.config.json AT THE REPO ROOT.
//     The `config-consistency` job in .github/workflows/validate-submissions.yml
//     fails the build if the two drift apart. That check is deliberate — don't
//     remove it. Config lives inline here (rather than being fetched) so the
//     countdown cannot break on a failed network request.
//
// ⚠️  THE UTC OFFSET IS LOAD-BEARING. `new Date('2026-08-21T17:00:00')` with no
//     offset is parsed in the VIEWER's local timezone, so a participant two zones
//     over would see a different deadline from the same page. The '-05:00' below
//     is US Central Daylight Time, in effect on these dates. If your group isn't
//     in Central time, change it here and in event.config.json.

const HACKATHON_START = new Date('2026-08-21T17:00:00-05:00');
const HACKATHON_END   = new Date(HACKATHON_START.getTime() + 24 * 60 * 60 * 1000);
const TZ_LABEL        = 'CDT';
const TWIST_HOUR      = 12;   // hours after start
const TWIST_VOTE_MIN  = 30;   // voting window in minutes

const REPO = 'https://github.com/claws02/electromechanical-hackathon-2026';

// Competitors. `prompt` is the assigned challenge number, set at T-0 (see
// challenges/README.md for the assignment protocol). `status`: 'pending' | 'partial' | 'submitted'
const PARTICIPANTS = [
  { name: 'Caleb',      slug: 'caleb',       prompt: null, status: 'pending' },
  { name: 'Friend One', slug: 'friend-one',  prompt: null, status: 'pending' },
  { name: 'Friend Two', slug: 'friend-two',  prompt: null, status: 'pending' },
];

// Set to the winning twist ID (e.g. 'M2') once announced, or keep null.
// The twist-tally workflow tells you which to put here.
const WINNING_TWIST = null;

// Final scores, filled in after the tally-scores workflow posts results.
// Leave empty until then — the results section stays hidden while it is.
// Shape: one object per competitor with keys  slug / final / rank
//   [ { slug: "caleb", final: 79.3, rank: 1 }, ... ]   ← double quotes on purpose;
// the config-consistency check greps single-quoted slugs to compare the roster
// against event.config.json, and a commented example would otherwise be counted.
const RESULTS = [];

const CHALLENGES = [
  { num: 1, title: 'The Forgotten Stove Problem', file: '01-forgotten-stove',           difficulty: 3, hook: 'Prevent kitchen fires from unattended cooking, without touching the stove.' },
  { num: 2, title: 'Laundry Guardian',            file: '02-laundry-guardian',          difficulty: 2, hook: 'Detect cycle completion on an unmodified washer or dryer.' },
  { num: 3, title: 'Nighttime Bathroom Safety',   file: '03-nighttime-bathroom-safety', difficulty: 4, hook: 'Light the way for a drowsy user without wrecking their sleep.' },
  { num: 4, title: 'Phantom Power Killer',        file: '04-phantom-power-killer',      difficulty: 5, hook: 'Cut vampire draw to idle devices — never to one in use.' },
  { num: 5, title: 'Pet Home Alone Companion',    file: '05-pet-home-alone',            difficulty: 3, hook: 'Sense a pet’s state and actually intervene, not just watch.' },
];

const PHASES = [
  { label: 'Research & Ideation',    emoji: '🔍', start:  0, end:  2, color: 'var(--blue)'  },
  { label: 'Engineering Design',     emoji: '⚙️',  start:  2, end: 10, color: 'var(--green)' },
  { label: 'Prototype & Simulation', emoji: '🔬', start: 10, end: 18, color: 'var(--yellow)' },
  { label: 'Packaging & Pitch',      emoji: '📦', start: 18, end: 24, color: 'var(--orange)' },
];

const TWISTS = [
  { id: 'P1', cat: 'Power',        name: 'Battery Only',         desc: 'Must run on a single CR2032 or AA cell. No wall power.' },
  { id: 'P2', cat: 'Power',        name: 'Solar Powered',        desc: 'Must function solely on ambient light harvesting. No backup battery.' },
  { id: 'P3', cat: 'Power',        name: '5mW Budget',           desc: 'Total average device power cannot exceed 5mW. Document your budget.' },
  { id: 'C1', cat: 'Connectivity', name: 'No WiFi',              desc: 'Remove all WiFi. BLE or LoRa communication only.' },
  { id: 'C2', cat: 'Connectivity', name: 'Offline Only',         desc: 'No cloud, no app, no phone. All intelligence is local.' },
  { id: 'C3', cat: 'Connectivity', name: 'One-Wire Output',      desc: 'The only output to the user is a single LED or buzzer.' },
  { id: 'M1', cat: 'Mechanical',   name: 'No Screws',            desc: 'Enclosure must be tool-free: snap fits, magnets, or friction only.' },
  { id: 'M2', cat: 'Mechanical',   name: '100mm Cube Max',       desc: 'Entire assembled device must fit inside a 100×100×100mm cube.' },
  { id: 'M3', cat: 'Mechanical',   name: 'Repurposed Enclosure', desc: 'Housing must reuse an existing household object (tin, bottle, etc.).' },
  { id: '$1', cat: 'Cost',         name: '$15 BOM Cap',          desc: 'Total bill of materials cannot exceed $15 USD. Include BOM with prices.' },
  { id: '$2', cat: 'Cost',         name: '3-Component Rule',     desc: 'Active component count (ICs, MCUs, modules) capped at 3 total.' },
  { id: '$3', cat: 'Cost',         name: 'No Microcontroller',   desc: 'Core logic must use analog circuitry only — 555, op-amp, comparator.' },
  { id: 'S1', cat: 'Scope',        name: 'Add Accessibility',    desc: 'Must be fully operable with limited or no vision, or limited hand mobility.' },
  { id: 'S2', cat: 'Scope',        name: 'Child Safe',           desc: 'Safe for under-5s: no exposed wires, all voltages ≤5V, no small parts.' },
  { id: 'S3', cat: 'Scope',        name: 'Rental Friendly',      desc: 'Cannot attach permanently to any surface. No adhesives, no drilling.' },
  { id: 'S4', cat: 'Scope',        name: 'Fail Safe Mode',       desc: 'On power loss or failure, device must auto-transition to a safe state.' },
];

// Six criteria. Weighted toward demonstrated function, and toward commercial
// viability because it is the hardest thing to fake in 24 hours.
const RUBRIC = [
  { cat: 'Does It Work',     pts: 25, q: 'Is this technically valid and validated, or asserted?' },
  { cat: 'Creativity',       pts: 20, q: 'Is this original, or the first thing anyone would think of?' },
  { cat: 'Sellable Product', pts: 20, q: 'Could this be sold at a price someone would pay?' },
  { cat: 'Problem Fit',      pts: 15, q: 'Does it solve the stated problem, or an easier adjacent one?' },
  { cat: "Who It's For",     pts: 10, q: 'Is there a specific user, and did the design change because of them?' },
  { cat: 'The Why',          pts: 10, q: 'Does this need to exist? Is the justification honest?' },
];

// ── Helpers ──────────────────────────────────────────────────────────────────
const pad2  = n => String(Math.max(0, Math.floor(n))).padStart(2, '0');
const msToHMS = ms => {
  const s = Math.max(0, Math.floor(ms / 1000));
  return { h: Math.floor(s / 3600), m: Math.floor((s % 3600) / 60), s: s % 60 };
};
const currentPhase = hElapsed =>
  PHASES.find(p => hElapsed >= p.start && hElapsed < p.end) ?? null;
const el = id => document.getElementById(id);

// ── Render: Hero date ─────────────────────────────────────────────────────────
// Rendered from the canonical Date objects rather than hardcoded in the HTML, so
// the displayed dates can never disagree with the countdown driving them.
function renderHeroDate() {
  const node = el('js-date');
  if (!node) return;

  const fmt = d => d.toLocaleString(undefined, {
    weekday: 'short', month: 'short', day: 'numeric',
    hour: 'numeric', minute: '2-digit',
  });

  // The event clock is authoritative in one timezone; show the viewer's local
  // rendering plus the canonical zone so nobody has to guess which applies.
  const canonical = d => d.toLocaleString('en-US', {
    timeZone: 'America/Chicago',
    month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit',
  });

  node.innerHTML = `
    <span>${fmt(HACKATHON_START)}</span> → <span>${fmt(HACKATHON_END)}</span>
    <span class="date-tz">${canonical(HACKATHON_START)} – ${canonical(HACKATHON_END)} ${TZ_LABEL}</span>`;
}

// ── Render: Twist Grid ────────────────────────────────────────────────────────
function renderTwists() {
  const grid = el('twist-grid');
  if (!grid) return;
  const cats = [...new Set(TWISTS.map(t => t.cat))];
  grid.innerHTML = cats.map(cat => {
    const rows = TWISTS.filter(t => t.cat === cat);
    return `
      <div class="twist-group">
        <div class="twist-group-hd">${cat} Constraints</div>
        <div class="twist-rows">
          ${rows.map(t => `
            <div class="twist-row${WINNING_TWIST === t.id ? ' winner' : ''}">
              <div class="twist-code">${t.id}</div>
              <div>
                <div class="twist-row-name">${t.name}${WINNING_TWIST === t.id ? '<span class="win-badge">✓ Winner</span>' : ''}</div>
                <div class="twist-row-desc">${t.desc}</div>
              </div>
            </div>`).join('')}
        </div>
      </div>`;
  }).join('');
}

// ── Render: Rubric ────────────────────────────────────────────────────────────
function renderRubric() {
  const list = el('rubric-list');
  if (!list) return;
  const max = Math.max(...RUBRIC.map(r => r.pts));
  list.innerHTML = RUBRIC.map(r => `
    <div class="rubric-row">
      <div class="rubric-cat">
        <span class="rubric-cat-name">${r.cat}</span>
        <span class="rubric-cat-q">${r.q}</span>
      </div>
      <div class="rubric-bar-track">
        <div class="rubric-bar-fill" data-pts="${r.pts}" data-max="${max}" style="width:0"></div>
      </div>
      <div class="rubric-pts">${r.pts}</div>
    </div>`).join('');
}

// ── Render: Challenge Grid ────────────────────────────────────────────────────
function renderChallenges() {
  const grid = el('challenge-grid');
  if (!grid) return;
  grid.innerHTML = CHALLENGES.map(c => `
    <a class="ch-card" href="${REPO}/blob/main/challenges/${c.file}.md" target="_blank" rel="noopener">
      <div class="ch-card-top">
        <span class="ch-num">#${c.num}</span>
        <span class="ch-diff" title="Difficulty ${c.difficulty} of 5">${'●'.repeat(c.difficulty)}${'○'.repeat(5 - c.difficulty)}</span>
      </div>
      <div class="ch-title">${c.title}</div>
      <div class="ch-hook">${c.hook}</div>
      <span class="ch-link">Read the full brief →</span>
    </a>`).join('');
}

// ── Render: Results ───────────────────────────────────────────────────────────
// Hidden until RESULTS is populated after the tally-scores workflow runs.
function renderResults() {
  const section = el('results');
  if (!section) return;

  if (!RESULTS.length) {
    section.classList.remove('visible');
    return;
  }
  section.classList.add('visible');

  const medal = i => ['🥇', '🥈', '🥉'][i] ?? `${i + 1}`;
  const byRank = [...RESULTS].sort((a, b) => (a.rank ?? 99) - (b.rank ?? 99) || b.final - a.final);
  const top = byRank[0]?.final || 100;

  const board = el('results-board');
  if (board) {
    board.innerHTML = byRank.map((r, i) => {
      const p = PARTICIPANTS.find(x => x.slug === r.slug);
      const name = p?.name ?? r.slug;
      const ch = p?.prompt ? `Challenge #${p.prompt}` : '';
      return `
        <div class="res-row${i === 0 ? ' res-winner' : ''}">
          <div class="res-rank">${medal(i)}</div>
          <div class="res-who">
            <div class="res-name">${name}</div>
            <div class="res-ch">${ch}</div>
          </div>
          <div class="res-bar-track">
            <div class="res-bar-fill" style="width:${Math.max(4, (r.final / top) * 100)}%"></div>
          </div>
          <div class="res-score">${r.final.toFixed(1)}</div>
        </div>`;
    }).join('');
  }
}

// ── Render: Participants ──────────────────────────────────────────────────────
function renderParticipants(started) {
  const grid = el('participants-grid');
  if (!grid) return;
  const base = `${REPO}/tree/main/participants/`;
  grid.innerHTML = PARTICIPANTS.map(p => {
    const initials = p.name.split(' ').map(w => w[0]).join('').slice(0, 2);
    const promptText = started && p.prompt ? `Challenge #${p.prompt}` : started ? 'Assigned at T-0' : 'Drawn at T-0';
    const statusMap = {
      pending:   ['Pending',     'status-pending'],
      partial:   ['In Progress', 'status-partial'],
      submitted: ['Submitted',   'status-submitted'],
    };
    const [statusLabel, statusClass] = statusMap[p.status] ?? statusMap.pending;
    return `
      <div class="p-card">
        <div class="p-avatar">${initials}</div>
        <div class="p-name">${p.name}</div>
        <div class="p-prompt">${promptText}</div>
        <span class="p-status ${statusClass}">
          <span class="status-dot"></span>${statusLabel}
        </span>
        <a class="p-link" href="${base}${p.slug}/" target="_blank" rel="noopener">View folder →</a>
      </div>`;
  }).join('');
}

// ── Render: Timeline state ────────────────────────────────────────────────────
function updateTimeline(elapsedH) {
  PHASES.forEach((p, i) => {
    const item = el(`tl-${i}`);
    if (!item) return;
    item.classList.toggle('done',   elapsedH >= p.end);
    item.classList.toggle('active', elapsedH >= p.start && elapsedH < p.end);
  });
  const twistEl = el('tl-twist');
  if (twistEl) {
    const twistEnd = TWIST_HOUR + TWIST_VOTE_MIN / 60;
    twistEl.classList.toggle('done',   elapsedH >= twistEnd);
    twistEl.classList.toggle('active', elapsedH >= TWIST_HOUR && elapsedH < twistEnd);
  }
}

// ── Countdown tick ────────────────────────────────────────────────────────────
let prevH = '--', prevM = '--', prevS = '--';

function updateDigit(id, value) {
  const span = el(id);
  if (!span || span.textContent === value) return;
  span.textContent = value;
  animate(span, { scale: [1.18, 1], opacity: [0.6, 1] }, { duration: 280, ease: 'outBack' });
}

function tick() {
  const now        = new Date();
  const msToStart  = HACKATHON_START - now;
  const msFromStart= now - HACKATHON_START;
  const started    = msToStart <= 0;
  const ended      = started && msFromStart >= 24 * 3600 * 1000;
  const elapsedH   = started ? msFromStart / 3600000 : 0;

  // ── Countdown digits
  let h, m, s, label, statusText;
  let units = ['Hours', 'Min', 'Sec'];

  if (!started) {
    // Beyond 48 hours out, an hours-only readout is both unhelpful and wide enough
    // to crowd the separators (e.g. "605"). Switch to days for the long wait.
    if (msToStart > 48 * 3600 * 1000) {
      const totalMin = Math.floor(msToStart / 60000);
      h = Math.floor(totalMin / 1440);            // days
      m = Math.floor((totalMin % 1440) / 60);     // hours
      s = totalMin % 60;                          // minutes
      units = ['Days', 'Hours', 'Min'];
    } else {
      ({ h, m, s } = msToHMS(msToStart));
    }
    label = 'Hackathon Starts In';
    statusText = `${HACKATHON_START.toLocaleDateString(undefined, { weekday:'long', month:'long', day:'numeric' })} · ${HACKATHON_START.toLocaleTimeString(undefined, { hour:'2-digit', minute:'2-digit' })}`;
  } else if (!ended) {
    ({ h, m, s } = msToHMS(HACKATHON_END - now));
    label = 'Time Remaining';
    const phase = currentPhase(elapsedH);
    statusText = phase ? `Phase: ${phase.emoji} ${phase.label}` : 'Final moments';
  } else {
    h = 0; m = 0; s = 0;
    label = 'Hackathon Complete';
    statusText = `Ended ${HACKATHON_END.toLocaleDateString(undefined, { month:'long', day:'numeric' })} · Judging in progress`;
  }

  const hStr = pad2(h), mStr = pad2(m), sStr = pad2(s);
  el('cd-label').textContent  = label;
  el('cd-status').textContent = statusText;
  updateDigit('cd-h', hStr);
  updateDigit('cd-m', mStr);
  updateDigit('cd-s', sStr);

  ['cd-u1', 'cd-u2', 'cd-u3'].forEach((id, i) => {
    const node = el(id);
    if (node && node.textContent !== units[i]) node.textContent = units[i];
  });

  // ── Progress bar
  const pct = started && !ended
    ? Math.min(100, (msFromStart / (24 * 3600 * 1000)) * 100)
    : started ? 100 : 0;
  el('bar-fill').style.width = pct + '%';
  if (started && !ended) el('bar-label').textContent = `${Math.floor(elapsedH)}h elapsed`;

  // ── Phase pill
  const phasePill = el('js-phase');
  if (started && !ended) {
    phasePill.classList.add('visible');
    const phase = currentPhase(elapsedH);
    if (phase) {
      el('phase-dot').style.background = phase.color;
      el('phase-label').textContent = `${phase.emoji} ${phase.label}`;
      el('phase-sub').textContent = `· ${(phase.end - elapsedH).toFixed(1)}h remaining in phase`;
    }
  } else {
    phasePill.classList.remove('visible');
  }

  // ── Timeline dots
  if (started) updateTimeline(elapsedH);

  // ── Twist status
  const twistEl = el('twist-status');
  if (twistEl && started) {
    twistEl.classList.add('visible');
    const votingOpen = elapsedH >= TWIST_HOUR && elapsedH < TWIST_HOUR + TWIST_VOTE_MIN / 60;
    twistEl.classList.toggle('live', votingOpen);

    if (votingOpen) {
      el('twist-icon').textContent  = '⚡';
      el('twist-title').textContent = 'VOTING IS NOW OPEN — React 👍 on the pinned GitHub issue';
      const minsLeft = Math.ceil((TWIST_HOUR + TWIST_VOTE_MIN / 60 - elapsedH) * 60);
      el('twist-desc').textContent  = `Voting closes in ${minsLeft} minute${minsLeft !== 1 ? 's' : ''}. Most 👍 reactions wins.`;
    } else if (WINNING_TWIST) {
      const winner = TWISTS.find(t => t.id === WINNING_TWIST);
      el('twist-icon').textContent  = '✅';
      el('twist-title').textContent = `Winning Twist: ${WINNING_TWIST} — ${winner?.name ?? ''}`;
      el('twist-desc').textContent  = 'This constraint is in effect for all designs.';
    } else if (elapsedH >= TWIST_HOUR && !ended) {
      el('twist-icon').textContent  = '🗳️';
      el('twist-title').textContent = 'Twist announced — check the pinned GitHub issue';
      el('twist-desc').textContent  = 'Apply the winning constraint to your design.';
    } else if (!ended) {
      el('twist-icon').textContent  = '⏳';
      el('twist-title').textContent = `Twist vote opens in ${(TWIST_HOUR - elapsedH).toFixed(1)} hours`;
      el('twist-desc').textContent  = '16 constraints are on the table. React 👍 on the GitHub issue to vote.';
    }
  }

  // ── Participants (re-render once on start to update prompt visibility)
  renderParticipants(started);
}

// ── Scroll-reveal animation ───────────────────────────────────────────────────
function initScrollReveal() {
  const targets = document.querySelectorAll(
    '.tl-item, .twist-group, .deliv-item, .p-card, .tool-card, .brief-block, .challenge-tags'
  );

  // Hide before observing (graceful: only set if JS is running)
  targets.forEach(t => {
    t.style.opacity = '0';
    t.style.transform = 'translateY(20px)';
  });

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      // Stagger siblings in the same parent
      const parent = entry.target.parentElement;
      const siblings = [...parent.children].filter(c =>
        c.style.opacity === '0' || c === entry.target
      );

      animate(siblings.length > 1 ? siblings : entry.target, {
        opacity: [0, 1],
        translateY: [20, 0],
      }, {
        duration: 550,
        ease: 'outExpo',
        delay: stagger(65),
      });

      siblings.forEach(s => observer.unobserve(s));
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -48px 0px' });

  targets.forEach(t => observer.observe(t));
}

// ── Rubric bars animate on scroll ─────────────────────────────────────────────
function initRubricAnimation() {
  const bars = document.querySelectorAll('.rubric-bar-fill');
  if (!bars.length) return;

  const observer = new IntersectionObserver(entries => {
    if (!entries.some(e => e.isIntersecting)) return;
    bars.forEach(bar => {
      const pts = parseInt(bar.dataset.pts, 10);
      const max = parseInt(bar.dataset.max, 10);
      animate(bar, {
        width: [`0%`, `${(pts / max) * 100}%`],
      }, {
        duration: 900,
        ease: 'outExpo',
        delay: stagger(80),
      });
    });
    observer.disconnect();
  }, { threshold: 0.3 });

  const list = el('rubric-list');
  if (list) observer.observe(list);
}

// ── Example card entrance ─────────────────────────────────────────────────────
function initExampleCard() {
  const card = el('js-example-card');
  if (!card) return;
  card.style.opacity = '0';
  card.style.transform = 'translateY(28px)';

  const observer = new IntersectionObserver(entries => {
    if (!entries[0].isIntersecting) return;
    animate(card, {
      opacity: [0, 1],
      translateY: [28, 0],
    }, { duration: 700, ease: 'outExpo' });

    // Stagger the brief-blocks inside
    const blocks = card.querySelectorAll('.brief-block');
    blocks.forEach(b => { b.style.opacity = '0'; b.style.transform = 'translateY(14px)'; });
    animate(blocks, {
      opacity: [0, 1],
      translateY: [14, 0],
    }, { duration: 500, ease: 'outExpo', delay: stagger(80, { start: 250 }) });

    observer.disconnect();
  }, { threshold: 0.1 });

  observer.observe(card);
}

// ── Section headers fade-in ────────────────────────────────────────────────────
function initSectionHeaders() {
  const headers = document.querySelectorAll('.section-label, .section-title, .section-desc');
  headers.forEach(h => { h.style.opacity = '0'; h.style.transform = 'translateY(12px)'; });

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      animate(entry.target, {
        opacity: [0, 1],
        translateY: [12, 0],
      }, { duration: 480, ease: 'outExpo' });
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.2, rootMargin: '0px 0px -32px 0px' });

  headers.forEach(h => observer.observe(h));
}

// ── Static finalize ───────────────────────────────────────────────────────────
// The no-animation path. The rubric bars are emitted at width:0 for the tween to
// fill, so without a tween they have to be set to their final widths here or they
// render as empty tracks.
function finalizeStatic() {
  document.querySelectorAll('.rubric-bar-fill').forEach(bar => {
    const pts = parseInt(bar.dataset.pts, 10);
    const max = parseInt(bar.dataset.max, 10);
    if (Number.isFinite(pts) && Number.isFinite(max) && max > 0) {
      bar.style.width = `${(pts / max) * 100}%`;
    }
  });
}

// ── Init ──────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {
  // ── Phase 1: content and clock. No external dependency, runs first, always.
  renderTwists();
  renderRubric();
  renderChallenges();
  renderResults();
  renderParticipants(new Date() >= HACKATHON_START);
  renderHeroDate();

  tick();
  setInterval(tick, 1000);

  // ── Phase 2: animation, if it is available.
  // Nothing above is hidden until we know the tween library actually loaded —
  // otherwise a CDN failure would leave elements stuck at opacity 0.
  const ok = await loadAnimations();

  if (!ok) {
    finalizeStatic();
    return;
  }

  // Respect the OS reduced-motion preference: render the finished state directly.
  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
    finalizeStatic();
    return;
  }

  // Safe to hide now — the tweens that reveal these are guaranteed to exist.
  ['#js-eyebrow', '#js-title', '#js-sub', '#js-date', '#js-countdown', '#js-bar'].forEach(sel => {
    const node = document.querySelector(sel);
    if (node) node.style.opacity = '0';
  });

  initSectionHeaders();
  initExampleCard();
  initScrollReveal();
  initRubricAnimation();

  // Hero entrance — one frame delay ensures initial opacity renders before tweening
  requestAnimationFrame(() => {
    createTimeline({ ease: 'outExpo' })
      .add('#js-eyebrow',   { opacity: [0, 1], translateY: [14, 0], duration: 500 }, 80)
      .add('#js-title',     { opacity: [0, 1], translateY: [20, 0], duration: 620 }, 180)
      .add('#js-sub',       { opacity: [0, 1], translateY: [14, 0], duration: 500 }, 320)
      .add('#js-date',      { opacity: [0, 1], translateY: [10, 0], duration: 400 }, 420)
      .add('#js-countdown', { opacity: [0, 1], translateY: [24, 0], scale: [0.97, 1], duration: 650 }, 520)
      .add('#js-bar',       { opacity: [0, 1], duration: 400 }, 820);
  });
});
