function showLoader() {
  document.getElementById("loader").style.display = "block";
  document.getElementById("results").style.display = "none";
}

function hideLoader() {
  document.getElementById("loader").style.display = "none";
  // Clear any inline display style so the CSS grid (#results) can take effect
  document.getElementById("results").style.display = "";
}


const BASE_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:5000"
    : "https://movie-backend-oyrj.onrender.com";

let currentUser = JSON.parse(localStorage.getItem("user"));


                            // Search Movie

async function searchMovie() {
  const input = document.getElementById("searchInput").value;
  const resultsDiv = document.getElementById("results");

  if (!input || input.trim() === "") {
    resultsDiv.innerHTML = "<p>⚠️ Please enter a movie name</p>";
    return;
  }

  showLoader();

  const url = `${BASE_URL}/search?q=${input}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    let html = "";

    if (data.Search) {
      data.Search.forEach(movie => {
        html += `
        <div class="card">
          <img 
            src="${movie.Poster}" 
            width="100"
            onerror="this.onerror=null; this.src='fallback.jpg'"
          >
          <h3>${movie.Title}</h3>
          <p>${movie.Year}</p>

          <button onclick='addToFavorites(${JSON.stringify(movie)}, this)'>
            ❤️ Add
          </button>
        </div>
        `;
      });
    } else {
      html = "<p>😕 No movies found. Try something else.</p>";
    }

    resultsDiv.innerHTML = html;
    hideLoader();

  } catch (error) {
    hideLoader();
    resultsDiv.innerHTML = "<p>Something went wrong</p>";
    console.error(error);
  }
}
async function getMovieDetails(id) {
  const resultsDiv = document.getElementById("results");

  resultsDiv.innerHTML = "<p>Loading details...</p>";

  const apiKey = "b13ed654";
  const url = `${BASE_URL}/movie/${id}`;

  try {
    const response = await fetch(url);
    const movie = await response.json();

    resultsDiv.innerHTML = `
      <div class="card" style="width: 300px">
        <img 
          src="${movie.Poster}" 
          width="200"
          onerror="this.src='https://via.placeholder.com/200'"
        >
        <h2>${movie.Title}</h2>
        <p><strong>Year:</strong> ${movie.Year}</p>
        <p><strong>Genre:</strong> ${movie.Genre}</p>
        <p><strong>IMDB Rating:</strong> ${movie.imdbRating}</p>
        <p><strong>Plot:</strong> ${movie.Plot}</p>

        <button onclick="goBack()">⬅ Back</button>
      </div>
    `;
  } catch (error) {
    resultsDiv.innerHTML = "<p>Error loading details</p>";
  }
}
function goBack() {
  document.getElementById("results").innerHTML = "<p>Search again</p>";
}


                            // Add to Favorites



async function addToFavorites(movie, button) {
  if (!currentUser) {
    alert("Please login first");
    return;
  }

  const res = await fetch(`${BASE_URL}/addFavorite`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      movie: movie,
      userId: currentUser._id
    })
  });

  const data = await res.json();

  alert(data.message);

  // 👇 UI update
  if (data.message === "Added to favorites") {
  button.innerText = "✅ Added";
  button.disabled = true;
}
}

                            // Show Favorites

async function showFavorites() {
 
  if (!currentUser) {
    alert("Please login first");
    return;
  }
   
  showLoader();
  const resultsDiv = document.getElementById("results");

  const response = await fetch(
    `${BASE_URL}/favorites?userId=${currentUser._id}`
  );

  const favorites = await response.json();

  let html = "";

  if (favorites.length === 0) {
    html = "<p>No favorites yet</p>";
  } else {
    favorites.forEach(movie => {
      const poster = movie.Poster !== "N/A" ? movie.Poster : "fallback.jpg";

      html += `
        <div class="card">
          <img src="${poster}" width="100">
          <h3>${movie.Title}</h3>
          <p>${movie.Year}</p>

          <button onclick="removeFromFavorites('${movie.imdbID}')">
            ❌ Remove
          </button>
        </div>
      `;
    });
  }

  resultsDiv.innerHTML = html;
  hideLoader();
}

                // Remove from Favorites

async function removeFromFavorites(id) {
  await fetch(`${BASE_URL}/removeFavorite/${id}`);

  showFavorites();
}
                 // Update Favorites Count

function updateFavCount() {
  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

  document.getElementById("favCount").innerText =
    "Favorites: " + favorites.length;
}                 


async function signup() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const res = await fetch(`${BASE_URL}/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ username, password })
  });

  const data = await res.json();
  alert(data.message);
}

async function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const res = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ username, password })
  });

  const data = await res.json();

  if (data.user) {
  currentUser = data.user;
  localStorage.setItem("user", JSON.stringify(data.user));

  document.getElementById("authSection").style.display = "none";
  document.getElementById("userSection").style.display = "block";

  document.getElementById("welcomeText").innerText =
    "Welcome, " + data.user.username;

  alert("Logged in!");
} else {
  alert(data.message);
}
}

//CHECK LOGIN ON PAGE LOAD

function checkLogin() {
  if (currentUser) {
    document.getElementById("authSection").style.display = "none";
    document.getElementById("userSection").style.display = "block";

    document.getElementById("welcomeText").innerText =
      "Welcome, " + currentUser.username;
  }
}

checkLogin();

//LOGOUT

function logout() {
  localStorage.removeItem("user");
  currentUser = null;

  document.getElementById("authSection").style.display = "block";
  document.getElementById("userSection").style.display = "none";

  alert("Logged out");
}