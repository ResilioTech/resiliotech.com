/**
 * Advanced Lead Scoring & CRM Integration System
 * Implements behavioral scoring, qualification workflows, and CRM synchronization
 */

class LeadScoringSystem {
    constructor() {
        this.leadData = this.initializeLeadData();
        this.scoringRules = this.initializeScoringRules();
        this.behaviorTracking = new BehaviorTracker();
        this.crmIntegration = new CRMIntegration();
        this.qualificationWorkflows = new QualificationWorkflows();
        
        // Configuration
        this.config = {
            enableScoring: true,
            enableCrmSync: true,
            enableBehaviorTracking: true,
            scoreThresholds: {
                cold: 0,
                warm: 30,
                hot: 60,
                qualified: 80
            },
            syncInterval: 300000, // 5 minutes
            sessionTimeout: 1800000, // 30 minutes
            maxSessionEvents: 100
        };
        
        // Initialize session
        this.sessionId = this.generateSessionId();
        this.sessionEvents = [];
        this.sessionStartTime = Date.now();
        
        this.init();
    }

    init() {
        this.behaviorTracking.init();
        this.setupEventListeners();
        this.startScoreCalculation();
        this.schedulePeriodicSync();
        
        // Track page view for lead scoring
        this.trackBehavior('page_view', {
            page: window.location.pathname,
            referrer: document.referrer,
            timestamp: Date.now()
        });
        
        console.log('Lead Scoring System initialized');
    }

    initializeLeadData() {
        const stored = localStorage.getItem('resiliotech_lead_data');
        if (stored) {
            try {
                const data = JSON.parse(stored);
                // Validate and migrate data if needed
                return this.validateLeadData(data);
            } catch (error) {
                console.warn('Invalid stored lead data, initializing fresh');
            }
        }
        
        return {
            id: this.generateLeadId(),
            email: null,
            name: null,
            company: null,
            role: null,
            phone: null,
            source: this.getTrafficSource(),
            firstVisit: Date.now(),
            lastActivity: Date.now(),
            totalSessions: 1,
            totalPageViews: 0,
            totalTimeSpent: 0,
            score: 0,
            stage: 'visitor',
            behaviors: [],
            interactions: [],
            formSubmissions: [],
            emailEngagement: {
                opens: 0,
                clicks: 0,
                lastOpen: null,
                lastClick: null
            },
            preferences: {},
            tags: [],
            notes: [],
            qualification: {
                budget: null,
                authority: null,
                need: null,
                timeline: null,
                fit: null
            },
            crmSyncStatus: {
                lastSync: null,
                status: 'pending',
                crmId: null,
                errors: []
            }
        };
    }

    initializeScoringRules() {
        return {
            // Demographic scoring
            demographic: {
                email_domain: {
                    gmail: 5,
                    yahoo: 5,
                    hotmail: 5,
                    corporate: 15,
                    startup_domains: 20
                },
                role: {
                    founder: 25,
                    ceo: 25,
                    cto: 20,
                    'vp-engineering': 20,
                    'engineering-manager': 15,
                    developer: 10,
                    other: 5
                },
                company_size: {
                    '1-10': 20,
                    '11-50': 25,
                    '51-200': 15,
                    '201+': 10
                }
            },
            
            // Behavioral scoring
            behavioral: {
                page_views: {
                    points_per_view: 1,
                    max_points: 20
                },
                time_spent: {
                    points_per_minute: 1,
                    max_points: 30
                },
                resource_downloads: {
                    checklist: 10,
                    calculator: 15,
                    case_study: 12,
                    whitepaper: 18
                },
                form_submissions: {
                    newsletter: 8,
                    contact: 25,
                    audit_request: 30,
                    demo_request: 35
                },
                engagement: {
                    return_visitor: 10,
                    multiple_sessions: 15,
                    social_share: 8,
                    email_click: 12
                }
            },
            
            // Intent scoring
            intent: {
                high_intent_pages: {
                    '/pricing': 15,
                    '/contact': 20,
                    '/tools/roi-calculator': 18,
                    '/case-studies': 12,
                    '/products': 10
                },
                search_terms: {
                    'devops automation': 20,
                    'ci cd pipeline': 18,
                    'infrastructure automation': 16,
                    'startup devops': 22,
                    'devops consulting': 25
                },
                technology_interest: {
                    kubernetes: 10,
                    docker: 8,
                    terraform: 12,
                    jenkins: 8,
                    aws: 10
                }
            },
            
            // Negative scoring
            negative: {
                bounces: -5,
                spam_indicators: -50,
                unsubscribes: -20,
                competitor_domain: -30,
                irrelevant_content: -10
            }
        };
    }

