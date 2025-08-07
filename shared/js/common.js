// Shared JavaScript functionality for Resilio Tech
class ResilioCommon {
    constructor() {
        this.initNavigation();
        this.initScrollBehavior();
        this.initPerformanceOptimizations();
        this.initBackToTop();
        this.initKeyboardNavigation();
        this.initFormLoading();
    }

    // Navigation functionality
    initNavigation() {
        // Try to initialize navigation immediately
        this.setupNavigation();
        
        // Also set up a mutation observer to watch for navigation being added
        const observer = new MutationObserver(() => {
            this.setupNavigation();
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    setupNavigation() {
        const navToggle = document.getElementById('nav-toggle');
        const navMenu = document.getElementById('nav-menu');
        const navLinks = document.querySelectorAll('.nav-link');

        // Only set up if elements exist
        if (!navToggle || !navMenu) {
            return;
        }

        // Mobile menu toggle
        // Remove existing listeners to avoid duplicates
        if (navToggle.clickHandler) {
            navToggle.removeEventListener('click', navToggle.clickHandler);
        }
        
        // Add click listener for mobile menu toggle
        navToggle.clickHandler = (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const isActive = navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            // Update accessibility attributes
            navToggle.setAttribute('aria-expanded', isActive);
            
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        };
        
        navToggle.addEventListener('click', navToggle.clickHandler);

        // Close mobile menu when clicking on a link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            }
        });

        // Close mobile menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            }
        });

        // Setup dropdown functionality
        this.setupDropdowns();
        
        // Active navigation highlighting
        this.updateActiveNavLink();
        window.addEventListener('hashchange', () => this.updateActiveNavLink());
        window.addEventListener('scroll', () => this.updateActiveNavLink());
    }

    setupDropdowns() {
        const dropdowns = document.querySelectorAll('.nav-dropdown');
        
        dropdowns.forEach(dropdown => {
            const toggle = dropdown.querySelector('.nav-dropdown-toggle');
            const menu = dropdown.querySelector('.nav-dropdown-menu');
            
            if (toggle && menu) {
                // Desktop hover behavior
                if (window.innerWidth > 768) {
                    dropdown.addEventListener('mouseenter', () => {
                        dropdown.classList.add('active');
                    });
                    
                    dropdown.addEventListener('mouseleave', () => {
                        dropdown.classList.remove('active');
                    });
                }
                
                // Mobile click behavior
                toggle.addEventListener('click', (e) => {
                    if (window.innerWidth <= 768) {
                        e.preventDefault();
                        dropdown.classList.toggle('active');
                    }
                });
            }
        });
        
        // Handle window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                // Remove mobile active states on desktop
                document.querySelectorAll('.nav-dropdown.active').forEach(dropdown => {
                    dropdown.classList.remove('active');
                });
            }
        });
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
            const handleScroll = Utils.throttle(() => {
                if (window.scrollY > 50) {
                    navbar.style.background = 'rgba(0, 0, 0, 0.98)';
                    navbar.style.backdropFilter = 'blur(20px)';
                } else {
                    navbar.style.background = 'rgba(0, 0, 0, 0.95)';
                    navbar.style.backdropFilter = 'blur(10px)';
                }
            }, 16); // ~60fps

            window.addEventListener('scroll', handleScroll, { passive: true });
        }

        // Enhanced smooth scroll for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    const navbarHeight = document.getElementById('navbar')?.offsetHeight || 70;
                    Utils.smoothScrollTo(target, navbarHeight);
                }
            });
        });
    }

    // Performance optimizations
    initPerformanceOptimizations() {
        // Use optimized lazy loading
        Utils.lazyLoadImages('img[data-src]');
        
        // Preload critical resources
        this.preloadCriticalResources();
        
        // Add intersection observer for animations
        this.initAnimationObserver();
    }

    initAnimationObserver() {
        if (!Utils.supports.intersectionObserver) return;

        const animationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                    animationObserver.unobserve(entry.target);
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.1
        });

        document.querySelectorAll('[data-animate]').forEach(el => {
            animationObserver.observe(el);
        });
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

// Global function to reinitialize navigation (call after navigation is loaded)
window.initializeNavigation = function() {
    if (window.resilioCommon) {
        window.resilioCommon.setupNavigation();
    }
};

