// ============================================
// LECTEUR AUDIO GLOBAL PERSISTANT
// ============================================

// Créer l'audio global une seule fois
if (!window.globalAudio) {
  window.globalAudio = new Audio();
  window.globalAudioData = {
    title: "",
    artist: "",
    album: "",
    cover: "",
    artistId: "",
    albumId: "",
  };
}

// Navigation globale (prev/next) — renseignée par setupMusicPlayer
if (!window.globalPlayerNav) {
  window.globalPlayerNav = {
    prev: null,
    next: null,
  };
}

// Fonction pour lire une piste globalement
window.playGlobalTrack = function (
  trackUrl,
  title,
  artist,
  album,
  cover = "",
  artistId = "",
  albumId = "",
) {
  const audio = window.globalAudio;

  audio.src = trackUrl;
  audio.play();

  // Mettre à jour les infos
  window.globalAudioData.title = title;
  window.globalAudioData.artist = artist;
  window.globalAudioData.album = album;
  window.globalAudioData.cover = cover;
  window.globalAudioData.artistId = artistId;
  window.globalAudioData.albumId = albumId;

  // Sauvegarder dans localStorage
  localStorage.setItem(
    "currentTrack",
    JSON.stringify({
      url: trackUrl,
      title: title,
      artist: artist,
      album: album,
      cover: cover,
      artistId: artistId,
      albumId: albumId,
      time: 0,
      isPlaying: true,
    }),
  );

  updateMiniPlayer();
};

// Sauvegarder le temps de lecture régulièrement
let saveTimeout;
window.globalAudio.addEventListener("timeupdate", function () {
  if (window.globalAudioData.title) {
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(() => {
      const saved = JSON.parse(localStorage.getItem("currentTrack") || "{}");
      if (saved.url) {
        saved.time = window.globalAudio.currentTime;
        saved.isPlaying = !window.globalAudio.paused;
        localStorage.setItem("currentTrack", JSON.stringify(saved));
      }
    }, 500);
  }
});

// Mettre à jour l'état actif/inactif des boutons prev/next
function updateNavButtons() {
  const prevBtn = document.getElementById("mini-player-prev");
  const nextBtn = document.getElementById("mini-player-next");
  if (prevBtn) prevBtn.disabled = !window.globalPlayerNav.prev;
  if (nextBtn) nextBtn.disabled = !window.globalPlayerNav.next;
}

// Mettre à jour l'affichage du mini lecteur
function updateMiniPlayer() {
  const miniPlayer = document.getElementById("mini-player");
  if (!miniPlayer) return;

  const data = window.globalAudioData;

  if (data.title) {
    miniPlayer.style.display = "flex";
    document.body.classList.add("has-mini-player");

    document.getElementById("mini-player-title").textContent = data.title;

    // Zone infos cliquable → ouvre l'album en cours
    const artistEl = document.getElementById("mini-player-artist");
    artistEl.textContent = `${data.artist} - ${data.album}`;
    if (data.artistId && data.albumId) {
      artistEl.style.cursor = "pointer";
      artistEl.title = "Ouvrir l'album";
      artistEl.onclick = () => {
        if (typeof navigateTo === "function") {
          navigateTo("player", {
            artistId: data.artistId,
            albumId: data.albumId,
          });
        }
      };
    } else {
      artistEl.style.cursor = "default";
      artistEl.onclick = null;
    }

    // Pochette avec transition
    const coverEl = document.getElementById("mini-player-cover");
    if (coverEl) {
      if (data.cover) {
        coverEl.style.opacity = "0";
        coverEl.style.transform = "scale(0.85)";
        setTimeout(() => {
          coverEl.src = data.cover;
          coverEl.style.opacity = "1";
          coverEl.style.transform = "scale(1)";
        }, 150);
      } else {
        coverEl.src = "";
        coverEl.style.opacity = "0";
      }
    }

    updateNavButtons();
    updatePlayPauseButton();
  }
}

function hideMiniPlayer() {
  const miniPlayer = document.getElementById("mini-player");
  if (miniPlayer) {
    miniPlayer.style.display = "none";
    document.body.classList.remove("has-mini-player");
  }
}

function updatePlayPauseButton() {
  const playPauseBtn = document.getElementById("mini-player-play-pause");
  if (playPauseBtn) {
    playPauseBtn.textContent = window.globalAudio.paused ? "▶" : "⏸";
  }
}

