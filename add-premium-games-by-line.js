const fs = require('fs');
const path = require('path');

// Path to games index.html file
const gamesIndexPath = 'games/index.html';
const pathProtectionFilePath = 'storage/js/path-protection.js';
const addProtectionFilePath = 'add-protection.js';

try {
    console.log('Scanning games/index.html for games after line 550...');
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
        if (line.includes('href="') && line.includes('/index.html"')) {
            // Extract the game path
            const hrefStart = line.indexOf('href="') + 6;
            const hrefEnd = line.indexOf('index.html"', hrefStart) - 1;
            const href = line.substring(hrefStart, hrefEnd);
            
            // Ignore games that don't have proper paths
            if (!href || href.includes('..') || !href.includes('/')) continue;
            
            // Get the game name from the path
            const gameName = href.split('/')[0];
            
            // Ignore duplicates
            if (!gameName || gameLinks.includes(gameName)) continue;
            
            gameLinks.push(gameName);
        }
    }
    
    console.log(`Found ${gameLinks.length} games after line 550`);
    
    // Read the current premium games from the JS file
    const pathProtectionContent = fs.readFileSync(pathProtectionFilePath, 'utf8');
    const addProtectionContent = fs.readFileSync(addProtectionFilePath, 'utf8');
    
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
    
    // Build the new premium paths array
    const currentPremiumPaths = [];
    const currentArrayContent = gamesIndexContent.substring(premiumPathsStart, arrayEndIndex);
    
    // Extract current premium paths
    const premiumPathMatches = currentArrayContent.match(/['"]\/([^\/'"]+)\//g);
    if (premiumPathMatches) {
        premiumPathMatches.forEach(match => {
            const path = match.replace(/['"\/]/g, '');
            if (path && !currentPremiumPaths.includes(path)) {
                currentPremiumPaths.push(path);
            }
        });
    }
    
    // Add new paths that aren't already included
    gameLinks.forEach(game => {
        if (!currentPremiumPaths.includes(game)) {
            currentPremiumPaths.push(game);
        }
    });
    
    // Build new array content
    const newPremiumPathsArray = currentPremiumPaths.map(game => `                        '/${game}/'`).join(',\n');
    const newArrayContent = `const premiumGamePaths = [\n${newPremiumPathsArray}\n                        // Add more premium game paths as needed\n                    ]`;
    
    // Replace the array
    const oldArrayContent = gamesIndexContent.substring(premiumPathsStart, arrayEndIndex + 1);
    gamesIndexContent = gamesIndexContent.replace(oldArrayContent, newArrayContent);
    
    // Write the updated content back to the file
    fs.writeFileSync(gamesIndexPath, gamesIndexContent, 'utf8');
    console.log(`Updated games/index.html with ${currentPremiumPaths.length} premium games`);
    
    // Update path-protection.js
    console.log('Updating premiumPaths in path-protection.js...');
    let updatedPathProtectionContent = pathProtectionContent;
    
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
    
    // Extract current premium paths
    const protectionPremiumPaths = [];
    const protectionCurrentArrayContent = updatedPathProtectionContent.substring(protectionPremiumPathsStart, protectionArrayEndIndex);
    
    const protectionPremiumPathMatches = protectionCurrentArrayContent.match(/['"]([^'"]+)['"]/g);
    if (protectionPremiumPathMatches) {
        protectionPremiumPathMatches.forEach(match => {
            const path = match.replace(/['"]/g, '');
            if (path && !protectionPremiumPaths.includes(path)) {
                protectionPremiumPaths.push(path);
            }
        });
    }
    
    // Add new paths that aren't already included
    gameLinks.forEach(game => {
        if (!protectionPremiumPaths.includes(game)) {
            protectionPremiumPaths.push(game);
        }
    });
    
    // Build new array content
    const newProtectionPremiumPathsArray = protectionPremiumPaths.map(game => `        '${game}'`).join(',\n');
    const newProtectionArrayContent = `const premiumPaths = [\n        // Add specific game and app paths that should be restricted\n        // These would be games after line 513 in games/index.html\n        // And apps after line 82 in apps/index.html\n${newProtectionPremiumPathsArray}\n        // Add more premium game paths as needed\n    ]`;
    
    // Replace the array
    const oldProtectionArrayContent = updatedPathProtectionContent.substring(protectionPremiumPathsStart, protectionArrayEndIndex + 1);
    updatedPathProtectionContent = updatedPathProtectionContent.replace(oldProtectionArrayContent, newProtectionArrayContent);
    
    // Write the updated content back to the file
    fs.writeFileSync(pathProtectionFilePath, updatedPathProtectionContent, 'utf8');
    console.log(`Updated path-protection.js with ${protectionPremiumPaths.length} premium games`);
    
    // Update add-protection.js
    console.log('Updating premiumGames in add-protection.js...');
    let updatedAddProtectionContent = addProtectionContent;
    
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
    
    // Extract current premium games
    const addProtectionPremiumGames = [];
    const addProtectionCurrentArrayContent = updatedAddProtectionContent.substring(addProtectionPremiumGamesStart, addProtectionArrayEndIndex);
    
    const addProtectionPremiumGameMatches = addProtectionCurrentArrayContent.match(/['"]([^'"]+)['"]/g);
    if (addProtectionPremiumGameMatches) {
        addProtectionPremiumGameMatches.forEach(match => {
            const game = match.replace(/['"]/g, '');
            if (game && !addProtectionPremiumGames.includes(game)) {
                addProtectionPremiumGames.push(game);
            }
        });
    }
    
    // Add new games that aren't already included
    gameLinks.forEach(game => {
        if (!addProtectionPremiumGames.includes(game)) {
            addProtectionPremiumGames.push(game);
        }
    });
    
    // Build new array content
    const newAddProtectionPremiumGamesArray = addProtectionPremiumGames.map(game => `    '${game}'`).join(',\n');
    const newAddProtectionArrayContent = `const premiumGames = [\n${newAddProtectionPremiumGamesArray}\n]`;
    
    // Replace the array
    const oldAddProtectionArrayContent = updatedAddProtectionContent.substring(addProtectionPremiumGamesStart, addProtectionArrayEndIndex + 1);
    updatedAddProtectionContent = updatedAddProtectionContent.replace(oldAddProtectionArrayContent, newAddProtectionArrayContent);
    
    // Write the updated content back to the file
    fs.writeFileSync(addProtectionFilePath, updatedAddProtectionContent, 'utf8');
    console.log(`Updated add-protection.js with ${addProtectionPremiumGames.length} premium games`);
    
    // Run add-protection.js to apply protection to all new premium games
    console.log('\nRunning add-protection.js to add protection to all premium games...');
    require('./add-protection.js');
    
} catch (error) {
    console.error('Error:', error.message);
    console.error(error.stack);
} 