// Sticky CTA Banner Implementation
(function() {
    'use strict';

    // Configuration
    const config = {
        showAfterScroll: 800, // Show after user scrolls 800px
        hideOnSections: ['#lead-magnet', '#contact'], // Hide banner when these sections are visible
        bannerHtml: `
            <div class="sticky-cta-banner" id="sticky-banner">
                <div class="sticky-banner-content">
                    <div class="sticky-banner-text">
                        🚀 Want to automate your deployments? Get your free CI/CD audit.
                    </div>
                    <div class="sticky-banner-actions">
                        <a href="#lead-magnet" class="sticky-banner-btn primary" onclick="openAuditModal(); return false;">
                            Get Free Audit
                        </a>
                        <a href="#additional-tools" class="sticky-banner-btn secondary">
                            More Tools
                        </a>
                        <button class="sticky-banner-close" onclick="closeStickyBanner()" aria-label="Close banner">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        `
    };

    let banner = null;
    let isVisible = false;
    let isDismissed = false;

    // Initialize the sticky banner
    function initStickyBanner() {
        // Don't show on mobile initially
        if (window.innerWidth < 768) return;
        
        // Check if user already dismissed it
        if (localStorage.getItem('stickyBannerDismissed') === 'true') {
            isDismissed = true;
            return;
        }

        // Create banner element
        createBanner();
        
        // Add scroll listener
        window.addEventListener('scroll', handleScroll, { passive: true });
        
        // Add resize listener to handle mobile/desktop switches
        window.addEventListener('resize', handleResize);
    }

    function createBanner() {
        // Remove existing banner if any
        const existingBanner = document.getElementById('sticky-banner');
        if (existingBanner) {
            existingBanner.remove();
        }

        // Create new banner
        const div = document.createElement('div');
        div.innerHTML = config.bannerHtml;
        banner = div.firstElementChild;
        document.body.appendChild(banner);
    }

    function handleScroll() {
        if (isDismissed || !banner) return;

        const scrollY = window.scrollY;
        const shouldShow = scrollY > config.showAfterScroll && !isSectionVisible();

        if (shouldShow && !isVisible) {
            showBanner();
        } else if (!shouldShow && isVisible) {
            hideBanner();
        }
    }

    function handleResize() {
        const isMobile = window.innerWidth < 768;
        
        if (isMobile && isVisible) {
            hideBanner();
        } else if (!isMobile && !isDismissed && window.scrollY > config.showAfterScroll && !isSectionVisible()) {
            if (!banner) createBanner();
            showBanner();
        }
    }

    function isSectionVisible() {
        for (const selector of config.hideOnSections) {
            const section = document.querySelector(selector);
            if (section) {
                const rect = section.getBoundingClientRect();
                // Check if section is visible in viewport
                if (rect.top < window.innerHeight && rect.bottom > 0) {
                    return true;
                }
            }
        }
        return false;
    }

    function showBanner() {
        if (!banner || isVisible) return;
        
        banner.classList.add('show');
        isVisible = true;
        
        // Add body padding to prevent content jump
        document.body.style.paddingBottom = '60px';
    }

    function hideBanner() {
        if (!banner || !isVisible) return;
        
        banner.classList.remove('show');
        isVisible = false;
        
        // Remove body padding
        document.body.style.paddingBottom = '';
    }

    // Global function to close banner
    window.closeStickyBanner = function() {
        isDismissed = true;
        hideBanner();
        localStorage.setItem('stickyBannerDismissed', 'true');
    };

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initStickyBanner);
    } else {
        initStickyBanner();
    }

    // Clean up on page unload
    window.addEventListener('beforeunload', function() {
        window.removeEventListener('scroll', handleScroll);
        window.removeEventListener('resize', handleResize);
    });

})();
