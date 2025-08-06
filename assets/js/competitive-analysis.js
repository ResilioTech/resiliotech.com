/**
 * Competitive Analysis & Positioning System
 * Real-time competitor monitoring, positioning analysis, and dynamic messaging
 */

class CompetitiveAnalysisSystem {
    constructor() {
        this.competitors = this.initializeCompetitors();
        this.positioningMatrix = this.initializePositioning();
        this.messaging = new CompetitiveMessaging();
        this.battleCards = new BattleCards();
        this.realTimeMonitoring = new CompetitorMonitoring();
        
        this.config = {
            enableRealTimeTracking: true,
            updateInterval: 300000, // 5 minutes
            enableDynamicMessaging: true,
            trackCompetitorVisits: true
        };
        
        this.init();
    }
    
    initializeCompetitors() {
        return {
            jenkins: {
                name: 'Jenkins',
                category: 'devops',
                strengths: ['Open source', 'Highly customizable', 'Large community'],
                weaknesses: ['Complex setup', 'Maintenance heavy', 'UI/UX outdated'],
                pricing: { model: 'free', enterprise: 'contact' },
                marketPosition: 'established_leader',
                targetAudience: 'enterprises',
                keyFeatures: ['CI/CD', 'Plugin ecosystem', 'Self-hosted'],
                lastUpdated: Date.now()
            },
            
            circleci: {
                name: 'CircleCI',
                category: 'devops',
                strengths: ['Easy setup', 'Good performance', 'Docker support'],
                weaknesses: ['Pricing complexity', 'Limited customization', 'Vendor lock-in'],
                pricing: { 
                    free: { credits: 6000 },
                    performance: { price: 30, credits: 25000 },
                    scale: { price: 200, credits: 200000 }
                },
                marketPosition: 'growth_challenger',
                targetAudience: 'startups_enterprises',
                keyFeatures: ['Cloud native', 'Docker support', 'Parallel execution'],
                lastUpdated: Date.now()
            },
            
            githubactions: {
                name: 'GitHub Actions',
                category: 'devops',
                strengths: ['GitHub integration', 'Large marketplace', 'Competitive pricing'],
                weaknesses: ['GitHub dependency', 'Limited enterprise features', 'Complex workflows'],
                pricing: {
                    free: { minutes: 2000 },
                    pro: { price: 4, minutes: 3000 },
                    team: { price: 4, minutes: 10000 }
                },
                marketPosition: 'fast_follower',
                targetAudience: 'developers',
                keyFeatures: ['Native GitHub', 'Marketplace', 'Multi-platform'],
                lastUpdated: Date.now()
            },
            
            datadog: {
                name: 'Datadog',
                category: 'monitoring',
                strengths: ['Comprehensive platform', 'Great visualizations', 'Strong APM'],
                weaknesses: ['Expensive', 'Complex pricing', 'Feature overload'],
                pricing: {
                    infrastructure: { price: 15 },
                    apm: { price: 31 },
                    logs: { price: 1.7 },
                    enterprise: 'contact'
                },
                marketPosition: 'market_leader',
                targetAudience: 'enterprises',
                keyFeatures: ['Full-stack monitoring', 'AI/ML insights', 'Compliance'],
                lastUpdated: Date.now()
            },
            
            newrelic: {
                name: 'New Relic',
                category: 'monitoring',
                strengths: ['Easy setup', 'Good APM', 'User-friendly'],
                weaknesses: ['Limited customization', 'Pricing tiers', 'Data retention'],
                pricing: {
                    free: { users: 1, retention: '8 days' },
                    standard: { price: 25 },
                    pro: { price: 99 },
                    enterprise: { price: 349 }
                },
                marketPosition: 'established_player',
                targetAudience: 'mid_market',
                keyFeatures: ['APM', 'Browser monitoring', 'Mobile monitoring'],
                lastUpdated: Date.now()
            },
            
            pingdom: {
                name: 'Pingdom',
                category: 'monitoring',
                strengths: ['Simple setup', 'Uptime focus', 'Good alerts'],
                weaknesses: ['Limited features', 'Basic analytics', 'No APM'],
                pricing: {
                    starter: { price: 10 },
                    standard: { price: 35 },
                    advanced: { price: 72 }
                },
                marketPosition: 'niche_player',
                targetAudience: 'small_business',
                keyFeatures: ['Uptime monitoring', 'Page speed', 'Transaction monitoring'],
                lastUpdated: Date.now()
            }
        };
    }
    
