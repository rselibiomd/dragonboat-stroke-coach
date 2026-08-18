/* Release 1.3 pass 2: practice-ready coaching library */

const libraryPass2 = {
  favoriteKey: 'kdbc-coach-library-favorites-v1',
  shortlistKey: 'kdbc-practice-shortlist-v1',
  favorites: { drills: [], cues: [] },
  shortlist: []
};

const distinctionNotes13 = {
  'setup-rushed': {
    label: 'Distinguish from a rushed catch',
    text: 'Use this when the paddler never becomes organized at the front. If the set position is established but blade entry itself is hurried, use the Catch correction instead.'
  },
  'catch-rushed': {
    label: 'Distinguish from a rushed set-up',
    text: 'Use this when the paddler reaches a usable set position but the move into blade entry is hurried. If they never get organized before the catch, coach the Set-up first.'
  },
  'catch-before-burial': {
    label: 'Primary sign',
    text: 'Pressure begins while the blade is still entering. This is different from a noisy catch, which may splash even when pressure timing is acceptable.'
  },
  'catch-noisy': {
    label: 'Primary sign',
    text: 'Extra splash or disturbance is the visible issue. Do not assume the paddler is pulling early unless the frames clearly show pressure starting before burial.'
  },
  'pull-stays-low': {
    label: 'Distinguish from chest collapse',
    text: 'Use this when the torso simply stays folded too long. If the shoulders and chest actively close or crunch during the pull, use the chest-posture correction.'
  },
  'pull-chest': {
    label: 'Distinguish from staying low',
    text: 'Use this when the chest and shoulders close during the power phase. A paddler can stay relatively low without actually collapsing the chest.'
  },
  'exit-late': {
    label: 'Important distinction',
    text: 'The blade reaches the hip, but the release is slow and the blade remains buried. Do not describe this as pulling past the hip unless active pressure continues behind the hip.'
  },
  'exit-pull-past': {
    label: 'Important distinction',
    text: 'Use this only when the paddler continues actively drawing the paddle behind the hip. If the blade merely lingers before coming out, select the late-exit correction.'
  }
};

