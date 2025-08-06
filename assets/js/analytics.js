/**
 * Analytics and Conversion Tracking Setup
 * Handles Google Analytics, conversion goals, and custom event tracking
 */

class AnalyticsManager {
    constructor() {
        this.config = {
            gaId: 'G-XXXXXXXXXX', // Replace with actual Google Analytics ID
            gtmId: 'GTM-XXXXXXX',  // Replace with actual GTM ID if using
            ga4MeasurementId: 'G-XXXXXXXXXX', // GA4 Measurement ID
            debugMode: window.location.hostname === 'localhost',
            trackingEnabled: true,
            enableDualModelTracking: true,
            enableProductsTracking: true,
            enableEcommerce: true
        };
        
        this.conversionGoals = {
            // Consulting Lead Generation
            'ci_cd_audit_form_submit': { value: 5, category: 'Consulting Lead Generation', businessModel: 'consulting' },
            'infrastructure_checklist_download': { value: 3, category: 'Consulting Lead Generation', businessModel: 'consulting' },
            'strategy_call_scheduled': { value: 15, category: 'Consulting Lead Generation', businessModel: 'consulting' },
            'roi_calculator_completed': { value: 7, category: 'Consulting Lead Generation', businessModel: 'consulting' },
            'contact_form_submit': { value: 20, category: 'Consulting Contact', businessModel: 'consulting' },
            
            // SaaS Product Conversions
            'waitlist_signup': { value: 12, category: 'SaaS Lead Generation', businessModel: 'saas' },
            'product_page_view': { value: 2, category: 'SaaS Interest', businessModel: 'saas' },
            'product_comparison_view': { value: 4, category: 'SaaS Interest', businessModel: 'saas' },
            'product_feature_click': { value: 3, category: 'SaaS Engagement', businessModel: 'saas' },
            'beta_access_request': { value: 15, category: 'SaaS Conversion', businessModel: 'saas' },
            
            // Cross-Model Conversions
            'newsletter_subscribe': { value: 5, category: 'Newsletter', businessModel: 'both' },
            'blog_subscribe': { value: 6, category: 'Content', businessModel: 'both' },
            
            // Engagement
            'page_scroll_75': { value: 1, category: 'Engagement', businessModel: 'both' },
            'video_play': { value: 2, category: 'Engagement', businessModel: 'both' },
            'case_study_view': { value: 3, category: 'Consulting Interest', businessModel: 'consulting' },
            
            // Business Intent
            'pricing_page_view': { value: 10, category: 'Consulting Sales Intent', businessModel: 'consulting' },
            'services_detail_view': { value: 5, category: 'Consulting Sales Intent', businessModel: 'consulting' },
            'products_nav_click': { value: 8, category: 'SaaS Sales Intent', businessModel: 'saas' }
        };
        
        // Enhanced tracking for dual business model
        this.businessModelFunnels = {
            consulting: {
                awareness: ['page_view', 'blog_read', 'case_study_view'],
                interest: ['services_detail_view', 'pricing_page_view', 'roi_calculator_opened'],
                consideration: ['contact_form_start', 'strategy_call_click', 'audit_request'],
                conversion: ['contact_form_submit', 'strategy_call_scheduled', 'audit_booked']
            },
            saas: {
                awareness: ['products_page_view', 'product_discovery'],
                interest: ['product_page_view', 'product_comparison_view', 'feature_exploration'],
                consideration: ['waitlist_signup', 'beta_access_request', 'product_demo_request'],
                conversion: ['trial_signup', 'subscription_start', 'upgrade_complete']
            }
        };
        
        this.init();
    }

    init() {
        if (!this.config.trackingEnabled) {
            this.log('Analytics tracking disabled');
            return;
        }

        this.loadGoogleAnalytics();
        this.loadGoogleTagManager();
        this.setupConversionTracking();
        this.setupDualModelTracking();
        this.trackPageView();
        this.setupScrollTracking();
        this.setupFormTracking();
        this.setupClickTracking();
        this.setupProductsTracking();
        
        this.log('Analytics initialized successfully');
    }

