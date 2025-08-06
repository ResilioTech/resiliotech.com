/**
 * Advanced Resource Gating & Lead Generation System
 * Handles content gating, progressive disclosure, and lead qualification
 */

class ResourceGatingSystem {
    constructor() {
        this.config = {
            enableGating: true,
            smartGating: true, // Progressive based on user behavior
            enableAnalytics: true,
            leadScoringEnabled: true,
            multiStepDownloads: true,
            socialProofEnabled: true
        };
        
        this.userProfile = this.loadUserProfile();
        this.gatedResources = new Map();
        this.downloadAttempts = new Map();
        
        this.init();
    }
    
    init() {
        this.loadGatedResources();
        this.bindResourceActions();
        this.setupProgressiveDisclosure();
        this.initializeLeadScoring();
        this.trackResourceEngagement();
        this.setupSmartGating();
    }
    
    /**
     * Load gated resources configuration
     */
    loadGatedResources() {
        this.gatedResources.set('devops-checklist', {
            id: 'devops-checklist',
            title: 'Complete DevOps Checklist for Startups',
            description: '50-point comprehensive checklist covering CI/CD, monitoring, security, and scaling',
            type: 'checklist',
            category: 'infrastructure',
            businessStage: ['pre-seed', 'seed', 'series-a'],
            technicalLevel: 'beginner-intermediate',
            leadValue: 15,
            downloadCount: 847,
            rating: 4.8,
            fileUrl: '/assets/downloads/devops-checklist-comprehensive.pdf',
            previewUrl: '/assets/previews/devops-checklist-preview.pdf',
            gatingStrategy: 'email-required',
            socialProof: {
                downloadCount: 847,
                testimonial: "This checklist helped us identify 12 critical infrastructure gaps before they became problems.",
                author: "Sarah Chen, CTO at DataFlow"
            }
        });
        
        this.gatedResources.set('roi-calculator-template', {
            id: 'roi-calculator-template',
            title: 'DevOps Automation ROI Calculator',
            description: 'Interactive spreadsheet to calculate potential savings from DevOps automation initiatives',
            type: 'calculator',
            category: 'business-case',
            businessStage: ['seed', 'series-a', 'series-b'],
            technicalLevel: 'all-levels',
            leadValue: 25,
            downloadCount: 623,
            rating: 4.9,
            fileUrl: '/assets/downloads/devops-roi-calculator.xlsx',
            previewUrl: '/assets/previews/roi-calculator-preview.pdf',
            gatingStrategy: 'progressive-profile',
            socialProof: {
                downloadCount: 623,
                testimonial: "Helped us justify $200K DevOps investment with clear ROI projections.",
                author: "Michael Rodriguez, Founder at TechScale"
            }
        });
        
        this.gatedResources.set('startup-scaling-guide', {
            id: 'startup-scaling-guide',
            title: 'Technical Scaling Guide for Growing Startups',
            description: 'Complete guide covering infrastructure scaling, team building, and technology decisions',
            type: 'guide',
            category: 'scaling',
            businessStage: ['seed', 'series-a'],
            technicalLevel: 'all-levels',
            leadValue: 30,
            downloadCount: 1205,
            rating: 4.7,
            fileUrl: '/assets/downloads/startup-scaling-guide.pdf',
            previewUrl: '/assets/previews/scaling-guide-preview.pdf',
            gatingStrategy: 'multi-step',
            socialProof: {
                downloadCount: 1205,
                testimonial: "The scaling timeline saved us months of planning. Exactly what we needed.",
                author: "Alex Kim, Lead Developer at InnovateLab"
            }
        });
        
        this.gatedResources.set('saas-development-timeline', {
            id: 'saas-development-timeline',
            title: 'SaaS Product Development Timeline Template',
            description: 'Detailed timeline template for building and launching SaaS products',
            type: 'template',
            category: 'product-development',
            businessStage: ['pre-seed', 'seed'],
            technicalLevel: 'intermediate-advanced',
            leadValue: 20,
            downloadCount: 456,
            rating: 4.6,
            fileUrl: '/assets/downloads/saas-development-timeline.pdf',
            previewUrl: '/assets/previews/saas-timeline-preview.pdf',
            gatingStrategy: 'email-required',
            socialProof: {
                downloadCount: 456,
                testimonial: "Perfect roadmap for our SaaS launch. Hit every milestone on time.",
                author: "Jennifer Park, Product Manager"
            }
        });
        
        this.gatedResources.set('architecture-templates', {
            id: 'architecture-templates',
            title: 'Startup Technical Architecture Templates',
            description: 'Collection of proven architecture diagrams and patterns for different startup stages',
            type: 'templates',
            category: 'architecture',
            businessStage: ['pre-seed', 'seed', 'series-a'],
            technicalLevel: 'intermediate-advanced',
            leadValue: 35,
            downloadCount: 789,
            rating: 4.9,
            fileUrl: '/assets/downloads/architecture-templates-pack.zip',
            previewUrl: '/assets/previews/architecture-templates-preview.pdf',
            gatingStrategy: 'progressive-profile',
            socialProof: {
                downloadCount: 789,
                testimonial: "These templates are gold. Saved us weeks of architecture planning.",
                author: "David Liu, Senior Engineer"
            }
        });
    }
    