const drillGuidance13 = {
  'Push and Pull': {
    setup: 'Best in calm water at low intensity. Have the crew feel a fully loaded blade before increasing pace.',
    dose: 'Several controlled repeats, then return to normal paddling and check whether the loaded feeling stays.',
    progression: 'Individual feel → pairs/sections → whole boat normal strokes.',
    watch: 'Blade stays loaded through the movement. Paddlers should not turn it into an arm-only pull.',
    mistake: 'Rushing the return to the front and losing pressure on the blade.'
  },
  '7-Up': {
    setup: 'Whole boat. Start with enough boat speed to feel the glide between sets.',
    dose: 'Build 1, 2, 3, 4, 5, 6, then 7 continuous strokes.',
    progression: 'Make the first stroke clean before asking for more consecutive strokes.',
    watch: 'Everyone starts together and returns to the same front timing.',
    mistake: 'Increasing rate as the stroke count increases instead of preserving timing.'
  },
  'Sectional Paddling': {
    setup: 'Build boat speed first, then let the selected pair or section paddle while others sit stable.',
    dose: 'One pass through selected sections, then return to whole-boat paddling.',
    progression: 'Pairs → groups of four or six → halves → whole boat.',
    watch: 'The active section stays connected to the boat rhythm rather than creating its own timing.',
    mistake: 'Inactive paddlers moving around and changing boat stability.'
  },
  'Frankenstein': {
    setup: 'Use at low rate. Elbows stay straight so the paddler must create movement from the body.',
    dose: 'Short technical block, then immediately return to normal paddling and keep the same body-led feel.',
    progression: 'No elbow bend → normal grip with relaxed arms → normal stroke.',
    watch: 'Rotation and hip movement create reach and power. Shoulders stay organized.',
    mistake: 'Locking the shoulders rigidly instead of rotating through the torso and hips.'
  },
  'Catch and Pull': {
    setup: 'Best stopped or moving very slowly. Start fully organized at the front.',
    dose: 'Controlled single strokes or short sets. Keep quality high rather than adding rate.',
    progression: 'Single catch-and-pull → short continuous set → normal paddling.',
    watch: 'Blade becomes fully established before meaningful pressure starts.',
    mistake: 'Turning the count into a long visible pause. The goal is sequencing, not stopping the boat.'
  },
  'Pause Strokes': {
    setup: 'Start with paddles just above the water and the crew fully set.',
    dose: 'Build from 1 stroke to 2, 3, and progressively up to 10. Rest shoulders between sets.',
    progression: 'Single clean stroke → short connected sequences → normal continuous paddling.',
    watch: 'Crew resets together and maintains front-end organization.',
    mistake: 'Holding tension in the shoulders during the reset.'
  },
  'Find Your Entry Point': {
    setup: 'Use one paddler at a time or by seat pair. Boat should be stable enough to feel the buried blade moving forward.',
    dose: 'Find the point, mark it mentally or on the gunnel, then test it during normal strokes.',
    progression: 'Find point in water → reproduce it in the air → maintain it at normal rate.',
    watch: 'The chosen point remains strong and repeatable without shoulder or spine collapse.',
    mistake: 'Treating maximum reach as automatically better reach.'
  },
  '1/4, 1/2, 3/4, Whole Paddle': {
    setup: 'Use a controlled rate so paddlers can clearly feel the difference in blade depth.',
    dose: 'Move through each blade depth, then finish with full-blade normal strokes.',
    progression: 'Tip → half → three-quarter → whole blade.',
    watch: 'Paddlers notice how much more secure and powerful the full blade feels.',
    mistake: 'Increasing effort to compensate for a shallow blade instead of noticing the loss of connection.'
  },
  'Angled Entry Correction': {
    setup: 'Use slow strokes or static set positions where hand relationship can be seen clearly.',
    dose: 'A few deliberate repetitions, then return to normal strokes.',
    progression: 'Set position → slow entry → continuous paddling.',
    watch: 'Top and bottom hands reach in balance so the paddle enters close to vertical.',
    mistake: 'Fixing the paddle angle by collapsing posture or shortening the body rotation.'
  },
  'Rotated Blade': {
    setup: 'Check grip before moving. Knuckles and thumbs face toward the front of the boat.',
    dose: 'Correct the grip, then use short normal paddling to reinforce it.',
    progression: 'Static grip check → entry practice → normal stroke.',
    watch: 'Blade face stays oriented correctly through entry and connection.',
    mistake: 'Trying to twist the blade at the last second instead of correcting the grip.'
  },
  'Paddle Swings Away': {
    setup: 'Use side or diagonal observation so top-hand and bottom-hand paths are easy to see.',
    dose: 'Short controlled set, then reassess at normal paddling.',
    progression: 'Static hand path → slow strokes → normal rate.',
    watch: 'Top hand stays in front and bottom-hand thumb remains close to the boat.',
    mistake: 'Forcing the hands inward so much that the shoulders become tense.'
  },
  'Part Paddling': {
    setup: 'Build boat speed first. Keep inactive paddlers stable and attentive.',
    dose: 'Seat partners take 10 strokes, moving through the boat. Repeat with larger groups as needed.',
    progression: 'Pairs → fours → halves → odds/evens → whole boat.',
    watch: 'Each section matches the established boat rhythm.',
    mistake: 'Treating the drill as a power test instead of a timing and awareness drill.'
  },
  'Stroke Rate': {
    setup: 'Use a steady boat and clear caller. Technique must remain organized as rate changes.',
    dose: '10 slow strokes, call “3-2-1-Up!”, then 10 higher-rate strokes. Repeat as needed.',
    progression: 'Small rate change → larger race-relevant change while preserving stroke shape.',
    watch: 'Set-up and catch quality stay intact when the rate rises.',
    mistake: 'Shortening or rushing the front just to make the paddle move faster.'
  },
  'Paddling Blind': {
    setup: 'Use only in a controlled environment with a stable crew and clear steering. All paddlers take 10 strokes first to establish rhythm.',
    dose: 'Short blind segments, then eyes open to compare what the crew felt with what they see.',
    progression: 'Slow rate first, then slightly faster only when timing remains safe and controlled.',
    watch: 'Paddlers feel pressure, boat movement, and crew rhythm instead of chasing visual cues.',
    mistake: 'Using the drill when water, traffic, or crew control makes closing eyes unsafe.'
  },
  'Hang Time - Float it Back': {
    setup: 'Use a 2:1 or 3:1 feel and enough boat speed to notice glide.',
    dose: 'Compare about 20 strokes with minimal air time against 20 strokes with more controlled air time.',
    progression: 'Exaggerated float → smaller usable hang → normal paddling.',
    watch: 'Paddler arrives organized at the front without turning the float into a dead stop.',
    mistake: 'Pausing so long that the boat loses rhythm rather than simply removing the rush.'
  },
  'Your Paddle Talks to You': {
    setup: 'Reduce chatter so paddlers can actually hear blade entry and exit.',
    dose: 'Short listening block, then identify one sound to clean up.',
    progression: 'Listen at low rate → normal rate while preserving quiet entry and exit.',
    watch: 'Clean catches and exits create limited splash and unnecessary noise.',
    mistake: 'Assuming every splash is the same technical problem without checking the stroke phase.'
  },
  'Rotation - Using Only Arms': {
    setup: 'Start on land or seated without paddling. Demonstrate the difference between arm reach and body rotation.',
    dose: 'A few assisted repetitions, then immediately test the feel with the paddle.',
    progression: 'Land model → seated feel → slow paddling → normal stroke.',
    watch: 'Hip and torso rotation carry the arm forward rather than the arm reaching independently.',
    mistake: 'Pulling hard on the paddler during the assisted movement.'
  },
  'Rotation - Lunging': {
    setup: 'Use slow strokes where the coach can see whether the body rotates or simply falls toward the water.',
    dose: 'Short corrective block followed by normal paddling.',
    progression: 'Stable torso rotation → add controlled hinge → normal stroke.',
    watch: 'The chest and back turn before the body moves toward the water.',
    mistake: 'Telling the paddler to reach less without fixing how the reach is created.'
  },
  'Over Rotation': {
    setup: 'Observe at the front of the stroke, especially top-arm position and whether the paddle contacts the boat before entry.',
    dose: 'Short slow set, then transfer to normal strokes.',
    progression: 'Find controlled end range → repeat consistently at normal rate.',
    watch: 'Rotation stops at a strong usable position rather than continuing behind the body.',
    mistake: 'Eliminating useful rotation instead of only removing the excess.'
  },
  'Hand on Your Back': {
    setup: 'Even-numbered paddlers provide the reference hand behind the paddler ahead at the upright point.',
    dose: 'Short set until the paddler clearly feels the rotation limit.',
    progression: 'Use hand reference → remove hand → reproduce same end range.',
    watch: 'Back does not continue into the hand during normal stroke motion.',
    mistake: 'Placing the reference hand so close that normal healthy rotation is restricted.'
  },
  'Hand on Forehead': {
    setup: 'Explain that this deliberately exaggerates a poor top-arm position so the paddler can feel it.',
    dose: 'Very short contrast drill, then immediately return to correct hand position.',
    progression: 'Feel the exaggerated error → remove hand → compare correct shape.',
    watch: 'Paddler understands the contrast rather than copying the exaggerated position.',
    mistake: 'Using the exaggerated position for too long.'
  },
  'Do Not Spill the Champagne': {
    setup: 'Use the bottom hand as the imagined glass. Keep the arm path calm and parallel to the water.',
    dose: 'Short technical block, then normal paddling.',
    progression: 'Dry movement → slow strokes → normal stroke.',
    watch: 'Bottom arm stays organized without unnecessary vertical movement.',
    mistake: 'Freezing the arm and shoulder instead of allowing the body to rotate.'
  },
  'Use Your Body': {
    setup: 'Explain that each 10-stroke block adds another body segment so paddlers feel where power should come from.',
    dose: '10 hands only, 10 hands + arms, 10 add shoulders, 10 add core rotation, 10 add hip rotation, 10 add hip cycling.',
    progression: 'Hands → arms → shoulders → core → hips → legs/heels.',
    watch: 'Power becomes more connected as larger body segments are added.',
    mistake: 'Treating the early arm-only stages as correct technique instead of contrast stages.'
  },
  'Legs Cycling': {
    setup: 'Try the prescribed foot positions one at a time and ask paddlers how each position changes connection.',
    dose: 'Short block in each position, then return to the strongest normal foot setup.',
    progression: 'Contrast positions → identify useful leg connection → normal paddling.',
    watch: 'Hip movement and pressure through the feet connect to the paddle rather than becoming separate leg motion.',
    mistake: 'Over-driving the legs so the paddler bounces or loses torso control.'
  },
  'Tall Paddling for Breathing': {
    setup: 'Use the contrast off-water or while stable: compressed posture first, then tall posture.',
    dose: '5 deep breaths compressed, then 5 deep breaths tall. Transfer the taller posture into paddling.',
    progression: 'Breathing contrast → tall static posture → tall dynamic stroke.',
    watch: 'Long spine supports easier breathing without excessive lumbar arching.',
    mistake: 'Interpreting “tall” as leaning backward or lifting the ribs excessively.'
  },
  'Upside Down Paddle': {
    setup: 'Turn the paddle upside down and use low intensity. The purpose is sensory contrast, not speed.',
    dose: 'Short feel block, then return to normal paddle orientation and find the same heavy-water connection.',
    progression: 'Upside-down contrast → normal paddle at low rate → normal stroke.',
    watch: 'Paddlers search for connection rather than simply pushing harder.',
    mistake: 'Turning it into a strength challenge.'
  },
  'Catch and Pull - Shoveling at Exit': {
    setup: 'Use slow controlled strokes and focus on the end of the power phase.',
    dose: 'Short corrective block followed by normal exit timing.',
    progression: 'Press down and out slowly → normal stroke while keeping chest tall.',
    watch: 'Blade leaves cleanly instead of scooping water upward.',
    mistake: 'Lifting the whole body abruptly rather than cleaning the paddle path.'
  },
  'Starts - First Strokes': {
    setup: 'Boat at dead stop. Crew fully set and ready to move together.',
    dose: 'Usually 3 to 5 first strokes at slow, powerful rhythm with full burial and about half to three-quarter length.',
    progression: 'Own the first stroke → connect the first 3 to 5 → hand off into acceleration.',
    watch: 'First motion is down into the water, not a rushed backward pull.',
    mistake: 'Trying to use race rate before the boat is moving.'
  },
  'Middle Acceleration': {
    setup: 'Begin immediately after the first start strokes while the boat is gaining speed.',
    dose: 'Usually about 4 to 15 fast, powerful strokes depending on crew strength, weight, and skill.',
    progression: 'Build rate while preserving full blade connection, then prepare for transition.',
    watch: 'Rate rises without losing blade depth or whole-body power.',
    mistake: 'Confusing faster hands with faster boat acceleration.'
  },
  'Transition': {
    setup: 'Use after the crew has reached top acceleration speed. Caller should be clear and consistent.',
    dose: 'Usually 3 to 5 strokes to move into the full race stroke.',
    progression: 'Acceleration rhythm → 3 to 5 blending strokes → race rhythm.',
    watch: 'Stroke length and body timing change progressively, not all at once.',
    mistake: 'Switching to race stroke in one abrupt stroke and breaking crew timing.'
  }
};

