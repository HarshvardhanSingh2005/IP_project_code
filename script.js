// script.js
const STORAGE_KEY = 'movieRatingsSystemData';


const movies = [
    { title: "Inception", ratings: [], favorite: false },
    { title: "Parasite", ratings: [], favorite: false },
    { title: "Interstellar", ratings: [], favorite: false },
    { title: "The Godfather", ratings: [], favorite: false },
];

function saveData() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(movies));
}

function loadData() {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
        try {
            const loaded = JSON.parse(data);
            loaded.forEach((movie, idx) => {
                if (movies[idx]) {
                    movies[idx].ratings = movie.ratings || [];
                    movies[idx].favorite = !!movie.favorite;
                } else {
                    movies.push({
                        title: movie.title || `Movie ${loaded.length}`,
                        ratings: movie.ratings || [],
                        favorite: !!movie.favorite,
                    });
                }
            });
        } catch (e) {
            console.error('Error parsing localStorage data:', e);
        }
    }
}

function renderMovies() {
    const movieList = document.getElementById('movie-list');
    const showFav = document.getElementById('show-favorites').checked;
    movieList.innerHTML = '';

    movies.forEach((movie, idx) => {
        if (showFav && !movie.favorite) return;

        const avgRating = movie.ratings.length
            ? (movie.ratings.reduce((a, b) => a + b, 0) / movie.ratings.length).toFixed(1)
            : "No ratings";

        const row = document.createElement('div');
        row.className = 'movie-row';

        const detailsDiv = document.createElement('div');
        detailsDiv.className = 'movie-details';

        const title = document.createElement('span');
        title.className = 'movie-title';
        title.textContent = movie.title;

        const starsDiv = document.createElement('div');
        starsDiv.className = 'stars';
        for (let i = 1; i <= 5; i++) {
            const star = document.createElement('span');
            star.className = 'star' + (avgRating >= i ? ' selected' : '');
            star.textContent = '★';
            star.onclick = () => rateMovie(idx, i);
            starsDiv.appendChild(star);
        }

        detailsDiv.appendChild(title);
        detailsDiv.appendChild(starsDiv);

        row.appendChild(detailsDiv);

        const info = document.createElement('span');
        info.className = 'rating-info';
        info.textContent = `Avg: ${avgRating}` + (movie.ratings.length ? ` (${movie.ratings.length})` : '');

        row.appendChild(info);

        const favIcon = document.createElement('span');
        favIcon.className = 'fav-icon' + (movie.favorite ? ' favorited' : '');
        favIcon.textContent = movie.favorite ? '♥' : '♡';
        favIcon.onclick = () => toggleFavorite(idx);
        row.appendChild(favIcon);

        movieList.appendChild(row);
    });
}

function rateMovie(idx, rating) {
    movies[idx].ratings.push(rating);
    saveData();
    renderMovies();
}

function toggleFavorite(idx) {
    movies[idx].favorite = !movies[idx].favorite;
    saveData();
    renderMovies();
}

document.getElementById('add-movie-form').onsubmit = e => {
    e.preventDefault();
    const titleInput = document.getElementById('movie-title');
    const newTitle = titleInput.value.trim();
    if (newTitle) {
        movies.push({ title: newTitle, ratings: [], favorite: false });
        saveData();
        titleInput.value = '';
        renderMovies();
    }
}

document.getElementById('show-favorites').onchange = () => {
    renderMovies();
}

// Load saved data first, then render
loadData();
renderMovies();
const DARK_MODE_KEY = 'movieRatingsDarkMode';
const darkModeToggle = document.getElementById('toggle-dark-mode');

function applyDarkMode(isDark) {
    if (isDark) {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
    }
    localStorage.setItem(DARK_MODE_KEY, JSON.stringify(isDark));
}

// Load saved theme preference on page load
const savedDarkMode = JSON.parse(localStorage.getItem(DARK_MODE_KEY));
if (savedDarkMode) {
    applyDarkMode(true);
    darkModeToggle.checked = true;
} else {
    applyDarkMode(false);
    darkModeToggle.checked = false;
}

// Toggle event listener
darkModeToggle.addEventListener('change', () => {
    applyDarkMode(darkModeToggle.checked);
});
