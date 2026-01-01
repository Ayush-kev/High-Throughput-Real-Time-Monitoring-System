const userList = document.getElementById("user-list");
const filterInput = document.getElementById("filter");

let users = [];

// Fetch users from API
async function fetchUsers() {
  userList.innerHTML = "<li><h3>Loading users...</h3></li>";
  try {
    const res = await fetch("https://randomuser.me/api/?results=50");
    const data = await res.json();
    users = data.results;
    renderUsers(users);
  } catch (err) {
    userList.innerHTML = "<li><h3>Failed to load users.</h3></li>";
    console.error(err);
  }
}

// Render users in DOM
function renderUsers(list) {
  userList.innerHTML = "";
  list.forEach(user => {
    const li = document.createElement("li");
    li.innerHTML = `
      <img src="${user.picture.medium}" alt="${user.name.first}" />
      <div class="user-info">
        <h4>${user.name.first} ${user.name.last}</h4>
        <p>${user.location.city}, ${user.location.country}</p>
      </div>
    `;
    userList.appendChild(li);
  });
}

// Filter users live
filterInput.addEventListener("input", e => {
  const term = e.target.value.toLowerCase();
  const filtered = users.filter(user => 
    (`${user.name.first} ${user.name.last}`.toLowerCase().includes(term)) ||
    (user.location.city.toLowerCase().includes(term)) ||
    (user.location.country.toLowerCase().includes(term))
  );
  renderUsers(filtered);
});

// Initialize
fetchUsers();