function loadPass2Storage() {
  try {
    const storedFavorites = JSON.parse(localStorage.getItem(libraryPass2.favoriteKey) || '{}');
    libraryPass2.favorites.drills = Array.isArray(storedFavorites.drills) ? storedFavorites.drills : [];
    libraryPass2.favorites.cues = Array.isArray(storedFavorites.cues) ? storedFavorites.cues : [];
    const storedShortlist = JSON.parse(localStorage.getItem(libraryPass2.shortlistKey) || '[]');
    libraryPass2.shortlist = Array.isArray(storedShortlist) ? storedShortlist : [];
  } catch {}
}

function savePass2Storage() {
  try {
    localStorage.setItem(libraryPass2.favoriteKey, JSON.stringify(libraryPass2.favorites));
    localStorage.setItem(libraryPass2.shortlistKey, JSON.stringify(libraryPass2.shortlist));
  } catch {}
}

function addDevelopmentSequence13() {
  if (document.getElementById('developmentSequence13')) return;
  const techniqueView = document.querySelector('[data-library-view="technique"] .library-heading13');
  if (!techniqueView) return;
  const block = document.createElement('section');
  block.id = 'developmentSequence13';
  block.className = 'development-sequence13';
  block.innerHTML = `
    <div class="development-copy13">
      <span class="phase-kicker">KDBC DEVELOPMENT ORDER</span>
      <strong>Build the platform before adding speed.</strong>
      <p>Stability supports technique. Technique allows timing and connection. Once the crew can repeat the stroke, build endurance, then power, and finally speed.</p>
    </div>
    <div class="development-steps13" aria-label="KDBC training development sequence">
      <span><b>1</b>Stability</span>
      <span><b>2</b>Technique</span>
      <span><b>3</b>Timing & Connection</span>
      <span><b>4</b>Endurance</span>
      <span><b>5</b>Power</span>
      <span><b>6</b>Speed</span>
    </div>
  `;
  techniqueView.insertAdjacentElement('afterend', block);
}

