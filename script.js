async function fetchTopAnime() {
    try {
        const response = await fetch('https://api.jikan.moe/v4/top/anime?limit=8');
        const data = await response.json();
        const container = document.getElementById('trending-content');
        if (!container) return;
        container.innerHTML = '';

        data.data.forEach(anime => {
            const card = document.createElement('div');
            card.className = 'anime-card';
            card.innerHTML = `
                <div class="anime-card-image">
                    <img src="${anime.images.jpg.large_image_url}" alt="${anime.title}" onerror="this.src='images/placeholder.jpg'">
                    <div class="anime-card-overlay">
                        <div class="anime-card-stats">
                            <span class="anime-card-rating">★ ${anime.score || 'N/A'}</span>
                            <span class="anime-card-episodes">${anime.episodes || '?'} EP</span>
                        </div>
                    </div>
                </div>
                <div class="anime-card-content">
                    <h3>${anime.title}</h3>
                    <div class="anime-card-info">
                        <span class="anime-status">${anime.status}</span>
                        <span class="anime-rank">#${anime.rank || 'N/A'}</span>
                    </div>
                    <div class="anime-card-buttons">
                        <button class="watch-btn" onclick="window.open('${anime.url}', '_blank')">More Info</button>
                        <button class="details-btn" onclick="showAnimeDetails(${anime.mal_id})">Details</button>
                    </div>
                </div>`;
            container.appendChild(card);
        });
    } catch (error) {
        const container = document.getElementById('trending-content');
        if (container) container.innerHTML = '<div class="error-message">Failed to load anime</div>';
    }
}

async function fetchPopularAnime() {
    try {
        const response = await fetch('https://api.jikan.moe/v4/seasons/now?limit=8');
        const data = await response.json();
        const container = document.getElementById('popular-content');
        if (!container) return;
        container.innerHTML = '';

        data.data.forEach(anime => {
            const card = document.createElement('div');
            card.className = 'anime-card';
            card.innerHTML = `
                <div class="anime-card-image">
                    <img src="${anime.images.jpg.large_image_url}" alt="${anime.title}" onerror="this.src='images/placeholder.jpg'">
                    <div class="anime-card-overlay">
                        <div class="anime-card-stats">
                            <span class="anime-card-rating">★ ${anime.score || 'N/A'}</span>
                            <span class="anime-card-episodes">${anime.episodes || '?'} EP</span>
                        </div>
                    </div>
                </div>
                <div class="anime-card-content">
                    <h3>${anime.title}</h3>
                    <div class="anime-card-info">
                        <span class="anime-status">${anime.status}</span>
                        <span class="anime-rank">#${anime.rank || 'N/A'}</span>
                    </div>
                    <div class="anime-card-buttons">
                        <button class="watch-btn" onclick="window.open('${anime.url}', '_blank')">More Info</button>
                        <button class="details-btn" onclick="showAnimeDetails(${anime.mal_id})">Details</button>
                    </div>
                </div>`;
            container.appendChild(card);
        });
    } catch (error) {
        const container = document.getElementById('popular-content');
        if (container) container.innerHTML = '<div class="error-message">Failed to load anime</div>';
    }
}

function showAnimeDetails(animeId) {
    window.open(`https://myanimelist.net/anime/${animeId}`, '_blank');
}

document.addEventListener('DOMContentLoaded', () => {
    fetchTopAnime();
    fetchPopularAnime();
});
