/* Release 1.3 shortlist sync fix */

const drillAliases13 = {
  'Hang Time / Float it Back': 'Hang Time - Float it Back',
  'Tall Paddling': 'Tall Paddling for Breathing'
};

function ensureReviewDrillsInLibrary13() {
  if (!drillLibrary13.some(item => item.name === 'Pause Before the Catch')) {
    drillLibrary13.push({
      name: 'Pause Before the Catch',
      category: 'Catch & Entry',
      useFor: 'Front-end patience / set organization',
      how: 'Arrive fully organized at the front with the paddle just above the water. Use a small controlled moment at the set, then take a clean stroke. Build into short continuous sequences without turning the control point into a long pause.',
      cues: ['Get set first', 'Hold the front', 'Hinge and bury']
    });
  }

  if (typeof drillGuidance13 !== 'undefined' && !drillGuidance13['Pause Before the Catch']) {
    drillGuidance13['Pause Before the Catch'] = {
      setup: 'Use a low controlled rate. The paddler should arrive organized at the front before the catch begins.',
      dose: 'Start with single or short controlled sequences, then return to normal paddling and keep the same front-end patience.',
      progression: 'Clear set position → short connected sequences → normal continuous stroke.',
      watch: 'The paddler gets set before the catch without creating a visible dead stop.',
      mistake: 'Holding the front too long and teaching a pause instead of a small moment of control.'
    };
  }
}

function normalizeDrillText13(value = '') {
  return String(value)
    .toLowerCase()
    .replaceAll('—', '-')
    .replaceAll('–', '-')
    .replaceAll('/', '-')
    .replace(/\s+/g, ' ')
    .trim();
}

function resolveShortlistDrillName13(name) {
  ensureReviewDrillsInLibrary13();
  const alias = drillAliases13[name] || name;
  const exact = drillLibrary13.find(item => item.name === alias);
  if (exact) return exact.name;
  const normalized = normalizeDrillText13(alias);
  const match = drillLibrary13.find(item => normalizeDrillText13(item.name) === normalized);
  return match?.name || null;
}

function syncShortlistUi13() {
  if (typeof savePass2Storage === 'function') savePass2Storage();
  if (typeof renderShortlist13 === 'function') renderShortlist13();
  if (typeof refreshDrillActionStates13 === 'function') refreshDrillActionStates13();
  if (typeof updateTrainingBuilderButton13 === 'function') updateTrainingBuilderButton13();
  updateGeneratedDrillStates13();
}

function addCanonicalDrillToShortlist13(name) {
  const canonical = resolveShortlistDrillName13(name);
  if (!canonical) return { name: null, added: false };
  if (!libraryPass2.shortlist.includes(canonical)) {
    libraryPass2.shortlist.push(canonical);
    syncShortlistUi13();
    return { name: canonical, added: true };
  }
  syncShortlistUi13();
  return { name: canonical, added: false };
}

function removeCanonicalDrillFromShortlist13(name) {
  const canonical = resolveShortlistDrillName13(name) || name;
  libraryPass2.shortlist = libraryPass2.shortlist.filter(item => item !== canonical);
  syncShortlistUi13();
}

/* Make every existing Add to practice action use the same canonical shortlist. */
if (typeof addToShortlist13 === 'function') {
  addToShortlist13 = function syncedAddToShortlist13(name) {
    addCanonicalDrillToShortlist13(name);
  };
}

if (typeof removeFromShortlist13 === 'function') {
  removeFromShortlist13 = function syncedRemoveFromShortlist13(name) {
    removeCanonicalDrillFromShortlist13(name);
  };
}

function syncRecommendedDrills13(result) {
  if (!result?.drills?.length) return [];
  const synced = [];
  result.drills.forEach(drill => {
    const outcome = addCanonicalDrillToShortlist13(drill.name);
    if (outcome.name) synced.push({ original: drill.name, canonical: outcome.name, added: outcome.added });
  });
  return synced;
}

function ensureShortlistNotice13(result, synced) {
  const card = document.getElementById('drillsCard');
  if (!card) return;
  let notice = document.getElementById('reviewShortlistNotice13');
  if (!notice) {
    notice = document.createElement('div');
    notice.id = 'reviewShortlistNotice13';
    notice.className = 'review-shortlist-notice13';
    const heading = card.querySelector('h3');
    heading?.insertAdjacentElement('afterend', notice);
  }
  const count = new Set(synced.map(item => item.canonical)).size;
  if (!count) {
    notice.classList.add('hidden');
    return;
  }
  notice.classList.remove('hidden');
  notice.innerHTML = `
    <span><strong>✓ Synced to Practice Shortlist</strong> ${count} recommended drill${count === 1 ? '' : 's'} from your priority corrections ${count === 1 ? 'is' : 'are'} ready for practice planning.</span>
    <button type="button" id="openReviewShortlist13" class="small-ghost-button">Open shortlist</button>
  `;
  document.getElementById('openReviewShortlist13')?.addEventListener('click', () => {
    document.getElementById('practiceShortlistPanel13')?.classList.remove('hidden');
    if (typeof renderShortlist13 === 'function') renderShortlist13();
  });
}

function updateGeneratedDrillStates13() {
  document.querySelectorAll('[data-generated-drill13]').forEach(row => {
    const original = row.dataset.generatedDrill13;
    const canonical = resolveShortlistDrillName13(original);
    const button = row.querySelector('[data-generated-shortlist-toggle13]');
    if (!button || !canonical) return;
    const included = libraryPass2.shortlist.includes(canonical);
    button.textContent = included ? '✓ In Practice Shortlist' : '+ Add to Practice Shortlist';
    button.classList.toggle('active', included);
    button.setAttribute('aria-pressed', String(included));
  });
}

function enhanceGeneratedDrillCards13(result) {
  const cards = [...els.drillsList.querySelectorAll('.drill-item')];
  result.drills.forEach((drill, index) => {
    const card = cards[index];
    if (!card || card.querySelector('[data-generated-shortlist-toggle13]')) return;
    card.dataset.generatedDrill13 = drill.name;
    const canonical = resolveShortlistDrillName13(drill.name);
    if (!canonical) return;
    const row = document.createElement('div');
    row.className = 'generated-drill-action13';
    row.innerHTML = `
      <span>Library drill: <strong>${libraryEscape(canonical)}</strong></span>
      <button type="button" class="small-ghost-button" data-generated-shortlist-toggle13="${libraryEscape(canonical)}"></button>
    `;
    const button = row.querySelector('[data-generated-shortlist-toggle13]');
    button.addEventListener('click', () => {
      if (libraryPass2.shortlist.includes(canonical)) removeCanonicalDrillFromShortlist13(canonical);
      else addCanonicalDrillToShortlist13(canonical);
      updateGeneratedDrillStates13();
    });
    card.appendChild(row);
  });
  updateGeneratedDrillStates13();
}

/* Sync priority-linked drill recommendations every time feedback is rendered. */
const renderResultBeforeShortlistSync13 = renderResult;
renderResult = function renderResultWithShortlistSync13(result) {
  const synced = syncRecommendedDrills13(result);
  renderResultBeforeShortlistSync13(result);
  ensureShortlistNotice13(result, synced);
  enhanceGeneratedDrillCards13(result);
};

ensureReviewDrillsInLibrary13();
if (typeof renderDrillFilters13 === 'function') renderDrillFilters13();
if (library13?.activeView === 'drills' && typeof renderDrillLibrary13 === 'function') {
  renderDrillLibrary13(document.getElementById('drillSearch13')?.value || '', activeDrillCategory13());
}
syncShortlistUi13();