    /**
     * Bind resource download actions
     */
    bindResourceActions() {
        document.addEventListener('click', (e) => {
            if (e.target.closest('[data-resource-action]')) {
                e.preventDefault();
                const element = e.target.closest('[data-resource-action]');
                const action = element.dataset.resourceAction;
                const resourceId = element.dataset.resourceId;
                
                this.handleResourceAction(action, resourceId, element);
            }
        });
    }
    
    /**
     * Handle different resource actions
     */
    handleResourceAction(action, resourceId, element) {
        const resource = this.gatedResources.get(resourceId);
        if (!resource) {
            console.error('Resource not found:', resourceId);
            return;
        }
        
        switch (action) {
            case 'preview':
                this.showResourcePreview(resource);
                break;
            case 'download':
                this.initiateResourceDownload(resource);
                break;
            case 'bookmark':
                this.bookmarkResource(resource);
                break;
            case 'share':
                this.shareResource(resource);
                break;
            case 'view-details':
                this.showResourceDetails(resource);
                break;
        }
        
        this.trackResourceInteraction(action, resource);
    }
    
    /**
     * Show resource preview
     */
    showResourcePreview(resource) {
        const modal = this.createPreviewModal(resource);
        document.body.appendChild(modal);
        document.body.style.overflow = 'hidden';
        
        // Track preview
        this.trackEvent('resource_preview_opened', {
            resourceId: resource.id,
            resourceType: resource.type,
            category: resource.category
        });
    }
    
    /**
     * Create resource preview modal
     */
    createPreviewModal(resource) {
        const modal = document.createElement('div');
        modal.className = 'resource-preview-modal';
        modal.innerHTML = `
            <div class="modal-overlay" onclick="this.closest('.resource-preview-modal').remove(); document.body.style.overflow = '';"></div>
            <div class="modal-content">
                <div class="modal-header">
                    <button class="modal-close" onclick="this.closest('.resource-preview-modal').remove(); document.body.style.overflow = '';" aria-label="Close preview">×</button>
                    <h3>${resource.title}</h3>
                    <p class="resource-description">${resource.description}</p>
                </div>
                
                <div class="preview-content">
                    <div class="preview-frame">
                        <iframe src="${resource.previewUrl}" width="100%" height="500px" frameborder="0"></iframe>
                    </div>
                </div>
                
                <div class="preview-actions">
                    <div class="resource-stats">
                        <span class="stat">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                            </svg>
                            ${resource.rating} rating
                        </span>
                        <span class="stat">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                                <polyline points="7,10 12,15 17,10"/>
                                <line x1="12" y1="15" x2="12" y2="3"/>
                            </svg>
                            ${resource.downloadCount} downloads
                        </span>
                    </div>
                    
                    <div class="action-buttons">
                        <button class="btn btn-primary" onclick="window.resourceGatingSystem.initiateResourceDownload(window.resourceGatingSystem.gatedResources.get('${resource.id}'))">
                            Get Full Resource
                        </button>
                        <button class="btn btn-outline" onclick="window.resourceGatingSystem.shareResource(window.resourceGatingSystem.gatedResources.get('${resource.id}'))">
                            Share Resource
                        </button>
                    </div>
                </div>
                
                ${this.generateSocialProof(resource)}
            </div>
        `;
        
        return modal;
    }
    
