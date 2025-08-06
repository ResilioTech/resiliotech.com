/**
 * Customer Success Tracking and Testimonial Collection System for Resiliotech
 * Tracks customer journey, success metrics, and automates testimonial collection
 */

class CustomerSuccessTracker {
    constructor() {
        this.config = {
            apiEndpoint: '/api/customer-success',
            enableAutomatedOutreach: true,
            enableSuccessTracking: true,
            enableTestimonialCollection: true,
            testimonialTriggers: {
                positive_milestone: true,
                project_completion: true,
                high_satisfaction: true,
                renewal_success: true
            },
            debugMode: window.location.hostname === 'localhost'
        };
        
        this.customerJourneyStages = {
            'lead': { order: 1, name: 'Lead' },
            'prospect': { order: 2, name: 'Prospect' },
            'customer': { order: 3, name: 'Customer' },
            'success': { order: 4, name: 'Success' },
            'advocate': { order: 5, name: 'Advocate' },
            'champion': { order: 6, name: 'Champion' }
        };
        
        this.successMetrics = {};
        this.testimonials = [];
        
        this.init();
    }
    
    init() {
        this.log('Customer Success Tracker initializing...');
        
        // Initialize tracking systems
        this.initializeSuccessTracking();
        this.initializeTestimonialCollection();
        this.initializeAutomatedOutreach();
        
        // Set up UI components
        this.setupTestimonialForms();
        this.setupSuccessTracking();
        
        // Load existing data
        this.loadExistingData();
        
        this.log('Customer Success Tracker initialized');
    }
    
    // Success Tracking
    initializeSuccessTracking() {
        // Track key success events
        this.trackImplementationMilestones();
        this.trackUsageMetrics();
        this.trackSatisfactionScores();
        this.trackBusinessImpact();
    }
    
    trackImplementationMilestones() {
        const milestones = [
            'project_kickoff',
            'infrastructure_setup',
            'cicd_implementation',
            'monitoring_deployment',
            'team_training',
            'project_completion',
            'go_live',
            'optimization_phase'
        ];
        
        milestones.forEach(milestone => {
            document.addEventListener(`milestone_${milestone}`, (event) => {
                this.recordMilestone(event.detail.customerId, milestone, event.detail.data);
            });
        });
    }
    
    recordMilestone(customerId, milestone, data = {}) {
        const milestoneRecord = {
            id: this.generateMilestoneId(),
            customer_id: customerId,
            milestone: milestone,
            achieved_at: new Date().toISOString(),
            data: data,
            satisfaction_score: data.satisfaction_score,
            notes: data.notes
        };
        
        // Store milestone
        this.storeMilestone(milestoneRecord);
        
        // Check for testimonial triggers
        this.checkTestimonialTriggers(customerId, milestone, milestoneRecord);
        
        // Update customer journey stage
        this.updateCustomerStage(customerId, milestone);
        
        // Track analytics
        if (window.analyticsManager) {
            window.analyticsManager.trackEvent('customer_milestone', {
                customer_id: customerId,
                milestone: milestone,
                satisfaction_score: data.satisfaction_score
            });
        }
        
        this.log('Milestone recorded:', milestone, 'for customer:', customerId);
    }
    
    updateCustomerStage(customerId, milestone) {
        let newStage = this.getCustomerStage(customerId);
        
        // Determine new stage based on milestone
        switch (milestone) {
            case 'project_kickoff':
                newStage = 'customer';
                break;
            case 'project_completion':
                newStage = 'success';
                break;
            case 'testimonial_provided':
                newStage = 'advocate';
                break;
            case 'referral_provided':
                newStage = 'champion';
                break;
        }
        
        this.setCustomerStage(customerId, newStage);
    }
    
    trackUsageMetrics() {
        // Track how customers are using implemented solutions
        const usageEvents = [
            'deployment_frequency',
            'incident_reduction',
            'performance_improvement',
            'cost_savings',
            'team_productivity'
        ];
        
        usageEvents.forEach(event => {
            document.addEventListener(`usage_${event}`, (e) => {
                this.recordUsageMetric(e.detail.customerId, event, e.detail.value, e.detail.data);
            });
        });
    }
    