    validateLeadData(data) {
        // Ensure all required fields exist
        const required = ['id', 'firstVisit', 'lastActivity', 'score', 'stage', 'behaviors', 'interactions'];
        const valid = required.every(field => data.hasOwnProperty(field));
        
        if (!valid) {
            console.warn('Invalid lead data structure, reinitializing');
            return this.initializeLeadData();
        }
        
        return {
            ...this.initializeLeadData(),
            ...data
        };
    }

    setupEventListeners() {
        // Form submissions
        document.addEventListener('submit', (e) => {
            if (e.target.matches('form[data-lead-capture]') || 
                e.target.matches('.lead-form') ||
                e.target.matches('#contact-form') ||
                e.target.matches('#audit-form') ||
                e.target.matches('#newsletter-form')) {
                this.handleFormSubmission(e);
            }
        });

        // Link clicks
        document.addEventListener('click', (e) => {
            if (e.target.matches('a[href*="calendly"]') ||
                e.target.matches('a[href*="calendar"]') ||
                e.target.matches('.btn-primary') ||
                e.target.matches('[data-track="cta_click"]')) {
                this.trackBehavior('cta_click', {
                    element: e.target.textContent.trim(),
                    href: e.target.href,
                    page: window.location.pathname
                });
            }
        });

        // Resource downloads
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-resource-download]') ||
                e.target.matches('.download-btn') ||
                e.target.matches('.resource-download')) {
                this.trackBehavior('resource_download', {
                    resource: e.target.dataset.resource || e.target.textContent,
                    type: e.target.dataset.resourceType || 'unknown',
                    page: window.location.pathname
                });
            }
        });

        // Scroll tracking
        let maxScroll = 0;
        let scrollTimer = null;
        
        window.addEventListener('scroll', () => {
            const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
            
            if (scrollPercent > maxScroll) {
                maxScroll = scrollPercent;
                
                // Track milestone scrolls
                if (scrollPercent >= 25 && maxScroll < 25) {
                    this.trackBehavior('scroll_milestone', { percent: 25 });
                } else if (scrollPercent >= 50 && maxScroll < 50) {
                    this.trackBehavior('scroll_milestone', { percent: 50 });
                } else if (scrollPercent >= 75 && maxScroll < 75) {
                    this.trackBehavior('scroll_milestone', { percent: 75 });
                } else if (scrollPercent >= 90 && maxScroll < 90) {
                    this.trackBehavior('scroll_milestone', { percent: 90 });
                }
            }
        });

        // Time on page tracking
        this.startTimeTracking();

        // Before unload - save session data
        window.addEventListener('beforeunload', () => {
            this.endSession();
        });

        // Visibility change - pause/resume tracking
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pauseTimeTracking();
            } else {
                this.resumeTimeTracking();
            }
        });
    }

    handleFormSubmission(event) {
        const form = event.target;
        const formData = new FormData(form);
        const formType = form.id || form.className || 'unknown';
        
        // Extract lead information
        const leadInfo = {};
        for (let [key, value] of formData.entries()) {
            if (['name', 'email', 'company', 'role', 'phone'].includes(key)) {
                leadInfo[key] = value;
            }
        }
        
        // Update lead data
        this.updateLeadInfo(leadInfo);
        
        // Track form submission behavior
        this.trackBehavior('form_submission', {
            form: formType,
            fields: Object.keys(leadInfo),
            page: window.location.pathname,
            timestamp: Date.now()
        });
        
        // Trigger qualification workflow
        this.qualificationWorkflows.processFormSubmission(formType, leadInfo);
        
        // Immediate CRM sync for high-value forms
        if (['audit-form', 'contact-form'].includes(formType)) {
            this.crmIntegration.immediateSync(this.leadData);
        }
    }

    trackBehavior(action, data = {}) {
        if (!this.config.enableBehaviorTracking) return;
        
        const behavior = {
            id: this.generateEventId(),
            sessionId: this.sessionId,
            action,
            data,
            timestamp: Date.now(),
            page: window.location.pathname,
            userAgent: navigator.userAgent,
            screenResolution: `${screen.width}x${screen.height}`,
            viewport: `${window.innerWidth}x${window.innerHeight}`
        };
        
        // Add to session events
        this.sessionEvents.push(behavior);
        
        // Add to lead behaviors
        this.leadData.behaviors.push(behavior);
        
        // Limit stored behaviors to prevent storage bloat
        if (this.leadData.behaviors.length > 1000) {
            this.leadData.behaviors = this.leadData.behaviors.slice(-500);
        }
        
        // Update last activity
        this.leadData.lastActivity = Date.now();
        
        // Calculate score impact
        this.calculateBehaviorScore(action, data);
        
        // Save to storage
        this.saveLeadData();
        
        console.log('Behavior tracked:', action, data);
    }

    calculateBehaviorScore(action, data) {
        let scoreChange = 0;
        
        switch (action) {
            case 'page_view':
                scoreChange = this.scoringRules.behavioral.page_views.points_per_view;
                this.leadData.totalPageViews++;
                break;
                
            case 'form_submission':
                scoreChange = this.scoringRules.behavioral.form_submissions[data.form] || 15;
                break;
                
            case 'resource_download':
                scoreChange = this.scoringRules.behavioral.resource_downloads[data.type] || 10;
                break;
                
            case 'cta_click':
                scoreChange = 5;
                if (data.element?.toLowerCase().includes('audit')) scoreChange = 15;
                if (data.element?.toLowerCase().includes('demo')) scoreChange = 20;
                break;
                
            case 'scroll_milestone':
                if (data.percent >= 75) scoreChange = 3;
                else if (data.percent >= 50) scoreChange = 2;
                else if (data.percent >= 25) scoreChange = 1;
                break;
                
            case 'return_visit':
                scoreChange = this.scoringRules.behavioral.engagement.return_visitor;
                break;
                
            case 'high_intent_page':
                scoreChange = this.scoringRules.intent.high_intent_pages[data.page] || 5;
                break;
        }
        
        // Apply score change
        if (scoreChange !== 0) {
            this.updateScore(scoreChange, `${action}: ${scoreChange} points`);
        }
        
        // Check for stage progression
        this.evaluateStageProgression();
    }

    updateScore(change, reason) {
        if (!this.config.enableScoring) return;
        
        const oldScore = this.leadData.score;
        this.leadData.score = Math.max(0, oldScore + change);
        
        // Log score change
        this.leadData.interactions.push({
            type: 'score_change',
            timestamp: Date.now(),
            change,
            reason,
            oldScore,
            newScore: this.leadData.score
        });
        
        console.log(`Score updated: ${oldScore} → ${this.leadData.score} (${reason})`);
    }

    updateLeadInfo(info) {
        let needsScoring = false;
        
        Object.keys(info).forEach(key => {
            if (info[key] && info[key] !== this.leadData[key]) {
                const oldValue = this.leadData[key];
                this.leadData[key] = info[key];
                
                // Track information capture
                this.leadData.interactions.push({
                    type: 'info_capture',
                    timestamp: Date.now(),
                    field: key,
                    oldValue,
                    newValue: info[key]
                });
                
                needsScoring = true;
            }
        });
        
        if (needsScoring) {
            this.calculateDemographicScore();
            this.saveLeadData();
        }
    }

    calculateDemographicScore() {
        let demographicScore = 0;
        
        // Email domain scoring
        if (this.leadData.email) {
            const domain = this.leadData.email.split('@')[1];
            if (this.isStartupDomain(domain)) {
                demographicScore += this.scoringRules.demographic.email_domain.startup_domains;
            } else if (this.isCorporateDomain(domain)) {
                demographicScore += this.scoringRules.demographic.email_domain.corporate;
            } else if (['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com'].includes(domain)) {
                demographicScore += this.scoringRules.demographic.email_domain[domain.split('.')[0]] || 5;
            }
        }
        
        // Role scoring
        if (this.leadData.role) {
            demographicScore += this.scoringRules.demographic.role[this.leadData.role] || 5;
        }
        
        // Update score
        const change = demographicScore - (this.leadData.demographicScore || 0);
        if (change !== 0) {
            this.leadData.demographicScore = demographicScore;
            this.updateScore(change, `Demographic update: ${change} points`);
        }
    }

    evaluateStageProgression() {
        const score = this.leadData.score;
        const thresholds = this.config.scoreThresholds;
        let newStage = this.leadData.stage;
        
        if (score >= thresholds.qualified) {
            newStage = 'qualified';
        } else if (score >= thresholds.hot) {
            newStage = 'hot';
        } else if (score >= thresholds.warm) {
            newStage = 'warm';
        } else {
            newStage = 'cold';
        }
        
        if (newStage !== this.leadData.stage) {
            const oldStage = this.leadData.stage;
            this.leadData.stage = newStage;
            
            this.leadData.interactions.push({
                type: 'stage_progression',
                timestamp: Date.now(),
                oldStage,
                newStage,
                score
            });
            
            // Trigger stage-specific actions
            this.handleStageProgression(oldStage, newStage);
            
            console.log(`Lead stage progression: ${oldStage} → ${newStage} (Score: ${score})`);
        }
    }

    handleStageProgression(oldStage, newStage) {
        // Trigger appropriate workflows based on stage
        if (newStage === 'qualified' && oldStage !== 'qualified') {
            this.qualificationWorkflows.triggerQualifiedLeadWorkflow(this.leadData);
        } else if (newStage === 'hot' && oldStage !== 'hot') {
            this.qualificationWorkflows.triggerHotLeadWorkflow(this.leadData);
        }
        
        // Schedule immediate CRM sync for important progressions
        if (['hot', 'qualified'].includes(newStage)) {
            this.crmIntegration.scheduleImmediateSync(this.leadData);
        }
    }

    startTimeTracking() {
        this.timeTracker = {
            startTime: Date.now(),
            totalTime: 0,
            isActive: true,
            interval: setInterval(() => {
                if (this.timeTracker.isActive) {
                    this.timeTracker.totalTime += 1000; // 1 second
                    this.leadData.totalTimeSpent += 1000;
                    
                    // Award points for time spent (diminishing returns)
                    if (this.timeTracker.totalTime % 60000 === 0) { // Every minute
                        const minutes = this.timeTracker.totalTime / 60000;
                        if (minutes <= 30) { // Cap at 30 points
                            this.updateScore(1, `Time spent: 1 minute (${minutes} total)`);
                        }
                    }
                }
            }, 1000)
        };
    }

    pauseTimeTracking() {
        if (this.timeTracker) {
            this.timeTracker.isActive = false;
        }
    }

    resumeTimeTracking() {
        if (this.timeTracker) {
            this.timeTracker.isActive = true;
        }
    }

    startScoreCalculation() {
        // Check for high-intent pages
        const currentPage = window.location.pathname;
        if (this.scoringRules.intent.high_intent_pages[currentPage]) {
            this.trackBehavior('high_intent_page', { page: currentPage });
        }
        
        // Check for return visitors
        if (this.leadData.totalSessions > 1) {
            this.trackBehavior('return_visit', { session: this.leadData.totalSessions });
        }
        
        // Check for referral sources
        this.evaluateTrafficSource();
    }

    evaluateTrafficSource() {
        const source = this.getTrafficSource();
        let sourceScore = 0;
        
        if (source.includes('google') && source.includes('devops')) {
            sourceScore = 15;
        } else if (source.includes('linkedin')) {
            sourceScore = 12;
        } else if (source.includes('github')) {
            sourceScore = 10;
        } else if (source.includes('direct')) {
            sourceScore = 5;
        }
        
        if (sourceScore > 0) {
            this.updateScore(sourceScore, `Traffic source: ${source} (${sourceScore} points)`);
        }
    }

    schedulePeriodicSync() {
        if (!this.config.enableCrmSync) return;
        
        // Sync every 5 minutes
        setInterval(() => {
            this.crmIntegration.periodicSync(this.leadData);
        }, this.config.syncInterval);
    }

    endSession() {
        // Calculate session metrics
        const sessionDuration = Date.now() - this.sessionStartTime;
        const sessionScore = this.calculateSessionScore();
        
        // Save session summary
        const sessionSummary = {
            id: this.sessionId,
            startTime: this.sessionStartTime,
            endTime: Date.now(),
            duration: sessionDuration,
            events: this.sessionEvents.length,
            score: sessionScore,
            pages: [...new Set(this.sessionEvents.map(e => e.page))].length
        };
        
        this.leadData.interactions.push({
            type: 'session_end',
            timestamp: Date.now(),
            session: sessionSummary
        });
        
        // Save final state
        this.saveLeadData();
        
        // Clear session data
        if (this.timeTracker?.interval) {
            clearInterval(this.timeTracker.interval);
        }
    }

    calculateSessionScore() {
        return this.sessionEvents.reduce((score, event) => {
            switch (event.action) {
                case 'form_submission': return score + 20;
                case 'resource_download': return score + 10;
                case 'cta_click': return score + 5;
                case 'scroll_milestone': return score + 2;
                default: return score + 1;
            }
        }, 0);
    }

    saveLeadData() {
        try {
            localStorage.setItem('resiliotech_lead_data', JSON.stringify(this.leadData));
        } catch (error) {
            console.error('Failed to save lead data:', error);
        }
    }

    // Utility methods
    generateLeadId() {
        return 'lead_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    generateEventId() {
        return 'event_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    getTrafficSource() {
        const referrer = document.referrer;
        const urlParams = new URLSearchParams(window.location.search);
        
        // Check UTM parameters
        const utmSource = urlParams.get('utm_source');
        const utmMedium = urlParams.get('utm_medium');
        const utmCampaign = urlParams.get('utm_campaign');
        
        if (utmSource) {
            return `${utmSource}/${utmMedium}/${utmCampaign}`.replace(/\/undefined/g, '');
        }
        
        // Check referrer
        if (referrer) {
            try {
                const referrerUrl = new URL(referrer);
                const domain = referrerUrl.hostname;
                
                if (domain.includes('google')) return 'google/organic';
                if (domain.includes('linkedin')) return 'linkedin/social';
                if (domain.includes('github')) return 'github/referral';
                if (domain.includes('twitter')) return 'twitter/social';
                
                return `${domain}/referral`;
            } catch (e) {
                return 'referral';
            }
        }
        
        return 'direct';
    }

    isStartupDomain(domain) {
        const startupIndicators = ['.io', '.co', '.ai', '.ly'];
        return startupIndicators.some(indicator => domain.includes(indicator));
    }

    isCorporateDomain(domain) {
        const commonConsumer = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'aol.com'];
        return !commonConsumer.includes(domain) && !this.isStartupDomain(domain);
    }

    // Public API methods
    getLeadScore() {
        return this.leadData.score;
    }

    getLeadStage() {
        return this.leadData.stage;
    }

    getLeadData() {
        return { ...this.leadData };
    }

    forceSync() {
        this.crmIntegration.immediateSync(this.leadData);
    }
}

