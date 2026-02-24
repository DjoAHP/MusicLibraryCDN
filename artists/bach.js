// Jean Sébastien Bach - Discographie
window.addArtist({
  id: "jean-sebastien-bach",
  name: "Jean Sébastien Bach",
  genres: ["Classique"], // ← ajouter ceci
  image: "https://mymusiclibrary.github.io/bach/artist.jpg",
  albums: [
    // :::::::::::::::::: ------------ ::::::::::::::::::
    // :::::::::::::::::::: Suite Pour Violoncelle no.1 :::::::::::::::::::::::
    {
      // NOM albums DOIT ETRE EXACTEMENT COMME LE LIEN (projectName)
      id: "suite-pour-violoncelle-no1",
      // NOM ALBUMS
      name: "Suite Pour Violoncelle no.1",
      //   ANNEE
      year: "1974",
      cover:
        //   COVER ALBUM
        "https://mymusiclibrary.github.io/bach/Suite%20Pour%20Violoncelle%20no.1/cover.jpg",
      // URL ALBUM 3D
      cdnPath: "Jean%20Sébastien%20Bach/suite-pour-violoncelle-no1/",
      //   NOM ALBUMS
      projectName: "suite-pour-violoncelle-no1",
      albumSize: "55em",
      albumOffset: "2em",
      tracks: [
        {
          title: "Suite Pour Violoncelle No 1 (Navarra",
          url: "https://mymusiclibrary.github.io/bach/Suite%20Pour%20Violoncelle%20no.1/01%20-%20Suite%20Pour%20Violoncelle%20No%201%20(Navarra).mp3",
        },
      ],
    },
    // :::::::::::::::::: ------------ ::::::::::::::::::
    // :::::::::::::::::::: ALBUM :::::::::::::::::::::::
  ],
});
