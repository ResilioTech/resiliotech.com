/**
 * Interactive Demos and Advanced UX Components
 * Includes ROI calculator, automation demos, and personalized content
 */

class InteractiveDemos {
    constructor() {
        this.config = {
            enableAnimations: !window.matchMedia('(prefers-reduced-motion: reduce)').matches,
            enablePersonalization: true,
            debugMode: window.location.hostname === 'localhost'
        };
        
        this.userPreferences = this.loadUserPreferences();
        this.demoData = {
            automationScenarios: [],
            roiCalculations: {},
            userInteractions: []
        };
        
        this.init();
    }

    init() {
        this.log('Interactive Demos initializing...');
        
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initialize());
        } else {
            this.initialize();
        }
    }

    initialize() {
        this.setupInteractiveROI();
        this.setupAutomationDemos();
        this.setupPersonalization();
        this.setupAdvancedAnimations();
        this.setupInteractiveElements();
        this.setupABTesting();
        
        this.log('Interactive Demos initialized');
    }

    // Enhanced ROI Calculator with Interactive Scenarios
    setupInteractiveROI() {
        this.createInteractiveROIWidget();
        this.createAutomationScenarios();
        this.createComparisonTool();
    }

    createInteractiveROIWidget() {
        const roiContainer = document.getElementById('roi-widget');
        if (!roiContainer) {
            this.createROIWidget();
            return;
        }

        // Enhanced ROI calculator with real-time updates
        const widget = document.createElement('div');
        widget.className = 'interactive-roi-widget';
        widget.innerHTML = this.getROIWidgetHTML();
        
        roiContainer.appendChild(widget);
        this.bindROIEvents(widget);
    }

    createROIWidget() {
        // Create ROI widget if it doesn't exist
        const section = document.createElement('section');
        section.id = 'interactive-roi';
        section.className = 'interactive-section';
        section.innerHTML = `
            <div class="container">
                <div class="roi-header">
                    <h2>Calculate Your Automation ROI</h2>
                    <p>See how much time and money you could save with our automation solutions</p>
                </div>
                <div id="roi-widget" class="roi-widget-container"></div>
            </div>
        `;
        
        // Insert after services section
        const servicesSection = document.getElementById('services');
        if (servicesSection) {
            servicesSection.parentNode.insertBefore(section, servicesSection.nextSibling);
        }
        
        this.createInteractiveROIWidget();
    }

    getROIWidgetHTML() {
        return `
            <div class="roi-calculator-advanced">
                <div class="roi-inputs-section">
                    <h3>Your Current Situation</h3>
                    
                    <div class="input-group">
                        <label for="team-size">Development Team Size</label>
                        <div class="slider-container">
                            <input type="range" id="team-size" min="1" max="50" value="5" class="roi-slider">
                            <span class="slider-value" id="team-size-value">5 developers</span>
                        </div>
                    </div>
                    
                    <div class="input-group">
                        <label for="deploy-frequency">Deployments per Week</label>
                        <div class="slider-container">
                            <input type="range" id="deploy-frequency" min="1" max="50" value="10" class="roi-slider">
                            <span class="slider-value" id="deploy-frequency-value">10 deployments</span>
                        </div>
                    </div>
                    
                    <div class="input-group">
                        <label for="deploy-time">Minutes per Deployment</label>
                        <div class="slider-container">
                            <input type="range" id="deploy-time" min="5" max="180" value="45" class="roi-slider">
                            <span class="slider-value" id="deploy-time-value">45 minutes</span>
                        </div>
                    </div>
                    
                    <div class="input-group">
                        <label for="incident-frequency">Production Incidents per Month</label>
                        <div class="slider-container">
                            <input type="range" id="incident-frequency" min="0" max="20" value="4" class="roi-slider">
                            <span class="slider-value" id="incident-frequency-value">4 incidents</span>
                        </div>
                    </div>
                    
                    <div class="input-group">
                        <label for="resolution-time">Hours to Resolve Incidents</label>
                        <div class="slider-container">
                            <input type="range" id="resolution-time" min="1" max="24" value="4" class="roi-slider">
                            <span class="slider-value" id="resolution-time-value">4 hours</span>
                        </div>
                    </div>
                    
                    <div class="input-group">
                        <label for="hourly-rate">Average Developer Hourly Rate ($)</label>
                        <div class="slider-container">
                            <input type="range" id="hourly-rate" min="50" max="200" value="100" class="roi-slider">
                            <span class="slider-value" id="hourly-rate-value">$100/hour</span>
                        </div>
                    </div>
                </div>
                
                <div class="roi-results-section">
                    <h3>Automation Impact</h3>
                    
                    <div class="roi-metrics-grid">
                        <div class="metric-card time-saved">
                            <div class="metric-icon">⏱️</div>
                            <div class="metric-content">
                                <h4>Time Saved Monthly</h4>
                                <div class="metric-value" id="time-saved">0 hours</div>
                                <div class="metric-breakdown">
                                    <small>
                                        <span id="deploy-time-saved">0h deployment</span> + 
                                        <span id="incident-time-saved">0h incidents</span>
                                    </small>
                                </div>
                            </div>
                        </div>
                        
                        <div class="metric-card cost-savings">
                            <div class="metric-icon">💰</div>
                            <div class="metric-content">
                                <h4>Monthly Savings</h4>
                                <div class="metric-value" id="monthly-savings">$0</div>
                                <div class="metric-breakdown">
                                    <small id="annual-savings">$0 annually</small>
                                </div>
                            </div>
                        </div>
                        
                        <div class="metric-card productivity">
                            <div class="metric-icon">📈</div>
                            <div class="metric-content">
                                <h4>Productivity Increase</h4>
                                <div class="metric-value" id="productivity-gain">0%</div>
                                <div class="metric-breakdown">
                                    <small>More time for feature development</small>
                                </div>
                            </div>
                        </div>
                        
                        <div class="metric-card reliability">
                            <div class="metric-icon">🛡️</div>
                            <div class="metric-content">
                                <h4>Reliability Improvement</h4>
                                <div class="metric-value" id="reliability-improvement">0%</div>
                                <div class="metric-breakdown">
                                    <small>Fewer production issues</small>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="roi-visualization">
                        <canvas id="roi-chart" width="400" height="200"></canvas>
                    </div>
                    
                    <div class="roi-actions">
                        <button class="btn btn-primary roi-cta" onclick="window.leadMagnetManager?.openModal('auditModal')">
                            Get Your Free Audit
                        </button>
                        <button class="btn btn-secondary share-roi">
                            Share These Results
                        </button>
                    </div>
                </div>
            </div>
            
            <div class="automation-preview">
                <h3>What This Looks Like</h3>
                <div class="automation-scenarios">
                    <div class="scenario-tabs">
                        <button class="scenario-tab active" data-scenario="deployment">Deployment</button>
                        <button class="scenario-tab" data-scenario="monitoring">Monitoring</button>
                        <button class="scenario-tab" data-scenario="scaling">Scaling</button>
                    </div>
                    <div class="scenario-content" id="scenario-content">
                        <!-- Dynamic content based on selected scenario -->
                    </div>
                </div>
            </div>
        `;
    }

    bindROIEvents(widget) {
        const sliders = widget.querySelectorAll('.roi-slider');
        sliders.forEach(slider => {
            slider.addEventListener('input', (e) => {
                this.updateSliderValue(e.target);
                this.calculateROI();
            });
            
            // Initialize slider fill on page load
            this.updateSliderValue(slider);
        });

        // Scenario tabs
        const tabs = widget.querySelectorAll('.scenario-tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                this.switchScenario(e.target.dataset.scenario);
            });
        });

        // Share button
        const shareBtn = widget.querySelector('.share-roi');
        if (shareBtn) {
            shareBtn.addEventListener('click', () => this.shareROIResults());
        }

        // Initial calculation
        this.calculateROI();
        this.switchScenario('deployment');
    }

    updateSliderValue(slider) {
        const valueSpan = document.getElementById(`${slider.id}-value`);
        if (!valueSpan) return;

        // Calculate percentage for fill and update slider background
        const percentage = ((slider.value - slider.min) / (slider.max - slider.min)) * 100;
        
        // Create gradient background for filled effect
        const gradientBg = `linear-gradient(90deg, 
            var(--primary-color) 0%, 
            var(--primary-light) ${percentage}%, 
            var(--background-dark) ${percentage}%, 
            var(--background-dark) 100%)`;
        
        slider.style.background = gradientBg;

        let displayValue;
        switch (slider.id) {
            case 'team-size':
                displayValue = `${slider.value} developer${slider.value > 1 ? 's' : ''}`;
                break;
            case 'deploy-frequency':
                displayValue = `${slider.value} deployment${slider.value > 1 ? 's' : ''}`;
                break;
            case 'deploy-time':
                displayValue = `${slider.value} minutes`;
                break;
            case 'incident-frequency':
                displayValue = `${slider.value} incident${slider.value > 1 ? 's' : ''}`;
                break;
            case 'resolution-time':
                displayValue = `${slider.value} hour${slider.value > 1 ? 's' : ''}`;
                break;
            case 'hourly-rate':
                displayValue = `$${slider.value}/hour`;
                break;
            default:
                displayValue = slider.value;
        }
        
        valueSpan.textContent = displayValue;
    }

    calculateROI() {
        const inputs = this.getROIInputs();
        const results = this.computeROIMetrics(inputs);
        
        this.updateROIDisplay(results);
        this.updateROIChart(results);
        
        // Store for analytics
        this.demoData.roiCalculations = { inputs, results, timestamp: Date.now() };
        
        // Track interaction
        if (window.analyticsManager) {
            window.analyticsManager.trackEvent('roi_calculator_updated', {
                monthly_savings: results.monthlySavings,
                time_saved: results.timeSaved,
                team_size: inputs.teamSize
            });
        }
    }

    getROIInputs() {
        return {
            teamSize: parseInt(document.getElementById('team-size')?.value || 5),
            deployFrequency: parseInt(document.getElementById('deploy-frequency')?.value || 10),
            deployTime: parseInt(document.getElementById('deploy-time')?.value || 45),
            incidentFrequency: parseInt(document.getElementById('incident-frequency')?.value || 4),
            resolutionTime: parseInt(document.getElementById('resolution-time')?.value || 4),
            hourlyRate: parseInt(document.getElementById('hourly-rate')?.value || 100)
        };
    }

    computeROIMetrics(inputs) {
        // Validate inputs
        if (!inputs.teamSize || !inputs.deployFrequency || !inputs.hourlyRate) {
            console.warn('Missing required inputs for ROI calculation');
            return this.getDefaultResults();
        }
        
        // Convert deployment time from minutes to hours monthly
        const weeklyDeployMinutes = inputs.deployFrequency * inputs.deployTime;
        const monthlyDeployMinutes = weeklyDeployMinutes * 4.33; // Average weeks per month
        const monthlyDeployHours = monthlyDeployMinutes / 60;
        
        // Monthly incident resolution time in hours
        const monthlyIncidentHours = inputs.incidentFrequency * inputs.resolutionTime;
        
        // Automation savings (75% deployment time reduction, 60% incident reduction)
        const deployTimeSavedHours = monthlyDeployHours * 0.75;
        const incidentTimeSavedHours = monthlyIncidentHours * 0.60;
        const totalTimeSavedHours = deployTimeSavedHours + incidentTimeSavedHours;
        
        // Calculate monetary savings
        const monthlySavings = totalTimeSavedHours * inputs.hourlyRate;
        const annualSavings = monthlySavings * 12;
        
        // Productivity calculation: time saved as % of total productive time
        const totalMonthlyWorkHours = 40 * 4.33 * inputs.teamSize; // Total team hours per month
        const currentWastedHours = monthlyDeployHours + monthlyIncidentHours;
        const currentProductiveHours = Math.max(totalMonthlyWorkHours - currentWastedHours, 1); // Prevent division by zero
        
        // Productivity increase: saved time + 25% efficiency boost
        const efficiencyBoost = currentProductiveHours * 0.25;
        const totalProductivityGain = totalTimeSavedHours + efficiencyBoost;
        const productivityIncrease = (totalProductivityGain / currentProductiveHours) * 100;
        
        // Reliability improvement (60% incident reduction)
        const reliabilityImprovement = 60;
        
        return {
            timeSaved: Math.round(totalTimeSavedHours),
            deployTimeSaved: Math.round(deployTimeSavedHours),
            incidentTimeSaved: Math.round(incidentTimeSavedHours),
            monthlySavings: Math.round(monthlySavings),
            annualSavings: Math.round(annualSavings),
            productivityIncrease: Math.round(Math.max(productivityIncrease, 0)), // Ensure non-negative
            reliabilityImprovement: reliabilityImprovement
        };
    }

    getDefaultResults() {
        return {
            timeSaved: 0,
            deployTimeSaved: 0,
            incidentTimeSaved: 0,
            monthlySavings: 0,
            annualSavings: 0,
            productivityIncrease: 0,
            reliabilityImprovement: 0
        };
    }

    updateROIDisplay(results) {
        const updates = [
            { id: 'time-saved', value: `${results.timeSaved} hours` },
            { id: 'deploy-time-saved', value: `${results.deployTimeSaved}h deployment` },
            { id: 'incident-time-saved', value: `${results.incidentTimeSaved}h incidents` },
            { id: 'monthly-savings', value: `$${results.monthlySavings.toLocaleString()}` },
            { id: 'annual-savings', value: `$${results.annualSavings.toLocaleString()} annually` },
            { id: 'productivity-gain', value: `${results.productivityIncrease}%` },
            { id: 'reliability-improvement', value: `${results.reliabilityImprovement}%` }
        ];

        updates.forEach(update => {
            const element = document.getElementById(update.id);
            if (element) {
                this.animateValue(element, element.textContent, update.value);
            }
        });
    }

    animateValue(element, from, to) {
        if (!this.config.enableAnimations) {
            element.textContent = to;
            return;
        }

        element.style.transform = 'scale(1.1)';
        element.style.transition = 'transform 0.2s ease';
        
        setTimeout(() => {
            element.textContent = to;
            element.style.transform = 'scale(1)';
        }, 100);
    }

    updateROIChart(results) {
        const canvas = document.getElementById('roi-chart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Simple bar chart showing savings over time
        const data = [
            { label: 'Month 1', value: results.monthlySavings },
            { label: 'Month 3', value: results.monthlySavings * 3 },
            { label: 'Month 6', value: results.monthlySavings * 6 },
            { label: 'Year 1', value: results.annualSavings }
        ];

        this.drawBarChart(ctx, data, canvas.width, canvas.height);
    }

    drawBarChart(ctx, data, width, height) {
        const padding = 40;
        const barWidth = (width - padding * 2) / data.length;
        const maxValue = Math.max(...data.map(d => d.value));
        
        ctx.fillStyle = '#6366f1';
        
        data.forEach((item, index) => {
            const barHeight = (item.value / maxValue) * (height - padding * 2);
            const x = padding + index * barWidth + barWidth * 0.1;
            const y = height - padding - barHeight;
            const w = barWidth * 0.8;
            
            ctx.fillRect(x, y, w, barHeight);
            
            // Labels
            ctx.fillStyle = '#ffffff';
            ctx.font = '12px Inter';
            ctx.textAlign = 'center';
            ctx.fillText(item.label, x + w/2, height - 10);
            
            // Values
            ctx.fillText(`$${(item.value/1000).toFixed(0)}k`, x + w/2, y - 5);
            
            ctx.fillStyle = '#6366f1';
        });
    }

    switchScenario(scenario) {
        const tabs = document.querySelectorAll('.scenario-tab');
        tabs.forEach(tab => {
            tab.classList.toggle('active', tab.dataset.scenario === scenario);
        });

        const content = document.getElementById('scenario-content');
        if (content) {
            content.innerHTML = this.getScenarioContent(scenario);
            this.animateScenarioChange(content);
        }
    }

    getScenarioContent(scenario) {
        const scenarios = {
            deployment: `
                <div class="scenario-demo">
                    <h4>Automated Deployment Pipeline</h4>
                    <div class="demo-steps">
                        <div class="step step-before">
                            <h5>Before Automation</h5>
                            <div class="step-timeline">
                                <div class="timeline-item">1. Manual testing (2 hours)</div>
                                <div class="timeline-item">2. Manual deployment (30 min)</div>
                                <div class="timeline-item">3. Manual verification (15 min)</div>
                                <div class="timeline-item">4. Manual rollback if issues (1 hour)</div>
                            </div>
                            <div class="step-result">Total: ~3.75 hours per deployment</div>
                        </div>
                        <div class="step step-after">
                            <h5>After Automation</h5>
                            <div class="step-timeline">
                                <div class="timeline-item">1. Automated testing (5 min)</div>
                                <div class="timeline-item">2. Automated deployment (2 min)</div>
                                <div class="timeline-item">3. Automated health checks (1 min)</div>
                                <div class="timeline-item">4. Automatic rollback if needed (30 sec)</div>
                            </div>
                            <div class="step-result">Total: ~8 minutes per deployment</div>
                        </div>
                    </div>
                </div>
            `,
            monitoring: `
                <div class="scenario-demo">
                    <h4>Intelligent Monitoring & Alerting</h4>
                    <div class="demo-steps">
                        <div class="step step-before">
                            <h5>Before Automation</h5>
                            <div class="step-timeline">
                                <div class="timeline-item">1. Manual log checking (daily)</div>
                                <div class="timeline-item">2. Reactive problem discovery</div>
                                <div class="timeline-item">3. Manual investigation (2-4 hours)</div>
                                <div class="timeline-item">4. Manual resolution process</div>
                            </div>
                            <div class="step-result">Average: 4 hours per incident</div>
                        </div>
                        <div class="step step-after">
                            <h5>After Automation</h5>
                            <div class="step-timeline">
                                <div class="timeline-item">1. Real-time anomaly detection</div>
                                <div class="timeline-item">2. Automated alerting with context</div>
                                <div class="timeline-item">3. Automated diagnostics (2 min)</div>
                                <div class="timeline-item">4. Suggested fix with 1-click resolution</div>
                            </div>
                            <div class="step-result">Average: 15 minutes per incident</div>
                        </div>
                    </div>
                </div>
            `,
            scaling: `
                <div class="scenario-demo">
                    <h4>Auto-Scaling Infrastructure</h4>
                    <div class="demo-steps">
                        <div class="step step-before">
                            <h5>Before Automation</h5>
                            <div class="step-timeline">
                                <div class="timeline-item">1. Manual capacity planning</div>
                                <div class="timeline-item">2. Over-provisioning for peak loads</div>
                                <div class="timeline-item">3. Manual scaling during events</div>
                                <div class="timeline-item">4. High infrastructure costs</div>
                            </div>
                            <div class="step-result">50-80% resource waste during normal times</div>
                        </div>
                        <div class="step step-after">
                            <h5>After Automation</h5>
                            <div class="step-timeline">
                                <div class="timeline-item">1. Predictive scaling algorithms</div>
                                <div class="timeline-item">2. Real-time demand matching</div>
                                <div class="timeline-item">3. Automatic resource optimization</div>
                                <div class="timeline-item">4. Cost-optimized infrastructure</div>
                            </div>
                            <div class="step-result">60-80% cost reduction on infrastructure</div>
                        </div>
                    </div>
                </div>
            `
        };

        return scenarios[scenario] || '';
    }

    animateScenarioChange(element) {
        if (!this.config.enableAnimations) return;

        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            element.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, 50);
    }

    shareROIResults() {
        const results = this.demoData.roiCalculations?.results;
        if (!results) return;

        const shareText = `I could save $${results.monthlySavings.toLocaleString()}/month with DevOps automation! Check out your potential savings: ${window.location.href}`;

        if (navigator.share) {
            navigator.share({
                title: 'My DevOps Automation ROI',
                text: shareText,
                url: window.location.href
            });
        } else {
            // Fallback to clipboard
            navigator.clipboard.writeText(shareText).then(() => {
                this.showNotification('Results copied to clipboard!');
            });
        }
    }

    // Automation Demos
    setupAutomationDemos() {
        this.createCodeDeploymentDemo();
        this.createMonitoringDemo();
    }

    createCodeDeploymentDemo() {
        // Interactive demo showing before/after deployment process
        // This would be a visual demo with animated steps
    }

    // Personalization System
    setupPersonalization() {
        if (!this.config.enablePersonalization) return;

        this.detectUserContext();
        this.personalizeContent();
        this.trackUserBehavior();
    }

    detectUserContext() {
        // Detect user context from various signals
        const context = {
            timeOfDay: this.getTimeOfDay(),
            deviceType: this.getDeviceType(),
            trafficSource: this.getTrafficSource(),
            returningVisitor: this.isReturningVisitor(),
            engagementLevel: this.getEngagementLevel()
        };

        this.userPreferences.context = context;
        this.saveUserPreferences();
    }

    personalizeContent() {
        const context = this.userPreferences.context;
        
        // Personalize CTAs based on time of day
        if (context.timeOfDay === 'evening') {
            this.updateCTAs('Schedule a call tomorrow', 'morning');
        }
        
        // Personalize content based on device
        if (context.deviceType === 'mobile') {
            this.optimizeForMobile();
        }
        
        // Show relevant content for returning visitors
        if (context.returningVisitor) {
            this.showReturningVisitorContent();
        }
    }

    // Advanced Animations
    setupAdvancedAnimations() {
        if (!this.config.enableAnimations) return;

        this.setupScrollAnimations();
        this.setupHoverEffects();
        this.setupLoadingAnimations();
    }

    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateElement(entry.target);
                }
            });
        }, observerOptions);

        document.querySelectorAll('[data-animate]').forEach(el => {
            observer.observe(el);
        });
    }

    animateElement(element) {
        const animation = element.dataset.animate;
        element.classList.add('animated', animation);
    }

    // A/B Testing Setup
    setupABTesting() {
        this.abTests = {
            'cta-text': {
                variants: ['Get Free Audit', 'Start Automation Today', 'Launch Faster Now'],
                current: 0
            },
            'hero-message': {
                variants: [
                    'We automate tech ops for early-stage startups',
                    'Launch faster with automated DevOps',
                    'Scale without scaling your ops team'
                ],
                current: 0
            }
        };

        this.runABTests();
    }

    runABTests() {
        Object.keys(this.abTests).forEach(testName => {
            const test = this.abTests[testName];
            const variant = this.getABTestVariant(testName);
            test.current = variant;
            
            this.applyABTestVariant(testName, variant);
        });
    }

    getABTestVariant(testName) {
        // Simple hash-based assignment for consistency
        const userId = this.getUserId();
        const hash = this.simpleHash(userId + testName);
        const numVariants = this.abTests[testName].variants.length;
        return hash % numVariants;
    }

    applyABTestVariant(testName, variant) {
        const test = this.abTests[testName];
        const variantText = test.variants[variant];
        
        switch (testName) {
            case 'cta-text':
                document.querySelectorAll('.nav-cta').forEach(el => {
                    el.textContent = variantText;
                });
                break;
            case 'hero-message':
                const heroTitle = document.querySelector('.hero-title-main');
                if (heroTitle) {
                    heroTitle.textContent = variantText;
                }
                break;
        }

        // Track A/B test exposure
        if (window.analyticsManager) {
            window.analyticsManager.trackEvent('ab_test_exposure', {
                test_name: testName,
                variant: variant,
                variant_text: variantText
            });
        }
    }

    // Utility Methods
    getUserId() {
        let userId = localStorage.getItem('user_id');
        if (!userId) {
            userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('user_id', userId);
        }
        return userId;
    }

    simpleHash(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return Math.abs(hash);
    }

    loadUserPreferences() {
        const saved = localStorage.getItem('user_preferences');
        return saved ? JSON.parse(saved) : {
            context: {},
            interactions: [],
            preferences: {}
        };
    }

    saveUserPreferences() {
        localStorage.setItem('user_preferences', JSON.stringify(this.userPreferences));
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--primary-color);
            color: white;
            padding: 12px 20px;
            border-radius: 6px;
            box-shadow: var(--shadow-lg);
            z-index: 10000;
            animation: slideInRight 0.3s ease-out;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    log(...args) {
        if (this.config.debugMode) {
            console.log('[Interactive Demos]', ...args);
        }
    }

    // Helper methods for personalization
    getTimeOfDay() {
        const hour = new Date().getHours();
        if (hour < 12) return 'morning';
        if (hour < 17) return 'afternoon';
        return 'evening';
    }

    getDeviceType() {
        const width = window.innerWidth;
        if (width < 768) return 'mobile';
        if (width < 1024) return 'tablet';
        return 'desktop';
    }

    getTrafficSource() {
        return document.referrer ? new URL(document.referrer).hostname : 'direct';
    }

    isReturningVisitor() {
        return localStorage.getItem('visited_before') === 'true';
    }

    getEngagementLevel() {
        const interactions = this.userPreferences.interactions?.length || 0;
        if (interactions > 10) return 'high';
        if (interactions > 3) return 'medium';
        return 'low';
    }
}

// Initialize interactive demos
document.addEventListener('DOMContentLoaded', () => {
    window.interactiveDemos = new InteractiveDemos();
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = InteractiveDemos;
}