// Behavior Tracker Component
class BehaviorTracker {
    init() {
        this.setupAdvancedTracking();
    }

    setupAdvancedTracking() {
        // Mouse movement heatmap (simplified)
        this.setupMouseTracking();
        
        // Engagement time tracking
        this.setupEngagementTracking();
        
        // Copy/paste detection
        this.setupContentInteractionTracking();
    }

    setupMouseTracking() {
        let mouseTimer;
        let isActive = true;
        
        document.addEventListener('mousemove', () => {
            isActive = true;
            clearTimeout(mouseTimer);
            mouseTimer = setTimeout(() => {
                isActive = false;
            }, 5000);
        });
        
        // Track mouse inactivity for engagement scoring
        setInterval(() => {
            if (!isActive && window.leadScoringSystem) {
                // User might be reading/thinking - positive engagement
                window.leadScoringSystem.trackBehavior('deep_engagement', {
                    type: 'mouse_idle',
                    duration: 5000
                });
            }
        }, 10000);
    }

    setupEngagementTracking() {
        // Track when user switches tabs
        document.addEventListener('visibilitychange', () => {
            if (window.leadScoringSystem) {
                if (document.hidden) {
                    window.leadScoringSystem.trackBehavior('tab_hidden', {
                        timestamp: Date.now()
                    });
                } else {
                    window.leadScoringSystem.trackBehavior('tab_visible', {
                        timestamp: Date.now()
                    });
                }
            }
        });
    }

