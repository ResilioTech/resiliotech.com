/**
 * Multi-Brand Architecture System
 * Handles brand management, cross-site navigation, and unified user experience
 */

class MultiBrandSystem {
    constructor() {
        this.brands = this.initializeBrands();
        this.currentBrand = this.detectCurrentBrand();
        this.sharedComponents = new SharedComponentSystem();
        this.brandRouter = new BrandRouter();
        this.analytics = new CrossBrandAnalytics();
        
        this.init();
    }

    initializeBrands() {
        return {
            resiliotech: {
                name: 'ResilioTech',
                domain: 'resiliotech.com',
                subdomains: ['www', ''],
                type: 'parent',
                description: 'DevOps Automation for Startups',
                colors: {
                    primary: '#6366f1',
                    secondary: '#8b5cf6', 
                    accent: '#06b6d4',
                    success: '#10b981',
                    warning: '#f59e0b',
                    error: '#ef4444'
                },
                routes: {
                    home: '/',
                    about: '/#about',
                    services: '/#services',
                    consulting: '/#services',
                    products: '/products/',
                    case_studies: '/case-studies/',
                    resources: '/resources/',
                    blog: '/blog/',
                    contact: '/#contact'
                },
                navigation: [
                    { label: 'Home', href: '/', active: 'home' },
                    { label: 'Consulting', href: '/#services', active: 'consulting' },
                    { label: 'Products', href: '/products/', active: 'products', badge: 'Coming Soon' },
                    { label: 'Case Studies', href: '/case-studies/', active: 'case-studies' },
                    { label: 'Resources', href: '/resources/', active: 'resources' },
                    { label: 'Blog', href: '/blog/', active: 'blog' },
                    { label: 'Contact', href: '/#contact', active: 'contact' }
                ],
                cta: {
                    primary: 'Get Free Audit',
                    secondary: 'View Products'
                }
            },

            devops_suite: {
                name: 'DevOps Automation Suite',
                shortName: 'DevOps Suite',
                domain: 'devops.resiliotech.com',
                subdomains: ['devops'],
                type: 'product',
                parent: 'resiliotech',
                description: 'Complete DevOps automation platform for growing teams',
                colors: {
                    primary: '#6366f1',
                    secondary: '#4338ca',
                    accent: '#06b6d4',
                    success: '#10b981',
                    warning: '#f59e0b',
                    error: '#ef4444'
                },
                routes: {
                    home: '/',
                    features: '/features/',
                    pricing: '/pricing/',
                    docs: '/docs/',
                    integrations: '/integrations/',
                    security: '/security/',
                    api: '/api/'
                },
                navigation: [
                    { label: 'Overview', href: '/', active: 'home' },
                    { label: 'Features', href: '/features/', active: 'features' },
                    { label: 'Pricing', href: '/pricing/', active: 'pricing' },
                    { label: 'Integrations', href: '/integrations/', active: 'integrations' },
                    { label: 'Docs', href: '/docs/', active: 'docs' },
                    { label: 'Security', href: '/security/', active: 'security' }
                ],
                cta: {
                    primary: 'Start Free Trial',
                    secondary: 'View Demo'
                },
                pricing: {
                    freemium: {
                        name: 'Starter',
                        price: 0,
                        period: 'month',
                        description: 'Perfect for individual developers',
                        features: [
                            '1 project',
                            'Basic CI/CD pipelines',
                            'Community support',
                            '100 build minutes/month'
                        ]
                    },
                    professional: {
                        name: 'Professional',
                        price: 49,
                        period: 'month',
                        description: 'For growing development teams',
                        features: [
                            '10 projects',
                            'Advanced CI/CD pipelines',
                            'Priority support',
                            'Unlimited build minutes',
                            'Custom integrations',
                            'Advanced analytics'
                        ]
                    },
                    enterprise: {
                        name: 'Enterprise',
                        price: 199,
                        period: 'month',
                        description: 'For large-scale operations',
                        features: [
                            'Unlimited projects',
                            'Enterprise CI/CD',
                            'Dedicated support',
                            'Custom deployment',
                            'SSO integration',
                            'Advanced security',
                            'SLA guarantees'
                        ]
                    }
                }
            },

            health_monitor: {
                name: 'Startup Tech Health Monitor',
                shortName: 'Health Monitor', 
                domain: 'monitor.resiliotech.com',
                subdomains: ['monitor'],
                type: 'product',
                parent: 'resiliotech',
                description: 'Real-time monitoring and alerting for startup infrastructure',
                colors: {
                    primary: '#10b981',
                    secondary: '#059669',
                    accent: '#06b6d4',
                    success: '#10b981',
                    warning: '#f59e0b',
                    error: '#ef4444'
                },
                routes: {
                    home: '/',
                    features: '/features/',
                    pricing: '/pricing/',
                    docs: '/docs/',
                    integrations: '/integrations/',
                    security: '/security/',
                    status: '/status/'
                },
                navigation: [
                    { label: 'Overview', href: '/', active: 'home' },
                    { label: 'Features', href: '/features/', active: 'features' },
                    { label: 'Pricing', href: '/pricing/', active: 'pricing' },
                    { label: 'Integrations', href: '/integrations/', active: 'integrations' },
                    { label: 'Docs', href: '/docs/', active: 'docs' },
                    { label: 'Status', href: '/status/', active: 'status' }
                ],
                cta: {
                    primary: 'Start Free Trial',
                    secondary: 'View Live Demo'
                },
                pricing: {
                    freemium: {
                        name: 'Starter',
                        price: 0,
                        period: 'month',
                        description: 'Basic monitoring for small projects',
                        features: [
                            '5 services monitored',
                            'Basic alerts',
                            'Email notifications',
                            '1-day data retention'
                        ]
                    },
                    professional: {
                        name: 'Professional',
                        price: 29,
                        period: 'month',
                        description: 'Advanced monitoring for growing teams',
                        features: [
                            '50 services monitored',
                            'Advanced alerting',
                            'Multi-channel notifications',
                            '30-day data retention',
                            'Custom dashboards',
                            'API access'
                        ]
                    },
                    enterprise: {
                        name: 'Enterprise',
                        price: 99,
                        period: 'month',
                        description: 'Enterprise-grade monitoring',
                        features: [
                            'Unlimited services',
                            'AI-powered insights',
                            'Advanced integrations',
                            '1-year data retention',
                            'Custom SLAs',
                            'Dedicated support'
                        ]
                    }
                }
            },

            docs: {
                name: 'ResilioTech Documentation',
                shortName: 'Docs',
                domain: 'docs.resiliotech.com', 
                subdomains: ['docs'],
                type: 'shared',
                parent: 'resiliotech',
                description: 'Documentation hub for all ResilioTech products',
                colors: {
                    primary: '#6366f1',
                    secondary: '#4338ca',
                    accent: '#06b6d4',
                    success: '#10b981',
                    warning: '#f59e0b',
                    error: '#ef4444'
                },
                navigation: [
                    { label: 'DevOps Suite', href: '/devops-suite/', active: 'devops-suite' },
                    { label: 'Health Monitor', href: '/health-monitor/', active: 'health-monitor' },
                    { label: 'API Reference', href: '/api/', active: 'api' },
                    { label: 'Guides', href: '/guides/', active: 'guides' },
                    { label: 'Support', href: '/support/', active: 'support' }
                ]
            },

            status: {
                name: 'ResilioTech Status',
                shortName: 'Status',
                domain: 'status.resiliotech.com',
                subdomains: ['status'],
                type: 'shared',
                parent: 'resiliotech', 
                description: 'Real-time status and uptime monitoring',
                colors: {
                    primary: '#10b981',
                    secondary: '#059669',
                    accent: '#06b6d4',
                    success: '#10b981',
                    warning: '#f59e0b',
                    error: '#ef4444'
                }
            }
        };
    }