function addLibraryActions13() {
  const nav = document.getElementById('appNavigation13');
  if (!nav || document.getElementById('practiceShortlistButton13')) return;
  const actions = document.createElement('div');
  actions.className = 'library-nav-actions13';
  actions.innerHTML = `
    <button type="button" id="favoriteFilterButton13" class="app-nav-action13" aria-pressed="false">★ Favorites</button>
    <button type="button" id="practiceShortlistButton13" class="app-nav-action13">Practice shortlist <span id="shortlistCount13">0</span></button>
  `;
  nav.appendChild(actions);
  document.getElementById('favoriteFilterButton13').addEventListener('click', toggleFavoritesOnly13);
  document.getElementById('practiceShortlistButton13').addEventListener('click', toggleShortlist13);
}

function createShortlistPanel13() {
  if (document.getElementById('practiceShortlistPanel13')) return;
  const panel = document.createElement('aside');
  panel.id = 'practiceShortlistPanel13';
  panel.className = 'practice-shortlist13 hidden';
  panel.innerHTML = `
    <div class="shortlist-heading13">
      <div><span class="phase-kicker">PRACTICE SHORTLIST</span><h3>Drills for this session</h3></div>
      <button type="button" id="closeShortlist13" class="small-ghost-button">Close</button>
    </div>
    <p class="muted">Build a small drill block around the technical problem you are actually coaching.</p>
    <div id="shortlistItems13"></div>
    <div class="shortlist-actions13">
      <button type="button" id="copyShortlist13" class="primary-button">Copy shortlist</button>
      <button type="button" id="clearShortlist13" class="small-ghost-button danger-text">Clear</button>
    </div>
  `;
  document.body.appendChild(panel);
  document.getElementById('closeShortlist13').addEventListener('click', () => panel.classList.add('hidden'));
  document.getElementById('clearShortlist13').addEventListener('click', () => {
    libraryPass2.shortlist = [];
    savePass2Storage();
    renderShortlist13();
    refreshDrillActionStates13();
  });
  document.getElementById('copyShortlist13').addEventListener('click', copyShortlist13);
}

