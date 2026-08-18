/* Release 1.3: KDBC Technical Library */

const library13 = {
  activeView: 'review',
  logoUrl: 'https://raw.githubusercontent.com/rselibiomd/dragon-boat-training-builder/main/public/kdbc-logo.jpeg'
};

const techniqueModel13 = {
  setup: {
    label: 'Set-up',
    sequence: 'Rotate into the set → long bottom arm → long spine → get organized before the catch.',
    coachFocus: 'Create the reach with the body first. Length is useful only when posture and structure stay strong.',
    cues: ['Rotate into the set.', 'Long bottom arm into the set.', 'Get set first.']
  },
  catch: {
    label: 'Catch',
    sequence: 'Set → small moment of control → hinge and blade entry together → full burial before meaningful pressure.',
    coachFocus: 'The front should look controlled, not rushed. The hinge comes from the hips while the blade drops into the water.',
    cues: ['Set, then hinge and bury.', 'Bury first, then go.', 'Quiet catch.']
  },
  pull: {
    label: 'Pull',
    sequence: 'Connect → top-arm drive → derotate through hips and torso → progressively return toward tall.',
    coachFocus: 'Move the body against a loaded blade. Keep the spine long and the chest proud rather than squeezing extra power from the arms.',
    cues: ['Feel the heavy water.', 'Connect and derotate.', 'Chest proud and derotate.']
  },
  exit: {
    label: 'Exit / Recovery',
    sequence: 'Quick release at the hip → relaxed recovery → set early for the next catch.',
    coachFocus: 'Distinguish a delayed exit from actively pulling behind the hip. Get the blade clear, let the boat run, and reset early.',
    cues: ['Quick out at the hip.', 'Out and forward.', 'Let it run, set early.']
  }
};

const cueLibrary13 = [
  { focus: 'Posture', cues: ['Sit tall', 'Hinge'], useFor: 'Long spine. Fold from hips, not lower back.' },
  { focus: 'Rotation', cues: ['Rotate first', 'Show your back'], useFor: 'Body leads reach. Chest/back turns before blade drops.' },
  { focus: 'Reach', cues: ['Reach long', 'Set early'], useFor: 'Length without collapsing. Ready before the catch.' },
  { focus: 'Catch', cues: ['Bury first', 'Quiet entry'], useFor: 'Full blade in before pressure. Minimal splash.' },
  { focus: 'Connection', cues: ['Feel the water', 'Heavy water'], useFor: 'Blade loads. Do not slip or lose pressure.' },
  { focus: 'Timing', cues: ['Together first', 'Match the front'], useFor: 'Crew movement before individual effort.' },
  { focus: 'Power', cues: ['Legs and hips', 'Drive the boat'], useFor: 'Lower body and trunk move the boat, not arms only.' },
  { focus: 'Exit / Glide', cues: ['Out at the hip', 'Let it run'], useFor: 'Clean exit. Let the boat glide before resetting.' }
];