    detectCurrentBrand() {
        const hostname = window.location.hostname;
        const pathname = window.location.pathname;
        
        // Check for subdomain matches
        for (const [brandKey, brand] of Object.entries(this.brands)) {
            if (brand.subdomains?.includes(hostname.split('.')[0]) || hostname === brand.domain) {
                return brandKey;
            }
        }
        
        // Check for path-based routing
        if (pathname.startsWith('/products/devops-suite')) {
            return 'devops_suite';
        }
        if (pathname.startsWith('/products/health-monitor')) {
            return 'health_monitor';
        }
        
        return 'resiliotech'; // Default to parent brand
    }

    init() {
        this.applyBrandStyling();
        this.initializeNavigation();
        this.setupCrossBrandTracking();
        this.initializeSharedComponents();
        
        console.log(`Multi-brand system initialized for: ${this.currentBrand}`);
    }

    applyBrandStyling() {
        const brand = this.brands[this.currentBrand];
        if (!brand) return;
        
        // Apply CSS custom properties for brand colors
        const root = document.documentElement;
        Object.entries(brand.colors).forEach(([key, value]) => {
            root.style.setProperty(`--brand-${key}`, value);
        });
        
        // Update meta theme color
        const themeColorMeta = document.querySelector('meta[name="theme-color"]');
        if (themeColorMeta) {
            themeColorMeta.content = brand.colors.primary;
        }
        
        // Add brand class to body
        document.body.classList.add(`brand-${this.currentBrand}`);
        
        // Update favicon if brand-specific
        if (brand.favicon) {
            const favicon = document.querySelector('link[rel*="icon"]');
            if (favicon) {
                favicon.href = brand.favicon;
            }
        }
    }

