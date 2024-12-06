let currentPage = 1;
let currentSearch = '';
let currentSort = 'score';
let currentType = '';
let currentStatus = '';
let isLoading = false;

// Elements
const animeList = document.querySelector('.anime-list');
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const sortSelect = document.getElementById('sort-select');
const typeSelect = document.getElementById('type-select');
const statusSelect = document.getElementById('status-select');
const prevBtn = document.getElementById('prev-page');
const nextBtn = document.getElementById('next-page');
const pageInfo = document.getElementById('page-info');

// Event Listeners
searchBtn.addEventListener('click', () => {
    currentSearch = searchInput.value;
    currentPage = 1;
    fetchAnime();
});

searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        currentSearch = searchInput.value;
        currentPage = 1;
        fetchAnime();
    }
});

sortSelect.addEventListener('change', () => {
    currentSort = sortSelect.value;
    currentPage = 1;
    fetchAnime();
});

typeSelect.addEventListener('change', () => {
    currentType = typeSelect.value;
    currentPage = 1;
    fetchAnime();
});

statusSelect.addEventListener('change', () => {
    currentStatus = statusSelect.value;
    currentPage = 1;
    fetchAnime();
});

prevBtn.addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        fetchAnime();
    }
});

nextBtn.addEventListener('click', () => {
    currentPage++;
    fetchAnime();
});

// Fetch anime from API
async function fetchAnime() {
    if (isLoading) return;
    isLoading = true;

    // Show loading state
    animeList.innerHTML = '<div class="loading">Loading...</div>';

    try {
        let url = '';
        if (currentSearch) {
            url = `https://api.jikan.moe/v4/anime?q=${currentSearch}&page=${currentPage}&sfw=true`;
        } else {
            url = `https://api.jikan.moe/v4/top/anime?page=${currentPage}&type=${currentType}&status=${currentStatus}`;
        }

        const response = await fetch(url);
        const data = await response.json();

        // Update pagination
        updatePagination(data.pagination);

        // Sort results if needed
        let sortedResults = [...data.data];
        if (currentSort === 'score') {
            sortedResults.sort((a, b) => (b.score || 0) - (a.score || 0));
        } else if (currentSort === 'popularity') {
            sortedResults.sort((a, b) => (b.members || 0) - (a.members || 0));
        } else if (currentSort === 'title') {
            sortedResults.sort((a, b) => a.title.localeCompare(b.title));
        }

        // Display results
        displayAnime(sortedResults);
    } catch (error) {
        console.error('Error fetching anime:', error);
        animeList.innerHTML = '<div class="error">Failed to load anime. Please try again later.</div>';
    } finally {
        isLoading = false;
    }
}

// Display anime in grid
function displayAnime(animeData) {
    animeList.innerHTML = '';

    animeData.forEach(anime => {
        const card = document.createElement('div');
        card.className = 'anime-card';
        card.innerHTML = `
            <div class="anime-card-image">
                <img src="${anime.images.jpg.large_image_url}" alt="${anime.title}">
                <div class="anime-card-overlay">
                    <div class="anime-card-stats">
                        <span class="anime-card-rating">★ ${anime.score || 'N/A'}</span>
                        <span class="anime-card-episodes">${anime.episodes || 'N/A'} EP</span>
                    </div>
                    <span class="anime-card-category">${anime.type}</span>
                </div>
            </div>
            <div class="anime-card-content">
                <h3>${anime.title}</h3>
                <p class="anime-status">${anime.status}</p>
                <div class="anime-card-buttons">
                    <button class="watch-btn" onclick="window.open('${anime.url}', '_blank')">More Info</button>
                    <button class="details-btn" onclick="showAnimeDetails(${anime.mal_id})">Details</button>
                </div>
            </div>
        `;
        animeList.appendChild(card);
    });
}

// Update pagination controls
function updatePagination(pagination) {
    pageInfo.textContent = `Page ${currentPage}`;
    prevBtn.disabled = currentPage <= 1;
    nextBtn.disabled = !pagination.has_next_page;
}

// Show anime details
function showAnimeDetails(animeId) {
    window.open(`https://myanimelist.net/anime/${animeId}`, '_blank');
}

// Initial load
fetchAnime();
