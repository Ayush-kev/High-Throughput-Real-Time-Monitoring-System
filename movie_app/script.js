const main = document.getElementById("main");
const form = document.getElementById("form");
const search = document.getElementById("search");

/* ---------------- MOCK DATA ---------------- */

const mockMovies = [
  {
    title: "Inception",
    poster_path: "https://image.tmdb.org/t/p/w500/edv5CZvWj09upOsy2Y6IwDhK8bt.jpg",
    vote_average: 8.8,
    overview:
      "A skilled thief is offered a chance to erase his criminal past by infiltrating people's dreams."
  },
  {
    title: "Interstellar",
    poster_path: "https://image.tmdb.org/t/p/w500/rAiYTfKGqDCRIIqo664sY9XZIvQ.jpg",
    vote_average: 8.6,
    overview:
      "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival."
  },
  {
    title: "The Dark Knight",
    poster_path: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    vote_average: 9.0,
    overview:
      "Batman faces the Joker, a criminal mastermind who plunges Gotham City into chaos."
  },
  {
    title: "Parasite",
    poster_path: "https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg",
    vote_average: 8.5,
    overview:
      "A poor family schemes to become employed by a wealthy household by infiltrating their lives."
  }
];

/* ---------------- HELPERS ---------------- */

const getClassByRate = (vote) => {
  if (vote >= 8) return "green";
  if (vote >= 7) return "orange";
  return "red";
};

const showMovies = (movies) => {
  main.innerHTML = "";

  movies.forEach((movie) => {
    const { title, poster_path, vote_average, overview } = movie;

    const movieEl = document.createElement("div");
    movieEl.classList.add("movie");

    movieEl.innerHTML = `
      <img src="${poster_path}" alt="${title}" />
      <div class="movie-info">
        <h3>${title}</h3>
        <span class="${getClassByRate(vote_average)}">${vote_average}</span>
      </div>
      <div class="overview">
        <h3>Overview</h3>
        <p>${overview}</p>
      </div>
    `;

    main.appendChild(movieEl);
  });
};

/* ---------------- INIT ---------------- */

main.innerHTML = "<p style='color:white'>Loading movies...</p>";

setTimeout(() => {
  showMovies(mockMovies);
}, 600);

/* ---------------- SEARCH ---------------- */

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const term = search.value.toLowerCase();

  const filtered = mockMovies.filter((movie) =>
    movie.title.toLowerCase().includes(term)
  );

  showMovies(filtered);
});


