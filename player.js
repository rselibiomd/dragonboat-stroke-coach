/* External player controls and review-card fullscreen */

const reviewPlayers = {
  clip: {
    video: document.getElementById('clipPreview'),
    card: document.getElementById('clipPlayerCard'),
    play: document.querySelector('[data-play-video="clip"]'),
    seek: document.querySelector('[data-seek-video="clip"]'),
    time: document.getElementById('clipTime'),
    duration: document.getElementById('clipDuration'),
    fullscreen: document.querySelector('[data-fullscreen-video="clip"]')
  },
  reference: {
    video: document.getElementById('referencePreview'),
    card: document.getElementById('referencePlayerCard'),
    play: document.querySelector('[data-play-video="reference"]'),
    seek: document.querySelector('[data-seek-video="reference"]'),
    time: document.getElementById('referenceTime'),
    duration: document.getElementById('referenceDuration'),
    fullscreen: document.querySelector('[data-fullscreen-video="reference"]')
  }
};

function playerTime(value) {
  if (!Number.isFinite(value) || value < 0) return '0:00.00';
  const minutes = Math.floor(value / 60);
  const seconds = value - minutes * 60;
  return `${minutes}:${seconds.toFixed(2).padStart(5, '0')}`;
}

function updateExternalPlayer(kind) {
  const player = reviewPlayers[kind];
  if (!player?.video) return;
  const { video, seek, time, duration, play } = player;

  if (time) time.textContent = playerTime(video.currentTime || 0);
  if (duration) duration.textContent = playerTime(video.duration || 0);

  if (seek) {
    const max = Number.isFinite(video.duration) && video.duration > 0 ? video.duration : 0;
    seek.max = String(max);
    seek.value = String(Math.min(video.currentTime || 0, max));
    seek.disabled = max <= 0;
  }

  if (play) {
    play.textContent = video.paused ? 'Play' : 'Pause';
    play.setAttribute('aria-label', video.paused ? 'Play video' : 'Pause video');
  }
}

function initializeExternalPlayer(kind) {
  const player = reviewPlayers[kind];
  if (!player?.video) return;
  const { video, play, seek, fullscreen } = player;

  video.removeAttribute('controls');

  ['loadedmetadata', 'durationchange', 'timeupdate', 'play', 'pause', 'ended', 'seeked'].forEach(eventName => {
    video.addEventListener(eventName, () => updateExternalPlayer(kind));
  });

  play?.addEventListener('click', () => {
    if (video.paused || video.ended) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  });

  seek?.addEventListener('input', () => {
    video.pause();
    const next = Number(seek.value);
    if (Number.isFinite(next)) video.currentTime = next;
  });

  video.addEventListener('click', () => {
    if (video.paused || video.ended) video.play().catch(() => {});
    else video.pause();
  });

  fullscreen?.addEventListener('click', () => toggleReviewFullscreen(kind));
  updateExternalPlayer(kind);
}

function activePseudoFullscreen() {
  return document.querySelector('.video-review-card.pseudo-fullscreen');
}

function clearPseudoFullscreen() {
  activePseudoFullscreen()?.classList.remove('pseudo-fullscreen');
  document.body.classList.remove('review-fullscreen-active');
  updateFullscreenButtons();
}

async function toggleReviewFullscreen(kind) {
  const player = reviewPlayers[kind];
  if (!player?.card) return;
  const card = player.card;

  if (document.fullscreenElement === card) {
    await document.exitFullscreen().catch(() => {});
    return;
  }

  if (card.classList.contains('pseudo-fullscreen')) {
    clearPseudoFullscreen();
    return;
  }

  clearPseudoFullscreen();

  if (card.requestFullscreen) {
    try {
      await card.requestFullscreen({ navigationUI: 'hide' });
      return;
    } catch {
      // Fall through to focus fullscreen below.
    }
  }

  card.classList.add('pseudo-fullscreen');
  document.body.classList.add('review-fullscreen-active');
  updateFullscreenButtons();
}

function updateFullscreenButtons() {
  Object.values(reviewPlayers).forEach(player => {
    if (!player?.fullscreen || !player.card) return;
    const expanded = document.fullscreenElement === player.card || player.card.classList.contains('pseudo-fullscreen');
    player.fullscreen.textContent = expanded ? 'Exit Fullscreen' : 'Fullscreen';
    player.fullscreen.setAttribute('aria-label', expanded ? 'Exit fullscreen review' : 'Open fullscreen review');
  });
}

document.addEventListener('fullscreenchange', updateFullscreenButtons);
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && activePseudoFullscreen()) clearPseudoFullscreen();
});

initializeExternalPlayer('clip');
initializeExternalPlayer('reference');