    /**
     * Initiate resource download with gating logic
     */
    initiateResourceDownload(resource) {
        const shouldGate = this.shouldGateResource(resource);
        
        if (!shouldGate) {
            // Direct download for returning users or low-friction resources
            this.processDirectDownload(resource);
            return;
        }
        
        // Show gating modal based on strategy
        switch (resource.gatingStrategy) {
            case 'email-required':
                this.showEmailGatingModal(resource);
                break;
            case 'progressive-profile':
                this.showProgressiveProfileModal(resource);
                break;
            case 'multi-step':
                this.showMultiStepGatingModal(resource);
                break;
            default:
                this.showEmailGatingModal(resource);
        }
    }
    
    /**
     * Determine if resource should be gated
     */
    shouldGateResource(resource) {
        if (!this.config.enableGating) return false;
        
        // Smart gating based on user behavior
        if (this.config.smartGating) {
            const userScore = this.calculateUserEngagementScore();
            const visitCount = this.userProfile.visitCount || 0;
            
            // Less gating for engaged users
            if (userScore > 50 && visitCount > 3) {
                return Math.random() < 0.3; // 30% chance to gate
            }
            
            // More gating for new users
            if (visitCount < 2) {
                return true;
            }
        }
        
        // Always gate high-value resources
        return resource.leadValue > 20;
    }
    
    /**
     * Calculate user engagement score
     */
    calculateUserEngagementScore() {
        let score = 0;
        const profile = this.userProfile;
        
        // Visit frequency
        score += Math.min((profile.visitCount || 0) * 5, 25);
        
        // Resource downloads
        score += Math.min((profile.downloadsCount || 0) * 10, 30);
        
        // Newsletter subscription
        if (profile.subscribedNewsletter) score += 15;
        
        // Time on site
        const avgSessionTime = profile.totalTimeOnSite / (profile.visitCount || 1);
        if (avgSessionTime > 120) score += 10; // 2+ minutes
        
        // Recent activity
        const daysSinceLastVisit = profile.lastVisit ? 
            (Date.now() - new Date(profile.lastVisit)) / (1000 * 60 * 60 * 24) : 30;
        if (daysSinceLastVisit < 7) score += 10;
        
        return Math.min(score, 100);
    }
    
    /**
     * Show email gating modal
     */
    showEmailGatingModal(resource) {
        const modal = this.createGatingModal(resource, 'email');
        document.body.appendChild(modal);
        document.body.style.overflow = 'hidden';
        
        this.trackEvent('resource_gate_shown', {
            resourceId: resource.id,
            gatingStrategy: 'email-required',
            userEngagementScore: this.calculateUserEngagementScore()
        });
    }
    
    /**
     * Show progressive profile modal
     */
    showProgressiveProfileModal(resource) {
        const modal = this.createGatingModal(resource, 'progressive');
        document.body.appendChild(modal);
        document.body.style.overflow = 'hidden';
        
        this.trackEvent('resource_gate_shown', {
            resourceId: resource.id,
            gatingStrategy: 'progressive-profile',
            userEngagementScore: this.calculateUserEngagementScore()
        });
    }
    
    /**
     * Show multi-step gating modal
     */
    showMultiStepGatingModal(resource) {
        const modal = this.createGatingModal(resource, 'multi-step');
        document.body.appendChild(modal);
        document.body.style.overflow = 'hidden';
        
        this.trackEvent('resource_gate_shown', {
            resourceId: resource.id,
            gatingStrategy: 'multi-step',
            userEngagementScore: this.calculateUserEngagementScore()
        });
    }
    
