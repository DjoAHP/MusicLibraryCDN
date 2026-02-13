// ============================================
// BIBLIOTHÈQUE MUSICALE
// ============================================
// Pour ajouter un artiste, copiez un bloc existant et modifiez les informations

const musicLibrary = {
  artists: [
    // Les artistes seront chargés depuis des fichiers séparés
  ],
};

// Cette fonction sera appelée par chaque fichier artiste
window.addArtist = function (artistData) {
  musicLibrary.artists.push(artistData);
};

// Rendre la bibliothèque accessible globalement
window.musicLibrary = musicLibrary;