    setupContentInteractionTracking() {
        // Track text selection (interest indicator)
        document.addEventListener('selectionchange', () => {
            const selection = window.getSelection();
            if (selection.toString().length > 10 && window.leadScoringSystem) {
                window.leadScoringSystem.trackBehavior('text_selection', {
                    length: selection.toString().length,
                    page: window.location.pathname
                });
            }
        });
    }
}

// CRM Integration Component
class CRMIntegration {
    constructor() {
        this.syncQueue = [];
        this.isSyncing = false;
    }

    async immediateSync(leadData) {
        if (this.isSyncing) {
            this.syncQueue.push(leadData);
            return;
        }

        this.isSyncing = true;
        try {
            await this.syncToHubSpot(leadData);
            await this.syncToZapier(leadData);
            
            leadData.crmSyncStatus = {
                lastSync: Date.now(),
                status: 'success',
                crmId: leadData.crmSyncStatus.crmId || `hs_${Date.now()}`,
                errors: []
            };
        } catch (error) {
            console.error('CRM sync failed:', error);
            leadData.crmSyncStatus = {
                lastSync: Date.now(),
                status: 'failed',
                crmId: leadData.crmSyncStatus.crmId,
                errors: [error.message]
            };
        } finally {
            this.isSyncing = false;
            
            // Process queue
            if (this.syncQueue.length > 0) {
                const nextLead = this.syncQueue.shift();
                setTimeout(() => this.immediateSync(nextLead), 1000);
            }
        }
    }

