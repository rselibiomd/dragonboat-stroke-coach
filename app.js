const els = {
  clipInput: document.getElementById('clipInput'),
  referenceInput: document.getElementById('referenceInput'),
  clipPreview: document.getElementById('clipPreview'),
  referencePreview: document.getElementById('referencePreview'),
  clipMeta: document.getElementById('clipMeta'),
  referenceMeta: document.getElementById('referenceMeta'),
  analyzeButton: document.getElementById('analyzeButton'),
  clearButton: document.getElementById('clearButton'),
  statusText: document.getElementById('statusText'),
  subjectInput: document.getElementById('subjectInput'),
  angleInput: document.getElementById('angleInput'),
  levelInput: document.getElementById('levelInput'),
  depthInput: document.getElementById('depthInput'),
  notesInput: document.getElementById('notesInput'),
  framePanel: document.getElementById('framePanel'),
  frameStrip: document.getElementById('frameStrip'),
  resultPanel: document.getElementById('resultPanel'),
  resultTitle: document.getElementById('resultTitle'),
  overallCard: document.getElementById('overallCard'),
  strengthsList: document.getElementById('strengthsList'),
  cuesList: document.getElementById('cuesList'),
  prioritiesList: document.getElementById('prioritiesList'),
  phaseGrid: document.getElementById('phaseGrid'),
  drillsList: document.getElementById('drillsList'),
  confidenceText: document.getElementById('confidenceText'),
  limitationsList: document.getElementById('limitationsList'),
  copyButton: document.getElementById('copyButton'),
  printButton: document.getElementById('printButton')
};

const state = {
  clipFile: null,
  referenceFile: null,
  clipUrl: null,
  referenceUrl: null,
  clipFrames: [],
  referenceFrames: [],
  result: null
};

const BACKEND_URL = 'https://dragonboat-stroke-coach.rselibiomd.workers.dev';

