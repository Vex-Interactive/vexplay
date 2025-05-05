const fs = require('fs');
const path = require('path');

// Path to HTML and CSS files
const gamesIndexPath = 'games/index.html';
const gamesCssPath = '/storage/css/games.css';

// Find the CSS file in the codebase
function findCssFile() {
    // Check if the CSS file exists at the expected path
    if (fs.existsSync(gamesCssPath.substring(1))) {
        return gamesCssPath.substring(1);
    }
    
    // Look for any CSS files that might be for games
    const cssFiles = [];
    
    function scanDirectory(dir) {
        const files = fs.readdirSync(dir);
        for (const file of files) {
            const filePath = path.join(dir, file);
            const stats = fs.statSync(filePath);
            
            if (stats.isDirectory()) {
                scanDirectory(filePath);
            } else if (file.endsWith('.css')) {
                cssFiles.push(filePath);
            }
        }
    }
    
    // Start scanning from storage directory
    if (fs.existsSync('storage')) {
        scanDirectory('storage');
    }
    
    // Look for the most likely CSS file for games
    for (const cssFile of cssFiles) {
        if (cssFile.includes('game') || fs.readFileSync(cssFile, 'utf8').includes('.button-container')) {
            console.log(`Found games CSS file: ${cssFile}`);
            return cssFile;
        }
    }
    
    // If we can't find it, return a default path
    return 'storage/css/games.css';
}

