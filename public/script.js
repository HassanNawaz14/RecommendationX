let currentPage = 1; // Start from page 1
const API_KEY = 'c23620ab85823d1ee2c4f18c55fa38f7';
let allMovies = [];
let userRatings = {}; // { movieId: rating }

//Fetch and display movies
async function fetchAndDisplayMovies(page = 1) {
  const res = await fetch(`/api/movies?page=${page}`);
  const data = await res.json();

  // Append new movies instead of replacing
  allMovies = allMovies.concat(data.results);

  const container = document.getElementById("movie-list");

  data.results.forEach(movie => {
    const card = document.createElement("div");
    card.className = "movie";

    const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(movie.title + " movie")}`;

    card.innerHTML = `
      <a href="${googleSearchUrl}" target="_blank">
        <img src="https://image.tmdb.org/t/p/w200${movie.poster_path}" />
      </a><br>
      <strong class="movie-title" title="${movie.title}">${movie.title}</strong><br>
      <input type="number" min="0" max="5" value="0" data-id="${movie.id}" onchange="storeRating(event)">
    `;

    container.appendChild(card);
  });
}


function storeRating(event) {
    const id = event.target.getAttribute("data-id");
    let value = parseInt(event.target.value);

    if (isNaN(value) || value < 1 || value > 5) {
        value = 0;
        event.target.value = 0; // update UI too
    }

    userRatings[id] = value;
}

//Read ratings.json
async function getRatingsData() {
  const response = await fetch("/ratings.json");
  const data = await response.json();
  return data.users;
}

//Build matrix (2D)
async function buildRatingMatrix(movieIds) {
  const users = await getRatingsData();
  let matrix = [];
  for (let user of users) {
    let row = [];
    for (let id of movieIds) {
      row.push(user.ratings[id] || 0);
    }
    matrix.push(row);
  }
  return matrix;
}

//Cosine similarity Algo:
function cosineSimilarity(userVec, otherVec) {
    let dot = 0, magA = 0, magB = 0;
    for (let i = 0; i < userVec.length; i++) {
        dot += userVec[i] * otherVec[i];
        magA += userVec[i] * userVec[i];
        magB += otherVec[i] * otherVec[i];
    }
    if (magA === 0 || magB === 0) return 0; // avoid NaN for zero vectors
    return dot / (Math.sqrt(magA) * Math.sqrt(magB));
}


//Generate Recommendations
function getRecommendations(matrix, currentVec, movieIds) {
  let similarities = matrix.map(otherVec => cosineSimilarity(currentVec, otherVec));

  let scores = new Array(movieIds.length).fill(0);
  let simSums = new Array(movieIds.length).fill(0);

  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < movieIds.length; j++) {
      if (currentVec[j] === 0) {
        scores[j] += matrix[i][j] * similarities[i];
        simSums[j] += similarities[i];
      }
    }
  }

  return movieIds.map((id, idx) => ({
    id: id,
    score: simSums[idx] ? scores[idx] / simSums[idx] : 0
  })).sort((a, b) => b.score - a.score);
}

//Store Ratings and Display recommendations
async function submitRatings() {
    await saveNewUserRatings();
    const movieIds = allMovies.map(m => m.id);
    const userVec = movieIds.map(id => userRatings[id] || 0);
    const matrix = await buildRatingMatrix(movieIds);
    const recommended = getRecommendations(matrix, userVec, movieIds);

    const container = document.getElementById("recommendations");
    container.innerHTML = "";

    const topRecommendations = recommended
      .filter(rec => (userRatings[rec.id] || 0) === 0 && rec.score > 0)
      .slice(0, 5);

    if (topRecommendations.length === 0) {
      const container = document.getElementById("recommendations");
      container.innerHTML = "<p>No recommendations yet. Please rate more movies!</p>";
      return;
    }

    for (let rec of topRecommendations) {
      const movie = allMovies.find(m => m.id === rec.id);
      const div = document.createElement("div");
      div.classList.add("movie");
      div.innerHTML = `
          <img src="https://image.tmdb.org/t/p/w200${movie.poster_path}" />
          <br><strong class="movie-title">${movie.title}</strong>
          <br>Score: ${rec.score.toFixed(2)}
      `;
      container.appendChild(div);
    }
}

async function saveNewUserRatings() {
  const username = prompt("Enter your username:");
  const payload = {
    username: username || "anonymous_" + Date.now(),
    ratings: userRatings
  };

  const res = await fetch('/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  const result = await res.json();
  if (result.success) {
    alert("Ratings submitted and saved!");
  }
}

document.getElementById("load-more").addEventListener("click", () => {
  currentPage++;
  fetchAndDisplayMovies(currentPage);
});

window.onload = () => {
  fetchAndDisplayMovies(currentPage);
};


document.getElementById("main-heading").addEventListener("click", () =>{
  location.reload();
})
