/**
 * Newsletter Manager for Resiliotech
 * Handles newsletter signups, email capture, and integration with email service providers
 */

class NewsletterManager {
    constructor() {
        this.config = {
            // Substack integration
            substackUrl: 'https://resiliotech.substack.com',
            // Fallback to Netlify Forms
            netlifyEndpoint: '/newsletter-signup',
            // Email validation
            enableValidation: true,
            // GDPR compliance
            requireConsent: true,
            // Analytics tracking
            enableAnalytics: true,
            // A/B testing
            enableABTesting: false,
            // Double opt-in
            doubleOptIn: true
        };
        
        this.forms = new Map();
        this.subscribers = new Set();
        
        this.init();
    }
    
    init() {
        this.bindNewsletterForms();
        this.setupPopupNewsletter();
        this.trackNewsletterEvents();
        this.loadSubscriberPreferences();
    }
    
    /**
     * Bind all newsletter forms on the page
     */
    bindNewsletterForms() {
        const forms = document.querySelectorAll('[data-form-type="newsletter"]');
        
        forms.forEach(form => {
            this.setupForm(form);
        });
    }
    
    /**
     * Setup individual newsletter form
     */
    setupForm(form) {
        const formId = form.id || `newsletter-form-${Date.now()}`;
        const source = form.dataset.source || 'unknown';
        
        // Store form configuration
        this.forms.set(formId, {
            element: form,
            source: source,
            submitted: false,
            leadMagnet: form.dataset.leadMagnet
        });
        
        // Bind submit handler
        form.addEventListener('submit', (e) => this.handleSubmit(e, formId));
        
        // Bind real-time validation
        const emailInput = form.querySelector('input[type="email"]');
        if (emailInput) {
            emailInput.addEventListener('blur', () => this.validateEmail(emailInput));
            emailInput.addEventListener('input', () => this.clearValidationErrors(emailInput));
        }
        
        console.log(`Newsletter form initialized: ${formId} (source: ${source})`);
    }
    
    /**
     * Handle form submission
     */
    async handleSubmit(event, formId) {
        event.preventDefault();
        
        const formConfig = this.forms.get(formId);
        if (!formConfig || formConfig.submitted) return;
        
        const form = formConfig.element;
        const formData = new FormData(form);
        const email = formData.get('email');
        
        // Validate form
        if (!this.validateForm(form)) {
            return;
        }
        
        // Show loading state
        this.setLoadingState(form, true);
        
        try {
            // Process signup
            const result = await this.processSignup({
                email: email,
                interests: formData.getAll('interests'),
                source: formConfig.source,
                leadMagnet: formConfig.leadMagnet,
                consent: formData.get('consent') === 'on',
                formId: formId
            });
            
            if (result.success) {
                this.handleSignupSuccess(form, result);
                formConfig.submitted = true;
            } else {
                this.handleSignupError(form, result.error);
            }
            
        } catch (error) {
            console.error('Newsletter signup error:', error);
            this.handleSignupError(form, error.message);
        } finally {
            this.setLoadingState(form, false);
        }
    }
    
    /**
     * Process newsletter signup
     */
    async processSignup(data) {
        // Track signup attempt
        this.trackEvent('newsletter_signup_attempt', {
            source: data.source,
            email: data.email,
            interests: data.interests,
            leadMagnet: data.leadMagnet
        });
        
        try {
            // Try Substack first (if configured)
            if (this.config.substackUrl) {
                const substackResult = await this.submitToSubstack(data);
                if (substackResult.success) {
                    return substackResult;
                }
            }
            
            // Fallback to Netlify Forms
            const netlifyResult = await this.submitToNetlify(data);
            return netlifyResult;
            
        } catch (error) {
            console.error('Signup processing error:', error);
            return { 
                success: false, 
                error: 'Unable to complete signup. Please try again.' 
            };
        }
    }
    
