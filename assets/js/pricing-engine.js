/**
 * Advanced Pricing Engine with A/B Testing Framework
 * Handles dynamic pricing, A/B testing, and conversion optimization
 */

class PricingEngine {
    constructor() {
        this.config = {
            enableABTesting: true,
            enableDynamicPricing: true,
            enablePersonalization: true,
            testingFramework: 'multivariate',
            conversionTracking: true
        };
        
        // Current active experiments
        this.activeExperiments = new Map();
        
        // User segment data
        this.userSegments = {
            startup: {
                criteria: { companySize: '1-10', budget: 'low' },
                discountMultiplier: 0.8,
                emphasizeValue: true
            },
            scaleup: {
                criteria: { companySize: '11-50', budget: 'medium' },
                discountMultiplier: 0.9,
                emphasizeFeatures: true
            },
            enterprise: {
                criteria: { companySize: '50+', budget: 'high' },
                discountMultiplier: 1.1,
                emphasizeSecurity: true
            }
        };
        
        // Base pricing data
        this.basePricing = {
            devops_suite: {
                starter: { monthly: 0, annual: 0 },
                professional: { monthly: 49, annual: 39 },
                enterprise: { monthly: 199, annual: 159 }
            },
            health_monitor: {
                starter: { monthly: 0, annual: 0 },
                professional: { monthly: 29, annual: 22 },
                enterprise: { monthly: 99, annual: 74 }
            }
        };
        
        // A/B test variants
        this.pricingVariants = {
            'pricing_test_v1': {
                name: 'Standard Pricing',
                weight: 0.4,
                multipliers: { starter: 1.0, professional: 1.0, enterprise: 1.0 }
            },
            'pricing_test_v2': {
                name: 'Value Pricing',
                weight: 0.3,
                multipliers: { starter: 1.0, professional: 0.85, enterprise: 0.9 }
            },
            'pricing_test_v3': {
                name: 'Premium Positioning',
                weight: 0.3,
                multipliers: { starter: 1.0, professional: 1.15, enterprise: 1.1 }
            }
        };
        
        // Conversion tracking
        this.conversionEvents = [];
        this.currentVariant = null;
        this.userSegment = null;
        
        this.init();
    }
    
    init() {
        this.detectUserSegment();
        this.loadExperiments();
        this.assignVariant();
        this.setupConversionTracking();
        this.personalizeMessaging();
        
        console.log('Pricing Engine initialized', {
            variant: this.currentVariant,
            segment: this.userSegment
        });
    }
    
    detectUserSegment() {
        // Get data from lead scoring system
        const leadData = this.getLeadData();
        
        // Analyze traffic source and behavior
        const trafficSource = this.getTrafficSource();
        const behavior = this.getBehaviorSignals();
        
        // Segment logic
        if (leadData?.company && this.isStartupDomain(leadData.company)) {
            this.userSegment = 'startup';
        } else if (behavior.viewedEnterprise || leadData?.role?.includes('enterprise')) {
            this.userSegment = 'enterprise';
        } else if (behavior.timeSpent > 120 || behavior.pageViews > 3) {
            this.userSegment = 'scaleup';
        } else {
            this.userSegment = 'startup'; // default
        }
        
        // Track segmentation
        this.trackEvent('user_segmented', {
            segment: this.userSegment,
            confidence: this.getSegmentConfidence(),
            signals: { leadData, trafficSource, behavior }
        });
    }
    
    loadExperiments() {
        // Load active experiments from server or localStorage
        const storedExperiments = localStorage.getItem('pricing_experiments');
        if (storedExperiments) {
            try {
                const experiments = JSON.parse(storedExperiments);
                experiments.forEach(exp => {
                    this.activeExperiments.set(exp.id, exp);
                });
            } catch (error) {
                console.warn('Failed to load stored experiments');
            }
        }
        
        // Initialize default pricing experiment
        if (!this.activeExperiments.has('pricing_test_2024')) {
            this.activeExperiments.set('pricing_test_2024', {
                id: 'pricing_test_2024',
                name: 'Q1 2024 Pricing Test',
                status: 'active',
                startDate: Date.now(),
                endDate: Date.now() + (30 * 24 * 60 * 60 * 1000), // 30 days
                variants: this.pricingVariants,
                targetMetric: 'conversion_rate',
                trafficAllocation: 1.0
            });
        }
    }
    
