document.addEventListener('DOMContentLoaded', function() {
    // Apply blurring to all premium games
    setTimeout(applyPremiumVisualEffects, 200); // Give time for the DOM to fully initialize
});

function applyPremiumVisualEffects() {
    console.log("Applying premium visual effects...");
    
    // First, identify which games should be premium based on the premiumGamePaths array
    // This ensures we don't rely on the .premium-content class being properly set
    let premiumPaths = [];
    
    try {
        // Get the paths from the global variable if it exists
        const scriptTags = document.querySelectorAll('script');
        for (const script of scriptTags) {
            if (script.textContent.includes('premiumGamePaths')) {
                // Extract the array
                const content = script.textContent;
                const arrayStart = content.indexOf('const premiumGamePaths = [');
                if (arrayStart !== -1) {
                    const arrayEnd = content.indexOf('];', arrayStart);
                    if (arrayEnd !== -1) {
                        const arrayText = content.substring(arrayStart, arrayEnd + 1);
                        // Use regex to extract paths from the array text
                        const pathRegex = /'([^']+)'/g;
                        let match;
                        while ((match = pathRegex.exec(arrayText)) !== null) {
                            premiumPaths.push(match[1]);
                        }
                    }
                }
            }
        }
    } catch (e) {
        console.error("Error extracting premium paths:", e);
    }
    
    console.log(`Found ${premiumPaths.length} premium paths in the script`);
    
    // Find all game links and mark the premium ones based on href
    const allGameLinks = document.querySelectorAll('.button-container > a');
    console.log(`Found ${allGameLinks.length} total game links`);
    
    allGameLinks.forEach((link) => {
        const href = link.getAttribute('href');
        if (!href) return;
        
        // Check if this link matches any premium path
        const isPremium = premiumPaths.some(path => {
            // Remove leading and trailing slashes for comparison
            const cleanPath = path.replace(/^\/|\/$/g, '');
            return href.includes(cleanPath);
        });
        
        if (isPremium) {
            // Mark as premium content
            link.classList.add('premium-content');
            console.log(`Marked as premium: ${href}`);
        }
    });
    
    // Now apply the blur effect to all premium-content elements
    const premiumElements = document.querySelectorAll('.premium-content');
    console.log(`Found ${premiumElements.length} premium elements after classification`);
    
    premiumElements.forEach((element, index) => {
        // Find the button div
        const buttonDiv = element.querySelector('.button');
        if (!buttonDiv) return;
        
        // Get the computed background
        const computedStyle = window.getComputedStyle(buttonDiv);
        const bgImage = computedStyle.backgroundImage;
        
        // Skip if there's no background image
        if (!bgImage || bgImage === 'none') {
            console.log(`Skipping element ${index + 1} - no background image`);
            return;
        }
        
        const bgPosition = computedStyle.backgroundPosition || 'center';
        const bgSize = computedStyle.backgroundSize || 'cover';
        
        // Ensure element has position relative
        buttonDiv.style.position = 'relative';
        buttonDiv.style.overflow = 'hidden';
        
        // Remove any existing blur overlays
        const existingOverlays = buttonDiv.querySelectorAll('.blur-overlay, .dark-overlay');
        existingOverlays.forEach(overlay => overlay.remove());
        
        // Create a new blur overlay for more reliable blurring
        const blurOverlay = document.createElement('div');
        blurOverlay.className = 'blur-overlay';
        blurOverlay.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-image: ${bgImage};
            background-position: ${bgPosition};
            background-size: ${bgSize};
            filter: blur(5px);
            opacity: 0.8;
            border-radius: 16px;
            z-index: 1;
            pointer-events: none;
        `;
        
        // Create a dark overlay on top of the blur for better contrast
        const darkOverlay = document.createElement('div');
        darkOverlay.className = 'dark-overlay';
        darkOverlay.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(0, 0, 0, 0.3);
            border-radius: 16px;
            z-index: 2;
            pointer-events: none;
        `;
        
        // Find the text element and ensure it's above the blur
        const titleElement = buttonDiv.querySelector('h2');
        if (titleElement) {
            titleElement.style.position = 'relative';
            titleElement.style.zIndex = '5';
            titleElement.style.textShadow = '0px 0px 4px #000, 0px 0px 2px #000';
            
            // Add lock icon if not already present
            if (!titleElement.textContent.includes('🔒')) {
                titleElement.textContent += ' 🔒';
            }
        }
        
        // Add the overlays to the button div
        buttonDiv.insertBefore(blurOverlay, buttonDiv.firstChild);
        buttonDiv.insertBefore(darkOverlay, buttonDiv.firstChild);
        
        // Make sure the button doesn't have its own blur
        buttonDiv.style.filter = 'none';
        
        // Remove any existing click listeners to prevent duplicate handlers
        const clonedElement = element.cloneNode(true);
        element.parentNode.replaceChild(clonedElement, element);
        
        // Get the new reference after cloning
        const newElement = clonedElement;
        
        // Ensure clicking opens the login prompt
        if (newElement.getAttribute('href') !== 'javascript:void(0);') {
            newElement.setAttribute('data-original-href', newElement.getAttribute('href'));
            newElement.setAttribute('href', 'javascript:void(0);');
            newElement.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                if (typeof window.showLoginPrompt === 'function') {
                    window.showLoginPrompt();
                } else {
                    // Create a custom login prompt if the global function isn't available
                    createCustomLoginPrompt();
                }
                return false;
            });
        }
    });
    
    console.log("Premium visual effects applied");
}

