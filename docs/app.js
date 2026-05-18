// ── Configuration ─────────────────────────────────────────────────────────
// Update HACKATHON_START to set the official start time.
const HACKATHON_START = new Date('2026-05-18T17:00:00');
const HACKATHON_DURATION_MS = 24 * 60 * 60 * 1000;
const HACKATHON_END = new Date(HACKATHON_START.getTime() + HACKATHON_DURATION_MS);
const TWIST_HOUR = 12;
const TWIST_VOTE_DURATION_MIN = 30;

// Update participant names, slugs, assigned prompts, and submission status here.
// status: 'pending' | 'partial' | 'submitted'
const PARTICIPANTS = [
  { name: 'Participant 1', slug: 'participant-1', prompt: null, status: 'pending' },
  { name: 'Participant 2', slug: 'participant-2', prompt: null, status: 'pending' },
  { name: 'Participant 3', slug: 'participant-3', prompt: null, status: 'pending' },
  { name: 'Participant 4', slug: 'participant-4', prompt: null, status: 'pending' },
  { name: 'Participant 5', slug: 'participant-5', prompt: null, status: 'pending' },
];

// Set to the winning twist ID (e.g., 'M2') once announced, or null before.
const WINNING_TWIST = null;

const PHASES = [
  { label: 'Research & Ideation',    start: 0,  end: 2,  color: '#58a6ff', emoji: '🔍' },
  { label: 'Engineering Design',     start: 2,  end: 10, color: '#3fb950', emoji: '⚙️' },
  { label: 'Prototype & Simulation', start: 10, end: 18, color: '#d29922', emoji: '🔬' },
  { label: 'Packaging & Pitch',      start: 18, end: 24, color: '#f0883e', emoji: '📦' },
];

const CHALLENGES = [
  {
    id: 1,
    title: 'The Forgotten Stove Problem',
    body: 'Retrofittable smart add-on that prevents kitchen fires from unattended stoves via presence/cooking detection and automatic intervention.',
  },
  {
    id: 2,
    title: 'Laundry Guardian',
    body: 'Detects washer/dryer cycle completion without modifying the appliance, notifies the user, and prevents mildew or rewashing.',
  },
  {
    id: 3,
    title: 'Nighttime Bathroom Safety',
    body: 'Low-power device for elderly or tired users that detects nighttime room entry and provides safe illumination with minimal sleep disruption.',
  },
  {
    id: 4,
    title: 'Phantom Power Killer',
    body: 'Eliminates vampire power draw by detecting room occupancy and cutting power to idle devices without disrupting active ones.',
  },
  {
    id: 5,
    title: 'Pet Home Alone Companion',
    body: 'Monitors pet well-being remotely, detects activity/inactivity, provides interventions (toy/treat/sound), and gives the owner real-time feedback.',
  },
];

const TWISTS = [
  { id: 'P1', name: 'Battery Only',          cat: 'Power',         desc: 'Must run on a single CR2032 or AA cell. No wall power.' },
  { id: 'P2', name: 'Solar Powered',         cat: 'Power',         desc: 'Must function solely on ambient light energy harvesting. No backup battery.' },
  { id: 'P3', name: '5mW Budget',            cat: 'Power',         desc: 'Total average device power consumption cannot exceed 5mW.' },
  { id: 'C1', name: 'No WiFi',               cat: 'Connectivity',  desc: 'Remove WiFi/internet. BLE or LoRa communication only.' },
  { id: 'C2', name: 'Offline Only',          cat: 'Connectivity',  desc: 'No cloud, no app, no phone. All intelligence is local to the device.' },
  { id: 'C3', name: 'One-Wire Output',       cat: 'Connectivity',  desc: 'The only output to the user is a single LED or buzzer. Nothing else.' },
  { id: 'M1', name: 'No Screws',             cat: 'Mechanical',    desc: 'Enclosure must be entirely tool-free: snap fits, magnets, or friction only.' },
  { id: 'M2', name: '100mm Cube Max',        cat: 'Mechanical',    desc: 'Entire device must fit inside a 100×100×100mm cube.' },
  { id: 'M3', name: 'Repurposed Enclosure',  cat: 'Mechanical',    desc: 'Housing must reuse an existing household object (Altoids tin, pill bottle, etc.).' },
  { id: '$1', name: '$15 BOM Cap',           cat: 'Cost',          desc: 'Total bill of materials cannot exceed $15 USD. Include BOM with prices.' },
  { id: '$2', name: '3-Component Rule',      cat: 'Cost',          desc: 'Active component count (ICs, MCUs, modules, sensors) is capped at 3 total.' },
  { id: '$3', name: 'No Microcontroller',    cat: 'Cost',          desc: 'Core logic must use analog circuitry only (555, op-amps, comparators). No MCU.' },
  { id: 'S1', name: 'Add Accessibility',     cat: 'Scope',         desc: 'Must be fully operable by someone with limited or no vision, or limited hand mobility.' },
  { id: 'S2', name: 'Child Safe',            cat: 'Scope',         desc: 'Safe for children under 5. No exposed wires, all voltages ≤5V, no small parts.' },
  { id: 'S3', name: 'Rental Friendly',       cat: 'Scope',         desc: 'Cannot attach permanently to any surface (no adhesives, no drilling).' },
  { id: 'S4', name: 'Fail Safe Mode',        cat: 'Scope',         desc: 'On any power loss or failure, must automatically transition to a defined safe state.' },
];

