// =========================================
// APP.JS - Single Page Application
// =========================================

// État de l'application
const AppState = {
  currentView: "artists",
  currentArtist: null,
  currentAlbum: null,
};

// =========================================
// ROUTER - Navigation sans rechargement
// =========================================

function navigateTo(view, params = {}) {
  AppState.currentView = view;
  AppState.currentArtist = params.artistId || null;
  AppState.currentAlbum = params.albumId || null;

  // Mettre à jour l'URL sans recharger
  let url = "#/";
  if (view === "albums") {
    url = `#/artist/${params.artistId}`;
  } else if (view === "player") {
    url = `#/player/${params.artistId}/${params.albumId}`;
  }
  history.pushState(null, "", url);

  // Rendre la vue
  render();
}

// Gérer le bouton retour du navigateur
window.addEventListener("popstate", () => {
  parseURL();
});

// Parser l'URL au chargement
function parseURL() {
  const hash = window.location.hash || "#/";

  if (hash === "#/" || hash === "") {
    navigateTo("artists");
  } else if (hash.startsWith("#/artist/")) {
    const artistId = hash.split("/")[2];
    navigateTo("albums", { artistId });
  } else if (hash.startsWith("#/player/")) {
    const parts = hash.split("/");
    navigateTo("player", { artistId: parts[2], albumId: parts[3] });
  }
}

// =========================================
// RENDER - Afficher la vue actuelle
// =========================================

function render() {
  const app = document.getElementById("app");

  if (AppState.currentView === "artists") {
    app.innerHTML = renderArtistsView();
  } else if (AppState.currentView === "albums") {
    app.innerHTML = renderAlbumsView(AppState.currentArtist);
  } else if (AppState.currentView === "player") {
    app.innerHTML = renderPlayerView(
      AppState.currentArtist,
      AppState.currentAlbum,
    );
    // Charger l'album 3D après l'insertion du HTML
    setTimeout(() => initPlayer(), 100);
  }
}

// =========================================
// VUE 1 : ARTISTES
// =========================================

// FILTRES ARTISTES
function filterArtists() {
  const query = (document.getElementById("artist-search")?.value || "")
    .toLowerCase()
    .trim();
  const genre = document.getElementById("genre-filter")?.value || "";

  document.querySelectorAll("#artists-grid .card").forEach((card) => {
    const name = card.querySelector(".card-name").textContent.toLowerCase();
    const genres = card.dataset.genres || "";

    const matchName = name.includes(query);
    const matchGenre = !genre || genres.split(",").includes(genre);

    card.style.display = matchName && matchGenre ? "" : "none";
  });
}

// HTML ARTISTES
function renderArtistsView() {
  // Collecter tous les genres uniques
  const allGenres = [
    ...new Set(musicLibrary.artists.flatMap((a) => a.genres || []).sort()),
  ];

  const genreOptions = allGenres
    .map((g) => `<option value="${g}">${g}</option>`)
    .join("");

  const artistsHTML = musicLibrary.artists
    .map(
      (artist) => `
    <div class="card" 
         data-genres="${(artist.genres || []).join(",")}"
         onclick="navigateTo('albums', {artistId: '${artist.id}'})">
      <img src="${artist.image}" alt="${artist.name}" class="card-image" loading="lazy">
      <div class="card-info">
        <div class="card-name">${artist.name}</div>
        ${artist.genres ? `<div class="card-genres">${artist.genres.join(" · ")}</div>` : ""}
      </div>
    </div>
  `,
    )
    .join("");

  return `
    <div class="library-container">
      <header class="library-header">
        <a href="https://vinylstack-ahp.netlify.app/" target="_blank" rel="noopener" class="vinyl-link-btn">
          <span class="vinyl-icon">🎵</span>
          <span class="vinyl-label">Mes Vinyles</span>
        </a>
        <h1>MusicLibrary</h1>
        <p class="subtitle">ARTISTES</p>
        <div class="search-wrapper">
          <input 
            type="text" 
            id="artist-search" 
            placeholder="Rechercher un artiste..." 
            oninput="filterArtists()"
            autocomplete="off"
          >
          <select id="genre-filter" onchange="filterArtists()">
            <option value="">Tous les styles</option>
            ${genreOptions}
          </select>
        </div>
      </header>
      <div class="grid" id="artists-grid">
        ${artistsHTML}
      </div>
    </div>
  `;
}

// =========================================
// VUE 2 : ALBUMS
// =========================================

