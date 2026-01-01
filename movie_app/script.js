/* =====================
   ELEMENTS
===================== */
const movieGrid = document.getElementById("movie-grid");
const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const statusEl = document.getElementById("status");

/* =====================
   MOCK DATA
===================== */
const mockMovies = [
  {
    title: "Inception",
    poster_path: "https://image.tmdb.org/t/p/w500/edv5CZvWj09upOsy2Y6IwDhK8bt.jpg",
    vote_average: 8.8,
    overview: "A skilled thief is offered a chance to erase his criminal past by infiltrating people's dreams."
  },
  {
    title: "Interstellar",
    poster_path: "https://image.tmdb.org/t/p/w500/rAiYTfKGqDCRIIqo664sY9XZIvQ.jpg",
    vote_average: 8.6,
    overview: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival."
  },
  {
    title: "The Dark Knight",
    poster_path: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    vote_average: 9.0,
    overview: "Batman faces the Joker, a criminal mastermind who plunges Gotham City into chaos."
  },
  {
    title: "Parasite",
    poster_path: "https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg",
    vote_average: 8.5,
    overview: "A poor family schemes to become employed by a wealthy household by infiltrating their lives."
  }
];

/* =====================
   HELPERS
===================== */
const getClassByRate = (vote) => {
  if (vote >= 8) return "green";
  if (vote >= 7) return "orange";
  return "red";
};

const showStatus = (message, isError = false) => {
  statusEl.textContent = message;
  statusEl.style.color = isError ? "var(--accent-red)" : "var(--text-secondary)";
  statusEl.classList.remove("hidden");
};

/* =====================
   RENDER MOVIES
===================== */
const showMovies = (movies) => {
  movieGrid.innerHTML = "";

  if (!movies.length) {
    showStatus("No movies found.", true);
    return;
  }

  statusEl.classList.add("hidden"); // Hide status when movies exist

  movies.forEach((movie) => {
    const { title, poster_path, vote_average, overview } = movie;

    const movieEl = document.createElement("div");
    movieEl.classList.add("movie-card");

    movieEl.innerHTML = `
      <img src="${poster_path}" alt="${title}" class="movie-poster" />
      <div class="movie-info">
        <h3 class="movie-title">${title}</h3>
        <span class="movie-rating ${getClassByRate(vote_average)}">${vote_average}</span>
      </div>
      <div class="movie-overview">
        <h3>Overview</h3>
        <p>${overview}</p>
      </div>
    `;

    movieGrid.appendChild(movieEl);
  });
};

/* =====================
   INIT
===================== */
showStatus("Loading movies...");
setTimeout(() => showMovies(mockMovies), 600);

/* =====================
   SEARCH
===================== */
searchForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const term = searchInput.value.trim().toLowerCase();

  if (!term) {
    showMovies(mockMovies);
    return;
  }

  const filteredMovies = mockMovies.filter((movie) =>
    movie.title.toLowerCase().includes(term)
  );

  showMovies(filteredMovies);
});



