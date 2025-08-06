/**
 * Enhanced Forms Manager for Resiliotech
 * Integrates with newsletter manager and provides advanced form functionality
 */

class EnhancedFormManager {
    constructor() {
        this.config = {
            netlifyEnabled: true,
            enableGDPR: true,
            enableAnalytics: true,
            enableProgressiveProfiling: true,
            leadScoringEnabled: true
        };
        
        this.forms = new Map();
        this.userProfile = this.loadUserProfile();
        
        this.init();
    }
    
    /**
     * Initialize the form manager
     */
    init() {
        this.bindForms();
        this.setupValidation();
        this.initializeProgressiveProfiling();
        this.loadLeadMagnets();
        this.trackFormEvents();
        this.integrateWithNewsletter();
    }
    
    /**
     * Integrate with newsletter manager
     */
    integrateWithNewsletter() {
        // Wait for newsletter manager to be available
        if (window.newsletterManager) {
            this.newsletterManager = window.newsletterManager;
        } else {
            document.addEventListener('DOMContentLoaded', () => {
                if (window.newsletterManager) {
                    this.newsletterManager = window.newsletterManager;
                }
            });
        }
    }
    
    /**
     * Bind all enhanced forms
     */
    bindForms() {
        const forms = document.querySelectorAll('[data-form-type]');
        
        forms.forEach(form => {
            const formType = form.dataset.formType;
            
            // Skip newsletter forms (handled by newsletter manager)
            if (formType === 'newsletter') {
                return;
            }
            
            this.setupEnhancedForm(form);
        });
    }
    
    /**
     * Setup individual enhanced form
     */
    setupEnhancedForm(form) {
        const formId = form.id || `form-${Date.now()}`;
        const formType = form.dataset.formType || 'contact';
        const source = form.dataset.source || 'unknown';
        
        // Store form configuration
        this.forms.set(formId, {
            element: form,
            type: formType,
            source: source,
            submitted: false,
            leadScore: 0
        });
        
        // Bind submit handler
        form.addEventListener('submit', (e) => this.handleFormSubmit(e, formId));
        
        // Setup progressive profiling
        if (this.config.enableProgressiveProfiling) {
            this.setupProgressiveProfiling(form);
        }
        
        // Setup lead scoring
        if (this.config.leadScoringEnabled) {
            this.setupLeadScoring(form);
        }
        
        console.log(`Enhanced form initialized: ${formId} (type: ${formType})`);
    }
    
    /**
     * Handle form submission
     */
    async handleFormSubmit(event, formId) {
        event.preventDefault();
        
        const formConfig = this.forms.get(formId);
        if (!formConfig || formConfig.submitted) return;
        
        const form = formConfig.element;
        const formData = new FormData(form);
        
        // Validate form
        if (!this.validateEnhancedForm(form)) {
            return;
        }
        
        // Show loading state
        this.setLoadingState(form, true);
        
        try {
            // Process submission based on form type
            const result = await this.processFormSubmission({
                formId: formId,
                type: formConfig.type,
                source: formConfig.source,
                data: Object.fromEntries(formData),
                leadScore: formConfig.leadScore
            });
            
            if (result.success) {
                this.handleFormSuccess(form, result);
                formConfig.submitted = true;
                
                // Update user profile
                this.updateUserProfile(formData);
                
            } else {
                this.handleFormError(form, result.error);
            }
            
        } catch (error) {
            console.error('Enhanced form error:', error);
            this.handleFormError(form, error.message);
        } finally {
            this.setLoadingState(form, false);
        }
    }
    
    /**
     * Process form submission based on type
     */
    async processFormSubmission(submission) {
        const { type, data, formId, source, leadScore } = submission;
        
        // Track submission attempt
        this.trackEvent('form_submission_attempt', {
            formType: type,
            source: source,
            leadScore: leadScore
        });
        
        try {
            switch (type) {
                case 'contact':
                    return await this.submitContactForm(data);
                case 'waitlist':
                    return await this.submitWaitlistForm(data);
                case 'lead-capture':
                    return await this.submitLeadCaptureForm(data);
                case 'multi-step':
                    return await this.submitMultiStepForm(data);
                default:
                    return await this.submitGenericForm(data, type);
            }
        } catch (error) {
            console.error('Form submission processing error:', error);
            return { 
                success: false, 
                error: 'Unable to submit form. Please try again.' 
            };
        }
    }
    