function formatBytes(bytes) {
  if (!bytes) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  return `${(bytes / (1024 ** i)).toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

function setStatus(text, type = 'normal') {
  els.statusText.textContent = text;
  els.statusText.style.color = type === 'error' ? 'var(--danger)' : type === 'ok' ? 'var(--accent-2)' : 'var(--muted)';
}

function revoke(url) {
  if (url) URL.revokeObjectURL(url);
}

function loadPreview(file, videoEl, metaEl, kind) {
  if (!file) return;
  if (kind === 'clip') {
    revoke(state.clipUrl);
    state.clipUrl = URL.createObjectURL(file);
    state.clipFile = file;
    videoEl.src = state.clipUrl;
  } else {
    revoke(state.referenceUrl);
    state.referenceUrl = URL.createObjectURL(file);
    state.referenceFile = file;
    videoEl.src = state.referenceUrl;
  }
  videoEl.classList.remove('hidden');
  metaEl.classList.remove('hidden');
  metaEl.textContent = `${file.name} · ${formatBytes(file.size)}`;
  els.analyzeButton.disabled = !state.clipFile;
  state.result = null;
  els.resultPanel.classList.add('hidden');
}

els.clipInput.addEventListener('change', e => loadPreview(e.target.files[0], els.clipPreview, els.clipMeta, 'clip'));
els.referenceInput.addEventListener('change', e => loadPreview(e.target.files[0], els.referencePreview, els.referenceMeta, 'reference'));

for (const [dropId, input] of [['clipDropZone', els.clipInput], ['referenceDropZone', els.referenceInput]]) {
  const zone = document.getElementById(dropId);
  ['dragenter', 'dragover'].forEach(eventName => zone.addEventListener(eventName, e => {
    e.preventDefault();
    zone.classList.add('dragging');
  }));
  ['dragleave', 'drop'].forEach(eventName => zone.addEventListener(eventName, e => {
    e.preventDefault();
    zone.classList.remove('dragging');
  }));
  zone.addEventListener('drop', e => {
    const file = [...e.dataTransfer.files].find(f => f.type.startsWith('video/') || /\.(mov|mp4|m4v|webm)$/i.test(f.name));
    if (!file) return;
    const dt = new DataTransfer();
    dt.items.add(file);
    input.files = dt.files;
    input.dispatchEvent(new Event('change', { bubbles: true }));
  });
}

function waitFor(video, event) {
  return new Promise((resolve, reject) => {
    const onEvent = () => { cleanup(); resolve(); };
    const onError = () => { cleanup(); reject(new Error('The browser could not decode this video. Try an H.264 MP4 clip.')); };
    const cleanup = () => {
      video.removeEventListener(event, onEvent);
      video.removeEventListener('error', onError);
    };
    video.addEventListener(event, onEvent, { once: true });
    video.addEventListener('error', onError, { once: true });
  });
}

async function ensureLoaded(video) {
  if (video.readyState >= 1 && Number.isFinite(video.duration)) return;
  await waitFor(video, 'loadedmetadata');
}

async function seekVideo(video, time) {
  if (Math.abs(video.currentTime - time) < 0.015) return;
  video.currentTime = Math.max(0, Math.min(time, video.duration - 0.02));
  await waitFor(video, 'seeked');
}

function captureFrame(video, maxWidth = 900, quality = 0.78) {
  const ratio = video.videoHeight / video.videoWidth;
  const width = Math.min(maxWidth, video.videoWidth || maxWidth);
  const height = Math.max(1, Math.round(width * ratio));
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d', { alpha: false });
  ctx.drawImage(video, 0, 0, width, height);
  return canvas.toDataURL('image/jpeg', quality);
}

async function sampleFrames(video, desiredCount, label) {
  await ensureLoaded(video);
  const duration = video.duration;
  if (!Number.isFinite(duration) || duration <= 0) throw new Error(`Could not read ${label} duration.`);

  const start = Math.min(0.25, duration * 0.05);
  const end = Math.max(start, duration - Math.min(0.25, duration * 0.05));
  const count = Math.max(4, Math.min(desiredCount, Math.floor(duration * 2) || 4));
  const times = Array.from({ length: count }, (_, i) => {
    if (count === 1) return duration / 2;
    return start + ((end - start) * i / (count - 1));
  });

  const frames = [];
  const originalTime = video.currentTime;
  const wasPaused = video.paused;
  video.pause();

  for (let i = 0; i < times.length; i++) {
    setStatus(`Sampling ${label} frame ${i + 1} of ${times.length}...`);
    await seekVideo(video, times[i]);
    await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
    frames.push({ time: Number(times[i].toFixed(2)), dataUrl: captureFrame(video) });
  }

  await seekVideo(video, Math.min(originalTime, Math.max(0, duration - 0.05))).catch(() => {});
  if (!wasPaused) video.play().catch(() => {});
  return frames;
}

function renderFrames(frames) {
  els.frameStrip.innerHTML = '';
  for (const frame of frames) {
    const card = document.createElement('div');
    card.className = 'frame-card';
    const img = document.createElement('img');
    img.src = frame.dataUrl;
    img.alt = `Sampled frame at ${frame.time.toFixed(2)} seconds`;
    const stamp = document.createElement('span');
    stamp.textContent = `${frame.time.toFixed(2)}s`;
    card.append(img, stamp);
    els.frameStrip.appendChild(card);
  }
  els.framePanel.classList.remove('hidden');
}

function backendBase() {
  return BACKEND_URL;
}

async function analyze() {
  if (!state.clipFile) return;
  const backend = backendBase();
  els.analyzeButton.disabled = true;
  els.resultPanel.classList.add('hidden');
  try {
    state.clipFrames = await sampleFrames(els.clipPreview, 12, 'paddler clip');
    renderFrames(state.clipFrames);

    state.referenceFrames = [];
    if (state.referenceFile) {
      state.referenceFrames = await sampleFrames(els.referencePreview, 8, 'reference clip');
    }

    setStatus('Sending sampled frames for coaching analysis...');
    const response = await fetch(`${backend}/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        subject: els.subjectInput.value.trim() || 'paddler closest to the camera',
        camera_angle: els.angleInput.value,
        coaching_level: els.levelInput.value,
        max_priorities: Number(els.depthInput.value),
        coach_notes: els.notesInput.value.trim(),
        clip_name: state.clipFile.name,
        clip_frames: state.clipFrames,
        reference_name: state.referenceFile?.name || '',
        reference_frames: state.referenceFrames
      })
    });

    const payload = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(payload.error || `Analysis failed with HTTP ${response.status}.`);
    state.result = payload;
    renderResult(payload);
    setStatus('Analysis complete.', 'ok');
  } catch (error) {
    console.error(error);
    setStatus(error.message || 'Analysis failed.', 'error');
  } finally {
    els.analyzeButton.disabled = !state.clipFile;
  }
}

function addListItems(list, items) {
  list.innerHTML = '';
  for (const item of items || []) {
    const li = document.createElement('li');
    li.textContent = item;
    list.appendChild(li);
  }
}