    async syncToHubSpot(leadData) {
        // This would integrate with HubSpot API
        const payload = {
            properties: {
                email: leadData.email,
                firstname: leadData.name?.split(' ')[0],
                lastname: leadData.name?.split(' ').slice(1).join(' '),
                company: leadData.company,
                jobtitle: leadData.role,
                phone: leadData.phone,
                lead_score: leadData.score,
                lead_stage: leadData.stage,
                first_visit: new Date(leadData.firstVisit).toISOString(),
                last_activity: new Date(leadData.lastActivity).toISOString(),
                total_page_views: leadData.totalPageViews,
                total_time_spent: Math.round(leadData.totalTimeSpent / 1000), // seconds
                traffic_source: leadData.source,
                behaviors_count: leadData.behaviors.length,
                form_submissions_count: leadData.formSubmissions.length
            }
        };

        // Mock API call - replace with actual HubSpot integration
        console.log('Would sync to HubSpot:', payload);
        
        // Simulate API call
        return new Promise(resolve => setTimeout(resolve, 500));
    }

    async syncToZapier(leadData) {
        // This would trigger Zapier webhooks for additional integrations
        const webhook = {
            lead_data: leadData,
            trigger_type: 'lead_update',
            timestamp: Date.now()
        };

        // Mock webhook call - replace with actual Zapier integration
        console.log('Would trigger Zapier webhook:', webhook);
        
        // Simulate webhook
        return new Promise(resolve => setTimeout(resolve, 200));
    }

