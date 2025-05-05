/**
 * Game Protection Script
 * 
 * Add this script to the <head> section of any premium game HTML file:
 * <script src="/storage/js/game-protection.js"></script>
 * 
 * Note: All games past line 490 in games/index.html should be premium
 */

(function() {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
    // Check if user is a guest
    const isGuest = localStorage.getItem('isGuest') === 'true';

    // Only registered (non-guest) users have access
    if (!isLoggedIn || isGuest) {
        // Redirect to login page with return URL
        window.location.href = '/login.html?redirect=' + encodeURIComponent(window.location.href);
        
        // Stop all other script execution
        window.stop();
        
        throw new Error('Access denied - Premium content requires login');
    }
})(); 