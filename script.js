let currentUser = JSON.parse(localStorage.getItem("user"));

async function searchMovie() {
  
  const input = document.getElementById("searchInput").value;
  const resultsDiv = document.getElementById("results");

    if (!input) {
  resultsDiv.innerHTML = "<p>Please enter a movie name</p>";
  return;
}
if (input.trim() === "") {
  resultsDiv.innerHTML = "<p>⚠️ Please enter a movie name</p>";
  return;
}

  resultsDiv.innerHTML = "<p>Loading...</p>";

  const apiKey = "b13ed654";
  const url = `https://movie-backend-oyrj.onrender.com/search?q=${input}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    let html = "";

    if (data.Search) {
      data.Search.forEach(movie => {
        // CARD HTML
       html += `

       
  <div class="card">
    <img 
      src="${movie.Poster}" 
      width="100"
      onerror="this.onerror=null; this.src='fallback.jpg'"
    >
    <h3>${movie.Title}</h3>
    <p>${movie.Year}</p>

    <button onclick='addToFavorites(${JSON.stringify(movie)})'>
      ❤️ Add
    </button>
  </div>
`;
      });
    } else {
      html = "<p>😕 No movies found. Try something else.</p>";
    }

    resultsDiv.innerHTML = html;

  } catch (error) {
    resultsDiv.innerHTML = "<p>Something went wrong</p>";
    console.error(error);
  }
}
async function getMovieDetails(id) {
  const resultsDiv = document.getElementById("results");

  resultsDiv.innerHTML = "<p>Loading details...</p>";

  const apiKey = "b13ed654";
  const url = `https://movie-backend-oyrj.onrender.com/movie/${id}`;

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



async function addToFavorites(movie) {
  if (!currentUser) {
    alert("Please login first");
    return;
  }

  await fetch(`${BASE_URL}/addFavorite`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      movie: movie,
      userId: currentUser._id
    })
  });

  alert("Added to favorites!");
}


                            // Show Favorites

async function showFavorites() {
  const resultsDiv = document.getElementById("results");

  const response = await fetch("https://movie-backend-oyrj.onrender.com/favorites");
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
}

                // Remove from Favorites

async function removeFromFavorites(id) {
  await fetch(`https://movie-backend-oyrj.onrender.com/removeFavorite/${id}`);

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

  const res = await fetch("https://movie-backend-oyrj.onrender.com/signup", {
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

  const res = await fetch("https://movie-backend-oyrj.onrender.com/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ username, password })
  });

  const data = await res.json();

if (data.user) {
  currentUser = data.user;

  // 👇 THIS saves user in browser
  localStorage.setItem("user", JSON.stringify(data.user));

  alert("Logged in!");
  } else {
    alert(data.message);
  }
}