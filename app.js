const els = {
  clipInput: document.getElementById('clipInput'),
  referenceInput: document.getElementById('referenceInput'),
  clipPreview: document.getElementById('clipPreview'),
  referencePreview: document.getElementById('referencePreview'),
  clipMeta: document.getElementById('clipMeta'),
  referenceMeta: document.getElementById('referenceMeta'),
  reviewWorkspace: document.getElementById('reviewWorkspace'),
  referenceCard: document.getElementById('referenceCard'),
  clipTime: document.getElementById('clipTime'),
  referenceTime: document.getElementById('referenceTime'),
  clipFps: document.getElementById('clipFps'),
  referenceFps: document.getElementById('referenceFps'),
  clipSpeed: document.getElementById('clipSpeed'),
  referenceSpeed: document.getElementById('referenceSpeed'),
  keyFramesSection: document.getElementById('keyFramesSection'),
  keyFrames: document.getElementById('keyFrames'),
  clearFramesButton: document.getElementById('clearFramesButton'),
  coachReview: document.getElementById('coachReview'),
  phaseReview: document.getElementById('phaseReview'),
  prioritySection: document.getElementById('prioritySection'),
  priorityBuilderList: document.getElementById('priorityBuilderList'),
  paddlerName: document.getElementById('paddlerName'),
  priorityDepth: document.getElementById('priorityDepth'),
  cameraAngle: document.getElementById('cameraAngle'),
  coachNote: document.getElementById('coachNote'),
  generateButton: document.getElementById('generateButton'),
  resetSelectionsButton: document.getElementById('resetSelectionsButton'),
  selectionStatus: document.getElementById('selectionStatus'),
  resultPanel: document.getElementById('resultPanel'),
  resultTitle: document.getElementById('resultTitle'),
  overallCard: document.getElementById('overallCard'),
  strengthsList: document.getElementById('strengthsList'),
  cuesList: document.getElementById('cuesList'),
  prioritiesList: document.getElementById('prioritiesList'),
  phaseGrid: document.getElementById('phaseGrid'),
  drillsList: document.getElementById('drillsList'),
  drillsCard: document.getElementById('drillsCard'),
  coachNoteCard: document.getElementById('coachNoteCard'),
  coachNoteOutput: document.getElementById('coachNoteOutput'),
  copyButton: document.getElementById('copyButton'),
  printButton: document.getElementById('printButton')
};

const state = {
  clipUrl: null,
  referenceUrl: null,
  clipFile: null,
  referenceFile: null,
  markedFrames: {},
  selectedStrengths: new Set(),
  selectedCorrections: [],
  result: null
};

const phaseLabels = {
  setup: 'Set-up',
  catch: 'Catch',
  pull: 'Pull',
  exit: 'Exit / Recovery'
};

const drillBank = {
  'Pause Before the Catch': {
    purpose: 'Build patience and organization at the front of the stroke.',
    how: 'Start just above the water. Take one controlled stroke, reset to the set position, then repeat. Build to short sets while keeping the front end calm.'
  },
  'Frankenstein': {
    purpose: 'Create reach and power through rotation rather than arm movement.',
    how: 'Keep the elbows straight and move the paddle through torso rotation plus hip and leg movement. Return to normal paddling while keeping the same body-led feel.'
  },
  'Catch and Pull': {
    purpose: 'Separate blade burial from the start of pressure.',
    how: 'Set at the front, bury the blade fully, then begin the pull. Use slow controlled strokes so the catch stays quiet.'
  },
  'Hang Time / Float it Back': {
    purpose: 'Reduce a rushed recovery and help the paddler arrive set before the catch.',
    how: 'Use a slower recovery and let the paddle float forward. Keep the boat running while the body and paddle organize for the next catch.'
  },
  'Push and Pull': {
    purpose: 'Improve connection and the feeling of a loaded blade.',
    how: 'Start fully buried at the front, pull through with good body mechanics, then keep the blade in the water and move it back to the front. Repeat several times.'
  },
  'Find Your Entry Point': {
    purpose: 'Find a strong reachable catch position without overreaching.',
    how: 'Move a fully buried blade forward through the water to the strongest catch point, note that position, then use it as the air reach target.'
  },
  'Tall Paddling': {
    purpose: 'Reinforce long posture and breathing through the stroke.',
    how: 'Contrast a compressed posture with a tall long-spine posture, then paddle while maintaining the taller body shape.'
  }
};

