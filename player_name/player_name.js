
    // ======================================================
    // === START: PLAYER_NAME.JS (Page-Specific Logic) ===
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
    const searchInput = document.getElementById('search-input');
    const playersContainer = document.getElementById('players-container'); 

    if (searchButton) {
        searchButton.addEventListener('click', () => {
            const searchTerm = searchInput.value.trim(); 
            if (!searchTerm) {
                playersContainer.innerHTML = "<p>Please enter a player name to search.</p>";
                return; 
            }
            playersContainer.innerHTML = "<p>Searching for players...</p>";
            
            // Note: This endpoint seems different from the one in your JS.
            // I'm using the one from your JS: /players/profiles?search=
            // If you intended /players?search=, the display function might need changes.
            const searchApiUrl = `https://v3.football.api-sports.io/players/profiles?search=${searchTerm}`;
            
            fetch(searchApiUrl, fetchOptions)
                .then(handleResponse)
                .then(data => {
                    console.log('Search results:', data);
                    // (Display function fully updated)
                    displayPlayers(data.response, playersContainer); 
                })
                .catch(error => {
                    console.error('Search error:', error);
                    playersContainer.innerHTML = `<p>An error occurred while searching. ${error.message}</p>`;
                });
        });
    }

    // --- RE-USABLE FUNCTION to display player cards (UPDATED) ---
    function displayPlayers(players, containerElement) {
        if (!containerElement) return;

        containerElement.innerHTML = ""; 
        if (!players || players.length === 0) {
            containerElement.innerHTML = "<p>No players found.</p>";
            return;
        }
        
        // Response structure is: [ { player: {...} } ]
        players.forEach(item => {
            const player = item.player; // Get the player object directly

            // --- Extract all new data ---
            const playerName = player.name || 'N/A';
            const playerId = player.id || 'N/A';
            const playerPhoto = player.photo || 'img/default-player.png'; // Fallback
            const age = player.age || 'N/A';
            const position = player.position || 'N/A';
            const number = player.number || 'N/A';
            const nationality = player.nationality || 'N/A';
            const height = player.height || 'N/A';
            const weight = player.weight || 'N/A';
            const birthDate = player.birth ? player.birth.date : 'N/A';
            
            const playerCard = document.createElement('div');
            playerCard.className = 'player-card'; 
            
            // --- Build the new, info-rich player card ---
            playerCard.innerHTML = `
                <img src="${playerPhoto}" alt="${playerName}" class="player-photo">
                <div class="player-info">
                    <h2>${playerName}</h2>
                    <p><strong>Position:</strong> ${position}</p>
                    <p><strong>Number:</strong> ${number}</p>
                    <p><strong>Nationality:</strong> ${nationality}</p>
                    <p><strong>Age:</strong> ${age} (Born: ${birthDate})</p>
                    <p><strong>Height:</strong> ${height} cm</p>
                    <p><strong>Weight:</strong> ${weight} kg</p>
                    <p><strong>Player ID:</strong> ${playerId}</p>
                </div>
            `;
            containerElement.appendChild(playerCard);
        });
    }

    // ======================================================
    // === END: PLAYER_NAME.JS (Page-Specific Logic) ===
    // ======================================================