    /**
     * Submit contact form
     */
    async submitContactForm(data) {
        try {
            const formData = new FormData();
            formData.append('form-name', 'contact');
            
            Object.entries(data).forEach(([key, value]) => {
                formData.append(key, value);
            });
            
            formData.append('timestamp', new Date().toISOString());
            formData.append('userAgent', navigator.userAgent);
            formData.append('referrer', document.referrer);
            
            const response = await fetch('/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams(formData).toString()
            });
            
            if (response.ok) {
                return {
                    success: true,
                    message: 'Thank you for your message! We\'ll get back to you within 24 hours.'
                };
            } else {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
        } catch (error) {
            console.error('Contact form submission error:', error);
            return { success: false, error: error.message };
        }
    }
    
    /**
     * Submit waitlist form
     */
    async submitWaitlistForm(data) {
        try {
            const formData = new FormData();
            formData.append('form-name', 'waitlist');
            
            Object.entries(data).forEach(([key, value]) => {
                formData.append(key, value);
            });
            
            formData.append('timestamp', new Date().toISOString());
            formData.append('priority', this.calculateWaitlistPriority(data));
            
            const response = await fetch('/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams(formData).toString()
            });
            
            if (response.ok) {
                // Also add to newsletter if email provided
                if (data.email && this.newsletterManager) {
                    await this.newsletterManager.processSignup({
                        email: data.email,
                        interests: ['saas-tools'],
                        source: 'waitlist',
                        leadMagnet: data.leadMagnet
                    });
                }
                
                return {
                    success: true,
                    message: 'You\'re on the waitlist! We\'ll notify you when early access is available.'
                };
            } else {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
        } catch (error) {
            console.error('Waitlist form submission error:', error);
            return { success: false, error: error.message };
        }
    }
    
    /**
     * Submit lead capture form
     */
    async submitLeadCaptureForm(data) {
        try {
            const formData = new FormData();
            formData.append('form-name', 'lead-capture');
            
            Object.entries(data).forEach(([key, value]) => {
                formData.append(key, value);
            });
            
            formData.append('timestamp', new Date().toISOString());
            formData.append('leadScore', this.calculateLeadScore(data));
            
            const response = await fetch('/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams(formData).toString()
            });
            
            if (response.ok) {
                return {
                    success: true,
                    message: 'Thank you! Check your email for the download link.',
                    downloadUrl: data.downloadUrl
                };
            } else {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
        } catch (error) {
            console.error('Lead capture form submission error:', error);
            return { success: false, error: error.message };
        }
    }
    
    /**
     * Submit multi-step form
     */
    async submitMultiStepForm(data) {
        try {
            const formData = new FormData();
            formData.append('form-name', 'multi-step');
            
            Object.entries(data).forEach(([key, value]) => {
                if (Array.isArray(value)) {
                    formData.append(key, value.join(','));
                } else {
                    formData.append(key, value);
                }
            });
            
            formData.append('timestamp', new Date().toISOString());
            formData.append('leadScore', this.calculateLeadScore(data));
            formData.append('completionRate', '100');
            
            const response = await fetch('/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams(formData).toString()
            });
            
            if (response.ok) {
                return {
                    success: true,
                    message: 'Thank you! We\'ll prepare your custom ROI report and send it to you soon.'
                };
            } else {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
        } catch (error) {
            console.error('Multi-step form submission error:', error);
            return { success: false, error: error.message };
        }
    }
    
    /**
     * Submit generic form
     */
    async submitGenericForm(data, formType) {
        try {
            const formData = new FormData();
            formData.append('form-name', formType);
            
            Object.entries(data).forEach(([key, value]) => {
                formData.append(key, value);
            });
            
            formData.append('timestamp', new Date().toISOString());
            
            const response = await fetch('/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams(formData).toString()
            });
            
            if (response.ok) {
                return {
                    success: true,
                    message: 'Thank you for your submission!'
                };
            } else {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
        } catch (error) {
            console.error('Generic form submission error:', error);
            return { success: false, error: error.message };
        }
    }
    
