const fs = require('fs');
const path = require('path');

// List of premium game folders
// Note: All games past line 490 in games/index.html should be premium
// This list may include games that appear before line 490 for historical reasons
const premiumGames = [
    'fnaf-2',
    'fnaf-3',
    'fnaf-4',
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
    'supermariobros3',
    'thelegendofzelda',
    'warioware',
    'yoshisisland',
    'tinyfishing',
    'tetris',
    'thebindingofisaac'
];

// Premium apps
const premiumApps = [
    'webretro',
    'htmlcoder',
    'v86',
    'calculator',
    'etchasketch',
    'zipopener',
    'godoblocks'
];

// Protection script content
const protectionScript = '<script src="/storage/js/game-protection.js"></script>';

// Function to add protection to HTML files
function addProtectionToFile(filePath) {
    try {
        // Read file
        let fileContent = fs.readFileSync(filePath, 'utf8');
        
        // Check if protection is already added
        if (fileContent.includes(protectionScript)) {
            console.log(`  Protection already exists in ${filePath}`);
            return false;
        }
        
        // Find the head tag
        const headIndex = fileContent.indexOf('</head>');
        if (headIndex === -1) {
            console.log(`  No </head> tag found in ${filePath}`);
            return false;
        }
        
        // Insert the protection script before the closing head tag
        fileContent = fileContent.substring(0, headIndex) + 
                     '\n    ' + protectionScript + 
                     '\n  ' + fileContent.substring(headIndex);
        
        // Write back to file
        fs.writeFileSync(filePath, fileContent, 'utf8');
        
        console.log(`  Protected: ${filePath}`);
        return true;
    } catch (error) {
        console.error(`  Error processing ${filePath}:`, error.message);
        return false;
    }
}

// Function to process a directory
function processDirectory(baseDir, gameFolder) {
    const gamePath = path.join(baseDir, gameFolder);
    
    // Check if directory exists
    if (!fs.existsSync(gamePath)) {
        console.log(`Directory not found: ${gamePath}`);
        return false;
    }
    
    // Find all HTML files in the directory
    const files = fs.readdirSync(gamePath);
    let indexFound = false;
    
    // First try to find index.html
    if (files.includes('index.html')) {
        const filePath = path.join(gamePath, 'index.html');
        indexFound = addProtectionToFile(filePath);
    }
    
    // If index.html wasn't found or couldn't be protected, try other HTML files
    if (!indexFound) {
        for (const file of files) {
            if (file.endsWith('.html') && file !== 'index.html') {
                const filePath = path.join(gamePath, file);
                if (addProtectionToFile(filePath)) {
                    break;
                }
            }
        }
    }
    
    return true;
}

// Main execution
console.log('Adding protection to premium games...');
premiumGames.forEach(game => {
    console.log(`Processing game: ${game}`);
    processDirectory(path.join(__dirname, 'games'), game);
});

console.log('\nAdding protection to premium apps...');
premiumApps.forEach(app => {
    console.log(`Processing app: ${app}`);
    processDirectory(path.join(__dirname, 'apps'), app);
});

console.log('\nProtection script addition complete!'); 