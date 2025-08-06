/**
 * Products Page JavaScript
 * Handles waitlist forms, analytics tracking, and user interactions
 */

class ProductsPage {
    constructor() {
        this.config = {
            apiEndpoint: '/api/waitlist',
            enableAnalytics: true,
            enableLocalStorage: true,
            debugMode: window.location.hostname === 'localhost'
        };
        
        this.waitlistData = [];
        
        this.init();
    }
    
    init() {
        this.log('Products page initializing...');
        
        // Initialize waitlist forms
        this.setupWaitlistForms();
        
        // Set up analytics tracking
        this.setupAnalyticsTracking();
        
        // Initialize product interactions
        this.setupProductInteractions();
        
        // Load existing waitlist data
        this.loadWaitlistData();
        
        this.log('Products page initialized');
    }
    
    // Waitlist Form Management
    setupWaitlistForms() {
        const forms = document.querySelectorAll('.waitlist-form');
        
        forms.forEach(form => {
            const productName = form.dataset.product;
            
            // Add form validation
            this.addFormValidation(form);
            
            // Handle form submission
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                await this.handleWaitlistSubmission(form, productName);
            });
        });
    }
    
    addFormValidation(form) {
        const emailInput = form.querySelector('input[type="email"]');
        const submitButton = form.querySelector('button[type="submit"]');
        
        emailInput.addEventListener('input', () => {
            const isValid = this.validateEmail(emailInput.value);
            
            submitButton.disabled = !isValid;
            
            if (emailInput.value && !isValid) {
                emailInput.style.borderColor = '#ef4444';
            } else {
                emailInput.style.borderColor = '';
            }
        });
        
        emailInput.addEventListener('blur', () => {
            if (emailInput.value && !this.validateEmail(emailInput.value)) {
                this.showValidationError(emailInput, 'Please enter a valid email address');
            }
        });
    }
    
    async handleWaitlistSubmission(form, productName) {
        const emailInput = form.querySelector('input[type="email"]');
        const submitButton = form.querySelector('button[type="submit"]');
        const email = emailInput.value.trim();
        
        if (!this.validateEmail(email)) {
            this.showValidationError(emailInput, 'Please enter a valid email address');
            return;
        }
        
        // Show loading state
        this.setFormLoadingState(form, true);
        
        try {
            // Prepare waitlist data
            const waitlistEntry = {
                email: email,
                product: productName,
                timestamp: new Date().toISOString(),
                source: 'products_page',
                userAgent: navigator.userAgent,
                referrer: document.referrer || 'direct'
            };
            
            // Add to local storage first
            this.addToWaitlistLocally(waitlistEntry);
            
            // Send to server
            await this.submitToWaitlist(waitlistEntry);
            
            // Track analytics event
            this.trackWaitlistSignup(productName, email);
            
            // Show success message
            this.showWaitlistSuccess(form, productName);
            
        } catch (error) {
            this.log('Error submitting to waitlist:', error);
            this.showWaitlistError(form, 'Something went wrong. Please try again.');
        } finally {
            this.setFormLoadingState(form, false);
        }
    }
    
    async submitToWaitlist(waitlistEntry) {
        try {
            const response = await fetch(this.config.apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(waitlistEntry)
            });
            
            if (!response.ok) {
                throw new Error(`Waitlist API error: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            // If API fails, we'll still have it in localStorage
            this.log('Waitlist API unavailable, stored locally:', error);
            throw error;
        }
    }
    
    addToWaitlistLocally(waitlistEntry) {
        if (!this.config.enableLocalStorage) return;
        
        let waitlist = JSON.parse(localStorage.getItem('resiliotech_waitlist') || '[]');
        
        // Check for duplicates
        const exists = waitlist.some(entry => 
            entry.email === waitlistEntry.email && entry.product === waitlistEntry.product
        );
        
        if (!exists) {
            waitlist.push({
                ...waitlistEntry,
                id: this.generateEntryId()
            });
            
            localStorage.setItem('resiliotech_waitlist', JSON.stringify(waitlist));
        }
    }
    
    // Enhanced Analytics Tracking for SaaS Products
    setupAnalyticsTracking() {
        // Track page view with enhanced SaaS context
        if (window.analyticsManager) {
            window.analyticsManager.trackEvent('page_view_products', {
                page: 'products_main',
                products_shown: this.getProductsShown(),
                business_model: 'saas',
                page_type: 'saas',
                funnel_stage: 'awareness'
            });
            
            // Track that user has shown SaaS interest
            if (window.analyticsManager.incrementModelPreference) {
                window.analyticsManager.incrementModelPreference('saas');
            }
        }
        
        // Track product card interactions with enhanced context
        document.querySelectorAll('.product-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const productName = this.getProductNameFromCard(card);
                this.trackProductInteraction('card_click', productName);
                
                // Track as product view
                if (window.analyticsManager && window.analyticsManager.trackProductView) {
                    window.analyticsManager.trackProductView(this.formatProductName(productName), {
                        interaction_type: 'card_click',
                        location: 'products_page'
                    });
                }
            });
        });
        
        // Track compare table interactions with enhanced context
        const compareTable = document.querySelector('.compare-table');
        if (compareTable) {
            compareTable.addEventListener('click', (e) => {
                this.trackProductInteraction('compare_table_click');
                
                // Track specific feature comparison
                if (window.analyticsManager) {
                    const row = e.target.closest('tr');
                    const feature = row?.querySelector('td:first-child')?.textContent.trim();
                    
                    if (feature) {
                        window.analyticsManager.trackEvent('product_comparison_view', {
                            feature: feature,
                            business_model: 'saas',
                            funnel_stage: 'consideration',
                            location: 'products_page'
                        });
                    }
                }
            });
        }
        
        // Track CTA clicks
        document.querySelectorAll('[data-track="cta_click"]').forEach(cta => {
            cta.addEventListener('click', (e) => {
                const source = e.target.dataset.source || 'unknown';
                this.trackCTAClick(source);
            });
        });
    }
    
    trackWaitlistSignup(productName, email) {
        if (window.analyticsManager) {
            // Track as enhanced conversion with full context
            window.analyticsManager.trackConversion('waitlist_signup', 12, {
                product: productName,
                product_name: this.formatProductName(productName),
                email_domain: email.split('@')[1],
                source: 'products_page',
                business_model: 'saas',
                funnel_stage: 'consideration',
                conversion_type: 'lead_generation'
            });
            
            // Track as SaaS ecommerce event
            if (window.analyticsManager.trackSaaSConversion) {
                window.analyticsManager.trackSaaSConversion('waitlist_signup', 12, {
                    product: productName,
                    product_name: this.formatProductName(productName)
                });
            }
            
            // Track user preference
            if (window.analyticsManager.incrementModelPreference) {
                window.analyticsManager.incrementModelPreference('saas');
            }
        }
    }
    
    trackProductInteraction(action, productName = null) {
        if (window.analyticsManager) {
            window.analyticsManager.trackEvent('product_interaction', {
                action: action,
                product: productName,
                product_name: productName ? this.formatProductName(productName) : null,
                page: 'products_main',
                business_model: 'saas',
                funnel_stage: action === 'card_viewed' ? 'interest' : 'awareness'
            });
        }
    }
    
    trackCTAClick(source) {
        if (window.analyticsManager) {
            const businessModel = source.includes('consulting') ? 'consulting' : 'saas';
            window.analyticsManager.trackEvent('cta_click', {
                source: source,
                page: 'products',
                type: source.includes('consulting') ? 'consulting' : 'products',
                business_model: businessModel,
                funnel_stage: businessModel === 'consulting' ? 'consideration' : 'interest'
            });
            
            // Track cross-model engagement
            if (source.includes('consulting')) {
                window.analyticsManager.trackEvent('cross_model_engagement', {
                    from: 'saas',
                    to: 'consulting',
                    trigger: 'cta_click',
                    location: 'products_page'
                });
            }
        }
    }
    
    // Product Interactions
    setupProductInteractions() {
        // Add hover effects and animations
        this.setupProductCardAnimations();
        
        // Set up modal functionality if needed
        this.setupProductModals();
        
        // Initialize comparison functionality
        this.setupProductComparison();
    }
    
    setupProductCardAnimations() {
        const cards = document.querySelectorAll('.product-card');
        
        cards.forEach(card => {
            // Add loading effect on interaction
            card.addEventListener('mouseenter', () => {
                this.addCardInteractionEffect(card);
            });
            
            // Track time spent viewing each card
            let viewStartTime;
            card.addEventListener('mouseenter', () => {
                viewStartTime = Date.now();
            });
            
            card.addEventListener('mouseleave', () => {
                if (viewStartTime) {
                    const viewTime = Date.now() - viewStartTime;
                    const productName = this.getProductNameFromCard(card);
                    
                    if (viewTime > 2000) { // 2+ seconds
                        this.trackProductInteraction('card_viewed', productName);
                    }
                }
            });
        });
    }
    
    addCardInteractionEffect(card) {
        // Add subtle interaction feedback
        card.style.transform = 'translateY(-2px) scale(1.01)';
        
        setTimeout(() => {
            card.style.transform = '';
        }, 200);
    }
    
    setupProductModals() {
        // Placeholder for future modal functionality
        // Could be used for detailed product previews
    }
    
    setupProductComparison() {
        const compareTable = document.querySelector('.compare-table table');
        if (!compareTable) return;
        
        // Add interactive comparison features
        const rows = compareTable.querySelectorAll('tbody tr');
        
        rows.forEach(row => {
            row.addEventListener('click', () => {
                row.classList.toggle('highlighted');
                
                // Track which features users are most interested in
                const feature = row.querySelector('td:first-child').textContent.trim();
                this.trackProductInteraction('feature_highlight', feature);
            });
        });
    }
    
    // Form State Management
    setFormLoadingState(form, loading) {
        const submitButton = form.querySelector('button[type="submit"]');
        const emailInput = form.querySelector('input[type="email"]');
        
        if (loading) {
            submitButton.disabled = true;
            submitButton.textContent = 'Adding to waitlist...';
            emailInput.disabled = true;
            form.classList.add('loading');
        } else {
            submitButton.disabled = false;
            submitButton.textContent = 'Notify Me When Available';
            emailInput.disabled = false;
            form.classList.remove('loading');
        }
    }
    
    showWaitlistSuccess(form, productName) {
        form.classList.add('success');
        
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: center; gap: 8px;">
                <span style="font-size: 18px;">🎉</span>
                <span>You're on the waitlist for ${this.formatProductName(productName)}!</span>
            </div>
            <div style="font-size: var(--font-size-sm); margin-top: 8px; opacity: 0.8;">
                We'll notify you as soon as it's available.
            </div>
        `;
        
        form.appendChild(successMessage);
        
        // Hide form elements
        form.querySelector('input').style.display = 'none';
        form.querySelector('button').style.display = 'none';
        form.querySelector('.privacy-note').style.display = 'none';
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            successMessage.style.opacity = '0.5';
        }, 5000);
    }
    
    showWaitlistError(form, message) {
        this.showValidationError(form.querySelector('input[type="email"]'), message);
    }
    
    showValidationError(input, message) {
        // Remove existing error message
        this.clearValidationError(input);
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'validation-error';
        errorDiv.textContent = message;
        errorDiv.style.cssText = `
            color: #ef4444;
            font-size: var(--font-size-sm);
            margin-top: 5px;
            padding: 5px 0;
        `;
        
        input.parentNode.appendChild(errorDiv);
        input.style.borderColor = '#ef4444';
    }
    
    clearValidationError(input) {
        const existingError = input.parentNode.querySelector('.validation-error');
        if (existingError) {
            existingError.remove();
        }
        input.style.borderColor = '';
    }
    
    // Utility Methods
    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    getProductsShown() {
        const cards = document.querySelectorAll('.product-card');
        return Array.from(cards).map(card => this.getProductNameFromCard(card));
    }
    
    getProductNameFromCard(card) {
        const h3 = card.querySelector('h3');
        return h3 ? h3.textContent.trim() : 'unknown';
    }
    
    formatProductName(productName) {
        return productName.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    }
    
    generateEntryId() {
        return 'entry_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    loadWaitlistData() {
        if (!this.config.enableLocalStorage) return;
        
        const stored = localStorage.getItem('resiliotech_waitlist');
        if (stored) {
            this.waitlistData = JSON.parse(stored);
            this.log('Loaded waitlist data:', this.waitlistData.length, 'entries');
        }
    }
    
    log(...args) {
        if (this.config.debugMode) {
            console.log('[Products Page]', ...args);
        }
    }
}

// Newsletter Integration
class NewsletterSignup {
    constructor() {
        this.init();
    }
    
    init() {
        const forms = document.querySelectorAll('.newsletter-form');
        forms.forEach(form => this.setupNewsletterForm(form));
    }
    
    setupNewsletterForm(form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = form.querySelector('input[type="email"]').value.trim();
            
            if (this.validateEmail(email)) {
                // Track newsletter signup
                if (window.analyticsManager) {
                    window.analyticsManager.trackEvent('newsletter_subscribe', {
                        source: 'products_page',
                        email_domain: email.split('@')[1]
                    });
                }
                
                // Show success (placeholder for actual integration)
                this.showNewsletterSuccess(form);
            }
        });
    }
    
    validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
    
    showNewsletterSuccess(form) {
        const button = form.querySelector('button');
        const originalText = button.textContent;
        
        button.textContent = 'Subscribed!';
        button.style.background = '#10b981';
        
        setTimeout(() => {
            button.textContent = originalText;
            button.style.background = '';
        }, 2000);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.productsPage = new ProductsPage();
    window.newsletterSignup = new NewsletterSignup();
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ProductsPage, NewsletterSignup };
}