    /**
     * Setup progressive profiling
     */
    setupProgressiveProfiling(form) {
        // Hide fields that user has already provided
        const userProfile = this.userProfile;
        
        if (userProfile.email) {
            const emailField = form.querySelector('input[name="email"]');
            if (emailField && emailField.value === '') {
                emailField.value = userProfile.email;
            }
        }
        
        if (userProfile.company) {
            const companyField = form.querySelector('input[name="company"]');
            if (companyField && companyField.value === '') {
                companyField.value = userProfile.company;
            }
        }
        
        // Add progressive fields based on user engagement
        if (userProfile.engagementScore > 50) {
            this.addProgressiveFields(form);
        }
    }
    
    /**
     * Add progressive fields to form
     */
    addProgressiveFields(form) {
        const progressiveFields = [
            {
                name: 'role',
                label: 'Your Role',
                type: 'select',
                options: ['Founder/CEO', 'CTO', 'Engineering Manager', 'Lead Developer', 'DevOps Engineer', 'Other']
            },
            {
                name: 'teamSize',
                label: 'Team Size',
                type: 'select',
                options: ['1-5 people', '6-15 people', '16-50 people', '50+ people']
            }
        ];
        
        progressiveFields.forEach(field => {
            if (!form.querySelector(`[name="${field.name}"]`)) {
                const fieldHtml = this.createFieldHtml(field);
                const submitButton = form.querySelector('button[type="submit"]');
                if (submitButton) {
                    submitButton.parentNode.insertBefore(fieldHtml, submitButton);
                }
            }
        });
    }
    
    /**
     * Create field HTML element
     */
    createFieldHtml(field) {
        const container = document.createElement('div');
        container.className = 'form-group progressive-field';
        
        const label = document.createElement('label');
        label.textContent = field.label;
        label.setAttribute('for', field.name);
        
        let input;
        if (field.type === 'select') {
            input = document.createElement('select');
            input.name = field.name;
            input.id = field.name;
            
            const defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.textContent = `Select ${field.label.toLowerCase()}`;
            input.appendChild(defaultOption);
            
            field.options.forEach(optionText => {
                const option = document.createElement('option');
                option.value = optionText;
                option.textContent = optionText;
                input.appendChild(option);
            });
        } else {
            input = document.createElement('input');
            input.type = field.type;
            input.name = field.name;
            input.id = field.name;
        }
        
        container.appendChild(label);
        container.appendChild(input);
        
        return container;
    }
    
