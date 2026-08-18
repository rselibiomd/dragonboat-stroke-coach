/* Release 1.3 final pass: Training Builder integration and hierarchy alignment */

const TRAINING_BUILDER_URL_13 = 'https://rselibiomd.github.io/dragon-boat-training-builder/';
const TRAINING_TRANSFER_KEY_13 = 'kdbc-stroke-review-transfer-v1';

function alignDevelopmentSequenceFinal13() {
  const block = document.getElementById('developmentSequence13');
  if (!block) return;
  block.innerHTML = `
    <div class="development-copy13">
      <span class="phase-kicker">KDBC DEVELOPMENT ORDER</span>
      <strong>Build the platform before adding speed.</strong>
      <p>Stability supports technique. Once the stroke is repeatable, build endurance, then power, and finally speed. Timing and connection are coached throughout every phase as technical standards.</p>
    </div>
    <div class="development-steps13" aria-label="KDBC training development sequence">
      <span><b>1</b>Stability</span>
      <span><b>2</b>Technique</span>
      <span><b>3</b>Endurance</span>
      <span><b>4</b>Power</span>
      <span><b>5</b>Speed</span>
    </div>
    <p class="timing-throughout13"><strong>Timing throughout:</strong> crew timing and blade connection are protected at every stage rather than treated as a separate season phase.</p>
  `;
}

function currentReviewPrioritiesForTransfer13() {
  if (typeof state === 'undefined' || typeof getCorrectionById !== 'function') return [];
  return (state.selectedCorrections || [])
    .slice(0, 3)
    .map(getCorrectionById)
    .filter(Boolean)
    .map(item => ({
      title: item.title,
      phase: item.phaseTitle,
      cue: item.cue,
      correction: item.correction
    }));
}

function buildTrainingTransfer13() {
  const names = Array.isArray(libraryPass2?.shortlist) ? libraryPass2.shortlist.slice(0, 3) : [];
  const drills = names.map(name => {
    const drill = drillLibrary13.find(item => item.name === name);
    const guide = drillGuidance13?.[name] || {};
    if (!drill) return null;
    return {
      name: drill.name,
      category: drill.category,
      useFor: drill.useFor,
      how: drill.how,
      cues: drill.cues || [],
      dose: guide.dose || '',
      setup: guide.setup || '',
      watch: guide.watch || '',
      progression: guide.progression || '',
      limitedUse: ['Paddling Blind', 'Upside Down Paddle'].includes(drill.name)
    };
  }).filter(Boolean);

  return {
    version: 1,
    source: 'kdbc-stroke-review',
    createdAt: new Date().toISOString(),
    focus: 'Technique',
    drills,
    priorities: currentReviewPrioritiesForTransfer13()
  };
}

function encodeTransferFallback13(payload) {
  try {
    const json = JSON.stringify(payload);
    const bytes = new TextEncoder().encode(json);
    let binary = '';
    bytes.forEach(byte => { binary += String.fromCharCode(byte); });
    return btoa(binary).replaceAll('+', '-').replaceAll('/', '_').replaceAll('=', '');
  } catch {
    return '';
  }
}

function openTrainingBuilder13() {
  const payload = buildTrainingTransfer13();
  if (!payload.drills.length) {
    window.alert('Add at least one drill to the Practice Shortlist before sending it to the Training Builder.');
    return;
  }

  let target = `${TRAINING_BUILDER_URL_13}?from=stroke-review`;
  try {
    localStorage.setItem(TRAINING_TRANSFER_KEY_13, JSON.stringify(payload));
  } catch {
    const fallback = encodeTransferFallback13(payload);
    if (fallback) target += `&strokeReview=${encodeURIComponent(fallback)}`;
  }

  window.open(target, '_blank', 'noopener');
}

function updateTrainingBuilderButton13() {
  const button = document.getElementById('openTrainingBuilder13');
  if (!button) return;
  const count = Array.isArray(libraryPass2?.shortlist) ? libraryPass2.shortlist.length : 0;
  button.disabled = count === 0;
  button.textContent = count ? `Open ${Math.min(count, 3)} drill${Math.min(count, 3) === 1 ? '' : 's'} in Training Builder` : 'Open in Training Builder';
}

function addTrainingBuilderActions13() {
  const shortlistActions = document.querySelector('.shortlist-actions13');
  if (shortlistActions && !document.getElementById('openTrainingBuilder13')) {
    const button = document.createElement('button');
    button.id = 'openTrainingBuilder13';
    button.type = 'button';
    button.className = 'primary-button training-builder-button13';
    button.addEventListener('click', openTrainingBuilder13);
    shortlistActions.prepend(button);

    const note = document.createElement('p');
    note.className = 'training-builder-note13';
    note.textContent = 'Creates a new Technique practice in KDBC Coach Tools using the first three shortlisted drills. Your current Training Builder practice is preserved as a saved backup.';
    shortlistActions.insertAdjacentElement('beforebegin', note);
  }

  const navActions = document.querySelector('.library-nav-actions13');
  if (navActions && !document.getElementById('trainingBuilderLink13')) {
    const link = document.createElement('a');
    link.id = 'trainingBuilderLink13';
    link.className = 'app-nav-action13 training-builder-link13';
    link.href = TRAINING_BUILDER_URL_13;
    link.target = '_blank';
    link.rel = 'noopener';
    link.textContent = 'Training Builder ↗';
    navActions.appendChild(link);
  }

  updateTrainingBuilderButton13();
}

function watchShortlistForTrainingTransfer13() {
  const target = document.getElementById('shortlistItems13');
  if (!target) return;
  const observer = new MutationObserver(updateTrainingBuilderButton13);
  observer.observe(target, { childList: true, subtree: true });
}

alignDevelopmentSequenceFinal13();
addTrainingBuilderActions13();
watchShortlistForTrainingTransfer13();

const finalBadge13 = document.querySelector('.local-badge');
if (finalBadge13) finalBadge13.textContent = 'Release 1.3 · Final';
