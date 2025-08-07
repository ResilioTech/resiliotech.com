/**
 * Enhanced Analytics Manager for CRO and Attribution
 * Implements GA4 + Clarity tracking with comprehensive event attribution
 */
class EnhancedAnalyticsManager {
    constructor() {
        this.config = {
            ga4PropertyId: 'G-P2YM46QZCK',
            clarityProjectId: 'sr1y78mww9',
            debugMode: window.location.hostname === 'localhost',
            sessionId: this.generateSessionId(),
            userId: this.getUserId()
        };
        
        this.pageData = {
            pageType: document.body.dataset.pageType || 'unknown',
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            referrer: document.referrer,
            viewport: `${window.innerWidth}x${window.innerHeight}`
        };
        
        this.initializeTracking();
        this.setupEventListeners();
    }

    /**
     * Initialize tracking systems and enhanced measurement
     */
    initializeTracking() {
        // Initialize dataLayer if not present
        window.dataLayer = window.dataLayer || [];
        
        // Set up enhanced ecommerce and custom dimensions
        this.gtag('config', this.config.ga4PropertyId, {
            // Enhanced measurement settings
            enhanced_measurement: {
                scrolls: true,
                outbound_clicks: true,
                site_search: true,
                video_engagement: true,
                file_downloads: true
            },
            // Custom dimensions for startup attribution
            custom_map: {
                'custom_parameter_1': 'startup_type',
                'custom_parameter_2': 'lead_source',
                'custom_parameter_3': 'conversion_path',
                'custom_parameter_4': 'engagement_score'
            },
            // User properties
            user_properties: {
                session_id: this.config.sessionId,
                page_type: this.pageData.pageType
            }
        });

        // Track initial page view with enhanced data
        this.trackPageView();
        
        // Initialize session tracking
        this.initializeSessionTracking();
        
        this.log('Enhanced Analytics initialized');
    }

    /**
     * Set up comprehensive event listeners for CRO tracking
     */
    setupEventListeners() {
        // CTA Click Attribution
        document.addEventListener('click', (event) => {
            const element = event.target.closest('[onclick*="Modal"], .btn, .cta-button, a[href*="contact"], a[href*="audit"]');
            if (element) {
                this.trackCTAClick(element, event);
            }
        });

        // Form interaction tracking
        document.addEventListener('focusin', (event) => {
            if (event.target.matches('input, textarea, select')) {
                this.trackFormInteraction('field_focus', event.target);
            }
        });

        // Form submission attribution
        document.addEventListener('submit', (event) => {
            this.trackFormSubmission(event.target);
        });

        // Scroll depth tracking (enhanced)
        this.setupScrollTracking();
        
        // Time on page tracking
        this.setupTimeTracking();
        
        // Exit intent tracking
        this.setupExitIntentTracking();
    }

    /**
     * Track CTA clicks with full attribution
     */
    trackCTAClick(element, event) {
        const ctaData = this.extractCTAData(element);
        
        // GA4 Event
        this.gtag('event', 'cta_click', {
            event_category: 'engagement',
            event_label: ctaData.label,
            cta_type: ctaData.type,
            cta_position: ctaData.position,
            page_section: ctaData.section,
            lead_source: this.getLeadSource(),
            startup_type: this.getStartupType(),
            session_id: this.config.sessionId,
            timestamp: new Date().toISOString(),
            value: ctaData.value || 1
        });

        // Clarity custom event
        if (window.clarity) {
            window.clarity('event', 'cta_click', {
                cta_text: ctaData.text,
                cta_url: ctaData.url,
                position: ctaData.position
            });
        }

        this.log('CTA Click tracked:', ctaData);
    }