    recordUsageMetric(customerId, metric, value, data = {}) {
        const usageRecord = {
            id: this.generateUsageId(),
            customer_id: customerId,
            metric: metric,
            value: value,
            recorded_at: new Date().toISOString(),
            data: data
        };
        
        this.storeUsageMetric(usageRecord);
        
        // Check for testimonial triggers based on positive metrics
        if (this.isPositiveMetric(metric, value)) {
            this.checkTestimonialTriggers(customerId, 'positive_metric', usageRecord);
        }
        
        this.log('Usage metric recorded:', metric, value, 'for customer:', customerId);
    }
    
    isPositiveMetric(metric, value) {
        const positiveThresholds = {
            'deployment_frequency': 5, // 5+ deployments per day
            'incident_reduction': 50, // 50%+ reduction
            'performance_improvement': 25, // 25%+ improvement
            'cost_savings': 20, // 20%+ cost savings
            'team_productivity': 30 // 30%+ productivity gain
        };
        
        return value >= (positiveThresholds[metric] || 0);
    }
    
    // Testimonial Collection System
    initializeTestimonialCollection() {
        this.testimonialTemplates = this.defineTestimonialTemplates();
        this.testimonialTriggerRules = this.defineTestimonialTriggerRules();
    }
    
    defineTestimonialTemplates() {
        return {
            'milestone_completion': {
                subject: 'How was your automation implementation experience?',
                message: `Hi {{CUSTOMER_NAME}},

Congratulations on completing {{MILESTONE_NAME}}! We're thrilled to have been part of your automation journey.

Would you mind sharing a quick testimonial about your experience? It would mean the world to us and help other startups learn about the benefits of DevOps automation.

We're particularly interested in:
• What challenges were you facing before?
• How has the automation impacted your team?
• What results have you seen so far?

It should only take 2-3 minutes, and we'll make sure to highlight your company's success story.`,
                cta: 'Share Your Experience',
                timing: 'immediate'
            },
            
            'positive_results': {
                subject: 'Your amazing results deserve recognition!',
                message: `Hi {{CUSTOMER_NAME}},

We noticed that {{COMPANY}} has achieved incredible results with the automation implementation:

{{RESULTS_SUMMARY}}

These results are fantastic! Would you be willing to share your success story with other startups who could benefit from similar automation?

A short testimonial from you could help other founders understand the real impact of DevOps automation.`,
                cta: 'Share Success Story',
                timing: 'immediate'
            },
            
            'satisfaction_followup': {
                subject: 'Thanks for the great feedback!',
                message: `Hi {{CUSTOMER_NAME}},

Thank you for rating your experience with us so highly! It's feedback like yours that motivates our team to keep delivering excellent service.

Since you're happy with the results, would you consider sharing a brief testimonial? It would help other startups discover how automation can transform their operations.

We can keep it short and simple - just a few sentences about your experience and results.`,
                cta: 'Provide Testimonial',
                timing: 'delayed' // 24 hours after satisfaction survey
            }
        };
    }
    
    defineTestimonialTriggerRules() {
        return {
            'project_completion': {
                condition: (milestone, data) => milestone === 'project_completion',
                template: 'milestone_completion',
                delay: 24 * 60 * 60 * 1000, // 24 hours
                probability: 0.8
            },
            
            'positive_milestone': {
                condition: (milestone, data) => data.satisfaction_score >= 8,
                template: 'positive_results',
                delay: 2 * 60 * 60 * 1000, // 2 hours
                probability: 0.9
            },
            
            'high_satisfaction': {
                condition: (milestone, data) => data.satisfaction_score >= 9,
                template: 'satisfaction_followup',
                delay: 24 * 60 * 60 * 1000, // 24 hours
                probability: 0.95
            },
            
            'significant_results': {
                condition: (milestone, data) => {
                    return data.cost_savings > 50 || data.performance_improvement > 40;
                },
                template: 'positive_results',
                delay: 0, // Immediate
                probability: 1.0
            }
        };
    }
    
