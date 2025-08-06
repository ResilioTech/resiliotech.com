/**
 * Google Tag Manager Configuration for Dual Business Model
 * Comprehensive tracking setup for Consulting + SaaS business
 */

class GTMConfig {
    constructor() {
        this.config = {
            gtmId: 'GTM-XXXXXXX', // Replace with actual GTM container ID
            ga4MeasurementId: 'G-XXXXXXXXXX', // Replace with GA4 measurement ID
            enableDebug: window.location.hostname === 'localhost',
            enableEcommerce: true,
            enableDualModelTracking: true
        };
        
        this.init();
    }
    
    init() {
        if (!this.config.gtmId || this.config.gtmId === 'GTM-XXXXXXX') {
            console.warn('GTM Container ID not configured');
            return;
        }
        
        this.loadGTM();
        this.setupDataLayer();
        this.setupCustomEvents();
        this.setupEcommerce();
        this.log('GTM Configuration initialized');
    }
    
    loadGTM() {
        // Load GTM container
        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer',this.config.gtmId);
        
        // Add noscript fallback
        const noscript = document.createElement('noscript');
        noscript.innerHTML = `<iframe src="https://www.googletagmanager.com/ns.html?id=${this.config.gtmId}" height="0" width="0" style="display:none;visibility:hidden"></iframe>`;
        document.body.insertBefore(noscript, document.body.firstChild);
    }
    
    setupDataLayer() {
        // Initialize dataLayer with comprehensive business context
        window.dataLayer = window.dataLayer || [];
        
        // Push initial configuration
        window.dataLayer.push({
            'event': 'gtm.dom',
            'business_model': 'dual',
            'consulting_enabled': true,
            'saas_enabled': true,
            'site_version': 'v3.2',
            'page_type': this.getPageType(),
            'user_type': this.getUserType(),
            'session_data': this.getSessionData()
        });
        
        // Enhanced page data
        window.dataLayer.push({
            'event': 'page_data_loaded',
            'page_title': document.title,
            'page_url': window.location.href,
            'page_path': window.location.pathname,
            'referrer': document.referrer || 'direct',
            'user_agent': navigator.userAgent,
            'screen_resolution': screen.width + 'x' + screen.height,
            'viewport_size': window.innerWidth + 'x' + window.innerHeight
        });
    }
    
    setupCustomEvents() {
        // Business Model Tracking Events
        this.setupBusinessModelEvents();
        
        // Conversion Tracking Events  
        this.setupConversionEvents();
        
        // User Journey Events
        this.setupUserJourneyEvents();
        
        // Performance Events
        this.setupPerformanceEvents();
    }
    
    setupBusinessModelEvents() {
        // Track when users show interest in different business models
        document.addEventListener('click', (e) => {
            const target = e.target.closest('a, button');
            if (!target) return;
            
            const href = target.getAttribute('href');
            const businessModel = this.identifyBusinessModel(target, href);
            
            if (businessModel) {
                this.pushEvent('business_model_interaction', {
                    'business_model': businessModel,
                    'interaction_type': 'click',
                    'element_text': target.textContent.trim().substring(0, 100),
                    'element_id': target.id || 'no_id',
                    'element_class': target.className || 'no_class'
                });
            }
        });
        
        // Track navigation between business model sections
        let previousPageType = sessionStorage.getItem('previous_page_type');
        const currentPageType = this.getPageType();
        
        if (previousPageType && previousPageType !== currentPageType) {
            this.pushEvent('cross_model_navigation', {
                'from_model': this.pageTypeToBusinessModel(previousPageType),
                'to_model': this.pageTypeToBusinessModel(currentPageType),
                'navigation_type': 'page_change'
            });
        }
        
        sessionStorage.setItem('previous_page_type', currentPageType);
    }
    