const drillLibrary13 = [
  { name: 'Push and Pull', category: 'Connection & Timing', useFor: 'Connection / load', how: 'Start fully buried at the front. Pull through with best technique. At exit, keep the blade in the water and move it back to the front. Repeat several times.', cues: ['Feel the water', 'Do not lose the load'] },
  { name: '7-Up', category: 'Connection & Timing', useFor: 'Timing / synchronization', how: 'Whole boat takes 1 stroke, returns to the front, and lets the boat glide. Then 2 continuous strokes, reset at the front. Build 3, 4, 5, 6, then 7.', cues: ['Together first', 'Match the front'] },
  { name: 'Sectional Paddling', category: 'Connection & Timing', useFor: 'Section awareness / timing', how: 'Build boat speed. Let it run. Have pairs or sections paddle: seat pairs, first 4/next 4/back 6, front half/back half, odds/evens.', cues: ['Watch the front', 'Stay in unison'] },
  { name: 'Frankenstein', category: 'Body Mechanics', useFor: 'Core rotation / no arms', how: 'Paddlers cannot bend elbows. The paddle moves only by core rotation and cycling legs and hips.', cues: ['No arms - rotate', 'Show your back'] },

  { name: 'Catch and Pull', category: 'Catch & Entry', useFor: 'Splashing / early pull', how: 'Set up at the front. Catch. Count one out loud before sitting up and pulling. Best done stopped or very slow.', cues: ['Bury first', 'Catch then go'] },
  { name: 'Pause Strokes', category: 'Catch & Entry', useFor: 'Timing / patience', how: 'Paddles start just above the water. On command, take 1 stroke and reset to starting position. Repeat, then build to 2, 3, up to 10 strokes. Rest shoulders between sets.', cues: ['Hold the front', 'Reset together'] },
  { name: 'Find Your Entry Point', category: 'Catch & Entry', useFor: 'Optimal hang / entry', how: 'Put blade fully buried at exit. Keep blade buried and move it through water toward the catch point. Mark the reach point on the gunnel. Use that as the air reach point.', cues: ['Drop to full blade', 'Find your point'] },
  { name: '1/4, 1/2, 3/4, Whole Paddle', category: 'Catch & Entry', useFor: 'Blade depth awareness', how: 'Paddle with only corner tip in water, then 1/2 blade, then 3/4 blade, then whole blade.', cues: ['Full blade = full power'] },
  { name: 'Angled Entry Correction', category: 'Catch & Entry', useFor: 'Spearing or negative angle', how: 'If bottom hand reaches farther than top, straighten top arm. If top hand is too far from body, extend bottom hand so both hands reach equally and paddle enters almost vertical.', cues: ['Equal hands', 'Vertical blade'] },
  { name: 'Rotated Blade', category: 'Catch & Entry', useFor: 'Incorrect grip / blade facing wrong way', how: 'Review grip. Knuckles and thumbs of both hands face straight ahead toward the front of the boat.', cues: ['Knuckles forward'] },
  { name: 'Paddle Swings Away', category: 'Catch & Entry', useFor: 'Top hand drops or swings', how: 'Keep top hand up, in front of the face, and over the side of the boat. Keep bottom-hand thumb close to the side of the boat.', cues: ['Top hand in front', 'Thumb close'] },

  { name: 'Part Paddling', category: 'Timing & Boat Feel', useFor: 'Timing / awareness', how: 'Build boat speed and let it run. Two paddlers at a time take 10 strokes with their seat partner only, starting seat 1 through seat 10 and back. Repeat with 4s, halves, odds/evens.', cues: ['See the boat', 'Stay together'] },
  { name: 'Stroke Rate', category: 'Timing & Boat Feel', useFor: 'Rate control', how: 'Paddle slow for 10 strokes. Count “3-2-1-Up!” and increase rate for 10 strokes. Repeat several times.', cues: ['Rate up together'] },
  { name: 'Paddling Blind', category: 'Timing & Boat Feel', useFor: 'Feel the boat', how: 'All paddle 10 strokes to get moving. On the call, paddlers close eyes and feel the boat. Start slower than normal, then increase as control improves.', cues: ['Feel the boat', 'Trust the rhythm'] },
  { name: 'Hang Time - Float it Back', category: 'Timing & Boat Feel', useFor: 'Glide / no rushing', how: 'Use 2:1 or 3:1 ratio: regular stroke in water, then float paddle back toward the front. Compare 20 strokes with minimal air time vs more air time.', cues: ['Let it run', 'Feel the glide'] },
  { name: 'Your Paddle Talks to You', category: 'Timing & Boat Feel', useFor: 'Sensory feedback', how: 'Listen to paddle sounds. A solid catch is quiet with limited splash. A solid exit is also quiet with limited splash.', cues: ['Quiet is clean'] },

  { name: 'Rotation - Using Only Arms', category: 'Rotation', useFor: 'Arm reach only', how: 'Model rotation on land and seated in boat without paddle. Have paddler hold paddle mid-shaft and gently pull forward to feel hip rotation. Then add bending toward water at waist.', cues: ['Turn from hips', 'Show your back'] },
  { name: 'Rotation - Lunging', category: 'Rotation', useFor: 'Body falls to water', how: 'Identify arm reach followed by body weight dropping without hip/waist rotation. Focus on core strength and outside arm parallel to water/gunnel.', cues: ['Rotate, do not fall'] },
  { name: 'Over Rotation', category: 'Rotation', useFor: 'Top arm bent / behind head', how: 'Check core body position and rotation at hips. Arms should not follow too far behind the body; paddle should not hit boat before entry.', cues: ['Control rotation'] },
  { name: 'Hand on Your Back', category: 'Rotation', useFor: 'Feel over-rotation', how: 'Even-numbered paddlers hold hand behind paddler ahead at 90° upright point. Paddlers stroke; backs should not touch the hand behind them.', cues: ['Stop before you hit'] },
  { name: 'Hand on Forehead', category: 'Rotation', useFor: 'Top hand away from body', how: 'Paddler puts top hand on forehead and keeps it there throughout the stroke. This exaggerates an over-bent top arm so the paddler can feel what not to do.', cues: ['Notice the bad shape'] },
  { name: 'Do Not Spill the Champagne', category: 'Rotation', useFor: 'Bottom arm path / extension', how: 'Imagine holding a fine glass in bottom hand. Move through the stroke keeping hand and bottom arm parallel to the water.', cues: ['Do not spill'] },

  { name: 'Use Your Body', category: 'Power & Body Awareness', useFor: 'Whole-body sequencing', how: '10 strokes hands only. 10 hands + arms. 10 add shoulders. 10 add core rotation. 10 add hip rotation. 10 add hip cycling by pushing off heels. Explain between sets.', cues: ['Build the body', 'Legs and hips'] },
  { name: 'Legs Cycling', category: 'Power & Body Awareness', useFor: 'Leg / hip power', how: 'Try paddle-side foot forward, non-paddle-side foot forward, both legs behind, then both legs forward. After each position, ask how paddling changed.', cues: ['Push the floor'] },
  { name: 'Tall Paddling for Breathing', category: 'Power & Body Awareness', useFor: 'Posture and breathing', how: 'Crunch into tight ball and take 5 deep breaths. Sit tall and take 5 deep breaths. Ask how posture affected breathing.', cues: ['Sit tall to breathe'] },
  { name: 'Upside Down Paddle', category: 'Power & Body Awareness', useFor: 'Heavy water / technique feel', how: 'Turn paddles upside down. Move through stroke with paddle upside down. Find the heavy water, do not just push through.', cues: ['Find heavy water'] },

  { name: 'Catch and Pull - Shoveling at Exit', category: 'Exit & Starts', useFor: 'Negative angle / shoveling', how: 'Focus on press down throughout the stroke. Paddlers lift chest up to sky as they press out the exit.', cues: ['Press down and out', 'Chest up'] },
  { name: 'Starts - First Strokes', category: 'Exit & Starts', useFor: 'Move from dead stop', how: 'Usually 3-5 strokes. Slow, full-buried blade strokes at 1/2 to 3/4 length. Body leans forward and outside. Body is “itching” to go. First motion is down.', cues: ['First motion down'] },
  { name: 'Middle Acceleration', category: 'Exit & Starts', useFor: 'Acceleration strokes', how: 'Usually 4-15 strokes. Fast and powerful. Full blade strokes with 1/2 to 3/4 length of full extension. Number varies by team strength, weight, and skill.', cues: ['Fast but powerful'] },
  { name: 'Transition', category: 'Exit & Starts', useFor: 'Shift to race stroke', how: 'Usually 3-5 strokes. Once top speed is reached, transition to full race stroke over 3-5 strokes, not in just 1. Caller may be drummer or steer.', cues: ['Build into race stroke'] }
];

