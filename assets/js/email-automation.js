/**
 * Email Marketing Automation for Resiliotech
 * Handles automated email sequences, newsletters, and drip campaigns
 */

class EmailAutomation {
    constructor() {
        this.config = {
            apiEndpoint: '/api/email',
            defaultSender: {
                name: 'Resiliotech Team',
                email: 'hello@resiliotech.com'
            },
            enablePersonalization: true,
            enableABTesting: true,
            debugMode: window.location.hostname === 'localhost'
        };
        
        this.sequences = this.defineEmailSequences();
        this.templates = this.defineEmailTemplates();
        
        this.init();
    }
    
    init() {
        this.log('Email Automation initializing...');
        
        // Set up sequence triggers
        this.setupSequenceTriggers();
        
        // Initialize newsletter signup handling
        this.setupNewsletterIntegration();
        
        this.log('Email Automation initialized');
    }
    
    // Email Sequence Definitions
    defineEmailSequences() {
        return {
            'welcome_new_lead': {
                name: 'Welcome New Lead',
                description: 'For first-time website visitors who sign up',
                trigger: 'lead_capture',
                emails: [
                    {
                        delay: 0, // Immediate
                        template: 'welcome_immediate',
                        subject: 'Welcome! Your DevOps automation journey starts here',
                        track_opens: true,
                        track_clicks: true
                    },
                    {
                        delay: 24 * 60 * 60 * 1000, // 1 day
                        template: 'automation_guide',
                        subject: 'The #1 mistake startups make with DevOps (and how to avoid it)',
                        track_opens: true,
                        track_clicks: true
                    },
                    {
                        delay: 3 * 24 * 60 * 60 * 1000, // 3 days
                        template: 'case_study_showcase',
                        subject: 'How TechFlow reduced deployment time by 85% (case study)',
                        track_opens: true,
                        track_clicks: true
                    },
                    {
                        delay: 7 * 24 * 60 * 60 * 1000, // 7 days
                        template: 'free_consultation_offer',
                        subject: 'Ready to automate? Book your free consultation',
                        track_opens: true,
                        track_clicks: true
                    }
                ]
            },
            
            'hot_lead_sequence': {
                name: 'Hot Lead Follow-up',
                description: 'For high-scoring leads (70+ score)',
                trigger: 'high_lead_score',
                emails: [
                    {
                        delay: 0, // Immediate
                        template: 'hot_lead_personal',
                        subject: 'I noticed you\\'re interested in DevOps automation...',
                        track_opens: true,
                        track_clicks: true,
                        personalized: true
                    },
                    {
                        delay: 60 * 60 * 1000, // 1 hour
                        template: 'roi_calculator_followup',
                        subject: 'Your automation ROI calculation + next steps',
                        track_opens: true,
                        track_clicks: true,
                        conditional: 'calculator_used'
                    },
                    {
                        delay: 24 * 60 * 60 * 1000, // 1 day
                        template: 'calendar_booking_urgent',
                        subject: 'Quick question about your DevOps setup',
                        track_opens: true,
                        track_clicks: true
                    }
                ]
            },
            
            'resource_download_followup': {
                name: 'Resource Download Follow-up',
                description: 'For users who download resources',
                trigger: 'resource_download',
                emails: [
                    {
                        delay: 0, // Immediate
                        template: 'resource_delivery',
                        subject: 'Your download is ready + bonus resources inside',
                        track_opens: true,
                        track_clicks: true
                    },
                    {
                        delay: 2 * 24 * 60 * 60 * 1000, // 2 days
                        template: 'implementation_tips',
                        subject: 'Having trouble implementing? Here\\'s help...',
                        track_opens: true,
                        track_clicks: true
                    },
                    {
                        delay: 7 * 24 * 60 * 60 * 1000, // 7 days
                        template: 'more_resources_offer',
                        subject: 'More automation resources + exclusive templates',
                        track_opens: true,
                        track_clicks: true
                    }
                ]
            },
            
            're_engagement_campaign': {
                name: 'Re-engagement Campaign',
                description: 'For inactive subscribers',
                trigger: 'inactive_subscriber',
                emails: [
                    {
                        delay: 0,
                        template: 're_engagement_offer',
                        subject: 'We miss you! Here\\'s what\\'s new in DevOps automation',
                        track_opens: true,
                        track_clicks: true
                    },
                    {
                        delay: 7 * 24 * 60 * 60 * 1000, // 7 days
                        template: 'final_chance_offer',
                        subject: 'Last chance: Exclusive automation consultation',
                        track_opens: true,
                        track_clicks: true
                    },
                    {
                        delay: 14 * 24 * 60 * 60 * 1000, // 14 days
                        template: 'unsubscribe_survey',
                        subject: 'Before you go... (2-minute survey)',
                        track_opens: true,
                        track_clicks: true
                    }
                ]
            }
        };
    }
    