    loadGoogleAnalytics() {
        if (!this.config.gaId || this.config.gaId === 'G-XXXXXXXXXX') {
            this.log('Google Analytics ID not configured');
            return;
        }

        // Load gtag script
        const script = document.createElement('script');
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${this.config.gaId}`;
        document.head.appendChild(script);

        // Initialize gtag
        window.dataLayer = window.dataLayer || [];
        window.gtag = function() {
            dataLayer.push(arguments);
        };

        // Configure Google Analytics
        gtag('js', new Date());
        gtag('config', this.config.gaId, {
            debug_mode: this.config.debugMode,
            send_page_view: false // We'll handle this manually
        });

        this.log('Google Analytics loaded');
    }
    
    loadGoogleTagManager() {
        if (!this.config.gtmId || this.config.gtmId === 'GTM-XXXXXXX') {
            this.log('Google Tag Manager ID not configured');
            return;
        }

        // Load GTM script
        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer', this.config.gtmId);
        
        // Initialize dataLayer with business model context
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
            'business_model_enabled': 'dual',
            'consulting_enabled': true,
            'saas_enabled': true,
            'page_type': this.getCurrentPageType()
        });

        this.log('Google Tag Manager loaded');
    }
    
    setupDualModelTracking() {
        // Set up specific tracking for the dual business model
        
        // Track cross-model user journeys
        this.trackUserJourney();
        
        // Set up A/B testing for dual model
        this.setupModelABTesting();
        
        // Track model preference indicators
        this.trackModelPreferences();
    }
    
    setupProductsTracking() {
        if (!this.config.enableProductsTracking) return;
        
        // Track when users land on products pages
        if (window.location.pathname.includes('/products')) {
            this.trackEvent('products_page_visit', {
                product_section: 'main',
                business_model: 'saas'
            });
        }
        
        // Track individual product page visits
        if (window.location.pathname.includes('/products/') && !window.location.pathname.endsWith('/products/')) {
            const productName = window.location.pathname.split('/products/')[1].replace('/', '');
            this.trackProductView(productName.replace('-', ' '));
        }
    }
    
    trackUserJourney() {
        // Track cross-model navigation patterns
        const previousPage = sessionStorage.getItem('previous_page');
        const currentPageType = this.getCurrentPageType();
        const previousPageType = this.getPageTypeFromPath(previousPage);
        
        if (previousPage && previousPageType !== currentPageType) {
            this.trackEvent('cross_model_navigation', {
                from: previousPageType,
                to: currentPageType,
                journey_type: `${previousPageType}_to_${currentPageType}`
            });
        }
        
        sessionStorage.setItem('previous_page', window.location.pathname);
    }
    
    getPageTypeFromPath(path) {
        if (!path) return 'unknown';
        if (path.includes('/products')) return 'saas';
        if (path.includes('/services') || path.includes('/consulting')) return 'consulting';
        return 'general';
    }
    
    setupModelABTesting() {
        // Set up A/B testing for dual business model presentation
        const testVariant = Math.random() > 0.5 ? 'consulting_first' : 'saas_first';
        sessionStorage.setItem('model_test_variant', testVariant);
        
        this.trackEvent('ab_test_assigned', {
            test_name: 'dual_model_presentation',
            variant: testVariant
        });
    }
    
    trackModelPreferences() {
        // Track user preferences based on behavior
        document.addEventListener('click', (e) => {
            const target = e.target.closest('a');
            if (!target) return;
            
            const href = target.getAttribute('href');
            if (href && href.includes('/products')) {
                this.incrementModelPreference('saas');
            } else if (href && (href.includes('/services') || href.includes('/consulting'))) {
                this.incrementModelPreference('consulting');
            }
        });
    }
    
    incrementModelPreference(model) {
        const preferences = JSON.parse(localStorage.getItem('model_preferences') || '{"saas": 0, "consulting": 0}');
        preferences[model]++;
        localStorage.setItem('model_preferences', JSON.stringify(preferences));
        
        // Track preference development
        if (preferences[model] === 3) { // After 3 interactions
            this.trackEvent('model_preference_identified', {
                preferred_model: model,
                confidence_level: 'high'
            });
        }
    }

    trackEvent(eventName, properties = {}) {
        if (!this.config.trackingEnabled) return;

        const conversionGoal = this.conversionGoals[eventName];
        const eventData = {
            event_category: conversionGoal?.category || 'General',
            event_label: properties.label || '',
            value: conversionGoal?.value || 0,
            business_model: conversionGoal?.businessModel || 'unknown',
            funnel_stage: this.identifyFunnelStage(eventName, conversionGoal?.businessModel),
            ...properties
        };

        // Enhanced GA4 tracking with custom parameters
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, {
                ...eventData,
                custom_parameters: {
                    business_model: eventData.business_model,
                    funnel_stage: eventData.funnel_stage,
                    page_type: this.getCurrentPageType(),
                    user_type: this.getUserType()
                }
            });
        }

        // Enhanced GTM tracking with business model context
        if (typeof dataLayer !== 'undefined') {
            dataLayer.push({
                event: eventName,
                event_category: eventData.event_category,
                event_label: eventData.event_label,
                value: eventData.value,
                business_model: eventData.business_model,
                funnel_stage: eventData.funnel_stage,
                page_type: this.getCurrentPageType(),
                user_session_data: this.getSessionData(),
                ...eventData
            });
        }

        // Track to both advanced analytics dashboard
        if (window.analyticsManager && window.analyticsManager !== this) {
            window.analyticsManager.trackEvent(eventName, eventData);
        }

        // Custom tracking (can be extended for other platforms)
        this.customTracking(eventName, eventData);

        this.log('Event tracked:', eventName, eventData);
    }

    customTracking(eventName, eventData) {
        // Add custom tracking logic here (e.g., for other analytics platforms)
        // Example: Mixpanel, Amplitude, etc.
        
        // Store in localStorage for debugging/analysis
        if (this.config.debugMode) {
            const events = JSON.parse(localStorage.getItem('analytics_events') || '[]');
            events.push({
                timestamp: new Date().toISOString(),
                event: eventName,
                data: eventData
            });
            
            // Keep only last 100 events
            if (events.length > 100) {
                events.splice(0, events.length - 100);
            }
            
            localStorage.setItem('analytics_events', JSON.stringify(events));
        }
    }

    trackPageView(pageName = null) {
        const page = pageName || document.title;
        const url = window.location.pathname + window.location.search;
        const pageType = this.getCurrentPageType();
        
        // Update session storage
        this.updateSessionData(url);

        this.trackEvent('page_view', {
            page_title: page,
            page_location: window.location.href,
            page_path: url,
            page_type: pageType,
            business_model_context: pageType === 'saas' ? 'saas' : pageType === 'consulting' ? 'consulting' : 'both'
        });

        // Enhanced GA4 page view with custom dimensions
        if (typeof gtag !== 'undefined') {
            gtag('config', this.config.gaId, {
                page_title: page,
                page_location: window.location.href,
                page_path: url,
                custom_map: {
                    custom_dimension_1: 'business_model_context',
                    custom_dimension_2: 'page_type',
                    custom_dimension_3: 'user_type'
                }
            });
            
            // Send additional page view event for dual business model tracking
            gtag('event', 'page_view_enhanced', {
                page_type: pageType,
                business_model_context: pageType === 'saas' ? 'saas' : pageType === 'consulting' ? 'consulting' : 'both',
                user_type: this.getUserType()
            });
        }
    }
    
    updateSessionData(url) {
        // Initialize session tracking
        if (!sessionStorage.getItem('session_start')) {
            sessionStorage.setItem('session_start', new Date().toISOString());
        }
        
        // Track page views in session
        const pageViews = JSON.parse(sessionStorage.getItem('page_views') || '[]');
        pageViews.push(url);
        sessionStorage.setItem('page_views', JSON.stringify(pageViews));
    }

    setupConversionTracking() {
        // Track lead magnet interactions (Consulting)
        document.addEventListener('click', (e) => {
            // Audit CTA clicks (Consulting)
            if (e.target.matches('.audit-cta') || e.target.closest('.audit-cta')) {
                this.trackEvent('ci_cd_audit_cta_click', {
                    label: 'Primary CTA',
                    location: this.getElementLocation(e.target),
                    business_model: 'consulting'
                });
            }

            // Lead magnet button clicks (Consulting)
            if (e.target.matches('.lead-magnet-btn') || e.target.closest('.lead-magnet-btn')) {
                const btn = e.target.closest('.lead-magnet-btn') || e.target;
                const modalId = btn.getAttribute('data-modal');
                this.trackEvent('lead_magnet_click', {
                    label: modalId,
                    location: this.getElementLocation(btn),
                    business_model: 'consulting'
                });
            }

            // Products navigation clicks (SaaS)
            if (e.target.matches('a[href*="/products"]') || e.target.closest('a[href*="/products"]')) {
                const link = e.target.closest('a[href*="/products"]') || e.target;
                this.trackEvent('products_nav_click', {
                    label: link.textContent.trim(),
                    location: this.getElementLocation(link),
                    business_model: 'saas'
                });
            }
            
            // Waitlist form interactions (SaaS)
            if (e.target.matches('.waitlist-form button[type="submit"]') || e.target.closest('.waitlist-form button[type="submit"]')) {
                const btn = e.target.closest('.waitlist-form button[type="submit"]') || e.target;
                const form = btn.closest('.waitlist-form');
                const productName = form?.dataset.product || 'unknown';
                this.trackEvent('waitlist_signup_attempt', {
                    label: productName,
                    location: this.getElementLocation(form),
                    business_model: 'saas'
                });
            }
            
            // Product card interactions (SaaS)
            if (e.target.matches('.product-card') || e.target.closest('.product-card')) {
                const card = e.target.closest('.product-card') || e.target;
                const productName = this.getProductNameFromCard(card);
                this.trackEvent('product_card_click', {
                    label: productName,
                    location: 'products_page',
                    business_model: 'saas'
                });
            }

            // Quick action card clicks (Consulting)
            if (e.target.matches('.quick-action-card') || e.target.closest('.quick-action-card')) {
                const card = e.target.closest('.quick-action-card') || e.target;
                const actionType = this.getActionType(card);
                this.trackEvent('quick_action_click', {
                    label: actionType,
                    location: 'contact_section',
                    business_model: 'consulting'
                });
            }
        });
        
        // Track comparison table interactions (SaaS)
        const compareTable = document.querySelector('.compare-table');
        if (compareTable) {
            compareTable.addEventListener('click', (e) => {
                if (e.target.closest('tr')) {
                    const row = e.target.closest('tr');
                    const feature = row.querySelector('td:first-child')?.textContent.trim() || 'unknown';
                    this.trackEvent('product_comparison_view', {
                        label: feature,
                        location: 'products_page',
                        business_model: 'saas'
                    });
                }
            });
        }

        // Track modal opens
        const originalOpenModal = window.leadMagnetManager?.openModal;
        if (originalOpenModal) {
            window.leadMagnetManager.openModal = (modalId) => {
                this.trackEvent('modal_opened', {
                    label: modalId,
                    lead_magnet_type: this.getLeadMagnetType(modalId)
                });
                return originalOpenModal.call(window.leadMagnetManager, modalId);
            };
        }
    }

    setupScrollTracking() {
        let scrollDepths = [25, 50, 75, 90];
        let trackedDepths = new Set();

        const trackScroll = () => {
            const scrollPercent = Math.round(
                (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
            );

            scrollDepths.forEach(depth => {
                if (scrollPercent >= depth && !trackedDepths.has(depth)) {
                    trackedDepths.add(depth);
                    this.trackEvent('page_scroll', {
                        label: `${depth}%`,
                        value: depth
                    });

                    if (depth === 75) {
                        this.trackEvent('page_scroll_75');
                    }
                }
            });
        };

        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    trackScroll();
                    ticking = false;
                });
                ticking = true;
            }
        });
    }

    setupFormTracking() {
        // Track form starts (when user focuses on first field)
        document.addEventListener('focus', (e) => {
            if (e.target.matches('form input:first-of-type, form textarea:first-of-type')) {
                const form = e.target.closest('form');
                const formType = this.getFormType(form);
                
                if (!form.dataset.startTracked) {
                    this.trackEvent('form_start', {
                        label: formType,
                        location: this.getElementLocation(form)
                    });
                    form.dataset.startTracked = 'true';
                }
            }
        }, true);

        // Track form submissions
        document.addEventListener('submit', (e) => {
            const form = e.target;
            const formType = this.getFormType(form);
            
            this.trackEvent('form_submit', {
                label: formType,
                location: this.getElementLocation(form)
            });

            // Track specific conversion goals
            if (formType === 'contact') {
                this.trackEvent('contact_form_submit');
            }
        });
    }

    setupClickTracking() {
        // Track CTA clicks
        document.addEventListener('click', (e) => {
            if (e.target.matches('.btn') || e.target.closest('.btn')) {
                const btn = e.target.closest('.btn') || e.target;
                const btnText = btn.textContent.trim();
                const btnType = btn.classList.contains('btn-primary') ? 'primary' : 'secondary';

                this.trackEvent('cta_click', {
                    label: btnText,
                    button_type: btnType,
                    location: this.getElementLocation(btn)
                });
            }

            // Track navigation clicks
            if (e.target.matches('.nav-link') || e.target.closest('.nav-link')) {
                const link = e.target.closest('.nav-link') || e.target;
                this.trackEvent('navigation_click', {
                    label: link.textContent.trim(),
                    location: 'header'
                });
            }
        });
    }

    // Enhanced utility methods for dual business model
    identifyFunnelStage(eventName, businessModel) {
        if (!businessModel || !this.businessModelFunnels[businessModel]) {
            return 'unknown';
        }
        
        const funnels = this.businessModelFunnels[businessModel];
        for (const [stage, events] of Object.entries(funnels)) {
            if (events.includes(eventName)) {
                return stage;
            }
        }
        return 'unknown';
    }
    
    getCurrentPageType() {
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
        // Determine user type based on behavior and page views
        const pageViews = JSON.parse(sessionStorage.getItem('page_views') || '[]');
        const consultingPages = pageViews.filter(p => p.includes('services') || p.includes('consulting') || p.includes('audit')).length;
        const saasPages = pageViews.filter(p => p.includes('products')).length;
        
        if (saasPages > consultingPages) return 'saas_interested';
        if (consultingPages > saasPages) return 'consulting_interested';
        if (saasPages > 0 && consultingPages > 0) return 'hybrid_interested';
        return 'new_visitor';
    }
    
    getSessionData() {
        return {
            session_start: sessionStorage.getItem('session_start') || new Date().toISOString(),
            pages_viewed: JSON.parse(sessionStorage.getItem('page_views') || '[]').length,
            time_on_site: Date.now() - new Date(sessionStorage.getItem('session_start') || Date.now()).getTime(),
            referrer: document.referrer || 'direct'
        };
    }
    
    getProductNameFromCard(card) {
        const heading = card.querySelector('h3');
        return heading ? heading.textContent.trim() : 'unknown_product';
    }

    getElementLocation(element) {
        // Determine which section/area the element is in
        const section = element.closest('section');
        if (section) {
            return section.id || section.className.split(' ')[0] || 'unknown_section';
        }
        return 'unknown';
    }

    getFormType(form) {
        if (form.closest('.modal')) {
            return form.closest('.modal').id || 'modal_form';
        }
        if (form.id === 'contact-form') return 'contact';
        return form.name || form.className || 'unknown_form';
    }

    getActionType(card) {
        const text = card.textContent.toLowerCase();
        if (text.includes('audit')) return 'audit';
        if (text.includes('checklist')) return 'checklist';
        if (text.includes('call')) return 'strategy_call';
        return 'unknown';
    }

    getLeadMagnetType(modalId) {
        switch (modalId) {
            case 'auditModal': return 'ci_cd_audit';
            case 'checklistModal': return 'infrastructure_checklist';
            case 'calendlyModal': return 'strategy_call';
            case 'roiModal': return 'roi_calculator';
            default: return 'unknown';
        }
    }

    // Enhanced conversion tracking for dual business model
    trackConversion(goalName, value = null, properties = {}) {
        const conversionGoal = this.conversionGoals[goalName];
        const conversionValue = value || conversionGoal?.value || 0;
        
        this.trackEvent(goalName, {
            ...properties,
            value: conversionValue,
            business_model: conversionGoal?.businessModel || 'unknown'
        });
        
        // Enhanced GA4 conversion tracking
        if (typeof gtag !== 'undefined') {
            gtag('event', 'conversion', {
                send_to: this.config.gaId + '/' + goalName,
                value: conversionValue,
                currency: 'USD',
                business_model: conversionGoal?.businessModel,
                conversion_label: goalName
            });
        }
        
        // Track as ecommerce event for SaaS conversions
        if (conversionGoal?.businessModel === 'saas' && this.config.enableEcommerce) {
            this.trackSaaSConversion(goalName, conversionValue, properties);
        }
    }
    
    trackSaaSConversion(eventName, value, properties = {}) {
        // GA4 ecommerce tracking for SaaS products
        if (typeof gtag !== 'undefined') {
            const itemData = {
                item_id: properties.product || 'unknown_product',
                item_name: properties.product_name || properties.product || 'SaaS Product',
                item_category: 'SaaS',
                item_brand: 'Resiliotech',
                price: value,
                quantity: 1
            };
            
            // Track based on conversion type
            if (eventName === 'waitlist_signup') {
                gtag('event', 'add_to_wishlist', {
                    currency: 'USD',
                    value: value,
                    items: [itemData]
                });
            } else if (eventName === 'beta_access_request') {
                gtag('event', 'begin_checkout', {
                    currency: 'USD',
                    value: value,
                    items: [itemData]
                });
            }
        }
    }
    
    trackProductView(productName, properties = {}) {
        // Enhanced product view tracking for SaaS
        this.trackEvent('product_page_view', {
            product_name: productName,
            ...properties,
            business_model: 'saas'
        });
        
        if (typeof gtag !== 'undefined') {
            gtag('event', 'view_item', {
                currency: 'USD',
                value: 0,
                items: [{
                    item_id: productName.toLowerCase().replace(/\s+/g, '_'),
                    item_name: productName,
                    item_category: 'SaaS Product',
                    item_brand: 'Resiliotech'
                }]
            });
        }
    }

    trackCustomEvent(eventName, properties = {}) {
        this.trackEvent(eventName, properties);
    }

    // Debug methods
    getTrackedEvents() {
        if (this.config.debugMode) {
            return JSON.parse(localStorage.getItem('analytics_events') || '[]');
        }
        return [];
    }

    clearTrackedEvents() {
        if (this.config.debugMode) {
            localStorage.removeItem('analytics_events');
        }
    }

    log(...args) {
        if (this.config.debugMode) {
            console.log('[Analytics]', ...args);
        }
    }
}

// Initialize analytics when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.analyticsManager = new AnalyticsManager();
    
    // Expose some methods globally for easy access
    window.trackEvent = (eventName, properties) => {
        window.analyticsManager.trackEvent(eventName, properties);
    };
    
    window.trackConversion = (goalName, value, properties) => {
        window.analyticsManager.trackConversion(goalName, value, properties);
    };
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AnalyticsManager;
}