    assignVariant() {
        const userId = this.getUserId();
        const experiment = this.activeExperiments.get('pricing_test_2024');
        
        if (!experiment || experiment.status !== 'active') {
            this.currentVariant = 'pricing_test_v1'; // default
            return;
        }
        
        // Consistent assignment based on user ID
        const hash = this.hashUserId(userId, experiment.id);
        const variants = Object.keys(experiment.variants);
        let cumulativeWeight = 0;
        
        for (const variant of variants) {
            cumulativeWeight += experiment.variants[variant].weight;
            if (hash < cumulativeWeight) {
                this.currentVariant = variant;
                break;
            }
        }
        
        // Store assignment for consistency
        localStorage.setItem('pricing_variant', JSON.stringify({
            variant: this.currentVariant,
            experimentId: experiment.id,
            assignedAt: Date.now()
        }));
        
        // Track assignment
        this.trackEvent('variant_assigned', {
            experimentId: experiment.id,
            variant: this.currentVariant,
            userId: userId,
            segment: this.userSegment
        });
    }
    
    calculatePricing(product, plan, period = 'monthly') {
        const basePrice = this.basePricing[product]?.[plan]?.[period] || 0;
        
        if (basePrice === 0) return 0; // Free plans stay free
        
        let finalPrice = basePrice;
        
        // Apply A/B test variant multiplier
        if (this.currentVariant && this.pricingVariants[this.currentVariant]) {
            const multiplier = this.pricingVariants[this.currentVariant].multipliers[plan] || 1.0;
            finalPrice = Math.round(basePrice * multiplier);
        }
        
        // Apply segment-based adjustments
        if (this.userSegment && this.userSegments[this.userSegment]) {
            const segmentMultiplier = this.userSegments[this.userSegment].discountMultiplier;
            finalPrice = Math.round(finalPrice * segmentMultiplier);
        }
        
        // Apply time-based promotions
        const promotion = this.getActivePromotion(product, plan);
        if (promotion) {
            finalPrice = Math.round(finalPrice * promotion.multiplier);
        }
        
        return Math.max(0, finalPrice);
    }
    
    updatePricingDisplay() {
        const pricingElements = document.querySelectorAll('[data-pricing]');
        
        pricingElements.forEach(element => {
            const product = element.dataset.product;
            const plan = element.dataset.plan;
            const period = element.dataset.period || 'monthly';
            
            if (product && plan) {
                const price = this.calculatePricing(product, plan, period);
                const displayPrice = price === 0 ? '$0' : `$${price}`;
                
                // Animate price change
                element.style.transition = 'all 0.3s ease';
                element.style.transform = 'scale(1.05)';
                
                setTimeout(() => {
                    element.textContent = displayPrice;
                    element.style.transform = 'scale(1)';
                    
                    // Add variant class for styling
                    element.classList.add(`variant-${this.currentVariant}`);
                    element.classList.add(`segment-${this.userSegment}`);
                }, 150);
                
                // Track pricing display
                this.trackEvent('pricing_displayed', {
                    product,
                    plan,
                    period,
                    basePrice: this.basePricing[product]?.[plan]?.[period],
                    finalPrice: price,
                    variant: this.currentVariant,
                    segment: this.userSegment
                });
            }
        });
    }
    
    personalizeMessaging() {
        const segment = this.userSegments[this.userSegment];
        if (!segment) return;
        
        // Update messaging based on segment
        if (segment.emphasizeValue) {
            this.updateMessaging('value-focused');
        } else if (segment.emphasizeFeatures) {
            this.updateMessaging('feature-focused');
        } else if (segment.emphasizeSecurity) {
            this.updateMessaging('security-focused');
        }
        
        // Show segment-specific badges/callouts
        this.showSegmentBadges();
    }
    
