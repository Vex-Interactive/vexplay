// Check if the user is logged in
function isLoggedIn() {
    return localStorage.getItem('userLoggedIn') === 'true';
}

// Check if the user is a guest
function isGuest() {
    return localStorage.getItem('isGuest') === 'true';
}

// Get user email
function getUserEmail() {
    return localStorage.getItem('userEmail');
}

// Get user ID
function getUserId() {
    return localStorage.getItem('userId');
}

// Check if user can access premium content
function canAccessPremiumContent() {
    // Allow access to premium content for regular users (not guests)
    return isLoggedIn() && !isGuest();
}

// Check if user can access premium games
function canAccessPremiumGames() {
    // Allow ALL users (including guests) to access games
    return true;
}

// Check if user can access premium apps
function canAccessPremiumApps() {
    // Only allow logged-in NON-guest users to access premium apps
    return isLoggedIn() && !isGuest();
}

// Logout function
function logout() {
    localStorage.removeItem('userLoggedIn');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userId');
    localStorage.removeItem('isGuest');
    window.location.href = '/index.html';
}

// Redirect to login if not logged in
function requireLogin() {
    if (!isLoggedIn()) {
        window.location.href = '/login.html';
    }
}

// Apply premium content restrictions
function restrictPremiumContent() {
    // Only apply restrictions if user is not logged in or is a guest
    if (!canAccessPremiumContent()) {
        // Get all premium content elements
        const premiumElements = document.querySelectorAll('.premium-content');
        
        premiumElements.forEach((element) => {
            // Store original href
            const originalHref = element.getAttribute('href');
            if (originalHref) {
                element.setAttribute('data-original-href', originalHref);
                
                // Make the link redirect to login page instead of showing popup
                element.setAttribute('href', '/login.html?redirect=' + encodeURIComponent(originalHref));
            }
            
            // Find the button div to apply effects
            const buttonDiv = element.querySelector('.button');
            if (buttonDiv) {
                // Get computed style to grab the background image
                const computedStyle = window.getComputedStyle(buttonDiv);
                const bgImage = computedStyle.backgroundImage;
                
                // Only if there's a background image
                if (bgImage && bgImage !== 'none') {
                    // Make sure original background image is preserved
                    buttonDiv.style.backgroundImage = bgImage;
                    
                    // Use ::before pseudo-element for blur effect, preserve original background
                    const buttonId = 'button-' + Math.random().toString(36).substr(2, 9);
                    buttonDiv.id = buttonId;
                    
                    const style = document.createElement('style');
                    style.textContent = `
                        #${buttonId}::before {
                            content: '';
                            position: absolute;
                            top: 0;
                            left: 0;
                            width: 100%;
                            height: 100%;
                            background-color: rgba(0, 0, 0, 0.2);
                            backdrop-filter: blur(5px);
                            -webkit-backdrop-filter: blur(5px);
                            border-radius: 16px;
                            z-index: 1;
                            pointer-events: none;
                        }
                    `;
                    document.head.appendChild(style);
                }
                
                // Add lock icon to the text
                const titleElement = buttonDiv.querySelector('h2');
                if (titleElement) {
                    if (!titleElement.textContent.includes('🔒')) {
                        titleElement.textContent += ' 🔒';
                    }
                    titleElement.style.position = 'relative';
                    titleElement.style.zIndex = '5';
                    titleElement.style.textShadow = '0 0 4px #000, 0 0 2px #000';
                }
            }
        });
        
        console.log("Premium content restricted:", premiumElements.length, "items");
    } else {
        console.log("User can access premium content, no visual restrictions applied.");
    }
}

