
    // ======================================================
    // === START: TEAM_SQUAD.JS (Page-Specific Logic) ===
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
    const apiKey = 'PUT_YOUR_REAL_API_KEY_HERE'; // FAKE API KEY / PLACEHOLDER
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
    const squadContainer = document.getElementById('squad-container');
    const searchModeSelect = document.getElementById('search-mode-select');
    
    const teamInputWrapper = document.getElementById('team-input-wrapper');
    const playerInputWrapper = document.getElementById('player-input-wrapper');

    const teamIdInput = document.getElementById('team-id-input');
    const playerIdInput = document.getElementById('player-id-input');

    // --- Function to toggle visible input fields ---
    function updateSearchUI() {
        const currentMode = searchModeSelect.value;
        
        if (currentMode === 'team') {
            teamInputWrapper.classList.remove('hidden-input');
            playerInputWrapper.classList.add('hidden-input');
        } else if (currentMode === 'player') {
            teamInputWrapper.classList.add('hidden-input');
            playerInputWrapper.classList.remove('hidden-input');
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
            let apiUrl = 'https://v3.football.api-sports.io/players/squads?';
            let isValid = false;

            if (currentMode === 'team') {
                const teamId = teamIdInput.value.trim();
                if (teamId) {
                    apiUrl += `team=${teamId}`;
                    isValid = true;
                } else {
                    squadContainer.innerHTML = "<p>Please enter a Team ID.</p>";
                }

            } else if (currentMode === 'player') {
                const playerId = playerIdInput.value.trim();
                if (playerId) {
                    apiUrl += `player=${playerId}`;
                    isValid = true;
                } else {
                    squadContainer.innerHTML = "<p>Please enter a Player ID.</p>";
                }
            }

            if (!isValid) return;
            
            squadContainer.innerHTML = "<p>Loading squad data...</p>";
            
            fetch(apiUrl, fetchOptions)
                .then(handleResponse)
                .then(data => {
                    console.log('Squad Results:', data);
                    if (data.errors && (data.errors.required || data.errors.requests)) {
                        let errorMsg = data.errors.required || data.errors.requests;
                        squadContainer.innerHTML = `<p>Error: ${errorMsg}</p>`;
                    } else {
                        displaySquads(data.response, squadContainer); 
                    }
                })
                .catch(error => {
                    console.error('Fetch error:', error);
                    squadContainer.innerHTML = `<p>An error occurred while fetching data. ${error.message}</p>`;
                });
        });
    }

    // --- (New) Function to display team/player squads ---
    function displaySquads(squadData, containerElement) {
        if (!containerElement) return;

        containerElement.innerHTML = ""; 
        if (!squadData || squadData.length === 0) {
            containerElement.innerHTML = "<p>No squad information found.</p>";
            return;
        }
        
        // Response structure: [ { team: {...}, players: [...] }, ... ]
        squadData.forEach(item => {
            const team = item.team;
            const players = item.players;

            // Create the main card for the team
            const squadCard = document.createElement('div');
            squadCard.className = 'squad-card';
            
            // Create the team header
            const squadHeader = document.createElement('div');
            squadHeader.className = 'squad-header';
            squadHeader.innerHTML = `
                <img src="${team.logo || 'img/default-team.png'}" alt="${team.name}">
                <h2>${team.name} (ID: ${team.id})</h2>
            `;
            squadCard.appendChild(squadHeader);

            // Create the container for the players
            const playerList = document.createElement('div');
            playerList.className = 'player-list';

            if (players && players.length > 0) {
                // Iterate over each player in the squad
                players.forEach(player => {
                    const playerName = player.name || 'N/A';
                    const playerPhoto = player.photo || 'img/default-player.png';
                    const position = player.position || 'N/A';
                    const number = player.number || '-';

                    const playerItem = document.createElement('div');
                    playerItem.className = 'player-item';
                    
                    playerItem.innerHTML = `
                        <img src="${playerPhoto}" alt="${playerName}">
                        <div class="player-item-info">
                            <div class="name">${playerName}</div>
                            <div class="details">Position: ${position}</div>
                        </div>
                        <div class="player-item-number">${number}</div>
                    `;
                    playerList.appendChild(playerItem);
                });
            } else {
                playerList.innerHTML = "<p>No players listed for this squad.</p>";
            }

            squadCard.appendChild(playerList);
            containerElement.appendChild(squadCard);
        });
    }

    // ======================================================
    // === END: TEAM_SQUAD.JS (Page-Specific Logic) ===
    // ======================================================