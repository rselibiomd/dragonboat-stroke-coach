/* Release 1.3 technical coverage expansion */

const feedbackExpansion13 = {
  setup: [
    {
      id: 'setup-top-arm-bent',
      title: 'Open the top arm more at the set',
      observation: 'The top elbow stays very bent or folded as you arrive at the front, which can shorten the set and make the paddle harder to place cleanly.',
      correction: 'Let the top arm open into a strong supported position as you rotate into the set. Do not lock the elbow, but avoid keeping it folded close to the head or body.',
      cue: 'Open the top arm.',
      drill: 'Angled Entry Correction'
    },
    {
      id: 'setup-top-hand-low',
      title: 'Keep the top hand supported and in front',
      observation: 'The top hand drops or drifts away as you approach the catch, changing the paddle path and entry angle.',
      correction: 'Keep the top hand supported in front of you as the body rotates into the set. Let the body create the reach rather than letting the top hand collapse downward or swing away.',
      cue: 'Top hand up and in front.',
      drill: 'Paddle Swings Away'
    }
  ],
  pull: [
    {
      id: 'pull-top-arm-drive',
      title: 'Add clearer top-arm drive after connection',
      observation: 'The top hand looks relatively passive once the blade is buried, so the stroke is missing a clear downward drive through the top arm.',
      correction: 'First establish the full blade and feel the connection. Then drive the top hand down as the hips and torso derotate. The top arm adds pressure after connection, not before the catch is established.',
      cue: 'Connect, then drive the top hand down.',
      drill: 'Push and Pull'
    },
    {
      id: 'pull-top-arm-collapses',
      title: 'Keep the top arm structured through the pull',
      observation: 'The top elbow folds or collapses quickly once the pull begins, reducing the quality of the top-arm drive.',
      correction: 'Keep the top arm supported as pressure builds. Allow natural elbow movement, but avoid collapsing the arm early. Maintain downward pressure while the body derotates.',
      cue: 'Strong top arm, body drives.',
      drill: 'Push and Pull'
    }
  ],
  exit: [
    {
      id: 'exit-early',
      title: 'Stay connected until the blade reaches the hip',
      observation: 'The blade begins to release before it reaches the hip, so useful pressure ends early and the power phase becomes short.',
      correction: 'Maintain connection through the useful part of the pull until the blade reaches the hip. Then release quickly. Do not lengthen the stroke behind the hip to compensate.',
      cue: 'Stay connected to the hip, then out.',
      drill: 'Catch and Pull'
    },
    {
      id: 'exit-shoveling',
      title: 'Remove the shoveling action at the exit',
      observation: 'The blade scoops or lifts water as it leaves, creating an upward or backward shoveling motion instead of a clean release.',
      correction: 'As the blade reaches the hip, keep the chest tall and press the blade down and out so it clears the water cleanly without carrying water upward.',
      cue: 'Press down and out.',
      drill: 'Catch and Pull - Shoveling at Exit'
    }
  ]
};

function addFeedbackExpansionData13() {
  Object.entries(feedbackExpansion13).forEach(([phaseKey, corrections]) => {
    const phase = phases[phaseKey];
    if (!phase) return;
    corrections.forEach(correction => {
      if (!phase.corrections.some(item => item.id === correction.id)) phase.corrections.push(correction);
    });
  });

  if (typeof distinctionNotes13 !== 'undefined') {
    distinctionNotes13['setup-top-arm-bent'] = {
      label: 'Do not cue a locked elbow',
      text: 'The goal is a longer, supported top arm at the set, not a rigidly straight elbow. Coach the excessive fold or collapse only when it is clearly limiting paddle placement.'
    };
    distinctionNotes13['pull-top-arm-drive'] = {
      label: 'Connection comes first',
      text: 'Use this when the top hand is passive after the blade is established. Do not ask for earlier top-arm pressure during blade entry. Full burial and connection still come first.'
    };
    distinctionNotes13['pull-top-arm-collapses'] = {
      label: 'Different from simply having a bent elbow',
      text: 'Natural elbow bend is acceptable. Use this correction when the top arm folds quickly under load and loses its ability to drive pressure through the paddle.'
    };
    distinctionNotes13['exit-early'] = {
      label: 'Different from a quick exit',
      text: 'A quick exit is desirable once the blade reaches the hip. An early exit begins before the hip and cuts off useful pressure. Keep connection to the hip, then release quickly.'
    };
    distinctionNotes13['exit-shoveling'] = {
      label: 'Different from a late exit',
      text: 'Shoveling describes the blade path as it leaves the water. A paddler can shovel even if the timing is not late, so coach the release path separately from exit timing.'
    };
  }
}

function appendFeedbackExpansionOptions13() {
  const cards = [...els.phaseReview.querySelectorAll('.phase-review-card')];
  const order = ['setup', 'catch', 'pull', 'exit'];
  order.forEach((phaseKey, index) => {
    const card = cards[index];
    if (!card) return;
    const box = card.querySelector('.correction-options');
    if (!box) return;
    feedbackExpansion13[phaseKey]?.forEach(item => {
      if (box.querySelector(`[data-option-id="${item.id}"]`)) return;
      box.appendChild(makeOption(item.id, item.title, 'correction', phaseKey));
    });
  });

  if (typeof enhanceReviewWithGuides13 === 'function') enhanceReviewWithGuides13();
}

function ensureExpansionDrills13() {
  const additions = [
    {
      name: 'Paddle Swings Away',
      category: 'Catch & Entry',
      useFor: 'Top hand drops or paddle swings away from the boat',
      how: 'Keep the top hand supported in front of the face and over the side of the boat. Keep the bottom-hand thumb close to the side of the boat while using short controlled strokes.',
      cues: ['Top hand in front', 'Thumb close']
    },
    {
      name: 'Angled Entry Correction',
      category: 'Catch & Entry',
      useFor: 'Bent top arm or angled paddle entry',
      how: 'At the set, balance the reach of the top and bottom arms so the paddle can enter close to vertical. Open the top arm enough to support the paddle without locking the elbow.',
      cues: ['Open the top arm', 'Equal hands', 'Vertical blade']
    },
    {
      name: 'Catch and Pull - Shoveling at Exit',
      category: 'Exit & Starts',
      useFor: 'Shoveling or scooping water at the exit',
      how: 'Use slow connected strokes. As the blade reaches the hip, keep the chest tall and press the blade down and out so it clears without lifting water.',
      cues: ['Press down and out', 'Chest tall']
    }
  ];

  additions.forEach(drill => {
    if (!drillLibrary13.some(item => item.name === drill.name)) drillLibrary13.push(drill);
  });
}

addFeedbackExpansionData13();
ensureExpansionDrills13();
appendFeedbackExpansionOptions13();

if (typeof renderTechniqueLibrary13 === 'function') renderTechniqueLibrary13('all');
if (library13?.activeView === 'drills' && typeof renderDrillLibrary13 === 'function') {
  renderDrillLibrary13(document.getElementById('drillSearch13')?.value || '', activeDrillCategory13());
}