    initializeNavigation() {
        this.injectBrandNavigation();
        this.setupBrandSwitcher();
        this.updateNavigationActive();
    }

    injectBrandNavigation() {
        const brand = this.brands[this.currentBrand];
        if (!brand.navigation) return;
        
        const navContainers = document.querySelectorAll('.brand-navigation');
        navContainers.forEach(container => {
            const navHTML = this.generateNavigationHTML(brand);
            container.innerHTML = navHTML;
        });
    }

    generateNavigationHTML(brand) {
        const navItems = brand.navigation.map(item => {
            const badgeHTML = item.badge ? `<span class="nav-badge">${item.badge}</span>` : '';
            const activeClass = this.isCurrentPage(item.active) ? 'active' : '';
            
            return `
                <a href="${item.href}" class="nav-link ${activeClass}" data-brand-nav="${item.active}">
                    <span class="nav-link-text">${item.label}</span>
                    ${badgeHTML}
                </a>
            `;
        }).join('');
        
        return `
            <div class="nav-menu" id="nav-menu">
                ${navItems}
                <a href="${this.getBrandCTALink()}" class="nav-cta" data-track="cta_click" data-source="navigation">
                    ${brand.cta.primary}
                </a>
            </div>
        `;
    }

    setupBrandSwitcher() {
        // Create brand switcher for cross-brand navigation
        const switcherContainer = document.querySelector('.brand-switcher');
        if (!switcherContainer) return;
        
        const parentBrand = this.brands.resiliotech;
        const productBrands = Object.values(this.brands).filter(b => b.type === 'product');
        
        const switcherHTML = `
            <div class="brand-switcher-dropdown">
                <button class="brand-switcher-trigger" data-dropdown-trigger="brand-switcher">
                    <span class="current-brand">${this.brands[this.currentBrand].shortName || this.brands[this.currentBrand].name}</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="6,9 12,15 18,9"></polyline>
                    </svg>
                </button>
                <div class="brand-switcher-menu" data-dropdown-menu="brand-switcher">
                    <div class="brand-switcher-section">
                        <div class="brand-switcher-label">Main Site</div>
                        <a href="${parentBrand.routes.home}" class="brand-switcher-item ${this.currentBrand === 'resiliotech' ? 'active' : ''}">
                            <span class="brand-icon">🏠</span>
                            <div class="brand-info">
                                <span class="brand-name">${parentBrand.name}</span>
                                <span class="brand-desc">${parentBrand.description}</span>
                            </div>
                        </a>
                    </div>
                    <div class="brand-switcher-section">
                        <div class="brand-switcher-label">Products</div>
                        ${productBrands.map(brand => `
                            <a href="${this.getBrandURL(brand)}" class="brand-switcher-item ${this.currentBrand === this.getBrandKey(brand) ? 'active' : ''}">
                                <span class="brand-icon">${brand.type === 'devops_suite' ? '⚙️' : '📊'}</span>
                                <div class="brand-info">
                                    <span class="brand-name">${brand.shortName}</span>
                                    <span class="brand-desc">${brand.description}</span>
                                </div>
                            </a>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
        
        switcherContainer.innerHTML = switcherHTML;
        this.initializeDropdown();
    }

    initializeDropdown() {
        document.addEventListener('click', (e) => {
            const trigger = e.target.closest('[data-dropdown-trigger]');
            if (trigger) {
                const dropdownId = trigger.dataset.dropdownTrigger;
                const menu = document.querySelector(`[data-dropdown-menu="${dropdownId}"]`);
                if (menu) {
                    menu.classList.toggle('show');
                    trigger.classList.toggle('active');
                }
                return;
            }
            
            // Close dropdowns when clicking outside
            document.querySelectorAll('[data-dropdown-menu]').forEach(menu => {
                menu.classList.remove('show');
            });
            document.querySelectorAll('[data-dropdown-trigger]').forEach(trigger => {
                trigger.classList.remove('active');
            });
        });
    }

