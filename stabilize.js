/* Release 1.2.1 stabilization and usability */

const stabilization = {
  logoUrl: 'https://raw.githubusercontent.com/rselibiomd/dragon-boat-training-builder/main/public/kdbc-logo.jpeg',
  skinKey: 'kdbc-stroke-review-skin'
};

function currentReviewHasWork() {
  return Boolean(
    Object.keys(state.markedFrames || {}).length ||
    state.selectedCorrections?.length ||
    state.selectedStrengths?.size ||
    state.result ||
    els.coachNote?.value.trim()
  );
}

function applySkin(skin) {
  const allowed = ['kdbc-night', 'focus-teal', 'deck-light'];
  const next = allowed.includes(skin) ? skin : 'kdbc-night';
  document.documentElement.dataset.skin = next;
  const picker = document.getElementById('skinSelect');
  if (picker) picker.value = next;
  try { localStorage.setItem(stabilization.skinKey, next); } catch {}
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.content = next === 'deck-light' ? '#f3f6f8' : next === 'focus-teal' ? '#07101c' : '#081325';
}

function initializeSkin() {
  let saved = 'kdbc-night';
  try { saved = localStorage.getItem(stabilization.skinKey) || saved; } catch {}
  applySkin(saved);
  document.getElementById('skinSelect')?.addEventListener('change', event => applySkin(event.target.value));
}

function addFileActions() {
  for (const kind of ['clip', 'reference']) {
    const meta = kind === 'clip' ? els.clipMeta : els.referenceMeta;
    if (!meta || document.getElementById(`${kind}FileActions`)) continue;
    const row = document.createElement('div');
    row.id = `${kind}FileActions`;
    row.className = 'file-action-row hidden';
    row.innerHTML = `
      <button type="button" class="small-ghost-button" data-replace-file="${kind}">Replace ${kind === 'clip' ? 'clip' : 'reference'}</button>
      <button type="button" class="small-ghost-button danger-text" data-remove-file="${kind}">Remove</button>
    `;
    meta.insertAdjacentElement('afterend', row);
  }

  document.querySelectorAll('[data-replace-file]').forEach(button => {
    button.addEventListener('click', () => {
      const kind = button.dataset.replaceFile;
      if (kind === 'clip' && currentReviewHasWork() && !window.confirm('Replacing the paddler clip will clear the current key frames and review selections. Continue?')) return;
      (kind === 'clip' ? els.clipInput : els.referenceInput).click();
    });
  });

  document.querySelectorAll('[data-remove-file]').forEach(button => {
    button.addEventListener('click', () => removeVideo(button.dataset.removeFile));
  });

  els.clipInput.addEventListener('change', () => setTimeout(() => setFileActionVisibility('clip'), 0));
  els.referenceInput.addEventListener('change', () => setTimeout(() => setFileActionVisibility('reference'), 0));

  for (const [kind, zone] of [['clip', document.getElementById('clipDropZone')], ['reference', document.getElementById('referenceDropZone')]]) {
    zone?.addEventListener('drop', event => {
      if (kind === 'clip' && state.clipFile && currentReviewHasWork()) {
        if (!window.confirm('Replacing the paddler clip will clear the current key frames and review selections. Continue?')) {
          event.preventDefault();
          event.stopImmediatePropagation();
        }
      }
    }, true);
  }
}

function setFileActionVisibility(kind) {
  const row = document.getElementById(`${kind}FileActions`);
  if (!row) return;
  row.classList.toggle('hidden', !(kind === 'clip' ? state.clipFile : state.referenceFile));
}