// Custom login prompt function if the global one isn't available
function createCustomLoginPrompt() {
    // Remove any existing prompt
    const existingPrompt = document.querySelector('.custom-login-prompt');
    if (existingPrompt) existingPrompt.remove();
    
    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'custom-login-prompt';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
    `;
    
    // Create dialog
    const dialog = document.createElement('div');
    dialog.style.cssText = `
        background-color: #111;
        padding: 30px;
        border-radius: 10px;
        max-width: 90%;
        width: 400px;
        text-align: center;
        box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
        position: relative;
    `;
    
    // Create close button
    const closeButton = document.createElement('button');
    closeButton.textContent = '×';
    closeButton.style.cssText = `
        position: absolute;
        top: 10px;
        right: 15px;
        background-color: transparent;
        border: none;
        font-size: 24px;
        color: #aaa;
        cursor: pointer;
    `;
    closeButton.onclick = function() {
        document.body.removeChild(overlay);
    };
    
    // Create content
    const title = document.createElement('h2');
    title.textContent = 'Premium Content';
    title.style.cssText = `
        color: white;
        margin-bottom: 15px;
    `;
    
    const message = document.createElement('p');
    message.textContent = 'This content is only available to registered users.';
    message.style.cssText = `
        color: #ddd;
        margin-bottom: 25px;
    `;
    
    // Create buttons
    const buttonContainer = document.createElement('div');
    buttonContainer.style.cssText = `
        display: flex;
        justify-content: center;
        gap: 15px;
    `;
    
    const signupButton = document.createElement('a');
    signupButton.textContent = 'Sign Up';
    signupButton.href = '/signup.html';
    signupButton.style.cssText = `
        background-color: #333;
        color: white;
        padding: 10px 20px;
        border-radius: 5px;
        text-decoration: none;
        font-weight: bold;
    `;
    
    const loginButton = document.createElement('a');
    loginButton.textContent = 'Login';
    loginButton.href = '/login.html';
    loginButton.style.cssText = `
        background-color: #333;
        color: white;
        padding: 10px 20px;
        border-radius: 5px;
        text-decoration: none;
        font-weight: bold;
    `;
    
    // Assemble UI
    buttonContainer.appendChild(signupButton);
    buttonContainer.appendChild(loginButton);
    
    dialog.appendChild(closeButton);
    dialog.appendChild(title);
    dialog.appendChild(message);
    dialog.appendChild(buttonContainer);
    
    overlay.appendChild(dialog);
    document.body.appendChild(overlay);
}

// Add CSS for better styling
const style = document.createElement('style');
style.textContent = `
.premium-content .button {
    position: relative !important;
    overflow: hidden !important;
}

.blur-overlay, .dark-overlay {
    position: absolute !important;
    top: 0 !important;
    left: 0 !important;
    width: 100% !important;
    height: 100% !important;
    border-radius: 16px !important;
    pointer-events: none !important;
}

.blur-overlay {
    filter: blur(5px) !important;
    z-index: 1 !important;
}

.dark-overlay {
    background-color: rgba(0, 0, 0, 0.3) !important;
    z-index: 2 !important;
}

.premium-content .button h2 {
    position: relative !important;
    z-index: 5 !important;
    text-shadow: 0px 0px 4px #000, 0px 0px 2px #000 !important;
}
`;
document.head.appendChild(style); 