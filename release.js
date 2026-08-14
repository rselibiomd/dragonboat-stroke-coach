/* Release 1.1 + 1.2 enhancements for KDBC Dragonboat Stroke Review */

const releaseState = {
  reviewMode: 'quick',
  activePhase: 'setup',
  referenceMarks: {},
  frameLabels: {},
  feedbackStyle: 'coach'
};

const releasePhaseOrder = ['setup', 'catch', 'pull', 'exit'];

function releasePhaseLabel(key) {
  return phaseLabels[key] || key;
}

function injectReleaseControls() {
  const badge = document.querySelector('.local-badge');
  if (badge) badge.textContent = 'Release 1.2 · 100% browser based';

  const guide = document.querySelector('.selection-guide');
  if (guide && !document.getElementById('reviewModeControls')) {
    const wrapper = document.createElement('div');
    wrapper.id = 'reviewModeControls';
    wrapper.className = 'release-toolbar';
    wrapper.innerHTML = `
      <div class="mode-switch" role="group" aria-label="Review mode">
        <button type="button" class="mode-button active" data-review-mode="quick">Quick Review</button>
        <button type="button" class="mode-button" data-review-mode="advanced">Advanced Review</button>
      </div>
      <div class="phase-tabs" id="phaseTabs" role="tablist" aria-label="Stroke phase">
        ${releasePhaseOrder.map((key, index) => `
          <button type="button" class="phase-tab ${index === 0 ? 'active' : ''}" data-phase-tab="${key}">${releasePhaseLabel(key)}</button>
        `).join('')}
      </div>
    `;
    guide.insertAdjacentElement('afterend', wrapper);
  }

  if (!document.getElementById('feedbackStyle')) {
    const grid = document.querySelector('.review-info-grid');
    const label = document.createElement('label');
    label.innerHTML = `
      <span>Feedback format</span>
      <select id="feedbackStyle">
        <option value="quick">Quick message</option>
        <option value="coach" selected>Coach review</option>
        <option value="detailed">Detailed review</option>
      </select>
    `;
    grid?.appendChild(label);
  }

  injectReferenceMatching();
  injectEditableFeedback();
  preparePhaseCards();
  wireReleaseControls();
  replaceGenerateHandler();
  replaceCopyHandler();
  enhanceKeyFrames();
  setReviewMode('quick');
}

function preparePhaseCards() {
  const cards = [...els.phaseReview.querySelectorAll('.phase-review-card')];
  releasePhaseOrder.forEach((key, index) => {
    const card = cards[index];
    if (!card) return;
    card.dataset.phaseKey = key;
    const heading = card.querySelector('.phase-review-heading');
    if (heading && !heading.querySelector('.quick-phase-tools')) {
      const tools = document.createElement('div');
      tools.className = 'quick-phase-tools';
      tools.innerHTML = `
        <button type="button" class="small-ghost-button" data-jump-marked="${key}">Jump to marked frame</button>
        <span class="phase-frame-status" data-phase-frame-status="${key}">No key frame marked</span>
      `;
      heading.appendChild(tools);
    }
  });
  updateMarkedFrameStatuses();
}

function wireReleaseControls() {
  document.querySelectorAll('[data-review-mode]').forEach(button => {
    button.addEventListener('click', () => setReviewMode(button.dataset.reviewMode));
  });

  document.querySelectorAll('[data-phase-tab]').forEach(button => {
    button.addEventListener('click', () => setActivePhase(button.dataset.phaseTab, true));
  });

  document.querySelectorAll('[data-jump-marked]').forEach(button => {
    button.addEventListener('click', () => jumpToMarkedFrame(button.dataset.jumpMarked));
  });

  const feedbackStyle = document.getElementById('feedbackStyle');
  feedbackStyle?.addEventListener('change', () => {
    releaseState.feedbackStyle = feedbackStyle.value;
    if (state.result) applyFeedbackStyle();
  });

  els.clipInput.addEventListener('change', () => {
    releaseState.frameLabels = {};
    setTimeout(() => {
      enhanceKeyFrames();
      updateMarkedFrameStatuses();
    }, 0);
  });

  els.referenceInput.addEventListener('change', () => {
    releaseState.referenceMarks = {};
    renderReferenceMarks();
  });
}

