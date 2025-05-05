const fs = require('fs');
const path = require('path');

// New premium games to add (games after line 750)
const newPremiumGames = [
    'supermariobros3',
    'thelegendofzelda',
    'warioware',
    'yoshisisland',
    'donkeykongland',
    'kirbysdreamland',
    'supermarioland',
    'dogeminer',
    'tanukisunset',
    'aquaparkslides',
    'colorswitch',
    'papasfreezeria',
    'btd',
    'bomberman',
    'fireemblem',
    'iceclimber',
    'mariokartsupercircuit',
    'pokemonleafgreen',
    'pokemonruby',
    'pokemonsapphire',
    'superstarsaga',
    'adofai',
    'supersmashflash',
    'supermeatboy',
    // Add more as needed from the rest of the games
];

// Path to the path-protection.js file
const protectionFilePath = 'storage/js/path-protection.js';

try {
    // Read the file content
    let content = fs.readFileSync(protectionFilePath, 'utf8');
    
    // Find the premiumPaths array
    const premiumPathsStart = content.indexOf('const premiumPaths = [');
    if (premiumPathsStart === -1) {
        console.error('Could not find premiumPaths array in path-protection.js');
        process.exit(1);
    }
    
    // Find the end of the array
    const arrayEndIndex = content.indexOf('];', premiumPathsStart);
    if (arrayEndIndex === -1) {
        console.error('Could not find end of premiumPaths array');
        process.exit(1);
    }
    
    // Extract the current array content
    const arrayContent = content.substring(premiumPathsStart, arrayEndIndex + 1);
    
    // Check which games are already in the list
    const newGamesToAdd = newPremiumGames.filter(game => !arrayContent.includes(`'${game}'`));
    
    if (newGamesToAdd.length === 0) {
        console.log('All games are already in the premium list');
        process.exit(0);
    }
    
    // Create the new array entries
    const newEntries = newGamesToAdd.map(game => `        '${game}',`).join('\n');
    
    // Find where to insert the new entries (before the last entry or comment)
    const insertPosition = content.lastIndexOf(',', arrayEndIndex);
    if (insertPosition === -1) {
        console.error('Could not find position to insert new entries');
        process.exit(1);
    }
    
    // Insert the new entries
    const newContent = content.slice(0, insertPosition + 1) + 
                      '\n' + newEntries + 
                      content.slice(insertPosition + 1);
    
    // Write the updated content back to the file
    fs.writeFileSync(protectionFilePath, newContent, 'utf8');
    
    console.log(`Added ${newGamesToAdd.length} new games to the premium list`);
    console.log('Games added:');
    newGamesToAdd.forEach(game => console.log(`- ${game}`));
    
} catch (error) {
    console.error('Error:', error.message);
}

// Now update the add-protection.js script to include these games
const protectionScriptPath = 'add-protection.js';

try {
    // Read the file content
    let content = fs.readFileSync(protectionScriptPath, 'utf8');
    
    // Find the premiumGames array
    const premiumGamesStart = content.indexOf('const premiumGames = [');
    if (premiumGamesStart === -1) {
        console.error('Could not find premiumGames array in add-protection.js');
        process.exit(1);
    }
    
    // Find the end of the array
    const arrayEndIndex = content.indexOf('];', premiumGamesStart);
    if (arrayEndIndex === -1) {
        console.error('Could not find end of premiumGames array');
        process.exit(1);
    }
    
    // Extract the current array content
    const arrayContent = content.substring(premiumGamesStart, arrayEndIndex + 1);
    
    // Check which games are already in the list
    const newGamesToAdd = newPremiumGames.filter(game => !arrayContent.includes(`'${game}'`));
    
    if (newGamesToAdd.length === 0) {
        console.log('All games are already in the premium list for add-protection.js');
        process.exit(0);
    }
    
    // Create the new array entries
    const newEntries = newGamesToAdd.map(game => `    '${game}',`).join('\n');
    
    // Find where to insert the new entries (before the last entry or comment)
    const insertPosition = content.lastIndexOf(',', arrayEndIndex);
    if (insertPosition === -1) {
        console.error('Could not find position to insert new entries in add-protection.js');
        process.exit(1);
    }
    
    // Insert the new entries
    const newContent = content.slice(0, insertPosition + 1) + 
                      '\n' + newEntries + 
                      content.slice(insertPosition + 1);
    
    // Write the updated content back to the file
    fs.writeFileSync(protectionScriptPath, newContent, 'utf8');
    
    console.log(`\nAdded ${newGamesToAdd.length} new games to the premium list in add-protection.js`);
    
} catch (error) {
    console.error('Error updating add-protection.js:', error.message);
} 