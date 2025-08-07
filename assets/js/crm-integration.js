/**
 * CRM Integration System for Resiliotech
 * Handles lead capture, scoring, and management
 */

class CRMIntegration {
    constructor() {
        this.config = {
            apiEndpoint: '/api/crm', // Configure this for your CRM
            enableLeadScoring: true,
            enableAutomatedFollowup: true,
            debugMode: window.location.hostname === 'localhost'
        };
        
        this.leadSources = {
            'hero-cta': { weight: 10, source: 'Hero CTA' },
            'roi-calculator': { weight: 15, source: 'ROI Calculator' },
            'case-study': { weight: 12, source: 'Case Study' },
            'resource-download': { weight: 8, source: 'Resource Download' },
            'blog-signup': { weight: 6, source: 'Blog Signup' },
            'contact-form': { weight: 20, source: 'Contact Form' }
        };
        
        this.init();
    }
    
    init() {
        this.log('CRM Integration initializing...');
        
        // Track page views and user behavior
        this.trackPageView();
        this.setupBehaviorTracking();
        
        // Initialize form integrations
        this.setupFormIntegrations();
        this.setupLeadCapture();
        
        // Set up automated lead scoring
        this.initializeLeadScoring();
        
        this.log('CRM Integration initialized');
    }
    
    // Lead Capture and Management
    captureQualifiedLead(leadData, source = 'unknown') {
        const lead = this.enrichLeadData(leadData, source);
        const score = this.calculateLeadScore(lead);
        
        this.log('Capturing qualified lead:', { lead, score });
        
        // Store lead locally first
        this.storeLeadLocally(lead);
        
        // Send to CRM
        this.sendToCRM(lead)
            .then(response => {
                this.log('Lead sent to CRM successfully');
                this.triggerAutomatedSequence(lead);
            })
            .catch(error => {
                this.log('Error sending lead to CRM:', error);
                this.handleCRMError(lead, error);
            });
        
        // Track conversion event
        if (window.analyticsManager) {
            window.analyticsManager.trackConversion('qualified_lead', {
                source: source,
                score: score,
                lead_type: this.getLeadType(score)
            });
        }
        
        return lead;
    }
    
    enrichLeadData(leadData, source) {
        const sessionData = this.getSessionData();
        const behaviorData = this.getBehaviorData();
        
        return {
            ...leadData,
            source: source,
            sourceWeight: this.leadSources[source]?.weight || 5,
            timestamp: new Date().toISOString(),
            sessionId: sessionData.sessionId,
            pageViews: sessionData.pageViews,
            timeOnSite: sessionData.timeOnSite,
            referrer: document.referrer || 'direct',
            userAgent: navigator.userAgent,
            viewport: {
                width: window.innerWidth,
                height: window.innerHeight
            },
            behaviors: behaviorData,
            utm: this.getUTMParameters(),
            leadScore: 0 // Will be calculated
        };
    }
    
    calculateLeadScore(lead) {
        let score = 0;
        
        // Source weight
        score += lead.sourceWeight || 5;
        
        // Engagement scoring
        if (lead.timeOnSite > 120000) score += 10; // 2+ minutes
        if (lead.pageViews > 3) score += 8;
        if (lead.behaviors.downloads > 0) score += 12;
        if (lead.behaviors.calculatorUsed) score += 15;
        if (lead.behaviors.caseStudyViewed) score += 10;
        
        // Company information scoring
        if (lead.company && lead.company.length > 2) score += 8;
        if (lead.jobTitle) {
            const seniorTitles = ['cto', 'ceo', 'founder', 'vp', 'director', 'head'];
            if (seniorTitles.some(title => 
                lead.jobTitle.toLowerCase().includes(title))) {
                score += 15;
            }
        }
        
        // Company size scoring (from ROI calculator data)
        if (lead.teamSize) {
            if (lead.teamSize === '10-50') score += 10;
            else if (lead.teamSize === '5-10') score += 8;
            else if (lead.teamSize === '50+') score += 12;
        }
        
        // Urgency indicators
        if (lead.timeline && lead.timeline.includes('immediate')) score += 20;
        if (lead.budget && lead.budget !== 'under-5k') score += 10;
        
        lead.leadScore = Math.min(score, 100); // Cap at 100
        return lead.leadScore;
    }
    
