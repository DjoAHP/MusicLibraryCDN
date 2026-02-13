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
  };
}

// Fonction pour lire une piste globalement
window.playGlobalTrack = function (trackUrl, title, artist, album) {
  const audio = window.globalAudio;

  audio.src = trackUrl;
  audio.play();

  // Mettre à jour les infos
  window.globalAudioData.title = title;
  window.globalAudioData.artist = artist;
  window.globalAudioData.album = album;

  // Sauvegarder dans localStorage
  localStorage.setItem(
    "currentTrack",
    JSON.stringify({
      url: trackUrl,
      title: title,
      artist: artist,
      album: album,
      time: 0,
      isPlaying: true,
    }),
  );

  updateMiniPlayer();
};

// Sauvegarder le temps de lecture régulièrement (toutes les 500ms)
let saveTimeout;
window.globalAudio.addEventListener("timeupdate", function () {
  if (window.globalAudioData.title) {
    // Débounce pour éviter trop d'écritures
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(() => {
      const saved = JSON.parse(localStorage.getItem("currentTrack") || "{}");
      if (saved.url) {
        saved.time = window.globalAudio.currentTime;
        saved.isPlaying = !window.globalAudio.paused;
        localStorage.setItem("currentTrack", JSON.stringify(saved));
      }
    }, 500); // Sauvegarde toutes les 100ms pour être précis
  }
});

// Mettre à jour l'affichage du mini lecteur
function updateMiniPlayer() {
  const miniPlayer = document.getElementById("mini-player");
  if (!miniPlayer) return;

  const data = window.globalAudioData;

  if (data.title) {
    miniPlayer.style.display = "flex";
    document.body.classList.add("has-mini-player");

    document.getElementById("mini-player-title").textContent = data.title;
    document.getElementById("mini-player-artist").textContent =
      `${data.artist} - ${data.album}`;

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

    if (currentTimeEl) {
      currentTimeEl.textContent = formatTime(audio.currentTime);
    }

    if (durationEl) {
      durationEl.textContent = formatTime(audio.duration);
    }
  }
}

// Initialiser le mini lecteur
document.addEventListener("DOMContentLoaded", function () {
  // Créer le mini lecteur
  if (!document.getElementById("mini-player")) {
    const miniPlayer = document.createElement("div");
    miniPlayer.id = "mini-player";
    miniPlayer.style.display = "none";
    // HTML PLAYER
miniPlayer.innerHTML = `

  <div class="mini-player-main">

    <!-- CONTROLS -->
    <div class="mini-player-controls">
      <button id="mini-player-play-pause">▶</button>
    </div>

    <!-- INFOS -->
    <div class="mini-player-info">
      <div id="mini-player-title">Aucune lecture</div>
      <div id="mini-player-artist"></div>
    </div>

    <!-- PROGRESS -->
    <div class="mini-player-progress">

      <span id="mini-current-time">0:00</span>

      <div class="mini-progress-bar">
        <div class="mini-progress-fill"></div>
      </div>

      <span id="mini-duration">0:00</span>

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

  // Barre de progression cliquable
  const progressBar = document.querySelector(".mini-progress-bar");
  if (progressBar) {
    progressBar.onclick = function (e) {
      const rect = progressBar.getBoundingClientRect();
      const percent = (e.clientX - rect.left) / rect.width;
      window.globalAudio.currentTime = percent * window.globalAudio.duration;
    };
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

  // RESTAURER ET AUTO-PLAY (OPTIMISÉ)
  const saved = localStorage.getItem("currentTrack");
  if (saved) {
    try {
      const data = JSON.parse(saved);
      if (data.url && window.globalAudio.src !== data.url) {
        window.globalAudioData.title = data.title;
        window.globalAudioData.artist = data.artist;
        window.globalAudioData.album = data.album;

        // Charger immédiatement
        window.globalAudio.src = data.url;
        window.globalAudio.currentTime = data.time || 0;

        // AUTO-PLAY immédiatement si en cours
        if (data.isPlaying) {
          // Tenter de jouer dès que possible
          window.globalAudio
            .play()
            .then(() => {
              console.log("Lecture reprise automatiquement");
            })
            .catch(() => {
              console.log("Auto-play bloqué, cliquez sur play");
            });
        }

        updateMiniPlayer();
      } else if (
        data.url === window.globalAudio.src &&
        data.isPlaying &&
        window.globalAudio.paused
      ) {
        // Même URL mais en pause, reprendre
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