    /**
     * Submit to Substack
     */
    async submitToSubstack(data) {
        try {
            // Substack doesn't have direct API, so we'll use a workaround
            // This would normally require backend integration
            const response = await fetch(`${this.config.substackUrl}/api/v1/free?email=${encodeURIComponent(data.email)}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                mode: 'no-cors' // This limits what we can do, but allows the request
            });
            
            // Since we can't read the response in no-cors mode,
            // we'll assume success and let the user know to check their email
            return {
                success: true,
                provider: 'substack',
                message: 'Please check your email to confirm your subscription.',
                requiresConfirmation: true
            };
            
        } catch (error) {
            console.error('Substack submission error:', error);
            return { success: false, error: error.message };
        }
    }
    
    /**
     * Submit to Netlify Forms
     */
    async submitToNetlify(data) {
        try {
            const formData = new FormData();
            formData.append('form-name', 'newsletter');
            formData.append('email', data.email);
            formData.append('source', data.source);
            formData.append('interests', data.interests.join(','));
            formData.append('leadMagnet', data.leadMagnet || '');
            formData.append('timestamp', new Date().toISOString());
            
            const response = await fetch('/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams(formData).toString()
            });
            
            if (response.ok) {
                return {
                    success: true,
                    provider: 'netlify',
                    message: 'Successfully subscribed to newsletter!'
                };
            } else {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
        } catch (error) {
            console.error('Netlify submission error:', error);
            return { success: false, error: error.message };
        }
    }
    
    /**
     * Validate form before submission
     */
    validateForm(form) {
        const emailInput = form.querySelector('input[type="email"]');
        const consentCheckbox = form.querySelector('input[name="consent"]');
        
        let isValid = true;
        
        // Validate email
        if (!this.validateEmail(emailInput)) {
            isValid = false;
        }
        
        // Validate consent (if required)
        if (this.config.requireConsent && consentCheckbox && !consentCheckbox.checked) {
            this.showFieldError(consentCheckbox, 'You must consent to receive emails');
            isValid = false;
        }
        
        return isValid;
    }
    
    /**
     * Validate email address
     */
    validateEmail(input) {
        if (!input) return false;
        
        const email = input.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!email) {
            this.showFieldError(input, 'Email is required');
            return false;
        }
        
        if (!emailRegex.test(email)) {
            this.showFieldError(input, 'Please enter a valid email address');
            return false;
        }
        
        // Check against known disposable email domains
        if (this.isDisposableEmail(email)) {
            this.showFieldError(input, 'Please use a permanent email address');
            return false;
        }
        
        this.clearFieldError(input);
        return true;
    }
    
    /**
     * Check if email is from a disposable email service
     */
    isDisposableEmail(email) {
        const disposableDomains = [
            '10minutemail.com', 'tempmail.org', 'guerrillamail.com',
            'throwaway.email', 'temp-mail.org', 'mailinator.com'
        ];
        
        const domain = email.split('@')[1]?.toLowerCase();
        return disposableDomains.includes(domain);
    }
    
    /**
     * Show field error
     */
    showFieldError(input, message) {
        this.clearFieldError(input);
        
        input.classList.add('error');
        
        const errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        errorElement.textContent = message;
        
        input.parentNode.insertBefore(errorElement, input.nextSibling);
    }
    
    /**
     * Clear field error
     */
    clearFieldError(input) {
        input.classList.remove('error');
        
        const errorElement = input.parentNode.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
    }
    
    /**
     * Clear all validation errors
     */
    clearValidationErrors(input) {
        this.clearFieldError(input);
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
        const inputs = form.querySelectorAll('input, button, select');
        inputs.forEach(input => {
            input.disabled = isLoading;
        });
    }
    
    /**
     * Handle successful signup
     */
    handleSignupSuccess(form, result) {
        // Show success message
        this.showFormMessage(form, result.message, 'success');
        
        // Reset form
        form.reset();
        
        // Track success
        this.trackEvent('newsletter_signup_success', {
            source: this.getFormSource(form),
            provider: result.provider
        });
        
        // Store subscriber (for preventing duplicate popups)
        const email = form.querySelector('input[type="email"]')?.value;
        if (email) {
            this.subscribers.add(email);
            localStorage.setItem('newsletter_subscribers', JSON.stringify([...this.subscribers]));
        }
        
        // Handle lead magnet downloads
        if (result.downloadUrl) {
            setTimeout(() => {
                window.open(result.downloadUrl, '_blank');
            }, 1000);
        }
        
        // Close modal if this is a modal form
        if (form.closest('.modal')) {
            this.closeModal(form.closest('.modal'));
        }
    }
    
    /**
     * Handle signup error
     */
    handleSignupError(form, errorMessage) {
        this.showFormMessage(form, errorMessage, 'error');
        
        this.trackEvent('newsletter_signup_error', {
            source: this.getFormSource(form),
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
     * Get form source
     */
    getFormSource(form) {
        return form.dataset.source || 'unknown';
    }
    
    /**
     * Setup popup newsletter (delayed popup)
     */
    setupPopupNewsletter() {
        // Don't show popup if user already subscribed
        if (this.hasUserSubscribed()) return;
        
        // Don't show on mobile
        if (window.innerWidth < 768) return;
        
        // Don't show popup too frequently
        const lastPopup = localStorage.getItem('newsletter_popup_last_shown');
        if (lastPopup && Date.now() - parseInt(lastPopup) < 24 * 60 * 60 * 1000) {
            return; // Don't show if shown in last 24 hours
        }
        
        // Show after 60 seconds on homepage
        if (window.location.pathname === '/' || window.location.pathname === '/index.html') {
            setTimeout(() => {
                this.showNewsletterPopup();
            }, 60000);
        }
    }
    
    /**
     * Check if user has already subscribed
     */
    hasUserSubscribed() {
        const subscribers = JSON.parse(localStorage.getItem('newsletter_subscribers') || '[]');
        return subscribers.length > 0;
    }
    
    /**
     * Show newsletter popup
     */
    showNewsletterPopup() {
        if (this.hasUserSubscribed()) return;
        
        const popup = document.createElement('div');
        popup.className = 'newsletter-popup-overlay';
        popup.innerHTML = `
            <div class="newsletter-popup">
                <button class="newsletter-popup-close" aria-label="Close newsletter popup">×</button>
                <div class="newsletter-popup-content">
                    <h3>🚀 Join 500+ Startup Founders</h3>
                    <p>Get bi-monthly DevOps automation insights, case studies, and early access to our SaaS tools.</p>
                    
                    <form data-form-type="newsletter" data-source="popup" class="newsletter-popup-form">
                        <input type="email" name="email" placeholder="Enter your work email" required>
                        <button type="submit">
                            <span class="btn-text">Subscribe</span>
                            <span class="btn-loading" style="display: none;">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M21 12a9 9 0 11-6.219-8.56"/>
                                </svg>
                            </span>
                        </button>
                        
                        <div class="newsletter-interests">
                            <label><input type="checkbox" name="interests" value="consulting" checked> Consulting insights</label>
                            <label><input type="checkbox" name="interests" value="saas-tools" checked> SaaS tool updates</label>
                        </div>
                        
                        <p class="newsletter-privacy">No spam. Unsubscribe anytime.</p>
                    </form>
                </div>
            </div>
        `;
        
        document.body.appendChild(popup);
        document.body.style.overflow = 'hidden';
        
        // Bind close handlers
        popup.querySelector('.newsletter-popup-close').addEventListener('click', () => {
            this.closeNewsletterPopup(popup);
        });
        
        popup.addEventListener('click', (e) => {
            if (e.target === popup) {
                this.closeNewsletterPopup(popup);
            }
        });
        
        // Setup form
        this.setupForm(popup.querySelector('form'));
        
        // Track popup shown
        localStorage.setItem('newsletter_popup_last_shown', Date.now().toString());
        this.trackEvent('newsletter_popup_shown', { source: 'delayed_popup' });
    }
    
    /**
     * Close newsletter popup
     */
    closeNewsletterPopup(popup) {
        document.body.style.overflow = '';
        popup.remove();
        
        this.trackEvent('newsletter_popup_closed', { source: 'user_action' });
    }
    
    /**
     * Track newsletter events
     */
    trackNewsletterEvents() {
        // Track newsletter link clicks
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href*="substack"], a[href*="newsletter"]');
            if (link) {
                this.trackEvent('newsletter_link_click', {
                    url: link.href,
                    source: 'footer'
                });
            }
        });
    }
    
    /**
     * Track events
     */
    trackEvent(eventName, properties) {
        if (!this.config.enableAnalytics) return;
        
        // Google Analytics 4
        if (window.gtag) {
            gtag('event', eventName, {
                event_category: 'Newsletter',
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
                newsletter_data: properties
            });
        }
        
        console.log(`Newsletter event: ${eventName}`, properties);
    }
    
    /**
     * Load subscriber preferences from localStorage
     */
    loadSubscriberPreferences() {
        const subscribers = JSON.parse(localStorage.getItem('newsletter_subscribers') || '[]');
        this.subscribers = new Set(subscribers);
    }
    
    /**
     * Close modal
     */
    closeModal(modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }
}

// Add newsletter popup styles
const newsletterStyles = `
<style>
/* Form validation styles */
.newsletter-email-input.error,
input[type="email"].error {
    border-color: #ef4444 !important;
    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1) !important;
}

.field-error {
    color: #ef4444;
    font-size: 0.75rem;
    margin-top: 0.25rem;
    display: block;
}

/* Form message styles */
.form-message {
    margin-top: 1rem;
    padding: 0.75rem;
    border-radius: 0.5rem;
    font-size: 0.875rem;
    font-weight: 500;
}

.form-message-success {
    background: rgba(16, 185, 129, 0.1);
    color: #10b981;
    border: 1px solid rgba(16, 185, 129, 0.2);
}

.form-message-error {
    background: rgba(239, 68, 68, 0.1);
    color: #ef4444;
    border: 1px solid rgba(239, 68, 68, 0.2);
}

/* Newsletter popup styles */
.newsletter-popup-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    padding: 20px;
    animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

.newsletter-popup {
    background: var(--background-light, #1a1a1a);
    border: 1px solid var(--border-color, #27272a);
    border-radius: 16px;
    padding: 2rem;
    max-width: 480px;
    width: 100%;
    position: relative;
    animation: slideUp 0.3s ease;
}

@keyframes slideUp {
    from {
        transform: translateY(20px);
        opacity: 0;
    }
    to {
        transform: translateY(0);
        opacity: 1;
    }
}

.newsletter-popup-close {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: none;
    border: none;
    font-size: 1.5rem;
    color: var(--text-secondary, #a1a1aa);
    cursor: pointer;
    width: 2rem;
    height: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: all 0.2s ease;
}

.newsletter-popup-close:hover {
    background: var(--background-dark, #262626);
    color: var(--text-primary, #ffffff);
}

.newsletter-popup-content h3 {
    color: var(--text-primary, #ffffff);
    margin-bottom: 0.5rem;
    font-size: 1.5rem;
}

.newsletter-popup-content p {
    color: var(--text-secondary, #a1a1aa);
    margin-bottom: 1.5rem;
    line-height: 1.6;
}

.newsletter-popup-form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.newsletter-popup-form input[type="email"] {
    padding: 0.75rem 1rem;
    background: var(--background-dark, #262626);
    border: 1px solid var(--border-color, #27272a);
    border-radius: 8px;
    color: var(--text-primary, #ffffff);
    font-size: 1rem;
}

.newsletter-popup-form input[type="email"]:focus {
    outline: none;
    border-color: var(--primary-color, #6366f1);
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.newsletter-popup-form button {
    padding: 0.75rem 1.5rem;
    background: var(--primary-color, #6366f1);
    color: white;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
}

.newsletter-popup-form button:hover {
    background: var(--primary-dark, #4f46e5);
}

.newsletter-popup-form button:disabled {
    opacity: 0.7;
    cursor: not-allowed;
}

.btn-loading svg {
    animation: spin 1s linear infinite;
}

.newsletter-interests {
    display: flex;
    gap: 1rem;
    font-size: 0.875rem;
}

.newsletter-interests label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: var(--text-secondary, #a1a1aa);
    cursor: pointer;
}

.newsletter-privacy {
    font-size: 0.75rem;
    color: var(--text-light, #71717a);
    text-align: center;
    margin: 0;
}

@media (max-width: 768px) {
    .newsletter-popup {
        padding: 1.5rem;
        margin: 1rem;
    }
    
    .newsletter-interests {
        flex-direction: column;
        gap: 0.5rem;
    }
}
</style>
`;

// Inject styles
document.head.insertAdjacentHTML('beforeend', newsletterStyles);

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.newsletterManager = new NewsletterManager();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NewsletterManager;
}