// Create lock icon for premium content
function createLockIcon() {
    // Only apply lock icons if user is not logged in or is a guest
    if (!canAccessPremiumContent()) {
        // Lock icon as data URI
        const lockIconDataURI = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0id2hpdGUiPjxwYXRoIGQ9Ik0xOCA4aC0xVjZjMC0yLjc2LTIuMjQtNS01LTVTNyAzLjI0IDcgNnYySDZjLTEuMSAwLTIgLjktMiAydjEwYzAgMS4xLjkgMiAyIDJoMTJjMS4xIDAgMi0uOSAyLTJWMTBjMC0xLjEtLjktMi0yLTJ6bS02IDljLTEuMSAwLTItLjktMi0ycy45LTIgMi0yIDIgLjkgMiAyLS45IDItMiAyem0zLjEtOUg4LjlWNmMwLTEuNzEgMS4zOS0zLjEgMy4xLTMuMSAxLjcxIDAgMy4xIDEuMzkgMy4xIDMuMXYyeiIvPjwvc3ZnPg==";
        
        // Add style for the lock overlay
        if (!document.getElementById('premium-lock-style')) {
            const style = document.createElement('style');
            style.id = 'premium-lock-style';
            style.textContent = `
                .premium-overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(0, 0, 0, 0.6);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 10;
                    border-radius: 16px;
                }
                
                .premium-lock {
                    background-color: var(--background-color, #222);
                    border: 2px solid var(--border-color2, #444);
                    border-radius: 50%;
                    width: 60px;
                    height: 60px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    opacity: 0.9;
                }
                
                .premium-lock img {
                    width: 30px;
                    height: 30px;
                }
            `;
            document.head.appendChild(style);
        }
        
        // Add lock overlay to premium elements
        const premiumElements = document.querySelectorAll('.premium-content');
        premiumElements.forEach(element => {
            // Create overlay only if it doesn't exist
            if (!element.querySelector('.premium-overlay')) {
                const overlay = document.createElement('div');
                overlay.className = 'premium-overlay';
                
                const lockContainer = document.createElement('div');
                lockContainer.className = 'premium-lock';
                
                const lockIcon = document.createElement('img');
                lockIcon.src = lockIconDataURI;
                lockIcon.alt = 'Premium Content';
                
                lockContainer.appendChild(lockIcon);
                overlay.appendChild(lockContainer);
                
                // Position the target element relatively if it's not already
                if (getComputedStyle(element).position !== 'relative') {
                    element.style.position = 'relative';
                }
                
                // Find the appropriate element to append the overlay to
                const targetElement = element.querySelector('.button') || element;
                targetElement.style.position = 'relative';
                targetElement.appendChild(overlay);
                
                // Make sure overlay is on top
                overlay.style.zIndex = '1000';
            }
        });
    } else {
        console.log("User can access premium content, no lock icons applied.");
    }
}

// Show login prompt - Redirects to login page instead of showing a popup
function showLoginPrompt() {
    // Instead of showing a popup, redirect to login page with redirect parameter
    const currentPath = window.location.pathname;
    window.location.href = '/login.html?redirect=' + encodeURIComponent(window.location.href);
}

// Check if URL is allowed for guests
function isUrlAllowedForGuests(url) {
    // Restrict direct access to premium content links
    const premiumPatterns = [
        // Add patterns for restricted game URLs
    ];
    
    for (const pattern of premiumPatterns) {
        if (url.includes(pattern)) {
            return false;
        }
    }
    
    return true;
}

