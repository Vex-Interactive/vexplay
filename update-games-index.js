const fs = require('fs');
const path = require('path');

// All premium games (existing + new ones)
const allPremiumGames = [
    // Original premium games
    'riddleschool',
    'driftboss',
    'fnf',
    'pacman',
    'papaspancakeria',
    'rooftop',
    'baldisbasics',
    'bobtherobber2',
    'minesweeper', 
    'pokemonemerald',
    'pokemonfirered',
    'supermariobros',
    'supermariokart',
    'supermarioworld',
    'thereisnogame',
    'worldshardestgame',
    'castlevania',
    'donkeykong',
    'drmario',
    'metroid',
    'supermariobros2',
    // New premium games
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
    'supermeatboy'
];

// Path to games index.html file
const gamesIndexPath = 'games/index.html';

try {
    console.log('Reading games/index.html...');
    // Read the file content
    let content = fs.readFileSync(gamesIndexPath, 'utf8');
    
    // Find the DOMContentLoaded event handler
    const scriptStartIndex = content.indexOf('document.addEventListener(\'DOMContentLoaded\'');
    if (scriptStartIndex === -1) {
        console.error('Could not find DOMContentLoaded script in games/index.html');
        process.exit(1);
    }
    
    // Find the premiumGamePaths array
    const premiumPathsStart = content.indexOf('const premiumGamePaths = [', scriptStartIndex);
    if (premiumPathsStart === -1) {
        console.error('Could not find premiumGamePaths array in games/index.html');
        process.exit(1);
    }
    
    // Find the end of the array
    const arrayEndIndex = content.indexOf('];', premiumPathsStart);
    if (arrayEndIndex === -1) {
        console.error('Could not find end of premiumGamePaths array');
        process.exit(1);
    }
    
    // Build the new premium paths array
    const newPremiumPathsArray = allPremiumGames.map(game => `                        '/${game}/'`).join(',\n');
    
    // Create the new array content
    const newArrayContent = `const premiumGamePaths = [\n${newPremiumPathsArray}\n                        // Add more premium game paths as needed\n                    ]`;
    
    // Replace the array
    const oldArrayContent = content.substring(premiumPathsStart, arrayEndIndex + 1);
    content = content.replace(oldArrayContent, newArrayContent);
    
    // Write the updated content back to the file
    fs.writeFileSync(gamesIndexPath, content, 'utf8');
    
    console.log('Updated games/index.html with new premium games list');
    console.log(`Total premium games: ${allPremiumGames.length}`);
    
} catch (error) {
    console.error('Error:', error.message);
}

// Also run add-protection.js to ensure all premium games have the protection script
console.log('\nRunning add-protection.js to update protection in game files...');
require('./add-protection.js'); 