    updateMessaging(messageType) {
        const messages = {
            'value-focused': {
                heroSubtext: 'Start free, pay only as you grow. Perfect for bootstrapped startups.',
                ctaText: 'Start Free - No Credit Card',
                valueProps: ['Free tier available', 'No setup fees', 'Cancel anytime']
            },
            'feature-focused': {
                heroSubtext: 'Advanced features for growing teams. Scale with confidence.',
                ctaText: 'Start 14-Day Free Trial',
                valueProps: ['Full feature access', 'Priority support', 'Advanced integrations']
            },
            'security-focused': {
                heroSubtext: 'Enterprise-grade security and compliance for mission-critical applications.',
                ctaText: 'Request Enterprise Demo',
                valueProps: ['SOC2 compliant', 'GDPR ready', '99.9% SLA guarantee']
            }
        };
        
        const messaging = messages[messageType];
        if (!messaging) return;
        
        // Update hero messaging
        const heroSubtext = document.querySelector('.hero-description');
        if (heroSubtext && messaging.heroSubtext) {
            heroSubtext.textContent = messaging.heroSubtext;
        }
        
        // Update CTA buttons
        const ctaButtons = document.querySelectorAll('.btn-primary[data-track="cta_click"]');
        ctaButtons.forEach(btn => {
            if (messaging.ctaText) {
                btn.textContent = messaging.ctaText;
            }
        });
        
        // Update value propositions
        this.updateValuePropositions(messaging.valueProps);
    }
    
    updateValuePropositions(props) {
        const valueContainer = document.querySelector('.hero-trust, .value-props');
        if (!valueContainer || !props) return;
        
        const propElements = valueContainer.querySelectorAll('.trust-item, .value-prop-item');
        propElements.forEach((element, index) => {
            if (props[index]) {
                const textElement = element.querySelector('.trust-text, .prop-text');
                if (textElement) {
                    textElement.textContent = props[index];
                }
            }
        });
    }
    
    showSegmentBadges() {
        const badgeContainer = document.querySelector('.segment-badges');
        if (!badgeContainer) {
            // Create badge container if it doesn't exist
            const container = document.createElement('div');
            container.className = 'segment-badges';
            container.style.cssText = `
                position: fixed;
                top: 80px;
                right: 20px;
                z-index: 1000;
                display: flex;
                flex-direction: column;
                gap: 0.5rem;
            `;
            document.body.appendChild(container);
        }
        
        // Show segment-specific badges
        const badges = this.getSegmentBadges();
        badges.forEach(badge => {
            this.showBadge(badge);
        });
    }
    
    getSegmentBadges() {
        const badges = [];
        
        switch (this.userSegment) {
            case 'startup':
                badges.push({
                    text: '🚀 Startup Friendly',
                    color: '#10b981',
                    description: 'Special pricing for early-stage companies'
                });
                break;
            case 'enterprise':
                badges.push({
                    text: '🏢 Enterprise Grade',
                    color: '#6366f1',
                    description: 'Advanced security and compliance features'
                });
                break;
        }
        
        // Add variant-specific badges
        if (this.currentVariant === 'pricing_test_v2') {
            badges.push({
                text: '💰 Special Offer',
                color: '#f59e0b',
                description: 'Limited time pricing'
            });
        }
        
        return badges;
    }
    
    showBadge(badge) {
        const badgeElement = document.createElement('div');
        badgeElement.className = 'segment-badge';
        badgeElement.style.cssText = `
            background: ${badge.color};
            color: white;
            padding: 0.5rem 1rem;
            border-radius: 20px;
            font-size: 0.8rem;
            font-weight: 600;
            animation: slideInRight 0.5s ease;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        `;
        badgeElement.textContent = badge.text;
        badgeElement.title = badge.description;
        
        const container = document.querySelector('.segment-badges');
        if (container) {
            container.appendChild(badgeElement);
        }
        
        // Auto-remove after 10 seconds
        setTimeout(() => {
            badgeElement.remove();
        }, 10000);
    }
    
    setupConversionTracking() {
        // Track pricing page views
        this.trackEvent('pricing_page_view', {
            variant: this.currentVariant,
            segment: this.userSegment,
            page: window.location.pathname
        });
        
        // Track CTA clicks
        document.addEventListener('click', (e) => {
            const button = e.target.closest('[data-track="cta_click"], [data-plan]');
            if (button) {
                this.trackConversion('cta_click', {
                    plan: button.dataset.plan,
                    source: button.dataset.source,
                    text: button.textContent.trim(),
                    variant: this.currentVariant,
                    segment: this.userSegment
                });
            }
        });
        
        // Track form submissions
        document.addEventListener('submit', (e) => {
            if (e.target.matches('[data-pricing-form], .pricing-form')) {
                this.trackConversion('form_submission', {
                    form: e.target.id || e.target.className,
                    variant: this.currentVariant,
                    segment: this.userSegment
                });
            }
        });
        
        // Track scroll depth on pricing sections
        this.trackPricingScrollDepth();
    }
    
