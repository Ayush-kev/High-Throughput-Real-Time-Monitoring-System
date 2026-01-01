/* =====================
   CONFIG
===================== */
const API_KEY = "3fd2be6f0c70a2a598f084ddfb75487c";
const BASE_URL = "https://api.themoviedb.org/3";
const IMG_BASE_URL = "https://image.tmdb.org/t/p/w500";

/* =====================
   DOM REFERENCES
===================== */
const movieGrid = document.getElementById("movie-grid");
const searchInput = document.getElementById("search-input");
const statusEl = document.getElementById("status");

/* =====================
   APP STATE
===================== */
const state = {
  query: "",
  isLoading: false,
};

/* =====================
   UTILITIES
===================== */
const getRatingClass = (rating) => {
  if (rating >= 7.5) return "green";
  if (rating >= 7) return "orange";
  return "red";
};

const debounce = (fn, delay = 500) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};

/* =====================
   UI HELPERS
===================== */
const showStatus = (message) => {
  statusEl.textContent = message;
  statusEl.classList.remove("hidden");
};

const hideStatus = () => {
  statusEl.classList.add("hidden");
};

const clearMovies = () => {
  movieGrid.innerHTML = "";
};

/* =====================
   API
===================== */
const fetchMovies = async (endpoint) => {
  try {
    state.isLoading = true;
    showStatus("Loading movies...");

    const res = await fetch(`${BASE_URL}${endpoint}&api_key=${API_KEY}`);
    if (!res.ok) throw new Error("Failed to fetch movies");

    const data = await res.json();
    renderMovies(data.results);

    if (!data.results.length) {
      showStatus("No movies found.");
    } else {
      hideStatus();
    }
  } catch (error) {
    showStatus("Something went wrong. Please try again.");
    console.error(error);
  } finally {
    state.isLoading = false;
  }
};

/* =====================
   RENDER
===================== */
const renderMovies = (movies) => {
  clearMovies();

  movies.forEach((movie) => {
    const {
      title,
      poster_path,
      vote_average,
      overview,
    } = movie;

    const card = document.createElement("article");
    card.className = "movie-card";

    const poster = poster_path
      ? `${IMG_BASE_URL}${poster_path}`
      : "https://via.placeholder.com/500x750?text=No+Image";

    card.innerHTML = `
      <img
        src="${poster}"
        alt="${title}"
        class="movie-poster"
        loading="lazy"
      />

      <div class="movie-info">
        <h3 class="movie-title">${title}</h3>
        <span class="movie-rating ${getRatingClass(vote_average)}">
          ${vote_average.toFixed(1)}
        </span>
      </div>

      <div class="movie-overview">
        ${overview || "No description available."}
      </div>
    `;

    movieGrid.appendChild(card);
  });
};

/* =====================
   EVENT HANDLERS
===================== */
const handleSearch = debounce((event) => {
  const query = event.target.value.trim();
  state.query = query;

  if (!query) {
    fetchPopularMovies();
    return;
  }

  fetchMovies(`/search/movie?query=${encodeURIComponent(query)}`);
});

/* =====================
   INIT
===================== */
const fetchPopularMovies = () => {
  fetchMovies("/discover/movie?sort_by=popularity.desc");
};

searchInput.addEventListener("input", handleSearch);
fetchPopularMovies();

