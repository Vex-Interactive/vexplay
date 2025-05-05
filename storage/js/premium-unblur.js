// Premium unblur script - directly injects CSS to remove blur effects
(function() {
    console.log("Premium unblur script running");
    
    // Check if user can access premium content
    const isLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
    const isGuest = localStorage.getItem('isGuest') === 'true';
    const canAccessPremium = isLoggedIn && !isGuest;
    
    console.log("Premium access status:", { isLoggedIn, isGuest, canAccessPremium });
    
    // Only apply fixes for users who can access premium content
    if (canAccessPremium) {
        console.log("Applying premium content unblur CSS");
        
        // Create and inject CSS directly
        const style = document.createElement('style');
        style.id = 'premium-unblur-styles';
        style.innerHTML = `
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
            
            /* Remove lock icons from text */
            h2 {
                text-shadow: none !important;
            }
            
            /* Remove the not-allowed cursor */
            .premium-content {
                cursor: pointer !important;
            }
        `;
        
        // Add to page immediately
        document.head.appendChild(style);
        
        // Also fix direct attributes
        setTimeout(function() {
            // Restore original hrefs
            document.querySelectorAll('.premium-content').forEach(element => {
                const originalHref = element.getAttribute('data-original-href');
                if (originalHref) {
                    element.setAttribute('href', originalHref);
                }
                
                // Remove lock icon from title
                const titleElement = element.querySelector('h2');
                if (titleElement && titleElement.textContent.includes('🔒')) {
                    titleElement.textContent = titleElement.textContent.replace(' 🔒', '');
                }
            });
        }, 100);
    }
})(); 