    trackPricingScrollDepth() {
        const pricingSection = document.querySelector('#pricing, .pricing-section');
        if (!pricingSection) return;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
                    this.trackEvent('pricing_section_view', {
                        variant: this.currentVariant,
                        segment: this.userSegment,
                        scrollDepth: Math.round(entry.intersectionRatio * 100)
                    });
                    observer.disconnect();
                }
            });
        }, { threshold: [0.5, 0.75, 1.0] });
        
        observer.observe(pricingSection);
    }
    
    trackConversion(eventType, data = {}) {
        const conversionEvent = {
            id: this.generateEventId(),
            type: eventType,
            timestamp: Date.now(),
            variant: this.currentVariant,
            segment: this.userSegment,
            data: data
        };
        
        this.conversionEvents.push(conversionEvent);
        
        // Store locally
        localStorage.setItem('pricing_conversions', JSON.stringify(this.conversionEvents));
        
        // Send to analytics
        this.trackEvent('conversion', conversionEvent);
        
        // Update lead scoring
        if (window.leadScoringSystem) {
            let scoreIncrease = 0;
            switch (eventType) {
                case 'cta_click': scoreIncrease = 15; break;
                case 'form_submission': scoreIncrease = 25; break;
                case 'plan_selection': scoreIncrease = 20; break;
            }
            
            if (scoreIncrease > 0) {
                window.leadScoringSystem.updateScore(scoreIncrease, `Pricing conversion: ${eventType}`);
            }
        }
    }
    
    getActivePromotion(product, plan) {
        const now = new Date();
        
        // Example time-based promotions
        const promotions = [
            {
                id: 'holiday_2024',
                startDate: new Date('2024-11-25'),
                endDate: new Date('2024-12-02'),
                multiplier: 0.7, // 30% off
                plans: ['professional', 'enterprise'],
                products: ['devops_suite', 'health_monitor']
            },
            {
                id: 'new_year_2024',
                startDate: new Date('2024-12-26'),
                endDate: new Date('2024-01-15'),
                multiplier: 0.8, // 20% off
                plans: ['professional'],
                products: ['devops_suite']
            }
        ];
        
        return promotions.find(promo => {
            return now >= promo.startDate && 
                   now <= promo.endDate &&
                   promo.plans.includes(plan) &&
                   promo.products.includes(product);
        });
    }
    
    // Utility methods
    getLeadData() {
        if (window.leadScoringSystem) {
            return window.leadScoringSystem.getLeadData();
        }
        return null;
    }
    
    getTrafficSource() {
        const urlParams = new URLSearchParams(window.location.search);
        const referrer = document.referrer;
        
        return {
            utm_source: urlParams.get('utm_source'),
            utm_medium: urlParams.get('utm_medium'),
            utm_campaign: urlParams.get('utm_campaign'),
            referrer: referrer
        };
    }
    
    getBehaviorSignals() {
        const signals = {
            timeSpent: 0,
            pageViews: 0,
            viewedEnterprise: false,
            viewedPricing: false
        };
        
        // Get from lead scoring system or session storage
        if (window.leadScoringSystem) {
            const leadData = window.leadScoringSystem.getLeadData();
            signals.timeSpent = Math.round(leadData.totalTimeSpent / 1000);
            signals.pageViews = leadData.totalPageViews;
            
            // Check behavior history
            signals.viewedEnterprise = leadData.behaviors.some(b => 
                b.page?.includes('enterprise') || b.data?.plan === 'enterprise'
            );
            signals.viewedPricing = leadData.behaviors.some(b => 
                b.page?.includes('pricing') || b.action === 'pricing_section_view'
            );
        }
        
        return signals;
    }
    
    isStartupDomain(domain) {
        const startupIndicators = ['.io', '.co', '.ai', '.ly'];
        return startupIndicators.some(indicator => domain.includes(indicator));
    }
    
    getSegmentConfidence() {
        // Calculate confidence based on available signals
        let confidence = 0.5; // base confidence
        
        const leadData = this.getLeadData();
        if (leadData?.company) confidence += 0.2;
        if (leadData?.role) confidence += 0.2;
        
        const behavior = this.getBehaviorSignals();
        if (behavior.timeSpent > 60) confidence += 0.1;
        if (behavior.pageViews > 2) confidence += 0.1;
        
        return Math.min(1.0, confidence);
    }
    
    getUserId() {
        let userId = localStorage.getItem('pricing_user_id');
        if (!userId) {
            userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('pricing_user_id', userId);
        }
        return userId;
    }
    
    hashUserId(userId, experimentId) {
        // Simple hash function for consistent assignment
        let hash = 0;
        const str = userId + experimentId;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return Math.abs(hash) / 2147483648; // Normalize to 0-1
    }
    
    generateEventId() {
        return 'event_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    trackEvent(eventName, properties = {}) {
        // Track with analytics systems
        if (window.analyticsManager) {
            window.analyticsManager.trackEvent(`pricing_${eventName}`, properties);
        }
        
        if (window.leadScoringSystem) {
            window.leadScoringSystem.trackBehavior(`pricing_${eventName}`, properties);
        }
        
        // Console log for development
        console.log(`Pricing Event: ${eventName}`, properties);
    }
    
    // Public API
    getCurrentVariant() {
        return this.currentVariant;
    }
    
    getUserSegment() {
        return this.userSegment;
    }
    
    getPricing(product, plan, period) {
        return this.calculatePricing(product, plan, period);
    }
    
    getExperimentData() {
        return {
            variant: this.currentVariant,
            segment: this.userSegment,
            activeExperiments: Array.from(this.activeExperiments.values()),
            conversionEvents: this.conversionEvents
        };
    }
    
    forceVariant(variantId) {
        // For testing purposes
        this.currentVariant = variantId;
        this.updatePricingDisplay();
        this.personalizeMessaging();
    }
    
    forceSegment(segmentId) {
        // For testing purposes
        this.userSegment = segmentId;
        this.updatePricingDisplay();
        this.personalizeMessaging();
    }
}