    /**
     * Create gating modal
     */
    createGatingModal(resource, gatingType) {
        const modal = document.createElement('div');
        modal.className = 'resource-gating-modal';
        modal.innerHTML = this.generateGatingModalHTML(resource, gatingType);
        
        // Bind form submission
        setTimeout(() => {
            const form = modal.querySelector('.gating-form');
            if (form) {
                form.addEventListener('submit', (e) => {
                    e.preventDefault();
                    this.processGatedDownload(resource, form, modal);
                });
            }
        }, 100);
        
        return modal;
    }
    
    /**
     * Generate gating modal HTML
     */
    generateGatingModalHTML(resource, gatingType) {
        const socialProof = this.generateSocialProof(resource);
        
        switch (gatingType) {
            case 'email':
                return `
                    <div class="modal-overlay" onclick="this.closest('.resource-gating-modal').remove(); document.body.style.overflow = '';"></div>
                    <div class="modal-content">
                        <div class="modal-header">
                            <button class="modal-close" onclick="this.closest('.resource-gating-modal').remove(); document.body.style.overflow = '';">×</button>
                            <h3>🎯 Get Your ${resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}</h3>
                            <h4>${resource.title}</h4>
                        </div>
                        
                        ${socialProof}
                        
                        <form class="gating-form" data-resource-id="${resource.id}">
                            <div class="form-group">
                                <label for="gating-email">Work Email *</label>
                                <input type="email" id="gating-email" name="email" required 
                                       placeholder="Enter your work email" 
                                       value="${this.userProfile.email || ''}">
                            </div>
                            
                            <button type="submit" class="btn btn-primary btn-full">
                                <span class="btn-text">Download ${resource.type}</span>
                                <span class="btn-loading" style="display: none;">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M21 12a9 9 0 11-6.219-8.56"/>
                                    </svg>
                                </span>
                            </button>
                            
                            <p class="form-privacy">
                                We'll email you the download link. No spam, unsubscribe anytime.
                            </p>
                        </form>
                    </div>
                `;
                
            case 'progressive':
                return `
                    <div class="modal-overlay" onclick="this.closest('.resource-gating-modal').remove(); document.body.style.overflow = '';"></div>
                    <div class="modal-content">
                        <div class="modal-header">
                            <button class="modal-close" onclick="this.closest('.resource-gating-modal').remove(); document.body.style.overflow = '';">×</button>
                            <h3>📊 Get Your ${resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}</h3>
                            <h4>${resource.title}</h4>
                        </div>
                        
                        ${socialProof}
                        
                        <form class="gating-form" data-resource-id="${resource.id}">
                            <div class="form-group">
                                <label for="gating-email">Work Email *</label>
                                <input type="email" id="gating-email" name="email" required 
                                       placeholder="Enter your work email"
                                       value="${this.userProfile.email || ''}">
                            </div>
                            
                            <div class="form-group">
                                <label for="gating-company">Company</label>
                                <input type="text" id="gating-company" name="company" 
                                       placeholder="Your company name"
                                       value="${this.userProfile.company || ''}">
                            </div>
                            
                            <div class="form-group">
                                <label for="gating-role">Your Role</label>
                                <select id="gating-role" name="role">
                                    <option value="">Select your role</option>
                                    <option value="founder">Founder/CEO</option>
                                    <option value="cto">CTO</option>
                                    <option value="engineering-manager">Engineering Manager</option>
                                    <option value="lead-developer">Lead Developer</option>
                                    <option value="devops-engineer">DevOps Engineer</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            
                            <div class="form-group">
                                <label for="gating-stage">Company Stage</label>
                                <select id="gating-stage" name="companyStage">
                                    <option value="">Select stage</option>
                                    <option value="pre-seed">Pre-seed (idea/MVP)</option>
                                    <option value="seed">Seed (early traction)</option>
                                    <option value="series-a">Series A (scaling)</option>
                                    <option value="series-b">Series B+ (growth)</option>
                                </select>
                            </div>
                            
                            <button type="submit" class="btn btn-primary btn-full">
                                <span class="btn-text">Get ${resource.type}</span>
                                <span class="btn-loading" style="display: none;">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M21 12a9 9 0 11-6.219-8.56"/>
                                    </svg>
                                </span>
                            </button>
                            
                            <p class="form-privacy">
                                Your information helps us send you more relevant content.
                            </p>
                        </form>
                    </div>
                `;
                
            case 'multi-step':
                return `
                    <div class="modal-overlay" onclick="this.closest('.resource-gating-modal').remove(); document.body.style.overflow = '';"></div>
                    <div class="modal-content multi-step">
                        <div class="modal-header">
                            <button class="modal-close" onclick="this.closest('.resource-gating-modal').remove(); document.body.style.overflow = '';">×</button>
                            <div class="step-progress">
                                <div class="step-indicator active" data-step="1">1</div>
                                <div class="step-connector"></div>
                                <div class="step-indicator" data-step="2">2</div>
                                <div class="step-connector"></div>
                                <div class="step-indicator" data-step="3">3</div>
                            </div>
                            <h3>📚 Get Your ${resource.title}</h3>
                        </div>
                        
                        <form class="gating-form multi-step-form" data-resource-id="${resource.id}">
                            <!-- Step 1: Basic Info -->
                            <div class="form-step active" data-step="1">
                                <h4>Tell us about yourself</h4>
                                <div class="form-group">
                                    <label for="multi-email">Work Email *</label>
                                    <input type="email" id="multi-email" name="email" required 
                                           placeholder="Enter your work email">
                                </div>
                                <div class="form-group">
                                    <label for="multi-name">First Name *</label>
                                    <input type="text" id="multi-name" name="firstName" required 
                                           placeholder="Your first name">
                                </div>
                                <button type="button" class="btn btn-primary next-step">Next →</button>
                            </div>
                            
                            <!-- Step 2: Company Info -->
                            <div class="form-step" data-step="2">
                                <h4>About your company</h4>
                                <div class="form-group">
                                    <label for="multi-company">Company Name *</label>
                                    <input type="text" id="multi-company" name="company" required 
                                           placeholder="Your company">
                                </div>
                                <div class="form-group">
                                    <label for="multi-role">Your Role *</label>
                                    <select id="multi-role" name="role" required>
                                        <option value="">Select your role</option>
                                        <option value="founder">Founder/CEO</option>
                                        <option value="cto">CTO</option>
                                        <option value="engineering-manager">Engineering Manager</option>
                                        <option value="lead-developer">Lead Developer</option>
                                        <option value="devops-engineer">DevOps Engineer</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                                <div class="form-step-navigation">
                                    <button type="button" class="btn btn-outline prev-step">← Previous</button>
                                    <button type="button" class="btn btn-primary next-step">Next →</button>
                                </div>
                            </div>
                            
                            <!-- Step 3: Interests -->
                            <div class="form-step" data-step="3">
                                <h4>What interests you most?</h4>
                                <div class="form-group">
                                    <div class="checkbox-group">
                                        <label class="checkbox-label">
                                            <input type="checkbox" name="interests" value="devops-automation">
                                            <span>DevOps Automation</span>
                                        </label>
                                        <label class="checkbox-label">
                                            <input type="checkbox" name="interests" value="infrastructure-scaling">
                                            <span>Infrastructure Scaling</span>
                                        </label>
                                        <label class="checkbox-label">
                                            <input type="checkbox" name="interests" value="monitoring-observability">
                                            <span>Monitoring & Observability</span>
                                        </label>
                                        <label class="checkbox-label">
                                            <input type="checkbox" name="interests" value="security-compliance">
                                            <span>Security & Compliance</span>
                                        </label>
                                        <label class="checkbox-label">
                                            <input type="checkbox" name="interests" value="saas-development">
                                            <span>SaaS Development</span>
                                        </label>
                                    </div>
                                </div>
                                <div class="form-step-navigation">
                                    <button type="button" class="btn btn-outline prev-step">← Previous</button>
                                    <button type="submit" class="btn btn-primary">
                                        <span class="btn-text">Get ${resource.type}</span>
                                        <span class="btn-loading" style="display: none;">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                <path d="M21 12a9 9 0 11-6.219-8.56"/>
                                            </svg>
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </form>
                        
                        ${socialProof}
                    </div>
                `;
        }
    }
    