// Formater le temps
function formatTime(seconds) {
  if (!seconds || isNaN(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

// Mettre à jour la barre de progression
function updateMiniProgress() {
  const audio = window.globalAudio;
  const progressFill = document.querySelector(".mini-progress-fill");
  const currentTimeEl = document.getElementById("mini-current-time");
  const durationEl = document.getElementById("mini-duration");

  if (audio.duration && progressFill) {
    const percent = (audio.currentTime / audio.duration) * 100;
    progressFill.style.width = percent + "%";
    if (currentTimeEl)
      currentTimeEl.textContent = formatTime(audio.currentTime);
    if (durationEl) durationEl.textContent = formatTime(audio.duration);
  }
}

// Initialiser le mini lecteur
document.addEventListener("DOMContentLoaded", function () {
  if (!document.getElementById("mini-player")) {
    const miniPlayer = document.createElement("div");
    miniPlayer.id = "mini-player";
    miniPlayer.style.display = "none";

    miniPlayer.innerHTML = `
  <div class="mini-player-main">

    <!-- POCHETTE -->
    <div class="mini-player-cover-wrapper">
      <img id="mini-player-cover" src="" alt="Pochette" />
    </div>

    <!-- INFOS -->
    <div class="mini-player-info">
      <div id="mini-player-title">Aucune lecture</div>
      <div id="mini-player-artist"></div>
    </div>

    <!-- CONTROLS -->
    <div class="mini-player-controls">
      <button id="mini-player-prev" title="Piste précédente" disabled>⏮</button>
      <button id="mini-player-play-pause">▶</button>
      <button id="mini-player-next" title="Piste suivante" disabled>⏭</button>
    </div>

    <!-- PROGRESS -->
    <div class="mini-player-progress">
      <span id="mini-current-time">0:00</span>
      <div class="mini-progress-bar">
        <div class="mini-progress-fill"></div>
      </div>
      <span id="mini-duration">0:00</span>
    </div>

    <!-- VOLUME -->
    <div class="mini-player-volume">
      <button id="mini-volume-icon" title="Couper le son">🔊</button>
      <input type="range" id="mini-volume-slider" min="0" max="1" step="0.02" value="1">
    </div>

  </div>
`;

    document.body.appendChild(miniPlayer);
  }

  // Bouton play/pause
  const playPauseBtn = document.getElementById("mini-player-play-pause");
  if (playPauseBtn) {
    playPauseBtn.onclick = function () {
      if (window.globalAudio.paused) {
        window.globalAudio.play();
      } else {
        window.globalAudio.pause();
      }
    };
  }

  // Boutons prev / next
  const prevBtn = document.getElementById("mini-player-prev");
  const nextBtn = document.getElementById("mini-player-next");

  if (prevBtn) {
    prevBtn.onclick = function () {
      if (window.globalPlayerNav.prev) window.globalPlayerNav.prev();
    };
  }

  if (nextBtn) {
    nextBtn.onclick = function () {
      if (window.globalPlayerNav.next) window.globalPlayerNav.next();
    };
  }

  // Barre de progression cliquable
  const progressBar = document.querySelector(".mini-progress-bar");
  if (progressBar) {
    progressBar.onclick = function (e) {
      const rect = progressBar.getBoundingClientRect();
      const percent = (e.clientX - rect.left) / rect.width;
      window.globalAudio.currentTime = percent * window.globalAudio.duration;
    };
  }

  // Contrôle du volume
  const volumeSlider = document.getElementById("mini-volume-slider");
  const volumeIcon = document.getElementById("mini-volume-icon");

  function updateVolumeIcon(vol) {
    if (!volumeIcon) return;
    if (vol === 0 || window.globalAudio.muted) volumeIcon.textContent = "🔇";
    else if (vol < 0.4) volumeIcon.textContent = "🔈";
    else if (vol < 0.7) volumeIcon.textContent = "🔉";
    else volumeIcon.textContent = "🔊";
  }

  if (volumeSlider) {
    const savedVolume = localStorage.getItem("playerVolume");
    if (savedVolume !== null) {
      window.globalAudio.volume = parseFloat(savedVolume);
      volumeSlider.value = savedVolume;
      volumeSlider.style.setProperty(
        "--volume-percent",
        parseFloat(savedVolume) * 100,
      );
      updateVolumeIcon(parseFloat(savedVolume));
    }

    volumeSlider.addEventListener("input", function () {
      const vol = parseFloat(this.value);
      window.globalAudio.volume = vol;
      window.globalAudio.muted = vol === 0;
      updateVolumeIcon(vol);
      localStorage.setItem("playerVolume", vol);
      this.style.setProperty("--volume-percent", vol * 100);
    });
  }

  if (volumeIcon) {
    volumeIcon.addEventListener("click", function () {
      window.globalAudio.muted = !window.globalAudio.muted;
      if (volumeSlider) {
        volumeSlider.value = window.globalAudio.muted
          ? 0
          : window.globalAudio.volume;
      }
      updateVolumeIcon(
        window.globalAudio.muted ? 0 : window.globalAudio.volume,
      );
    });
  }

  // Événements audio
  window.globalAudio.addEventListener("play", function () {
    updatePlayPauseButton();
    updateMiniProgress();
  });
  window.globalAudio.addEventListener("pause", updatePlayPauseButton);
  window.globalAudio.addEventListener("ended", updatePlayPauseButton);
  window.globalAudio.addEventListener("timeupdate", updateMiniProgress);
  window.globalAudio.addEventListener("loadedmetadata", updateMiniProgress);

  // RESTAURER ET AUTO-PLAY
  const saved = localStorage.getItem("currentTrack");
  if (saved) {
    try {
      const data = JSON.parse(saved);
      if (data.url && window.globalAudio.src !== data.url) {
        window.globalAudioData.title = data.title;
        window.globalAudioData.artist = data.artist;
        window.globalAudioData.album = data.album;
        window.globalAudioData.cover = data.cover || "";
        window.globalAudioData.artistId = data.artistId || "";
        window.globalAudioData.albumId = data.albumId || "";

        window.globalAudio.src = data.url;
        window.globalAudio.currentTime = data.time || 0;

        if (data.isPlaying) {
          window.globalAudio
            .play()
            .then(() => console.log("Lecture reprise automatiquement"))
            .catch(() => console.log("Auto-play bloqué, cliquez sur play"));
        }

        updateMiniPlayer();
      } else if (
        data.url === window.globalAudio.src &&
        data.isPlaying &&
        window.globalAudio.paused
      ) {
        window.globalAudio.currentTime = data.time || 0;
        window.globalAudio.play().catch(() => {});
        window.globalAudio.muted = false;
        updateMiniPlayer();
      }
    } catch (e) {
      console.error("Erreur restauration:", e);
    }
  }
});