function removeVideo(kind) {
  if (kind === 'clip') {
    if (currentReviewHasWork() && !window.confirm('Remove the paddler clip and clear the current review?')) return;
    revoke(state.clipUrl);
    state.clipUrl = null;
    state.clipFile = null;
    state.markedFrames = {};
    state.result = null;
    els.clipInput.value = '';
    els.clipPreview.pause();
    els.clipPreview.removeAttribute('src');
    els.clipPreview.load();
    els.clipMeta.textContent = '';
    els.clipMeta.classList.add('hidden');
    els.reviewWorkspace.classList.add('hidden');
    els.coachReview.classList.add('hidden');
    els.resultPanel.classList.add('hidden');
    if (typeof resetSelections === 'function') resetSelections();
    if (typeof renderKeyFrames === 'function') renderKeyFrames();
    if (typeof releaseState !== 'undefined') releaseState.frameLabels = {};
  } else {
    revoke(state.referenceUrl);
    state.referenceUrl = null;
    state.referenceFile = null;
    els.referenceInput.value = '';
    els.referencePreview.pause();
    els.referencePreview.removeAttribute('src');
    els.referencePreview.load();
    els.referenceMeta.textContent = '';
    els.referenceMeta.classList.add('hidden');
    document.getElementById('referenceCard')?.classList.add('hidden');
    if (typeof releaseState !== 'undefined') releaseState.referenceMarks = {};
    if (typeof renderReferenceMarks === 'function') renderReferenceMarks();
  }
  setFileActionVisibility(kind);
  if (typeof updateExternalPlayer === 'function') updateExternalPlayer(kind);
  updateReviewCompletion();
}

function preserveReplaceWarning() {
  els.clipInput.addEventListener('click', event => {
    if (state.clipFile && currentReviewHasWork() && !event.isTrusted) return;
    if (state.clipFile && currentReviewHasWork() && !window.confirm('Replacing the paddler clip will clear the current key frames and review selections. Continue?')) {
      event.preventDefault();
    }
  });
}

function updatePhaseButtons() {
  document.querySelectorAll('[data-mark-phase]').forEach(button => {
    const phase = button.dataset.markPhase;
    const frame = state.markedFrames?.[phase];
    const label = releasePhaseLabel(phase).replace(' / Recovery', '/Recovery');
    button.textContent = frame ? `✓ ${label} · ${frame.time.toFixed(2)}s` : label;
    button.classList.toggle('marked', Boolean(frame));
  });
}

function ensureCompletionIndicator() {
  if (document.getElementById('reviewCompletion')) return;
  const workspaceHeading = els.reviewWorkspace?.querySelector('.section-heading');
  const indicator = document.createElement('div');
  indicator.id = 'reviewCompletion';
  indicator.className = 'review-completion';
  workspaceHeading?.insertAdjacentElement('afterend', indicator);
}

function updateReviewCompletion() {
  ensureCompletionIndicator();
  const indicator = document.getElementById('reviewCompletion');
  if (!indicator) return;
  const pieces = ['setup', 'catch', 'pull', 'exit'].map(key => {
    const complete = Boolean(state.markedFrames?.[key]);
    return `<span class="${complete ? 'complete' : ''}">${complete ? '✓ ' : ''}${releasePhaseLabel(key)}</span>`;
  });
  const selected = state.selectedCorrections?.length || 0;
  pieces.push(`<span class="${selected ? 'complete' : ''}">${selected} priorit${selected === 1 ? 'y' : 'ies'} selected</span>`);
  indicator.innerHTML = pieces.join('');
}

function wireCompletionUpdates() {
  document.querySelectorAll('[data-mark-phase]').forEach(button => {
    button.addEventListener('click', () => setTimeout(() => {
      updatePhaseButtons();
      updateReviewCompletion();
    }, 0));
  });

  els.clearFramesButton?.addEventListener('click', () => setTimeout(() => {
    updatePhaseButtons();
    updateReviewCompletion();
  }, 0));

  els.phaseReview?.addEventListener('change', () => setTimeout(updateReviewCompletion, 0));
  els.priorityBuilderList?.addEventListener('click', () => setTimeout(updateReviewCompletion, 0));
}

