/* Release 1.4: Review Export & Sharing */

const exportState14 = {
  annotations: {},
  annotatedFrames: {},
  loop: {
    start: null,
    end: null,
    enabled: false,
    speed: 0.5
  },
  editor: {
    phase: null,
    tool: 'arrow',
    image: null,
    start: null,
    end: null,
    preview: null
  },
  logoUrl: 'https://raw.githubusercontent.com/rselibiomd/dragon-boat-training-builder/main/public/kdbc-logo.jpeg'
};

const phaseOrder14 = ['setup', 'catch', 'pull', 'exit'];

function fileSafe14(value = 'paddler') {
  return String(value || 'paddler')
    .trim()
    .replace(/[^a-z0-9_-]+/gi, '_')
    .replace(/^_+|_+$/g, '') || 'paddler';
}

function paddlerName14() {
  return document.getElementById('paddlerName')?.value?.trim() || 'Paddler';
}

function phaseName14(key) {
  return phaseLabels?.[key] || key;
}

function preferredFrame14(key) {
  return exportState14.annotatedFrames[key] || state.markedFrames?.[key]?.dataUrl || null;
}

function markedFrameCount14() {
  return phaseOrder14.filter(key => state.markedFrames?.[key]).length;
}

function loadImage14(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    if (/^https?:/i.test(src)) image.crossOrigin = 'anonymous';
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });
}

function canvasBlob14(canvas, type = 'image/png', quality = 0.94) {
  return new Promise(resolve => canvas.toBlob(resolve, type, quality));
}

function downloadBlob14(blob, filename) {
  if (!blob) return;
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 800);
}

function downloadDataUrl14(dataUrl, filename) {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
}

function drawCover14(ctx, image, x, y, width, height) {
  const scale = Math.max(width / image.width, height / image.height);
  const sw = width / scale;
  const sh = height / scale;
  const sx = (image.width - sw) / 2;
  const sy = (image.height - sh) / 2;
  ctx.drawImage(image, sx, sy, sw, sh, x, y, width, height);
}

function wrapText14(ctx, text, x, y, maxWidth, lineHeight, maxLines = 99) {
  const words = String(text || '').split(/\s+/).filter(Boolean);
  let line = '';
  let lineCount = 0;
  for (let index = 0; index < words.length; index += 1) {
    const test = line ? `${line} ${words[index]}` : words[index];
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line, x, y);
      y += lineHeight;
      lineCount += 1;
      if (lineCount >= maxLines) return y;
      line = words[index];
    } else {
      line = test;
    }
  }
  if (line && lineCount < maxLines) {
    ctx.fillText(line, x, y);
    y += lineHeight;
  }
  return y;
}

