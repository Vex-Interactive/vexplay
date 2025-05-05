// Auth fix script - removes premium content visual restrictions for logged-in users
(function() {
    console.log("Auth fix script loading - AGGRESSIVE VERSION");
    
    // Function to remove premium content visual restrictions
    function removePremiumRestrictions() {
        console.log("Removing premium content restrictions");
        
        // Check if user can access premium content
        const isLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
        const isGuest = localStorage.getItem('isGuest') === 'true';
        const canAccessPremium = isLoggedIn && !isGuest;
        
        console.log("Auth status:", { 
            isLoggedIn: isLoggedIn, 
            isGuest: isGuest, 
            canAccessPremium: canAccessPremium 
        });
        
        // If user can access premium content, remove visual restrictions
        if (canAccessPremium) {
            console.log("User can access premium content, removing visual restrictions");
            
            // Add a style tag that removes blur effects but keeps content visible
            const styleTag = document.createElement('style');
            styleTag.id = 'premium-unblur-style';
            styleTag.textContent = `
                /* Remove blur overlay but keep content visible */
                .premium-content .button::before {
                    backdrop-filter: none !important;
                    -webkit-backdrop-filter: none !important;
                    background-color: transparent !important;
                }
                
                /* Remove blur from images but keep them visible */
                .premium-content .button img,
                .premium-content .button .thumbnail {
                    filter: none !important;
                }
                
                /* Hide just the overlay elements */
                .premium-overlay {
                    display: none !important;
                }
                
                /* Make sure all premium content is fully visible */
                .premium-content,
                .premium-content .button,
                .premium-content h2 {
                    filter: none !important;
                    opacity: 1 !important;
                    visibility: visible !important;
                    text-shadow: none !important;
                }
                
                /* Fix background images */
                .button {
                    background-size: cover !important;
                    background-position: center !important;
                }
                
                /* Remove the not-allowed cursor */
                .premium-content {
                    cursor: pointer !important;
                }
            `;
            document.head.appendChild(styleTag);
            
            // Directly modify elements with inline blur styles but keep them visible
            const allElements = document.querySelectorAll('*');
            allElements.forEach(el => {
                const style = el.getAttribute('style');
                if (style && (style.includes('blur') || style.includes('filter'))) {
                    el.style.filter = 'none';
                    // Keep element visible
                    el.style.opacity = '1';
                    el.style.display = '';
                }
            });
            
            // Fix premium content elements
            document.querySelectorAll('.premium-content').forEach(element => {
                // Restore original href if it exists
                const originalHref = element.getAttribute('data-original-href');
                if (originalHref) {
                    element.setAttribute('href', originalHref);
                }
                
                // Remove only blur effects from elements
                const buttonDiv = element.querySelector('.button');
                if (buttonDiv) {
                    // Remove premium overlays
                    const premiumOverlays = buttonDiv.querySelectorAll('.premium-overlay');
                    premiumOverlays.forEach(overlay => overlay.remove());
                    
                    // Remove lock icon from title
                    const titleElement = buttonDiv.querySelector('h2');
                    if (titleElement && titleElement.textContent.includes('🔒')) {
                        titleElement.textContent = titleElement.textContent.replace(' 🔒', '');
                    }
                }
            });
        }
    }
    
    // Run immediately to catch early restrictions
    removePremiumRestrictions();
    
    // Also run after DOM content is loaded to catch restrictions applied later
    document.addEventListener('DOMContentLoaded', function() {
        removePremiumRestrictions();
    });
    
    // Run multiple times to make sure we catch everything
    setTimeout(removePremiumRestrictions, 100);
    setTimeout(removePremiumRestrictions, 500);
    setTimeout(removePremiumRestrictions, 1000);
})(); 