    // Email Template Definitions
    defineEmailTemplates() {
        return {
            'welcome_immediate': {
                subject: 'Welcome! Your DevOps automation journey starts here',
                html: this.generateWelcomeTemplate(),
                text: this.generateWelcomeTemplateText(),
                cta_primary: {
                    text: 'Get Started with Automation',
                    url: '{{SITE_URL}}/resources/getting-started'
                },
                cta_secondary: {
                    text: 'Book Free Consultation',
                    url: '{{SITE_URL}}/contact'
                }
            },
            
            'automation_guide': {
                subject: 'The #1 mistake startups make with DevOps (and how to avoid it)',
                html: this.generateAutomationGuideTemplate(),
                text: this.generateAutomationGuideTemplateText(),
                cta_primary: {
                    text: 'Download Complete Guide',
                    url: '{{SITE_URL}}/resources/devops-mistakes-guide'
                }
            },
            
            'hot_lead_personal': {
                subject: 'I noticed you\\'re interested in DevOps automation...',
                html: this.generateHotLeadTemplate(),
                text: this.generateHotLeadTemplateText(),
                personalized: true,
                cta_primary: {
                    text: 'Schedule 15-min Call',
                    url: '{{CALENDAR_URL}}'
                }
            },
            
            'roi_calculator_followup': {
                subject: 'Your automation ROI calculation + next steps',
                html: this.generateROIFollowupTemplate(),
                text: this.generateROIFollowupTemplateText(),
                cta_primary: {
                    text: 'Discuss Implementation',
                    url: '{{SITE_URL}}/contact'
                }
            }
        };
    }
    
    // Sequence Management
    async triggerSequence(sequenceKey, leadData, options = {}) {
        const sequence = this.sequences[sequenceKey];
        if (!sequence) {
            this.log('Sequence not found:', sequenceKey);
            return;
        }
        
        this.log('Triggering sequence:', sequenceKey, 'for lead:', leadData.email);
        
        // Store sequence state
        const sequenceId = this.generateSequenceId();
        const sequenceState = {
            id: sequenceId,
            sequence_key: sequenceKey,
            lead_data: leadData,
            started_at: new Date().toISOString(),
            current_step: 0,
            completed: false,
            options: options
        };
        
        this.storeSequenceState(sequenceState);
        
        // Schedule all emails in the sequence
        for (let i = 0; i < sequence.emails.length; i++) {
            const emailConfig = sequence.emails[i];
            
            // Check conditions
            if (emailConfig.conditional && !this.checkCondition(emailConfig.conditional, leadData)) {
                continue;
            }
            
            await this.scheduleEmail(sequenceId, i, emailConfig, leadData, options);
        }
        
        // Track sequence start
        if (window.analyticsManager) {
            window.analyticsManager.trackEvent('email_sequence_started', {
                sequence: sequenceKey,
                lead_email: leadData.email,
                sequence_id: sequenceId
            });
        }
        
        return sequenceId;
    }
    
    async scheduleEmail(sequenceId, stepIndex, emailConfig, leadData, options) {
        const sendAt = new Date(Date.now() + emailConfig.delay);
        
        const emailJob = {
            id: this.generateEmailId(),
            sequence_id: sequenceId,
            step_index: stepIndex,
            template: emailConfig.template,
            lead_data: leadData,
            scheduled_for: sendAt.toISOString(),
            subject: emailConfig.subject,
            track_opens: emailConfig.track_opens,
            track_clicks: emailConfig.track_clicks,
            personalized: emailConfig.personalized,
            options: options
        };
        
        if (emailConfig.delay === 0) {
            // Send immediately
            await this.sendEmail(emailJob);
        } else {
            // Schedule for later
            this.storeScheduledEmail(emailJob);
            
            // In a real implementation, you'd use a job queue
            setTimeout(() => {
                this.sendEmail(emailJob);
            }, emailConfig.delay);
        }
    }
    
