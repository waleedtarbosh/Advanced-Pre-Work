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
    // === START: PLAYER_TRANSFERS.JS (Page-Specific Logic) ===
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
    const transfersContainer = document.getElementById('transfers-container');
    const searchModeSelect = document.getElementById('search-mode-select');
    
    const playerInputWrapper = document.getElementById('player-input-wrapper');
    const teamInputWrapper = document.getElementById('team-input-wrapper');

    const playerIdInput = document.getElementById('player-id-input');
    const teamIdInput = document.getElementById('team-id-input');

    // --- Function to toggle visible input fields ---
    function updateSearchUI() {
        const currentMode = searchModeSelect.value;
        
        if (currentMode === 'player') {
            playerInputWrapper.classList.remove('hidden-input');
            teamInputWrapper.classList.add('hidden-input');
        } else if (currentMode === 'team') {
            playerInputWrapper.classList.add('hidden-input');
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
            let apiUrl = 'https://v3.football.api-sports.io/transfers?';
            let isValid = false;

            if (currentMode === 'player') {
                const playerId = playerIdInput.value.trim();
                if (playerId) {
                    apiUrl += `player=${playerId}`;
                    isValid = true;
                } else {
                    transfersContainer.innerHTML = "<p>Please enter a Player ID.</p>";
                }

            } else if (currentMode === 'team') {
                const teamId = teamIdInput.value.trim();
                if (teamId) {
                    apiUrl += `team=${teamId}`;
                    isValid = true;
                } else {
                    transfersContainer.innerHTML = "<p>Please enter a Team ID.</p>";
                }
            }

            if (!isValid) return;
            
            transfersContainer.innerHTML = "<p>Loading transfers data...</p>";
            
            fetch(apiUrl, fetchOptions)
                .then(handleResponse)
                .then(data => {
                    console.log('Transfers Results:', data);
                    if (data.errors && (data.errors.required || data.errors.requests)) {
                        let errorMsg = data.errors.required || data.errors.requests;
                        transfersContainer.innerHTML = `<p>Error: ${errorMsg}</p>`;
                    } else {
                        displayTransfers(data.response, transfersContainer); 
                    }
                })
                .catch(error => {
                    console.error('Fetch error:', error);
                    transfersContainer.innerHTML = `<p>An error occurred while fetching data. ${error.message}</p>`;
                });
        });
    }

    // --- (New) Function to display transfer cards ---
    function displayTransfers(transferData, containerElement) {
        if (!containerElement) return;

        containerElement.innerHTML = ""; 
        if (!transferData || transferData.length === 0) {
            containerElement.innerHTML = "<p>No transfers found for this search.</p>";
            return;
        }
        
        // Response structure is: [ { player: {...}, transfers: [...] }, ... ]
        // This iterates for each player found (when searching by team)
        transferData.forEach(item => {
            const player = item.player;
            const transfers = item.transfers;

            // Add a header for the player's name
            const playerHeader = document.createElement('h2');
            playerHeader.className = 'player-transfer-header';
            playerHeader.textContent = player.name;
            containerElement.appendChild(playerHeader);

            if (!transfers || transfers.length === 0) {
                containerElement.innerHTML += "<p>No transfer history found for this player.</p>";
                return;
            }

            // Iterate over each transfer for this player
            transfers.forEach(transfer => {
                const transferDate = new Date(transfer.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });
                const transferType = transfer.type || 'N/A';
                
                // Handle cases where a team is N/A (e.g., "Retired")
                const teamIn = transfer.teams.in || { name: 'N/A', logo: '' };
                const teamOut = transfer.teams.out || { name: 'N/A', logo: '' };
                
                const transferCard = document.createElement('div');
                transferCard.className = 'transfer-card';

                transferCard.innerHTML = `
                    <div class="transfer-details">
                        <span><strong>Date:</strong> ${transferDate}</span>
                        <span>${transferType}</span>
                    </div>
                    <div class="transfer-teams">
                        <div class="team-box">
                            <span class="label">FROM</span>
                            <img src="${teamOut.logo || 'img/default-team.png'}" alt="${teamOut.name}">
                            <span>${teamOut.name}</span>
                        </div>
                        <div class="transfer-arrow">&rarr;</div>
                        <div class="team-box">
                            <span class="label">TO</span>
                            <img src="${teamIn.logo || 'img/default-team.png'}" alt="${teamIn.name}">
                            <span>${teamIn.name}</span>
                        </div>
                    </div>
                `;
                containerElement.appendChild(transferCard);
            });
        });
    }

    // ======================================================
    // === END: PLAYER_TRANSFERS.JS (Page-Specific Logic) ===
    // ======================================================

}); // End of DOMContentLoaded