function renderAlbumsView(artistId) {
  const artist = musicLibrary.artists.find((a) => a.id === artistId);

  if (!artist) {
    navigateTo("artists");
    return "";
  }

  const albumsHTML = artist.albums
    .map(
      (album) => `
    <div class="card" onclick="navigateTo('player', {artistId: '${artistId}', albumId: '${album.id}'})">
      <img src="${album.cover}" alt="${album.name}" class="card-image" loading="lazy">
      <div class="card-info">
        <div class="card-name">${album.name}</div>
        <div class="card-year">${album.year}</div>
      </div>
    </div>
  `,
    )
    .join("");

  return `
    <div class="library-container">
      <header class="library-header">
        <a href="#/" onclick="navigateTo('artists'); return false;" class="back-button">← Retour aux artistes</a>
        <h1>${artist.name}</h1>
        <p class="subtitle">ALBUMS</p>
      </header>
      <div class="grid">
        ${albumsHTML}
      </div>
    </div>
  `;
}

// =========================================
// VUE 3 : LECTEUR (PLAYER)
// =========================================

function renderPlayerView(artistId, albumId) {
  const artist = musicLibrary.artists.find((a) => a.id === artistId);
  if (!artist) return "";

  const album = artist.albums.find((alb) => alb.id === albumId);
  if (!album) return "";

  document.title = `${album.name} - ${artist.name}`;

  return `
    <div class="player-header">
      <a href="#/artist/${artistId}" onclick="navigateTo('albums', {artistId: '${artistId}'}); return false;" class="back-button-player">← Retour aux albums</a>
    </div>

    <div class="page">
      <div class="album-section">
        <div id="album-container">
          <div id="${album.projectName}-background">0</div>
          <div id="${album.projectName}-1plan">10</div>
        </div>

        <div class="album-info">
          <h1 class="artist-name">${artist.name}</h1>
          <h2 class="album-name">${album.year} - ${album.name}</h2>
        </div>
      </div>

      <div class="music-player">
        <div class="playlist">
          <ul class="track-list" id="track-list-${album.id}"></ul>
        </div>
      </div>
    </div>
  `;
}

// =========================================
// INITIALISATION DU PLAYER
// =========================================
function initPlayer() {
  const artistId = AppState.currentArtist;
  const albumId = AppState.currentAlbum;

  const artist = musicLibrary.artists.find((a) => a.id === artistId);
  if (!artist) return;

  const album = artist.albums.find((alb) => alb.id === albumId);
  if (!album) return;

  // Initialiser l'album 3D
  render3DAlbum(album.cdnPath, album.projectName, {
    size: "55em",
    albumOffset: "2em",
    pageTop: "6em",
    pageBottom: "6em",
    albumX: "500px",
    albumY: "300px",
  });

  // Créer la playlist
  setupMusicPlayer(
    artist.name,
    `${album.year} - ${album.name}`,
    album.tracks,
    album.id,
    album.cover,
    artist.id,
  );
}

function render3DAlbum(cdnPath, projectName, options = {}) {
  const {
    size = "55em",
    albumOffset = "0em",
    pageTop = "6em",
    pageBottom = "6em",
    albumX = "0px",
    albumY = "0px",
  } = options;

  const albumContainer = document.getElementById("album-container");
  if (!albumContainer) return;

  albumContainer.style.setProperty("--album-size", size);
  albumContainer.style.setProperty("--album-offset", albumOffset);
  albumContainer.style.setProperty("--album-x", albumX);
  albumContainer.style.setProperty("--album-y", albumY);

  document.documentElement.style.setProperty("--page-top", pageTop);
  document.documentElement.style.setProperty("--page-bottom", pageBottom);

  const BASE_URL =
    "https://cdn.jsdelivr.net/gh/DjoAHP/cdn-ressources-albums@v1.1.61/images/";

  function generateImageUrl(name, callback) {
    const webpUrl = `${BASE_URL}${cdnPath}/${name}.webp`;
    const jpgUrl = `${BASE_URL}${cdnPath}/${name}.jpg`;

    const img = new Image();
    img.onload = () => callback(`url(${webpUrl})`);
    img.onerror = () => callback(`url(${jpgUrl})`);
    img.src = webpUrl;
  }

  const layers = [...albumContainer.querySelectorAll("div")];
  const images = [];

  layers.forEach((el) => {
    const depth = Number(el.innerText.trim());
    generateImageUrl(el.id, (url) => {
      el.style.setProperty("--image", url);
      el.style.backgroundImage = url;
    });
    el.style.backgroundImage = generateImageUrl(el.id);
    el.style.setProperty("--depth", `${depth}em`);
    images.push({ el, name: el.id, depth });
  });

  images.forEach((frontLayer, i) => {
    images.slice(i + 1).forEach((backLayer) => {
      const shadow = document.createElement("div");
      shadow.classList.add("shadow");
      generateImageUrl(backLayer.name, (url) => {
        shadow.style.backgroundImage = url;
      });
      shadow.style.setProperty(
        "--blur",
        `${(backLayer.depth - frontLayer.depth) / 8}em`,
      );
      frontLayer.el.appendChild(shadow);
    });
  });

  albumContainer.addEventListener("click", () => {
    albumContainer.classList.toggle("disabled");
  });
}