    async sendEmail(emailJob) {
        try {
            const template = this.templates[emailJob.template];
            if (!template) {
                throw new Error(`Template not found: ${emailJob.template}`);
            }
            
            const personalizedEmail = await this.personalizeEmail(template, emailJob.lead_data, emailJob.options);
            
            const emailData = {
                to: {
                    email: emailJob.lead_data.email,
                    name: emailJob.lead_data.name || emailJob.lead_data.email
                },
                from: this.config.defaultSender,
                subject: personalizedEmail.subject,
                html: personalizedEmail.html,
                text: personalizedEmail.text,
                tracking: {
                    opens: emailJob.track_opens,
                    clicks: emailJob.track_clicks,
                    sequence_id: emailJob.sequence_id,
                    step_index: emailJob.step_index
                }
            };
            
            // Send via email provider API
            const response = await this.sendViaProvider(emailData);
            
            // Track success
            this.trackEmailSent(emailJob, response);
            
            this.log('Email sent successfully:', emailJob.id);
            
        } catch (error) {
            this.log('Error sending email:', emailJob.id, error);
            this.trackEmailError(emailJob, error);
        }
    }
    
    async sendViaProvider(emailData) {
        // This would integrate with email providers like:
        // SendGrid, Mailgun, AWS SES, etc.
        
        try {
            const response = await fetch(`${this.config.apiEndpoint}/send`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.getAPIKey()}`
                },
                body: JSON.stringify(emailData)
            });
            
            if (!response.ok) {
                throw new Error(`Email provider error: ${response.status}`);
            }
            
            return await response.json();
            
        } catch (error) {
            // Fallback: store for manual processing
            this.storeFailedEmail(emailData, error);
            throw error;
        }
    }
    
    // Email Personalization
    async personalizeEmail(template, leadData, options = {}) {
        let subject = template.subject;
        let html = template.html;
        let text = template.text;
        
        // Basic placeholder replacement
        const placeholders = {
            '{{FIRST_NAME}}': leadData.name ? leadData.name.split(' ')[0] : 'there',
            '{{FULL_NAME}}': leadData.name || 'Valued Customer',
            '{{COMPANY}}': leadData.company || 'your company',
            '{{EMAIL}}': leadData.email,
            '{{SITE_URL}}': window.location.origin,
            '{{UNSUBSCRIBE_URL}}': `${window.location.origin}/unsubscribe?email=${encodeURIComponent(leadData.email)}`,
            '{{CALENDAR_URL}}': 'https://calendly.com/resiliotech/consultation'
        };
        
        // Add dynamic content based on lead data
        if (leadData.leadScore) {
            placeholders['{{LEAD_SCORE}}'] = leadData.leadScore;
        }
        
        if (leadData.source) {
            placeholders['{{SOURCE}}'] = this.getSourceDisplayName(leadData.source);
        }
        
        // Replace placeholders
        Object.entries(placeholders).forEach(([placeholder, value]) => {
            subject = subject.replace(new RegExp(placeholder, 'g'), value);
            html = html.replace(new RegExp(placeholder, 'g'), value);
            text = text.replace(new RegExp(placeholder, 'g'), value);
        });
        
        // Advanced personalization
        if (template.personalized && this.config.enablePersonalization) {
            const personalizedContent = await this.generatePersonalizedContent(leadData);
            html = this.injectPersonalizedContent(html, personalizedContent);
            text = this.injectPersonalizedContent(text, personalizedContent);
        }
        
        return { subject, html, text };
    }
    
    async generatePersonalizedContent(leadData) {
        const content = {};
        
        // Personalized recommendations based on behavior
        if (leadData.behaviors?.calculatorUsed) {
            content.roi_mention = `Based on your ROI calculation showing potential savings of $${leadData.estimatedSavings || '50,000+'}...`;
        }
        
        if (leadData.company) {
            content.company_mention = `I see you're working at ${leadData.company}`;
        }
        
        if (leadData.teamSize) {
            content.team_size_content = this.getTeamSizeContent(leadData.teamSize);
        }
        
        return content;
    }
    
    getTeamSizeContent(teamSize) {
        const content = {
            '1-5': 'As an early-stage startup, automation can help you punch above your weight...',
            '5-10': 'At your stage, implementing the right automation can prevent future scaling bottlenecks...',
            '10-50': 'With your team size, automation becomes critical for maintaining velocity...',
            '50+': 'At your scale, automation isn\\'t just beneficial—it\\'s essential for operational excellence...'
        };
        
        return content[teamSize] || content['1-5'];
    }
    
    injectPersonalizedContent(template, personalizedContent) {
        Object.entries(personalizedContent).forEach(([key, value]) => {
            const placeholder = `{{${key.toUpperCase()}}}`;
            template = template.replace(new RegExp(placeholder, 'g'), value);
        });
        
        return template;
    }
    
