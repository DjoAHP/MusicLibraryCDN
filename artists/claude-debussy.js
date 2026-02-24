// Claude Debussy - Discographie
window.addArtist({
  id: "claude-debussy",
  name: "Claude Debussy",
  genres: ["Classique"], // ← ajouter ceci
  image: "https://mymusiclibrary.github.io/claude-debussy/artist.jpg",
  albums: [
    // :::::::::::::::::: ------------ ::::::::::::::::::
    // :::::::::::::::::::: Suite Bergamasque :::::::::::::::::::::::
    {
      // NOM albums DOIT ETRE EXACTEMENT COMME LE LIEN (projectName)
      id: "suite-bergamasque",
      // NOM ALBUMS
      name: "Suite Bergamasque",
      //   ANNEE
      year: "1890",
      cover:
        //   COVER ALBUM
        "https://mymusiclibrary.github.io/claude-debussy/Suite%20Bergamasque/cover.jpg",
      // URL ALBUM 3D
      cdnPath: "Claude%20Debussy/suite-bergamasque/",
      //   NOM ALBUMS
      projectName: "suite-bergamasque",
      albumSize: "55em",
      albumOffset: "2em",
      tracks: [
        {
          title: "Prélude",
          url: "https://mymusiclibrary.github.io/claude-debussy/Suite%20Bergamasque/01%20-%20Prélude.mp3",
        },
        {
          title: "Menuet",
          url: "https://mymusiclibrary.github.io/claude-debussy/Suite%20Bergamasque/02%20-%20Menuet.mp3",
        },
        {
          title: "Clair de Lune",
          url: "https://mymusiclibrary.github.io/claude-debussy/Suite%20Bergamasque/03%20-%20Clair%20de%20Lune.mp3",
        },
        {
          title: "Passepied",
          url: "https://mymusiclibrary.github.io/claude-debussy/Suite%20Bergamasque/04%20-%20Passepied.mp3",
        },
      ],
    },
    // :::::::::::::::::: ------------ ::::::::::::::::::
    // :::::::::::::::::::: ALBUM :::::::::::::::::::::::
  ],
});
