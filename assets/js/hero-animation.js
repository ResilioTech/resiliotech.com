/**
 * Hero Animation Controller
 * Manages display for the SVG animation
 */

class HeroAnimationController {
    constructor() {
        this.animationElement = null;
        this.init();
    }

    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }

    setup() {
        this.animationElement = document.querySelector('.hero-animation');
        
        if (!this.animationElement) {
            console.warn('Hero animation element not found');
            return;
        }

        this.setupResponsiveHandling();
    }

    /**
     * Set up responsive handling for different screen sizes
     */
    setupResponsiveHandling() {
        // Just ensure proper sizing for different screens
        window.addEventListener('resize', () => {
            this.adjustForScreenSize();
        });
        
        // Initial adjustment
        this.adjustForScreenSize();
    }
    
    /**
     * Adjust elements based on screen size
     */
    adjustForScreenSize() {
        // For the fixed layout, we just need to ensure
        // the animation container scales properly with the screen size
        const width = window.innerWidth;
        
        // Apply responsive adjustments if needed
        if (width < 768) {
            // For smaller screens, we ensure all elements remain visible
            this.animationElement.style.maxWidth = '100%';
        } else {
            this.animationElement.style.maxWidth = '600px';
        }
    }

    /**
     * Create visual ripple effect on click
     */
    createRippleEffect(x, y) {
        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(59, 130, 246, 0.3);
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
            left: ${x - 10}px;
            top: ${y - 10}px;
            width: 20px;
            height: 20px;
            z-index: 1000;
        `;

        // Add ripple animation if not already defined
        if (!document.querySelector('#ripple-keyframes')) {
            const style = document.createElement('style');
            style.id = 'ripple-keyframes';
            style.textContent = `
                @keyframes ripple {
                    to {
                        transform: scale(4);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }

        this.animationElement.parentElement.style.position = 'relative';
        this.animationElement.parentElement.appendChild(ripple);

        // Remove ripple after animation
        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.parentNode.removeChild(ripple);
            }
        }, 600);
    }

    /**
     * Track technology interactions for analytics
     */
    trackTechnologyInteraction(x, y) {
        // This method can be extended to integrate with analytics services
        const interactionData = {
            type: 'hero_animation_click',
            position: { x, y },
            timestamp: new Date().toISOString()
        };
        
        // Example: Send to analytics service
        if (window.gtag) {
            window.gtag('event', 'hero_animation_interaction', {
                event_category: 'engagement',
                event_label: 'technology_focus'
            });
        }
        
        console.log('Technology interaction:', interactionData);
    }

    /**
     * Handle reduced motion preferences
     */
    handleReducedMotion() {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        if (prefersReducedMotion) {
            this.animationElement.classList.add('reduced-motion');
            console.log('Reduced motion detected - animations simplified');
        }
    }

    /**
     * Clean up observers and event listeners
     */
    destroy() {
        if (this.observer) {
            this.observer.disconnect();
        }
        
        if (this.animationElement) {
            this.animationElement.removeEventListener('mouseenter', this.handleMouseEnter);
            this.animationElement.removeEventListener('mouseleave', this.handleMouseLeave);
            this.animationElement.removeEventListener('click', this.handleTechnologyClick);
        }
    }
}

// Initialize the animation controller when the script loads
const heroAnimation = new HeroAnimationController();

// Make it globally accessible for debugging
window.heroAnimation = heroAnimation;

// Export for module systems if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = HeroAnimationController;
}