async function drawLogo14(ctx, x, y, size) {
  try {
    const logo = await loadImage14(exportState14.logoUrl);
    ctx.save();
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x, y, size, size);
    drawCover14(ctx, logo, x, y, size, size);
    ctx.restore();
  } catch {
    ctx.save();
    ctx.fillStyle = '#0f2b4d';
    ctx.fillRect(x, y, size, size);
    ctx.fillStyle = '#ffffff';
    ctx.font = `700 ${Math.round(size * 0.24)}px Arial, sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText('KDBC', x + size / 2, y + size * 0.58);
    ctx.restore();
  }
}

function phaseCue14(key) {
  const priority = state.result?.priorities?.find(item => item.phaseKey === key);
  if (priority?.cue) return priority.cue;
  if (typeof techniqueModel13 !== 'undefined' && techniqueModel13[key]?.cues?.length) return techniqueModel13[key].cues[0];
  return phases?.[key]?.reminder || '';
}

function phaseCorrection14(key) {
  const priority = state.result?.priorities?.find(item => item.phaseKey === key);
  return priority?.correction || '';
}

async function createStrokeSheet14() {
  if (markedFrameCount14() < 4) throw new Error('Mark Set-up, Catch, Pull, and Exit/Recovery before creating the four-phase sheet.');

  const canvas = document.createElement('canvas');
  canvas.width = 1600;
  canvas.height = 1480;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#f7f9fc';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = '#071b31';
  ctx.fillRect(0, 0, canvas.width, 210);
  await drawLogo14(ctx, 70, 42, 126);
  ctx.fillStyle = '#ffffff';
  ctx.font = '700 54px Arial, sans-serif';
  ctx.fillText('KDBC Stroke Sequence', 235, 88);
  ctx.font = '600 30px Arial, sans-serif';
  ctx.fillText(paddlerName14(), 235, 135);
  ctx.font = '400 23px Arial, sans-serif';
  ctx.fillStyle = '#cbd8e8';
  ctx.fillText(new Date().toLocaleDateString('en-CA', { year: 'numeric', month: 'short', day: 'numeric' }), 235, 172);

  const cellWidth = 710;
  const cellHeight = 540;
  const gap = 40;
  const left = 70;
  const top = 255;
  const imageHeight = 390;

  for (let i = 0; i < phaseOrder14.length; i += 1) {
    const key = phaseOrder14[i];
    const row = Math.floor(i / 2);
    const col = i % 2;
    const x = left + col * (cellWidth + gap);
    const y = top + row * (cellHeight + gap);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x, y, cellWidth, cellHeight);
    ctx.strokeStyle = '#d4dce7';
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, cellWidth, cellHeight);

    const image = await loadImage14(preferredFrame14(key));
    drawCover14(ctx, image, x + 18, y + 18, cellWidth - 36, imageHeight);

    ctx.fillStyle = '#0b6e8a';
    ctx.font = '700 20px Arial, sans-serif';
    ctx.fillText(phaseName14(key).toUpperCase(), x + 24, y + imageHeight + 56);
    ctx.fillStyle = '#10263d';
    ctx.font = '700 28px Arial, sans-serif';
    wrapText14(ctx, `“${phaseCue14(key)}”`, x + 24, y + imageHeight + 94, cellWidth - 48, 32, 2);
  }

  ctx.fillStyle = '#071b31';
  ctx.fillRect(0, 1410, canvas.width, 70);
  ctx.fillStyle = '#ffffff';
  ctx.font = '500 22px Arial, sans-serif';
  ctx.fillText('Kingston Dragon Boat Club · Sequence and position guide, not a body-angle score.', 70, 1453);
  return canvas;
}

async function createReviewPack14() {
  if (markedFrameCount14() < 4) throw new Error('Mark all four stroke phases before creating the review pack.');
  if (!state.result) throw new Error('Generate paddler feedback before creating the review pack.');

  const canvas = document.createElement('canvas');
  canvas.width = 1600;
  canvas.height = 2300;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#f7f9fc';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = '#071b31';
  ctx.fillRect(0, 0, canvas.width, 220);
  await drawLogo14(ctx, 70, 45, 128);
  ctx.fillStyle = '#ffffff';
  ctx.font = '700 52px Arial, sans-serif';
  ctx.fillText('KDBC Paddler Review', 235, 90);
  ctx.font = '600 30px Arial, sans-serif';
  ctx.fillText(paddlerName14(), 235, 138);
  ctx.font = '400 22px Arial, sans-serif';
  ctx.fillStyle = '#cbd8e8';
  ctx.fillText(`${new Date().toLocaleDateString('en-CA', { year: 'numeric', month: 'short', day: 'numeric' })} · ${state.result.cameraAngle || 'Video review'}`, 235, 178);

  const frameW = 710;
  const frameH = 360;
  const gap = 40;
  const left = 70;
  const framesTop = 275;
  for (let i = 0; i < 4; i += 1) {
    const key = phaseOrder14[i];
    const row = Math.floor(i / 2);
    const col = i % 2;
    const x = left + col * (frameW + gap);
    const y = framesTop + row * 455;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x, y, frameW, 425);
    const image = await loadImage14(preferredFrame14(key));
    drawCover14(ctx, image, x + 15, y + 15, frameW - 30, frameH - 30);
    ctx.fillStyle = '#0b6e8a';
    ctx.font = '700 19px Arial, sans-serif';
    ctx.fillText(phaseName14(key).toUpperCase(), x + 20, y + 360);
    ctx.fillStyle = '#10263d';
    ctx.font = '700 25px Arial, sans-serif';
    wrapText14(ctx, `“${phaseCue14(key)}”`, x + 20, y + 397, frameW - 40, 29, 1);
  }

  let y = 1215;
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(70, y, 1460, 950);
  ctx.strokeStyle = '#d4dce7';
  ctx.strokeRect(70, y, 1460, 950);
  y += 55;
  ctx.fillStyle = '#0b6e8a';
  ctx.font = '700 20px Arial, sans-serif';
  ctx.fillText('COACHING PRIORITIES', 105, y);
  y += 48;

  const priorities = state.result.priorities || [];
  priorities.forEach((priority, index) => {
    ctx.fillStyle = '#10263d';
    ctx.font = '700 30px Arial, sans-serif';
    ctx.fillText(`${index + 1}. ${priority.title}`, 105, y);
    y += 40;
    ctx.fillStyle = '#45576b';
    ctx.font = '400 23px Arial, sans-serif';
    y = wrapText14(ctx, priority.correction, 105, y, 1340, 31, 3);
    ctx.fillStyle = '#0b6e8a';
    ctx.font = '700 23px Arial, sans-serif';
    ctx.fillText(`Cue: “${priority.cue}”`, 105, y + 5);
    y += 62;
  });

  if (state.result.drills?.length) {
    y += 15;
    ctx.fillStyle = '#0b6e8a';
    ctx.font = '700 20px Arial, sans-serif';
    ctx.fillText('DRILLS TO USE NEXT', 105, y);
    y += 42;
    ctx.fillStyle = '#10263d';
    ctx.font = '600 24px Arial, sans-serif';
    state.result.drills.slice(0, 3).forEach(drill => {
      ctx.fillText(`• ${drill.name}`, 115, y);
      y += 36;
    });
  }

  const editedMessage = document.getElementById('editableFeedback')?.value?.trim();
  if (editedMessage) {
    y += 20;
    ctx.fillStyle = '#0b6e8a';
    ctx.font = '700 20px Arial, sans-serif';
    ctx.fillText('PADDLER MESSAGE', 105, y);
    y += 42;
    ctx.fillStyle = '#45576b';
    ctx.font = '400 21px Arial, sans-serif';
    wrapText14(ctx, editedMessage.replace(/\n+/g, ' '), 105, y, 1340, 29, 8);
  }

  ctx.fillStyle = '#071b31';
  ctx.fillRect(0, 2230, canvas.width, 70);
  ctx.fillStyle = '#ffffff';
  ctx.font = '500 22px Arial, sans-serif';
  ctx.fillText('Kingston Dragon Boat Club · Coach-selected technical feedback', 70, 2273);
  return canvas;
}

function seekVideo14(video, time) {
  return new Promise(resolve => {
    if (!Number.isFinite(time)) return resolve();
    if (Math.abs((video.currentTime || 0) - time) < 0.01) return resolve();
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      video.removeEventListener('seeked', finish);
      resolve();
    };
    video.addEventListener('seeked', finish, { once: true });
    video.currentTime = Math.max(0, Math.min(time, Number.isFinite(video.duration) ? Math.max(0, video.duration - 0.001) : time));
    setTimeout(finish, 1500);
  });
}

function videoFrameData14(video) {
  if (!video.videoWidth || !video.videoHeight) return null;
  const width = Math.min(900, video.videoWidth);
  const height = Math.round(width * video.videoHeight / video.videoWidth);
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  canvas.getContext('2d').drawImage(video, 0, 0, width, height);
  return canvas.toDataURL('image/png');
}

async function captureReferenceFrames14() {
  const video = els.referencePreview;
  if (!state.referenceFile || !video?.videoWidth) throw new Error('Load a reference clip first.');
  const originalTime = video.currentTime;
  const wasPlaying = !video.paused;
  video.pause();
  const frames = {};
  for (const key of phaseOrder14) {
    const time = releaseState.referenceMarks?.[key];
    if (!Number.isFinite(time)) continue;
    await seekVideo14(video, time);
    const data = videoFrameData14(video);
    if (data) frames[key] = data;
  }
  await seekVideo14(video, originalTime);
  if (wasPlaying) video.play().catch(() => {});
  return frames;
}

async function createComparisonSheet14() {
  const referenceFrames = await captureReferenceFrames14();
  const comparable = phaseOrder14.filter(key => state.markedFrames?.[key] && referenceFrames[key]);
  if (!comparable.length) throw new Error('Mark at least one matching paddler and reference phase first.');

  const canvas = document.createElement('canvas');
  canvas.width = 1600;
  canvas.height = 330 + comparable.length * 520;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#f7f9fc';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#071b31';
  ctx.fillRect(0, 0, canvas.width, 220);
  await drawLogo14(ctx, 70, 45, 128);
  ctx.fillStyle = '#ffffff';
  ctx.font = '700 48px Arial, sans-serif';
  ctx.fillText('Paddler vs Reference', 235, 90);
  ctx.font = '400 23px Arial, sans-serif';
  ctx.fillStyle = '#cbd8e8';
  ctx.fillText('Compare body sequence and positioning, not exact body angles or stroke rate.', 235, 138);
  ctx.fillText(paddlerName14(), 235, 177);

  let y = 265;
  for (const key of comparable) {
    ctx.fillStyle = '#0b6e8a';
    ctx.font = '700 22px Arial, sans-serif';
    ctx.fillText(phaseName14(key).toUpperCase(), 70, y + 28);
    ctx.fillStyle = '#45576b';
    ctx.font = '600 20px Arial, sans-serif';
    ctx.fillText('PADDLER', 70, y + 65);
    ctx.fillText('REFERENCE', 825, y + 65);
    const paddlerImage = await loadImage14(preferredFrame14(key));
    const referenceImage = await loadImage14(referenceFrames[key]);
    drawCover14(ctx, paddlerImage, 70, y + 85, 705, 360);
    drawCover14(ctx, referenceImage, 825, y + 85, 705, 360);
    ctx.fillStyle = '#10263d';
    ctx.font = '700 22px Arial, sans-serif';
    ctx.fillText(`Cue: “${phaseCue14(key)}”`, 70, y + 480);
    y += 520;
  }
  return canvas;
}

async function shareCanvas14(canvas, filename, title) {
  const blob = await canvasBlob14(canvas);
  if (!blob) return false;
  const file = new File([blob], filename, { type: 'image/png' });
  if (navigator.share && (!navigator.canShare || navigator.canShare({ files: [file] }))) {
    try {
      await navigator.share({ title, files: [file] });
      return true;
    } catch (error) {
      if (error?.name === 'AbortError') return true;
    }
  }
  downloadBlob14(blob, filename);
  return false;
}

function createAnnotationDialog14() {
  if (document.getElementById('annotationDialog14')) return;
  const dialog = document.createElement('dialog');
  dialog.id = 'annotationDialog14';
  dialog.className = 'annotation-dialog14';
  dialog.innerHTML = `
    <div class="annotation-shell14">
      <div class="annotation-header14">
        <div><span class="phase-kicker">FRAME ANNOTATION</span><h3 id="annotationTitle14">Phase frame</h3></div>
        <button type="button" id="annotationClose14" class="small-ghost-button">Close</button>
      </div>
      <div class="annotation-toolbar14" role="toolbar" aria-label="Annotation tools">
        <button type="button" class="active" data-annotation-tool14="arrow">Arrow</button>
        <button type="button" data-annotation-tool14="line">Line</button>
        <button type="button" data-annotation-tool14="circle">Circle</button>
        <button type="button" data-annotation-tool14="text">Text</button>
        <span class="annotation-spacer14"></span>
        <button type="button" id="annotationUndo14">Undo</button>
        <button type="button" id="annotationClear14">Clear</button>
      </div>
      <div class="annotation-canvas-wrap14"><canvas id="annotationCanvas14"></canvas></div>
      <div class="annotation-footer14">
        <span>Use annotations sparingly. One clear visual cue is usually better than several marks.</span>
        <div><button type="button" id="annotationDownload14" class="small-ghost-button">Download PNG</button><button type="button" id="annotationSave14" class="primary-button">Save annotated frame</button></div>
      </div>
    </div>
  `;
  document.body.appendChild(dialog);

  dialog.querySelector('#annotationClose14').addEventListener('click', () => dialog.close());
  dialog.querySelectorAll('[data-annotation-tool14]').forEach(button => button.addEventListener('click', () => {
    exportState14.editor.tool = button.dataset.annotationTool14;
    dialog.querySelectorAll('[data-annotation-tool14]').forEach(item => item.classList.toggle('active', item === button));
  }));
  dialog.querySelector('#annotationUndo14').addEventListener('click', () => {
    const phase = exportState14.editor.phase;
    if (!phase) return;
    exportState14.annotations[phase] = exportState14.annotations[phase] || [];
    exportState14.annotations[phase].pop();
    delete exportState14.annotatedFrames[phase];
    renderAnnotationCanvas14();
  });
  dialog.querySelector('#annotationClear14').addEventListener('click', () => {
    const phase = exportState14.editor.phase;
    if (!phase) return;
    exportState14.annotations[phase] = [];
    delete exportState14.annotatedFrames[phase];
    renderAnnotationCanvas14();
  });
  dialog.querySelector('#annotationSave14').addEventListener('click', () => {
    const phase = exportState14.editor.phase;
    const canvas = document.getElementById('annotationCanvas14');
    if (!phase || !canvas) return;
    exportState14.annotatedFrames[phase] = canvas.toDataURL('image/png');
    dialog.close();
    updateExportState14();
  });
  dialog.querySelector('#annotationDownload14').addEventListener('click', () => {
    const phase = exportState14.editor.phase;
    const canvas = document.getElementById('annotationCanvas14');
    if (!phase || !canvas) return;
    downloadDataUrl14(canvas.toDataURL('image/png'), `${fileSafe14(paddlerName14())}_${fileSafe14(phaseName14(phase))}_annotated.png`);
  });

  const canvas = dialog.querySelector('#annotationCanvas14');
  canvas.addEventListener('pointerdown', annotationPointerDown14);
  canvas.addEventListener('pointermove', annotationPointerMove14);
  canvas.addEventListener('pointerup', annotationPointerUp14);
  canvas.addEventListener('pointercancel', annotationPointerUp14);
}

function canvasPoint14(event) {
  const canvas = document.getElementById('annotationCanvas14');
  const rect = canvas.getBoundingClientRect();
  return {
    x: (event.clientX - rect.left) * canvas.width / rect.width,
    y: (event.clientY - rect.top) * canvas.height / rect.height
  };
}

function annotationPointerDown14(event) {
  const phase = exportState14.editor.phase;
  if (!phase) return;
  event.currentTarget.setPointerCapture?.(event.pointerId);
  const point = canvasPoint14(event);
  if (exportState14.editor.tool === 'text') {
    const text = window.prompt('Annotation text:')?.trim();
    if (!text) return;
    exportState14.annotations[phase] = exportState14.annotations[phase] || [];
    exportState14.annotations[phase].push({ type: 'text', start: point, text });
    delete exportState14.annotatedFrames[phase];
    renderAnnotationCanvas14();
    return;
  }
  exportState14.editor.start = point;
  exportState14.editor.end = point;
  exportState14.editor.preview = { type: exportState14.editor.tool, start: point, end: point };
  renderAnnotationCanvas14();
}

function annotationPointerMove14(event) {
  if (!exportState14.editor.start || !exportState14.editor.preview) return;
  exportState14.editor.end = canvasPoint14(event);
  exportState14.editor.preview.end = exportState14.editor.end;
  renderAnnotationCanvas14();
}

function annotationPointerUp14(event) {
  const phase = exportState14.editor.phase;
  if (!phase || !exportState14.editor.start || !exportState14.editor.preview) return;
  const end = canvasPoint14(event);
  exportState14.annotations[phase] = exportState14.annotations[phase] || [];
  exportState14.annotations[phase].push({
    type: exportState14.editor.tool,
    start: exportState14.editor.start,
    end
  });
  exportState14.editor.start = null;
  exportState14.editor.end = null;
  exportState14.editor.preview = null;
  delete exportState14.annotatedFrames[phase];
  renderAnnotationCanvas14();
}

function drawAnnotationOp14(ctx, op) {
  if (!op) return;
  ctx.save();
  ctx.strokeStyle = '#ef3340';
  ctx.fillStyle = '#ef3340';
  ctx.lineWidth = 6;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  if (op.type === 'text') {
    ctx.font = '700 30px Arial, sans-serif';
    ctx.lineWidth = 5;
    ctx.strokeStyle = 'rgba(255,255,255,0.95)';
    ctx.strokeText(op.text, op.start.x, op.start.y);
    ctx.fillStyle = '#ef3340';
    ctx.fillText(op.text, op.start.x, op.start.y);
  } else if (op.type === 'circle') {
    const cx = (op.start.x + op.end.x) / 2;
    const cy = (op.start.y + op.end.y) / 2;
    const rx = Math.abs(op.end.x - op.start.x) / 2;
    const ry = Math.abs(op.end.y - op.start.y) / 2;
    ctx.beginPath();
    ctx.ellipse(cx, cy, Math.max(2, rx), Math.max(2, ry), 0, 0, Math.PI * 2);
    ctx.stroke();
  } else {
    ctx.beginPath();
    ctx.moveTo(op.start.x, op.start.y);
    ctx.lineTo(op.end.x, op.end.y);
    ctx.stroke();
    if (op.type === 'arrow') {
      const angle = Math.atan2(op.end.y - op.start.y, op.end.x - op.start.x);
      const head = 24;
      ctx.beginPath();
      ctx.moveTo(op.end.x, op.end.y);
      ctx.lineTo(op.end.x - head * Math.cos(angle - Math.PI / 6), op.end.y - head * Math.sin(angle - Math.PI / 6));
      ctx.lineTo(op.end.x - head * Math.cos(angle + Math.PI / 6), op.end.y - head * Math.sin(angle + Math.PI / 6));
      ctx.closePath();
      ctx.fill();
    }
  }
  ctx.restore();
}

function renderAnnotationCanvas14() {
  const phase = exportState14.editor.phase;
  const canvas = document.getElementById('annotationCanvas14');
  const image = exportState14.editor.image;
  if (!phase || !canvas || !image) return;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
  (exportState14.annotations[phase] || []).forEach(op => drawAnnotationOp14(ctx, op));
  if (exportState14.editor.preview) drawAnnotationOp14(ctx, exportState14.editor.preview);
}

async function openAnnotation14(phase) {
  const frame = state.markedFrames?.[phase];
  if (!frame) return;
  createAnnotationDialog14();
  const image = await loadImage14(frame.dataUrl);
  const canvas = document.getElementById('annotationCanvas14');
  const maxWidth = 1100;
  const width = Math.min(maxWidth, image.width);
  const height = Math.round(width * image.height / image.width);
  canvas.width = width;
  canvas.height = height;
  exportState14.editor.phase = phase;
  exportState14.editor.image = image;
  exportState14.editor.start = null;
  exportState14.editor.preview = null;
  document.getElementById('annotationTitle14').textContent = `${phaseName14(phase)} · ${paddlerName14()}`;
  renderAnnotationCanvas14();
  document.getElementById('annotationDialog14').showModal();
}

function addKeyFrameExportActions14() {
  if (!els.keyFrames) return;
  const presentKeys = phaseOrder14.filter(key => state.markedFrames?.[key]);
  const cards = [...els.keyFrames.querySelectorAll('.enhanced-key-frame, .key-frame-card')];
  presentKeys.forEach((key, index) => {
    const card = cards[index];
    if (!card || card.querySelector('.phase-export-actions14')) return;
    const actions = document.createElement('div');
    actions.className = 'phase-export-actions14';
    const annotated = Boolean(exportState14.annotatedFrames[key]);
    actions.innerHTML = `
      <button type="button" data-download-phase14="${key}">Download PNG</button>
      <button type="button" data-annotate-phase14="${key}">${annotated ? 'Edit annotation' : 'Annotate'}</button>
      ${annotated ? '<span class="annotated-badge14">Annotated</span>' : ''}
    `;
    actions.querySelector('[data-download-phase14]').addEventListener('click', () => {
      downloadDataUrl14(preferredFrame14(key), `${fileSafe14(paddlerName14())}_${fileSafe14(phaseName14(key))}.png`);
    });
    actions.querySelector('[data-annotate-phase14]').addEventListener('click', () => openAnnotation14(key));
    card.appendChild(actions);
  });
}

function createExportHub14() {
  if (document.getElementById('exportHub14')) return;
  const hub = document.createElement('section');
  hub.id = 'exportHub14';
  hub.className = 'export-hub14 hidden';
  hub.innerHTML = `
    <div class="export-heading14">
      <div><span class="phase-kicker">RELEASE 1.4</span><h3>Export & Share</h3><p>Turn the coach review into something the paddler can keep.</p></div>
      <span id="exportFrameStatus14" class="export-status14">0 / 4 phases marked</span>
    </div>
    <div class="export-grid14">
      <article><strong>Phase snapshots</strong><p>Download the marked Set-up, Catch, Pull, and Exit/Recovery images individually. Saved annotations are included.</p><button type="button" id="downloadAllPhases14" class="small-ghost-button">Download phase PNGs</button></article>
      <article><strong>4-phase stroke sheet</strong><p>One KDBC-branded image showing all four phases with the coaching cue for each phase.</p><div class="export-card-actions14"><button type="button" id="downloadStrokeSheet14" class="primary-button">Download stroke sheet</button><button type="button" id="shareStrokeSheet14" class="small-ghost-button">Share</button></div></article>
      <article><strong>Paddler review pack</strong><p>Combines the four phase images, top priorities, cues, drills, and edited paddler message into one image.</p><button type="button" id="downloadReviewPack14" class="primary-button">Download review pack</button></article>
      <article><strong>Paddler vs reference</strong><p>Creates a side-by-side phase sheet using the reference positions you marked. Compare sequence and organization, not exact body angles.</p><button type="button" id="downloadComparison14" class="small-ghost-button">Download comparison</button></article>
    </div>
    <p id="exportNotice14" class="export-notice14"></p>
  `;
  els.keyFramesSection?.insertAdjacentElement('afterend', hub);

  hub.querySelector('#downloadAllPhases14').addEventListener('click', () => {
    phaseOrder14.forEach((key, index) => {
      if (!state.markedFrames?.[key]) return;
      setTimeout(() => downloadDataUrl14(preferredFrame14(key), `${fileSafe14(paddlerName14())}_${fileSafe14(phaseName14(key))}.png`), index * 160);
    });
  });
  hub.querySelector('#downloadStrokeSheet14').addEventListener('click', async () => {
    await runExportAction14('Creating stroke sheet…', async () => {
      const canvas = await createStrokeSheet14();
      downloadBlob14(await canvasBlob14(canvas), `${fileSafe14(paddlerName14())}_KDBC_Stroke_Sequence.png`);
    });
  });
  hub.querySelector('#shareStrokeSheet14').addEventListener('click', async () => {
    await runExportAction14('Preparing stroke sheet…', async () => {
      const canvas = await createStrokeSheet14();
      await shareCanvas14(canvas, `${fileSafe14(paddlerName14())}_KDBC_Stroke_Sequence.png`, `${paddlerName14()} · KDBC Stroke Sequence`);
    });
  });
  hub.querySelector('#downloadReviewPack14').addEventListener('click', async () => {
    await runExportAction14('Creating paddler review pack…', async () => {
      const canvas = await createReviewPack14();
      downloadBlob14(await canvasBlob14(canvas), `${fileSafe14(paddlerName14())}_KDBC_Review.png`);
    });
  });
  hub.querySelector('#downloadComparison14').addEventListener('click', async () => {
    await runExportAction14('Capturing reference phases…', async () => {
      const canvas = await createComparisonSheet14();
      downloadBlob14(await canvasBlob14(canvas), `${fileSafe14(paddlerName14())}_KDBC_Reference_Comparison.png`);
    });
  });
}

async function runExportAction14(message, action) {
  const target = document.getElementById('exportNotice14');
  if (target) {
    target.textContent = message;
    target.classList.remove('error');
  }
  try {
    await action();
    if (target) target.textContent = 'Ready.';
  } catch (error) {
    if (target) {
      target.textContent = error?.message || 'Could not create that export.';
      target.classList.add('error');
    }
  }
}

function createStrokeLoopTools14() {
  if (document.getElementById('strokeLoop14')) return;
  const card = document.getElementById('clipPlayerCard');
  const anchor = card?.querySelector('.video-options');
  if (!card || !anchor) return;
  const tools = document.createElement('section');
  tools.id = 'strokeLoop14';
  tools.className = 'stroke-loop14';
  tools.innerHTML = `
    <div class="stroke-loop-heading14"><div><strong>Stroke loop & clip export</strong><span>Loop one stroke or export the reviewed range at normal or slow speed.</span></div><span class="beta-badge14">On-device</span></div>
    <div class="stroke-loop-controls14">
      <button type="button" id="setLoopStart14">Set start</button>
      <span id="loopStart14">Start: not set</span>
      <button type="button" id="setLoopEnd14">Set end</button>
      <span id="loopEnd14">End: not set</span>
      <button type="button" id="useMarkedStroke14">Use marked stroke</button>
    </div>
    <div class="stroke-loop-play14">
      <button type="button" id="toggleStrokeLoop14" class="small-ghost-button">Start loop</button>
      <label>Loop speed<select id="loopSpeed14"><option value="1">1x</option><option value="0.75">0.75x</option><option value="0.5" selected>0.5x</option><option value="0.25">0.25x</option></select></label>
      <button type="button" id="downloadOriginal14" class="small-ghost-button">Download original clip</button>
      <label>Export speed<select id="exportSpeed14"><option value="1">1x trimmed</option><option value="0.75">0.75x</option><option value="0.5" selected>0.5x slow motion</option><option value="0.25">0.25x slow motion</option></select></label>
      <button type="button" id="exportSlowMo14" class="primary-button">Export reviewed clip</button>
    </div>
    <p id="clipExportStatus14" class="clip-export-status14">Video export is encoded locally in your browser. Support depends on the device/browser.</p>
  `;
  anchor.insertAdjacentElement('afterend', tools);

  tools.querySelector('#setLoopStart14').addEventListener('click', () => {
    exportState14.loop.start = Number(els.clipPreview.currentTime.toFixed(3));
    if (Number.isFinite(exportState14.loop.end) && exportState14.loop.end <= exportState14.loop.start) exportState14.loop.end = null;
    updateLoopControls14();
  });
  tools.querySelector('#setLoopEnd14').addEventListener('click', () => {
    const time = Number(els.clipPreview.currentTime.toFixed(3));
    if (Number.isFinite(exportState14.loop.start) && time <= exportState14.loop.start) {
      setClipExportStatus14('End must be after the loop start.', true);
      return;
    }
    exportState14.loop.end = time;
    updateLoopControls14();
  });
  tools.querySelector('#useMarkedStroke14').addEventListener('click', () => useMarkedStroke14());
  tools.querySelector('#loopSpeed14').addEventListener('change', event => {
    exportState14.loop.speed = Number(event.target.value) || 0.5;
    if (exportState14.loop.enabled) setClipPlaybackRate14(exportState14.loop.speed);
  });
  tools.querySelector('#toggleStrokeLoop14').addEventListener('click', toggleStrokeLoop14);
  tools.querySelector('#downloadOriginal14').addEventListener('click', () => {
    if (!state.clipUrl || !state.clipFile) return;
    const link = document.createElement('a');
    link.href = state.clipUrl;
    link.download = state.clipFile.name || `${fileSafe14(paddlerName14())}_original_video`;
    document.body.appendChild(link);
    link.click();
    link.remove();
  });
  tools.querySelector('#exportSlowMo14').addEventListener('click', async () => {
    const speed = Number(document.getElementById('exportSpeed14')?.value) || 0.5;
    try {
      await exportVideoRange14(speed);
    } catch (error) {
      setClipExportStatus14(error?.message || 'Video export could not be completed on this browser.', true);
    }
  });

  els.clipPreview.addEventListener('timeupdate', () => {
    if (!exportState14.loop.enabled) return;
    const { start, end } = exportState14.loop;
    if (!Number.isFinite(start) || !Number.isFinite(end)) return;
    if (els.clipPreview.currentTime >= end - 0.01) {
      els.clipPreview.currentTime = start;
      els.clipPreview.play().catch(() => {});
    }
  });
  els.clipPreview.addEventListener('play', () => {
    if (!exportState14.loop.enabled) return;
    const { start, end } = exportState14.loop;
    if (Number.isFinite(start) && Number.isFinite(end) && (els.clipPreview.currentTime < start || els.clipPreview.currentTime >= end)) els.clipPreview.currentTime = start;
  });
  updateLoopControls14();
}

function setClipPlaybackRate14(speed) {
  els.clipPreview.playbackRate = speed;
  if (els.clipSpeed) els.clipSpeed.value = String(speed);
}

function useMarkedStroke14() {
  const setup = state.markedFrames?.setup?.time;
  const exit = state.markedFrames?.exit?.time;
  if (!Number.isFinite(setup) || !Number.isFinite(exit) || exit <= setup) {
    setClipExportStatus14('Mark Set-up and Exit/Recovery from the same stroke first, or set the loop range manually.', true);
    return;
  }
  exportState14.loop.start = setup;
  const duration = Number.isFinite(els.clipPreview.duration) ? els.clipPreview.duration : exit + 0.35;
  exportState14.loop.end = Math.min(duration, exit + 0.35);
  updateLoopControls14();
  setClipExportStatus14('Marked stroke range loaded. Adjust Start or End manually if needed.');
}

function updateLoopControls14() {
  const start = exportState14.loop.start;
  const end = exportState14.loop.end;
  const startTarget = document.getElementById('loopStart14');
  const endTarget = document.getElementById('loopEnd14');
  if (startTarget) startTarget.textContent = `Start: ${Number.isFinite(start) ? `${start.toFixed(2)}s` : 'not set'}`;
  if (endTarget) endTarget.textContent = `End: ${Number.isFinite(end) ? `${end.toFixed(2)}s` : 'not set'}`;
  const toggle = document.getElementById('toggleStrokeLoop14');
  if (toggle) {
    toggle.disabled = !(Number.isFinite(start) && Number.isFinite(end) && end > start);
    toggle.textContent = exportState14.loop.enabled ? 'Stop loop' : 'Start loop';
    toggle.classList.toggle('active', exportState14.loop.enabled);
  }
  const exportButton = document.getElementById('exportSlowMo14');
  if (exportButton) exportButton.disabled = !(Number.isFinite(start) && Number.isFinite(end) && end > start && state.clipUrl);
}

function toggleStrokeLoop14() {
  const { start, end } = exportState14.loop;
  if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) return;
  exportState14.loop.enabled = !exportState14.loop.enabled;
  if (exportState14.loop.enabled) {
    els.clipPreview.currentTime = start;
    setClipPlaybackRate14(exportState14.loop.speed);
    els.clipPreview.play().catch(() => {});
  } else {
    els.clipPreview.pause();
  }
  updateLoopControls14();
}

function setClipExportStatus14(message, error = false) {
  const target = document.getElementById('clipExportStatus14');
  if (!target) return;
  target.textContent = message;
  target.classList.toggle('error', error);
}

function chooseRecorderMime14() {
  if (typeof MediaRecorder === 'undefined') return '';
  const candidates = [
    'video/mp4;codecs=avc1.42E01E',
    'video/mp4',
    'video/webm;codecs=vp9',
    'video/webm;codecs=vp8',
    'video/webm'
  ];
  return candidates.find(type => !MediaRecorder.isTypeSupported || MediaRecorder.isTypeSupported(type)) || '';
}

function waitForMetadata14(video) {
  return new Promise((resolve, reject) => {
    if (video.readyState >= 1 && video.videoWidth) return resolve();
    const done = () => {
      video.removeEventListener('loadedmetadata', done);
      video.removeEventListener('error', fail);
      resolve();
    };
    const fail = () => reject(new Error('The uploaded video could not be prepared for export.'));
    video.addEventListener('loadedmetadata', done, { once: true });
    video.addEventListener('error', fail, { once: true });
  });
}

async function exportVideoRange14(speed) {
  const start = exportState14.loop.start;
  const end = exportState14.loop.end;
  if (!state.clipUrl || !Number.isFinite(start) || !Number.isFinite(end) || end <= start) throw new Error('Set a valid reviewed range first.');
  if (typeof MediaRecorder === 'undefined' || typeof HTMLCanvasElement.prototype.captureStream !== 'function') {
    throw new Error('This browser does not support on-device slow-motion encoding. You can still download the original clip and all image exports.');
  }

  const mimeType = chooseRecorderMime14();
  if (!mimeType) throw new Error('This browser does not expose a compatible local video encoder.');

  setClipExportStatus14(`Encoding ${speed}x reviewed clip locally. Keep this tab open until it finishes.`);
  const source = document.createElement('video');
  source.src = state.clipUrl;
  source.muted = true;
  source.playsInline = true;
  source.preload = 'auto';
  source.style.position = 'fixed';
  source.style.left = '-10000px';
  source.style.width = '1px';
  source.style.height = '1px';
  document.body.appendChild(source);
  await waitForMetadata14(source);
  await seekVideo14(source, start);
  source.playbackRate = speed;

  const maxWidth = 1280;
  const width = Math.min(maxWidth, source.videoWidth);
  const height = Math.max(2, Math.round(width * source.videoHeight / source.videoWidth));
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d', { alpha: false });
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, width, height);
  ctx.drawImage(source, 0, 0, width, height);

  const stream = canvas.captureStream(30);
  const chunks = [];
  let recorder;
  try {
    recorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: width >= 1000 ? 6000000 : 3500000 });
  } catch {
    recorder = new MediaRecorder(stream);
  }

  const blobPromise = new Promise((resolve, reject) => {
    recorder.addEventListener('dataavailable', event => { if (event.data?.size) chunks.push(event.data); });
    recorder.addEventListener('stop', () => resolve(new Blob(chunks, { type: recorder.mimeType || mimeType })));
    recorder.addEventListener('error', () => reject(new Error('The browser stopped the video encoder.')));
  });

  let animationFrame = 0;
  let stopped = false;
  const stop = () => {
    if (stopped) return;
    stopped = true;
    source.pause();
    cancelAnimationFrame(animationFrame);
    if (recorder.state !== 'inactive') recorder.stop();
  };
  const draw = () => {
    if (stopped) return;
    ctx.drawImage(source, 0, 0, width, height);
    const percent = Math.max(0, Math.min(100, ((source.currentTime - start) / (end - start)) * 100));
    setClipExportStatus14(`Encoding ${speed}x reviewed clip locally: ${Math.round(percent)}%`);
    if (source.currentTime >= end - 0.008 || source.ended) {
      stop();
      return;
    }
    animationFrame = requestAnimationFrame(draw);
  };

  recorder.start(500);
  await source.play();
  animationFrame = requestAnimationFrame(draw);
  const blob = await blobPromise;
  source.remove();
  stream.getTracks().forEach(track => track.stop());

  const type = blob.type || mimeType;
  const extension = type.includes('mp4') ? 'mp4' : 'webm';
  const speedLabel = speed === 1 ? 'trimmed' : `${String(speed).replace('.', '_')}x_slowmo`;
  downloadBlob14(blob, `${fileSafe14(paddlerName14())}_stroke_${speedLabel}.${extension}`);
  setClipExportStatus14(`Finished. ${speed === 1 ? 'Trimmed clip' : `${speed}x slow-motion clip`} downloaded.`);
}

function updateExportState14() {
  createExportHub14();
  addKeyFrameExportActions14();
  const count = markedFrameCount14();
  const hub = document.getElementById('exportHub14');
  hub?.classList.toggle('hidden', count === 0);
  const status = document.getElementById('exportFrameStatus14');
  if (status) status.textContent = `${count} / 4 phases marked`;
  const complete = count === 4;
  const sheet = document.getElementById('downloadStrokeSheet14');
  const share = document.getElementById('shareStrokeSheet14');
  const pack = document.getElementById('downloadReviewPack14');
  if (sheet) sheet.disabled = !complete;
  if (share) share.disabled = !complete;
  if (pack) pack.disabled = !(complete && state.result);
  const refReady = Boolean(state.referenceFile) && phaseOrder14.some(key => state.markedFrames?.[key] && Number.isFinite(releaseState.referenceMarks?.[key]));
  const compare = document.getElementById('downloadComparison14');
  if (compare) compare.disabled = !refReady;
  updateLoopControls14();
}

function observeRelease14() {
  if (els.keyFrames) {
    const observer = new MutationObserver(() => updateExportState14());
    observer.observe(els.keyFrames, { childList: true, subtree: true });
  }
  const resultObserver = new MutationObserver(() => updateExportState14());
  resultObserver.observe(els.resultPanel, { attributes: true, childList: true, subtree: true });
  const referenceMarks = document.getElementById('referenceMarks');
  if (referenceMarks) {
    const referenceObserver = new MutationObserver(() => updateExportState14());
    referenceObserver.observe(referenceMarks, { childList: true, subtree: true });
  }
  els.clipInput?.addEventListener('change', () => {
    exportState14.annotations = {};
    exportState14.annotatedFrames = {};
    exportState14.loop.start = null;
    exportState14.loop.end = null;
    exportState14.loop.enabled = false;
    setTimeout(updateExportState14, 50);
  });
}

function initializeRelease14() {
  createAnnotationDialog14();
  createExportHub14();
  createStrokeLoopTools14();
  observeRelease14();
  updateExportState14();
  const badge = document.querySelector('.local-badge');
  if (badge) badge.textContent = 'Release 1.4 · Export & Sharing';
}

initializeRelease14();