    getLeadType(score) {
        if (score >= 70) return 'hot';
        if (score >= 40) return 'warm';
        return 'cold';
    }
    
    // Session and Behavior Tracking
    getSessionData() {
        let sessionData = sessionStorage.getItem('resiliotech_session');
        
        if (!sessionData) {
            sessionData = {
                sessionId: this.generateSessionId(),
                startTime: Date.now(),
                pageViews: 0
            };
        } else {
            sessionData = JSON.parse(sessionData);
        }
        
        sessionData.pageViews += 1;
        sessionData.timeOnSite = Date.now() - sessionData.startTime;
        
        sessionStorage.setItem('resiliotech_session', JSON.stringify(sessionData));
        return sessionData;
    }
    
    getBehaviorData() {
        let behaviors = localStorage.getItem('resiliotech_behaviors');
        
        if (!behaviors) {
            behaviors = {
                downloads: 0,
                calculatorUsed: false,
                caseStudyViewed: false,
                resourcesAccessed: 0,
                blogPostsRead: 0,
                videoWatched: false
            };
        } else {
            behaviors = JSON.parse(behaviors);
        }
        
        return behaviors;
    }
    
    updateBehaviorData(behavior, value = true) {
        let behaviors = this.getBehaviorData();
        
        if (typeof behavior === 'object') {
            behaviors = { ...behaviors, ...behavior };
        } else {
            behaviors[behavior] = value;
        }
        
        localStorage.setItem('resiliotech_behaviors', JSON.stringify(behaviors));
        this.log('Behavior updated:', behavior, value);
    }
    
    // Form Integration
    setupFormIntegrations() {
        // Contact forms
        document.querySelectorAll('form[data-form-type="contact"]').forEach(form => {
            form.addEventListener('submit', (e) => this.handleContactFormSubmission(e));
        });
        
        // Newsletter signups
        document.querySelectorAll('form[data-form-type="newsletter"]').forEach(form => {
            form.addEventListener('submit', (e) => this.handleNewsletterSubmission(e));
        });
        
        // Resource downloads
        document.querySelectorAll('[data-resource-download]').forEach(button => {
            button.addEventListener('click', (e) => this.handleResourceDownload(e));
        });
    }
    
    setupLeadCapture() {
                // Only setup exit intent capture (removed aggressive scroll and time-based modals)
        this.setupExitIntentCapture();
    }
    
    async handleContactFormSubmission(event) {
        event.preventDefault();
        const form = event.target;
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        
        try {
            submitButton.textContent = 'Verifying...';
            submitButton.disabled = true;

            // Execute reCAPTCHA v3 challenge
            const recaptchaToken = await this.executeRecaptcha('contact_form');
            
            const formData = new FormData(form);
            
            const leadData = {
                email: formData.get('email'),
                name: formData.get('name'),
                company: formData.get('company'),
                jobTitle: formData.get('jobTitle'),
                phone: formData.get('phone'),
                message: formData.get('message'),
                budget: formData.get('budget'),
                timeline: formData.get('timeline'),
                teamSize: formData.get('teamSize'),
                recaptcha_token: recaptchaToken
            };
            
            submitButton.textContent = 'Submitting...';
            
            this.captureQualifiedLead(leadData, 'contact-form');
            
            // Show success message
            this.showFormSuccessMessage(form, 'Thank you! We\'ll be in touch within 24 hours.');
        } catch (error) {
            console.error('Contact form submission error:', error);
            this.showFormErrorMessage(form, 'Submission failed. Please try again.');
        } finally {
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }
    }
    
