document.addEventListener('DOMContentLoaded', () => {
/*--------------------  loader script start ---------------------*/

function loader(){
    // First, find the element
    const loaderElement = document.querySelector('.loader-container');
    
    // Check if it exists before using it
    if (loaderElement) {
        loaderElement.classList.add('fade-out');
    }
}
 
function fadeOut(){
    // This will run the 'loader' function once after 3000ms (3 seconds)
    // Using setInterval (like your old code) works, but setTimeout is cleaner
    // because you only need to hide it once.
    setTimeout(loader, 3000);
}
 
// We assign the function 'fadeOut' to run AFTER the window loads
// Your old code 'window.onload = fadeOut();' was a bug
// that ran the function immediately. This is the correct way:
window.onload = fadeOut;

/*--------------------  loader script end ---------------------*/

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
                // Check if the hamburger button is visible (mobile view)
                if (hamburgerBtn && hamburgerBtn.offsetParent !== null) { 
                    event.preventDefault(); // Prevent navigating to "#"
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
            // If hamburger is null (not visible), we are on desktop
            if (hamburgerBtn.offsetParent === null) { 
                // Hide the arrow
                dropdownToggle.style.setProperty('--arrow-display', 'none');
            } else {
                // Show the arrow
                dropdownToggle.style.setProperty('--arrow-display', 'inline-block');
            }
        }
    }

    // Run once on load and again on resize
    handleArrowVisibility();
    window.addEventListener('resize', handleArrowVisibility);

    // ======================================================
    // === END: NAVBAR JS ===
    // ======================================================
    
    // --- 4. NEW: CR7 Goal Counter ---
    function startGoalCounter() {
        
        // Get the elements we added IDs to
        const digit1 = document.getElementById('digit-1');
        const digit2 = document.getElementById('digit-2');
        const digit3 = document.getElementById('digit-3');
        const digit4 = document.getElementById('digit-4');

        // Make sure all elements exist before starting
        if (!digit1 || !digit2 || !digit3 || !digit4) {
            console.error("Counter elements not found. Check HTML IDs.");
            return; // Stop the function if elements are missing
        }

        const digits = [digit1, digit2, digit3, digit4];

        // --- Counter Settings (You can edit these) ---
        const startValue = 953;   // The number to start from (and reset to)
        let currentValue = 953;   // The current number
        const endValue = 1000;  // The number to count to
        const speed = 150;      // The speed of the counter (in milliseconds)
        // ------------------------------------

        const counterInterval = setInterval(() => {
            
            // 1. Check if the counter passed the end value
            if (currentValue > endValue) {
                // Instead of stopping, reset the counter to the start value
                currentValue = startValue; // Reset to 953
            }

            // 2. Format the number (e.g., 953 -> "0953")
            let numString = currentValue.toString().padStart(4, '0');

            // 3. Update each digit span
            for (let i = 0; i < digits.length; i++) {
                // Only update the text if the digit has changed
                if (digits[i].textContent !== numString[i]) {
                    digits[i].textContent = numString[i];
                    
                    // Add a "pop" effect for the CSS animation
                    digits[i].classList.add('digit-pop');
                    // Remove the class after the animation finishes
                    setTimeout(() => {
                        digits[i].classList.remove('digit-pop');
                    }, 200); // Must match the animation duration in CSS
                }
            }
            
            // 4. Increment the counter for the next interval
            currentValue++;

        }, speed);
    }
    
    // Run the counter function when the page is loaded
    startGoalCounter();

});