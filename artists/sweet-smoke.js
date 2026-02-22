// Sweet Smoke - Discographie
window.addArtist({
  id: "sweet-smoke",
  name: "Sweet Smoke",
  genres: ["Psychedelic Rock"], // ← ajouter ceci
  image: "https://mymusiclibrary.github.io/sweet-smoke/artist.jpg",
  albums: [
    // :::::::::::::::::: ------------ ::::::::::::::::::
    // :::::::::::::::::::: Just A Poke :::::::::::::::::::::::
    {
      // NOM albums DOIT ETRE EXACTEMENT COMME LE LIEN (projectName)
      id: "just-a-poke",
      // NOM ALBUMS
      name: "Just A Poke",
      //   ANNEE
      year: "1970",
      cover:
        //   COVER ALBUM
        "https://mymusiclibrary.github.io/sweet-smoke/1970%20-%20Just%20A%20Poke/cover.jpg",
      // URL ALBUM 3D
      cdnPath: "Sweet%20Smoke/just-a-poke/",
      //   NOM ALBUMS
      projectName: "just-a-poke",
      albumSize: "55em",
      albumOffset: "2em",
      tracks: [
        {
          title: "Baby Night (side I)",
          url: "https://mymusiclibrary.github.io/sweet-smoke/1970%20-%20Just%20A%20Poke/01%20-%20Baby%20Night%20%28side%20I%29.mp3",
        },
        {
          title: "Silly Sally (side II)",
          url: "https://mymusiclibrary.github.io/sweet-smoke/1970%20-%20Just%20A%20Poke/02%20-%20Silly%20Sally%20%28side%20II%29.mp3",
        },
        {
          title: "Darkness To Light",
          url: "https://mymusiclibrary.github.io/sweet-smoke/1970%20-%20Just%20A%20Poke/03%20-%20Darkness%20To%20Light.mp3",
        },
        {
          title: "Just Another Empty Dream",
          url: "https://mymusiclibrary.github.io/sweet-smoke/1970%20-%20Just%20A%20Poke/04%20-%20Just%20Another%20Empty%20Dream.mp3",
        },
        {
          title: "People Are Hard",
          url: "https://mymusiclibrary.github.io/sweet-smoke/1970%20-%20Just%20A%20Poke/05%20-%20People%20Are%20Hard.mp3",
        },
        {
          title: "Soft Parade",
          url: "https://mymusiclibrary.github.io/sweet-smoke/1970%20-%20Just%20A%20Poke/06%20-%20Soft%20Parade.mp3",
        },
      ],
    },
    // :::::::::::::::::: ------------ ::::::::::::::::::
    // :::::::::::::::::::: ALBUM :::::::::::::::::::::::
  ],
});
