// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM loaded - preparing to apply premium effects");
    
    // Wait a bit to ensure all elements are properly loaded and styles applied
    setTimeout(function() {
        console.log("Starting premium content visual effects application");
        applyPremiumEffects();
    }, 300);
});

function applyPremiumEffects() {
    // Get premium game paths from the page if available
    let premiumGamePaths = [];
    try {
        // Try to get the premiumGamePaths array from the page
        const scripts = document.querySelectorAll('script');
        for (let i = 0; i < scripts.length; i++) {
            if (scripts[i].textContent && scripts[i].textContent.includes('premiumGamePaths =')) {
                const scriptContent = scripts[i].textContent;
                const pathsMatch = scriptContent.match(/premiumGamePaths\s*=\s*\[([\s\S]*?)\]/);
                if (pathsMatch && pathsMatch[1]) {
                    const pathsStr = pathsMatch[1];
                    // Extract paths from the array definition
                    const pathRegex = /'([^']+)'/g;
                    let match;
                    while ((match = pathRegex.exec(pathsStr)) !== null) {
                        premiumGamePaths.push(match[1]);
                    }
                }
                break;
            }
        }
    } catch (error) {
        console.error("Error extracting premium paths:", error);
    }
    
    console.log(`Found ${premiumGamePaths.length} premium game paths`);
    
    // If we couldn't extract paths, use a fallback approach
    if (premiumGamePaths.length === 0) {
        // Apply to all elements with premium-content class
        const premiumElements = document.querySelectorAll('.premium-content');
        console.log(`Found ${premiumElements.length} premium elements by class`);
        
        premiumElements.forEach(applyPremiumStyle);
    } else {
        // Process all game links and check against premium paths
        const allGameLinks = document.querySelectorAll('.button-container > a');
        console.log(`Found ${allGameLinks.length} total game links to check`);
        
        allGameLinks.forEach(function(gameLink) {
            const href = gameLink.getAttribute('href');
            
            // Check if this link matches any premium game path
            const isPremium = premiumGamePaths.some(path => 
                href && href.toLowerCase().includes(path.toLowerCase())
            );
            
            if (isPremium) {
                // Add premium-content class if not already present
                if (!gameLink.classList.contains('premium-content')) {
                    gameLink.classList.add('premium-content');
                }
                
                // Apply styling
                applyPremiumStyle(gameLink);
            }
        });
    }
}

function applyPremiumStyle(element) {
    // Find the button element
    const button = element.querySelector('.button');
    if (!button) return;
    
    console.log("Applying premium style to:", element.getAttribute('href') || "unknown");
    
    // Clear any previous premium elements
    const existingOverlay = button.querySelector('.premium-overlay');
    if (existingOverlay) existingOverlay.remove();
    
    // Apply blur effect directly to the button background using CSS
    button.style.position = 'relative';
    button.style.overflow = 'hidden';
    
    // Create a pseudo-element effect for the blur
    const blurOverlay = document.createElement('div');
    blurOverlay.style.position = 'absolute';
    blurOverlay.style.top = '0';
    blurOverlay.style.left = '0';
    blurOverlay.style.width = '100%';
    blurOverlay.style.height = '100%';
    blurOverlay.style.backdropFilter = 'blur(5px)';
    blurOverlay.style.webkitBackdropFilter = 'blur(5px)';
    blurOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.2)';
    blurOverlay.style.borderRadius = '16px';
    blurOverlay.style.zIndex = '1';
    
    // Ensure text stays visible
    const heading = button.querySelector('h2');
    if (heading) {
        heading.style.position = 'relative';
        heading.style.zIndex = '5';
        heading.style.textShadow = '0 0 4px #000, 0 0 2px #000';
        
        // Add lock icon to text
        if (!heading.textContent.includes('🔒')) {
            heading.textContent += ' (🔒)';
        }
    }
    
    // Add the blur overlay to the button
    button.insertBefore(blurOverlay, button.firstChild);
    
    // Make sure clicking on the element doesn't cause unwanted effects
    element.addEventListener('click', function(e) {
        if (element.classList.contains('premium-content')) {
            e.preventDefault();
            
            // Show login prompt
            alert("This is premium content. Please log in or create an account to access it.");
            
            // Optional: Redirect to login page
            // window.location.href = "/login.html";
        }
    });
}

// Run the function again after a delay to catch any dynamically loaded content
setTimeout(function() {
    console.log("Re-applying premium effects");
    applyPremiumEffects();
}, 1000);

// Apply effects whenever window is resized (helps with certain rendering issues)
window.addEventListener('resize', function() {
    console.log("Window resized, re-applying premium effects");
    applyPremiumEffects();
});

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