    setupConversionEvents() {
        // Enhanced form submission tracking
        document.addEventListener('submit', (e) => {
            const form = e.target;
            const formData = this.getFormData(form);
            
            this.pushEvent('form_submission', {
                'form_type': formData.type,
                'business_model': formData.businessModel,
                'conversion_value': formData.value,
                'form_location': this.getElementLocation(form)
            });
        });
        
        // Waitlist signup tracking (SaaS specific)
        document.addEventListener('click', (e) => {
            if (e.target.matches('.waitlist-form button[type="submit"]')) {
                const form = e.target.closest('.waitlist-form');
                const product = form?.dataset.product || 'unknown';
                
                this.pushEvent('waitlist_signup_attempt', {
                    'product_name': product,
                    'business_model': 'saas',
                    'conversion_category': 'lead_generation',
                    'conversion_value': 12
                });
            }
        });
        
        // CTA click tracking with business context
        document.addEventListener('click', (e) => {
            if (e.target.matches('.btn, .cta-button') || e.target.closest('.btn, .cta-button')) {
                const button = e.target.closest('.btn, .cta-button') || e.target;
                const businessModel = this.identifyBusinessModelFromContext(button);
                
                this.pushEvent('cta_click', {
                    'cta_text': button.textContent.trim(),
                    'cta_type': button.classList.contains('btn-primary') ? 'primary' : 'secondary',
                    'business_model': businessModel,
                    'page_section': this.getElementSection(button)
                });
            }
        });
    }
    