    async handleNewsletterSubmission(event) {
        event.preventDefault();
        const form = event.target;
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        
        try {
            submitButton.textContent = 'Verifying...';
            submitButton.disabled = true;

            // Execute reCAPTCHA v3 challenge
            const recaptchaToken = await this.executeRecaptcha('newsletter_signup');
            
            const formData = new FormData(form);
            
            const leadData = {
                email: formData.get('email'),
                name: formData.get('name'),
                recaptcha_token: recaptchaToken
            };
            
            submitButton.textContent = 'Subscribing...';
            
            this.captureQualifiedLead(leadData, 'blog-signup');
            
            this.showFormSuccessMessage(form, 'Thanks for subscribing! Check your email for our latest insights.');
        } catch (error) {
            console.error('Newsletter subscription error:', error);
            this.showFormErrorMessage(form, 'Subscription failed. Please try again.');
        } finally {
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }
    }
    
    handleResourceDownload(event) {
        const button = event.target;
        const resourceId = button.dataset.resourceId || 'unknown';
        
        // Update behavior tracking
        this.updateBehaviorData({ downloads: this.getBehaviorData().downloads + 1 });
        
        // For downloads, we might want to collect email first
        this.showResourceDownloadModal(resourceId);
    }
    
    // Lead Capture Strategies
    setupExitIntentCapture() {
        let exitIntentShown = false;
        let hasSeenPrimaryOffer = false;
        
        // Track if user has seen the main lead magnet
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && entry.target.id === 'lead-magnet') {
                    hasSeenPrimaryOffer = true;
                }
            });
        }, { threshold: 0.5 });
        
        const leadMagnetSection = document.getElementById('lead-magnet');
        if (leadMagnetSection) {
            observer.observe(leadMagnetSection);
        }
        
        document.addEventListener('mouseleave', (e) => {
            if (e.clientY <= 0 && !exitIntentShown && this.shouldShowExitIntent() && hasSeenPrimaryOffer) {
                exitIntentShown = true;
                this.showExitIntentModal();
            }
        });
    }
    
    shouldShowScrollCapture() {
        // Disabled - scroll-based modals removed to prevent modal fatigue
        return false;
    }
    
    shouldShowTimeBasedCapture() {
        // Disabled - time-based modals removed to prevent modal fatigue  
        return false;
    }
    
    shouldShowExitIntent() {
        const behaviors = this.getBehaviorData();
        const sessionData = this.getSessionData();
        
        // Only show exit intent if user has spent meaningful time and hasn't converted
        return sessionData.timeOnSite > 60000 && // 60+ seconds on site (was 30)
               sessionData.pageViews >= 1 && // Viewed at least 1 page (was 2)
               !behaviors.emailCaptured && // Haven't captured email yet
               !sessionData.modalDismissed; // Haven't already dismissed a modal
    }
    
    shouldShowScrollCapture() {
        const behaviors = this.getBehaviorData();
        return !behaviors.calculatorUsed && !behaviors.downloads;
    }
    
    shouldShowTimeBasedCapture() {
        const behaviors = this.getBehaviorData();
        return Object.values(behaviors).every(value => 
            value === false || value === 0
        );
    }
    
    // Modal Creation
    showExitIntentModal() {
        const modal = this.createLeadCaptureModal({
            title: 'Still Evaluating Your DevOps Options?',
            description: 'Get our free CI/CD health audit before you go. It only takes 2 minutes and provides actionable insights in 48 hours.',
            offer: 'Free CI/CD Health Audit (No spam, actionable insights only)',
            cta: 'Get Free Audit',
            source: 'exit-intent'
        });
        
        document.body.appendChild(modal);
        setTimeout(() => modal.classList.add('active'), 10);
    }
    
    showScrollBasedModal() {
        const modal = this.createLeadCaptureModal({
            title: 'Enjoying Our Content?',
            description: 'Get our latest automation insights delivered to your inbox every week.',
            offer: 'Weekly automation tips + exclusive templates',
            cta: 'Subscribe Now',
            source: 'scroll-capture'
        });
        
        document.body.appendChild(modal);
        setTimeout(() => modal.classList.add('active'), 10);
    }
    
    showTimeBasedModal() {
        const modal = this.createLeadCaptureModal({
            title: 'Ready to Automate Your Startup?',
            description: 'Book a free 30-minute consultation to discuss your automation needs.',
            offer: 'Free automation assessment + custom roadmap',
            cta: 'Book Free Call',
            source: 'time-based'
        });
        
        document.body.appendChild(modal);
        setTimeout(() => modal.classList.add('active'), 10);
    }
    
    showResourceDownloadModal(resourceId) {
        const resource = window.resourcesLibrary?.getById(resourceId);
        const title = resource ? resource.title : 'Resource Download';
        
        const modal = this.createLeadCaptureModal({
            title: `Download: ${title}`,
            description: 'Enter your email to get instant access to this resource.',
            offer: 'Instant download + bonus automation checklist',
            cta: 'Get Resource',
            source: 'resource-download',
            resourceId: resourceId
        });
        
        document.body.appendChild(modal);
        setTimeout(() => modal.classList.add('active'), 10);
    }
    
    createLeadCaptureModal(config) {
        const modal = document.createElement('div');
        modal.className = 'lead-capture-modal';
        modal.innerHTML = `
            <div class="modal-overlay" onclick="this.parentElement.remove()"></div>
            <div class="modal-content">
                <button class="modal-close" onclick="this.closest('.lead-capture-modal').remove()">&times;</button>
                
                <div class="modal-header">
                    <h3>${config.title}</h3>
                    <p>${config.description}</p>
                    <div class="offer-highlight">🎁 ${config.offer}</div>
                </div>
                
                <form class="lead-capture-form" data-source="${config.source}">
                    <div class="form-group">
                        <input type="email" name="email" required placeholder="Your work email address" aria-label="Email address">
                    </div>
                    <div class="form-group">
                        <input type="text" name="name" placeholder="Your full name (optional)" aria-label="Full name">
                    </div>
                    <div class="form-group">
                        <input type="text" name="company" placeholder="Company name (optional)" aria-label="Company name">
                    </div>
                    
                    <button type="submit" class="btn btn-primary">
                        <span class="btn-text">${config.cta}</span>
                        <span class="btn-loading" style="display: none;">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M21 12a9 9 0 11-6.219-8.56"/>
                            </svg>
                            Processing...
                        </span>
                    </button>
                    
                    <div class="privacy-notice">
                        🔒 We respect your privacy. Unsubscribe at any time.
                    </div>
                </form>
            </div>
        `;
        
        // Add form handler
        const form = modal.querySelector('.lead-capture-form');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLeadCaptureSubmission(form, config);
        });
        
        return modal;
    }
    
    handleLeadCaptureSubmission(form, config) {
        const formData = new FormData(form);
        const submitBtn = form.querySelector('button[type="submit"]');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoading = submitBtn.querySelector('.btn-loading');
        
        // Show loading state
        submitBtn.disabled = true;
        btnText.style.display = 'none';
        btnLoading.style.display = 'flex';
        
        const leadData = {
            email: formData.get('email'),
            name: formData.get('name'),
            company: formData.get('company'),
            captureType: config.source,
            resourceId: config.resourceId
        };
        
        // Simulate form processing
        setTimeout(() => {
            this.captureQualifiedLead(leadData, config.source);
            
            // Close modal and show success
            const modal = form.closest('.lead-capture-modal');
            modal.querySelector('.modal-content').innerHTML = `
                <div class="success-message">
                    <div class="success-icon">🎉</div>
                    <h3>Success!</h3>
                    <p>Check your email for your free resources. We'll be in touch soon!</p>
                    <div class="success-features">
                        <div class="feature-item">📧 Resource sent to your inbox</div>
                        <div class="feature-item">⚡ Quick response within 24 hours</div>
                        <div class="feature-item">🎯 Personalized automation insights</div>
                    </div>
                    <button onclick="this.closest('.lead-capture-modal').remove()" class="btn btn-secondary">
                        Perfect, Thanks!
                    </button>
                </div>
            `;
            
            // Auto-close after 5 seconds
            setTimeout(() => modal.remove(), 5000);
        }, 1500); // Simulated processing time
    }
    
    // CRM Communication
    async sendToCRM(leadData) {
        // This would integrate with your actual CRM
        // Examples: HubSpot, Salesforce, Pipedrive, etc.
        
        try {
            const response = await fetch(this.config.apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...leadData,
                    timestamp: new Date().toISOString(),
                    source: 'website'
                })
            });
            
            if (!response.ok) {
                throw new Error(`CRM API error: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            // Fallback to localStorage if CRM is unavailable
            this.log('CRM unavailable, storing locally:', error);
            throw error;
        }
    }
    
    storeLeadLocally(leadData) {
        let leads = JSON.parse(localStorage.getItem('resiliotech_leads') || '[]');
        leads.push({
            ...leadData,
            id: this.generateLeadId(),
            stored_at: new Date().toISOString()
        });
        
        // Keep only last 50 leads locally
        if (leads.length > 50) {
            leads = leads.slice(-50);
        }
        
        localStorage.setItem('resiliotech_leads', JSON.stringify(leads));
    }
    
    handleCRMError(leadData, error) {
        // Store in localStorage as backup
        this.storeLeadLocally({
            ...leadData,
            error: error.message,
            needs_sync: true
        });
        
        // Retry logic could be added here
        this.log('Lead stored locally due to CRM error');
    }
    
    // Automated Follow-up Sequences
    triggerAutomatedSequence(lead) {
        if (!this.config.enableAutomatedFollowup) return;
        
        const leadType = this.getLeadType(lead.leadScore);
        const sequence = this.getSequenceForLeadType(leadType, lead.source);
        
        this.log('Triggering automated sequence:', { leadType, sequence });
        
        // This would typically trigger email sequences in your marketing automation tool
        this.scheduleFollowupSequence(lead, sequence);
    }
    
    getSequenceForLeadType(leadType, source) {
        const sequences = {
            'hot': {
                immediate: 'personal_outreach',
                day_1: 'case_study_relevant',
                day_3: 'calendar_booking',
                day_7: 'roi_calculator_followup'
            },
            'warm': {
                immediate: 'welcome_automation_guide',
                day_2: 'educational_content',
                day_7: 'success_stories',
                day_14: 'free_consultation_offer'
            },
            'cold': {
                immediate: 'nurture_sequence_start',
                day_3: 'educational_blog_series',
                day_10: 'automation_checklist',
                day_21: 're_engagement_offer'
            }
        };
        
        return sequences[leadType] || sequences['cold'];
    }
    
    scheduleFollowupSequence(lead, sequence) {
        // This would integrate with email marketing platforms like:
        // Mailchimp, ConvertKit, ActiveCampaign, etc.
        
        Object.entries(sequence).forEach(([timing, action]) => {
            this.log(`Scheduled ${action} for ${timing}`, lead);
        });
    }
    
    // Utility Methods
    getUTMParameters() {
        const urlParams = new URLSearchParams(window.location.search);
        return {
            utm_source: urlParams.get('utm_source'),
            utm_medium: urlParams.get('utm_medium'),
            utm_campaign: urlParams.get('utm_campaign'),
            utm_content: urlParams.get('utm_content'),
            utm_term: urlParams.get('utm_term')
        };
    }
    
    generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    generateLeadId() {
        return 'lead_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    showFormSuccessMessage(form, message) {
        const successDiv = document.createElement('div');
        successDiv.className = 'form-success-message';
        successDiv.innerHTML = `
            <div class="success-content">
                <div class="success-icon">✓</div>
                <p>${message}</p>
            </div>
        `;
        
        form.style.display = 'none';
        form.parentNode.insertBefore(successDiv, form.nextSibling);
        
        // Optionally hide after some time
        setTimeout(() => {
            successDiv.style.opacity = '0.5';
        }, 5000);
    }
    
    // Behavior Tracking Setup
    setupBehaviorTracking() {
        // Track ROI calculator usage
        if (window.interactiveDemos) {
            const originalCalculateROI = window.interactiveDemos.calculateROI;
            if (originalCalculateROI) {
                window.interactiveDemos.calculateROI = (...args) => {
                    this.updateBehaviorData('calculatorUsed', true);
                    return originalCalculateROI.apply(window.interactiveDemos, args);
                };
            }
        }
        
        // Track resource downloads
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-track="resource-download"]')) {
                this.updateBehaviorData({ resourcesAccessed: this.getBehaviorData().resourcesAccessed + 1 });
            }
        });
        
        // Track case study views
        document.addEventListener('click', (e) => {
            if (e.target.matches('[onclick*="openCaseStudyModal"]')) {
                this.updateBehaviorData('caseStudyViewed', true);
            }
        });
    }
    
    trackPageView() {
        const sessionData = this.getSessionData();
        
        if (window.analyticsManager) {
            window.analyticsManager.trackEvent('page_view', {
                page: window.location.pathname,
                session_id: sessionData.sessionId,
                time_on_site: sessionData.timeOnSite,
                page_views: sessionData.pageViews
            });
        }
    }
    
    /**
     * Execute reCAPTCHA v3 challenge for form security
     * @param {string} action - The action name for reCAPTCHA scoring
     * @returns {Promise<string>} - reCAPTCHA token
     */
    async executeRecaptcha(action = 'submit') {
        return new Promise((resolve, reject) => {
            if (typeof grecaptcha === 'undefined') {
                console.warn('reCAPTCHA not loaded, proceeding without verification');
                resolve(null);
                return;
            }

            grecaptcha.ready(() => {
                grecaptcha.execute('6Lc8k2oqAAAAAF9QKbYgHmrJ2k5vQ0zEWlYRfK7k', { action })
                    .then((token) => {
                        this.log('reCAPTCHA token generated for action:', action);
                        resolve(token);
                    })
                    .catch((error) => {
                        console.error('reCAPTCHA execution failed:', error);
                        reject(error);
                    });
            });
        });
    }

    /**
     * Show form error message
     * @param {HTMLElement} form - The form element
     * @param {string} message - Error message to display
     */
    showFormErrorMessage(form, message) {
        this.removeExistingMessages(form);
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'form-message form-error';
        errorDiv.textContent = message;
        errorDiv.style.cssText = `
            padding: 12px 16px;
            margin-top: 12px;
            border-radius: 6px;
            font-size: 14px;
            font-weight: 500;
            background-color: #f8d7da;
            color: #721c24;
            border: 1px solid #f1aeb5;
        `;
        
        form.appendChild(errorDiv);
        
        // Auto-remove after 8 seconds
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.remove();
            }
        }, 8000);
    }

    /**
     * Remove existing form messages
     * @param {HTMLElement} form - The form element
     */
    removeExistingMessages(form) {
        const existingMessages = form.querySelectorAll('.form-message');
        existingMessages.forEach(msg => msg.remove());
    }
    
    log(...args) {
        if (this.config.debugMode) {
            console.log('[CRM Integration]', ...args);
        }
    }
}

// Initialize CRM integration when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.crmIntegration = new CRMIntegration();
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CRMIntegration;
}