const postsContainer = document.getElementById("posts-container");
const loader = document.getElementById("loader");
const filter = document.getElementById("filter");

const postHeight = 120;
const buffer = 5;

let postsData = [];           // All fetched posts
let renderedPosts = new Map(); // Visible DOM nodes
let scrollTop = 0;

let page = 1;                  // Pagination for API
const limit = 20;
let isLoading = false;
let abortController = null;

// Utility: Capitalize text
function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

// Show loader
function showLoader(show = true) {
  loader.classList.toggle("show", show);
}

// Fetch posts from API with AbortController
async function fetchPosts() {
  if (isLoading) return;
  isLoading = true;

  showLoader(true);

  if (abortController) {
    abortController.abort(); // Cancel previous request
  }
  abortController = new AbortController();
  const signal = abortController.signal;

  try {
    const res = await fetch(
      `https://jsonplaceholder.typicode.com/posts?_limit=${limit}&_page=${page}`,
      { signal }
    );
    const data = await res.json();
    postsData.push(...data);
    page++;
    renderPosts();
  } catch (err) {
    if (err.name !== 'AbortError') {
      console.error("Fetch error:", err);
    }
  } finally {
    showLoader(false);
    isLoading = false;
  }
}

// Render visible posts only (virtual scroll)
function renderPosts() {
  const viewportTop = scrollTop;
  const viewportBottom = viewportTop + window.innerHeight;

  const startIdx = Math.max(0, Math.floor(viewportTop / postHeight) - buffer);
  const endIdx = Math.min(postsData.length - 1, Math.ceil(viewportBottom / postHeight) + buffer);

  const visibleIds = new Set();
  for (let i = startIdx; i <= endIdx; i++) {
    visibleIds.add(postsData[i].id);
    if (!renderedPosts.has(postsData[i].id)) {
      const postEl = document.createElement("div");
      postEl.className = "post";
      postEl.style.top = `${i * postHeight}px`;
      postEl.innerHTML = `
        <div class="number">${postsData[i].id}</div>
        <div class="post-info">
          <h2 class="post-title">${capitalize(postsData[i].title)}</h2>
          <p class="post-body">${capitalize(postsData[i].body)}</p>
        </div>
      `;
      postsContainer.appendChild(postEl);
      renderedPosts.set(postsData[i].id, postEl);
    } else {
      renderedPosts.get(postsData[i].id).style.top = `${i * postHeight}px`;
    }
  }

  // Remove posts outside viewport
  renderedPosts.forEach((el, id) => {
    if (!visibleIds.has(id)) {
      postsContainer.removeChild(el);
      renderedPosts.delete(id);
    }
  });

  postsContainer.style.height = `${postsData.length * postHeight}px`;
}

// Handle scroll with debounce
let scrollTimeout;
window.addEventListener("scroll", () => {
  scrollTop = window.scrollY;
  if (scrollTimeout) clearTimeout(scrollTimeout);
  scrollTimeout = setTimeout(() => {
    renderPosts();

    // Fetch next page if near bottom
    if (window.innerHeight + scrollTop >= postsContainer.scrollHeight - 5) {
      fetchPosts();
    }
  }, 20);
});

// Filter posts live
filter.addEventListener("input", e => {
  const term = e.target.value.toLowerCase();
  renderedPosts.forEach(el => {
    const title = el.querySelector(".post-title").innerText.toLowerCase();
    const body = el.querySelector(".post-body").innerText.toLowerCase();
    el.style.display = title.includes(term) || body.includes(term) ? "flex" : "none";
  });
});

// Initialize
fetchPosts();