// Service Worker Registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('Service Worker registered successfully:', registration);
                
                // Handle updates
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            // Show update notification
                            showUpdateNotification();
                        }
                    });
                });
            })
            .catch(error => {
                console.error('Service Worker registration failed:', error);
            });
    });
}

// Show update notification
function showUpdateNotification() {
    if (Utils.createNotification) {
        const notification = Utils.createNotification(
            'New version available!',
            'Click to update to the latest version.',
            'info'
        );
        
        notification.addEventListener('click', () => {
            if (navigator.serviceWorker.controller) {
                navigator.serviceWorker.controller.postMessage({
                    type: 'SKIP_WAITING'
                });
                
                window.location.reload();
            }
        });
    }
}

// PWA Install Prompt
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
    console.log('PWA install prompt available');
    
    // Prevent Chrome 67 and earlier from automatically showing the prompt
    e.preventDefault();
    
    // Stash the event so it can be triggered later
    deferredPrompt = e;
    
    // Show custom install button
    showInstallButton();
});

function showInstallButton() {
    const installButton = document.createElement('button');
    installButton.textContent = 'Install App';
    installButton.className = 'install-button';
    installButton.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: var(--primary-color);
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 5px;
        cursor: pointer;
        z-index: 1000;
        font-size: 14px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        transition: all 0.3s ease;
    `;
    
    installButton.addEventListener('click', () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            
            deferredPrompt.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    console.log('User accepted the install prompt');
                } else {
                    console.log('User dismissed the install prompt');
                }
                
                deferredPrompt = null;
                installButton.remove();
            });
        }
    });
    
    document.body.appendChild(installButton);
    
    // Hide button after 10 seconds
    setTimeout(() => {
        if (installButton.parentNode) {
            installButton.style.opacity = '0';
            setTimeout(() => installButton.remove(), 300);
        }
    }, 10000);
}

// Handle app install
window.addEventListener('appinstalled', (evt) => {
    console.log('PWA was installed');
    
    // Track installation
    if (typeof gtag !== 'undefined') {
        gtag('event', 'pwa_install', {
            event_category: 'engagement',
            event_label: 'PWA Installation'
        });
    }
});

// Network status monitoring
function initNetworkMonitoring() {
    function updateNetworkStatus() {
        const isOnline = navigator.onLine;
        document.body.classList.toggle('offline', !isOnline);
        
        if (!isOnline) {
            Utils.showToast('You are offline. Some features may be limited.', 'warning');
        } else {
            Utils.showToast('You are back online!', 'success');
        }
    }
    
    window.addEventListener('online', updateNetworkStatus);
    window.addEventListener('offline', updateNetworkStatus);
    
    // Initial check
    updateNetworkStatus();
}

// Initialize network monitoring
initNetworkMonitoring();

// Cache management utilities
const CacheManager = {
    async getCacheSize() {
        if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
            return new Promise((resolve) => {
                const channel = new MessageChannel();
                
                channel.port1.onmessage = (event) => {
                    if (event.data.type === 'CACHE_SIZE') {
                        resolve(event.data.size);
                    }
                };
                
                navigator.serviceWorker.controller.postMessage({
                    type: 'GET_CACHE_SIZE'
                }, [channel.port2]);
            });
        }
        return 0;
    },
    
    async clearCache() {
        if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
            return new Promise((resolve) => {
                const channel = new MessageChannel();
                
                channel.port1.onmessage = (event) => {
                    if (event.data.type === 'CACHE_CLEARED') {
                        resolve();
                    }
                };
                
                navigator.serviceWorker.controller.postMessage({
                    type: 'CLEAR_CACHE'
                }, [channel.port2]);
            });
        }
    }
};

// Back to Top Button functionality
class BackToTop {
    constructor() {
        this.createButton();
        this.initScrollListener();
    }

    createButton() {
        // Check if button already exists
        if (document.getElementById('back-to-top')) return;

        const button = document.createElement('button');
        button.id = 'back-to-top';
        button.className = 'back-to-top';
        button.setAttribute('aria-label', 'Back to top');
        button.innerHTML = `
            <svg class="progress-ring" width="50" height="50">
                <circle class="progress" cx="25" cy="25" r="22"></circle>
            </svg>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="18,15 12,9 6,15"></polyline>
            </svg>
        `;

        document.body.appendChild(button);

        button.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    initScrollListener() {
        const button = document.getElementById('back-to-top');
        const progressCircle = button?.querySelector('.progress');
        
        if (!button || !progressCircle) return;

        const circumference = 2 * Math.PI * 22; // r = 22
        progressCircle.style.strokeDasharray = circumference;

        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = scrollTop / docHeight;

            // Show/hide button
            if (scrollTop > 300) {
                button.classList.add('visible');
            } else {
                button.classList.remove('visible');
            }

            // Update progress ring
            const offset = circumference - (scrollPercent * circumference);
            progressCircle.style.strokeDashoffset = offset;
        });
    }
}

// Keyboard Navigation Enhancement
class KeyboardNavigation {
    constructor() {
        this.initKeyboardIndicator();
        this.initTabTrapping();
    }

    initKeyboardIndicator() {
        // Add keyboard navigation class when tab is used
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });

        // Remove keyboard navigation class when mouse is used
        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
        });
    }

    initTabTrapping() {
        // Trap focus in modals and menus
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                // Close mobile menu if open
                const navMenu = document.getElementById('nav-menu');
                const navToggle = document.getElementById('nav-toggle');
                
                if (navMenu?.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    navToggle?.classList.remove('active');
                    navToggle?.focus();
                }
            }
        });
    }
}

// Form Loading States
class FormLoading {
    constructor() {
        this.initFormSubmissionHandlers();
    }

    initFormSubmissionHandlers() {
        // Add loading states to all forms
        document.addEventListener('submit', (e) => {
            const form = e.target;
            if (form.tagName === 'FORM') {
                this.showLoadingState(form);
                
                // Hide loading state after 3 seconds as fallback
                setTimeout(() => {
                    this.hideLoadingState(form);
                }, 3000);
            }
        });
    }

    showLoadingState(form) {
        form.classList.add('form-loading');
        
        // Disable form inputs
        const inputs = form.querySelectorAll('input, textarea, button, select');
        inputs.forEach(input => {
            input.disabled = true;
        });
    }

    hideLoadingState(form) {
        form.classList.remove('form-loading');
        
        // Re-enable form inputs
        const inputs = form.querySelectorAll('input, textarea, button, select');
        inputs.forEach(input => {
            input.disabled = false;
        });
    }
}

// Breadcrumb Navigation
class BreadcrumbNavigation {
    constructor() {
        this.generateBreadcrumbs();
    }

    generateBreadcrumbs() {
        const breadcrumbContainer = document.getElementById('breadcrumb');
        if (!breadcrumbContainer) return;

        const path = window.location.pathname;
        const segments = path.split('/').filter(segment => segment !== '');
        
        let breadcrumbs = [
            { name: 'Home', path: '/' }
        ];

        let currentPath = '';
        segments.forEach(segment => {
            currentPath += `/${segment}`;
            
            // Convert segment to readable name
            let name = segment.charAt(0).toUpperCase() + segment.slice(1);
            name = name.replace(/-/g, ' ').replace('.html', '');
            
            breadcrumbs.push({ name, path: currentPath });
        });

        // Generate breadcrumb HTML
        const breadcrumbHTML = breadcrumbs.map((crumb, index) => {
            const isLast = index === breadcrumbs.length - 1;
            
            if (isLast) {
                return `<span class="breadcrumb-item breadcrumb-current">${crumb.name}</span>`;
            } else {
                return `<span class="breadcrumb-item">
                    <a href="${crumb.path}" class="breadcrumb-link">${crumb.name}</a>
                </span>`;
            }
        }).join('');

        breadcrumbContainer.innerHTML = breadcrumbHTML;
    }
}

// Enhanced ResilioCommon with new features
ResilioCommon.prototype.initBackToTop = function() {
    new BackToTop();
};

ResilioCommon.prototype.initKeyboardNavigation = function() {
    new KeyboardNavigation();
};

ResilioCommon.prototype.initFormLoading = function() {
    new FormLoading();
};

ResilioCommon.prototype.initBreadcrumbs = function() {
    new BreadcrumbNavigation();
};

// Make cache manager available globally
window.CacheManager = CacheManager;

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ResilioCommon;
}
