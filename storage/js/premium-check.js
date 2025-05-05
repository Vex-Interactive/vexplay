// Load protection script early
(function() {
    // Check if authentication is needed
    const needsAuth = function() {
        const currentUrl = window.location.href.toLowerCase();
        
        // Define paths that require authentication
        // Note: All games past line 490 in games/index.html should be premium
        const authPaths = [
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
            // Apps
            'webretro',
            'htmlcoder',
            'v86',
            'calculator',
            'etchasketch',
            'zipopener',
            'godoblocks'
        ];
        
        return authPaths.some(path => currentUrl.includes(path));
    };
    
    // Check if user is logged in as a non-guest
    const isRegisteredUser = function() {
        return localStorage.getItem('userLoggedIn') === 'true' && 
               localStorage.getItem('isGuest') !== 'true';
    };
    
    // If this is premium content and user is not registered, redirect to login
    if (needsAuth() && !isRegisteredUser()) {
        // Redirect to login page with return URL
        window.location.href = '/login.html?redirect=' + encodeURIComponent(window.location.href);
        window.stop();
        return;
    }
    
    // Create script element
    const script = document.createElement('script');
    script.src = '/storage/js/path-protection.js';
    script.type = 'text/javascript';
    
    // Add script to head (load as early as possible)
    document.head.insertBefore(script, document.head.firstChild);
    
    // If we have a script error, refresh to home
    script.onerror = function() {
        window.location.href = '/index.html';
    };
})(); 