// Check if user is logged in
function isUserLoggedIn() {
    return localStorage.getItem('userLoggedIn') === 'true';
}

// Check if user is a guest
function isUserGuest() {
    return localStorage.getItem('isGuest') === 'true';
}

// Check if the current URL contains premium content paths
function isPremiumContentUrl() {
    const currentUrl = window.location.href.toLowerCase();
    console.log("Checking URL:", currentUrl); // Debug
    
    // Define premium content path patterns
    // Note: Games before line 490 in games/index.html should be free
    // But we're keeping this comprehensive list for URL-based protection
    const premiumPaths = [
        // Add specific game and app paths that should be restricted
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
        'stickmanhook',
        'defendthetank',
        'sortthecourt',
        'thisistheonlylevel',
        'run',
        'run2',
        'battleships',
        'breakingthebank',
        'ducklife',
        'ducklife2',
        'ducklife3',
        'linerider',
        'mariocombat',
        'raftwars2',
        'spaceinvaders',
        'animalcrossingwildworld',
        'mariokartds',
        'newsupermariobros',
        'nintendogs',
        'sm64ds',
        'gunmayhem',
        'learntofly',
        'rooftop2',
        'fireboywatergirl',
        'chibiknight',
        'clusterrush',
        'doodledefender',
        'learntofly2',
        'papasscooperia',
        'papassushiria',
        'papaswingeria',
        'raftwars',
        'unfairmario',
        'boxingphysics2',
        'aceattorney',
        'metalgearsolid',
        'mother3',
        'pokemondiamond',
        'pokemonplatinum',
        'pokemonsoulsilver',
        'advancewars',
        'banjopilot',
        'supermonkeyballjr',
        'theimpossiblequiz2',
        'papasdonuteria',
        'fancypantsadventure2',
        'tinyfishing',
        'bigredbutton',
        'achievementunlocked',
        'kirbymassattack',
        'sonicadvance',
        'wormsworldparty',
        'badicecream',
        'badicecream2',
        'badicecream3',
        'adventurecapitalist',
        'monkeymart',
        'doom64',
        'banjokazooie',
        'donkeykong64',
        'fzerox',
        'kirby64',
        'mariokart64',
        'marioparty',
        'marioparty2',
        'ocarinaoftime',
        'starfox64',
        'supersmashbros',
        'streetfighter2',
        'getawayshootout',
        'rabbitsamurai',
        'mariopartyds',
        'professorlayton',
        'scribblenauts',
        'advancewars2',
        'harvestmoon',
        'mariotennis',
        'megamanzero',
        'pokemonmysterydungeon',
        'pokemonunbound',
        'papascheeseria',
        'papascupcakeria',
        'papasbakeria',
        'papaspastaria',
        'gunmayhem2',
        'gunmayhemredux',
        'achievementunlocked2',
        'achievementunlocked3',
        'factoryballs',
        'skywire',
        'supermarioflash',
        'goldensun',
        'metroidfusion',
        'dbzsupersonicwarriors',
        'warioland4',
        'ducklife5',
        'learntofly3',
        'bloxors',
        'electricman2',
        'portal',
        'portal2',
        'skywire2',
        'ducklife6',
        'boxingrandom',
        'cellmachine',
        'stickmanboost',
        'vex3',
        'vex4',
        'skibidi1v100',
        'goldeneye007',
        'majorasmask',
        'papermario',
        'mariogolf',
        'pokemonstadium',
        'excitebike64',
        'pokemonsnap',
        'marioparty3',
        'sonicadvance2',
        'bowsersinsidestory',
        'spirittracks',
        'thesims2',
        'tetrisds',
        'sonicrush',
        'thesims3',
        'superprincesspeach',
        'legobatman',
        'doom2',
        'dukenukemadvance',
        'mariopartyadvance',
        'mariopinballland',
        'pacmanworld',
        'rayman3',
        'raymanadvance',
        'raymanraving',
        'simpsons',
        'spyro',
        'fzero',
        'mariokart',
        'kirby',
        'warioswoods',
        'tetris',
        'sonic',
        'sonic2',
        'sonic3',
        'sonic3k',
        'sonic3air',
        'sonic4',
        'soniccd',
        'sonicmania',
        'worldwariimobile',
        'vectorman',
        'mk1',
        'mk2',
        'mk3',
        'mk4',
        'mkspecialforces',
        'naruto',
        'princeofpersia',
        'r-type',
        'reddead',
        'runman',
        'rct',
        'scpcontainmentbreach',
        'slenderman',
        'spacecompany',
        'spelunky',
        'spore',
        'stardewvalley',
        'starwars',
        'tetrisbattle',
        'thebindingofisaac',
        'tonyhawk',
        'toystory',
        'trackmania',
        'ultrabattleships',
        'undertale',
        'vex5',
        'vex6',
        'vex7',
        'waverace64',
        'webretro',
        'zombocalypse',
        'zombotron',
        'zombotron2',
        'yohoho',
        'finalfantasy',
        // Apps
        'webretro',
        'htmlcoder',
        'v86',
        'calculator',
        'etchasketch',
        'zipopener',
        'godoblocks'
    ];
    
    // Check if URL contains any premium paths
    for (const path of premiumPaths) {
        if (currentUrl.includes(path)) {
            console.log("Premium content detected:", path);
            return true;
        }
    }
    
    return false;
}