function setReviewMode(mode) {
  releaseState.reviewMode = mode === 'advanced' ? 'advanced' : 'quick';
  document.querySelectorAll('[data-review-mode]').forEach(button => {
    button.classList.toggle('active', button.dataset.reviewMode === releaseState.reviewMode);
  });
  document.getElementById('phaseTabs')?.classList.toggle('hidden', releaseState.reviewMode !== 'quick');
  els.phaseReview.classList.toggle('quick-mode', releaseState.reviewMode === 'quick');
  els.phaseReview.classList.toggle('advanced-mode', releaseState.reviewMode === 'advanced');
  setActivePhase(releaseState.activePhase, false);
}

function setActivePhase(phaseKey, jumpToFrame = false) {
  releaseState.activePhase = phaseKey;
  document.querySelectorAll('[data-phase-tab]').forEach(button => {
    button.classList.toggle('active', button.dataset.phaseTab === phaseKey);
  });
  els.phaseReview.querySelectorAll('.phase-review-card').forEach(card => {
    if (releaseState.reviewMode === 'quick') {
      card.classList.toggle('phase-hidden', card.dataset.phaseKey !== phaseKey);
    } else {
      card.classList.remove('phase-hidden');
    }
  });
  if (jumpToFrame) jumpToMarkedFrame(phaseKey, false);
}