const phases = {
  setup: {
    title: 'Set-up',
    reminder: 'Rotate into the set. Long bottom arm. Long spine. Get organized before the catch.',
    strengths: [
      { id: 'setup-rotation-good', text: 'Good torso rotation into the set.' },
      { id: 'setup-long-arm-good', text: 'Bottom arm stays long toward the catch.' },
      { id: 'setup-posture-good', text: 'Maintains a long spine through the set-up.' },
      { id: 'setup-control-good', text: 'Arrives at the front with good control before the catch.' }
    ],
    corrections: [
      {
        id: 'setup-more-rotation',
        title: 'Create more of the set through rotation',
        observation: 'The set-up could use more torso rotation, with some of the reach currently coming from the arms.',
        correction: 'Rotate into the set and let the torso carry the bottom arm forward. Keep the arm long rather than reaching farther at the last second.',
        cue: 'Rotate into the set.',
        drill: 'Frankenstein'
      },
      {
        id: 'setup-long-bottom-arm',
        title: 'Keep the bottom arm long into the set',
        observation: 'The bottom arm shortens as you approach the catch.',
        correction: 'Establish the long bottom arm during the recovery and carry that structure into the set position.',
        cue: 'Long bottom arm into the set.',
        drill: 'Frankenstein'
      },
      {
        id: 'setup-long-spine',
        title: 'Maintain a longer spine at the front',
        observation: 'The upper body compresses or rounds as you move into the set position.',
        correction: 'Reach through rotation and a controlled hip position while keeping the spine long and the chest proud.',
        cue: 'Stay long at the front.',
        drill: 'Tall Paddling'
      },
      {
        id: 'setup-rushed',
        title: 'Get fully set before the catch',
        observation: 'The recovery moves quickly into the catch without a clear moment of organization at the front.',
        correction: 'Arrive at the set position first, then use a very small moment of control before initiating the catch. It should not become a visible stop.',
        cue: 'Get set first.',
        drill: 'Hang Time / Float it Back'
      },
      {
        id: 'setup-overreach',
        title: 'Avoid reaching past your strong position',
        observation: 'The final part of the reach appears to come from overextending rather than maintaining a strong set position.',
        correction: 'Use the strongest reachable set position. More length is not helpful if the spine, shoulder, or arm structure collapses.',
        cue: 'Strong reach, not maximum reach.',
        drill: 'Find Your Entry Point'
      }
    ]
  },
  catch: {
    title: 'Catch',
    reminder: 'From the set, hinge as the blade drops. Hinge and burial happen together. Bury before meaningful pressure.',
    strengths: [
      { id: 'catch-controlled-good', text: 'Catch is controlled and relatively quiet.' },
      { id: 'catch-hinge-good', text: 'Hinge and blade entry happen together.' },
      { id: 'catch-burial-good', text: 'Blade appears to establish a full catch before the power phase.' },
      { id: 'catch-position-good', text: 'Maintains a strong body position as the blade enters.' }
    ],
    corrections: [
      {
        id: 'catch-rushed',
        title: 'Calm down the catch',
        observation: 'The catch looks rushed from the set position into blade entry.',
        correction: 'Keep the small moment of control at the front, then initiate the catch with a coordinated hinge and blade drop.',
        cue: 'Set, then hinge and bury.',
        drill: 'Pause Before the Catch'
      },
      {
        id: 'catch-hinge',
        title: 'Use a clearer hinge into the catch',
        observation: 'The body stays relatively upright while the blade enters.',
        correction: 'From the set position, hinge forward from the hips as the blade drops. Keep the spine long and let the hinge and blade entry happen together.',
        cue: 'Hinge and bury.',
        drill: 'Catch and Pull'
      },
      {
        id: 'catch-too-deep-hinge',
        title: 'Control the depth of the hinge',
        observation: 'The body drops very low into the catch and the chest begins to close toward the water.',
        correction: 'Keep the hinge, but maintain a long spine and proud chest rather than diving down for extra reach.',
        cue: 'Hinge, but stay long.',
        drill: 'Tall Paddling'
      },
      {
        id: 'catch-before-burial',
        title: 'Bury before applying pressure',
        observation: 'Pressure appears to begin while the blade is still entering the water.',
        correction: 'Let the blade drop to a full catch first, then connect and begin the power phase.',
        cue: 'Bury first, then go.',
        drill: 'Catch and Pull'
      },
      {
        id: 'catch-noisy',
        title: 'Make the entry quieter',
        observation: 'There is extra splash or disturbance at the front of the stroke.',
        correction: 'Keep the set controlled and drop the blade cleanly with the hinge instead of attacking the water.',
        cue: 'Quiet catch.',
        drill: 'Catch and Pull'
      }
    ]
  },
  pull: {
    title: 'Pull',
    reminder: 'Connect, maintain top-arm drive, derotate through the hips and torso, and progressively return toward tall.',
    strengths: [
      { id: 'pull-top-arm-good', text: 'Good top-arm drive through the power phase.' },
      { id: 'pull-derotation-good', text: 'Uses torso and hip derotation effectively through the pull.' },
      { id: 'pull-long-arm-good', text: 'Bottom arm stays relatively long through the useful power phase.' },
      { id: 'pull-posture-good', text: 'Maintains a long spine and proud chest through the pull.' }
    ],
    corrections: [
      {
        id: 'pull-derotate',
        title: 'Derotate more clearly through the pull',
        observation: 'There is room to use more torso and hip derotation after the blade connects.',
        correction: 'Once connected, let the hips and torso progressively unwind while maintaining pressure on the blade.',
        cue: 'Connect and derotate.',
        drill: 'Frankenstein'
      },
      {
        id: 'pull-stays-low',
        title: 'Progressively return toward tall',
        observation: 'The body remains folded forward for too much of the power phase.',
        correction: 'After connection, derotate and progressively bring the torso back toward tall while keeping the chest proud and spine long.',
        cue: 'Chest proud and derotate.',
        drill: 'Tall Paddling'
      },
      {
        id: 'pull-bottom-arm',
        title: 'Reduce the late bottom-arm pull',
        observation: 'The bottom elbow begins to bend and actively draw the paddle back later in the pull.',
        correction: 'Keep the bottom arm connected to the body movement and let the torso and hips continue to drive the useful part of the stroke.',
        cue: 'Body moves the paddle.',
        drill: 'Frankenstein'
      },
      {
        id: 'pull-connection',
        title: 'Strengthen connection to the blade',
        observation: 'The stroke could hold a more consistent loaded feel once the blade is buried.',
        correction: 'Establish the blade first, then move the body against that connection instead of letting the paddle slip through the water.',
        cue: 'Feel the heavy water.',
        drill: 'Push and Pull'
      },
      {
        id: 'pull-chest',
        title: 'Keep the chest proud through the power phase',
        observation: 'The shoulders and chest close as the pull develops.',
        correction: 'Maintain a long spine and proud chest while derotating. Avoid crunching down to keep the stroke going.',
        cue: 'Chest proud, stay long.',
        drill: 'Tall Paddling'
      }
    ]
  },
  exit: {
    title: 'Exit / Recovery',
    reminder: 'Release quickly at the hip. Do not assume a long pull when the real issue is simply a delayed exit. Recover relaxed and set early.',
    strengths: [
      { id: 'exit-hip-good', text: 'Release begins around the hip.' },
      { id: 'exit-quick-good', text: 'Blade comes out quickly and cleanly.' },
      { id: 'exit-recovery-good', text: 'Recovery is relaxed and gives time to reset.' },
      { id: 'exit-set-good', text: 'Paddle gets organized early during recovery.' }
    ],
    corrections: [
      {
        id: 'exit-late',
        title: 'Make the exit quicker at the hip',
        observation: 'The blade reaches the hip but stays buried too long before releasing.',
        correction: 'Once the blade reaches the hip, release it quickly rather than allowing it to linger and travel behind you.',
        cue: 'Quick out at the hip.',
        drill: 'Hang Time / Float it Back'
      },
      {
        id: 'exit-pull-past',
        title: 'Finish the power before pulling behind the hip',
        observation: 'The paddle continues to be actively drawn behind the hip before the release.',
        correction: 'Finish useful pressure at the hip and transition immediately into the exit instead of squeezing extra length from the back of the stroke.',
        cue: 'Finish at the hip.',
        drill: 'Hang Time / Float it Back'
      },
      {
        id: 'exit-awkward',
        title: 'Clean up the exit path',
        observation: 'The transition from the end of the pull into recovery looks awkward or indirect.',
        correction: 'Keep the release compact. Once at the hip, get the blade clear and move forward into the recovery without extra movement behind the body.',
        cue: 'Out and forward.',
        drill: 'Hang Time / Float it Back'
      },
      {
        id: 'exit-rushed-recovery',
        title: 'Relax the recovery',
        observation: 'The paddle rushes forward after the exit and the next set-up becomes compressed.',
        correction: 'Use the recovery to reset the body and paddle early. Let the boat run while you organize for the next catch.',
        cue: 'Let it run, set early.',
        drill: 'Hang Time / Float it Back'
      }
    ]
  }
};

