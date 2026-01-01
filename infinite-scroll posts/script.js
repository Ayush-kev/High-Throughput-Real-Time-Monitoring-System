const postsContainer = document.getElementById("posts-container");
const loader = document.getElementById("loader");
const filter = document.getElementById("filter");

const totalPosts = 1000; // Simulated high-volume posts
const postHeight = 120; // Approximate height including margin
const buffer = 5; // Number of extra posts rendered above & below viewport

let postsData = []; // Offline dataset
let renderedPosts = new Map(); // Track DOM nodes
let scrollTop = 0;

// Generate offline posts for demo/portfolio
for (let i = 1; i <= totalPosts; i++) {
  postsData.push({
    id: i,
    title: `Post Title ${i}`,
    body: `This is the body content of post number ${i}. It is generated for virtual scroll demo.`
  });
}

// Utility to capitalize
function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

// Render visible posts only
function renderPosts() {
  const containerHeight = postsContainer.clientHeight;
  const viewportTop = scrollTop;
  const viewportBottom = viewportTop + window.innerHeight;

  // Calculate start/end indices
  let startIdx = Math.floor(viewportTop / postHeight) - buffer;
  let endIdx = Math.ceil(viewportBottom / postHeight) + buffer;

  startIdx = Math.max(0, startIdx);
  endIdx = Math.min(postsData.length - 1, endIdx);

  const currentIds = new Set();
  for (let i = startIdx; i <= endIdx; i++) {
    currentIds.add(postsData[i].id);
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
      // Update position in case of resize
      renderedPosts.get(postsData[i].id).style.top = `${i * postHeight}px`;
    }
  }

  // Remove posts outside viewport
  renderedPosts.forEach((el, id) => {
    if (!currentIds.has(id)) {
      postsContainer.removeChild(el);
      renderedPosts.delete(id);
    }
  });

  // Update container height
  postsContainer.style.height = `${postsData.length * postHeight}px`;
}

// Debounce scroll events for performance
let scrollTimeout;
window.addEventListener("scroll", () => {
  scrollTop = window.scrollY;
  if (scrollTimeout) clearTimeout(scrollTimeout);
  scrollTimeout = setTimeout(() => {
    renderPosts();
  }, 20); // 20ms debounce
});

// Filter posts by search term
filter.addEventListener("input", (e) => {
  const term = e.target.value.toLowerCase();
  renderedPosts.forEach((el) => {
    const title = el.querySelector(".post-title").innerText.toLowerCase();
    const body = el.querySelector(".post-body").innerText.toLowerCase();
    if (title.includes(term) || body.includes(term)) {
      el.style.display = "flex";
    } else {
      el.style.display = "none";
    }
  });
});

// Initialize
renderPosts();