function toggleShortlist13() {
  const panel = document.getElementById('practiceShortlistPanel13');
  if (!panel) return;
  panel.classList.toggle('hidden');
  renderShortlist13();
}

function addToShortlist13(name) {
  if (!libraryPass2.shortlist.includes(name)) libraryPass2.shortlist.push(name);
  savePass2Storage();
  renderShortlist13();
  refreshDrillActionStates13();
}

function removeFromShortlist13(name) {
  libraryPass2.shortlist = libraryPass2.shortlist.filter(item => item !== name);
  savePass2Storage();
  renderShortlist13();
  refreshDrillActionStates13();
}

function renderShortlist13() {
  const target = document.getElementById('shortlistItems13');
  const count = document.getElementById('shortlistCount13');
  if (count) count.textContent = String(libraryPass2.shortlist.length);
  if (!target) return;
  if (!libraryPass2.shortlist.length) {
    target.innerHTML = '<p class="shortlist-empty13">No drills added yet. Use “Add to practice” from the Drill Library or a Technique guide.</p>';
    return;
  }
  target.innerHTML = libraryPass2.shortlist.map((name, index) => {
    const drill = drillLibrary13.find(item => item.name === name);
    if (!drill) return '';
    return `
      <article class="shortlist-item13">
        <span class="shortlist-number13">${index + 1}</span>
        <div><strong>${libraryEscape(name)}</strong><span>${libraryEscape(drill.useFor)}</span></div>
        <button type="button" data-remove-shortlist="${libraryEscape(name)}" aria-label="Remove ${libraryEscape(name)}">×</button>
      </article>
    `;
  }).join('');
  target.querySelectorAll('[data-remove-shortlist]').forEach(button => button.addEventListener('click', () => removeFromShortlist13(button.dataset.removeShortlist)));
}