function activeReviewKind() {
  if (document.fullscreenElement?.dataset?.playerKind) return document.fullscreenElement.dataset.playerKind;
  if (document.querySelector('.video-review-card.pseudo-fullscreen')?.dataset?.playerKind) return document.querySelector('.video-review-card.pseudo-fullscreen').dataset.playerKind;
  return 'clip';
}

function triggerPhaseMark(index) {
  const key = ['setup', 'catch', 'pull', 'exit'][index];
  document.querySelector(`[data-mark-phase="${key}"]`)?.click();
}

function wireKeyboardShortcuts() {
  document.addEventListener('keydown', event => {
    const tag = event.target?.tagName?.toLowerCase();
    if (['input', 'textarea', 'select'].includes(tag) || event.target?.isContentEditable) return;
    if (!state.clipFile) return;

    const kind = activeReviewKind();
    const video = kind === 'reference' ? els.referencePreview : els.clipPreview;

    if (event.code === 'Space') {
      event.preventDefault();
      if (video.paused || video.ended) video.play().catch(() => {}); else video.pause();
      return;
    }
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      const direction = event.key === 'ArrowRight' ? 1 : -1;
      const amount = event.shiftKey ? 0.5 : direction / getFps(kind);
      nudgeVideo(kind, event.shiftKey ? direction * 0.5 : amount);
      return;
    }
    if (kind === 'clip' && ['1', '2', '3', '4'].includes(event.key)) {
      event.preventDefault();
      triggerPhaseMark(Number(event.key) - 1);
      return;
    }
    if (event.key.toLowerCase() === 'f') {
      event.preventDefault();
      toggleReviewFullscreen(kind);
    }
  });
}

function addKeyboardHint() {
  if (document.getElementById('keyboardHint')) return;
  const hint = document.createElement('details');
  hint.id = 'keyboardHint';
  hint.className = 'keyboard-hint';
  hint.innerHTML = `
    <summary>Keyboard shortcuts</summary>
    <span>Space Play/Pause</span><span>←/→ Frame</span><span>Shift + ←/→ ±0.5s</span><span>1/2/3/4 Mark phases</span><span>F Fullscreen</span>
  `;
  document.querySelector('.workspace-intro')?.insertAdjacentElement('afterend', hint);
}

function ensurePrintMessage() {
  if (document.getElementById('printPaddlerMessage')) return;
  const resultHeader = els.resultPanel?.querySelector('.result-header');
  const printBlock = document.createElement('section');
  printBlock.id = 'printPaddlerMessage';
  printBlock.className = 'print-paddler-message';
  printBlock.innerHTML = `
    <div class="print-brand"><img src="${stabilization.logoUrl}" alt="KDBC logo"><div><strong>Kingston Dragon Boat Club</strong><span>Dragonboat Stroke Review</span></div></div>
    <div id="printPaddlerMessageText"></div>
  `;
  resultHeader?.insertAdjacentElement('afterend', printBlock);
}

function syncPrintMessage() {
  ensurePrintMessage();
  const text = document.getElementById('editableFeedback')?.value || (typeof resultAsText === 'function' ? resultAsText() : '');
  const target = document.getElementById('printPaddlerMessageText');
  if (target) target.textContent = text;
}

function wirePrintPolish() {
  window.addEventListener('beforeprint', syncPrintMessage);
  document.getElementById('editableFeedback')?.addEventListener('input', syncPrintMessage);
  const originalPrint = els.printButton;
  if (originalPrint) originalPrint.addEventListener('click', syncPrintMessage, true);
}

initializeSkin();
addFileActions();
preserveReplaceWarning();
ensureCompletionIndicator();
wireCompletionUpdates();
updatePhaseButtons();
updateReviewCompletion();
wireKeyboardShortcuts();
addKeyboardHint();
ensurePrintMessage();
wirePrintPolish();
setFileActionVisibility('clip');
setFileActionVisibility('reference');