    setupCrossBrandTracking() {
        this.analytics.init(this.currentBrand, this.brands[this.currentBrand]);
        
        // Track cross-brand navigation
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href]');
            if (link && this.isCrossBrandLink(link.href)) {
                this.analytics.trackCrossBrandNavigation(link.href, this.currentBrand);
            }
        });
    }

    initializeSharedComponents() {
        this.sharedComponents.init(this.currentBrand, this.brands[this.currentBrand]);
    }

    // Utility methods
    isCurrentPage(pageKey) {
        const currentPath = window.location.pathname;
        const currentHash = window.location.hash;
        const brand = this.brands[this.currentBrand];
        
        if (!brand.routes[pageKey]) return false;
        
        const targetRoute = brand.routes[pageKey];
        
        if (targetRoute.includes('#')) {
            return currentHash === targetRoute.split('#')[1];
        }
        
        return currentPath === targetRoute || currentPath.startsWith(targetRoute);
    }

    getBrandCTALink() {
        const brand = this.brands[this.currentBrand];
        
        switch (brand.type) {
            case 'product':
                return '/pricing/';
            case 'parent':
                return '/#contact';
            default:
                return '/';
        }
    }

    getBrandURL(brand) {
        if (brand.domain === window.location.hostname) {
            return '/';
        }
        return `https://${brand.domain}/`;
    }

    getBrandKey(brand) {
        return Object.keys(this.brands).find(key => this.brands[key] === brand);
    }

    isCrossBrandLink(href) {
        try {
            const url = new URL(href, window.location.origin);
            return url.hostname !== window.location.hostname;
        } catch {
            return false;
        }
    }

    updateNavigationActive() {
        const currentPath = window.location.pathname;
        const currentHash = window.location.hash;
        
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            
            const href = link.getAttribute('href');
            if (href === currentPath || (href.includes('#') && href.includes(currentHash))) {
                link.classList.add('active');
            }
        });
    }

    // Public API
    getCurrentBrand() {
        return this.currentBrand;
    }

    getBrandConfig(brandKey = null) {
        return this.brands[brandKey || this.currentBrand];
    }

    switchBrand(brandKey) {
        const brand = this.brands[brandKey];
        if (!brand) return false;
        
        window.location.href = this.getBrandURL(brand);
        return true;
    }

    getSharedAssets() {
        return {
            fonts: [
                'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap'
            ],
            styles: [
                '/shared/css/common.css',
                '/shared/css/multi-brand.css'
            ],
            scripts: [
                '/shared/js/common.js',
                '/shared/js/multi-brand-system.js'
            ]
        };
    }
}

// Shared Component System
class SharedComponentSystem {
    init(currentBrand, brandConfig) {
        this.currentBrand = currentBrand;
        this.brandConfig = brandConfig;
        this.loadSharedComponents();
    }

    async loadSharedComponents() {
        await Promise.all([
            this.loadHeader(),
            this.loadFooter(),
            this.loadNotifications(),
            this.loadCookieConsent()
        ]);
    }

    async loadHeader() {
        const headerContainer = document.querySelector('#header-container');
        if (!headerContainer) return;
        
        try {
            const response = await fetch('/shared/components/multi-brand-header.html');
            if (response.ok) {
                let headerHTML = await response.text();
                headerHTML = this.processTemplate(headerHTML);
                headerContainer.innerHTML = headerHTML;
            }
        } catch (error) {
            console.error('Failed to load header:', error);
        }
    }

    async loadFooter() {
        const footerContainer = document.querySelector('#footer-container');
        if (!footerContainer) return;
        
        try {
            const response = await fetch('/shared/components/multi-brand-footer.html');
            if (response.ok) {
                let footerHTML = await response.text();
                footerHTML = this.processTemplate(footerHTML);
                footerContainer.innerHTML = footerHTML;
            }
        } catch (error) {
            console.error('Failed to load footer:', error);
        }
    }

    async loadNotifications() {
        // Load notification system for cross-brand announcements
        const notificationContainer = document.querySelector('#notifications-container');
        if (!notificationContainer) return;
        
        const notifications = await this.fetchNotifications();
        if (notifications.length > 0) {
            this.renderNotifications(notifications, notificationContainer);
        }
    }