    /**
     * Setup lead scoring
     */
    setupLeadScoring(form) {
        const formConfig = this.getFormConfig(form);
        if (!formConfig) return;
        
        // Track field interactions for scoring
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('change', () => {
                formConfig.leadScore += this.calculateFieldScore(input);
                this.forms.set(formConfig.element.id, formConfig);
            });
        });
    }
    
    /**
     * Calculate field score for lead scoring
     */
    calculateFieldScore(input) {
        const fieldScores = {
            'email': 10,
            'company': 15,
            'role': 20,
            'teamSize': 15,
            'budget': 25,
            'timeline': 20,
            'phone': 10,
            'website': 5
        };
        
        return fieldScores[input.name] || 5;
    }
    
    /**
     * Calculate lead score from form data
     */
    calculateLeadScore(data) {
        let score = 0;
        
        // Company email domain scoring
        if (data.email && !this.isPersonalEmail(data.email)) {
            score += 20;
        }
        
        // Role scoring
        const highValueRoles = ['founder', 'ceo', 'cto', 'vp'];
        if (data.role && highValueRoles.some(role => 
            data.role.toLowerCase().includes(role))) {
            score += 25;
        }
        
        // Company size scoring
        if (data.teamSize) {
            const sizeScores = {
                '1-5': 15,
                '6-15': 20,
                '16-50': 25,
                '50+': 30
            };
            score += sizeScores[data.teamSize] || 0;
        }
        
        // Engagement scoring
        if (data.priorities && Array.isArray(data.priorities)) {
            score += data.priorities.length * 5;
        }
        
        // Timeline urgency scoring
        if (data.timeline === 'immediate') score += 30;
        else if (data.timeline === 'quarter') score += 20;
        else if (data.timeline === '6-months') score += 10;
        
        return Math.min(score, 100); // Cap at 100
    }
    
    /**
     * Calculate waitlist priority
     */
    calculateWaitlistPriority(data) {
        const leadScore = this.calculateLeadScore(data);
        
        if (leadScore >= 80) return 'high';
        if (leadScore >= 50) return 'medium';
        return 'low';
    }
    
    /**
     * Check if email is personal (vs business)
     */
    isPersonalEmail(email) {
        const personalDomains = [
            'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com',
            'icloud.com', 'aol.com', 'mail.com', 'protonmail.com'
        ];
        
        const domain = email.split('@')[1]?.toLowerCase();
        return personalDomains.includes(domain);
    }
    
    /**
     * Validate enhanced form
     */
    validateEnhancedForm(form) {
        let isValid = true;
        const requiredFields = form.querySelectorAll('[required]');
        
        requiredFields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });
        
        return isValid;
    }
    
    /**
     * Validate individual field
     */
    validateField(field) {
        const value = field.value.trim();
        const fieldType = field.type;
        const fieldName = field.name;
        
        // Required field check
        if (!value) {
            this.showFieldError(field, 'This field is required');
            return false;
        }
        
        // Email validation
        if (fieldType === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                this.showFieldError(field, 'Please enter a valid email address');
                return false;
            }
        }
        
        // Phone validation
        if (fieldName === 'phone') {
            const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
            if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
                this.showFieldError(field, 'Please enter a valid phone number');
                return false;
            }
        }
        
        this.clearFieldError(field);
        return true;
    }
    
    /**
     * Show field error
     */
    showFieldError(field, message) {
        this.clearFieldError(field);
        
        field.classList.add('error');
        
        const errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        errorElement.textContent = message;
        
        field.parentNode.insertBefore(errorElement, field.nextSibling);
    }
    
    /**
     * Clear field error
     */
    clearFieldError(field) {
        field.classList.remove('error');
        
        const errorElement = field.parentNode.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
    }
    
    /**
     * Set form loading state
     */
    setLoadingState(form, isLoading) {
        const submitBtn = form.querySelector('button[type="submit"]');
        const btnText = submitBtn?.querySelector('.btn-text');
        const btnLoading = submitBtn?.querySelector('.btn-loading');
        
        if (submitBtn) {
            submitBtn.disabled = isLoading;
            
            if (btnText && btnLoading) {
                btnText.style.display = isLoading ? 'none' : 'inline';
                btnLoading.style.display = isLoading ? 'flex' : 'none';
            }
        }
        
        // Disable all form inputs
        const inputs = form.querySelectorAll('input, button, select, textarea');
        inputs.forEach(input => {
            input.disabled = isLoading;
        });
    }
    
    /**
     * Handle form success
     */
    handleFormSuccess(form, result) {
        this.showFormMessage(form, result.message, 'success');
        
        // Reset form
        form.reset();
        
        // Track success
        this.trackEvent('form_submission_success', {
            formType: this.getFormType(form)
        });
        
        // Handle downloads
        if (result.downloadUrl) {
            setTimeout(() => {
                window.open(result.downloadUrl, '_blank');
            }, 1000);
        }
        
        // Close modal if applicable
        const modal = form.closest('.modal, .lead-magnet-modal');
        if (modal) {
            this.closeModal(modal);
        }
    }
    
    /**
     * Handle form error
     */
    handleFormError(form, errorMessage) {
        this.showFormMessage(form, errorMessage, 'error');
        
        this.trackEvent('form_submission_error', {
            formType: this.getFormType(form),
            error: errorMessage
        });
    }
    
    /**
     * Show form message
     */
    showFormMessage(form, message, type) {
        // Remove existing messages
        const existingMessage = form.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // Create new message
        const messageElement = document.createElement('div');
        messageElement.className = `form-message form-message-${type}`;
        messageElement.innerHTML = `
            <div style="display: flex; align-items: center; gap: 8px;">
                ${type === 'success' 
                    ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20,6 9,17 4,12"></polyline></svg>'
                    : '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>'
                }
                <span>${message}</span>
            </div>
        `;
        
        // Insert message
        form.appendChild(messageElement);
        
        // Auto-hide error messages after 5 seconds
        if (type === 'error') {
            setTimeout(() => {
                if (messageElement.parentNode) {
                    messageElement.remove();
                }
            }, 5000);
        }
    }
    
    /**
     * Get form configuration
     */
    getFormConfig(form) {
        const formId = form.id;
        return this.forms.get(formId);
    }
    
    /**
     * Get form type
     */
    getFormType(form) {
        return form.dataset.formType || 'unknown';
    }
    
    /**
     * Update user profile
     */
    updateUserProfile(formData) {
        const updates = {};
        
        if (formData.get('email')) {
            updates.email = formData.get('email');
        }
        
        if (formData.get('company')) {
            updates.company = formData.get('company');
        }
        
        if (formData.get('role')) {
            updates.role = formData.get('role');
        }
        
        if (formData.get('teamSize')) {
            updates.teamSize = formData.get('teamSize');
        }
        
        // Update engagement score
        updates.engagementScore = (this.userProfile.engagementScore || 0) + 10;
        updates.lastInteraction = new Date().toISOString();
        
        this.userProfile = { ...this.userProfile, ...updates };
        this.saveUserProfile();
    }
    
    /**
     * Load user profile from localStorage
     */
    loadUserProfile() {
        try {
            const profile = localStorage.getItem('resiliotech_user_profile');
            return profile ? JSON.parse(profile) : {};
        } catch (error) {
            console.error('Error loading user profile:', error);
            return {};
        }
    }
    
    /**
     * Save user profile to localStorage
     */
    saveUserProfile() {
        try {
            localStorage.setItem('resiliotech_user_profile', JSON.stringify(this.userProfile));
        } catch (error) {
            console.error('Error saving user profile:', error);
        }
    }
    
    /**
     * Setup form validation
     */
    setupValidation() {
        // Real-time validation on blur
        document.addEventListener('blur', (e) => {
            if (e.target.matches('input, select, textarea')) {
                this.validateField(e.target);
            }
        }, true);
        
        // Clear errors on input
        document.addEventListener('input', (e) => {
            if (e.target.matches('input, select, textarea')) {
                this.clearFieldError(e.target);
            }
        }, true);
    }
    
    /**
     * Initialize progressive profiling
     */
    initializeProgressiveProfiling() {
        // This is handled per-form in setupProgressiveProfiling
    }
    
    /**
     * Load lead magnets
     */
    loadLeadMagnets() {
        // Lead magnets are loaded via the existing lead-magnets.html
        // This method can be extended for dynamic loading
    }
    
    /**
     * Track form events
     */
    trackFormEvents() {
        // Track form starts
        document.addEventListener('focusin', (e) => {
            if (e.target.matches('form input:first-of-type')) {
                const form = e.target.closest('form');
                if (form && form.dataset.formType) {
                    this.trackEvent('form_started', {
                        formType: form.dataset.formType,
                        source: form.dataset.source
                    });
                }
            }
        });
    }
    
    /**
     * Close modal
     */
    closeModal(modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }
    
    /**
     * Track events
     */
    trackEvent(eventName, properties) {
        if (!this.config.enableAnalytics) return;
        
        // Google Analytics 4
        if (window.gtag) {
            gtag('event', eventName, {
                event_category: 'Enhanced_Forms',
                ...properties
            });
        }
        
        // Custom analytics
        if (window.analyticsManager) {
            window.analyticsManager.trackEvent(eventName, properties);
        }
        
        // GTM
        if (window.dataLayer) {
            window.dataLayer.push({
                event: eventName,
                form_data: properties
            });
        }
        
        console.log(`Enhanced form event: ${eventName}`, properties);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.enhancedFormManager = new EnhancedFormManager();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EnhancedFormManager;
}