    checkTestimonialTriggers(customerId, event, data) {
        if (!this.config.enableTestimonialCollection) return;
        
        Object.entries(this.testimonialTriggerRules).forEach(([trigger, rule]) => {
            if (rule.condition(event, data) && Math.random() <= rule.probability) {
                this.scheduleTestimonialRequest(customerId, trigger, rule, data);
            }
        });
    }
    
    scheduleTestimonialRequest(customerId, trigger, rule, data) {
        const request = {
            id: this.generateRequestId(),
            customer_id: customerId,
            trigger: trigger,
            template: rule.template,
            scheduled_for: new Date(Date.now() + rule.delay).toISOString(),
            data: data,
            status: 'scheduled'
        };
        
        this.storeTestimonialRequest(request);
        
        // Schedule the actual request
        setTimeout(() => {
            this.sendTestimonialRequest(request);
        }, rule.delay);
        
        this.log('Testimonial request scheduled:', trigger, 'for customer:', customerId);
    }
    
    async sendTestimonialRequest(request) {
        try {
            const customer = this.getCustomerData(request.customer_id);
            const template = this.testimonialTemplates[request.template];
            
            const personalizedMessage = this.personalizeTestimonialRequest(template, customer, request.data);
            
            // Send via email (integrate with email system)
            if (window.emailAutomation) {
                await this.sendTestimonialEmail(customer, personalizedMessage);
            }
            
            // Create testimonial collection form
            const testimonialUrl = this.createTestimonialForm(request);
            
            // Update request status
            request.status = 'sent';
            request.sent_at = new Date().toISOString();
            request.testimonial_url = testimonialUrl;
            
            this.updateTestimonialRequest(request);
            
            this.log('Testimonial request sent to:', customer.email);
            
        } catch (error) {
            this.log('Error sending testimonial request:', error);
            request.status = 'failed';
            request.error = error.message;
            this.updateTestimonialRequest(request);
        }
    }
    
    personalizeTestimonialRequest(template, customer, data) {
        let message = template.message;
        let subject = template.subject;
        
        // Basic personalization
        const replacements = {
            '{{CUSTOMER_NAME}}': customer.name || 'there',
            '{{COMPANY}}': customer.company || 'your company',
            '{{MILESTONE_NAME}}': data.milestone || 'your milestone',
            '{{RESULTS_SUMMARY}}': this.formatResultsSummary(data)
        };
        
        Object.entries(replacements).forEach(([placeholder, value]) => {
            message = message.replace(new RegExp(placeholder, 'g'), value);
            subject = subject.replace(new RegExp(placeholder, 'g'), value);
        });
        
        return {
            subject,
            message,
            cta: template.cta
        };
    }
    
    formatResultsSummary(data) {
        const results = [];
        
        if (data.cost_savings) {
            results.push(`${data.cost_savings}% cost savings`);
        }
        if (data.performance_improvement) {
            results.push(`${data.performance_improvement}% performance improvement`);
        }
        if (data.deployment_frequency) {
            results.push(`${data.deployment_frequency}x faster deployments`);
        }
        if (data.incident_reduction) {
            results.push(`${data.incident_reduction}% fewer incidents`);
        }
        
        return results.length > 0 ? 
            `• ${results.join('\n• ')}` : 
            'Significant improvements in your DevOps processes';
    }
    
    createTestimonialForm(request) {
        const formId = this.generateFormId();
        const formUrl = `${window.location.origin}/testimonial?id=${formId}`;
        
        // Store form configuration
        const formConfig = {
            id: formId,
            request_id: request.id,
            customer_id: request.customer_id,
            created_at: new Date().toISOString(),
            expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
            questions: this.getTestimonialQuestions(request.trigger),
            status: 'active'
        };
        
        this.storeTestimonialForm(formConfig);
        
        return formUrl;
    }
    
