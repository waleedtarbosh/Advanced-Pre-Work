
// ======================================================
// === START: PLAYER_HISTORY.JS (Page-Specific Logic) ===
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
const playerIdInput = document.getElementById('player-id-input');
const historyContainer = document.getElementById('history-container');

if (searchButton) {
    searchButton.addEventListener('click', () => {
        const playerId = playerIdInput.value.trim();

        if (!playerId) {
            historyContainer.innerHTML = "<p>Please enter a Player ID.</p>";
            return;
        }

        historyContainer.innerHTML = "<p>Loading player history...</p>";

        // Build the correct URL
        const apiUrl = `https://v3.football.api-sports.io/players/teams?player=${playerId}`;

        fetch(apiUrl, fetchOptions)
            .then(handleResponse)
            .then(data => {
                console.log('Player History Results:', data);
                if (data.errors && (data.errors.required || data.errors.requests)) {
                    let errorMsg = data.errors.required || data.errors.requests;
                    historyContainer.innerHTML = `<p>Error: ${errorMsg}</p>`;
                } else {
                    // Send data to the new display function
                    displayTeamHistory(data.response, historyContainer);
                }
            })
            .catch(error => {
                console.error('Fetch error:', error);
                historyContainer.innerHTML = `<p>An error occurred while fetching data. ${error.message}</p>`;
            });
    });
}

// --- FUNCTION to display player history cards ---
function displayTeamHistory(history, containerElement) {
    if (!containerElement) return;

    containerElement.innerHTML = "";
    if (!history || history.length === 0) {
        containerElement.innerHTML = "<p>No team history found for this player.</p>";
        return;
    }

    // Response structure is: [ { team: {...}, seasons: [ ... ] } ]
    history.forEach(item => {
        const team = item.team;
        const seasonsArray = item.seasons;

        // Extract data
        const teamName = team.name || 'N/A';
        const teamLogo = team.logo || 'img/default-team.png'; // Fallback
        const teamId = team.id || 'N/A';

        // Convert array of seasons into a comma-separated string
        const seasonsString = seasonsArray.join(', ');


        const teamCard = document.createElement('div');
        teamCard.className = 'team-card';

        // Build the team card
        teamCard.innerHTML = `
                <img src="${teamLogo}" alt="${teamName}" class="team-logo">
                <div class="team-info">
                    <h2>${teamName} (ID: ${teamId})</h2>
                    <p><strong>Seasons:</strong> ${seasonsString}</p>
                </div>
            `;
        containerElement.appendChild(teamCard);
    });
}

// ======================================================
// === END: PLAYER_HISTORY.JS (Page-Specific Logic) ===
// ======================================================