    setupUserJourneyEvents() {\n        // Track user engagement patterns
        let engagementScore = 0;\n        const engagementEvents = ['scroll', 'click', 'mouseover', 'focus'];\n        \n        engagementEvents.forEach(eventType => {\n            document.addEventListener(eventType, this.throttle(() => {\n                engagementScore++;\n                \n                // Push engagement milestone events\n                if (engagementScore === 10) {\n                    this.pushEvent('user_engaged', {\n                        'engagement_level': 'low',\n                        'page_type': this.getPageType()\n                    });\n                } else if (engagementScore === 25) {\n                    this.pushEvent('user_engaged', {\n                        'engagement_level': 'medium',\n                        'page_type': this.getPageType()\n                    });\n                } else if (engagementScore === 50) {\n                    this.pushEvent('user_engaged', {\n                        'engagement_level': 'high',\n                        'page_type': this.getPageType()\n                    });\n                }\n            }, 1000));\n        });
        
        // Track time-based engagement
        let timeOnPage = 0;
        const timeTracker = setInterval(() => {
            timeOnPage += 30;
            
            if (timeOnPage === 30) { // 30 seconds
                this.pushEvent('time_engagement', {
                    'engagement_duration': '30s',
                    'page_type': this.getPageType()
                });
            } else if (timeOnPage === 120) { // 2 minutes
                this.pushEvent('time_engagement', {
                    'engagement_duration': '2m',
                    'page_type': this.getPageType()
                });
            } else if (timeOnPage === 300) { // 5 minutes
                this.pushEvent('time_engagement', {
                    'engagement_duration': '5m',
                    'page_type': this.getPageType()
                });
                clearInterval(timeTracker);
            }
        }, 30000);
        
        // Clear timer on page unload
        window.addEventListener('beforeunload', () => {
            clearInterval(timeTracker);
        });
    }
    
    setupPerformanceEvents() {
        // Track Core Web Vitals
        if ('PerformanceObserver' in window) {
            // Largest Contentful Paint
            new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const lastEntry = entries[entries.length - 1];
                
                this.pushEvent('core_web_vital', {
                    'metric_name': 'lcp',
                    'metric_value': Math.round(lastEntry.startTime),
                    'page_type': this.getPageType()
                });
            }).observe({ type: 'largest-contentful-paint', buffered: true });
            
            // First Input Delay
            new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach(entry => {
                    this.pushEvent('core_web_vital', {
                        'metric_name': 'fid',
                        'metric_value': Math.round(entry.processingStart - entry.startTime),
                        'page_type': this.getPageType()
                    });
                });
            }).observe({ type: 'first-input', buffered: true });
        }
        
        // Page load performance
        window.addEventListener('load', () => {
            setTimeout(() => {
                const perfData = performance.timing;
                const loadTime = perfData.loadEventEnd - perfData.navigationStart;
                
                this.pushEvent('page_performance', {
                    'load_time': loadTime,
                    'dom_ready': perfData.domContentLoadedEventEnd - perfData.navigationStart,
                    'first_byte': perfData.responseStart - perfData.navigationStart,
                    'page_type': this.getPageType()
                });
            }, 0);
        });
    }
    
    setupEcommerce() {
        if (!this.config.enableEcommerce) return;
        
        // Enhanced ecommerce for SaaS products
        this.setupSaaSEcommerce();
        
        // Service-based ecommerce for consulting
        this.setupServicesEcommerce();
    }
    
    setupSaaSEcommerce() {
        // Track SaaS product views
        if (window.location.pathname.includes('/products/') && !window.location.pathname.endsWith('/products/')) {
            const productName = this.getProductNameFromURL();
            
            this.pushEvent('view_item', {
                'currency': 'USD',
                'value': 0, // Freemium model
                'items': [{
                    'item_id': productName.toLowerCase().replace(/\\s+/g, '_'),
                    'item_name': productName,
                    'item_category': 'SaaS Product',
                    'item_brand': 'Resiliotech',
                    'price': 0,
                    'quantity': 1
                }]
            });
        }
        
        // Track waitlist as "add to wishlist"
        document.addEventListener('submit', (e) => {
            if (e.target.matches('.waitlist-form')) {
                const form = e.target;
                const productName = form.dataset.product || 'unknown';
                
                this.pushEvent('add_to_wishlist', {
                    'currency': 'USD',
                    'value': 12, // Lead value
                    'items': [{
                        'item_id': productName,
                        'item_name': this.formatProductName(productName),
                        'item_category': 'SaaS Product',
                        'item_brand': 'Resiliotech',
                        'price': 12,
                        'quantity': 1
                    }]
                });
            }
        });
    }
    
    setupServicesEcommerce() {
        // Track consulting service interest
        document.addEventListener('click', (e) => {
            if (e.target.matches('.service-cta, .audit-cta') || e.target.closest('.service-cta, .audit-cta')) {
                const service = this.identifyConsultingService(e.target);
                
                this.pushEvent('view_item', {
                    'currency': 'USD',
                    'value': service.value,
                    'items': [{
                        'item_id': service.id,
                        'item_name': service.name,
                        'item_category': 'Consulting Service',
                        'item_brand': 'Resiliotech',
                        'price': service.value,
                        'quantity': 1
                    }]
                });
            }
        });
    }
    
    // Utility Methods
    pushEvent(eventName, eventData = {}) {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
            'event': eventName,
            'timestamp': new Date().toISOString(),
            ...eventData
        });
        
