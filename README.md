## Region js:

// #region BOB MARLEY
......CODE.......
// #endregion

## Guide

🎵 Guide de Dépannage - Lecteur Musical
✅ Structure des fichiers CORRECTE
Tous les fichiers doivent être À LA RACINE :
votre-projet/
├── index.html
├── artist.html
├── player.html
├── library.css
├── library.js
├── player.css
├── player.js
├── global-player.css
├── global-player.js
├── music-data.js
├── favicon.jpg
└── artists/
    ├── bob-marley.js
    ├── buena-vista-social-club.js
    └── ...
❌ ERREURS COURANTES
1. Fichiers dans des dossiers css/ ou js/
Si vos fichiers sont dans css/player.css ou js/player.js, déplacez-les à la racine !
2. Albums 3D ne s'affichent pas
Vérifiez que votre CDN est à jour : @1.1.15 ou plus récent dans player.js
3. Musique se coupe en naviguant
✅ Corrigé ! Le localStorage sauvegarde maintenant l'état isPlaying et reprend automatiquement
🎯 COMMENT ÇA MARCHE
Page player.html :

Cliquez sur un titre → Lance la musique dans le lecteur global
Le mini lecteur apparaît en bas

Navigation :

Retournez aux albums/artistes
La musique continue (localStorage + auto-play)
Le mini lecteur reste visible en bas

Mini lecteur global :

⏯️ Play/Pause
📊 Barre de progression (cliquez pour naviguer)
⏱️ Temps actuel / Durée
💾 Sauvegarde automatique

🔧 SI ÇA NE MARCHE PAS
Problème : Albums 3D pas visibles
Solution : Vérifiez dans music-data.js que vous avez :
javascriptcdnPath: "Bob%20Marley/exodus",
projectName: "exodus",
Problème : Musique se coupe
Solution :

Ouvrez la console (F12)
Si vous voyez "Auto-play bloqué", cliquez manuellement sur Play
Après, ça marchera automatiquement

Problème : Pas de son
Solution : Vérifiez que les URLs des MP3 sont correctes dans artists/bob-marley.js
📝 CHECKLIST

 Tous les fichiers à la racine (pas dans css/ ou js/)
 global-player.js chargé dans TOUTES les pages HTML
 CDN version @1.1.15 minimum
 localStorage activé dans le navigateur
 URLs des MP3 correctes

🎨 AMÉLIORATION DU MINI LECTEUR
Le mini lecteur est maintenant :

✅ Plus grand (90px de haut)
✅ Barre de progression visible
✅ Temps affiché
✅ Bouton play/pause sur la droite
✅ Titre et artiste centrés

Si vous voulez le personnaliser, modifiez global-player.css !