const RUBRIC = [
  { category: 'Problem Relevance',           points: 15 },
  { category: 'Creativity',                  points: 20 },
  { category: 'Electrical Engineering',      points: 15 },
  { category: 'Mechanical Design',           points: 15 },
  { category: 'Feasibility / Manufacturability', points: 20 },
  { category: 'Documentation & Presentation', points: 15 },
];

// ── Helpers ────────────────────────────────────────────────────────────────
function pad2(n) { return String(Math.floor(n)).padStart(2, '0'); }
function msToHMS(ms) {
  const totalSec = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  return { h, m, s };
}
function getCurrentPhase(elapsedHours) {
  return PHASES.find(p => elapsedHours >= p.start && elapsedHours < p.end) || null;
}
function isTwistVotingOpen(elapsedMs) {
  const elapsedHours = elapsedMs / 3600000;
  return elapsedHours >= TWIST_HOUR && elapsedHours < (TWIST_HOUR + TWIST_VOTE_DURATION_MIN / 60);
}
function isTwistPast(elapsedMs) {
  return elapsedMs / 3600000 >= TWIST_HOUR;
}

// ── Render Functions ───────────────────────────────────────────────────────
function renderPrompts(revealed) {
  const grid = document.getElementById('prompts-grid');
  if (!grid) return;
  grid.innerHTML = CHALLENGES.map(c => {
    if (!revealed) {
      return `
        <div class="prompt-card locked">
          <div class="prompt-lock-overlay">
            <div class="lock-icon">🔒</div>
            <div class="prompt-card-number">Challenge #${c.id}</div>
            <div class="lock-text">Revealed at T+0</div>
          </div>
        </div>`;
    }
    return `
      <div class="prompt-card">
        <div class="prompt-accent"></div>
        <div class="prompt-card-number">Challenge #${c.id}</div>
        <div class="prompt-card-title">${c.title}</div>
        <div class="prompt-card-body">${c.body}</div>
      </div>`;
  }).join('');
}

function renderTwists() {
  const container = document.getElementById('twist-categories');
  if (!container) return;
  const categories = [...new Set(TWISTS.map(t => t.cat))];
  container.innerHTML = categories.map(cat => {
    const options = TWISTS.filter(t => t.cat === cat);
    return `
      <div class="twist-category">
        <div class="twist-category-header">${cat} Constraints</div>
        <div class="twist-options">
          ${options.map(t => `
            <div class="twist-option${WINNING_TWIST === t.id ? ' winner' : ''}">
              <div class="twist-id">${t.id}</div>
              <div>
                <div class="twist-option-name">${t.name}${WINNING_TWIST === t.id ? ' <span class="winner-badge">✓ Winner</span>' : ''}</div>
                <div class="twist-option-desc">${t.desc}</div>
              </div>
            </div>`).join('')}
        </div>
      </div>`;
  }).join('');
}