        this.log('GTM Event:', eventName, eventData);
    }
    
    getPageType() {
        const path = window.location.pathname;
        if (path.includes('/products')) return 'saas';
        if (path.includes('/services') || path.includes('/consulting')) return 'consulting';
        if (path === '/') return 'homepage';
        if (path.includes('/blog')) return 'content';
        if (path.includes('/about')) return 'about';
        if (path.includes('/contact')) return 'contact';
        return 'other';
    }
    
    getUserType() {
        const pageViews = JSON.parse(sessionStorage.getItem('page_views') || '[]');
        const saasViews = pageViews.filter(p => p.includes('products')).length;
        const consultingViews = pageViews.filter(p => p.includes('services') || p.includes('consulting')).length;
        
        if (saasViews > consultingViews) return 'saas_interested';
        if (consultingViews > saasViews) return 'consulting_interested';
        if (saasViews > 0 && consultingViews > 0) return 'hybrid_interested';
        return 'new_visitor';
    }
    
    getSessionData() {
        return {
            session_start: sessionStorage.getItem('session_start') || new Date().toISOString(),
            pages_viewed: JSON.parse(sessionStorage.getItem('page_views') || '[]').length,
            referrer: document.referrer || 'direct'
        };
    }
    
    identifyBusinessModel(element, href) {
        if (href && href.includes('/products')) return 'saas';
        if (href && (href.includes('/services') || href.includes('/consulting'))) return 'consulting';
        if (element.textContent.toLowerCase().includes('product')) return 'saas';
        if (element.textContent.toLowerCase().includes('consulting') || 
            element.textContent.toLowerCase().includes('audit') ||
            element.textContent.toLowerCase().includes('service')) return 'consulting';
        return null;
    }
    
    identifyBusinessModelFromContext(element) {
        const section = element.closest('section');
        if (section) {
            if (section.classList.contains('products-') || section.id.includes('product')) return 'saas';
            if (section.classList.contains('services-') || section.id.includes('service')) return 'consulting';
        }
        
        const page = this.getPageType();
        return page === 'saas' ? 'saas' : page === 'consulting' ? 'consulting' : 'general';
    }
    
    pageTypeToBusinessModel(pageType) {
        switch(pageType) {
            case 'saas': return 'saas';
            case 'consulting': return 'consulting';
            default: return 'general';
        }
    }
    
    getFormData(form) {
        const formId = form.id;
        const formClasses = form.className;
        
        if (formClasses.includes('waitlist-form')) {
            return { type: 'waitlist', businessModel: 'saas', value: 12 };
        }
        if (formId === 'contact-form' || formClasses.includes('contact-form')) {
            return { type: 'contact', businessModel: 'consulting', value: 20 };
        }
        if (formClasses.includes('newsletter')) {
            return { type: 'newsletter', businessModel: 'both', value: 5 };
        }
        
        return { type: 'unknown', businessModel: 'unknown', value: 0 };
    }
    
    getElementLocation(element) {
        const section = element.closest('section');
        if (section) {
            return section.id || section.className.split(' ')[0] || 'unknown_section';
        }
        return 'unknown';
    }
    
    getElementSection(element) {
        const section = element.closest('section, header, footer, main');
        if (section) {
            return section.tagName.toLowerCase() + (section.id ? '#' + section.id : '');
        }
        return 'unknown';
    }
    
    getProductNameFromURL() {
        const pathParts = window.location.pathname.split('/');
        const productSlug = pathParts[pathParts.length - 2]; // Get second to last part
        return this.formatProductName(productSlug || 'unknown');
    }
    
    formatProductName(slug) {
        return slug.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    }
    
    identifyConsultingService(element) {
        const text = element.textContent.toLowerCase();
        
        if (text.includes('audit')) {
            return { id: 'ci_cd_audit', name: 'CI/CD Audit', value: 2500 };
        }
        if (text.includes('strategy')) {
            return { id: 'strategy_call', name: 'Strategy Call', value: 500 };
        }
        if (text.includes('implementation')) {
            return { id: 'implementation', name: 'Implementation Service', value: 5000 };
        }
        
        return { id: 'general_consulting', name: 'Consulting Service', value: 1000 };
    }
    
    throttle(func, delay) {
        let timeoutId;
        let lastExecTime = 0;
        return function (...args) {
            const currentTime = Date.now();
            
            if (currentTime - lastExecTime > delay) {
                func.apply(this, args);
                lastExecTime = currentTime;
            } else {
                clearTimeout(timeoutId);
                timeoutId = setTimeout(() => {
                    func.apply(this, args);
                    lastExecTime = Date.now();
                }, delay - (currentTime - lastExecTime));
            }
        };
    }
    
    log(...args) {
        if (this.config.enableDebug) {
            console.log('[GTM Config]', ...args);
        }
    }
}

// Initialize GTM configuration when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.gtmConfig = new GTMConfig();
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GTMConfig;
}