// Function to remove premium content visual restrictions
function removePremiumVisualRestrictions() {
    // Remove premium content visual restrictions
    document.querySelectorAll('.premium-content').forEach(element => {
        // Restore original href if it exists
        const originalHref = element.getAttribute('data-original-href');
        if (originalHref) {
            element.setAttribute('href', originalHref);
        }
        
        // Remove blur effects from button elements
        const buttonDiv = element.querySelector('.button');
        if (buttonDiv) {
            // Remove the ::before pseudo-element blur effect
            const styleId = 'remove-before-blur-' + Math.random().toString(36).substr(2, 9);
            const styleTag = document.createElement('style');
            styleTag.id = styleId;
            styleTag.textContent = `
                #${buttonDiv.id || 'button-' + styleId}::before {
                    backdrop-filter: none !important;
                    -webkit-backdrop-filter: none !important;
                    background-color: transparent !important;
                }
            `;
            document.head.appendChild(styleTag);
            
            // Give the button an ID if it doesn't have one for the CSS selector
            if (!buttonDiv.id) {
                buttonDiv.id = 'button-' + styleId;
            }
            
            // Remove premium overlays
            const overlays = buttonDiv.querySelectorAll('.premium-overlay');
            overlays.forEach(overlay => {
                overlay.remove();
            });
            
            // Remove lock icon from title
            const titleElement = buttonDiv.querySelector('h2');
            if (titleElement && titleElement.textContent.includes('🔒')) {
                titleElement.textContent = titleElement.textContent.replace(' 🔒', '');
            }
            
            // Make sure button retains its background image but has no filter
            buttonDiv.style.filter = 'none';
            buttonDiv.style.opacity = '1';
            
            // Make all children of the button fully visible
            const buttonChildren = buttonDiv.querySelectorAll('*');
            buttonChildren.forEach(child => {
                child.style.filter = 'none';
                child.style.opacity = '1';
            });
        }
    });
}

// Initialize auth checks on page load
document.addEventListener('DOMContentLoaded', function() {
    // Check if link requires authentication
    if (isGuest()) {
        const currentUrl = window.location.href;
        if (!isUrlAllowedForGuests(currentUrl)) {
            window.location.href = '/login.html?redirect=' + encodeURIComponent(window.location.href);
        }
    }
    
    // Add logout button to navigation if user is logged in
    if (isLoggedIn()) {
        const userSection = document.createElement('div');
        userSection.className = 'user-section';
        
        if (!document.querySelector('.user-section')) {
            const userInfo = isGuest() 
                ? '<span>Guest <span class="guest-badge">Limited Access</span></span>'
                : `<span>${getUserEmail() || 'User'}</span>`;
                
            userSection.innerHTML = `
                ${userInfo}
                <button id="logoutButton">Logout</button>
            `;
            
            // Find the right place to insert the user section
            const linkpElements = document.querySelectorAll('.linkp');
            if (linkpElements.length > 0) {
                const lastLinkp = linkpElements[linkpElements.length - 1];
                lastLinkp.parentNode.insertBefore(userSection, lastLinkp.nextSibling);
            } else {
                // If no .linkp element, try to find the content-side
                const contentSide = document.querySelector('.content-side');
                if (contentSide) {
                    contentSide.appendChild(userSection);
                }
            }
            
            // Add styles
            const style = document.createElement('style');
            style.textContent = `
                .user-section {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                    margin-top: 10px;
                    font-size: 16px;
                }
                
                .user-section button {
                    padding: 5px 10px;
                    background-color: var(--background-color);
                    color: var(--text-color);
                    border: 2px solid var(--border-color2);
                    border-radius: 8px;
                    cursor: pointer;
                    font-family: var(--font-family);
                    transition: background-color 0.15s ease-in-out;
                }
                
                .user-section button:hover {
                    background-color: var(--hover-color);
                }

                .guest-badge {
                    display: inline-block;
                    padding: 3px 8px;
                    background-color: var(--border-color2);
                    border-radius: 8px;
                    font-size: 14px;
                    margin-left: 5px;
                }
            `;
            
            document.head.appendChild(style);
            
            // Add logout event listener
            document.getElementById('logoutButton').addEventListener('click', function() {
                logout();
            });
        }
    }
    
    // IMPORTANT: If user can access premium content, remove all visual restrictions
    if (canAccessPremiumContent()) {
        console.log("User can access premium content - removing visual restrictions");
        removePremiumVisualRestrictions();
        
        // Run again after a short delay to catch any asynchronously applied restrictions
        setTimeout(function() {
            console.log("Running delayed removal of visual restrictions");
            removePremiumVisualRestrictions();
        }, 500);
    }
}); 