    /**
     * Generate social proof section
     */
    generateSocialProof(resource) {
        if (!this.config.socialProofEnabled) return '';
        
        return `
            <div class="social-proof-section">
                <div class="social-stats">
                    <div class="stat">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                            <polyline points="7,10 12,15 17,10"/>
                            <line x1="12" y1="15" x2="12" y2="3"/>
                        </svg>
                        <span>${resource.downloadCount} downloads</span>
                    </div>
                    <div class="stat">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </svg>
                        <span>${resource.rating}/5 rating</span>
                    </div>
                </div>
                
                ${resource.socialProof ? `
                    <div class="testimonial">
                        <blockquote>"${resource.socialProof.testimonial}"</blockquote>
                        <cite>— ${resource.socialProof.author}</cite>
                    </div>
                ` : ''}
            </div>
        `;
    }
    
    /**
     * Process gated download
     */
    async processGatedDownload(resource, form, modal) {
        this.setLoadingState(form, true);
        
        try {
            const formData = new FormData(form);
            const leadData = this.extractLeadData(formData, resource);
            
            // Score the lead
            const leadScore = this.calculateLeadScore(leadData, resource);
            
            // Submit to CRM/backend
            const result = await this.submitLeadData(leadData, leadScore);
            
            if (result.success) {
                // Update user profile
                this.updateUserProfile(leadData);
                
                // Process download
                await this.processDirectDownload(resource);
                
                // Show success and close modal
                this.showDownloadSuccess(resource, modal);
                
                // Track conversion
                this.trackEvent('resource_download_converted', {
                    resourceId: resource.id,
                    leadScore: leadScore,
                    gatingStrategy: resource.gatingStrategy,
                    conversionPath: 'gated'
                });
                
            } else {
                this.showDownloadError(form, result.error);
            }
            
        } catch (error) {
            console.error('Gated download error:', error);
            this.showDownloadError(form, 'Unable to process download. Please try again.');
        } finally {
            this.setLoadingState(form, false);
        }
    }
    
