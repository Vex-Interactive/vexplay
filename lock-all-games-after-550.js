const fs = require('fs');
const path = require('path');

// Path to games index.html file
const gamesIndexPath = 'games/index.html';
const pathProtectionFilePath = 'storage/js/path-protection.js';
const addProtectionFilePath = 'add-protection.js';

try {
    console.log('Scanning games/index.html for ALL games after line 550...');
    // Read the file content
    const content = fs.readFileSync(gamesIndexPath, 'utf8');
    const lines = content.split('\n');
    
    // Find all game links after line 550
    const gameLinks = [];
    let lineNumber = 0;
    
    for (let i = 0; i < lines.length; i++) {
        lineNumber++;
        if (lineNumber <= 550) continue;
        
        const line = lines[i];
        // More aggressive pattern matching to catch all game links
        if (line.includes('href="') && line.includes('.html"')) {
            try {
                // Extract the game path
                const hrefStart = line.indexOf('href="') + 6;
                let hrefEnd = line.indexOf('index.html"', hrefStart);
                
                // If we don't find index.html, just use any .html ending
                if (hrefEnd === -1) {
                    hrefEnd = line.indexOf('.html"', hrefStart);
                    if (hrefEnd === -1) continue;
                    hrefEnd += 5; // Include .html
                } else {
                    hrefEnd += 9; // Include index.html
                }
                
                const fullHref = line.substring(hrefStart, hrefEnd);
                
                // Extract game name from the path
                let gameName;
                
                // Handle different path formats
                if (fullHref.includes('/')) {
                    // Split by / and get the first part that's not empty
                    const parts = fullHref.split('/').filter(p => p.trim() !== '');
                    if (parts.length === 0) continue;
                    gameName = parts[0];
                } else {
                    // If no /, just take the whole path without .html
                    gameName = fullHref.replace('.html', '');
                }
                
                // Clean up any remaining issues
                gameName = gameName.trim();
                if (!gameName || gameName === '') continue;
                
                // Special case for btd/btd, riddleschool/riddleschool, etc.
                if (gameName.includes('/')) {
                    gameName = gameName.split('/')[0];
                }
                
                // Ignore duplicates
                if (!gameName || gameLinks.includes(gameName)) continue;
                
                console.log(`Found game: ${gameName} at line ${lineNumber}`);
                gameLinks.push(gameName);
            } catch (err) {
                console.error(`Error processing line ${lineNumber}: ${err.message}`);
            }
        }
    }
    
    console.log(`Found ${gameLinks.length} games after line 550`);
    
    // Update the DOMContentLoaded script in games/index.html
    console.log('Updating premiumGamePaths in games/index.html...');
    let gamesIndexContent = fs.readFileSync(gamesIndexPath, 'utf8');
    
    // Find the premiumGamePaths array
    const premiumPathsStart = gamesIndexContent.indexOf('const premiumGamePaths = [');
    if (premiumPathsStart === -1) {
        console.error('Could not find premiumGamePaths array in games/index.html');
        process.exit(1);
    }
    
    // Find the end of the array
    const arrayEndIndex = gamesIndexContent.indexOf('];', premiumPathsStart);
    if (arrayEndIndex === -1) {
        console.error('Could not find end of premiumGamePaths array');
        process.exit(1);
    }
    
    // Generate the new array content with ALL games after line 550
    const newPremiumPathsArray = gameLinks.map(game => `                        '/${game}/'`).join(',\n');
    const newArrayContent = `const premiumGamePaths = [\n${newPremiumPathsArray}\n                        // Add more premium game paths as needed\n                    ]`;
    
    // Replace the array
    const oldArrayContent = gamesIndexContent.substring(premiumPathsStart, arrayEndIndex + 1);
    gamesIndexContent = gamesIndexContent.replace(oldArrayContent, newArrayContent);
    
    // Write the updated content back to the file
    fs.writeFileSync(gamesIndexPath, gamesIndexContent, 'utf8');
    console.log(`Updated games/index.html with ${gameLinks.length} premium games`);
    
    // Update path-protection.js
    console.log('Updating premiumPaths in path-protection.js...');
    let updatedPathProtectionContent = fs.readFileSync(pathProtectionFilePath, 'utf8');
    
    // Find the premiumPaths array
    const protectionPremiumPathsStart = updatedPathProtectionContent.indexOf('const premiumPaths = [');
    if (protectionPremiumPathsStart === -1) {
        console.error('Could not find premiumPaths array in path-protection.js');
        process.exit(1);
    }
    
    // Find the end of the array
    const protectionArrayEndIndex = updatedPathProtectionContent.indexOf('];', protectionPremiumPathsStart);
    if (protectionArrayEndIndex === -1) {
        console.error('Could not find end of premiumPaths array');
        process.exit(1);
    }
    
    // Build new array content for path-protection.js
    const newProtectionPremiumPathsArray = gameLinks.map(game => `        '${game}'`).join(',\n');
    const newProtectionArrayContent = `const premiumPaths = [\n        // Add specific game and app paths that should be restricted\n        // These would be games after line 550 in games/index.html\n        // And apps after line 82 in apps/index.html\n${newProtectionPremiumPathsArray}\n        // Add more premium game paths as needed\n    ]`;
    
    // Replace the array
    const oldProtectionArrayContent = updatedPathProtectionContent.substring(protectionPremiumPathsStart, protectionArrayEndIndex + 1);
    updatedPathProtectionContent = updatedPathProtectionContent.replace(oldProtectionArrayContent, newProtectionArrayContent);
    
    // Write the updated content back to the file
    fs.writeFileSync(pathProtectionFilePath, updatedPathProtectionContent, 'utf8');
    console.log(`Updated path-protection.js with ${gameLinks.length} premium games`);
    
    // Update add-protection.js
    console.log('Updating premiumGames in add-protection.js...');
    let updatedAddProtectionContent = fs.readFileSync(addProtectionFilePath, 'utf8');
    
    // Find the premiumGames array
    const addProtectionPremiumGamesStart = updatedAddProtectionContent.indexOf('const premiumGames = [');
    if (addProtectionPremiumGamesStart === -1) {
        console.error('Could not find premiumGames array in add-protection.js');
        process.exit(1);
    }
    
    // Find the end of the array
    const addProtectionArrayEndIndex = updatedAddProtectionContent.indexOf('];', addProtectionPremiumGamesStart);
    if (addProtectionArrayEndIndex === -1) {
        console.error('Could not find end of premiumGames array');
        process.exit(1);
    }
    
    // Build new array content
    const newAddProtectionPremiumGamesArray = gameLinks.map(game => `    '${game}'`).join(',\n');
    const newAddProtectionArrayContent = `const premiumGames = [\n${newAddProtectionPremiumGamesArray}\n]`;
    
    // Replace the array
    const oldAddProtectionArrayContent = updatedAddProtectionContent.substring(addProtectionPremiumGamesStart, addProtectionArrayEndIndex + 1);
    updatedAddProtectionContent = updatedAddProtectionContent.replace(oldAddProtectionArrayContent, newAddProtectionArrayContent);
    
    // Write the updated content back to the file
    fs.writeFileSync(addProtectionFilePath, updatedAddProtectionContent, 'utf8');
    console.log(`Updated add-protection.js with ${gameLinks.length} premium games`);
    
    // Run add-protection.js to apply protection to all new premium game files
    console.log('\nRunning add-protection.js to add protection to all premium games...');
    require('./add-protection.js');
    
    console.log('\nDone! All games after line 550 are now locked.');
    
} catch (error) {
    console.error('Error:', error.message);
    console.error(error.stack);
} 