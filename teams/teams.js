
    // ======================================================
    // === START: TEAMS.JS (Page-Specific Logic) ===
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
    const teamsContainer = document.getElementById('teams-container');
    const searchModeSelect = document.getElementById('search-mode-select');
    
    // Dynamic fields
    const leagueInputWrapper = document.getElementById('league-input-wrapper');
    const idInputWrapper = document.getElementById('id-input-wrapper');
    const searchInputWrapper = document.getElementById('search-input-wrapper');
    const countryInputWrapper = document.getElementById('country-input-wrapper');
    const seasonInputWrapper = document.getElementById('season-input-wrapper');

    // Inputs
    const leagueIdInput = document.getElementById('league-id-input');
    const teamIdInput = document.getElementById('team-id-input');
    const searchInput = document.getElementById('search-input');
    const countryInput = document.getElementById('country-input');
    const seasonInput = document.getElementById('season-input');

    // --- Function to toggle visible input fields ---
    function updateSearchUI() {
        const currentMode = searchModeSelect.value;
        
        // Hide all dynamic fields first
        leagueInputWrapper.classList.add('hidden-input');
        idInputWrapper.classList.add('hidden-input');
        searchInputWrapper.classList.add('hidden-input');
        countryInputWrapper.classList.add('hidden-input');
        seasonInputWrapper.classList.add('hidden-input'); // Hide season by default

        if (currentMode === 'league') {
            leagueInputWrapper.classList.remove('hidden-input');
            seasonInputWrapper.classList.remove('hidden-input'); // Show season for league
        } else if (currentMode === 'id') {
            idInputWrapper.classList.remove('hidden-input');
        } else if (currentMode === 'search') {
            searchInputWrapper.classList.remove('hidden-input');
        } else if (currentMode === 'country') {
            countryInputWrapper.classList.remove('hidden-input');
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
            let apiUrl = 'https://v3.football.api-sports.io/teams?';
            let isValid = false;

            if (currentMode === 'league') {
                const leagueId = leagueIdInput.value.trim();
                const season = seasonInput.value.trim();
                if (leagueId && season) {
                    apiUrl += `league=${leagueId}&season=${season}`;
                    isValid = true;
                } else {
                    teamsContainer.innerHTML = "<p>Please enter both League ID and Season.</p>";
                }
            } else if (currentMode === 'id') {
                const teamId = teamIdInput.value.trim();
                if (teamId) {
                    apiUrl += `id=${teamId}`;
                    isValid = true;
                } else {
                    teamsContainer.innerHTML = "<p>Please enter a Team ID.</p>";
                }
            } else if (currentMode === 'search') {
                const searchTerm = searchInput.value.trim();
                if (searchTerm) {
                    apiUrl += `search=${searchTerm}`;
                    isValid = true;
                } else {
                    teamsContainer.innerHTML = "<p>Please enter a team name to search.</p>";
                }
            } else if (currentMode === 'country') {
                const country = countryInput.value.trim();
                if (country) {
                    apiUrl += `country=${country}`;
                    isValid = true;
                } else {
                    teamsContainer.innerHTML = "<p>Please enter a Country name.</p>";
                }
            }

            if (!isValid) return;
            
            teamsContainer.innerHTML = "<p>Loading teams data...</p>";
            
            fetch(apiUrl, fetchOptions)
                .then(handleResponse)
                .then(data => {
                    console.log('Teams Results:', data);
                    if (data.errors && (data.errors.required || data.errors.requests)) {
                        let errorMsg = data.errors.required || data.errors.requests;
                        teamsContainer.innerHTML = `<p>Error: ${errorMsg}</p>`;
                    } else {
                        displayTeams(data.response, teamsContainer); 
                    }
                })
                .catch(error => {
                    console.error('Fetch error:', error);
                    teamsContainer.innerHTML = `<p>An error occurred while fetching data. ${error.message}</p>`;
                });
        });
    }

    // --- (New) Function to display team cards ---
    function displayTeams(teamsData, containerElement) {
        if (!containerElement) return;

        containerElement.innerHTML = ""; 
        if (!teamsData || teamsData.length === 0) {
            containerElement.innerHTML = "<p>No teams found for this search.</p>";
            return;
        }
        
        // Response structure is: [ { team: {...}, venue: {...} }, ... ]
        teamsData.forEach(item => {
            const team = item.team;
            const venue = item.venue;

            // --- Extract Team Data ---
            const teamName = team.name || 'N/A';
            const teamCode = team.code || 'N/A';
            const teamCountry = team.country || 'N/A';
            const founded = team.founded || 'N/A';
            const teamLogo = team.logo || 'img/default-team.png'; // Fallback

            // --- Extract Venue Data ---
            const venueName = venue.name || 'N/A';
            const venueCity = venue.city || 'N/A';
            const capacity = venue.capacity || 'N/A';
            const venueImage = venue.image || 'img/default-venue.png'; // Fallback
            
            const teamCard = document.createElement('div');
            teamCard.className = 'team-card'; 
            
            // Build the team & venue card
            teamCard.innerHTML = `
                <div class="team-details">
                    <div class="team-header">
                        <img src="${teamLogo}" alt="${teamName}" class="team-logo">
                        <div class="team-name-code">
                            <h2>${teamName}</h2>
                            <p>${teamCode}</p>
                        </div>
                    </div>
                    <div class="team-body">
                        <p><strong>Founded:</strong> ${founded}</p>
                        <p><strong>Country:</strong> ${teamCountry}</p>
                    </div>
                </div>
                <div class="venue-details">
                    <img src="${venueImage}" alt="${venueName}" class="venue-image">
                    <div class="venue-info">
                        <h3>${venueName}</h3>
                        <p><strong>City:</strong> ${venueCity}</p>
                        <p><strong>Capacity:</strong> ${capacity ? capacity.toLocaleString() : 'N/A'}</p>
                    </div>
                </div>
            `;
            containerElement.appendChild(teamCard);
        });
    }

    // ======================================================
    // === END: TEAMS.JS (Page-Specific Logic) ===
    // ======================================================