    /**
     * Extract lead data from form
     */
    extractLeadData(formData, resource) {
        const data = {
            email: formData.get('email'),
            firstName: formData.get('firstName'),
            company: formData.get('company'),
            role: formData.get('role'),
            companyStage: formData.get('companyStage'),
            interests: formData.getAll('interests'),
            resourceId: resource.id,
            resourceType: resource.type,
            resourceCategory: resource.category,
            timestamp: new Date().toISOString(),
            source: 'resource-download',
            userAgent: navigator.userAgent,
            referrer: document.referrer,
            pageUrl: window.location.href
        };
        
        return data;
    }
    
    /**
     * Calculate lead score
     */
    calculateLeadScore(leadData, resource) {
        let score = 0;
        
        // Base resource value
        score += resource.leadValue;
        
        // Email domain scoring
        if (leadData.email && !this.isPersonalEmail(leadData.email)) {
            score += 15; // Business email
        }
        
        // Role scoring
        const roleScores = {
            'founder': 30,
            'cto': 25,
            'engineering-manager': 20,
            'lead-developer': 15,
            'devops-engineer': 15,
            'other': 5
        };
        score += roleScores[leadData.role] || 0;
        
        // Company stage scoring
        const stageScores = {
            'pre-seed': 10,
            'seed': 20,
            'series-a': 25,
            'series-b': 30
        };
        score += stageScores[leadData.companyStage] || 0;
        
        // Interest alignment
        if (leadData.interests && leadData.interests.length > 0) {
            score += Math.min(leadData.interests.length * 3, 15);
        }
        
        // User engagement bonus
        const userScore = this.calculateUserEngagementScore();
        score += Math.floor(userScore / 10);
        
        return Math.min(score, 100);
    }
    