function libraryEscape(value = '') {
  return typeof escapeHtml === 'function' ? escapeHtml(value) : String(value).replace(/[&<>"']/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[s]));
}

function createLibraryNavigation() {
  if (document.getElementById('appNavigation13')) return;
  const nav = document.createElement('nav');
  nav.id = 'appNavigation13';
  nav.className = 'app-navigation13';
  nav.setAttribute('aria-label', 'KDBC Stroke Coach sections');
  nav.innerHTML = `
    <button type="button" class="app-nav-button active" data-app-view="review">Review</button>
    <button type="button" class="app-nav-button" data-app-view="technique">Technique</button>
    <button type="button" class="app-nav-button" data-app-view="cues">Cues</button>
    <button type="button" class="app-nav-button" data-app-view="drills">Drills</button>
  `;
  document.querySelector('.branded-hero')?.insertAdjacentElement('afterend', nav);
  nav.querySelectorAll('[data-app-view]').forEach(button => button.addEventListener('click', () => switchLibraryView(button.dataset.appView)));
}

function markReviewSections() {
  const main = document.querySelector('.app-shell');
  [...main.children].forEach(child => {
    if (child.matches('.branded-hero, #appNavigation13, #libraryShell13')) return;
    child.classList.add('review-view-section13');
  });
}

function createLibraryShell() {
  if (document.getElementById('libraryShell13')) return;
  const shell = document.createElement('div');
  shell.id = 'libraryShell13';
  shell.className = 'library-shell13 hidden';
  shell.innerHTML = `
    <section class="panel library-view13" data-library-view="technique">
      <div class="library-heading13">
        <div><p class="eyebrow">KDBC COACH LIBRARY</p><h2>Technique</h2><p>Use the stroke model to identify the phase first, then coach the biggest visible limiter.</p></div>
      </div>
      <div id="techniquePhaseNav13" class="library-filter-row13"></div>
      <div id="techniqueLibrary13"></div>
    </section>

    <section class="panel library-view13 hidden" data-library-view="cues">
      <div class="library-heading13">
        <div><p class="eyebrow">KDBC COACH LIBRARY</p><h2>Coach Cue Bank</h2><p>Use one cue at a time. Fix the biggest boat-wide limiter first.</p></div>
        <label class="library-search13"><span>Find a cue</span><input id="cueSearch13" type="search" placeholder="e.g., rotation, heavy water, exit" /></label>
      </div>
      <div id="cueLibrary13" class="cue-library-grid13"></div>
    </section>

    <section class="panel library-view13 hidden" data-library-view="drills">
      <div class="library-heading13">
        <div><p class="eyebrow">KDBC COACH LIBRARY</p><h2>Drill Library</h2><p>Choose the drill because it addresses the technical problem you observed, not simply because it is familiar.</p></div>
        <label class="library-search13"><span>Find a drill</span><input id="drillSearch13" type="search" placeholder="e.g., timing, catch, rotation" /></label>
      </div>
      <div id="drillCategoryFilters13" class="library-filter-row13"></div>
      <div id="drillLibrary13" class="drill-library-grid13"></div>
    </section>

    <p class="library-attribution13">Adapted from Dragon Boat Canada Level 1 coaching concepts and Kingston Dragonboat Club coaching standards.</p>
  `;
  document.getElementById('appNavigation13')?.insertAdjacentElement('afterend', shell);
}

function switchLibraryView(view) {
  library13.activeView = view;
  document.querySelectorAll('[data-app-view]').forEach(button => button.classList.toggle('active', button.dataset.appView === view));
  const isReview = view === 'review';
  document.querySelectorAll('.review-view-section13').forEach(section => section.classList.toggle('library-hidden13', !isReview));
  const shell = document.getElementById('libraryShell13');
  shell?.classList.toggle('hidden', isReview);
  document.querySelectorAll('.library-view13').forEach(section => section.classList.toggle('hidden', section.dataset.libraryView !== view));
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderTechniqueLibrary13(active = 'all') {
  const nav = document.getElementById('techniquePhaseNav13');
  if (nav && !nav.dataset.ready) {
    nav.dataset.ready = 'true';
    nav.innerHTML = `<button type="button" class="library-filter-button13 active" data-tech-filter="all">All phases</button>${Object.entries(techniqueModel13).map(([key,item]) => `<button type="button" class="library-filter-button13" data-tech-filter="${key}">${libraryEscape(item.label)}</button>`).join('')}`;
    nav.querySelectorAll('[data-tech-filter]').forEach(button => button.addEventListener('click', () => {
      nav.querySelectorAll('[data-tech-filter]').forEach(x => x.classList.toggle('active', x === button));
      renderTechniqueLibrary13(button.dataset.techFilter);
    }));
  }

  const target = document.getElementById('techniqueLibrary13');
  if (!target) return;
  const keys = Object.keys(techniqueModel13).filter(key => active === 'all' || key === active);
  target.innerHTML = keys.map(key => {
    const model = techniqueModel13[key];
    const phase = phases[key];
    const issues = phase.corrections.map(item => `
      <article class="tech-issue13" id="guide-${libraryEscape(item.id)}">
        <div class="tech-issue-heading13"><span>Common correction</span><h4>${libraryEscape(item.title)}</h4></div>
        <dl>
          <div><dt>What you may see</dt><dd>${libraryEscape(item.observation)}</dd></div>
          <div><dt>Coach it toward</dt><dd>${libraryEscape(item.correction)}</dd></div>
          <div><dt>Cue</dt><dd class="library-cue13">${libraryEscape(item.cue)}</dd></div>
          <div><dt>Drill</dt><dd><button type="button" class="library-text-link13" data-open-drill="${libraryEscape(item.drill)}">${libraryEscape(item.drill)}</button></dd></div>
        </dl>
      </article>
    `).join('');
    return `
      <section class="tech-phase13" data-tech-phase="${key}">
        <div class="tech-phase-header13">
          <span class="tech-phase-number13">${Object.keys(techniqueModel13).indexOf(key)+1}</span>
          <div><p class="phase-kicker">${libraryEscape(model.label)}</p><h3>${libraryEscape(model.sequence)}</h3><p>${libraryEscape(model.coachFocus)}</p></div>
        </div>
        <div class="tech-cues13">${model.cues.map(cue => `<span>${libraryEscape(cue)}</span>`).join('')}</div>
        <div class="tech-issues-grid13">${issues}</div>
      </section>
    `;
  }).join('');
  wireLibraryCrossLinks13();
}

function renderCueLibrary13(query = '') {
  const q = query.trim().toLowerCase();
  const items = cueLibrary13.filter(item => !q || [item.focus, item.useFor, ...item.cues].join(' ').toLowerCase().includes(q));
  const target = document.getElementById('cueLibrary13');
  if (!target) return;
  target.innerHTML = items.length ? items.map(item => `
    <article class="cue-card13">
      <span class="phase-kicker">${libraryEscape(item.focus)}</span>
      <div class="cue-chips13">${item.cues.map(cue => `<strong>${libraryEscape(cue)}</strong>`).join('')}</div>
      <p>${libraryEscape(item.useFor)}</p>
    </article>
  `).join('') : `<p class="library-empty13">No cues match that search.</p>`;
}

function drillCategories13() {
  return ['All', ...new Set(drillLibrary13.map(item => item.category))];
}

function renderDrillFilters13() {
  const target = document.getElementById('drillCategoryFilters13');
  if (!target || target.dataset.ready) return;
  target.dataset.ready = 'true';
  target.innerHTML = drillCategories13().map((category, index) => `<button type="button" class="library-filter-button13 ${index === 0 ? 'active' : ''}" data-drill-category="${libraryEscape(category)}">${libraryEscape(category)}</button>`).join('');
  target.querySelectorAll('[data-drill-category]').forEach(button => button.addEventListener('click', () => {
    target.querySelectorAll('[data-drill-category]').forEach(x => x.classList.toggle('active', x === button));
    renderDrillLibrary13(document.getElementById('drillSearch13')?.value || '', button.dataset.drillCategory);
  }));
}

function activeDrillCategory13() {
  return document.querySelector('[data-drill-category].active')?.dataset.drillCategory || 'All';
}

function renderDrillLibrary13(query = '', category = 'All') {
  const q = query.trim().toLowerCase();
  const items = drillLibrary13.filter(item => {
    const categoryMatch = category === 'All' || item.category === category;
    const queryMatch = !q || [item.name, item.category, item.useFor, item.how, ...item.cues].join(' ').toLowerCase().includes(q);
    return categoryMatch && queryMatch;
  });
  const target = document.getElementById('drillLibrary13');
  if (!target) return;
  target.innerHTML = items.length ? items.map(item => `
    <article class="drill-card13" data-drill-name="${libraryEscape(item.name)}">
      <div class="drill-heading13"><span>${libraryEscape(item.category)}</span><h3>${libraryEscape(item.name)}</h3></div>
      <dl>
        <div><dt>Use for</dt><dd>${libraryEscape(item.useFor)}</dd></div>
        <div><dt>How to perform</dt><dd>${libraryEscape(item.how)}</dd></div>
        <div><dt>Cues</dt><dd class="drill-cues13">${item.cues.map(cue => `<strong>${libraryEscape(cue)}</strong>`).join('')}</dd></div>
      </dl>
    </article>
  `).join('') : `<p class="library-empty13">No drills match those filters.</p>`;
}

function openDrill13(name) {
  switchLibraryView('drills');
  const search = document.getElementById('drillSearch13');
  if (search) search.value = name;
  document.querySelectorAll('[data-drill-category]').forEach(button => button.classList.toggle('active', button.dataset.drillCategory === 'All'));
  renderDrillLibrary13(name, 'All');
  setTimeout(() => document.querySelector(`[data-drill-name="${CSS.escape(name)}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 50);
}

function wireLibraryCrossLinks13() {
  document.querySelectorAll('[data-open-drill]').forEach(button => {
    if (button.dataset.bound13) return;
    button.dataset.bound13 = 'true';
    button.addEventListener('click', () => openDrill13(button.dataset.openDrill));
  });
}

function enhanceReviewWithGuides13() {
  document.querySelectorAll('.check-option.correction').forEach(label => {
    if (label.querySelector('.review-guide-button13')) return;
    const input = label.querySelector('input[data-option-id]');
    if (!input) return;
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'review-guide-button13';
    button.textContent = 'Guide';
    button.addEventListener('click', event => {
      event.preventDefault();
      event.stopPropagation();
      openTechniqueGuide13(input.dataset.optionId, input.dataset.phase);
    });
    label.appendChild(button);
  });
}

function openTechniqueGuide13(id, phase) {
  switchLibraryView('technique');
  const nav = document.getElementById('techniquePhaseNav13');
  nav?.querySelectorAll('[data-tech-filter]').forEach(button => button.classList.toggle('active', button.dataset.techFilter === phase));
  renderTechniqueLibrary13(phase);
  setTimeout(() => {
    const target = document.getElementById(`guide-${id}`);
    target?.classList.add('guide-highlight13');
    target?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setTimeout(() => target?.classList.remove('guide-highlight13'), 1800);
  }, 50);
}

function wireLibrarySearch13() {
  document.getElementById('cueSearch13')?.addEventListener('input', event => renderCueLibrary13(event.target.value));
  document.getElementById('drillSearch13')?.addEventListener('input', event => renderDrillLibrary13(event.target.value, activeDrillCategory13()));
}

function initializeLibrary13() {
  createLibraryNavigation();
  createLibraryShell();
  markReviewSections();
  renderTechniqueLibrary13();
  renderCueLibrary13();
  renderDrillFilters13();
  renderDrillLibrary13();
  wireLibrarySearch13();
  enhanceReviewWithGuides13();
  const badge = document.querySelector('.local-badge');
  if (badge) badge.textContent = 'Release 1.3 · Browser based';
}

initializeLibrary13();