    // Template Generators
    generateWelcomeTemplate() {
        return `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Welcome to Resiliotech</title>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { text-align: center; margin-bottom: 30px; }
                    .logo { max-width: 200px; }
                    .content { background: #f9f9f9; padding: 30px; border-radius: 8px; }
                    .cta-button { display: inline-block; background: #6366f1; color: white; 
                                  padding: 12px 24px; text-decoration: none; border-radius: 5px; 
                                  font-weight: bold; margin: 10px 5px; }
                    .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Welcome to Resiliotech, {{FIRST_NAME}}!</h1>
                    </div>
                    
                    <div class="content">
                        <p>Thanks for joining our community of startup founders and technical leaders who are serious about scaling efficiently.</p>
                        
                        <p>I'm excited to help you transform your technical operations with automation that actually works for startups.</p>
                        
                        <p><strong>Here's what you can expect:</strong></p>
                        <ul>
                            <li>Weekly insights on DevOps automation for startups</li>
                            <li>Practical templates and tools you can implement immediately</li>
                            <li>Real case studies from companies we've helped scale</li>
                            <li>Early access to our latest automation resources</li>
                        </ul>
                        
                        <p>To get started, here are your next steps:</p>
                        
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="{{SITE_URL}}/resources/getting-started" class="cta-button">
                                Get Your Free Automation Guide
                            </a>
                            <a href="{{SITE_URL}}/contact" class="cta-button" style="background: #10b981;">
                                Book Free Consultation
                            </a>
                        </div>
                        
                        <p>Got questions? Just reply to this email—I personally read and respond to every message.</p>
                        
                        <p>Welcome aboard!</p>
                        
                        <p>Best,<br>
                        The Resiliotech Team</p>
                    </div>
                    
                    <div class="footer">
                        <p>You're receiving this because you signed up at {{SITE_URL}}</p>
                        <p><a href="{{UNSUBSCRIBE_URL}}">Unsubscribe</a></p>
                    </div>
                </div>
            </body>
            </html>
        `;
    }
    
    generateWelcomeTemplateText() {
        return `
Welcome to Resiliotech, {{FIRST_NAME}}!

Thanks for joining our community of startup founders and technical leaders who are serious about scaling efficiently.

I'm excited to help you transform your technical operations with automation that actually works for startups.

Here's what you can expect:
• Weekly insights on DevOps automation for startups
• Practical templates and tools you can implement immediately  
• Real case studies from companies we've helped scale
• Early access to our latest automation resources

To get started:
→ Get Your Free Automation Guide: {{SITE_URL}}/resources/getting-started
→ Book Free Consultation: {{SITE_URL}}/contact

Got questions? Just reply to this email—I personally read and respond to every message.

Welcome aboard!

Best,
The Resiliotech Team

---
You're receiving this because you signed up at {{SITE_URL}}
Unsubscribe: {{UNSUBSCRIBE_URL}}
        `;
    }
    
    generateHotLeadTemplate() {
        return `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Let's discuss your automation needs</title>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .content { background: #f9f9f9; padding: 30px; border-radius: 8px; }
                    .cta-button { display: inline-block; background: #6366f1; color: white; 
                                  padding: 15px 30px; text-decoration: none; border-radius: 5px; 
                                  font-weight: bold; margin: 20px 0; }
                    .highlight { background: #fff3cd; padding: 15px; border-radius: 5px; 
                                border-left: 4px solid #ffc107; margin: 20px 0; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="content">
                        <p>Hi {{FIRST_NAME}},</p>
                        
                        <p>{{COMPANY_MENTION}}, and I noticed you've been exploring DevOps automation solutions on our site.</p>
                        
                        <div class="highlight">
                            <p><strong>{{ROI_MENTION}}</strong></p>
                        </div>
                        
                        <p>{{TEAM_SIZE_CONTENT}}</p>
                        
                        <p>I'd love to chat about your specific automation challenges and show you exactly how we could help {{COMPANY}} scale more efficiently.</p>
                        
                        <p><strong>How about a quick 15-minute call this week?</strong></p>
                        
                        <p>I can share:</p>
                        <ul>
                            <li>Specific automation strategies for companies like yours</li>
                            <li>A custom automation roadmap</li>
                            <li>ROI projections based on your current setup</li>
                        </ul>
                        
                        <div style="text-align: center;">
                            <a href="{{CALENDAR_URL}}" class="cta-button">
                                Schedule 15-minute Call
                            </a>
                        </div>
                        
                        <p>No pressure, no sales pitch—just a genuine conversation about how automation can help your team move faster.</p>
                        
                        <p>Best,<br>
                        Resiliotech Team</p>
                        
                        <p><em>P.S. If you're not ready for a call, feel free to reply with your biggest DevOps challenge—I'll send you some specific resources.</em></p>
                    </div>
                </div>
            </body>
            </html>
        `;
    }
    
