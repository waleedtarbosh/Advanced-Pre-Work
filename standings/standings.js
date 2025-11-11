
    // ======================================================
    // === START: STANDINGS.JS (Page-Specific Logic) ===
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
    const standingsContainer = document.getElementById('standings-container');
    const searchModeSelect = document.getElementById('search-mode-select');
    
    // Dynamic fields
    const leagueInputWrapper = document.getElementById('league-input-wrapper');
    const teamInputWrapper = document.getElementById('team-input-wrapper');
    const seasonInputWrapper = document.getElementById('season-input-wrapper');

    // Inputs
    const leagueIdInput = document.getElementById('league-id-input');
    const teamIdInput = document.getElementById('team-id-input');
    const seasonInput = document.getElementById('season-input');

    // --- Function to toggle visible input fields ---
    function updateSearchUI() {
        const currentMode = searchModeSelect.value;
        
        // Hide dynamic fields first
        leagueInputWrapper.classList.add('hidden-input');
        teamInputWrapper.classList.add('hidden-input');
        
        // Season is always required
        seasonInputWrapper.classList.remove('hidden-input');

        if (currentMode === 'league') {
            leagueInputWrapper.classList.remove('hidden-input');
        } else if (currentMode === 'team') {
            teamInputWrapper.classList.remove('hidden-input');
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
            let apiUrl = 'https://v3.football.api-sports.io/standings?';
            let isValid = false;

            const season = seasonInput.value.trim();
            if (!season) {
                standingsContainer.innerHTML = "<p>Please enter a Season.</p>";
                return;
            }

            if (currentMode === 'league') {
                const leagueId = leagueIdInput.value.trim();
                if (leagueId) {
                    apiUrl += `league=${leagueId}&season=${season}`;
                    isValid = true;
                } else {
                    standingsContainer.innerHTML = "<p>Please enter a League ID.</p>";
                }
            } else if (currentMode === 'team') {
                const teamId = teamIdInput.value.trim();
                if (teamId) {
                    apiUrl += `team=${teamId}&season=${season}`;
                    isValid = true;
                } else {
                    standingsContainer.innerHTML = "<p>Please enter a Team ID.</p>";
                }
            }

            if (!isValid) return;
            
            standingsContainer.innerHTML = "<p>Loading standings data...</p>";
            
            fetch(apiUrl, fetchOptions)
                .then(handleResponse)
                .then(data => {
                    console.log('Standings Results:', data);
                    if (data.errors && (data.errors.required || data.errors.requests)) {
                        let errorMsg = data.errors.required || data.errors.requests;
                        standingsContainer.innerHTML = `<p>Error: ${errorMsg}</p>`;
                    } else {
                        displayStandings(data.response, standingsContainer); 
                    }
                })
                .catch(error => {
                    console.error('Fetch error:', error);
                    standingsContainer.innerHTML = `<p>An error occurred while fetching data. ${error.message}</p>`;
                });
        });
    }

    // --- (New) Function to display standings table ---
    function displayStandings(data, containerElement) {
        if (!containerElement) return;

        containerElement.innerHTML = ""; 
        if (!data || data.length === 0) {
            containerElement.innerHTML = "<p>No standings found for this search.</p>";
            return;
        }
        
        // Response is [ { league: {...} } ]
        data.forEach(item => {
            const league = item.league;
            // JSON structure is [[...]], so we take the first item
            const standings = league.standings[0]; 

            if (!standings || standings.length === 0) {
                containerElement.innerHTML = "<p>No standings data available for this league.</p>";
                return;
            }

            // Create League Header
            const header = document.createElement('div');
            header.className = 'standings-header';
            header.innerHTML = `
                <img src="${league.logo}" alt="${league.name}">
                <h2>${league.name} (${league.season})</h2>
            `;
            containerElement.appendChild(header);

            // Create Table
            const table = document.createElement('table');
            table.className = 'standings-table';
            table.innerHTML = `
                <thead>
                    <tr>
                        <th class="rank">#</th>
                        <th class="team-name">Team</th>
                        <th>P</th>
                        <th>W</th>
                        <th>D</th>
                        <th>L</th>
                        <th>GD</th>
                        <th>Pts</th>
                        <th>Form</th>
                    </tr>
                </thead>
                <tbody>
                </tbody>
            `;
            
            const tbody = table.querySelector('tbody');
            const legendItems = new Map(); // To store legend items

            // Fill Table
            standings.forEach(teamData => {
                const team = teamData.team;
                const all = teamData.all;
                
                // Extract data
                const rank = teamData.rank;
                const teamName = team.name;
                const teamLogo = team.logo;
                const points = teamData.points;
                const goalsDiff = teamData.goalsDiff;
                const form = teamData.form || 'N/A';
                const description = teamData.description;
                
                const played = all.played;
                const win = all.win;
                const draw = all.draw;
                const lose = all.lose;

                // Determine row color
                let rankClass = 'rank-default';
                if (description) {
                    if (description.includes('Champions League')) {
                        rankClass = 'rank-champions';
                        legendItems.set(rankClass, description);
                    } else if (description.includes('Europa League')) {
                        rankClass = 'rank-europa';
                        legendItems.set(rankClass, description);
                    } else if (description.includes('Conference League')) {
                        rankClass = 'rank-conference';
                        legendItems.set(rankClass, description);
                    } else if (description.includes('Relegation')) {
                        rankClass = 'rank-relegation';
                        legendItems.set(rankClass, description);
                    }
                }

                const tr = document.createElement('tr');
                tr.className = rankClass;
                tr.innerHTML = `
                    <td class="rank">${rank}</td>
                    <td class="team-name">
                        <img src="${teamLogo}" class="team-logo" alt="${teamName} logo">
                        <span>${teamName}</span>
                    </td>
                    <td>${played}</td>
                    <td>${win}</td>
                    <td>${draw}</td>
                    <td>${lose}</td>
                    <td>${goalsDiff}</td>
                    <td class="points">${points}</td>
                    <td class="form">${form}</td>
                `;
                tbody.appendChild(tr);
            });

            containerElement.appendChild(table);

            // Create Legend
            if (legendItems.size > 0) {
                const legend = document.createElement('div');
                legend.className = 'standings-legend';
                legendItems.forEach((description, cssClass) => {
                    legend.innerHTML += `
                        <div class="legend-item">
                            <span class="legend-color-box ${cssClass}"></span>
                            ${description}
                        </div>
                    `;
                });
                containerElement.appendChild(legend);
            }
        });
    }

    // ======================================================
    // === END: STANDINGS.JS (Page-Specific Logic) ===
    // ======================================================