try {
    console.log('Updating premium content display...');
    
    // First, find the CSS file and update it
    const cssFilePath = findCssFile();
    let cssContent = '';
    
    try {
        cssContent = fs.readFileSync(cssFilePath, 'utf8');
    } catch (err) {
        console.log(`Could not read CSS file: ${err.message}. Creating a new one.`);
        // If the CSS file doesn't exist, we'll create a new one
        cssContent = '';
    }
    
    // Update CSS to blur only the background image and keep text visible
    // Check if the premium-blur class already exists
    if (!cssContent.includes('.premium-blur')) {
        // Add these styles to the CSS file
        const newCssContent = `
/* Premium content styling */
.premium-blur::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: inherit;
    background-position: center;
    background-size: cover;
    filter: blur(5px);
    opacity: 0.7;
    border-radius: 16px;
    z-index: 1;
}

.premium-content .button h2 {
    position: relative;
    z-index: 5; /* Keep the text above the blur */
    text-shadow: 0 0 3px rgba(0, 0, 0, 0.7); /* Add text shadow for better visibility */
}

.button {
    position: relative;
    overflow: hidden;
}

.premium-overlay {
    background-color: transparent !important;
}

.premium-lock {
    z-index: 5;
    opacity: 0.5;
    width: 30px !important;
    height: 30px !important;
    position: absolute;
    top: 10px;
    right: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.5);
    border-radius: 50%;
}
`;
        cssContent += newCssContent;
        fs.writeFileSync(cssFilePath, cssContent, 'utf8');
        console.log(`Updated CSS file: ${cssFilePath}`);
    } else {
        console.log('CSS already has premium styling, skipping update.');
    }
    
    // Now modify the restrictPremiumContent function in auth.js to change how locks are applied
    const authJsPath = 'storage/js/auth.js';
    
    if (fs.existsSync(authJsPath)) {
        let authJsContent = fs.readFileSync(authJsPath, 'utf8');
        
        // Find the restrictPremiumContent function
        const restrictFunctionStart = authJsContent.indexOf('function restrictPremiumContent()');
        
        if (restrictFunctionStart !== -1) {
            // Find the end of the function
            let braceCount = 0;
            let functionEnd = restrictFunctionStart;
            let foundOpenBrace = false;
            
            for (let i = restrictFunctionStart; i < authJsContent.length; i++) {
                if (authJsContent[i] === '{') {
                    foundOpenBrace = true;
                    braceCount++;
                } else if (authJsContent[i] === '}') {
                    braceCount--;
                    if (foundOpenBrace && braceCount === 0) {
                        functionEnd = i + 1;
                        break;
                    }
                }
            }
            
            // Replace the old function with our new version
            const oldFunction = authJsContent.substring(restrictFunctionStart, functionEnd);
            
            // Create the new function
            const newFunction = `function restrictPremiumContent() {
    // Get all premium content elements
    const premiumElements = document.querySelectorAll('.premium-content');
    
    premiumElements.forEach((element) => {
        // Store original href
        const originalHref = element.getAttribute('href');
        if (originalHref) {
            element.setAttribute('data-original-href', originalHref);
            
            // Make the link open a login prompt instead
            element.setAttribute('href', 'javascript:void(0);');
            element.addEventListener('click', showLoginPrompt);
        }
        
        // Find the button div to apply effects
        const buttonDiv = element.querySelector('.button');
        if (buttonDiv) {
            // Add the blur class to the button element (not directly to the img)
            buttonDiv.classList.add('premium-blur');
            
            // Add lock icon to the text
            const titleElement = buttonDiv.querySelector('h2');
            if (titleElement) {
                if (!titleElement.textContent.includes('🔒')) {
                    titleElement.textContent += ' 🔒';
                }
            }
        }
    });
    
    console.log("Premium content restricted:", premiumElements.length, "items");
}`;
            
            // Replace the old function with the new one
            authJsContent = authJsContent.replace(oldFunction, newFunction);
            
            // Save the updated file
            fs.writeFileSync(authJsPath, authJsContent, 'utf8');
            console.log('Updated restrictPremiumContent function in auth.js');
        } else {
            console.log('Could not find restrictPremiumContent function in auth.js');
        }
    } else {
        console.log(`auth.js not found at ${authJsPath}`);
    }
    
    // Now update the showLoginPrompt function to improve the user experience
    if (fs.existsSync(authJsPath)) {
        let authJsContent = fs.readFileSync(authJsPath, 'utf8');
        
        // Find the showLoginPrompt function
        const promptFunctionStart = authJsContent.indexOf('function showLoginPrompt()');
        
        if (promptFunctionStart !== -1) {
            // Find the end of the function
            let braceCount = 0;
            let functionEnd = promptFunctionStart;
            let foundOpenBrace = false;
            
            for (let i = promptFunctionStart; i < authJsContent.length; i++) {
                if (authJsContent[i] === '{') {
                    foundOpenBrace = true;
                    braceCount++;
                } else if (authJsContent[i] === '}') {
                    braceCount--;
                    if (foundOpenBrace && braceCount === 0) {
                        functionEnd = i + 1;
                        break;
                    }
                }
            }
            
            // Replace the old function with our new version
            const oldFunction = authJsContent.substring(promptFunctionStart, functionEnd);
            
            // Create the new function
            const newFunction = `function showLoginPrompt() {
    // Create overlay
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    overlay.style.display = 'flex';
    overlay.style.justifyContent = 'center';
    overlay.style.alignItems = 'center';
    overlay.style.zIndex = '9999';
    
    // Create dialog
    const dialog = document.createElement('div');
    dialog.style.backgroundColor = '#111';
    dialog.style.padding = '30px';
    dialog.style.borderRadius = '10px';
    dialog.style.maxWidth = '90%';
    dialog.style.width = '400px';
    dialog.style.textAlign = 'center';
    dialog.style.boxShadow = '0 0 20px rgba(0, 0, 0, 0.5)';
    dialog.style.position = 'relative';
    
    // Create close button
    const closeButton = document.createElement('button');
    closeButton.textContent = '×';
    closeButton.style.position = 'absolute';
    closeButton.style.top = '10px';
    closeButton.style.right = '15px';
    closeButton.style.backgroundColor = 'transparent';
    closeButton.style.border = 'none';
    closeButton.style.fontSize = '24px';
    closeButton.style.color = '#aaa';
    closeButton.style.cursor = 'pointer';
    closeButton.onclick = function() {
        document.body.removeChild(overlay);
    };
    
    // Create content
    const title = document.createElement('h2');
    title.textContent = 'Premium Content';
    title.style.color = 'white';
    title.style.marginBottom = '15px';
    
    const message = document.createElement('p');
    message.textContent = 'This content is only available to registered users.';
    message.style.color = '#ddd';
    message.style.marginBottom = '25px';
    
    // Create buttons
    const buttonContainer = document.createElement('div');
    buttonContainer.style.display = 'flex';
    buttonContainer.style.justifyContent = 'center';
    buttonContainer.style.gap = '15px';
    
    const signupButton = document.createElement('a');
    signupButton.textContent = 'Sign Up';
    signupButton.href = '/signup.html';
    signupButton.style.backgroundColor = '#333';
    signupButton.style.color = 'white';
    signupButton.style.padding = '10px 20px';
    signupButton.style.borderRadius = '5px';
    signupButton.style.textDecoration = 'none';
    signupButton.style.fontWeight = 'bold';
    
    const loginButton = document.createElement('a');
    loginButton.textContent = 'Login';
    loginButton.href = '/login.html';
    loginButton.style.backgroundColor = '#333';
    loginButton.style.color = 'white';
    loginButton.style.padding = '10px 20px';
    loginButton.style.borderRadius = '5px';
    loginButton.style.textDecoration = 'none';
    loginButton.style.fontWeight = 'bold';
    
    // Assemble UI
    buttonContainer.appendChild(signupButton);
    buttonContainer.appendChild(loginButton);
    
    dialog.appendChild(closeButton);
    dialog.appendChild(title);
    dialog.appendChild(message);
    dialog.appendChild(buttonContainer);
    
    overlay.appendChild(dialog);
    document.body.appendChild(overlay);
}`;
            
            // Replace the old function with the new one
            authJsContent = authJsContent.replace(oldFunction, newFunction);
            
            // Save the updated file
            fs.writeFileSync(authJsPath, authJsContent, 'utf8');
            console.log('Updated showLoginPrompt function in auth.js');
        } else {
            console.log('Could not find showLoginPrompt function in auth.js');
        }
    }
    
    console.log('\nDone! Premium game thumbnails will now be blurred with visible text and a lock icon.');
    
} catch (error) {
    console.error('Error:', error.message);
    console.error(error.stack);
} 