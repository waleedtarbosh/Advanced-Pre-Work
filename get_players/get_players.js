
    // ======================================================
    // === START: GET_PLAYERS.JS (Page-Specific Logic) ===
    // ======================================================

    // --- API Configuration ---
           /*
===================================================================
NOTE FOR DEVELOPERS:
A valid API key from API-Football.com is required.
Please replace the placeholder string "PUT_YOUR_API_KEY_HERE"
with your personal key to fetch the data.
===================================================================
*/
    const apiKey = 'b801cc075516be97da6bd24c81b304c7'; // FAKE API KEY / PLACEHOLDER
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
    const playersContainer = document.getElementById('players-container');
    const seasonInput = document.getElementById('season-input');

    // Dynamic Search Elements
    const searchModeSelect = document.getElementById('search-mode-select');
    
    const leagueInputWrapper = document.getElementById('league-input-wrapper');
    const playerInputWrapper = document.getElementById('player-input-wrapper');
    const teamInputWrapper = document.getElementById('team-input-wrapper');

    const leagueIdInput = document.getElementById('league-id-input');
    const playerIdInput = document.getElementById('player-id-input');
    const teamIdInput = document.getElementById('team-id-input');

    // --- (New) Function to toggle visible input fields ---
    function updateSearchUI() {
        const currentMode = searchModeSelect.value;
        
        // Hide all first
        leagueInputWrapper.classList.add('hidden-input');
        playerInputWrapper.classList.add('hidden-input');
        teamInputWrapper.classList.add('hidden-input');

        // Show the appropriate one
        if (currentMode === 'league') {
            leagueInputWrapper.classList.remove('hidden-input');
        } else if (currentMode === 'player') {
            playerInputWrapper.classList.remove('hidden-input');
        } else if (currentMode === 'team') {
            teamInputWrapper.classList.remove('hidden-input');
        }
    }

    // Add listener to toggle UI on select change
    if(searchModeSelect) {
        searchModeSelect.addEventListener('change', updateSearchUI);
        // Run once on load to set default state
        updateSearchUI();
    }

    // --- (Updated) Search Button Click Listener ---
    if(searchButton) {
        searchButton.addEventListener('click', () => {
            const season = seasonInput.value.trim();
            const currentMode = searchModeSelect.value;
            let apiUrl = 'https://v3.football.api-sports.io/players?';
            let isValid = false;

            if (!season) {
                playersContainer.innerHTML = "<p>Please enter a Season.</p>";
                return;
            }

            // Build URL based on selected mode
            if (currentMode === 'league') {
                const leagueId = leagueIdInput.value.trim();
                if (leagueId) {
                    apiUrl += `league=${leagueId}&season=${season}`;
                    isValid = true;
                } else {
                    playersContainer.innerHTML = "<p>Please enter a League ID.</p>";
                }

            } else if (currentMode === 'player') {
                const playerId = playerIdInput.value.trim();
                if (playerId) {
                    apiUrl += `id=${playerId}&season=${season}`;
                    isValid = true;
                } else {
                    playersContainer.innerHTML = "<p>Please enter a Player ID.</p>";
                }

            } else if (currentMode === 'team') {
                const teamId = teamIdInput.value.trim();
                if (teamId) {
                    apiUrl += `team=${teamId}&season=${season}`;
                    isValid = true;
                } else {
                    playersContainer.innerHTML = "<p>Please enter a Team ID.</p>";
                }
            }

            // If input is not valid, don't continue
            if (!isValid) {
                return;
            }
            
            playersContainer.innerHTML = "<p>Loading player statistics...</p>";
            
            fetch(apiUrl, fetchOptions)
                .then(handleResponse)
                .then(data => {
                    console.log('Player Statistics Results:', data);
                    if (data.errors && (data.errors.required || data.errors.league || data.errors.requests)) {
                        let errorMsg = data.errors.required || data.errors.league || data.errors.requests;
                        playersContainer.innerHTML = `<p>Error: ${errorMsg}</p>`;
                    } else {
                        // This display function works for all three modes
                        displayPlayerStats(data.response, playersContainer); 
                    }
                })
                .catch(error => {
                    console.error('Fetch error:', error);
                    playersContainer.innerHTML = `<p>An error occurred while fetching data. ${error.message}</p>`;
                });
        });
    }

    // --- Function to display statistics ---
    function displayPlayerStats(players, containerElement) {
        if (!containerElement) return;
        
        containerElement.innerHTML = ""; 
        if (!players || players.length === 0) {
            playersContainer.innerHTML = "<p>No players found for this search.</p>";
            return;
        }
        
        players.forEach(item => {
            const player = item.player;
            const stats = item.statistics[0]; 

            if (!player || !stats) {
                console.warn("Skipping player with incomplete data:", item);
                return; 
            }

            const playerName = player.name || 'N/A';
            const playerPhoto = player.photo || '';
            const teamName = stats.team.name || 'N/A';
            const position = stats.games.position || 'N/A';
            const appearances = stats.games.appearences || 0;
            const minutes = stats.games.minutes || 0;
            const rating = stats.games.rating ? parseFloat(stats.games.rating).toFixed(2) : 'N/A';
            const goals = stats.goals.total || 0;
            const assists = stats.goals.assists !== null ? stats.goals.assists : 0;
            const yellowCards = stats.cards.yellow || 0;
            const redCards = stats.cards.red || 0;
            
            const playerCard = document.createElement('div');
            playerCard.className = 'player-card'; 
            
            playerCard.innerHTML = `
                <img src="${playerPhoto}" alt="${playerName}" class="player-photo">
                <div class="player-info">
                    <h2>${playerName}</h2>
                    <p><strong>Team:</strong> ${teamName}</p>
                    <p><strong>Position:</strong> ${position}</p>
                    <p><strong>Rating:</strong> ${rating}</p>
                    <p><strong>Appearances:</strong> ${appearances} (${minutes} minutes)</p>
                    <p><strong>Goals:</strong> ${goals}</p>
                    <p><strong>Assists:</strong> ${assists}</p>
                    <p><strong>Cards:</strong> 🟨 ${yellowCards} &nbsp;&nbsp; 🟥 ${redCards}</p>
                </div>
            `;
            containerElement.appendChild(playerCard);
        });
    }

    // ======================================================
    // === END: GET_PLAYERS.JS (Page-Specific Logic) ===
    // ======================================================