    /**
     * Extract comprehensive CTA data for attribution
     */
    extractCTAData(element) {
        const text = element.textContent?.trim() || '';
        const href = element.href || '';
        const onclick = element.getAttribute('onclick') || '';
        
        // Determine CTA type
        let type = 'unknown';
        if (onclick.includes('openAuditModal') || text.includes('Audit')) {
            type = 'audit_request';
        } else if (onclick.includes('openCalendlyModal') || text.includes('Call') || text.includes('Schedule')) {
            type = 'consultation_booking';
        } else if (onclick.includes('openChecklistModal') || text.includes('Download')) {
            type = 'resource_download';
        } else if (href.includes('contact') || text.includes('Contact')) {
            type = 'contact_form';
        } else if (href.includes('consulting')) {
            type = 'service_inquiry';
        }

        // Determine position and section
        const section = this.getElementSection(element);
        const position = this.getElementPosition(element);

        return {
            type,
            label: text,
            text,
            url: href,
            section,
            position,
            value: this.getCTAValue(type)
        };
    }

    /**
     * Track form submissions with full attribution path
     */
    trackFormSubmission(form) {
        const formData = this.extractFormData(form);
        
        // GA4 Enhanced Ecommerce - Lead Generation
        this.gtag('event', 'generate_lead', {
            event_category: 'conversion',
            event_label: formData.type,
            form_type: formData.type,
            form_source: formData.source,
            lead_value: formData.estimatedValue,
            conversion_path: this.getConversionPath(),
            session_duration: this.getSessionDuration(),
            page_views: this.getSessionPageViews(),
            startup_type: this.getStartupType(),
            session_id: this.config.sessionId
        });

        // Track high-value conversions
        if (formData.estimatedValue > 1000) {
            this.gtag('event', 'purchase', {
                transaction_id: this.generateTransactionId(),
                value: formData.estimatedValue,
                currency: 'USD',
                items: [{
                    item_id: formData.type,
                    item_name: formData.name,
                    category: 'lead_generation',
                    quantity: 1,
                    price: formData.estimatedValue
                }]
            });
        }

        this.log('Form submission tracked:', formData);
    }

