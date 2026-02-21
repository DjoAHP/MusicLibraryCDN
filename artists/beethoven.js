// Beethoven - Discographie
window.addArtist({
  id: "beethoven",
  name: "Beethoven",
  image: "https://mymusiclibrary.github.io/beethoven/artist.jpg",
  albums: [
    // :::::::::::::::::: ------------ ::::::::::::::::::
    // :::::::::::::::::::: Symphony :::::::::::::::::::::::
    {
      // NOM albums DOIT ETRE EXACTEMENT COMME LE LIEN (projectName)
      id: "symphony",
      // NOM ALBUMS
      name: "Symphony",
      //   ANNEE
      year: "1812",
      cover:
        //   COVER ALBUM
        "https://mymusiclibrary.github.io/beethoven/1812%20-%20Symphony/cover.jpg",
      // URL ALBUM 3D
      cdnPath: "Beethoven/symphony/",
      //   NOM ALBUMS
      projectName: "symphony",
      albumSize: "55em",
      albumOffset: "2em",
      tracks: [
        {
          title: "Symphony no.7 - II",
          url: "https://mymusiclibrary.github.io/beethoven/1812%20-%20Symphony/01%20-%20Symphony%20no.7%20-%20II.mp3",
        },
      ],
    },
    // :::::::::::::::::: ------------ ::::::::::::::::::
    // :::::::::::::::::::: ALBUM :::::::::::::::::::::::
  ],
});
