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
    // === START: TOP_ASSISTS.JS (Page-Specific Logic) ===
    // ======================================================

    // --- API Configuration ---
    const apiKey = 'b801cc075516be97da6bd24c81b304c7'; // Remember to change your API key
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
    const leagueIdInput = document.getElementById('league-id-input');
    const seasonInput = document.getElementById('season-input');
    const topAssistsContainer = document.getElementById('topassists-container'); 

    if (searchButton) {
        searchButton.addEventListener('click', () => {
            const leagueId = leagueIdInput.value.trim();
            const season = seasonInput.value.trim();
            
            if (!leagueId || !season) {
                topAssistsContainer.innerHTML = "<p>Please enter both a League ID and a Season.</p>";
                return; 
            }
            
            topAssistsContainer.innerHTML = "<p>Loading top assists...</p>";
            
            // Build the correct URL for top assists
            const apiUrl = `https://v3.football.api-sports.io/players/topassists?league=${leagueId}&season=${season}`;
            
            fetch(apiUrl, fetchOptions)
                .then(handleResponse)
                .then(data => {
                    console.log('Top Assists Results:', data);
                    if (data.errors && (data.errors.required || data.errors.league || data.errors.requests)) {
                        let errorMsg = data.errors.required || data.errors.league || data.errors.requests;
                        topAssistsContainer.innerHTML = `<p>Error: ${errorMsg}</p>`;
                    } else {
                        // Send data to the display function
                        displayTopAssists(data.response, topAssistsContainer); 
                    }
                })
                .catch(error => {
                    console.error('Fetch error:', error);
                    topAssistsContainer.innerHTML = `<p>An error occurred while fetching data. ${error.message}</p>`;
                });
        });
    }

    // --- FUNCTION to display top assists cards ---
    function displayTopAssists(players, containerElement) {
        if (!containerElement) return;

        containerElement.innerHTML = ""; 
        if (!players || players.length === 0) {
            containerElement.innerHTML = "<p>No top assists found for this league and season.</p>";
            return;
        }
        
        // Response structure is: [ { player: {...}, statistics: [ {...} ] } ]
        players.forEach(item => {
            const player = item.player;
            const stats = item.statistics[0]; 

            if (!player || !stats) {
                console.warn("Skipping player with incomplete data:", item);
                return; 
            }

            // --- Extract Data ---
            const playerName = player.name || 'N/A';
            const playerPhoto = player.photo || 'img/default-player.png'; // Fallback
            const teamName = stats.team.name || 'N/A';
            
            const position = stats.games.position || 'N/A';
            const appearances = stats.games.appearences || 0;
            const minutes = stats.games.minutes || 0;
            const rating = stats.games.rating ? parseFloat(stats.games.rating).toFixed(2) : 'N/A';
            
            // The most important data for this page
            const assists = stats.goals.assists !== null ? stats.goals.assists : 0;
            const goals = stats.goals.total || 0;
            
            const yellowCards = stats.cards.yellow || 0;
            const redCards = stats.cards.red || 0;

            
            const playerCard = document.createElement('div');
            playerCard.className = 'player-card'; 
            
            // Build the stats card (with focus on Assists)
            playerCard.innerHTML = `
                <img src="${playerPhoto}" alt="${playerName}" class="player-photo">
                <div class="player-info">
                    <h2>${playerName}</h2>
                    <p><strong>Team:</strong> ${teamName}</p>
                    <p><strong>Assists:</strong> ${assists}</p>
                    <p><strong>Goals:</strong> ${goals}</p>
                    <p><strong>Position:</strong> ${position}</p>
                    <p><strong>Rating:</strong> ${rating}</p>
                    <p><strong>Appearances:</strong> ${appearances} (${minutes} minutes)</p>
                    <p><strong>Cards:</strong> 🟨 ${yellowCards} &nbsp;&nbsp; 🟥 ${redCards}</p>
                </div>
            `;
            containerElement.appendChild(playerCard);
        });
    }

    // ======================================================
    // === END: TOP_ASSISTS.JS (Page-Specific Logic) ===
    // ======================================================

}); // End of DOMContentLoaded