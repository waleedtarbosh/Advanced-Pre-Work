
// ======================================================
// === START: TOP_RED_CARDS.JS (Page-Specific Logic) ===
// ======================================================
const apiKey = import.meta.env.VITE_API_KEY;
const fetchOptions = {
    method: 'GET',
    headers: {
        'x-apisports-key': apiKey,
        'Content-Type': 'application/json'
    }
};

// --- Universal Error Handler for Fetch ---
const handleResponse = (response) => {
    if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
    }
    return response.json();
};

// --- Page Elements ---
const searchButton = document.getElementById('search-button');
const leagueIdInput = document.getElementById('league-id-input');
const seasonInput = document.getElementById('season-input');
const topRedCardsContainer = document.getElementById('topredcards-container');

if (searchButton) {
    searchButton.addEventListener('click', () => {
        const leagueId = leagueIdInput.value.trim();
        const season = seasonInput.value.trim();

        if (!leagueId || !season) {
            topRedCardsContainer.innerHTML = "<p>Please enter both a League ID and a Season.</p>";
            return;
        }

        topRedCardsContainer.innerHTML = "<p>Loading top red cards...</p>";

        // Build the correct URL for top red cards
        const apiUrl = `https://v3.football.api-sports.io/players/topredcards?league=${leagueId}&season=${season}`;

        fetch(apiUrl, fetchOptions)
            .then(handleResponse)
            .then(data => {
                console.log('Top Red Cards Results:', data);
                if (data.errors && (data.errors.required || data.errors.league || data.errors.requests)) {
                    let errorMsg = data.errors.required || data.errors.league || data.errors.requests;
                    topRedCardsContainer.innerHTML = `<p>Error: ${errorMsg}</p>`;
                } else {
                    // Send data to the display function
                    displayTopRedCards(data.response, topRedCardsContainer);
                }
            })
            .catch(error => {
                console.error('Fetch error:', error);
                topRedCardsContainer.innerHTML = `<p>An error occurred while fetching data. ${error.message}</p>`;
            });
    });
}

// --- FUNCTION to display top red cards ---
function displayTopRedCards(players, containerElement) {
    if (!containerElement) return;

    containerElement.innerHTML = "";
    if (!players || players.length === 0) {
        containerElement.innerHTML = "<p>No top red cards found for this league and season.</p>";
        return;
    }

    // Response structure is: [ { player: {...}, statistics: [ {...} ] } ]
    players.forEach(item => {
        const player = item.player;
        const stats = item.statistics[0];

        if (!player || !stats) {
            console.warn("Skipping player with incomplete data:", item);
            return;
        }

        // --- Extract Data ---
        const playerName = player.name || 'N/A';
        const playerPhoto = player.photo || 'img/default-player.png'; // Fallback
        const teamName = stats.team.name || 'N/A';

        const position = stats.games.position || 'N/A';
        const appearances = stats.games.appearences || 0;
        const minutes = stats.games.minutes || 0;
        const rating = stats.games.rating ? parseFloat(stats.games.rating).toFixed(2) : 'N/A';

        const goals = stats.goals.total || 0;
        const assists = stats.goals.assists !== null ? stats.goals.assists : 0;

        // The most important data for this page (Updated)
        const yellowCards = stats.cards.yellow || 0;
        const yellowRedCards = stats.cards.yellowred || 0;
        const redCards = stats.cards.red || 0;

        const playerCard = document.createElement('div');
        playerCard.className = 'player-card';

        // Build the stats card (with focus on Red Cards)
        playerCard.innerHTML = `
                <img src="${playerPhoto}" alt="${playerName}" class="player-photo">
                <div class="player-info">
                    <h2>${playerName}</h2>
                    <p><strong>Team:</strong> ${teamName}</p>
                    <p><strong>Cards:</strong> 🟥 ${redCards} &nbsp;&nbsp; 🟨🟥 ${yellowRedCards} &nbsp;&nbsp; 🟨 ${yellowCards}</p>
                    <p><strong>Position:</strong> ${position}</p>
                    <p><strong>Rating:</strong> ${rating}</p>
                    <p><strong>Appearances:</strong> ${appearances} (${minutes} minutes)</p>
                    <p><strong>Goals:</strong> ${goals}</p>
                    <p><strong>Assists:</strong> ${assists}</p>
                </div>
            `;
        containerElement.appendChild(playerCard);
    });
}

// ======================================================
// === END: TOP_RED_CARDS.JS (Page-Specific Logic) ===
// ======================================================