function renderRubric() {
  const tbody = document.getElementById('rubric-tbody');
  if (!tbody) return;
  const total = RUBRIC.reduce((s, r) => s + r.points, 0);
  const maxPoints = Math.max(...RUBRIC.map(r => r.points));
  tbody.innerHTML = RUBRIC.map(r => `
    <tr>
      <td>${r.category}</td>
      <td>
        <span class="rubric-bar" style="width:${(r.points / maxPoints) * 80}px"></span>
        ${r.points}
      </td>
    </tr>`).join('') + `
    <tr>
      <td><strong>TOTAL</strong></td>
      <td>${total}</td>
    </tr>`;
}

function renderParticipants(revealed) {
  const grid = document.getElementById('participants-grid');
  if (!grid) return;
  const repoBase = 'https://github.com/claws02/electromechanical-hackathon-2026/tree/main/participants/';
  grid.innerHTML = PARTICIPANTS.map((p, i) => {
    const initials = p.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
    const promptLabel = revealed && p.prompt ? `Challenge #${p.prompt}` : (revealed ? 'Assigned at T-0' : 'TBD');
    const statusClass = `status-${p.status}`;
    const statusLabel = p.status === 'submitted' ? 'Submitted' : p.status === 'partial' ? 'In Progress' : 'Pending';
    return `
      <div class="participant-card">
        <div class="participant-avatar">${initials}</div>
        <div class="participant-name">${p.name}</div>
        <div class="participant-prompt">${promptLabel}</div>
        <span class="participant-status ${statusClass}">
          <span class="status-dot"></span>${statusLabel}
        </span>
        <a class="participant-link" href="${repoBase}${p.slug}/" target="_blank">View Submission →</a>
      </div>`;
  }).join('');
}

function renderTimeline(elapsedHours) {
  const items = document.querySelectorAll('.timeline-item[data-phase]');
  items.forEach(item => {
    const phaseIdx = parseInt(item.dataset.phase, 10);
    const phase = PHASES[phaseIdx];
    item.classList.remove('active', 'completed');
    if (elapsedHours >= phase.end) item.classList.add('completed');
    else if (elapsedHours >= phase.start) item.classList.add('active');
  });
  const twistItem = document.querySelector('.timeline-item[data-twist]');
  if (twistItem) {
    twistItem.classList.remove('active', 'completed');
    if (elapsedHours >= TWIST_HOUR + TWIST_VOTE_DURATION_MIN / 60) twistItem.classList.add('completed');
    else if (elapsedHours >= TWIST_HOUR) twistItem.classList.add('active');
  }
}