function formatBytes(bytes) {
  if (!bytes) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  return `${(bytes / (1024 ** i)).toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

function revoke(url) {
  if (url) URL.revokeObjectURL(url);
}

function escapeHtml(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function loadVideo(file, kind) {
  if (!file) return;
  const isClip = kind === 'clip';
  const video = isClip ? els.clipPreview : els.referencePreview;
  const meta = isClip ? els.clipMeta : els.referenceMeta;
  if (isClip) {
    revoke(state.clipUrl);
    state.clipUrl = URL.createObjectURL(file);
    state.clipFile = file;
    state.markedFrames = {};
    renderKeyFrames();
  } else {
    revoke(state.referenceUrl);
    state.referenceUrl = URL.createObjectURL(file);
    state.referenceFile = file;
  }
  video.src = isClip ? state.clipUrl : state.referenceUrl;
  video.load();
  meta.textContent = `${file.name} · ${formatBytes(file.size)}`;
  meta.classList.remove('hidden');
  if (isClip) {
    els.reviewWorkspace.classList.remove('hidden');
    els.coachReview.classList.remove('hidden');
  } else {
    els.referenceCard.classList.remove('hidden');
  }
}

els.clipInput.addEventListener('change', e => loadVideo(e.target.files[0], 'clip'));
els.referenceInput.addEventListener('change', e => loadVideo(e.target.files[0], 'reference'));

for (const [dropId, input] of [['clipDropZone', els.clipInput], ['referenceDropZone', els.referenceInput]]) {
  const zone = document.getElementById(dropId);
  ['dragenter', 'dragover'].forEach(name => zone.addEventListener(name, e => {
    e.preventDefault();
    zone.classList.add('dragging');
  }));
  ['dragleave', 'drop'].forEach(name => zone.addEventListener(name, e => {
    e.preventDefault();
    zone.classList.remove('dragging');
  }));
  zone.addEventListener('drop', e => {
    const file = [...e.dataTransfer.files].find(f => f.type.startsWith('video/') || /\.(mov|mp4|m4v|webm)$/i.test(f.name));
    if (!file) return;
    loadVideo(file, input === els.clipInput ? 'clip' : 'reference');
  });
}

function updateTime(video, target) {
  target.textContent = `${(video.currentTime || 0).toFixed(2)}s`;
}

els.clipPreview.addEventListener('timeupdate', () => updateTime(els.clipPreview, els.clipTime));
els.referencePreview.addEventListener('timeupdate', () => updateTime(els.referencePreview, els.referenceTime));
els.clipPreview.addEventListener('loadedmetadata', () => updateTime(els.clipPreview, els.clipTime));
els.referencePreview.addEventListener('loadedmetadata', () => updateTime(els.referencePreview, els.referenceTime));

els.clipSpeed.addEventListener('change', () => { els.clipPreview.playbackRate = Number(els.clipSpeed.value); });
els.referenceSpeed.addEventListener('change', () => { els.referencePreview.playbackRate = Number(els.referenceSpeed.value); });
els.clipPreview.playbackRate = Number(els.clipSpeed.value);
els.referencePreview.playbackRate = Number(els.referenceSpeed.value);

function getVideo(kind) {
  return kind === 'clip' ? els.clipPreview : els.referencePreview;
}

function getFps(kind) {
  return Number(kind === 'clip' ? els.clipFps.value : els.referenceFps.value) || 30;
}

function nudgeVideo(kind, seconds) {
  const video = getVideo(kind);
  video.pause();
  const duration = Number.isFinite(video.duration) ? video.duration : Infinity;
  video.currentTime = Math.max(0, Math.min(video.currentTime + seconds, Math.max(0, duration - 0.001)));
}

document.querySelectorAll('[data-step-video]').forEach(button => {
  button.addEventListener('click', () => nudgeVideo(button.dataset.stepVideo, Number(button.dataset.step)));
});

document.querySelectorAll('[data-frame-video]').forEach(button => {
  button.addEventListener('click', () => {
    const kind = button.dataset.frameVideo;
    nudgeVideo(kind, Number(button.dataset.direction) / getFps(kind));
  });
});

function captureFrame(video) {
  if (!video.videoWidth || !video.videoHeight) return null;
  const maxWidth = 720;
  const width = Math.min(maxWidth, video.videoWidth);
  const height = Math.round(width * video.videoHeight / video.videoWidth);
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d', { alpha: false });
  ctx.drawImage(video, 0, 0, width, height);
  return canvas.toDataURL('image/jpeg', 0.82);
}

document.querySelectorAll('[data-mark-phase]').forEach(button => {
  button.addEventListener('click', () => {
    const phase = button.dataset.markPhase;
    const dataUrl = captureFrame(els.clipPreview);
    if (!dataUrl) return;
    state.markedFrames[phase] = {
      phase,
      time: Number(els.clipPreview.currentTime.toFixed(3)),
      dataUrl
    };
    renderKeyFrames();
  });
});

function renderKeyFrames() {
  els.keyFrames.innerHTML = '';
  const frames = Object.values(state.markedFrames);
  els.keyFramesSection.classList.toggle('hidden', frames.length === 0);
  for (const key of ['setup', 'catch', 'pull', 'exit']) {
    const frame = state.markedFrames[key];
    if (!frame) continue;
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'key-frame-card';
    card.innerHTML = `<img src="${frame.dataUrl}" alt="${phaseLabels[key]} frame"><span><strong>${phaseLabels[key]}</strong>${frame.time.toFixed(2)}s</span>`;
    card.addEventListener('click', () => {
      els.clipPreview.pause();
      els.clipPreview.currentTime = frame.time;
      els.clipPreview.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
    els.keyFrames.appendChild(card);
  }
}

els.clearFramesButton.addEventListener('click', () => {
  state.markedFrames = {};
  renderKeyFrames();
});

function buildPhaseReview() {
  els.phaseReview.innerHTML = '';
  for (const [phaseKey, phase] of Object.entries(phases)) {
    const section = document.createElement('section');
    section.className = 'phase-review-card';
    section.innerHTML = `
      <div class="phase-review-heading">
        <div><span class="phase-kicker">${phase.title}</span><h3>${phase.title}</h3></div>
        <p>${phase.reminder}</p>
      </div>
      <div class="observation-columns">
        <div>
          <h4>What is working</h4>
          <div class="option-list strengths-options"></div>
        </div>
        <div>
          <h4>Needs work</h4>
          <div class="option-list correction-options"></div>
        </div>
      </div>
    `;
    const strengthBox = section.querySelector('.strengths-options');
    phase.strengths.forEach(item => {
      strengthBox.appendChild(makeOption(item.id, item.text, 'strength', phaseKey));
    });
    const correctionBox = section.querySelector('.correction-options');
    phase.corrections.forEach(item => {
      correctionBox.appendChild(makeOption(item.id, item.title, 'correction', phaseKey));
    });
    els.phaseReview.appendChild(section);
  }
}

function makeOption(id, text, type, phaseKey) {
  const label = document.createElement('label');
  label.className = `check-option ${type}`;
  const input = document.createElement('input');
  input.type = 'checkbox';
  input.dataset.optionId = id;
  input.dataset.optionType = type;
  input.dataset.phase = phaseKey;
  const span = document.createElement('span');
  span.textContent = text;
  label.append(input, span);
  input.addEventListener('change', () => handleOptionChange(input));
  return label;
}

function handleOptionChange(input) {
  const id = input.dataset.optionId;
  if (input.dataset.optionType === 'strength') {
    input.checked ? state.selectedStrengths.add(id) : state.selectedStrengths.delete(id);
  } else {
    if (input.checked) {
      if (!state.selectedCorrections.includes(id)) state.selectedCorrections.push(id);
    } else {
      state.selectedCorrections = state.selectedCorrections.filter(x => x !== id);
    }
    renderPriorityBuilder();
  }
  updateSelectionStatus();
}

function getCorrectionById(id) {
  for (const [phaseKey, phase] of Object.entries(phases)) {
    const item = phase.corrections.find(x => x.id === id);
    if (item) return { ...item, phaseKey, phaseTitle: phase.title };
  }
  return null;
}

function getStrengthById(id) {
  for (const [phaseKey, phase] of Object.entries(phases)) {
    const item = phase.strengths.find(x => x.id === id);
    if (item) return { ...item, phaseKey, phaseTitle: phase.title };
  }
  return null;
}

function movePriority(index, direction) {
  const next = index + direction;
  if (next < 0 || next >= state.selectedCorrections.length) return;
  [state.selectedCorrections[index], state.selectedCorrections[next]] = [state.selectedCorrections[next], state.selectedCorrections[index]];
  renderPriorityBuilder();
}

function renderPriorityBuilder() {
  els.priorityBuilderList.innerHTML = '';
  els.prioritySection.classList.toggle('hidden', state.selectedCorrections.length === 0);
  state.selectedCorrections.forEach((id, index) => {
    const correction = getCorrectionById(id);
    if (!correction) return;
    const row = document.createElement('div');
    row.className = 'priority-builder-item';
    row.innerHTML = `
      <span class="priority-number">${index + 1}</span>
      <div class="priority-builder-copy"><strong>${correction.title}</strong><span>${correction.phaseTitle}</span></div>
      <div class="priority-move-buttons">
        <button type="button" aria-label="Move up" ${index === 0 ? 'disabled' : ''}>↑</button>
        <button type="button" aria-label="Move down" ${index === state.selectedCorrections.length - 1 ? 'disabled' : ''}>↓</button>
      </div>
    `;
    const buttons = row.querySelectorAll('button');
    buttons[0].addEventListener('click', () => movePriority(index, -1));
    buttons[1].addEventListener('click', () => movePriority(index, 1));
    els.priorityBuilderList.appendChild(row);
  });
}

function updateSelectionStatus() {
  const correctionCount = state.selectedCorrections.length;
  const strengthCount = state.selectedStrengths.size;
  els.selectionStatus.textContent = `${strengthCount} strength${strengthCount === 1 ? '' : 's'}, ${correctionCount} correction${correctionCount === 1 ? '' : 's'} selected.`;
}

function resetSelections() {
  state.selectedStrengths.clear();
  state.selectedCorrections = [];
  document.querySelectorAll('[data-option-id]').forEach(input => { input.checked = false; });
  renderPriorityBuilder();
  updateSelectionStatus();
  els.resultPanel.classList.add('hidden');
}

els.resetSelectionsButton.addEventListener('click', resetSelections);

function phaseSummary(phaseKey, selectedCorrections, selectedStrengths) {
  const phase = phases[phaseKey];
  const corrections = selectedCorrections.filter(x => x.phaseKey === phaseKey);
  const strengths = selectedStrengths.filter(x => x.phaseKey === phaseKey);
  if (!corrections.length && !strengths.length) return 'No specific observation selected.';
  const pieces = [];
  if (strengths.length) pieces.push(strengths.map(x => x.text).join(' '));
  if (corrections.length) pieces.push(corrections.map(x => x.correction).join(' '));
  return pieces.join(' ');
}

function generateFeedback() {
  const depth = Number(els.priorityDepth.value) || 2;
  const allCorrections = state.selectedCorrections.map(getCorrectionById).filter(Boolean);
  const priorities = allCorrections.slice(0, depth);
  const strengths = [...state.selectedStrengths].map(getStrengthById).filter(Boolean);

  if (!priorities.length) {
    els.selectionStatus.textContent = 'Select at least one correction before generating feedback.';
    els.selectionStatus.style.color = 'var(--warning)';
    return;
  }
  els.selectionStatus.style.color = '';

  const name = els.paddlerName.value.trim();
  const introName = name ? `${name}, ` : '';
  const strengthIntro = strengths.length
    ? `There are already some good pieces in your stroke, especially ${strengths.slice(0, 2).map(x => x.text.toLowerCase().replace(/\.$/, '')).join(' and ')}.`
    : 'You have a solid base to work from.';
  const priorityNames = priorities.map(x => x.title.toLowerCase());
  const prioritySentence = priorityNames.length === 1
    ? `The main thing to work on now is ${priorityNames[0]}.`
    : `The main things to work on now are ${priorityNames.slice(0, -1).join(', ')} and ${priorityNames.at(-1)}.`;
  const overall = `${introName}${strengthIntro} ${prioritySentence}`;

  const cues = [...new Set(priorities.map(x => x.cue))];
  const drillNames = [...new Set(priorities.map(x => x.drill).filter(Boolean))];
  const phaseFeedback = {};
  for (const phaseKey of Object.keys(phases)) phaseFeedback[phaseKey] = phaseSummary(phaseKey, allCorrections, strengths);

  state.result = {
    title: name ? `${name} - Stroke Review` : 'Dragonboat Stroke Review',
    overall,
    strengths: strengths.map(x => `${x.phaseTitle}: ${x.text}`),
    priorities,
    cues,
    drills: drillNames.map(name => ({ name, ...drillBank[name] })),
    phaseFeedback,
    note: els.coachNote.value.trim(),
    cameraAngle: els.cameraAngle.value
  };

  renderResult(state.result);
}

els.generateButton.addEventListener('click', generateFeedback);

function addListItems(list, items, emptyText = 'No strengths selected.') {
  list.innerHTML = '';
  if (!items?.length) {
    const li = document.createElement('li');
    li.className = 'muted';
    li.textContent = emptyText;
    list.appendChild(li);
    return;
  }
  items.forEach(item => {
    const li = document.createElement('li');
    li.textContent = item;
    list.appendChild(li);
  });
}

function renderResult(result) {
  els.resultTitle.textContent = result.title;
  els.overallCard.innerHTML = `<h3>Overall assessment</h3><p>${escapeHtml(result.overall)}</p>`;
  addListItems(els.strengthsList, result.strengths);
  addListItems(els.cuesList, result.cues, 'Use the priority corrections below.');

  els.prioritiesList.innerHTML = '';
  result.priorities.forEach((p, index) => {
    const frame = state.markedFrames[p.phaseKey];
    const div = document.createElement('article');
    div.className = 'priority-item';
    div.innerHTML = `
      <div class="priority-heading"><span>${index + 1}</span><div><small>${p.phaseTitle}</small><h4>${escapeHtml(p.title)}</h4></div></div>
      <p>${escapeHtml(p.observation)}</p>
      <p><strong>Work on:</strong> ${escapeHtml(p.correction)}</p>
      <p class="cue">Cue: “${escapeHtml(p.cue)}”</p>
      ${frame ? `<p class="evidence">Marked ${p.phaseTitle} frame: ${frame.time.toFixed(2)}s</p>` : ''}
    `;
    els.prioritiesList.appendChild(div);
  });

  els.phaseGrid.innerHTML = '';
  for (const [phaseKey, phase] of Object.entries(phases)) {
    const div = document.createElement('div');
    div.className = 'phase-item';
    div.innerHTML = `<strong>${phase.title}</strong><span>${escapeHtml(result.phaseFeedback[phaseKey])}</span>`;
    els.phaseGrid.appendChild(div);
  }

  els.drillsList.innerHTML = '';
  result.drills.forEach(d => {
    const div = document.createElement('div');
    div.className = 'drill-item';
    div.innerHTML = `<strong>${escapeHtml(d.name)}</strong><p>${escapeHtml(d.purpose)}</p><p>${escapeHtml(d.how)}</p>`;
    els.drillsList.appendChild(div);
  });
  els.drillsCard.classList.toggle('hidden', result.drills.length === 0);

  els.coachNoteCard.classList.toggle('hidden', !result.note);
  els.coachNoteOutput.textContent = result.note;
  els.resultPanel.classList.remove('hidden');
  els.resultPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function resultAsText() {
  const r = state.result;
  if (!r) return '';
  const lines = [r.title, '', r.overall, ''];
  if (r.strengths.length) {
    lines.push('What is working', ...r.strengths.map(x => `- ${x}`), '');
  }
  lines.push('Priority corrections');
  r.priorities.forEach((p, i) => {
    lines.push(`${i + 1}. ${p.title}`);
    lines.push(p.observation);
    lines.push(`Work on: ${p.correction}`);
    lines.push(`Cue: ${p.cue}`, '');
  });
  lines.push('Simple cues', ...r.cues.map(x => `- ${x}`));
  if (r.drills.length) {
    lines.push('', 'Drills to use next');
    r.drills.forEach(d => lines.push(`- ${d.name}: ${d.purpose} ${d.how}`));
  }
  if (r.note) lines.push('', 'Coach note', r.note);
  return lines.join('\n');
}

els.copyButton.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(resultAsText());
    els.copyButton.textContent = 'Copied';
    setTimeout(() => { els.copyButton.textContent = 'Copy feedback'; }, 1200);
  } catch {
    window.prompt('Copy the feedback below:', resultAsText());
  }
});

els.printButton.addEventListener('click', () => window.print());

buildPhaseReview();
updateSelectionStatus();