    // Utility Methods
    setupSequenceTriggers() {
        // Listen for CRM integration events
        document.addEventListener('leadCaptured', (event) => {
            const leadData = event.detail;
            this.handleLeadCaptured(leadData);
        });
        
        // Listen for behavior events
        document.addEventListener('behaviorTracked', (event) => {
            const { behavior, leadData } = event.detail;
            this.handleBehaviorTrigger(behavior, leadData);
        });
    }
    
    setupNewsletterIntegration() {
        // Integrate with existing newsletter forms
        document.querySelectorAll('[data-newsletter-signup]').forEach(form => {
            form.addEventListener('submit', (e) => {
                const formData = new FormData(form);
                const leadData = {
                    email: formData.get('email'),
                    name: formData.get('name'),
                    source: 'newsletter'
                };
                
                this.triggerSequence('welcome_new_lead', leadData);
            });
        });
    }
    
    handleLeadCaptured(leadData) {
        const leadScore = leadData.leadScore || 0;
        
        if (leadScore >= 70) {
            this.triggerSequence('hot_lead_sequence', leadData);
        } else if (leadData.source === 'resource-download') {
            this.triggerSequence('resource_download_followup', leadData);
        } else {
            this.triggerSequence('welcome_new_lead', leadData);
        }
    }
    
    handleBehaviorTrigger(behavior, leadData) {
        switch (behavior) {
            case 'calculator_used':
                if (leadData.leadScore >= 70) {
                    // Hot lead who used calculator gets special treatment
                    this.triggerSequence('hot_lead_sequence', leadData, { calculator_used: true });
                }
                break;
                
            case 'inactive_30_days':
                this.triggerSequence('re_engagement_campaign', leadData);
                break;
        }
    }
    
    checkCondition(condition, leadData) {
        switch (condition) {
            case 'calculator_used':
                return leadData.behaviors?.calculatorUsed === true;
            case 'high_engagement':
                return leadData.pageViews > 5 || leadData.timeOnSite > 300000; // 5+ minutes
            default:
                return true;
        }
    }
    
    // Storage Methods
    storeSequenceState(sequenceState) {
        let sequences = JSON.parse(localStorage.getItem('email_sequences') || '[]');
        sequences.push(sequenceState);
        localStorage.setItem('email_sequences', JSON.stringify(sequences));
    }
    
    storeScheduledEmail(emailJob) {
        let scheduledEmails = JSON.parse(localStorage.getItem('scheduled_emails') || '[]');
        scheduledEmails.push(emailJob);
        localStorage.setItem('scheduled_emails', JSON.stringify(scheduledEmails));
    }
    
    storeFailedEmail(emailData, error) {
        let failedEmails = JSON.parse(localStorage.getItem('failed_emails') || '[]');
        failedEmails.push({
            ...emailData,
            error: error.message,
            failed_at: new Date().toISOString()
        });
        localStorage.setItem('failed_emails', JSON.stringify(failedEmails));
    }
    
    // Tracking Methods
    trackEmailSent(emailJob, response) {
        if (window.analyticsManager) {
            window.analyticsManager.trackEvent('email_sent', {
                template: emailJob.template,
                sequence_id: emailJob.sequence_id,
                step_index: emailJob.step_index,
                recipient: emailJob.lead_data.email
            });
        }
    }
    
    trackEmailError(emailJob, error) {
        if (window.analyticsManager) {
            window.analyticsManager.trackEvent('email_error', {
                template: emailJob.template,
                sequence_id: emailJob.sequence_id,
                error: error.message
            });
        }
    }
    
    // Utility Methods
    generateSequenceId() {
        return 'seq_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    generateEmailId() {
        return 'email_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    getAPIKey() {
        // In a real implementation, this would be stored securely
        return process.env.EMAIL_PROVIDER_API_KEY || 'demo-key';
    }
    
    getSourceDisplayName(source) {
        const sourceNames = {
            'hero-cta': 'Homepage Hero',
            'roi-calculator': 'ROI Calculator',
            'case-study': 'Case Study',
            'resource-download': 'Resource Download',
            'blog-signup': 'Blog Signup',
            'contact-form': 'Contact Form'
        };
        
        return sourceNames[source] || source;
    }
    
    log(...args) {
        if (this.config.debugMode) {
            console.log('[Email Automation]', ...args);
        }
    }
}

// Initialize email automation when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.emailAutomation = new EmailAutomation();
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EmailAutomation;
}