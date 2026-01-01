const result = document.getElementById("result");
const filter = document.getElementById("filter");
const usersList = [];

// Static offline users (for portfolio/demo without API)
const staticUsers = [
  { name: "Alice Johnson", city: "New York", country: "USA", avatar: "https://randomuser.me/api/portraits/women/1.jpg" },
  { name: "Bob Smith", city: "London", country: "UK", avatar: "https://randomuser.me/api/portraits/men/2.jpg" },
  { name: "Clara Lee", city: "Sydney", country: "Australia", avatar: "https://randomuser.me/api/portraits/women/3.jpg" },
  { name: "David Kim", city: "Seoul", country: "South Korea", avatar: "https://randomuser.me/api/portraits/men/4.jpg" },
  { name: "Eva Martinez", city: "Madrid", country: "Spain", avatar: "https://randomuser.me/api/portraits/women/5.jpg" }
];

// Display users in the list
function displayUsers(users) {
  result.innerHTML = "";
  users.forEach(user => {
    const li = document.createElement("li");
    li.innerHTML = `
      <img src="${user.avatar}" alt="${user.name}" />
      <div class="user-info">
        <h4>${user.name}</h4>
        <p>${user.city}, ${user.country}</p>
      </div>
    `;
    usersList.push(li);
    result.appendChild(li);
  });
}

// Show "No users found" message
function showNoResult() {
  const li = document.createElement("li");
  li.classList.add("no-result");
  li.textContent = "No users found";
  result.appendChild(li);
}

// Filter users live
function filterUsers(searchTerm) {
  let hasVisible = false;
  usersList.forEach(userLi => {
    const text = userLi.innerText.toLowerCase();
    const isVisible = text.includes(searchTerm.toLowerCase());
    userLi.classList.toggle("hide", !isVisible);
    if (isVisible) hasVisible = true;
  });

  if (!hasVisible) showNoResult();
}

// Load users from API (optional online version)
async function loadUsersFromAPI() {
  try {
    const res = await fetch("https://randomuser.me/api/?results=50");
    if (!res.ok) throw new Error("Failed to fetch users");
    const data = await res.json();
    const apiUsers = data.results.map(u => ({
      name: `${u.name.first} ${u.name.last}`,
      city: u.location.city,
      country: u.location.country,
      avatar: u.picture.large
    }));
    result.innerHTML = "";
    displayUsers(apiUsers);
  } catch (err) {
    console.error(err);
    result.innerHTML = "<li class='no-result'>Could not load API users. Using static users.</li>";
    displayUsers(staticUsers);
  }
}

// Initialize
window.addEventListener("DOMContentLoaded", () => {
  // Display static users first (offline-friendly)
  displayUsers(staticUsers);

  // Optional: load API users if internet is available
  loadUsersFromAPI();
});

// Live search input
filter.addEventListener("input", e => filterUsers(e.target.value));