    periodicSync(leadData) {
        // Only sync if there's been recent activity
        const timeSinceLastActivity = Date.now() - leadData.lastActivity;
        if (timeSinceLastActivity < 600000) { // 10 minutes
            this.immediateSync(leadData);
        }
    }

    scheduleImmediateSync(leadData) {
        setTimeout(() => this.immediateSync(leadData), 100);
    }
}

// Qualification Workflows Component
class QualificationWorkflows {
    processFormSubmission(formType, formData) {
        // Different qualification flows based on form type
        switch (formType) {
            case 'audit-form':
                this.processAuditRequest(formData);
                break;
            case 'contact-form':
                this.processContactForm(formData);
                break;
            case 'calculator-form':
                this.processCalculatorSubmission(formData);
                break;
            case 'newsletter-form':
                this.processNewsletterSignup(formData);
                break;
        }
    }

    processAuditRequest(formData) {
        // High-value lead - immediate qualification
        const qualification = {
            budget: this.guessBudgetFromCompany(formData.company),
            authority: this.guessAuthorityFromRole(formData.role),
            need: 'high', // They requested an audit
            timeline: 'immediate',
            fit: this.assessFit(formData)
        };

        // Trigger immediate follow-up
        this.triggerImmediateFollowUp(formData, 'audit_request');
        
        return qualification;
    }

