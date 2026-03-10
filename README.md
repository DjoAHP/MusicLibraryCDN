# 🎵 MusicLibrary

Une application web **Single Page** pour naviguer et écouter ta bibliothèque musicale personnelle, avec rendu d'albums en **3D**, lecteur audio persistant et support de l'écran de verrouillage mobile.

---

## Fonctionnalités

- **Navigation 3 niveaux** : Artistes → Albums → Lecteur
- **Rendu album 3D** via CDN (images WebP/JPG avec effet parallaxe)
- **Lecteur audio global persistant** : continue la lecture en changeant de vue
- **Playlist automatique** : passage à la piste suivante en fin de morceau
- **Reprise de lecture** : la piste en cours est sauvegardée et restaurée au rechargement
- **Media Session API** : contrôles sur l'écran de verrouillage (pochette, prev/next/play)
- **Recherche & filtre par genre** sur la vue Artistes
- **Responsive mobile** : mise en page adaptée téléphone avec mini-player fixe en bas
- **Lien "Mes Vinyles"** vers une collection externe (vinylstack.base44.app)

---

## Structure des fichiers

```
├── index.html              # Point d'entrée, charge tous les scripts
├── app.js                  # Routeur SPA + rendu des 3 vues + initialisation player
├── music-data.js           # Bibliothèque musicale + fonction window.addArtist()
├── global-player.js        # Lecteur audio global, mini-player, Media Session API
├── styles.css              # Styles principaux + responsive
├── global-player.css       # Styles du mini-player + responsive mobile
├── search-style.css        # Styles barre de recherche et filtre genre
└── artists/
    ├── the-beatles.js
    ├── pink-floyd.js
    └── ...                 # Un fichier JS par artiste
```

---

## Ajouter un artiste

Crée un fichier dans le dossier `artists/` en suivant ce modèle :

```javascript
window.addArtist({
  id: "nom-artiste",           // identifiant unique, sans espaces
  name: "Nom Artiste",
  image: "https://...",        // photo de l'artiste
  genres: ["Rock", "Blues"],   // apparaît dans le filtre genre
  albums: [
    {
      id: "nom-album",
      name: "Nom de l'Album",
      year: 1973,
      cover: "https://...",    // pochette de l'album
      cdnPath: "dossier-cdn",  // dossier sur le CDN jsdelivr
      projectName: "id-projet",// préfixe des layers 3D
      tracks: [
        { title: "Titre de la piste", url: "https://url-audio.mp3" },
        // ...
      ]
    }
  ]
});
```

Puis ajoute la ligne correspondante dans `index.html` :

```html
<script src="artists/nom-artiste.js"></script>
```

---

## Album 3D

Chaque album utilise deux layers d'image hébergées sur jsDelivr :

```
https://cdn.jsdelivr.net/gh/DjoAHP/cdn-ressources-albums@v1.1.57/images/{cdnPath}/{id}.webp
```

Les layers sont déclarées dans `renderPlayerView()` via deux `<div>` imbriqués :

```html
<div id="{projectName}-background">0</div>   <!-- profondeur 0em -->
<div id="{projectName}-1plan">10</div>        <!-- profondeur 10em -->
```

Le nombre dans le `<div>` représente la profondeur en `em`. Cliquer sur l'album aplatit / restaure l'effet 3D.

---

## Lecteur audio

### Fonctionnement global

- Un seul objet `window.globalAudio` (Audio HTML5) partagé entre toutes les vues
- `window.playGlobalTrack(url, titre, artiste, album, pochette, artistId, albumId)` lance la lecture
- `window.globalPlayerNav.prev` / `.next` sont des fonctions injectées par `setupMusicPlayer()` pour la navigation entre pistes

### Persistance

La piste en cours est sauvegardée dans `localStorage` (clé `currentTrack`) avec :

| Clé | Contenu |
|-----|---------|
| `url` | URL du fichier audio |
| `title` | Titre de la piste |
| `artist` | Nom de l'artiste |
| `album` | Nom de l'album |
| `cover` | URL de la pochette |
| `artistId` / `albumId` | Pour reconstruire le lien vers l'album |
| `time` | Position en secondes |
| `isPlaying` | Booléen |

### Media Session API

Active automatiquement les contrôles système (lock screen, écouteurs, Bluetooth) :
- Pochette + titre + artiste affichés sur l'écran de verrouillage
- Boutons ⏮ ⏸/▶ ⏭ fonctionnels depuis le lock screen
- Barre de progression synchronisée

---

## Navigation (Routeur SPA)

L'application utilise les hash URLs sans rechargement de page :

| URL | Vue |
|-----|-----|
| `#/` | Grille des artistes |
| `#/artist/{artistId}` | Albums de l'artiste |
| `#/player/{artistId}/{albumId}` | Lecteur de l'album |

Le bouton Retour du navigateur est supporté via l'événement `popstate`.

---

## Responsive

| Breakpoint | Comportement |
|------------|--------------|
| > 1200px | Layout desktop : album 3D à gauche, playlist à droite |
| ≤ 1200px | Layout colonne : album en haut, playlist en dessous |
| ≤ 768px | Mobile : album 3D miniature (100px) + infos sur la même ligne, playlist scrollable sur toute la hauteur restante, mini-player 2 lignes fixé en bas |

> Pour ajuster la hauteur de la playlist sur mobile, modifie dans `styles.css` (media `max-width: 768px`) :
> ```css
> .page {
>     height: calc(100dvh - 190px) !important;  /* ← cette valeur */
> }
> ```

---

## CDN utilisé

Les ressources des albums sont hébergées sur GitHub via jsDelivr :

```
https://cdn.jsdelivr.net/gh/DjoAHP/cdn-ressources-albums@v1.1.57/images/
```

Pour mettre à jour les ressources, publie une nouvelle release sur le dépôt GitHub et mets à jour le tag de version dans `app.js` (constante `BASE_URL`).