    async loadCookieConsent() {
        // Load cookie consent banner
        if (!this.shouldShowCookieConsent()) return;
        
        const consentHTML = `
            <div id="cookie-consent" class="cookie-consent">
                <div class="cookie-consent-content">
                    <p>We use cookies to enhance your experience and analyze site usage. 
                    <a href="/privacy-policy" class="cookie-link">Learn more</a></p>
                    <div class="cookie-actions">
                        <button class="btn btn-sm btn-outline" onclick="acceptCookies()">Accept All</button>
                        <button class="btn btn-sm btn-ghost" onclick="dismissCookies()">Dismiss</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', consentHTML);
    }

    processTemplate(html) {
        const brand = this.brandConfig;
        
        // Replace brand-specific variables
        html = html.replace(/\{\{brandName\}\}/g, brand.name);
        html = html.replace(/\{\{brandDescription\}\}/g, brand.description);
        html = html.replace(/\{\{primaryColor\}\}/g, brand.colors.primary);
        html = html.replace(/\{\{currentYear\}\}/g, new Date().getFullYear());
        
        // Replace navigation
        if (brand.navigation) {
            const navHTML = brand.navigation.map(item => 
                `<a href="${item.href}" class="footer-nav-link">${item.label}</a>`
            ).join('');
            html = html.replace(/\{\{navigation\}\}/g, navHTML);
        }
        
        return html;
    }

    async fetchNotifications() {
        try {
            const response = await fetch('/api/notifications?brand=' + this.currentBrand);
            if (response.ok) {
                return await response.json();
            }
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        }
        
        return [];
    }

    renderNotifications(notifications, container) {
        const notificationsHTML = notifications.map(notification => `
            <div class="notification ${notification.type}" data-notification-id="${notification.id}">
                <div class="notification-content">
                    <span class="notification-icon">${this.getNotificationIcon(notification.type)}</span>
                    <span class="notification-text">${notification.message}</span>
                </div>
                <button class="notification-close" onclick="dismissNotification('${notification.id}')">&times;</button>
            </div>
        `).join('');
        
        container.innerHTML = notificationsHTML;
    }

    getNotificationIcon(type) {
        const icons = {
            info: 'ℹ️',
            success: '✅',
            warning: '⚠️',
            error: '❌',
            update: '🚀'
        };
        return icons[type] || icons.info;
    }

    shouldShowCookieConsent() {
        return !localStorage.getItem('cookieConsent');
    }
}

// Brand Router for handling cross-brand navigation
class BrandRouter {
    constructor() {
        this.routes = new Map();
        this.setupRoutes();
    }

    setupRoutes() {
        // Define cross-brand route mappings
        this.routes.set('product_to_parent', {
            '/contact': '/#contact',
            '/consulting': '/#services',
            '/case-studies': '/case-studies/',
            '/resources': '/resources/'
        });
        
        this.routes.set('parent_to_product', {
            '/products/devops-suite': 'https://devops.resiliotech.com/',
            '/products/health-monitor': 'https://monitor.resiliotech.com/'
        });
    }

    handleNavigation(href, currentBrand) {
        const routeMap = this.routes.get(`${currentBrand}_to_parent`);
        if (routeMap && routeMap[href]) {
            return routeMap[href];
        }
        
        return href;
    }
}

// Cross-Brand Analytics
class CrossBrandAnalytics {
    init(currentBrand, brandConfig) {
        this.currentBrand = currentBrand;
        this.brandConfig = brandConfig;
        this.setupTracking();
    }

    setupTracking() {
        // Initialize Google Analytics with cross-domain tracking
        if (typeof gtag !== 'undefined') {
            gtag('config', 'GA_MEASUREMENT_ID', {
                custom_map: {
                    custom_dimension_1: 'brand',
                    custom_dimension_2: 'brand_type'
                }
            });
            
            // Track brand context
            gtag('event', 'brand_view', {
                brand: this.currentBrand,
                brand_type: this.brandConfig.type,
                brand_name: this.brandConfig.name
            });
        }
    }

    trackCrossBrandNavigation(targetUrl, sourceBrand) {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'cross_brand_navigation', {
                source_brand: sourceBrand,
                target_url: targetUrl,
                event_category: 'navigation',
                event_label: 'cross_brand'
            });
        }
    }

    trackBrandConversion(conversionType, value = null) {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'conversion', {
                brand: this.currentBrand,
                conversion_type: conversionType,
                value: value,
                event_category: 'conversion'
            });
        }
    }
}

// Global functions for HTML onclick handlers
function acceptCookies() {
    localStorage.setItem('cookieConsent', 'accepted');
    document.getElementById('cookie-consent')?.remove();
}

function dismissCookies() {
    localStorage.setItem('cookieConsent', 'dismissed');
    document.getElementById('cookie-consent')?.remove();
}

function dismissNotification(id) {
    document.querySelector(`[data-notification-id="${id}"]`)?.remove();
}

// Initialize Multi-Brand System
document.addEventListener('DOMContentLoaded', () => {
    window.multiBrandSystem = new MultiBrandSystem();
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { MultiBrandSystem, SharedComponentSystem, BrandRouter, CrossBrandAnalytics };
}