    initializePositioning() {
        return {
            devops_suite: {
                primaryDifferentiators: [
                    'Startup-focused simplicity',
                    'All-in-one platform',
                    'Transparent pricing',
                    'Zero-configuration setup'
                ],
                competitiveAdvantages: {
                    jenkins: 'No maintenance overhead, modern UI, cloud-native',
                    circleci: 'Simpler pricing, better startup focus, more integrations',
                    githubactions: 'Multi-VCS support, advanced features, better monitoring'
                },
                targetPosition: 'Simple, powerful DevOps for growing teams',
                valueProps: [
                    'Setup in minutes, not days',
                    'Grow from startup to scale-up',
                    'All tools in one platform'
                ]
            },
            
            health_monitor: {
                primaryDifferentiators: [
                    'Startup-optimized monitoring',
                    'Intelligent noise reduction',
                    'Fair pricing model',
                    'Mobile-first alerts'
                ],
                competitiveAdvantages: {
                    datadog: 'Much lower cost, startup-focused, simpler setup',
                    newrelic: 'Better pricing, more integrations, startup expertise',
                    pingdom: 'More comprehensive, better analytics, smarter alerts'
                },
                targetPosition: 'Smart monitoring that grows with your startup',
                valueProps: [
                    'Monitoring without the noise',
                    'Pay for what you use',
                    'Built for startup scale'
                ]
            }
        };
    }
    
    init() {
        this.detectCompetitorContext();
        this.loadBattleCards();
        this.setupDynamicMessaging();
        this.setupCompetitorTracking();
        this.startRealTimeMonitoring();
        
        console.log('Competitive Analysis System initialized');
    }
    
    detectCompetitorContext() {
        // Check if user came from competitor research
        const referrer = document.referrer.toLowerCase();
        const searchParams = new URLSearchParams(window.location.search);
        const utm_content = searchParams.get('utm_content');
        
        let competitorContext = null;
        
        // Detect from referrer
        Object.keys(this.competitors).forEach(key => {
            const competitor = this.competitors[key];
            if (referrer.includes(competitor.name.toLowerCase().replace(' ', ''))) {
                competitorContext = key;
            }
        });
        
        // Detect from UTM parameters
        if (utm_content) {
            const content = utm_content.toLowerCase();
            Object.keys(this.competitors).forEach(key => {
                if (content.includes(key) || content.includes(this.competitors[key].name.toLowerCase())) {
                    competitorContext = key;
                }
            });
        }
        
        // Detect from search terms in session
        const searchTerms = this.getSearchTermsFromSession();
        if (searchTerms.length > 0) {
            competitorContext = this.matchSearchTermsToCompetitors(searchTerms);
        }
        
        if (competitorContext) {
            this.currentCompetitorContext = competitorContext;
            this.activateCompetitiveBattleCard(competitorContext);
            
            // Track competitor context
            this.trackEvent('competitor_context_detected', {
                competitor: competitorContext,
                source: referrer ? 'referrer' : utm_content ? 'utm' : 'search',
                page: window.location.pathname
            });
        }
    }
    
    activateCompetitiveBattleCard(competitorKey) {
        const competitor = this.competitors[competitorKey];
        if (!competitor) return;
        
        // Show competitive messaging
        this.showCompetitiveBanner(competitor);
        
        // Update page messaging
        this.updateCompetitiveMessaging(competitorKey);
        
        // Track battle card activation
        this.trackEvent('battle_card_activated', {
            competitor: competitorKey,
            product: this.getProductFromPath()
        });
    }
    
