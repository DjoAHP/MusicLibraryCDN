// Mozart - Discographie
window.addArtist({
  id: "mozart",
  name: "Mozart",
  genres: ["Classique"],
  image: "https://mymusiclibrary.github.io/mozart/artist.jpg",
  albums: [
    // :::::::::::::::::: ------------ ::::::::::::::::::
    // :::::::::::::::::::: Don Giovanni :::::::::::::::::::::::
    {
      // NOM albums DOIT ETRE EXACTEMENT COMME LE LIEN (projectName)
      id: "don-giovanni",
      // NOM ALBUMS
      name: "Don Giovanni",
      //   ANNEE
      year: "1787",
      cover:
        //   COVER ALBUM
        "https://mymusiclibrary.github.io/mozart/Don%20Giovanni/cover.jpg",
      // URL ALBUM 3D
      cdnPath: "Mozart/don-giovanni/",
      //   NOM ALBUMS
      projectName: "don-giovanni",
      albumSize: "55em",
      albumOffset: "2em",
      tracks: [
        {
          title: "Overture & Act I (Part 1)",
          url: "https://mymusiclibrary.github.io/mozart/Don%20Giovanni/01.%20Overture%20%26%20Act%20I%20%28Part%201%29.mp3",
        },
        {
          title: "Act I (Part 2)",
          url: "https://mymusiclibrary.github.io/mozart/Don%20Giovanni/02.%20Act%20I%20%28Part%202%29.mp3",
        },
        {
          title: "Act I (Part 3)",
          url: "https://mymusiclibrary.github.io/mozart/Don%20Giovanni/03.%20Act%20I%20%28Part%203%29.mp3",
        },
        {
          title: "Act I (Conclusion)",
          url: "https://mymusiclibrary.github.io/mozart/Don%20Giovanni/05.%20Act%20I%20%28Conclusion%29.mp3",
        },
        {
          title: "Act II (Part 1)",
          url: "https://mymusiclibrary.github.io/mozart/Don%20Giovanni/06.%20Act%20II%20%28Part%201%29.mp3",
        },
        {
          title: "Act II (Part 2)",
          url: "https://mymusiclibrary.github.io/mozart/Don%20Giovanni/07.%20Act%20II%20%28Part%202%29.mp3",
        },
        {
          title: "Act II (Part 3)",
          url: "https://mymusiclibrary.github.io/mozart/Don%20Giovanni/08.%20Act%20II%20%28Part%203%29.mp3",
        },
        {
          title: "Act II (Conclusion)",
          url: "https://mymusiclibrary.github.io/mozart/Don%20Giovanni/09.%20Act%20II%20%28Conclusion%29.mp3",
        },
      ],
    },
    // :::::::::::::::::: ------------ ::::::::::::::::::
    // :::::::::::::::::::: ALBUM :::::::::::::::::::::::
  ],
});