async function copyShortlist13() {
  if (!libraryPass2.shortlist.length) return;
  const lines = ['KDBC Practice Shortlist', ''];
  libraryPass2.shortlist.forEach((name, index) => {
    const drill = drillLibrary13.find(item => item.name === name);
    const guide = drillGuidance13[name];
    lines.push(`${index + 1}. ${name}`);
    if (drill) lines.push(`Focus: ${drill.useFor}`);
    if (guide?.dose) lines.push(`Dose: ${guide.dose}`);
    if (drill?.cues?.length) lines.push(`Cues: ${drill.cues.join(' / ')}`);
    lines.push('');
  });
  const text = lines.join('\n');
  try {
    await navigator.clipboard.writeText(text);
    const button = document.getElementById('copyShortlist13');
    if (button) {
      const old = button.textContent;
      button.textContent = 'Copied';
      setTimeout(() => { button.textContent = old; }, 1000);
    }
  } catch {
    window.prompt('Copy practice shortlist:', text);
  }
}

function toggleFavorite13(type, name) {
  const list = libraryPass2.favorites[type];
  if (!Array.isArray(list)) return;
  const index = list.indexOf(name);
  if (index >= 0) list.splice(index, 1); else list.push(name);
  savePass2Storage();
  rerenderActiveLibrary13();
}

function isFavorite13(type, name) {
  return libraryPass2.favorites[type]?.includes(name);
}

function toggleFavoritesOnly13() {
  const button = document.getElementById('favoriteFilterButton13');
  if (!button) return;
  const active = button.getAttribute('aria-pressed') !== 'true';
  button.setAttribute('aria-pressed', String(active));
  button.classList.toggle('active', active);
  rerenderActiveLibrary13();
}

function favoritesOnly13() {
  return document.getElementById('favoriteFilterButton13')?.getAttribute('aria-pressed') === 'true';
}

