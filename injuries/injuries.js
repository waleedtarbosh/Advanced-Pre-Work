document.addEventListener('DOMContentLoaded', () => {

    // ======================================================
    // === START: NAVBAR JS (Merged) ===
    // ======================================================

    // --- 1. Hamburger Menu Code (Toggle main menu) ---
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const navMenu = document.getElementById('nav-links-menu');

    if (hamburgerBtn && navMenu) {
        hamburgerBtn.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }

    // --- 2. Code to open "Players" submenu on mobile click ---
    const dropdowns = document.querySelectorAll('.nav-links .dropdown');

    dropdowns.forEach(dropdown => {
        const toggleLink = dropdown.querySelector('.dropdown-toggle');
        
        if (toggleLink) {
            toggleLink.addEventListener('click', (event) => {
                if (hamburgerBtn && hamburgerBtn.offsetParent !== null) { 
                    event.preventDefault(); 
                    dropdown.classList.toggle('open');
                }
            });
        }
    });

    // --- 3. Code to control "Players" arrow visibility (hide on desktop) ---
    function handleArrowVisibility() {
        const hamburgerBtn = document.getElementById('hamburger-btn'); 
        const dropdownToggle = document.querySelector('.dropdown-toggle');
        
        if (dropdownToggle && hamburgerBtn) {
            if (hamburgerBtn.offsetParent === null) { 
                dropdownToggle.style.setProperty('--arrow-display', 'none');
            } else {
                dropdownToggle.style.setProperty('--arrow-display', 'inline-block');
            }
        }
    }

    handleArrowVisibility();
    window.addEventListener('resize', handleArrowVisibility);

    // ======================================================
    // === END: NAVBAR JS ===
    // ======================================================


    // ======================================================
    // === START: INJURIES.JS (Page-Specific Logic) ===
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
    const injuriesContainer = document.getElementById('injuries-container');
    const searchModeSelect = document.getElementById('search-mode-select');
    
    // Dynamic field wrappers
    const leagueInputWrapper = document.getElementById('league-input-wrapper');
    const teamInputWrapper = document.getElementById('team-input-wrapper');
    const playerInputWrapper = document.getElementById('player-input-wrapper');
    const fixtureInputWrapper = document.getElementById('fixture-input-wrapper');
    const seasonInputWrapper = document.getElementById('season-input-wrapper');

    // Inputs
    const leagueIdInput = document.getElementById('league-id-input');
    const teamIdInput = document.getElementById('team-id-input');
    const playerIdInput = document.getElementById('player-id-input');
    const fixtureIdInput = document.getElementById('fixture-id-input');
    const seasonInput = document.getElementById('season-input');

    // --- Function to toggle visible input fields ---
    function updateSearchUI() {
        const currentMode = searchModeSelect.value;
        
        // Hide all dynamic fields first
        leagueInputWrapper.classList.add('hidden-input');
        teamInputWrapper.classList.add('hidden-input');
        playerInputWrapper.classList.add('hidden-input');
        fixtureInputWrapper.classList.add('hidden-input');
        seasonInputWrapper.classList.add('hidden-input'); // Also hide season

        if (currentMode === 'fixture') {
            // Show only fixture field
            fixtureInputWrapper.classList.remove('hidden-input');
        } else {
            // Show season field
            seasonInputWrapper.classList.remove('hidden-input');
            
            // Show the selected field (league, team, player)
            if (currentMode === 'league') {
                leagueInputWrapper.classList.remove('hidden-input');
            } else if (currentMode === 'team') {
                teamInputWrapper.classList.remove('hidden-input');
            } else if (currentMode === 'player') {
                playerInputWrapper.classList.remove('hidden-input');
            }
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
            let apiUrl = 'https://v3.football.api-sports.io/injuries?';
            let isValid = false;

            if (currentMode === 'fixture') {
                const fixtureId = fixtureIdInput.value.trim();
                if (fixtureId) {
                    apiUrl += `fixture=${fixtureId}`;
                    isValid = true;
                } else {
                    injuriesContainer.innerHTML = "<p>Please enter a Fixture ID.</p>";
                }
            } else {
                // Other modes require season
                const season = seasonInput.value.trim();
                if (!season) {
                    injuriesContainer.innerHTML = "<p>Please enter a Season.</p>";
                    return;
                }

                if (currentMode === 'league') {
                    const leagueId = leagueIdInput.value.trim();
                    if (leagueId) {
                        apiUrl += `league=${leagueId}&season=${season}`;
                        isValid = true;
                    } else {
                        injuriesContainer.innerHTML = "<p>Please enter a League ID.</p>";
                    }
                } else if (currentMode === 'team') {
                    const teamId = teamIdInput.value.trim();
                    if (teamId) {
                        apiUrl += `team=${teamId}&season=${season}`;
                        isValid = true;
                    } else {
                        injuriesContainer.innerHTML = "<p>Please enter a Team ID.</p>";
                    }
                } else if (currentMode === 'player') {
                    const playerId = playerIdInput.value.trim();
                    if (playerId) {
                        apiUrl += `player=${playerId}&season=${season}`;
                        isValid = true;
                    } else {
                        injuriesContainer.innerHTML = "<p>Please enter a Player ID.</p>";
                    }
                }
            }

            if (!isValid) return;
            
            injuriesContainer.innerHTML = "<p>Loading injuries data...</p>";
            
            fetch(apiUrl, fetchOptions)
                .then(handleResponse)
                .then(data => {
                    console.log('Injuries Results:', data);
                    if (data.errors && (data.errors.required || data.errors.requests)) {
                        let errorMsg = data.errors.required || data.errors.requests;
                        injuriesContainer.innerHTML = `<p>Error: ${errorMsg}</p>`;
                    } else {
                        displayInjuries(data.response, injuriesContainer); 
                    }
                })
                .catch(error => {
                    console.error('Fetch error:', error);
                    injuriesContainer.innerHTML = `<p>An error occurred while fetching data. ${error.message}</p>`;
                });
        });
    }

    // --- Function to display injury cards ---
    function displayInjuries(injuries, containerElement) {
        if (!containerElement) return;
        
        containerElement.innerHTML = ""; 
        if (!injuries || injuries.length === 0) {
            containerElement.innerHTML = "<p>No injuries found for this search.</p>";
            return;
        }
        
        // Response structure is: [ { player: {...}, team: {...}, fixture: {...}, league: {...} } ]
        injuries.forEach(item => {
            const player = item.player;
            const team = item.team;
            const fixture = item.fixture;

            // Extract data
            const playerName = player.name || 'N/A';
            const playerPhoto = player.photo || 'img/default-player.png'; // Fallback image
            const injuryType = player.type || 'N/A';
            const injuryReason = player.reason || 'N/A';
            
            const teamName = team.name || 'N/A';
            const teamLogo = team.logo || 'img/default-team.png'; // Fallback image
            
            const fixtureDate = new Date(fixture.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });

            
            const injuryCard = document.createElement('div');
            injuryCard.className = 'injury-card'; 
            
            // Build injury card
            injuryCard.innerHTML = `
                <img src="${playerPhoto}" alt="${playerName}" class="injury-photo">
                <div class="injury-details">
                    <div class="injury-header">
                        <h2>${playerName}</h2>
                        <span class="team">
                            <img src="${teamLogo}" alt="${teamName}">
                            ${teamName}
                        </span>
                    </div>
                    <div class="injury-body">
                        <p><strong>Reason:</strong> <span class="reason">${injuryReason}</span></p>
                        <p><strong>Status:</strong> ${injuryType}</p>
                        <p><strong>Date:</strong> ${fixtureDate}</p>
                    </div>
                </div>
            `;
            containerElement.appendChild(injuryCard);
        });
    }

    // ======================================================
    // === END: INJURIES.JS (Page-Specific Logic) ===
    // ======================================================

}); // End of DOMContentLoaded