function jumpToMarkedFrame(phaseKey, scroll = true) {
  const frame = state.markedFrames[phaseKey];
  if (!frame) return;
  els.clipPreview.pause();
  els.clipPreview.currentTime = frame.time;
  if (scroll) els.clipPreview.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function updateMarkedFrameStatuses() {
  releasePhaseOrder.forEach(key => {
    const target = document.querySelector(`[data-phase-frame-status="${key}"]`);
    if (!target) return;
    const frame = state.markedFrames[key];
    target.textContent = frame ? `Key frame: ${frame.time.toFixed(2)}s` : 'No key frame marked';
    target.classList.toggle('has-frame', Boolean(frame));
  });
}

function injectReferenceMatching() {
  if (document.getElementById('referencePhaseTools')) return;
  const referenceCard = document.getElementById('referenceCard');
  if (!referenceCard) return;

  const tools = document.createElement('div');
  tools.id = 'referencePhaseTools';
  tools.className = 'reference-phase-tools';
  tools.innerHTML = `
    <div class="reference-tool-heading">
      <strong>Reference phase matching</strong>
      <span>Pause the reference at each phase, then save that position.</span>
    </div>
    <div class="reference-mark-buttons">
      ${releasePhaseOrder.map(key => `<button type="button" data-reference-mark="${key}">Mark ${releasePhaseLabel(key)}</button>`).join('')}
    </div>
    <div id="referenceMarks" class="reference-marks"></div>
    <div class="compare-phase-row">
      <span>Compare marked phases:</span>
      ${releasePhaseOrder.map(key => `<button type="button" class="compare-button" data-compare-phase="${key}" disabled>${releasePhaseLabel(key)}</button>`).join('')}
    </div>
  `;
  referenceCard.appendChild(tools);

  tools.querySelectorAll('[data-reference-mark]').forEach(button => {
    button.addEventListener('click', () => {
      const key = button.dataset.referenceMark;
      releaseState.referenceMarks[key] = Number(els.referencePreview.currentTime.toFixed(3));
      renderReferenceMarks();
    });
  });

  tools.querySelectorAll('[data-compare-phase]').forEach(button => {
    button.addEventListener('click', () => comparePhase(button.dataset.comparePhase));
  });
}

function renderReferenceMarks() {
  const container = document.getElementById('referenceMarks');
  if (!container) return;
  container.innerHTML = releasePhaseOrder.map(key => {
    const time = releaseState.referenceMarks[key];
    return `<span class="reference-mark-pill ${Number.isFinite(time) ? 'saved' : ''}">${releasePhaseLabel(key)}: ${Number.isFinite(time) ? `${time.toFixed(2)}s` : 'not marked'}</span>`;
  }).join('');

  document.querySelectorAll('[data-compare-phase]').forEach(button => {
    const key = button.dataset.comparePhase;
    button.disabled = !(state.markedFrames[key] && Number.isFinite(releaseState.referenceMarks[key]));
  });
}

function comparePhase(key) {
  const paddler = state.markedFrames[key];
  const reference = releaseState.referenceMarks[key];
  if (!paddler || !Number.isFinite(reference)) return;
  els.clipPreview.pause();
  els.referencePreview.pause();
  els.clipPreview.currentTime = paddler.time;
  els.referencePreview.currentTime = reference;
  setActivePhase(key, false);
  document.getElementById('videoWorkspace')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function enhanceKeyFrames() {
  if (typeof renderKeyFrames !== 'function') return;

  renderKeyFrames = function releaseRenderKeyFrames() {
    els.keyFrames.innerHTML = '';
    const frames = Object.values(state.markedFrames);
    els.keyFramesSection.classList.toggle('hidden', frames.length === 0);

    releasePhaseOrder.forEach(key => {
      const frame = state.markedFrames[key];
      if (!frame) return;
      const customLabel = releaseState.frameLabels[key] || releasePhaseLabel(key);
      const card = document.createElement('article');
      card.className = 'key-frame-card enhanced-key-frame';
      card.innerHTML = `
        <button type="button" class="frame-image-button" aria-label="Open ${escapeHtml(customLabel)} frame">
          <img src="${frame.dataUrl}" alt="${escapeHtml(customLabel)} frame">
        </button>
        <div class="key-frame-copy">
          <span class="primary-tag">Primary</span>
          <strong>${escapeHtml(customLabel)}</strong>
          <span>${frame.time.toFixed(2)}s</span>
        </div>
        <div class="key-frame-actions">
          <button type="button" data-frame-action="jump">Jump</button>
          <button type="button" data-frame-action="replace">Replace</button>
          <button type="button" data-frame-action="rename">Rename</button>
          <button type="button" data-frame-action="delete" class="danger-text">Delete</button>
        </div>
      `;

      card.querySelector('.frame-image-button').addEventListener('click', () => openFrameLightbox(frame, customLabel));
      card.querySelector('[data-frame-action="jump"]').addEventListener('click', () => jumpToMarkedFrame(key));
      card.querySelector('[data-frame-action="replace"]').addEventListener('click', () => {
        const dataUrl = captureFrame(els.clipPreview);
        if (!dataUrl) return;
        state.markedFrames[key] = { phase: key, time: Number(els.clipPreview.currentTime.toFixed(3)), dataUrl };
        renderKeyFrames();
      });
      card.querySelector('[data-frame-action="rename"]').addEventListener('click', () => {
        const next = window.prompt('Frame label:', customLabel);
        if (next && next.trim()) {
          releaseState.frameLabels[key] = next.trim();
          renderKeyFrames();
        }
      });
      card.querySelector('[data-frame-action="delete"]').addEventListener('click', () => {
        delete state.markedFrames[key];
        delete releaseState.frameLabels[key];
        renderKeyFrames();
      });
      els.keyFrames.appendChild(card);
    });

    updateMarkedFrameStatuses();
    renderReferenceMarks();
  };

  renderKeyFrames();
}

function openFrameLightbox(frame, label) {
  let dialog = document.getElementById('frameLightbox');
  if (!dialog) {
    dialog = document.createElement('dialog');
    dialog.id = 'frameLightbox';
    dialog.className = 'frame-lightbox';
    dialog.innerHTML = `
      <div class="lightbox-header"><strong id="lightboxTitle"></strong><button type="button" id="closeLightbox">Close</button></div>
      <img id="lightboxImage" alt="Selected key frame">
      <p id="lightboxTime"></p>
    `;
    document.body.appendChild(dialog);
    dialog.querySelector('#closeLightbox').addEventListener('click', () => dialog.close());
  }
  dialog.querySelector('#lightboxTitle').textContent = label;
  dialog.querySelector('#lightboxImage').src = frame.dataUrl;
  dialog.querySelector('#lightboxTime').textContent = `${frame.time.toFixed(2)}s`;
  dialog.showModal();
}

function injectEditableFeedback() {
  if (document.getElementById('editableFeedbackCard')) return;
  const header = els.resultPanel.querySelector('.result-header');
  const card = document.createElement('div');
  card.id = 'editableFeedbackCard';
  card.className = 'feedback-card editable-feedback-card';
  card.innerHTML = `
    <div class="editable-heading">
      <div><h3>Editable paddler message</h3><p>Edit anything before copying or sending.</p></div>
      <button type="button" id="regenerateTextButton" class="small-ghost-button">Reset generated text</button>
    </div>
    <textarea id="editableFeedback" rows="12" spellcheck="true"></textarea>
  `;
  header?.insertAdjacentElement('afterend', card);
  document.getElementById('regenerateTextButton')?.addEventListener('click', () => applyFeedbackStyle(true));
}

function replaceGenerateHandler() {
  const oldButton = els.generateButton;
  if (!oldButton || oldButton.dataset.releaseReplaced) return;
  const button = oldButton.cloneNode(true);
  button.dataset.releaseReplaced = 'true';
  oldButton.replaceWith(button);
  els.generateButton = button;
  button.addEventListener('click', () => {
    generateFeedback();
    if (!state.result) return;
    releaseState.feedbackStyle = document.getElementById('feedbackStyle')?.value || 'coach';
    applyFeedbackStyle(true);
  });
}

function replaceCopyHandler() {
  const oldButton = els.copyButton;
  if (!oldButton || oldButton.dataset.releaseReplaced) return;
  const button = oldButton.cloneNode(true);
  button.dataset.releaseReplaced = 'true';
  button.textContent = 'Copy paddler message';
  oldButton.replaceWith(button);
  els.copyButton = button;
  button.addEventListener('click', async () => {
    const text = document.getElementById('editableFeedback')?.value || resultAsText();
    try {
      await navigator.clipboard.writeText(text);
      button.textContent = 'Copied';
      setTimeout(() => { button.textContent = 'Copy paddler message'; }, 1200);
    } catch {
      window.prompt('Copy the feedback below:', text);
    }
  });
}

function strengthSentence(result) {
  if (!result.strengths?.length) return 'You have a solid base to keep building from.';
  const plain = result.strengths.slice(0, 2).map(item => item.replace(/^[^:]+:\s*/, '').replace(/\.$/, '').toLowerCase());
  if (plain.length === 1) return `A good piece of your stroke is that you are ${plain[0]}.`;
  return `You already have some good pieces in your stroke, particularly ${plain[0]} and ${plain[1]}.`;
}

function priorityParagraph(priority, index, total) {
  const lead = index === 0 ? 'The main thing I want you to work on' : total > 1 ? 'The next piece to work on' : 'Focus on';
  return `${lead} is ${priority.title.toLowerCase()}. ${priority.observation} ${priority.correction} Cue: “${priority.cue}”`;
}

function buildQuickMessage(result) {
  const name = els.paddlerName.value.trim();
  const opening = `${name ? `${name}, ` : ''}${strengthSentence(result)}`;
  const corrections = result.priorities.map((p, index) => priorityParagraph(p, index, result.priorities.length)).join(' ');
  const cues = result.cues?.length ? `For now, keep it simple: ${result.cues.map(c => `“${c}”`).join(' ')}` : '';
  return [opening, corrections, cues, result.note ? `Coach note: ${result.note}` : ''].filter(Boolean).join('\n\n');
}

function buildCoachMessage(result) {
  const name = els.paddlerName.value.trim();
  const blocks = [`${name ? `${name}, ` : ''}${strengthSentence(result)}`];
  result.priorities.forEach((p, index) => blocks.push(priorityParagraph(p, index, result.priorities.length)));
  if (result.cues?.length) blocks.push(`For now, keep the cues simple:\n${result.cues.map(c => `• ${c}`).join('\n')}`);
  if (result.drills?.length) blocks.push(`Drills to use next:\n${result.drills.map(d => `• ${d.name}: ${d.purpose}`).join('\n')}`);
  if (result.note) blocks.push(`Coach note: ${result.note}`);
  return blocks.join('\n\n');
}

function buildDetailedMessage(result) {
  const blocks = [result.title, '', strengthSentence(result), '', 'Priority corrections'];
  result.priorities.forEach((p, index) => {
    blocks.push(`${index + 1}. ${p.title}\n${p.observation}\nWork on: ${p.correction}\nCue: ${p.cue}`);
  });
  blocks.push('', 'Stroke phase review');
  releasePhaseOrder.forEach(key => blocks.push(`${releasePhaseLabel(key)}: ${result.phaseFeedback[key]}`));
  if (result.drills?.length) {
    blocks.push('', 'Drills to use next');
    result.drills.forEach(d => blocks.push(`${d.name}: ${d.purpose} ${d.how}`));
  }
  if (result.note) blocks.push('', `Coach note: ${result.note}`);
  return blocks.join('\n\n');
}

function buildStyledMessage(style, result) {
  if (style === 'quick') return buildQuickMessage(result);
  if (style === 'detailed') return buildDetailedMessage(result);
  return buildCoachMessage(result);
}

function applyFeedbackStyle(resetText = false) {
  if (!state.result) return;
  const style = document.getElementById('feedbackStyle')?.value || releaseState.feedbackStyle || 'coach';
  releaseState.feedbackStyle = style;
  const textarea = document.getElementById('editableFeedback');
  if (textarea && (resetText || !textarea.value.trim())) textarea.value = buildStyledMessage(style, state.result);

  els.resultPanel.dataset.feedbackStyle = style;
  const phaseCard = els.phaseGrid.closest('.feedback-card');
  const strengthsCard = els.strengthsList.closest('.feedback-card');
  const cuesCard = els.cuesList.closest('.feedback-card');
  const prioritiesCard = els.prioritiesList.closest('.feedback-card');

  if (style === 'quick') {
    els.overallCard.classList.add('hidden');
    strengthsCard?.classList.add('hidden');
    cuesCard?.classList.add('hidden');
    prioritiesCard?.classList.add('hidden');
    phaseCard?.classList.add('hidden');
    els.drillsCard.classList.add('hidden');
    els.coachNoteCard.classList.add('hidden');
  } else if (style === 'coach') {
    els.overallCard.classList.remove('hidden');
    strengthsCard?.classList.remove('hidden');
    cuesCard?.classList.remove('hidden');
    prioritiesCard?.classList.remove('hidden');
    phaseCard?.classList.add('hidden');
    els.drillsCard.classList.toggle('hidden', !state.result.drills?.length);
    els.coachNoteCard.classList.toggle('hidden', !state.result.note);
  } else {
    els.overallCard.classList.remove('hidden');
    strengthsCard?.classList.remove('hidden');
    cuesCard?.classList.remove('hidden');
    prioritiesCard?.classList.remove('hidden');
    phaseCard?.classList.remove('hidden');
    els.drillsCard.classList.toggle('hidden', !state.result.drills?.length);
    els.coachNoteCard.classList.toggle('hidden', !state.result.note);
  }
}

// Re-run key-frame enhancements when existing mark buttons update state.
document.querySelectorAll('[data-mark-phase]').forEach(button => {
  button.addEventListener('click', () => {
    setTimeout(() => {
      renderKeyFrames();
      updateMarkedFrameStatuses();
      renderReferenceMarks();
    }, 0);
  });
});

els.clearFramesButton.addEventListener('click', () => {
  releaseState.frameLabels = {};
  setTimeout(() => {
    updateMarkedFrameStatuses();
    renderReferenceMarks();
  }, 0);
});

injectReleaseControls();
