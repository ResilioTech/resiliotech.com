/**
 * Analytics and Conversion Tracking Setup
 * Handles Google Analytics, conversion goals, and custom event tracking
 */

class AnalyticsManager {
    constructor() {
        this.config = {
            gaId: 'G-XXXXXXXXXX', // Replace with actual Google Analytics ID
            gtmId: 'GTM-XXXXXXX',  // Replace with actual GTM ID if using
            debugMode: window.location.hostname === 'localhost',
            trackingEnabled: true
        };
        
        this.conversionGoals = {
            // Lead Magnet Conversions
            'ci_cd_audit_form_submit': { value: 5, category: 'Lead Generation' },
            'infrastructure_checklist_download': { value: 3, category: 'Lead Generation' },
            'strategy_call_scheduled': { value: 15, category: 'Lead Generation' },
            'roi_calculator_completed': { value: 7, category: 'Lead Generation' },
            
            // Contact Form Conversions
            'contact_form_submit': { value: 20, category: 'Contact' },
            'email_signup': { value: 5, category: 'Engagement' },
            
            // Page Engagement
            'page_scroll_75': { value: 1, category: 'Engagement' },
            'video_play': { value: 2, category: 'Engagement' },
            'case_study_view': { value: 3, category: 'Engagement' },
            
            // Business Goals
            'pricing_page_view': { value: 10, category: 'Sales Intent' },
            'services_detail_view': { value: 5, category: 'Sales Intent' }
        };
        
        this.init();
    }

    init() {
        if (!this.config.trackingEnabled) {
            this.log('Analytics tracking disabled');
            return;
        }

        this.loadGoogleAnalytics();
        this.setupConversionTracking();
        this.trackPageView();
        this.setupScrollTracking();
        this.setupFormTracking();
        this.setupClickTracking();
        
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

    trackEvent(eventName, properties = {}) {
        if (!this.config.trackingEnabled) return;

        const conversionGoal = this.conversionGoals[eventName];
        const eventData = {
            event_category: conversionGoal?.category || 'General',
            event_label: properties.label || '',
            value: conversionGoal?.value || 0,
            ...properties
        };

        // Send to Google Analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, eventData);
        }

        // Send to GTM if available
        if (typeof dataLayer !== 'undefined') {
            dataLayer.push({
                event: eventName,
                ...eventData
            });
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

        this.trackEvent('page_view', {
            page_title: page,
            page_location: window.location.href,
            page_path: url
        });

        // Send to GA4
        if (typeof gtag !== 'undefined') {
            gtag('config', this.config.gaId, {
                page_title: page,
                page_location: window.location.href,
                page_path: url
            });
        }
    }

    setupConversionTracking() {
        // Track lead magnet interactions
        document.addEventListener('click', (e) => {
            // Audit CTA clicks
            if (e.target.matches('.audit-cta') || e.target.closest('.audit-cta')) {
                this.trackEvent('ci_cd_audit_cta_click', {
                    label: 'Primary CTA',
                    location: this.getElementLocation(e.target)
                });
            }

            // Lead magnet button clicks
            if (e.target.matches('.lead-magnet-btn') || e.target.closest('.lead-magnet-btn')) {
                const btn = e.target.closest('.lead-magnet-btn') || e.target;
                const modalId = btn.getAttribute('data-modal');
                this.trackEvent('lead_magnet_click', {
                    label: modalId,
                    location: this.getElementLocation(btn)
                });
            }

            // Quick action card clicks
            if (e.target.matches('.quick-action-card') || e.target.closest('.quick-action-card')) {
                const card = e.target.closest('.quick-action-card') || e.target;
                const actionType = this.getActionType(card);
                this.trackEvent('quick_action_click', {
                    label: actionType,
                    location: 'contact_section'
                });
            }
        });

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

    // Utility methods
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

    // Public methods for manual tracking
    trackConversion(goalName, value = null, properties = {}) {
        this.trackEvent(goalName, {
            ...properties,
            value: value || this.conversionGoals[goalName]?.value || 0
        });
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