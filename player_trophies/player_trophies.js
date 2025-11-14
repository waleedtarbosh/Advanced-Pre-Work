
// ======================================================
// === START: PLAYER_TROPHIES.JS (Page-Specific Logic) ===
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
const trophiesContainer = document.getElementById('trophies-container');
const searchModeSelect = document.getElementById('search-mode-select');

const playerInputWrapper = document.getElementById('player-input-wrapper');
const coachInputWrapper = document.getElementById('coach-input-wrapper');

const playerIdInput = document.getElementById('player-id-input');
const coachIdInput = document.getElementById('coach-id-input');

// --- Function to toggle visible input fields ---
function updateSearchUI() {
    const currentMode = searchModeSelect.value;

    if (currentMode === 'player') {
        playerInputWrapper.classList.remove('hidden-input');
        coachInputWrapper.classList.add('hidden-input');
    } else if (currentMode === 'coach') {
        playerInputWrapper.classList.add('hidden-input');
        coachInputWrapper.classList.remove('hidden-input');
    }
}

// Add listener to toggle UI on select change
if (searchModeSelect) {
    searchModeSelect.addEventListener('change', updateSearchUI);
    // Run once on load to set default state
    updateSearchUI();
}

// --- Search Button Click Listener ---
if (searchButton) {
    searchButton.addEventListener('click', () => {
        const currentMode = searchModeSelect.value;
        let apiUrl = 'https://v3.football.api-sports.io/trophies?';
        let isValid = false;

        if (currentMode === 'player') {
            const playerId = playerIdInput.value.trim();
            if (playerId) {
                apiUrl += `player=${playerId}`;
                isValid = true;
            } else {
                trophiesContainer.innerHTML = "<p>Please enter a Player ID.</p>";
            }

        } else if (currentMode === 'coach') {
            const coachId = coachIdInput.value.trim();
            if (coachId) {
                apiUrl += `coach=${coachId}`;
                isValid = true;
            } else {
                trophiesContainer.innerHTML = "<p>Please enter a Coach ID.</p>";
            }
        }

        if (!isValid) return;

        trophiesContainer.innerHTML = "<p>Loading trophies data...</p>";

        fetch(apiUrl, fetchOptions)
            .then(handleResponse)
            .then(data => {
                console.log('Trophies Results:', data);
                if (data.errors && (data.errors.required || data.errors.requests)) {
                    let errorMsg = data.errors.required || data.errors.requests;
                    trophiesContainer.innerHTML = `<p>Error: ${errorMsg}</p>`;
                } else {
                    displayTrophies(data.response, trophiesContainer);
                }
            })
            .catch(error => {
                console.error('Fetch error:', error);
                trophiesContainer.innerHTML = `<p>An error occurred while fetching data. ${error.message}</p>`;
            });
    });
}

// --- (New) Function to display trophy cards ---
function displayTrophies(trophies, containerElement) {
    if (!containerElement) return;

    containerElement.innerHTML = "";
    if (!trophies || trophies.length === 0) {
        containerElement.innerHTML = "<p>No trophies found for this search.</p>";
        return;
    }

    // Trophy Icon (SVG)
    const trophyIconSvg = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 2v4M6 20v-4h12v4M18 7.5c0-1-1.5-2.5-6-2.5S6 6.5 6 7.5s1.5 2.5 6 2.5 6-1.5 6-2.5M12 10V6M6 6c0 4.5 3 6 6 6s6-1.5 6-6"/>
            </svg>`;

    // Response structure is: [ { league: "...", country: "...", season: "...", place: "..." } ]
    trophies.forEach(trophy => {
        const league = trophy.league || 'N/A';
        const country = trophy.country || 'N/A';
        const season = trophy.season || 'N/A';
        const place = trophy.place || 'N/A';

        let placeClass = 'place-other';
        let iconClass = 'icon-other';

        if (place.toLowerCase().includes('winner')) {
            placeClass = 'place-winner';
            iconClass = 'icon-winner';
        } else if (place.toLowerCase().includes('2nd')) {
            placeClass = 'place-runner-up';
            iconClass = 'icon-runner-up';
        }

        const trophyCard = document.createElement('div');
        trophyCard.className = 'trophy-card';

        // Build the trophy card
        trophyCard.innerHTML = `
                <div class="trophy-icon ${iconClass}">
                    ${trophyIconSvg}
                </div>
                <div class="trophy-info">
                    <h2>${league}</h2>
                    <p class="place ${placeClass}">${place}</p>
                    <p class="details">${country} | ${season}</p>
                </div>
            `;
        containerElement.appendChild(trophyCard);
    });
}

// ======================================================
// === END: PLAYER_TROPHIES.JS (Page-Specific Logic) ===
// ======================================================