// ── Main Tick Loop ─────────────────────────────────────────────────────────
function tick() {
  const now = new Date();
  const msToStart = HACKATHON_START - now;
  const msFromStart = now - HACKATHON_START;
  const started = msToStart <= 0;
  const ended = msFromStart >= HACKATHON_DURATION_MS;
  const elapsedHours = Math.max(0, msFromStart / 3600000);

  // Countdown display
  const cdLabel = document.getElementById('cd-label');
  const cdH = document.getElementById('cd-h');
  const cdM = document.getElementById('cd-m');
  const cdS = document.getElementById('cd-s');
  const cdStatus = document.getElementById('cd-status');

  if (!started) {
    const { h, m, s } = msToHMS(msToStart);
    if (cdLabel) cdLabel.textContent = 'Hackathon Starts In';
    if (cdH) cdH.textContent = pad2(h);
    if (cdM) cdM.textContent = pad2(m);
    if (cdS) cdS.textContent = pad2(s);
    if (cdStatus) cdStatus.textContent = `${HACKATHON_START.toLocaleDateString(undefined, { weekday:'long', month:'long', day:'numeric' })} at ${HACKATHON_START.toLocaleTimeString(undefined, { hour:'2-digit', minute:'2-digit' })}`;
  } else if (!ended) {
    const msRemaining = HACKATHON_END - now;
    const { h, m, s } = msToHMS(msRemaining);
    if (cdLabel) cdLabel.textContent = 'Time Remaining';
    if (cdH) cdH.textContent = pad2(h);
    if (cdM) cdM.textContent = pad2(m);
    if (cdS) cdS.textContent = pad2(s);
    const phase = getCurrentPhase(elapsedHours);
    if (cdStatus) cdStatus.textContent = phase ? `Current phase: ${phase.emoji} ${phase.label}` : 'Hackathon in progress';
  } else {
    if (cdLabel) cdLabel.textContent = 'Hackathon Complete';
    if (cdH) cdH.textContent = '00';
    if (cdM) cdM.textContent = '00';
    if (cdS) cdS.textContent = '00';
    if (cdStatus) cdStatus.textContent = `Ended ${HACKATHON_END.toLocaleDateString(undefined, { month:'long', day:'numeric' })} · Judging in progress`;
  }

  // Overall progress bar
  const fill = document.getElementById('progress-fill');
  if (fill) {
    const pct = started ? Math.min(100, (msFromStart / HACKATHON_DURATION_MS) * 100) : 0;
    fill.style.width = pct + '%';
  }
  const progressPct = document.getElementById('progress-pct');
  if (progressPct && started && !ended) {
    progressPct.textContent = `${Math.floor(elapsedHours)}h elapsed`;
  }

  // Phase banner (only during hackathon)
  const phaseBanner = document.getElementById('phase-banner');
  if (phaseBanner) {
    if (started && !ended) {
      phaseBanner.style.display = 'block';
      const phase = getCurrentPhase(elapsedHours);
      const phaseName = document.getElementById('phase-name');
      const phaseTime = document.getElementById('phase-time');
      if (phase) {
        if (phaseName) phaseName.textContent = `${phase.emoji} ${phase.label}`;
        if (phaseTime) {
          const hoursLeft = phase.end - elapsedHours;
          phaseTime.textContent = `${hoursLeft.toFixed(1)}h remaining in phase`;
        }
        const dot = phaseBanner.querySelector('.phase-dot');
        if (dot) dot.style.background = phase.color;
      } else {
        if (phaseName) phaseName.textContent = 'Final stretch';
        if (phaseTime) phaseTime.textContent = '';
      }
    } else {
      phaseBanner.style.display = 'none';
    }
  }

  // Reveal prompts at T-0
  renderPrompts(started);
  renderTimeline(elapsedHours);
  renderParticipants(started);

  // Twist banner
  const twistBanner = document.getElementById('twist-banner');
  if (twistBanner && started) {
    twistBanner.style.display = 'flex';
    const votingOpen = isTwistVotingOpen(msFromStart);
    const twistPast = isTwistPast(msFromStart);
    twistBanner.classList.toggle('voting-open', votingOpen);
    const twistStatusIcon = document.getElementById('twist-status-icon');
    const twistStatusTitle = document.getElementById('twist-status-title');
    const twistStatusDesc = document.getElementById('twist-status-desc');
    if (votingOpen) {
      if (twistStatusIcon) twistStatusIcon.textContent = '⚡';
      if (twistStatusTitle) twistStatusTitle.innerHTML = '<strong>VOTING IS OPEN</strong>';
      if (twistStatusDesc) twistStatusDesc.textContent = `React to the vote issue on GitHub. Voting closes in ${pad2(Math.floor((TWIST_HOUR + TWIST_VOTE_DURATION_MIN / 60 - elapsedHours) * 60))} minutes.`;
    } else if (WINNING_TWIST) {
      const winner = TWISTS.find(t => t.id === WINNING_TWIST);
      if (twistStatusIcon) twistStatusIcon.textContent = '✅';
      if (twistStatusTitle) twistStatusTitle.innerHTML = `<strong>Winning Twist: ${WINNING_TWIST} — ${winner ? winner.name : ''}</strong>`;
      if (twistStatusDesc) twistStatusDesc.textContent = `All participants must apply this constraint to their design.`;
    } else if (twistPast && !ended) {
      if (twistStatusIcon) twistStatusIcon.textContent = '🗳️';
      if (twistStatusTitle) twistStatusTitle.innerHTML = '<strong>Twist Applied</strong>';
      if (twistStatusDesc) twistStatusDesc.textContent = 'Winning constraint is in effect. Check the pinned GitHub issue for the announcement.';
    } else {
      if (twistStatusIcon) twistStatusIcon.textContent = '⏳';
      if (twistStatusTitle) twistStatusTitle.innerHTML = `<strong>Twist Vote Opens at T+${TWIST_HOUR}h</strong>`;
      const hoursToTwist = TWIST_HOUR - elapsedHours;
      if (twistStatusDesc) twistStatusDesc.textContent = `Voting opens in ${hoursToTwist.toFixed(1)} hours. 16 constraints are on the table.`;
    }
  }
}

// ── Init ───────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  renderTwists();
  renderRubric();
  tick();
  setInterval(tick, 1000);
});
