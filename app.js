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

function renderArtistsView() {
  const artistsHTML = musicLibrary.artists
    .map(
      (artist) => `
    <div class="card" onclick="navigateTo('albums', {artistId: '${artist.id}'})">
      <img src="${artist.image}" alt="${artist.name}" class="card-image" loading="lazy">
      <div class="card-info">
        <div class="card-name">${artist.name}</div>
      </div>
    </div>
  `,
    )
    .join("");

  return `
    <div class="library-container">
      <header class="library-header">
        <h1>MusicLibrary</h1>
        <p class="subtitle">ARTISTES</p>
      </header>
      <div class="grid">
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
    albumX: "500px", // horizontal
    albumY: "300px", // vertical
  });

  // Créer la playlist
  setupMusicPlayer(
    artist.name,
    `${album.year} - ${album.name}`,
    album.tracks,
    album.id,
  );
}

function render3DAlbum(cdnPath, projectName, options = {}) {
  const {
    size = "55em",
    albumOffset = "0em",
    pageTop = "6em",
    pageBottom = "6em",
    albumX = "0px", // horizontal
    albumY = "0px", // vertical
  } = options;

  const albumContainer = document.getElementById("album-container");
  if (!albumContainer) return;

  // Mettre à jour les variables CSS pour position et taille
  albumContainer.style.setProperty("--album-size", size);
  albumContainer.style.setProperty("--album-offset", albumOffset);
  albumContainer.style.setProperty("--album-x", albumX);
  albumContainer.style.setProperty("--album-y", albumY);

  document.documentElement.style.setProperty("--page-top", pageTop);
  document.documentElement.style.setProperty("--page-bottom", pageBottom);

  // MON LIEN CDN
  const BASE_URL =
    "https://cdn.jsdelivr.net/gh/DjoAHP/cdn-ressources-albums@v1.1.41/images/";
  function generateImageUrl(name, callback) {
    const webpUrl = `${BASE_URL}${cdnPath}/${name}.webp`;
    const jpgUrl = `${BASE_URL}${cdnPath}/${name}.jpg`;

    const img = new Image();
    img.onload = () => callback(`url(${webpUrl})`);
    img.onerror = () => callback(`url(${jpgUrl})`);
    img.src = webpUrl;
  }

  // Récupère toutes les layers
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

  // Création des shadows
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

function setupMusicPlayer(artistName, albumName, tracks, albumId) {
  const list = document.getElementById(`track-list-${albumId}`);
  if (!list) return;

  let current = -1;

  tracks.forEach((track, i) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span class="track-number">${String(i + 1).padStart(2, "0")}</span>
      <span class="track-name">${track.title}</span>
    `;
    li.onclick = () => play(i);
    list.appendChild(li);
  });

  function play(index) {
    current = index;
    const track = tracks[index];

    document.querySelectorAll(`#track-list-${albumId} li`).forEach((li, i) => {
      li.classList.toggle("active", i === index);
    });

    window.playGlobalTrack(track.url, track.title, artistName, albumName);
  }

  // Piste suivante
  const endedHandler = function () {
    if (current < tracks.length - 1) {
      play(current + 1);
    }
  };

  // Gérer la piste suivante (s'assurer qu'il n'y a qu'un seul écouteur 'ended')
  // Retirer l'ancien écouteur s'il existe
  if (window.globalAudio._currentEndedHandler) {
    window.globalAudio.removeEventListener(
      "ended",
      window.globalAudio._currentEndedHandler,
    );
  }

  // Ajouter le nouvel écouteur et stocker sa référence
  window.globalAudio.addEventListener("ended", endedHandler);
  window.globalAudio._currentEndedHandler = endedHandler;
}

// =========================================
// DÉMARRAGE DE L'APPLICATION
// =========================================

document.addEventListener("DOMContentLoaded", () => {
  parseURL();
});