// =========================================
// SETUP MUSIC PLAYER
// =========================================
function formatDuration(seconds) {
  if (!seconds || isNaN(seconds)) return "--:--";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

function setupMusicPlayer(
  artistName,
  albumName,
  tracks,
  albumId,
  cover = "",
  artistId = "",
) {
  const list = document.getElementById(`track-list-${albumId}`);
  if (!list) return;

  // Index de la piste en cours dans CET album
  // Stocké dans un objet pour être partagé entre closures sans risque de capture
  const state = { current: -1 };

  const durationCache = window._durationCache || (window._durationCache = {});

  tracks.forEach((track, i) => {
    const li = document.createElement("li");
    const durationId = `duration-${albumId}-${i}`;
    li.innerHTML = `
    <span class="track-number">${String(i + 1).padStart(2, "0")}</span>
    <span class="track-name">${track.title}</span>
    <span class="track-duration" id="${durationId}">--:--</span>
  `;
    li.onclick = () => play(i);
    list.appendChild(li);

    if (durationCache[track.url]) {
      const el = document.getElementById(durationId);
      if (el) el.textContent = durationCache[track.url];
    } else {
      const tempAudio = new Audio();
      tempAudio.preload = "metadata";
      tempAudio.onloadedmetadata = () => {
        const formatted = formatDuration(tempAudio.duration);
        durationCache[track.url] = formatted;
        const el = document.getElementById(durationId);
        if (el) el.textContent = formatted;
        tempAudio.src = "";
      };
      tempAudio.src = track.url;
    }
  });

  function play(index) {
    state.current = index;
    const track = tracks[index];

    document.querySelectorAll(`#track-list-${albumId} li`).forEach((li, i) => {
      li.classList.toggle("active", i === index);
    });

    window.playGlobalTrack(
      track.url,
      track.title,
      artistName,
      albumName,
      cover,
      artistId,
      albumId,
    );

    // Mettre à jour les fonctions de navigation globales
    // On utilise state.current pour que prev/next lisent toujours la valeur à jour
    window.globalPlayerNav.prev =
      state.current > 0 ? () => play(state.current - 1) : null;
    window.globalPlayerNav.next =
      state.current < tracks.length - 1 ? () => play(state.current + 1) : null;

    // Rafraîchir l'état des boutons dans le mini player
    if (typeof updateNavButtons === "function") updateNavButtons();
  }

  // Restaurer l'état de la playlist si une piste de cet album est en cours
  function restoreActiveTrack() {
    try {
      const saved = JSON.parse(localStorage.getItem("currentTrack") || "{}");
      if (!saved.url) return;

      const activeIndex = tracks.findIndex((t) => t.url === saved.url);
      if (activeIndex === -1) return;

      state.current = activeIndex;
      document
        .querySelectorAll(`#track-list-${albumId} li`)
        .forEach((li, i) => {
          li.classList.toggle("active", i === activeIndex);
        });

      const activeLi = list.querySelectorAll("li")[activeIndex];
      if (activeLi) {
        activeLi.scrollIntoView({ block: "nearest", behavior: "smooth" });
      }

      // Rebrancher la navigation prev/next pour cet album
      window.globalPlayerNav.prev =
        state.current > 0 ? () => play(state.current - 1) : null;
      window.globalPlayerNav.next =
        state.current < tracks.length - 1
          ? () => play(state.current + 1)
          : null;

      if (typeof updateNavButtons === "function") updateNavButtons();
    } catch (e) {
      // Silencieux — pas bloquant
    }
  }

  restoreActiveTrack();

  // NOTE : Le gestionnaire "ended" est maintenant dans global-player.js
  // et délègue à window.globalPlayerNav.next — rien à ajouter ici.
}

// =========================================
// DÉMARRAGE DE L'APPLICATION
// =========================================

document.addEventListener("DOMContentLoaded", () => {
  parseURL();
});
