// Shared JavaScript functionality for Resilio Tech
class ResilioCommon {
    constructor() {
        this.initNavigation();
        this.initScrollBehavior();
        this.initPerformanceOptimizations();
    }

    // Navigation functionality
    initNavigation() {
        const navToggle = document.getElementById('nav-toggle');
        const navMenu = document.getElementById('nav-menu');
        const navLinks = document.querySelectorAll('.nav-link');

        // Mobile menu toggle
        if (navToggle && navMenu) {
            navToggle.addEventListener('click', () => {
                navToggle.classList.toggle('active');
                navMenu.classList.toggle('active');
                document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
            });

            // Close mobile menu when clicking on a link
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    navToggle.classList.remove('active');
                    navMenu.classList.remove('active');
                    document.body.style.overflow = '';
                });
            });

            // Close mobile menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                    navToggle.classList.remove('active');
                    navMenu.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });
        }

        // Active navigation highlighting
        this.updateActiveNavLink();
        window.addEventListener('hashchange', () => this.updateActiveNavLink());
        window.addEventListener('scroll', () => this.updateActiveNavLink());
    }

    updateActiveNavLink() {
        const navLinks = document.querySelectorAll('.nav-link');
        const currentPath = window.location.pathname;
        const currentHash = window.location.hash;

        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            
            if (href === currentPath || href === currentHash || 
                (currentPath.includes('/blog') && href.includes('blog'))) {
                link.classList.add('active');
            }
        });
    }

    // Scroll behavior improvements
    initScrollBehavior() {
        // Navbar background on scroll
        const navbar = document.getElementById('navbar');
        if (navbar) {
            const handleScroll = () => {
                if (window.scrollY > 50) {
                    navbar.style.background = 'rgba(0, 0, 0, 0.98)';
                    navbar.style.backdropFilter = 'blur(20px)';
                } else {
                    navbar.style.background = 'rgba(0, 0, 0, 0.95)';
                    navbar.style.backdropFilter = 'blur(10px)';
                }
            };

            // Throttle scroll events for performance
            let ticking = false;
            window.addEventListener('scroll', () => {
                if (!ticking) {
                    requestAnimationFrame(() => {
                        handleScroll();
                        ticking = false;
                    });
                    ticking = true;
                }
            });
        }

        // Smooth scroll for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    const navbarHeight = document.getElementById('navbar')?.offsetHeight || 70;
                    const targetPosition = target.offsetTop - navbarHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // Performance optimizations
    initPerformanceOptimizations() {
        // Lazy loading for images
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        observer.unobserve(img);
                    }
                });
            });

            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }

        // Preload critical resources
        this.preloadCriticalResources();
    }

    preloadCriticalResources() {
        const criticalResources = [
            '/assets/images/logo.svg',
            '/shared/css/common.css'
        ];

        criticalResources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = resource;
            link.as = resource.endsWith('.css') ? 'style' : 'image';
            document.head.appendChild(link);
        });
    }

    // Utility functions
    static formatDate(dateString) {
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        return new Date(dateString).toLocaleDateString('en-US', options);
    }

    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    static throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // Analytics and tracking (placeholder)
    trackEvent(eventName, properties = {}) {
        // Implement your analytics tracking here
        console.log('Event tracked:', eventName, properties);
        
        // Example for Google Analytics 4
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, properties);
        }
    }

    // Newsletter signup functionality
    initNewsletterSignup() {
        const newsletterForms = document.querySelectorAll('.newsletter-form');
        
        newsletterForms.forEach(form => {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const email = form.querySelector('input[type="email"]').value;
                const submitBtn = form.querySelector('button[type="submit"]');
                const originalText = submitBtn.textContent;
                
                // Show loading state
                submitBtn.textContent = 'Subscribing...';
                submitBtn.disabled = true;
                
                try {
                    // Replace with your actual newsletter API endpoint
                    const response = await fetch('/api/newsletter/subscribe', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ email }),
                    });
                    
                    if (response.ok) {
                        submitBtn.textContent = 'Subscribed!';
                        form.querySelector('input[type="email"]').value = '';
                        this.trackEvent('newsletter_signup', { email });
                        
                        // Reset after 3 seconds
                        setTimeout(() => {
                            submitBtn.textContent = originalText;
                            submitBtn.disabled = false;
                        }, 3000);
                    } else {
                        throw new Error('Subscription failed');
                    }
                } catch (error) {
                    console.error('Newsletter signup error:', error);
                    submitBtn.textContent = 'Error - Try Again';
                    
                    // Reset after 3 seconds
                    setTimeout(() => {
                        submitBtn.textContent = originalText;
                        submitBtn.disabled = false;
                    }, 3000);
                }
            });
        });
    }
}

// Initialize common functionality when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.resilioCommon = new ResilioCommon();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ResilioCommon;
}