// Create a visually appealing full screen protection
function createFullScreenProtection() {
    // Create container
    const container = document.createElement('div');
    container.id = 'premium-protection-overlay';
    container.style.position = 'fixed';
    container.style.top = '0';
    container.style.left = '0';
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.backgroundColor = '#000';
    container.style.display = 'flex';
    container.style.justifyContent = 'center';
    container.style.alignItems = 'center';
    container.style.zIndex = '99999';
    
    // Create dialog box
    const dialog = document.createElement('div');
    dialog.style.backgroundColor = '#111';
    dialog.style.borderRadius = '10px';
    dialog.style.padding = '30px';
    dialog.style.maxWidth = '90%';
    dialog.style.width = '400px';
    dialog.style.textAlign = 'center';
    dialog.style.boxShadow = '0 0 20px rgba(0, 0, 0, 0.5)';
    
    // Lock icon
    const lockIcon = document.createElement('div');
    lockIcon.innerHTML = '🔒';
    lockIcon.style.fontSize = '50px';
    lockIcon.style.marginBottom = '15px';
    
    // Header
    const header = document.createElement('h2');
    header.textContent = 'Premium Content';
    header.style.color = 'white';
    header.style.marginBottom = '15px';
    
    // Message
    const message = document.createElement('p');
    message.textContent = 'This content is only available for registered users.';
    message.style.color = '#ddd';
    message.style.marginBottom = '25px';
    
    // Buttons container
    const buttonsContainer = document.createElement('div');
    buttonsContainer.style.display = 'flex';
    buttonsContainer.style.justifyContent = 'center';
    buttonsContainer.style.gap = '15px';
    
    // Style for buttons
    const buttonStyle = `
        background-color: #333;
        color: white;
        padding: 10px 20px;
        border-radius: 5px;
        text-decoration: none;
        border: none;
        cursor: pointer;
        font-size: 16px;
        transition: background-color 0.2s;
    `;
    
    // Login button
    const loginButton = document.createElement('a');
    loginButton.textContent = 'Login';
    loginButton.href = '/login.html';
    loginButton.style.cssText = buttonStyle;
    
    // Signup button
    const signupButton = document.createElement('a');
    signupButton.textContent = 'Sign Up';
    signupButton.href = '/signup.html';
    signupButton.style.cssText = buttonStyle;
    
    // Home button
    const homeButton = document.createElement('a');
    homeButton.textContent = 'Home';
    homeButton.href = '/index.html';
    homeButton.style.cssText = buttonStyle;
    
    // Assemble UI
    buttonsContainer.appendChild(loginButton);
    buttonsContainer.appendChild(signupButton);
    buttonsContainer.appendChild(homeButton);
    
    dialog.appendChild(lockIcon);
    dialog.appendChild(header);
    dialog.appendChild(message);
    dialog.appendChild(buttonsContainer);
    
    container.appendChild(dialog);
    
    return container;
}

// Create a minimal but effective protection for early loading
function createMinimalProtection() {
    const div = document.createElement('div');
    div.style.position = 'fixed';
    div.style.top = '0';
    div.style.left = '0';
    div.style.width = '100%';
    div.style.height = '100%';
    div.style.backgroundColor = '#000';
    div.style.color = '#fff';
    div.style.display = 'flex';
    div.style.justifyContent = 'center';
    div.style.alignItems = 'center';
    div.style.zIndex = '99999';
    div.style.fontSize = '18px';
    div.style.textAlign = 'center';
    div.style.padding = '20px';
    
    div.innerHTML = `
        <div>
            <h1 style="margin-bottom: 20px;">Premium Content</h1>
            <p style="margin-bottom: 20px;">This content requires a registered account.</p>
            <p>
                <a href="/login.html" style="color: #fff; margin: 0 10px;">Login</a> | 
                <a href="/signup.html" style="color: #fff; margin: 0 10px;">Sign Up</a> | 
                <a href="/index.html" style="color: #fff; margin: 0 10px;">Home</a>
            </p>
        </div>
    `;
    
    return div;
}

// Redirect to login if user is not logged in
function redirectUnauthorized() {
    // Check if this page contains premium content and user is not authorized
    if ((!isUserLoggedIn() || isUserGuest()) && isPremiumContentUrl()) {
        window.location.href = '/login.html?redirect=' + encodeURIComponent(window.location.href);
        throw new Error('Access denied - Premium content requires login');
    }
}

// Apply protection on DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
    // If user is not logged in or is a guest and trying to access premium content
    if ((!isUserLoggedIn() || isUserGuest()) && isPremiumContentUrl()) {
        document.body.appendChild(createFullScreenProtection());
    }
});

// Apply protection before DOM is loaded
// If user is not logged in or is a guest and trying to access premium content
if ((!isUserLoggedIn() || isUserGuest()) && isPremiumContentUrl()) {
    document.write('<div style="position:fixed;top:0;left:0;width:100%;height:100vh;background:#000;color:#fff;">Premium content requires login</div>');
    window.stop();
}

// Apply protection on load (final check)
window.addEventListener('load', function() {
    // If user is not logged in or is a guest and trying to access premium content
    if ((!isUserLoggedIn() || isUserGuest()) && isPremiumContentUrl()) {
        const existingOverlay = document.getElementById('premium-protection-overlay');
        if (!existingOverlay) {
            document.body.appendChild(createFullScreenProtection());
        }
    }
}); 