function rerenderActiveLibrary13() {
  if (library13.activeView === 'drills') {
    renderDrillLibrary13(document.getElementById('drillSearch13')?.value || '', activeDrillCategory13());
  } else if (library13.activeView === 'cues') {
    renderCueLibrary13(document.getElementById('cueSearch13')?.value || '');
  }
}

const baseRenderCueLibrary13 = renderCueLibrary13;
renderCueLibrary13 = function pass2CueLibrary(query = '') {
  const q = query.trim().toLowerCase();
  let items = cueLibrary13.filter(item => !q || [item.focus, item.useFor, ...item.cues].join(' ').toLowerCase().includes(q));
  if (favoritesOnly13()) items = items.filter(item => isFavorite13('cues', item.focus));
  const target = document.getElementById('cueLibrary13');
  if (!target) return;
  target.innerHTML = items.length ? items.map(item => `
    <article class="cue-card13 enhanced-library-card13">
      <button type="button" class="favorite-button13 ${isFavorite13('cues', item.focus) ? 'active' : ''}" data-favorite-cue="${libraryEscape(item.focus)}" aria-label="Favorite ${libraryEscape(item.focus)} cues">${isFavorite13('cues', item.focus) ? '★' : '☆'}</button>
      <span class="phase-kicker">${libraryEscape(item.focus)}</span>
      <div class="cue-chips13">${item.cues.map(cue => `<strong>${libraryEscape(cue)}</strong>`).join('')}</div>
      <p>${libraryEscape(item.useFor)}</p>
    </article>
  `).join('') : `<p class="library-empty13">${favoritesOnly13() ? 'No favorite cues match this view.' : 'No cues match that search.'}</p>`;
  target.querySelectorAll('[data-favorite-cue]').forEach(button => button.addEventListener('click', () => toggleFavorite13('cues', button.dataset.favoriteCue)));
};

const baseRenderDrillLibrary13 = renderDrillLibrary13;
renderDrillLibrary13 = function pass2DrillLibrary(query = '', category = 'All') {
  const q = query.trim().toLowerCase();
  let items = drillLibrary13.filter(item => {
    const categoryMatch = category === 'All' || item.category === category;
    const queryMatch = !q || [item.name, item.category, item.useFor, item.how, ...item.cues].join(' ').toLowerCase().includes(q);
    return categoryMatch && queryMatch;
  });
  if (favoritesOnly13()) items = items.filter(item => isFavorite13('drills', item.name));
  const target = document.getElementById('drillLibrary13');
  if (!target) return;
  target.innerHTML = items.length ? items.map(item => {
    const guide = drillGuidance13[item.name] || {
      setup: 'Set the crew at a controlled rate and explain the technical purpose before starting.',
      dose: 'Use a short quality block, then return to normal paddling and check transfer.',
      progression: 'Introduce the drill slowly, then reduce the exaggeration as the movement improves.',
      watch: 'Look for the specific movement the drill is intended to change.',
      mistake: 'Letting the drill become an end in itself instead of transferring back to the normal stroke.'
    };
    const shortlisted = libraryPass2.shortlist.includes(item.name);
    return `
      <article class="drill-card13 enhanced-drill-card13" data-drill-name="${libraryEscape(item.name)}">
        <button type="button" class="favorite-button13 ${isFavorite13('drills', item.name) ? 'active' : ''}" data-favorite-drill="${libraryEscape(item.name)}" aria-label="Favorite ${libraryEscape(item.name)}">${isFavorite13('drills', item.name) ? '★' : '☆'}</button>
        <div class="drill-heading13"><span>${libraryEscape(item.category)}</span><h3>${libraryEscape(item.name)}</h3></div>
        <dl>
          <div><dt>Use for</dt><dd>${libraryEscape(item.useFor)}</dd></div>
          <div><dt>Coach setup</dt><dd>${libraryEscape(guide.setup)}</dd></div>
          <div><dt>How to perform</dt><dd>${libraryEscape(item.how)}</dd></div>
          <div><dt>Dose</dt><dd>${libraryEscape(guide.dose)}</dd></div>
          <div><dt>Progression</dt><dd>${libraryEscape(guide.progression)}</dd></div>
          <div><dt>Watch for</dt><dd>${libraryEscape(guide.watch)}</dd></div>
          <div><dt>Common mistake</dt><dd>${libraryEscape(guide.mistake)}</dd></div>
          <div><dt>Cues</dt><dd class="drill-cues13">${item.cues.map(cue => `<strong>${libraryEscape(cue)}</strong>`).join('')}</dd></div>
        </dl>
        <div class="drill-card-actions13">
          <button type="button" class="${shortlisted ? 'small-ghost-button active' : 'primary-button'}" data-use-drill="${libraryEscape(item.name)}">${shortlisted ? '✓ Added to practice' : 'Add to practice'}</button>
        </div>
      </article>
    `;
  }).join('') : `<p class="library-empty13">${favoritesOnly13() ? 'No favorite drills match these filters.' : 'No drills match those filters.'}</p>`;

  target.querySelectorAll('[data-favorite-drill]').forEach(button => button.addEventListener('click', () => toggleFavorite13('drills', button.dataset.favoriteDrill)));
  target.querySelectorAll('[data-use-drill]').forEach(button => button.addEventListener('click', () => addToShortlist13(button.dataset.useDrill)));
};

