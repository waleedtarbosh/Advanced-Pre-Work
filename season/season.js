
    // ======================================================
    // === START: SEASON.JS (Page-Specific Logic) ===
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
    const searchButton = document.getElementById('search-seasons-button');
    const playerIdInput = document.getElementById('player-id-input');
    const seasonsContainer = document.getElementById('seasons-results-container');

    if (searchButton) {
        searchButton.addEventListener('click', () => {
            const playerId = playerIdInput.value.trim();
            
            if (!playerId) {
                seasonsContainer.innerHTML = "<p>Please enter a Player ID.</p>";
                return;
            }

            seasonsContainer.innerHTML = "<p>Loading seasons data...</p>";
            
            const seasonsApiUrl = `https://v3.football.api-sports.io/players/seasons?player=${playerId}`;

            fetch(seasonsApiUrl, fetchOptions)
                .then(handleResponse)
                .then(data => {
                    seasonsContainer.innerHTML = ""; // Clear loading message

                    if (data && data.response && Array.isArray(data.response) && data.response.length > 0) {
                        
                        const seasonCount = data.response.length;
                        const seasonListString = data.response.join(', ');

                        // --- Create Summary Card ---
                        const summaryCard = document.createElement('div');
                        summaryCard.className = 'summary-card';
                        
                        summaryCard.innerHTML = `
                            <div class="summary-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                    <line x1="16" y1="2" x2="16" y2="6"></line>
                                    <line x1="8" y1="2" x2="8" y2="6"></line>
                                    <line x1="3" y1="10" x2="21" y2="10"></line>
                                </svg>
                            </div>
                            <div class="summary-info">
                                <div class="summary-count">${seasonCount}</div>
                                <div class="summary-text">Seasons Played</div>
                            </div>
                        `;
                        seasonsContainer.appendChild(summaryCard);
                        
                        // --- Create Details Card ---
                        const detailsCard = document.createElement('div');
                        detailsCard.className = 'details-card';
                        detailsCard.innerHTML = `
                            <h3>Season List</h3>
                            <p>${seasonListString}</p>
                        `;
                        seasonsContainer.appendChild(detailsCard);

                    } else {
                        seasonsContainer.innerHTML = "<p>No seasons found for this player.</p>";
                    }
                })
                .catch(error => {
                    console.error('Error fetching player seasons:', error);
                    seasonsContainer.innerHTML = `<p>Error: ${error.message}</p>`;
                });
        });
    }

    // ======================================================
    // === END: SEASON.JS (Page-Specific Logic) ===
    // ======================================================