    /**
     * Check if email is personal
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
     * Submit lead data to backend/CRM
     */
    async submitLeadData(leadData, leadScore) {
        try {
            // Submit to Netlify Forms
            const formData = new FormData();
            formData.append('form-name', 'resource-download');
            
            Object.entries(leadData).forEach(([key, value]) => {
                if (Array.isArray(value)) {
                    formData.append(key, value.join(', '));
                } else {
                    formData.append(key, value);
                }
            });
            
            formData.append('leadScore', leadScore);
            
            const response = await fetch('/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams(formData).toString()
            });
            
            if (response.ok) {
                return { success: true };
            } else {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
        } catch (error) {
            console.error('Lead submission error:', error);
            return { success: false, error: error.message };
        }
    }
    
    /**
     * Process direct download
     */
    async processDirectDownload(resource) {
        // Track download
        this.trackEvent('resource_downloaded', {
            resourceId: resource.id,
            resourceType: resource.type,
            category: resource.category,
            userEngagementScore: this.calculateUserEngagementScore()
        });
        
        // Update download count
        resource.downloadCount += 1;
        
        // Trigger file download
        const link = document.createElement('a');
        link.href = resource.fileUrl;
        link.download = resource.title.replace(/\s+/g, '-').toLowerCase() + this.getFileExtension(resource.fileUrl);
        link.click();
        
        // Update user profile
        this.userProfile.downloadsCount = (this.userProfile.downloadsCount || 0) + 1;
        this.userProfile.lastDownload = new Date().toISOString();
        this.saveUserProfile();
    }
    
    /**
     * Get file extension from URL
     */
    getFileExtension(url) {
        const match = url.match(/\.([^.]+)$/);
        return match ? '.' + match[1] : '';
    }
    
    /**
     * Show download success
     */
    showDownloadSuccess(resource, modal) {
        const successHTML = `
            <div class="download-success">
                <div class="success-icon">✅</div>
                <h3>Download Started!</h3>
                <p>Your ${resource.type} should download automatically. If not, <a href="${resource.fileUrl}" target="_blank">click here</a>.</p>
                <div class="success-actions">
                    <button class="btn btn-primary" onclick="this.closest('.resource-gating-modal').remove(); document.body.style.overflow = '';">Close</button>
                    <button class="btn btn-outline" onclick="window.resourceGatingSystem.shareResource(window.resourceGatingSystem.gatedResources.get('${resource.id}'))">Share This Resource</button>
                </div>
            </div>
        `;
        
        const modalContent = modal.querySelector('.modal-content');
        modalContent.innerHTML = successHTML;
        
        // Auto-close after 5 seconds
        setTimeout(() => {
            modal.remove();
            document.body.style.overflow = '';
        }, 5000);
    }
    