    getTestimonialQuestions(trigger) {
        const baseQuestions = [
            {
                id: 'overall_experience',
                type: 'rating',
                question: 'How would you rate your overall experience with Resiliotech?',
                scale: { min: 1, max: 10, labels: ['Poor', 'Excellent'] },
                required: true
            },
            {
                id: 'main_challenges',
                type: 'textarea',
                question: 'What were your main challenges before implementing DevOps automation?',
                placeholder: 'Describe the problems you were facing...',
                required: true
            },
            {
                id: 'results_achieved',
                type: 'textarea',
                question: 'What results have you achieved since the implementation?',
                placeholder: 'Share specific improvements, metrics, or outcomes...',
                required: true
            },
            {
                id: 'testimonial_text',
                type: 'textarea',
                question: 'Would you share a testimonial about your experience?',
                placeholder: 'A few sentences about your experience and results...',
                required: true
            },
            {
                id: 'recommendation',
                type: 'rating',
                question: 'How likely are you to recommend Resiliotech to other startups?',
                scale: { min: 0, max: 10, labels: ['Not likely', 'Extremely likely'] },
                required: true
            }
        ];
        
        // Add trigger-specific questions
        const triggerQuestions = {
            'project_completion': [
                {
                    id: 'implementation_timeline',
                    type: 'text',
                    question: 'How did the implementation timeline compare to your expectations?',
                    required: false
                }
            ],
            'positive_results': [
                {
                    id: 'specific_metrics',
                    type: 'textarea',
                    question: 'Can you share specific metrics or numbers that demonstrate the impact?',
                    placeholder: 'e.g., "50% faster deployments, 30% cost reduction..."',
                    required: false
                }
            ]
        };
        
        return baseQuestions.concat(triggerQuestions[trigger] || []);
    }
    
    // Testimonial Form UI
    setupTestimonialForms() {
        // Check if we're on a testimonial page
        const urlParams = new URLSearchParams(window.location.search);
        const formId = urlParams.get('id');
        
        if (formId && window.location.pathname.includes('/testimonial')) {
            this.renderTestimonialForm(formId);
        }
    }
    
    renderTestimonialForm(formId) {
        const formConfig = this.getTestimonialForm(formId);
        
        if (!formConfig || formConfig.status !== 'active') {
            this.showFormNotFound();
            return;
        }
        
        // Check expiration
        if (new Date() > new Date(formConfig.expires_at)) {
            this.showFormExpired();
            return;
        }
        
        const formHTML = this.generateTestimonialFormHTML(formConfig);
        const container = document.getElementById('testimonial-form-container');
        
        if (container) {
            container.innerHTML = formHTML;
            this.attachFormHandlers(formConfig);
        }
    }
    