    /**
     * Enhanced scroll tracking for engagement measurement
     */
    setupScrollTracking() {
        let maxScroll = 0;
        const scrollMilestones = [25, 50, 75, 90, 100];
        let trackedMilestones = new Set();

        const trackScroll = () => {
            const scrollPercentage = Math.round(
                (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
            );
            
            maxScroll = Math.max(maxScroll, scrollPercentage);
            
            // Track milestone scrolls
            scrollMilestones.forEach(milestone => {
                if (scrollPercentage >= milestone && !trackedMilestones.has(milestone)) {
                    trackedMilestones.add(milestone);
                    
                    this.gtag('event', 'scroll', {
                        event_category: 'engagement',
                        event_label: `${milestone}%`,
                        scroll_depth: milestone,
                        session_id: this.config.sessionId
                    });
                }
            });
        };

        // Throttled scroll tracking
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

    /**
     * Track time on page and engagement
     */
    setupTimeTracking() {
        const startTime = Date.now();
        const engagementMilestones = [30, 60, 120, 300, 600]; // seconds
        let trackedTimes = new Set();

        setInterval(() => {
            const timeOnPage = Math.floor((Date.now() - startTime) / 1000);
            
            engagementMilestones.forEach(milestone => {
                if (timeOnPage >= milestone && !trackedTimes.has(milestone)) {
                    trackedTimes.add(milestone);
                    
                    this.gtag('event', 'timing_complete', {
                        event_category: 'engagement',
                        event_label: `${milestone}s`,
                        time_on_page: timeOnPage,
                        session_id: this.config.sessionId
                    });
                }
            });
        }, 10000); // Check every 10 seconds
    }

    /**
     * Enhanced exit intent tracking
     */
    setupExitIntentTracking() {
        let exitTracked = false;
        
        document.addEventListener('mouseleave', (event) => {
            if (!exitTracked && event.clientY <= 0) {
                exitTracked = true;
                
                this.gtag('event', 'exit_intent', {
                    event_category: 'behavior',
                    session_duration: this.getSessionDuration(),
                    scroll_depth: this.getCurrentScrollDepth(),
                    page_views: this.getSessionPageViews()
                });
            }
        });
    }

    /**
     * Helper methods for data extraction and analysis
     */
    getLeadSource() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('utm_source') || 
               urlParams.get('source') || 
               document.referrer || 
               'direct';
    }

    getStartupType() {
        // Try to detect startup type from page interactions
        const interactions = this.getSessionData().interactions || [];
        
        if (interactions.some(i => i.includes('saas'))) return 'saas';
        if (interactions.some(i => i.includes('fintech'))) return 'fintech';
        if (interactions.some(i => i.includes('api'))) return 'api_first';
        
        return 'unknown';
    }

    getConversionPath() {
        return JSON.stringify(this.getSessionData().pageViews || []);
    }

    getCTAValue(type) {
        const values = {
            'audit_request': 500,
            'consultation_booking': 1000,
            'resource_download': 50,
            'contact_form': 750,
            'service_inquiry': 1200
        };
        return values[type] || 10;
    }

    getElementSection(element) {
        const section = element.closest('section');
        return section?.id || section?.className?.split(' ')[0] || 'unknown';
    }

    getElementPosition(element) {
        const rect = element.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        
        if (rect.top < viewportHeight * 0.33) return 'above_fold';
        if (rect.top < viewportHeight * 0.66) return 'middle_fold';
        return 'below_fold';
    }

    extractFormData(form) {
        const formId = form.id || form.name || 'unknown';
        const formData = new FormData(form);
        
        const data = {
            type: formId.replace('-form', '').replace('_form', ''),
            source: this.getLeadSource(),
            timestamp: new Date().toISOString(),
            fields: {}
        };

        // Extract field data
        for (let [key, value] of formData.entries()) {
            if (key !== 'bot-field' && key !== 'form-name') {
                data.fields[key] = value;
            }
        }

        // Estimate lead value based on form type
        const estimatedValues = {
            'audit': 500,
            'contact': 1000,
            'checklist': 50,
            'newsletter': 25
        };
        
        data.estimatedValue = estimatedValues[data.type] || 100;
        data.name = `${data.type} form submission`;

        return data;
    }

    // Session and user tracking
    generateSessionId() {
        return 'session_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
    }

    getUserId() {
        let userId = localStorage.getItem('analytics_user_id');
        if (!userId) {
            userId = 'user_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('analytics_user_id', userId);
        }
        return userId;
    }

    initializeSessionTracking() {
        const sessionData = {
            sessionId: this.config.sessionId,
            startTime: Date.now(),
            pageViews: [window.location.pathname],
            interactions: [],
            scrollDepth: 0
        };
        
        sessionStorage.setItem('analytics_session', JSON.stringify(sessionData));
    }

    getSessionData() {
        const data = sessionStorage.getItem('analytics_session');
        return data ? JSON.parse(data) : {};
    }

    updateSessionData(updates) {
        const current = this.getSessionData();
        const updated = { ...current, ...updates };
        sessionStorage.setItem('analytics_session', JSON.stringify(updated));
    }

    getSessionDuration() {
        const sessionData = this.getSessionData();
        return sessionData.startTime ? Math.floor((Date.now() - sessionData.startTime) / 1000) : 0;
    }

    getSessionPageViews() {
        return this.getSessionData().pageViews?.length || 1;
    }

    getCurrentScrollDepth() {
        return Math.round(
            (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
        );
    }

    generateTransactionId() {
        return 'txn_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
    }

    // Utility methods
    gtag(...args) {
        if (window.gtag) {
            window.gtag(...args);
        } else if (this.config.debugMode) {
            console.log('gtag:', ...args);
        }
    }

    trackPageView() {
        this.gtag('event', 'page_view', {
            page_title: document.title,
            page_location: window.location.href,
            page_type: this.pageData.pageType,
            session_id: this.config.sessionId,
            user_id: this.config.userId
        });
    }

    log(...args) {
        if (this.config.debugMode) {
            console.log('[Enhanced Analytics]', ...args);
        }
    }
}

// Initialize enhanced analytics when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.enhancedAnalytics = new EnhancedAnalyticsManager();
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EnhancedAnalyticsManager;
}