function refreshDrillActionStates13() {
  document.querySelectorAll('[data-use-drill]').forEach(button => {
    const added = libraryPass2.shortlist.includes(button.dataset.useDrill);
    button.textContent = added ? '✓ Added to practice' : 'Add to practice';
    button.classList.toggle('active', added);
    button.classList.toggle('primary-button', !added);
    button.classList.toggle('small-ghost-button', added);
  });
  const count = document.getElementById('shortlistCount13');
  if (count) count.textContent = String(libraryPass2.shortlist.length);
}

const baseRenderTechniqueLibrary13 = renderTechniqueLibrary13;
renderTechniqueLibrary13 = function pass2TechniqueLibrary(active = 'all') {
  baseRenderTechniqueLibrary13(active);
  document.querySelectorAll('.tech-issue13').forEach(card => {
    const id = card.id.replace(/^guide-/, '');
    const note = distinctionNotes13[id];
    if (note && !card.querySelector('.distinction-note13')) {
      const block = document.createElement('div');
      block.className = 'distinction-note13';
      block.innerHTML = `<strong>${libraryEscape(note.label)}</strong><p>${libraryEscape(note.text)}</p>`;
      card.appendChild(block);
    }
    const correction = getCorrectionById(id);
    if (correction?.drill && !card.querySelector('[data-tech-add-drill]')) {
      const action = document.createElement('button');
      action.type = 'button';
      action.className = 'small-ghost-button tech-add-drill13';
      action.dataset.techAddDrill = correction.drill;
      action.textContent = libraryPass2.shortlist.includes(correction.drill) ? '✓ Drill added to practice' : '+ Add drill to practice';
      action.addEventListener('click', () => {
        addToShortlist13(correction.drill);
        action.textContent = '✓ Drill added to practice';
      });
      card.appendChild(action);
    }
  });
};

function enhanceTechniqueReviewLinks13() {
  const originalOpen = openTechniqueGuide13;
  openTechniqueGuide13 = function pass2OpenGuide(id, phase) {
    originalOpen(id, phase);
  };
}

function initializePass2() {
  loadPass2Storage();
  addDevelopmentSequence13();
  addLibraryActions13();
  createShortlistPanel13();
  renderShortlist13();
  renderTechniqueLibrary13();
  renderCueLibrary13();
  renderDrillLibrary13('', activeDrillCategory13());
  enhanceTechniqueReviewLinks13();
  const badge = document.querySelector('.local-badge');
  if (badge) badge.textContent = 'Release 1.3 · Pass 2';
}

initializePass2();
