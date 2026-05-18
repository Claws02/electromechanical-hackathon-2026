// ── Anime.js v4 ─────────────────────────────────────────────────────────────
import { animate, stagger, createTimeline } from 'https://esm.sh/animejs@4.4.1';

// ── Config ──────────────────────────────────────────────────────────────────
// Edit these values to configure the event.

const HACKATHON_START = new Date('2026-05-18T17:00:00');
const HACKATHON_END   = new Date(HACKATHON_START.getTime() + 24 * 60 * 60 * 1000);
const TWIST_HOUR      = 12;   // hours after start
const TWIST_VOTE_MIN  = 30;   // voting window in minutes

// Update participant entries: set name, slug (folder name), prompt (1–5 or null), status.
// status: 'pending' | 'partial' | 'submitted'
const PARTICIPANTS = [
  { name: 'Participant 1', slug: 'participant-1', prompt: null, status: 'pending' },
  { name: 'Participant 2', slug: 'participant-2', prompt: null, status: 'pending' },
  { name: 'Participant 3', slug: 'participant-3', prompt: null, status: 'pending' },
  { name: 'Participant 4', slug: 'participant-4', prompt: null, status: 'pending' },
  { name: 'Participant 5', slug: 'participant-5', prompt: null, status: 'pending' },
];

// Set to the winning twist ID (e.g. 'M2') once announced, or keep null.
const WINNING_TWIST = null;

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

const RUBRIC = [
  { cat: 'Problem Relevance',              pts: 15 },
  { cat: 'Creativity',                     pts: 20 },
  { cat: 'Electrical Engineering Quality', pts: 15 },
  { cat: 'Mechanical Design Quality',      pts: 15 },
  { cat: 'Feasibility & Manufacturability',pts: 20 },
  { cat: 'Documentation & Presentation',   pts: 15 },
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
      <div class="rubric-cat">${r.cat}</div>
      <div class="rubric-bar-track">
        <div class="rubric-bar-fill" data-pts="${r.pts}" data-max="${max}" style="width:0"></div>
      </div>
      <div class="rubric-pts">${r.pts}</div>
    </div>`).join('');
}

// ── Render: Participants ──────────────────────────────────────────────────────
function renderParticipants(started) {
  const grid = el('participants-grid');
  if (!grid) return;
  const base = 'https://github.com/claws02/electromechanical-hackathon-2026/tree/main/participants/';
  grid.innerHTML = PARTICIPANTS.map(p => {
    const initials = p.name.split(' ').map(w => w[0]).join('').slice(0, 2);
    const promptText = started && p.prompt ? `Challenge #${p.prompt}` : started ? 'Assigned at T-0' : 'TBD';
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
  if (!started) {
    ({ h, m, s } = msToHMS(msToStart));
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

// ── Init ──────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // Render dynamic content
  renderTwists();
  renderRubric();
  renderParticipants(new Date() >= HACKATHON_START);

  // Hide hero elements before animating them in (set here so no-JS users still see them)
  ['#js-eyebrow','#js-title','#js-sub','#js-date','#js-countdown','#js-bar'].forEach(sel => {
    const node = document.querySelector(sel);
    if (node) node.style.opacity = '0';
  });

  // Init scroll-triggered animations
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

  // Tick immediately, then every second
  tick();
  setInterval(tick, 1000);
});