function renderResult(result) {
  els.resultTitle.textContent = result.title || 'Stroke review';
  els.overallCard.innerHTML = `<h3>Overall assessment</h3><p>${escapeHtml(result.overall_assessment || '')}</p>`;
  addListItems(els.strengthsList, result.strengths);
  addListItems(els.cuesList, result.cues);

  els.prioritiesList.innerHTML = '';
  for (const p of result.priority_corrections || []) {
    const div = document.createElement('div');
    div.className = 'priority-item';
    div.innerHTML = `
      <h4>${escapeHtml(p.title)}</h4>
      <p><strong>Observation:</strong> ${escapeHtml(p.observation)}</p>
      <p><strong>Why it matters:</strong> ${escapeHtml(p.why_it_matters)}</p>
      <p><strong>Correction:</strong> ${escapeHtml(p.correction)}</p>
      <p class="cue">Cue: “${escapeHtml(p.cue)}”</p>
      ${p.evidence_times?.length ? `<p class="evidence">Visible around: ${p.evidence_times.map(t => `${Number(t).toFixed(2)}s`).join(', ')}</p>` : ''}
    `;
    els.prioritiesList.appendChild(div);
  }

  const phases = result.phase_feedback || {};
  const labels = [
    ['setup', 'Set-up'],
    ['catch', 'Catch'],
    ['pull', 'Pull'],
    ['exit_recovery', 'Exit / Recovery']
  ];
  els.phaseGrid.innerHTML = '';
  for (const [key, label] of labels) {
    const div = document.createElement('div');
    div.className = 'phase-item';
    div.innerHTML = `<strong>${label}</strong><span>${escapeHtml(phases[key] || 'Not enough evidence to assess confidently.')}</span>`;
    els.phaseGrid.appendChild(div);
  }

  els.drillsList.innerHTML = '';
  for (const d of result.drills || []) {
    const div = document.createElement('div');
    div.className = 'drill-item';
    div.innerHTML = `<strong>${escapeHtml(d.name)}</strong><p>${escapeHtml(d.purpose)}</p><p>${escapeHtml(d.how_to)}</p>`;
    els.drillsList.appendChild(div);
  }

  els.confidenceText.textContent = result.confidence || '';
  addListItems(els.limitationsList, result.limitations);
  els.resultPanel.classList.remove('hidden');
  els.resultPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function escapeHtml(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function resultAsText() {
  if (!state.result) return '';
  const r = state.result;
  const lines = [
    r.title || 'Dragonboat stroke review',
    '',
    'Overall assessment',
    r.overall_assessment || '',
    '',
    'What is working',
    ...(r.strengths || []).map(x => `- ${x}`),
    '',
    'Priority corrections'
  ];
  for (const p of r.priority_corrections || []) {
    lines.push(`- ${p.title}: ${p.observation}`);
    lines.push(`  Correction: ${p.correction}`);
    lines.push(`  Cue: ${p.cue}`);
  }
  lines.push('', 'Simple cues', ...(r.cues || []).map(x => `- ${x}`));
  lines.push('', 'Drills');
  for (const d of r.drills || []) lines.push(`- ${d.name}: ${d.purpose}. ${d.how_to}`);
  lines.push('', 'Confidence and limitations', r.confidence || '', ...(r.limitations || []).map(x => `- ${x}`));
  return lines.join('\n');
}

els.analyzeButton.addEventListener('click', analyze);
els.clearButton.addEventListener('click', () => {
  revoke(state.clipUrl); revoke(state.referenceUrl);
  Object.assign(state, { clipFile: null, referenceFile: null, clipUrl: null, referenceUrl: null, clipFrames: [], referenceFrames: [], result: null });
  els.clipInput.value = ''; els.referenceInput.value = '';
  els.clipPreview.removeAttribute('src'); els.referencePreview.removeAttribute('src');
  els.clipPreview.classList.add('hidden'); els.referencePreview.classList.add('hidden');
  els.clipMeta.classList.add('hidden'); els.referenceMeta.classList.add('hidden');
  els.framePanel.classList.add('hidden'); els.resultPanel.classList.add('hidden');
  els.analyzeButton.disabled = true;
  setStatus('');
});

els.copyButton.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(resultAsText());
    els.copyButton.textContent = 'Copied';
    setTimeout(() => els.copyButton.textContent = 'Copy feedback', 1200);
  } catch {
    setStatus('Could not copy automatically. Select the text manually.', 'error');
  }
});
els.printButton.addEventListener('click', () => window.print());