// A/B Test Manager for running experiments
class ABTestManager {
    constructor(pricingEngine) {
        this.pricingEngine = pricingEngine;
        this.experiments = new Map();
    }
    
    createExperiment(config) {
        const experiment = {
            id: config.id,
            name: config.name,
            status: 'draft',
            variants: config.variants,
            trafficAllocation: config.trafficAllocation || 1.0,
            targetMetric: config.targetMetric,
            startDate: null,
            endDate: null,
            results: {
                totalVisitors: 0,
                conversions: {},
                statisticalSignificance: false
            }
        };
        
        this.experiments.set(experiment.id, experiment);
        return experiment;
    }
    
    startExperiment(experimentId) {
        const experiment = this.experiments.get(experimentId);
        if (experiment) {
            experiment.status = 'active';
            experiment.startDate = Date.now();
            this.trackEvent('experiment_started', { experimentId, experiment });
        }
    }
    
    stopExperiment(experimentId) {
        const experiment = this.experiments.get(experimentId);
        if (experiment) {
            experiment.status = 'completed';
            experiment.endDate = Date.now();
            this.calculateResults(experiment);
            this.trackEvent('experiment_stopped', { experimentId, results: experiment.results });
        }
    }
    
    calculateResults(experiment) {
        // Calculate conversion rates for each variant
        const variants = Object.keys(experiment.variants);
        const results = {};
        
        variants.forEach(variant => {
            results[variant] = {
                visitors: 0,
                conversions: 0,
                conversionRate: 0
            };
        });
        
        // Analyze conversion data
        this.pricingEngine.conversionEvents.forEach(event => {
            if (event.variant && results[event.variant]) {
                results[event.variant].conversions++;
            }
        });
        
        // Calculate statistical significance (simplified)
        const controlVariant = variants[0];
        const testVariants = variants.slice(1);
        
        testVariants.forEach(variant => {
            const improvement = this.calculateImprovement(
                results[controlVariant].conversionRate,
                results[variant].conversionRate
            );
            results[variant].improvement = improvement;
            results[variant].significant = Math.abs(improvement) > 0.1; // 10% threshold
        });
        
        experiment.results = results;
        return results;
    }
    
    calculateImprovement(controlRate, testRate) {
        if (controlRate === 0) return 0;
        return (testRate - controlRate) / controlRate;
    }
    
    trackEvent(eventName, data) {
        if (window.analyticsManager) {
            window.analyticsManager.trackEvent(`ab_test_${eventName}`, data);
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    if (typeof window !== 'undefined') {
        window.pricingEngine = new PricingEngine();
        window.abTestManager = new ABTestManager(window.pricingEngine);
        
        // Update pricing displays after initialization
        setTimeout(() => {
            window.pricingEngine.updatePricingDisplay();
        }, 100);
    }
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { PricingEngine, ABTestManager };
}