    generateTestimonialFormHTML(formConfig) {
        const customer = this.getCustomerData(formConfig.customer_id);
        
        return `
            <div class="testimonial-form-wrapper">
                <div class="form-header">
                    <h1>Share Your Experience</h1>
                    <p>Help other startups learn about the benefits of DevOps automation</p>
                </div>
                
                <form id="testimonial-form" class="testimonial-form">
                    ${formConfig.questions.map((question, index) => 
                        this.generateQuestionHTML(question, index)
                    ).join('')}
                    
                    <div class="form-section">
                        <h3>Permission to Use</h3>
                        <label class="checkbox-label">
                            <input type="checkbox" name="permission_website" checked>
                            You may use my testimonial on your website
                        </label>
                        <label class="checkbox-label">
                            <input type="checkbox" name="permission_marketing" checked>
                            You may use my testimonial in marketing materials
                        </label>
                        <label class="checkbox-label">
                            <input type="checkbox" name="permission_social">
                            You may share my testimonial on social media
                        </label>
                    </div>
                    
                    <div class="form-section">
                        <h3>Contact Information (Optional)</h3>
                        <input type="text" name="contact_name" placeholder="Your name" value="${customer.name || ''}">
                        <input type="text" name="contact_title" placeholder="Your job title" value="${customer.jobTitle || ''}">
                        <input type="text" name="contact_company" placeholder="Company name" value="${customer.company || ''}">
                        <input type="email" name="contact_email" placeholder="Email address" value="${customer.email || ''}">
                    </div>
                    
                    <button type="submit" class="btn btn-primary submit-testimonial">
                        Submit Testimonial
                    </button>
                </form>
            </div>
            
            <style>
                .testimonial-form-wrapper {
                    max-width: 800px;
                    margin: 0 auto;
                    padding: 40px 20px;
                    font-family: Arial, sans-serif;
                }
                
                .form-header {
                    text-align: center;
                    margin-bottom: 40px;
                }
                
                .form-header h1 {
                    color: #1f2937;
                    margin-bottom: 10px;
                }
                
                .form-header p {
                    color: #6b7280;
                    font-size: 18px;
                }
                
                .form-section {
                    background: #f9fafb;
                    padding: 30px;
                    border-radius: 8px;
                    margin-bottom: 30px;
                }
                
                .form-section h3 {
                    margin: 0 0 20px 0;
                    color: #1f2937;
                }
                
                .question {
                    margin-bottom: 30px;
                }
                
                .question-label {
                    display: block;
                    font-weight: bold;
                    margin-bottom: 10px;
                    color: #374151;
                }
                
                .question-required {
                    color: #ef4444;
                }
                
                input[type="text"],
                input[type="email"],
                textarea,
                select {
                    width: 100%;
                    padding: 12px;
                    border: 1px solid #d1d5db;
                    border-radius: 6px;
                    font-size: 16px;
                    font-family: inherit;
                }
                
                textarea {
                    min-height: 120px;
                    resize: vertical;
                }
                
                .rating-scale {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    margin: 15px 0;
                }
                
                .rating-input {
                    display: flex;
                    gap: 8px;
                }
                
                .rating-input input[type="radio"] {
                    width: auto;
                }
                
                .rating-labels {
                    display: flex;
                    justify-content: space-between;
                    font-size: 14px;
                    color: #6b7280;
                    margin-top: 5px;
                }
                
                .checkbox-label {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    margin-bottom: 15px;
                    cursor: pointer;
                }
                
                .checkbox-label input[type="checkbox"] {
                    width: auto;
                }
                
                .submit-testimonial {
                    background: #6366f1;
                    color: white;
                    border: none;
                    padding: 15px 30px;
                    border-radius: 6px;
                    font-size: 18px;
                    font-weight: bold;
                    cursor: pointer;
                    width: 100%;
                }
                
                .submit-testimonial:hover {
                    background: #5145cd;
                }
                
                .submit-testimonial:disabled {
                    background: #9ca3af;
                    cursor: not-allowed;
                }
            </style>
        `;
    }
    
    generateQuestionHTML(question, index) {
        const requiredMark = question.required ? '<span class="question-required">*</span>' : '';
        
        let inputHTML = '';
        
        switch (question.type) {
            case 'text':
                inputHTML = `<input type="text" name="q_${question.id}" ${question.required ? 'required' : ''} placeholder="${question.placeholder || ''}">`;
                break;
                
            case 'textarea':
                inputHTML = `<textarea name="q_${question.id}" ${question.required ? 'required' : ''} placeholder="${question.placeholder || ''}"></textarea>`;
                break;
                
            case 'rating':
                const scale = question.scale;
                const options = [];
                for (let i = scale.min; i <= scale.max; i++) {
                    options.push(`<input type="radio" name="q_${question.id}" value="${i}" ${question.required ? 'required' : ''}> ${i}`);
                }
                inputHTML = `
                    <div class="rating-input">
                        ${options.join('')}
                    </div>
                    <div class="rating-labels">
                        <span>${scale.labels[0]}</span>
                        <span>${scale.labels[1]}</span>
                    </div>
                `;
                break;
        }
        
        return `
            <div class="form-section">
                <div class="question">
                    <label class="question-label">
                        ${question.question} ${requiredMark}
                    </label>
                    ${inputHTML}
                </div>
            </div>
        `;
    }
    
