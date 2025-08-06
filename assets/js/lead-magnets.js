/**
 * Lead Magnets & Modal Functionality
 * Handles all lead magnet interactions, modal management, and ROI calculations
 */

class LeadMagnetManager {
    constructor() {
        this.modals = {};
        this.currentModal = null;
        this.init();
    }

    init() {
        this.initializeModals();
        this.bindEvents();
        this.initializeROICalculator();
    }

    initializeModals() {
        // Cache all modals
        const modalElements = document.querySelectorAll('.modal');
        modalElements.forEach(modal => {
            const modalId = modal.getAttribute('id');
            this.modals[modalId] = {
                element: modal,
                content: modal.querySelector('.modal-content'),
                closeBtn: modal.querySelector('.modal-close'),
                form: modal.querySelector('.modal-form')
            };
        });
    }

    bindEvents() {
        // Bind modal trigger buttons
        document.addEventListener('click', (e) => {
            // Handle audit modal trigger
            if (e.target.matches('.audit-cta') || e.target.closest('.audit-cta')) {
                e.preventDefault();
                this.openModal('auditModal');
            }

            // Handle secondary lead magnet triggers
            if (e.target.matches('.lead-magnet-btn[data-modal]') || e.target.closest('.lead-magnet-btn[data-modal]')) {
                e.preventDefault();
                const modalId = e.target.getAttribute('data-modal') || e.target.closest('.lead-magnet-btn').getAttribute('data-modal');
                this.openModal(modalId);
            }

            // Handle modal close buttons
            if (e.target.matches('.modal-close') || e.target.closest('.modal-close')) {
                e.preventDefault();
                this.closeModal();
            }

            // Handle modal backdrop clicks
            if (e.target.matches('.modal')) {
                this.closeModal();
            }
        });

        // Handle form submissions
        document.addEventListener('submit', (e) => {
            if (e.target.matches('.modal-form')) {
                e.preventDefault();
                this.handleFormSubmission(e.target);
            }
        });

        // Handle escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.currentModal) {
                this.closeModal();
            }
        });

        // Prevent modal content clicks from closing modal
        document.addEventListener('click', (e) => {
            if (e.target.matches('.modal-content') || e.target.closest('.modal-content')) {
                e.stopPropagation();
            }
        });
    }

    openModal(modalId) {
        const modal = this.modals[modalId];
        if (!modal) return;

        // Close any currently open modal
        if (this.currentModal) {
            this.closeModal();
        }

        // Open the new modal
        modal.element.classList.add('active');
        document.body.style.overflow = 'hidden';
        this.currentModal = modalId;

        // Focus management
        const firstFocusable = modal.element.querySelector('input, button, select, textarea');
        if (firstFocusable) {
            setTimeout(() => firstFocusable.focus(), 100);
        }

        // Track modal open event (for analytics)
        this.trackEvent('modal_opened', {
            modal_id: modalId,
            lead_magnet_type: this.getLeadMagnetType(modalId)
        });
    }

    closeModal() {
        if (!this.currentModal) return;

        const modal = this.modals[this.currentModal];
        if (modal) {
            modal.element.classList.remove('active');
            
            // Reset form if it exists
            if (modal.form) {
                modal.form.reset();
                this.clearFormErrors(modal.form);
            }
        }

        document.body.style.overflow = '';
        this.currentModal = null;
    }

    async handleFormSubmission(form) {
        const formData = new FormData(form);
        const modalId = form.closest('.modal').getAttribute('id');
        const submitButton = form.querySelector('.form-submit');
        
        // Show loading state
        this.setFormLoading(form, true);
        
        try {
            // Validate form
            if (!this.validateForm(form)) {
                this.setFormLoading(form, false);
                return;
            }

            // Submit form data
            const result = await this.submitForm(formData, modalId);
            
            if (result.success) {
                this.handleFormSuccess(form, result);
            } else {
                this.handleFormError(form, result.error);
            }
        } catch (error) {
            console.error('Form submission error:', error);
            this.handleFormError(form, 'An error occurred. Please try again.');
        } finally {
            this.setFormLoading(form, false);
        }
    }

    validateForm(form) {
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                this.showFieldError(field, 'This field is required');
                isValid = false;
            } else {
                this.clearFieldError(field);
            }
        });

        // Email validation
        const emailFields = form.querySelectorAll('input[type="email"]');
        emailFields.forEach(field => {
            if (field.value && !this.isValidEmail(field.value)) {
                this.showFieldError(field, 'Please enter a valid email address');
                isValid = false;
            }
        });

        return isValid;
    }

    isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    showFieldError(field, message) {
        this.clearFieldError(field);
        
        const errorElement = document.createElement('span');
        errorElement.className = 'field-error';
        errorElement.textContent = message;
        errorElement.style.color = 'var(--error-color, #ef4444)';
        errorElement.style.fontSize = 'var(--font-size-sm)';
        errorElement.style.marginTop = 'var(--spacing-1)';
        
        field.parentNode.appendChild(errorElement);
        field.style.borderColor = 'var(--error-color, #ef4444)';
    }

    clearFieldError(field) {
        const errorElement = field.parentNode.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
        field.style.borderColor = '';
    }

    clearFormErrors(form) {
        const errorElements = form.querySelectorAll('.field-error');
        errorElements.forEach(el => el.remove());
        
        const fields = form.querySelectorAll('input, select, textarea');
        fields.forEach(field => field.style.borderColor = '');
    }

    setFormLoading(form, loading) {
        const submitButton = form.querySelector('.form-submit');
        if (loading) {
            submitButton.disabled = true;
            submitButton.innerHTML = '<span>Submitting...</span>';
        } else {
            submitButton.disabled = false;
            submitButton.innerHTML = this.getOriginalSubmitText(form);
        }
    }

    getOriginalSubmitText(form) {
        const modalId = form.closest('.modal').getAttribute('id');
        switch (modalId) {
            case 'auditModal':
                return 'Get My Free Audit';
            case 'checklistModal':
                return 'Download Checklist';
            case 'calendlyModal':
                return 'Schedule Call';
            case 'roiModal':
                return 'Get ROI Report';
            default:
                return 'Submit';
        }
    }

    async submitForm(formData, modalId) {
        // In a real implementation, this would make an API call
        // For now, we'll simulate the submission
        
        const data = Object.fromEntries(formData.entries());
        
        // Track form submission
        this.trackEvent('form_submitted', {
            modal_id: modalId,
            lead_magnet_type: this.getLeadMagnetType(modalId),
            company: data.company || '',
            email: data.email || ''
        });

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // For demo purposes, return success
        return {
            success: true,
            message: 'Thank you! We\'ll be in touch soon.',
            downloadUrl: this.getDownloadUrl(modalId)
        };
    }

    handleFormSuccess(form, result) {
        const modalId = form.closest('.modal').getAttribute('id');
        
        // Show success message
        this.showSuccessMessage(form, result.message);
        
        // Handle specific modal types
        if (modalId === 'checklistModal' && result.downloadUrl) {
            // Trigger download
            this.triggerDownload(result.downloadUrl, 'Infrastructure-Automation-Checklist.pdf');
        }
        
        if (modalId === 'calendlyModal') {
            // Redirect to Calendly or show embedded calendar
            this.showCalendlyWidget(form);
        }
        
        // Close modal after delay
        setTimeout(() => {
            this.closeModal();
        }, 3000);
    }

    handleFormError(form, errorMessage) {
        this.showErrorMessage(form, errorMessage);
    }

    showSuccessMessage(form, message) {
        const messageDiv = this.createMessage(message, 'success');
        form.parentNode.insertBefore(messageDiv, form);
        form.style.display = 'none';
    }

    showErrorMessage(form, message) {
        const existingMessage = form.parentNode.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        const messageDiv = this.createMessage(message, 'error');
        form.parentNode.insertBefore(messageDiv, form);
    }

    createMessage(text, type) {
        const div = document.createElement('div');
        div.className = `form-message form-message--${type}`;
        div.textContent = text;
        
        const baseStyles = {
            padding: 'var(--spacing-4)',
            borderRadius: 'var(--border-radius)',
            marginBottom: 'var(--spacing-4)',
            textAlign: 'center',
            fontWeight: '500'
        };
        
        const typeStyles = {
            success: {
                background: 'rgba(34, 197, 94, 0.1)',
                color: '#22c55e',
                border: '1px solid rgba(34, 197, 94, 0.3)'
            },
            error: {
                background: 'rgba(239, 68, 68, 0.1)',
                color: '#ef4444',
                border: '1px solid rgba(239, 68, 68, 0.3)'
            }
        };
        
        Object.assign(div.style, baseStyles, typeStyles[type]);
        
        return div;
    }

    triggerDownload(url, filename) {
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    showCalendlyWidget(form) {
        // Replace form with Calendly widget
        const calendlyContainer = document.createElement('div');
        calendlyContainer.className = 'calendar-container';
        calendlyContainer.innerHTML = `
            <p>Select a time that works for you:</p>
            <div class="calendly-inline-widget" 
                 data-url="https://calendly.com/resiliotech/strategy-call"
                 style="min-width:320px;height:630px;"></div>
        `;
        
        form.parentNode.replaceChild(calendlyContainer, form);
        
        // Load Calendly script if not already loaded
        if (!window.Calendly && !document.querySelector('script[src*="calendly"]')) {
            const script = document.createElement('script');
            script.src = 'https://assets.calendly.com/assets/external/widget.js';
            document.head.appendChild(script);
        }
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

    getDownloadUrl(modalId) {
        // In a real implementation, these would be actual download URLs
        switch (modalId) {
            case 'checklistModal': return '/assets/downloads/infrastructure-checklist.pdf';
            case 'roiModal': return '/assets/downloads/roi-report.pdf';
            default: return null;
        }
    }

    trackEvent(eventName, properties = {}) {
        // Track events for analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, properties);
        }
        
        // Also log to console in development
        if (window.location.hostname === 'localhost') {
            console.log('Analytics Event:', eventName, properties);
        }
    }

    // ROI Calculator functionality
    initializeROICalculator() {
        const roiModal = document.getElementById('roiModal');
        if (!roiModal) return;

        const inputs = roiModal.querySelectorAll('.roi-inputs input, .roi-inputs select');
        inputs.forEach(input => {
            input.addEventListener('input', () => this.calculateROI());
            input.addEventListener('change', () => this.calculateROI());
        });
    }

    calculateROI() {
        const roiModal = document.getElementById('roiModal');
        if (!roiModal) return;

        // Get input values
        const developers = parseInt(roiModal.querySelector('#developers')?.value) || 0;
        const hourlyRate = parseInt(roiModal.querySelector('#hourlyRate')?.value) || 0;
        const deploymentTime = parseInt(roiModal.querySelector('#deploymentTime')?.value) || 0;
        const downtime = parseInt(roiModal.querySelector('#downtime')?.value) || 0;

        // Calculate metrics
        const monthlyDeveloperCost = developers * hourlyRate * 160; // 160 hours per month
        const monthlyDeploymentCost = (deploymentTime * hourlyRate * 20); // 20 deployments per month
        const monthlyDowntimeCost = (downtime * hourlyRate * 4); // 4 incidents per month
        
        const totalMonthlyCost = monthlyDeveloperCost + monthlyDeploymentCost + monthlyDowntimeCost;
        
        // Automation savings (conservative estimates)
        const automationSavings = {
            deployment: monthlyDeploymentCost * 0.8, // 80% reduction in deployment time
            downtime: monthlyDowntimeCost * 0.7, // 70% reduction in downtime
            developer: monthlyDeveloperCost * 0.2 // 20% more productive time
        };
        
        const totalMonthlySavings = Object.values(automationSavings).reduce((a, b) => a + b, 0);
        const annualSavings = totalMonthlySavings * 12;
        const roi = totalMonthlySavings > 0 ? (totalMonthlySavings / 5000) * 100 : 0; // Assuming $5k monthly cost

        // Update display
        this.updateROIDisplay({
            monthlySavings: totalMonthlySavings,
            annualSavings: annualSavings,
            roi: roi,
            paybackMonths: totalMonthlySavings > 0 ? Math.ceil(5000 / totalMonthlySavings) : 0
        });
    }

    updateROIDisplay(results) {
        const roiModal = document.getElementById('roiModal');
        if (!roiModal) return;

        const formatCurrency = (amount) => 
            new Intl.NumberFormat('en-US', { 
                style: 'currency', 
                currency: 'USD',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            }).format(amount);

        // Update metric displays
        const updates = [
            { selector: '.roi-monthly .value', value: formatCurrency(results.monthlySavings) },
            { selector: '.roi-annual .value', value: formatCurrency(results.annualSavings) },
            { selector: '.roi-percentage .value', value: `${Math.round(results.roi)}%` },
            { selector: '.roi-payback .value', value: `${results.paybackMonths} months` }
        ];

        updates.forEach(update => {
            const element = roiModal.querySelector(update.selector);
            if (element) {
                element.textContent = update.value;
            }
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.leadMagnetManager = new LeadMagnetManager();
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LeadMagnetManager;
}