    /**
     * Show download error
     */
    showDownloadError(form, errorMessage) {
        const existingError = form.querySelector('.form-error');
        if (existingError) {
            existingError.remove();
        }
        
        const errorElement = document.createElement('div');
        errorElement.className = 'form-error';
        errorElement.innerHTML = `
            <div style="display: flex; align-items: center; gap: 8px; color: #ef4444;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="15" y1="9" x2="9" y2="15"></line>
                    <line x1="9" y1="9" x2="15" y2="15"></line>
                </svg>
                <span>${errorMessage}</span>
            </div>
        `;
        
        form.appendChild(errorElement);
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            if (errorElement.parentNode) {
                errorElement.remove();
            }
        }, 5000);
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
     * Setup progressive disclosure
     */
    setupProgressiveDisclosure() {
        // Show more relevant resources based on user behavior
        this.observeUserBehavior();
    }
    
    /**
     * Observe user behavior for personalization
     */
    observeUserBehavior() {
        // Track scroll depth
        let maxScroll = 0;
        window.addEventListener('scroll', () => {
            const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
            if (scrollPercent > maxScroll) {
                maxScroll = scrollPercent;
                this.userProfile.maxScrollDepth = maxScroll;
            }
        });
        
        // Track time on page
        const startTime = Date.now();
        window.addEventListener('beforeunload', () => {
            const sessionTime = Date.now() - startTime;
            this.userProfile.totalTimeOnSite = (this.userProfile.totalTimeOnSite || 0) + sessionTime;
            this.saveUserProfile();
        });
    }
    
    /**
     * Initialize lead scoring
     */
    initializeLeadScoring() {
        // This is handled in calculateLeadScore method
    }
    
    /**
     * Track resource engagement
     */
    trackResourceEngagement() {
        // Track various engagement metrics
        document.addEventListener('click', (e) => {
            if (e.target.closest('[data-resource-id]')) {
                const resourceId = e.target.closest('[data-resource-id]').dataset.resourceId;
                this.trackResourceInteraction('click', { id: resourceId });
            }
        });
    }
    
    /**
     * Setup smart gating
     */
    setupSmartGating() {
        // Smart gating logic is handled in shouldGateResource method
    }
    
    /**
     * Bookmark resource
     */
    bookmarkResource(resource) {
        const bookmarks = JSON.parse(localStorage.getItem('bookmarkedResources') || '[]');
        
        if (!bookmarks.find(b => b.id === resource.id)) {
            bookmarks.push({
                id: resource.id,
                title: resource.title,
                timestamp: new Date().toISOString()
            });
            
            localStorage.setItem('bookmarkedResources', JSON.stringify(bookmarks));
            
            this.showNotification('Resource bookmarked!');
            this.trackEvent('resource_bookmarked', { resourceId: resource.id });
        } else {
            this.showNotification('Already bookmarked');
        }
    }
    
    /**
     * Share resource
     */
    shareResource(resource) {
        if (navigator.share) {
            navigator.share({
                title: resource.title,
                text: resource.description,
                url: window.location.href + '#resource-' + resource.id
            });
        } else {
            // Fallback to copy URL
            navigator.clipboard.writeText(window.location.href + '#resource-' + resource.id);
            this.showNotification('Resource link copied to clipboard!');
        }
        
        this.trackEvent('resource_shared', { resourceId: resource.id });
    }
    
    /**
     * Show resource details
     */
    showResourceDetails(resource) {
        // This could open a detailed view or navigate to a dedicated page
        this.showResourcePreview(resource);
    }
    
    /**
     * Track resource interaction
     */
    trackResourceInteraction(action, resource) {
        this.trackEvent('resource_interaction', {
            action: action,
            resourceId: resource.id || resource,
            timestamp: new Date().toISOString()
        });
    }
    
    /**
     * Show notification
     */
    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'resource-notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: var(--primary-color);
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            z-index: 10002;
            animation: slideInUp 0.3s ease, slideOutDown 0.3s ease 2.7s;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 3000);
    }
    
    /**
     * Update user profile
     */
    updateUserProfile(data) {
        const updates = {
            email: data.email,
            firstName: data.firstName,
            company: data.company,
            role: data.role,
            companyStage: data.companyStage,
            lastInteraction: new Date().toISOString(),
            visitCount: (this.userProfile.visitCount || 0) + 1
        };
        
        if (data.interests) {
            const existingInterests = this.userProfile.interests || [];
            const newInterests = [...new Set([...existingInterests, ...data.interests])];
            updates.interests = newInterests;
        }
        
        this.userProfile = { ...this.userProfile, ...updates };
        this.saveUserProfile();
    }
    
    /**
     * Load user profile
     */
    loadUserProfile() {
        try {
            const profile = localStorage.getItem('resourceUserProfile');
            return profile ? JSON.parse(profile) : {
                visitCount: 0,
                downloadsCount: 0,
                totalTimeOnSite: 0,
                maxScrollDepth: 0,
                interests: [],
                createdAt: new Date().toISOString()
            };
        } catch (error) {
            console.error('Error loading user profile:', error);
            return {};
        }
    }
    
    /**
     * Save user profile
     */
    saveUserProfile() {
        try {
            localStorage.setItem('resourceUserProfile', JSON.stringify(this.userProfile));
        } catch (error) {
            console.error('Error saving user profile:', error);
        }
    }
    
    /**
     * Track events
     */
    trackEvent(eventName, properties) {
        if (!this.config.enableAnalytics) return;
        
        // Google Analytics 4
        if (window.gtag) {
            gtag('event', eventName, {
                event_category: 'Resource_Gating',
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
                resource_data: properties
            });
        }
        
        console.log(`Resource gating event: ${eventName}`, properties);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.resourceGatingSystem = new ResourceGatingSystem();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ResourceGatingSystem;
}