    attachFormHandlers(formConfig) {
        const form = document.getElementById('testimonial-form');
        
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleTestimonialSubmission(formConfig, form);
        });
    }
    
    async handleTestimonialSubmission(formConfig, form) {
        const submitButton = form.querySelector('.submit-testimonial');
        submitButton.disabled = true;
        submitButton.textContent = 'Submitting...';
        
        try {
            const formData = new FormData(form);
            const testimonialData = this.extractTestimonialData(formData, formConfig);
            
            // Save testimonial
            await this.saveTestimonial(testimonialData);
            
            // Show success message
            this.showTestimonialSuccess();
            
            // Track submission
            if (window.analyticsManager) {
                window.analyticsManager.trackEvent('testimonial_submitted', {
                    customer_id: formConfig.customer_id,
                    form_id: formConfig.id
                });
            }
            
            this.log('Testimonial submitted successfully');
            
        } catch (error) {
            this.log('Error submitting testimonial:', error);
            this.showTestimonialError();
            
            submitButton.disabled = false;
            submitButton.textContent = 'Submit Testimonial';
        }
    }
    
    extractTestimonialData(formData, formConfig) {
        const responses = {};
        
        // Extract question responses
        formConfig.questions.forEach(question => {
            const value = formData.get(`q_${question.id}`);
            if (value) {
                responses[question.id] = value;
            }
        });
        
        return {
            id: this.generateTestimonialId(),
            form_id: formConfig.id,
            request_id: formConfig.request_id,
            customer_id: formConfig.customer_id,
            responses: responses,
            permissions: {
                website: formData.get('permission_website') === 'on',
                marketing: formData.get('permission_marketing') === 'on',
                social: formData.get('permission_social') === 'on'
            },
            contact: {
                name: formData.get('contact_name'),
                title: formData.get('contact_title'),
                company: formData.get('contact_company'),
                email: formData.get('contact_email')
            },
            submitted_at: new Date().toISOString(),
            status: 'pending_review'
        };
    }
    
    async saveTestimonial(testimonialData) {
        // Store locally
        this.storeTestimonial(testimonialData);
        
        // Send to API
        try {
            const response = await fetch(`${this.config.apiEndpoint}/testimonials`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(testimonialData)
            });
            
            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }
            
            return await response.json();
            
        } catch (error) {
            this.log('Error sending testimonial to API:', error);
            // Mark for retry
            testimonialData.needs_sync = true;
            this.storeTestimonial(testimonialData);
            throw error;
        }
    }
    
    showTestimonialSuccess() {
        const container = document.querySelector('.testimonial-form-wrapper');
        container.innerHTML = `
            <div class="success-message">
                <div class="success-icon">✓</div>
                <h2>Thank You!</h2>
                <p>Your testimonial has been submitted successfully. We appreciate you taking the time to share your experience!</p>
                <p>If you have any questions, feel free to <a href="/contact">contact us</a>.</p>
            </div>
            
            <style>
                .success-message {
                    text-align: center;
                    padding: 60px 20px;
                }
                
                .success-icon {
                    font-size: 72px;
                    color: #10b981;
                    margin-bottom: 20px;
                }
                
                .success-message h2 {
                    color: #1f2937;
                    margin-bottom: 15px;
                }
                
                .success-message p {
                    color: #6b7280;
                    font-size: 18px;
                    line-height: 1.6;
                    margin-bottom: 15px;
                }
                
                .success-message a {
                    color: #6366f1;
                    text-decoration: none;
                }
            </style>
        `;
    }
    
    showTestimonialError() {
        alert('There was an error submitting your testimonial. Please try again or contact us directly.');
    }
    
    showFormNotFound() {
        document.getElementById('testimonial-form-container').innerHTML = `
            <div class="error-message">
                <h2>Form Not Found</h2>
                <p>The testimonial form you're looking for doesn't exist or has been removed.</p>
                <a href="/">Return to Homepage</a>
            </div>
        `;
    }
    
    showFormExpired() {
        document.getElementById('testimonial-form-container').innerHTML = `
            <div class="error-message">
                <h2>Form Expired</h2>
                <p>This testimonial form has expired. Please contact us if you'd still like to provide feedback.</p>
                <a href="/contact">Contact Us</a>
            </div>
        `;
    }
    
    // Data Storage Methods
    storeMilestone(milestone) {
        let milestones = JSON.parse(localStorage.getItem('customer_milestones') || '[]');
        milestones.push(milestone);
        localStorage.setItem('customer_milestones', JSON.stringify(milestones));
    }
    
    storeUsageMetric(metric) {
        let metrics = JSON.parse(localStorage.getItem('usage_metrics') || '[]');
        metrics.push(metric);
        localStorage.setItem('usage_metrics', JSON.stringify(metrics));
    }
    
    storeTestimonialRequest(request) {
        let requests = JSON.parse(localStorage.getItem('testimonial_requests') || '[]');
        requests.push(request);
        localStorage.setItem('testimonial_requests', JSON.stringify(requests));
    }
    
    updateTestimonialRequest(request) {
        let requests = JSON.parse(localStorage.getItem('testimonial_requests') || '[]');
        const index = requests.findIndex(r => r.id === request.id);
        if (index >= 0) {
            requests[index] = request;
            localStorage.setItem('testimonial_requests', JSON.stringify(requests));
        }
    }
    
    storeTestimonialForm(form) {
        let forms = JSON.parse(localStorage.getItem('testimonial_forms') || '[]');
        forms.push(form);
        localStorage.setItem('testimonial_forms', JSON.stringify(forms));
    }
    
    getTestimonialForm(formId) {
        const forms = JSON.parse(localStorage.getItem('testimonial_forms') || '[]');
        return forms.find(f => f.id === formId);
    }
    
    storeTestimonial(testimonial) {
        let testimonials = JSON.parse(localStorage.getItem('testimonials') || '[]');
        testimonials.push(testimonial);
        localStorage.setItem('testimonials', JSON.stringify(testimonials));
    }
    
    // Customer Data Methods
    getCustomerStage(customerId) {
        const customers = JSON.parse(localStorage.getItem('customers') || '{}');
        return customers[customerId]?.stage || 'lead';
    }
    
    setCustomerStage(customerId, stage) {
        let customers = JSON.parse(localStorage.getItem('customers') || '{}');
        if (!customers[customerId]) {
            customers[customerId] = {};
        }
        customers[customerId].stage = stage;
        customers[customerId].updated_at = new Date().toISOString();
        localStorage.setItem('customers', JSON.stringify(customers));
    }
    
    getCustomerData(customerId) {
        const customers = JSON.parse(localStorage.getItem('customers') || '{}');
        return customers[customerId] || { id: customerId };
    }
    
    // Utility Methods
    loadExistingData() {
        // Load existing testimonials, customers, etc.
        this.testimonials = JSON.parse(localStorage.getItem('testimonials') || '[]');
        this.successMetrics = JSON.parse(localStorage.getItem('success_metrics') || '{}');
    }
    
    generateMilestoneId() {
        return 'milestone_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    generateUsageId() {
        return 'usage_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    generateRequestId() {
        return 'req_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    generateFormId() {
        return 'form_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    generateTestimonialId() {
        return 'testimonial_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    async sendTestimonialEmail(customer, personalizedMessage) {
        // This would integrate with the email automation system
        if (window.emailAutomation) {
            const emailData = {
                to: customer.email,
                subject: personalizedMessage.subject,
                message: personalizedMessage.message,
                cta: personalizedMessage.cta,
                template: 'testimonial_request'
            };
            
            // Use existing email system
            return window.emailAutomation.sendEmail(emailData);
        }
    }
    
    log(...args) {
        if (this.config.debugMode) {
            console.log('[Customer Success Tracker]', ...args);
        }
    }
}

// Initialize customer success tracker when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.customerSuccessTracker = new CustomerSuccessTracker();
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CustomerSuccessTracker;
}