    showCompetitiveBanner(competitor) {
        // Create competitive banner
        const banner = document.createElement('div');
        banner.className = 'competitive-banner';
        banner.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            background: linear-gradient(135deg, #6366f1, #8b5cf6);
            color: white;
            padding: 1rem;
            text-align: center;
            z-index: 10001;
            transform: translateY(-100%);
            transition: transform 0.5s ease;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
        `;
        
        const product = this.getProductFromPath();
        const positioning = this.positioningMatrix[product];
        const advantage = positioning?.competitiveAdvantages[competitor.name.toLowerCase().replace(' ', '')];
        
        banner.innerHTML = `
            <div style="max-width: 1200px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; gap: 1rem;">
                <div>
                    <strong>Coming from ${competitor.name}?</strong>
                    ${advantage ? `Here's why startups choose us: ${advantage}` : 'See how we compare'}
                </div>
                <div style="display: flex; gap: 1rem; align-items: center;">
                    <button class="btn-competitive-compare" style="background: rgba(255,255,255,0.2); color: white; border: none; padding: 0.5rem 1rem; border-radius: 6px; cursor: pointer;">
                        Compare Features
                    </button>
                    <button class="banner-close" style="background: none; border: none; color: white; font-size: 1.5rem; cursor: pointer;">×</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(banner);
        
        // Animate in
        setTimeout(() => {
            banner.style.transform = 'translateY(0)';
            // Adjust body padding to prevent content jump
            document.body.style.paddingTop = banner.offsetHeight + 'px';
        }, 100);
        
        // Add event listeners
        banner.querySelector('.banner-close').addEventListener('click', () => {
            this.closeBanner(banner);
        });
        
        banner.querySelector('.btn-competitive-compare').addEventListener('click', () => {
            this.showComparisonModal(competitor);
        });
        
        // Auto-hide after 30 seconds
        setTimeout(() => {
            if (banner.parentNode) {
                this.closeBanner(banner);
            }
        }, 30000);
    }
    
    closeBanner(banner) {
        banner.style.transform = 'translateY(-100%)';
        document.body.style.paddingTop = '';
        setTimeout(() => {
            if (banner.parentNode) {
                banner.remove();
            }
        }, 500);
    }
    
    showComparisonModal(competitor) {
        const product = this.getProductFromPath();
        const positioning = this.positioningMatrix[product];
        
        if (!positioning) return;
        
        const modal = document.createElement('div');
        modal.className = 'comparison-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10002;
            padding: 2rem;
        `;
        
        const modalContent = document.createElement('div');
        modalContent.style.cssText = `
            background: white;
            border-radius: 16px;
            padding: 2rem;
            max-width: 800px;
            width: 100%;
            max-height: 80vh;
            overflow-y: auto;
        `;
        
        modalContent.innerHTML = this.generateComparisonHTML(competitor, product);
        modal.appendChild(modalContent);
        document.body.appendChild(modal);
        
        // Close on backdrop click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
        
        // Track modal view
        this.trackEvent('comparison_modal_viewed', {
            competitor: competitor.name,
            product: product
        });
    }
    
    generateComparisonHTML(competitor, product) {
        const positioning = this.positioningMatrix[product];
        const advantages = positioning.competitiveAdvantages[competitor.name.toLowerCase().replace(' ', '')] || '';
        
        return `
            <div class="comparison-content">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
                    <h2 style="margin: 0; color: #1f2937;">ResilioTech vs ${competitor.name}</h2>
                    <button onclick="this.closest('.comparison-modal').remove()" style="background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #6b7280;">×</button>
                </div>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-bottom: 2rem;">
                    <div>
                        <h3 style="color: #6366f1; margin-bottom: 1rem;">🚀 ResilioTech ${product === 'devops_suite' ? 'DevOps Suite' : 'Health Monitor'}</h3>
                        <ul style="list-style: none; padding: 0;">
                            ${positioning.primaryDifferentiators.map(diff => 
                                `<li style="margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.5rem;">
                                    <span style="color: #10b981;">✓</span> ${diff}
                                </li>`
                            ).join('')}
                        </ul>
                    </div>
                    
                    <div>
                        <h3 style="color: #6b7280; margin-bottom: 1rem;">${competitor.name}</h3>
                        <ul style="list-style: none; padding: 0;">
                            ${competitor.strengths.map(strength => 
                                `<li style="margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.5rem;">
                                    <span style="color: #10b981;">✓</span> ${strength}
                                </li>`
                            ).join('')}
                        </ul>
                        <h4 style="color: #ef4444; margin-top: 1rem; margin-bottom: 0.5rem;">Common Challenges:</h4>
                        <ul style="list-style: none; padding: 0;">
                            ${competitor.weaknesses.map(weakness => 
                                `<li style="margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.5rem;">
                                    <span style="color: #ef4444;">⚠</span> ${weakness}
                                </li>`
                            ).join('')}
                        </ul>
                    </div>
                </div>
                
                <div style="background: #f3f4f6; padding: 1.5rem; border-radius: 12px; margin-bottom: 2rem;">
                    <h4 style="margin: 0 0 1rem 0; color: #1f2937;">Why Startups Choose Us Over ${competitor.name}:</h4>
                    <p style="margin: 0; color: #374151; line-height: 1.6;">${advantages}</p>
                </div>
                
                <div style="text-align: center;">
                    <a href="#pricing" class="btn" style="background: #6366f1; color: white; padding: 0.75rem 2rem; border-radius: 8px; text-decoration: none; font-weight: 600; margin-right: 1rem;">
                        Start Free Trial
                    </a>
                    <a href="/case-studies/" class="btn-outline" style="border: 1px solid #d1d5db; color: #374151; padding: 0.75rem 2rem; border-radius: 8px; text-decoration: none; font-weight: 600;">
                        See Success Stories
                    </a>
                </div>
            </div>
        `;
    }
    
    updateCompetitiveMessaging(competitorKey) {
        const competitor = this.competitors[competitorKey];
        const product = this.getProductFromPath();
        const positioning = this.positioningMatrix[product];
        
        if (!positioning) return;
        
        // Update hero messaging
        const heroDescription = document.querySelector('.hero-description');
        if (heroDescription && positioning.competitiveAdvantages[competitorKey]) {
            const competitiveMessage = this.generateCompetitiveMessage(competitor, product);
            this.updateElementWithTransition(heroDescription, competitiveMessage);
        }
        
        // Update value propositions
        this.updateValuePropositions(positioning.valueProps);
        
        // Add competitive callouts
        this.addCompetitiveCallouts(competitor, product);
    }
    
    generateCompetitiveMessage(competitor, product) {
        const positioning = this.positioningMatrix[product];
        const baseMessage = positioning.targetPosition;
        const advantage = positioning.competitiveAdvantages[competitor.name.toLowerCase().replace(' ', '')];
        
        return `${baseMessage}. ${advantage ? `Unlike ${competitor.name}, we focus on ${advantage.split(',')[0].toLowerCase()}.` : ''}`;
    }
    
    updateElementWithTransition(element, newText) {
        element.style.transition = 'opacity 0.3s ease';
        element.style.opacity = '0';
        
        setTimeout(() => {
            element.textContent = newText;
            element.style.opacity = '1';
        }, 300);
    }
    
    addCompetitiveCallouts(competitor, product) {
        const positioning = this.positioningMatrix[product];
        const featuresSection = document.querySelector('.features-section');
        
        if (!featuresSection) return;
        
        // Create competitive callout
        const callout = document.createElement('div');
        callout.className = 'competitive-callout';
        callout.style.cssText = `
            background: linear-gradient(135deg, #f0fdf4, #ecfdf5);
            border: 1px solid #10b981;
            border-radius: 12px;
            padding: 1.5rem;
            margin: 2rem 0;
            position: relative;
        `;
        
        callout.innerHTML = `
            <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem;">
                <div style="background: #10b981; color: white; padding: 0.5rem; border-radius: 8px; font-size: 1.25rem;">⚡</div>
                <h3 style="margin: 0; color: #065f46;">Why Startups Switch from ${competitor.name}</h3>
            </div>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
                ${positioning.primaryDifferentiators.map(diff => `
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <span style="color: #10b981;">✓</span>
                        <span style="color: #065f46; font-weight: 500;">${diff}</span>
                    </div>
                `).join('')}
            </div>
        `;
        
        // Insert after section header
        const sectionHeader = featuresSection.querySelector('.section-header');
        if (sectionHeader) {
            sectionHeader.parentNode.insertBefore(callout, sectionHeader.nextSibling);
        }
    }
    
    setupCompetitorTracking() {
        // Track competitor-related searches
        document.addEventListener('DOMContentLoaded', () => {
            this.trackCompetitorSearchTerms();
        });
        
        // Track competitor mention clicks
        document.addEventListener('click', (e) => {
            const competitorLink = e.target.closest('[data-competitor]');
            if (competitorLink) {
                this.trackEvent('competitor_mention_clicked', {
                    competitor: competitorLink.dataset.competitor,
                    context: competitorLink.textContent,
                    page: window.location.pathname
                });
            }
        });
    }
    
    trackCompetitorSearchTerms() {
        const searchTerms = this.getSearchTermsFromSession();
        const competitorMentions = this.findCompetitorMentions(searchTerms);
        
        if (competitorMentions.length > 0) {
            this.trackEvent('competitor_search_detected', {
                terms: searchTerms,
                competitors: competitorMentions,
                page: window.location.pathname
            });
        }
    }
    
    getSearchTermsFromSession() {
        // Try to get search terms from various sources
        const urlParams = new URLSearchParams(window.location.search);
        const q = urlParams.get('q') || urlParams.get('query') || urlParams.get('search');
        
        if (q) return [q.toLowerCase()];
        
        // Check referrer for search terms
        const referrer = document.referrer;
        if (referrer.includes('google.com') || referrer.includes('bing.com')) {
            try {
                const referrerUrl = new URL(referrer);
                const searchTerm = referrerUrl.searchParams.get('q');
                if (searchTerm) return [searchTerm.toLowerCase()];
            } catch (e) {}
        }
        
        return [];
    }
    
    findCompetitorMentions(searchTerms) {
        const mentions = [];
        
        searchTerms.forEach(term => {
            Object.keys(this.competitors).forEach(key => {
                const competitor = this.competitors[key];
                if (term.includes(competitor.name.toLowerCase()) || 
                    term.includes(key)) {
                    mentions.push(key);
                }
            });
        });
        
        return [...new Set(mentions)];
    }
    
    matchSearchTermsToCompetitors(searchTerms) {
        const mentions = this.findCompetitorMentions(searchTerms);
        return mentions.length > 0 ? mentions[0] : null;
    }
    
    startRealTimeMonitoring() {
        if (!this.config.enableRealTimeTracking) return;
        
        // Start monitoring competitor activity
        this.realTimeMonitoring.start();
        
        // Update competitor data periodically
        setInterval(() => {
            this.updateCompetitorData();
        }, this.config.updateInterval);
    }
    
    updateCompetitorData() {
        // This would typically fetch from an API
        // For now, simulate updates
        Object.keys(this.competitors).forEach(key => {
            this.competitors[key].lastUpdated = Date.now();
        });
        
        this.trackEvent('competitor_data_updated', {
            timestamp: Date.now(),
            competitors: Object.keys(this.competitors).length
        });
    }
    
    getProductFromPath() {
        const path = window.location.pathname;
        if (path.includes('devops-suite')) return 'devops_suite';
        if (path.includes('health-monitor')) return 'health_monitor';
        return 'general';
    }
    
    trackEvent(eventName, properties = {}) {
        // Track with analytics systems
        if (window.analyticsManager) {
            window.analyticsManager.trackEvent(`competitive_${eventName}`, properties);
        }
        
        if (window.leadScoringSystem) {
            window.leadScoringSystem.trackBehavior(`competitive_${eventName}`, properties);
        }
        
        console.log(`Competitive Event: ${eventName}`, properties);
    }
    
    // Public API
    getCompetitorContext() {
        return this.currentCompetitorContext;
    }
    
    getCompetitorData(competitorKey) {
        return this.competitors[competitorKey];
    }
    
    getAllCompetitors() {
        return this.competitors;
    }
    
    activateBattleCard(competitorKey) {
        this.activateCompetitiveBattleCard(competitorKey);
    }
}

// Competitive Messaging System
class CompetitiveMessaging {
    constructor() {
        this.messages = this.initializeMessages();
    }
    
    initializeMessages() {
        return {
            jenkins: {
                hero: 'Modern DevOps without the maintenance headaches',
                cta: 'Skip the setup complexity - start in minutes',
                value_props: ['Zero maintenance', 'Modern UI', 'Cloud-native']
            },
            circleci: {
                hero: 'Transparent pricing that scales with your team',
                cta: 'Simple pricing, powerful features',
                value_props: ['No credit confusion', 'Startup-focused', 'All features included']
            },
            githubactions: {
                hero: 'DevOps beyond GitHub - support all your repositories',
                cta: 'Multi-VCS DevOps platform',
                value_props: ['Any Git provider', 'Advanced monitoring', 'Enterprise features']
            }
        };
    }
    
    getMessage(competitorKey, messageType) {
        return this.messages[competitorKey]?.[messageType];
    }
}

// Battle Cards System
class BattleCards {
    constructor() {
        this.cards = this.initializeBattleCards();
    }
    
    initializeBattleCards() {
        return {
            jenkins: {
                whenToUse: 'Prospect mentions Jenkins complexity or maintenance issues',
                keyMessages: [
                    'Jenkins requires dedicated DevOps engineers - we handle that for you',
                    'Modern UI vs outdated Jenkins interface',
                    'Cloud-native vs self-hosted maintenance'
                ],
                objectionHandling: {
                    'We need full control': 'You get full control through our API and configuration - without the ops overhead',
                    'Jenkins is free': 'True, but what about the DevOps engineer salary to maintain it?'
                }
            }
        };
    }
    
    getBattleCard(competitorKey) {
        return this.cards[competitorKey];
    }
}

// Real-time Competitor Monitoring
class CompetitorMonitoring {
    constructor() {
        this.monitoringActive = false;
        this.alerts = [];
    }
    
    start() {
        this.monitoringActive = true;
        console.log('Competitor monitoring started');
    }
    
    stop() {
        this.monitoringActive = false;
    }
    
    addAlert(alert) {
        this.alerts.push({
            ...alert,
            timestamp: Date.now(),
            id: Math.random().toString(36).substr(2, 9)
        });
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.competitiveAnalysis = new CompetitiveAnalysisSystem();
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { 
        CompetitiveAnalysisSystem, 
        CompetitiveMessaging, 
        BattleCards, 
        CompetitorMonitoring 
    };
}