    processContactForm(formData) {
        const qualification = {
            budget: this.guessBudgetFromCompany(formData.company),
            authority: this.guessAuthorityFromRole(formData.role),
            need: 'medium', // General inquiry
            timeline: 'within_month',
            fit: this.assessFit(formData)
        };

        // Schedule follow-up within 2 hours
        this.scheduleFollowUp(formData, 'contact_form', 7200000); // 2 hours
        
        return qualification;
    }

    triggerQualifiedLeadWorkflow(leadData) {
        // Qualified lead workflow
        const workflow = {
            trigger: 'lead_qualified',
            leadId: leadData.id,
            score: leadData.score,
            actions: [
                'notify_sales_team',
                'add_to_high_priority_sequence',
                'schedule_personal_outreach',
                'create_slack_notification'
            ]
        };

        this.executeWorkflow(workflow);
    }

    triggerHotLeadWorkflow(leadData) {
        // Hot lead workflow
        const workflow = {
            trigger: 'lead_hot',
            leadId: leadData.id,
            score: leadData.score,
            actions: [
                'add_to_nurture_sequence',
                'schedule_automated_followup',
                'trigger_retargeting_ads'
            ]
        };

        this.executeWorkflow(workflow);
    }

    executeWorkflow(workflow) {
        console.log('Executing workflow:', workflow);
        
        // Mock workflow execution
        workflow.actions.forEach(action => {
            console.log(`Executing action: ${action}`);
            
            // In real implementation, these would trigger actual systems
            switch (action) {
                case 'notify_sales_team':
                    this.notifySalesTeam(workflow);
                    break;
                case 'create_slack_notification':
                    this.createSlackNotification(workflow);
                    break;
                case 'schedule_personal_outreach':
                    this.schedulePersonalOutreach(workflow);
                    break;
            }
        });
    }

    // Utility methods
    guessBudgetFromCompany(company) {
        // Simple budget assessment based on company name/domain
        if (!company) return 'unknown';
        
        // This could be enhanced with company data APIs
        return 'medium';
    }

    guessAuthorityFromRole(role) {
        const highAuthority = ['founder', 'ceo', 'cto', 'vp-engineering'];
        const mediumAuthority = ['engineering-manager', 'director'];
        
        if (highAuthority.includes(role)) return 'high';
        if (mediumAuthority.includes(role)) return 'medium';
        return 'low';
    }

    assessFit(formData) {
        // Simple fit assessment
        let fitScore = 0;
        
        if (formData.company) fitScore += 1;
        if (['founder', 'ceo', 'cto'].includes(formData.role)) fitScore += 2;
        if (formData.challenges?.includes('automation')) fitScore += 2;
        
        if (fitScore >= 4) return 'high';
        if (fitScore >= 2) return 'medium';
        return 'low';
    }

    triggerImmediateFollowUp(formData, type) {
        console.log(`Immediate follow-up triggered for ${type}:`, formData);
    }

    scheduleFollowUp(formData, type, delay) {
        console.log(`Follow-up scheduled for ${type} in ${delay}ms:`, formData);
    }

    notifySalesTeam(workflow) {
        console.log('Sales team notified:', workflow);
    }

    createSlackNotification(workflow) {
        console.log('Slack notification created:', workflow);
    }

    schedulePersonalOutreach(workflow) {
        console.log('Personal outreach scheduled:', workflow);
    }
}

// Initialize Lead Scoring System
document.addEventListener('DOMContentLoaded', () => {
    // Only initialize if not already initialized
    if (!window.leadScoringSystem) {
        window.leadScoringSystem = new LeadScoringSystem();
    }
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { LeadScoringSystem, BehaviorTracker, CRMIntegration, QualificationWorkflows };
}