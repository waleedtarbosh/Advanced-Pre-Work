    // ======================================================
    // === START: FIXTURES.JS (Page-Specific Logic) ===
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
    const fixturesContainer = document.getElementById('fixtures-container');
    const searchModeSelect = document.getElementById('search-mode-select');
    
    // Dynamic field wrappers
    const leagueInputWrapper = document.getElementById('league-input-wrapper');
    const teamInputWrapper = document.getElementById('team-input-wrapper');
    const dateInputWrapper = document.getElementById('date-input-wrapper');
    const idInputWrapper = document.getElementById('id-input-wrapper');
    const seasonInputWrapper = document.getElementById('season-input-wrapper');

    // Inputs
    const leagueIdInput = document.getElementById('league-id-input');
    const teamIdInput = document.getElementById('team-id-input');
    const dateInput = document.getElementById('date-input');
    const fixtureIdInput = document.getElementById('fixture-id-input');
    const seasonInput = document.getElementById('season-input');

    // --- Function to toggle visible input fields ---
    function updateSearchUI() {
        const currentMode = searchModeSelect.value;
        
        leagueInputWrapper.classList.add('hidden-input');
        teamInputWrapper.classList.add('hidden-input');
        dateInputWrapper.classList.add('hidden-input');
        idInputWrapper.classList.add('hidden-input');
        seasonInputWrapper.classList.add('hidden-input'); 

        if (currentMode === 'league') {
            leagueInputWrapper.classList.remove('hidden-input');
            seasonInputWrapper.classList.remove('hidden-input');
        } else if (currentMode === 'team') {
            teamInputWrapper.classList.remove('hidden-input');
            seasonInputWrapper.classList.remove('hidden-input');
        } else if (currentMode === 'date') {
            dateInputWrapper.classList.remove('hidden-input');
        } else if (currentMode === 'id') {
            idInputWrapper.classList.remove('hidden-input');
        }
    }

    // Add listener to toggle UI on select change
    // Check if element exists first
    if (searchModeSelect) {
        searchModeSelect.addEventListener('change', updateSearchUI);
        updateSearchUI(); // Run once on load
    }

    // --- Search Button Click Listener ---
    if (searchButton) {
        searchButton.addEventListener('click', () => {
            const currentMode = searchModeSelect.value;
            let apiUrl = 'https://v3.football.api-sports.io/fixtures?';
            let isValid = false;

            if (currentMode === 'league') {
                const leagueId = leagueIdInput.value.trim();
                const season = seasonInput.value.trim();
                if (leagueId && season) {
                    apiUrl += `league=${leagueId}&season=${season}`;
                    isValid = true;
                } else {
                    fixturesContainer.innerHTML = "<p>Please enter both League ID and Season.</p>";
                }
            } else if (currentMode === 'team') {
                const teamId = teamIdInput.value.trim();
                const season = seasonInput.value.trim();
                if (teamId && season) {
                    apiUrl += `team=${teamId}&season=${season}`;
                    isValid = true;
                } else {
                    fixturesContainer.innerHTML = "<p>Please enter both Team ID and Season.</p>";
                }
            } else if (currentMode === 'date') {
                const date = dateInput.value;
                if (date) {
                    apiUrl += `date=${date}`;
                    isValid = true;
                } else {
                    fixturesContainer.innerHTML = "<p>Please select a Date.</p>";
                }
            } else if (currentMode === 'id') {
                const fixtureId = fixtureIdInput.value.trim();
                if (fixtureId) {
                    apiUrl += `id=${fixtureId}`;
                    isValid = true;
                } else {
                    fixturesContainer.innerHTML = "<p>Please enter a Fixture ID.</p>";
                }
            } else if (currentMode === 'live') {
                apiUrl += `live=all`;
                isValid = true;
            }

            if (!isValid) return;
            
            fixturesContainer.innerHTML = "<p>Loading fixtures data...</p>";
            
            fetch(apiUrl, fetchOptions)
                .then(handleResponse)
                .then(data => {
                    console.log('Fixtures Results:', data);
                    if (data.errors && (data.errors.required || data.errors.requests)) {
                        let errorMsg = data.errors.required || data.errors.requests;
                        fixturesContainer.innerHTML = `<p>Error: ${errorMsg}</p>`;
                    } else {
                        displayFixtures(data.response, fixturesContainer); 
                    }
                })
                .catch(error => {
                    console.error('Fetch error:', error);
                    fixturesContainer.innerHTML = `<p>An error occurred while fetching data. ${error.message}</p>`;
                });
        });
    }

    // --- Function to display fixture cards ---
    function displayFixtures(fixtures, containerElement) {
        if (!containerElement) return; // Exit if container not found
        containerElement.innerHTML = ""; 
        if (!fixtures || fixtures.length === 0) {
            containerElement.innerHTML = "<p>No fixtures found for this search.</p>";
            return;
        }
        
        fixtures.forEach(item => {
            const fixture = item.fixture;
            const league = item.league;
            const teams = item.teams;
            const goals = item.goals;
            const score = item.score;

            const status = fixture.status.long;
            const statusShort = fixture.status.short;
            const venue = fixture.venue.name || 'N/A';
            const leagueName = league.name;
            const round = league.round;

            const fixtureDate = new Date(fixture.date).toLocaleString('en-US', {
                year: 'numeric', month: 'long', day: 'numeric',
                hour: '2-digit', minute: '2-digit', hour12: true
            });

            const homeTeam = teams.home.name;
            const homeLogo = teams.home.logo;
            const homeWinner = teams.home.winner;
            
            const awayTeam = teams.away.name;
            const awayLogo = teams.away.logo;
            const awayWinner = teams.away.winner;

            const homeGoals = goals.home !== null ? goals.home : '-';
            const awayGoals = goals.away !== null ? goals.away : '-';
            const homeHalf = score.halftime.home !== null ? score.halftime.home : '-';
            const awayHalf = score.halftime.away !== null ? score.halftime.away : '-';

            const homeWinnerClass = homeWinner ? 'winner' : '';
            const awayWinnerClass = awayWinner ? 'winner' : '';
            const statusLiveClass = (statusShort === '1H' || statusShort === 'HT' || statusShort === '2H' || statusShort === 'ET' || statusShort === 'P') ? 'live' : '';
            
            const fixtureCard = document.createElement('div');
            fixtureCard.className = 'fixture-card'; 
            
            fixtureCard.innerHTML = `
                <div class="fixture-header">
                    <p><span>${leagueName}</span> - ${round}</p>
                </div>
                <div class="fixture-body">
                    <div class="team ${homeWinnerClass}">
                        <img src="${homeLogo}" alt="${homeTeam}">
                        <span>${homeTeam}</span>
                    </div>
                    <div class="score-box">
                        <h2>${homeGoals} - ${awayGoals}</h2>
                        <p>HT: ${homeHalf} - ${awayHalf}</p>
                    </div>
                    <div class="team ${awayWinnerClass}">
                        <img src="${awayLogo}" alt="${awayTeam}">
                        <span>${awayTeam}</span>
                    </div>
                </div>
                <div class="fixture-footer">
                    <p class="status ${statusLiveClass}">${status}</p>
                    <p>${fixtureDate}</p>
                    <p>@ ${venue}</p>
                </div>
            `;
            containerElement.appendChild(fixtureCard);
        });
    }

    // ======================================================
    // === END: FIXTURES.JS (Page-Specific Logic) ===
    // ======================================================

