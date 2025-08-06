/**
 * DevOps Automation Suite Product Page JavaScript
 * Handles interactive demos, pricing calculator, and product-specific functionality
 */

class DevOpsSuiteManager {
    constructor() {
        this.pricingData = {
            starter: {
                monthly: 0,
                annual: 0
            },
            professional: {
                monthly: 49,
                annual: 39
            },
            enterprise: {
                monthly: 199,
                annual: 159
            }
        };
        
        this.demoState = {
            currentTab: 'pipeline',
            pipelineRunning: false,
            pipelineStep: 0
        };
        
        this.init();
    }
    
    init() {
        this.initializePricingToggle();
        this.initializeDemoTabs();
        this.initializePipelineDemo();
        this.setupAnalyticsTracking();
        this.animateHeroStats();
        
        console.log('DevOps Suite Manager initialized');
    }
    
    initializePricingToggle() {
        const pricingSwitch = document.getElementById('pricing-switch');
        const priceAmounts = document.querySelectorAll('.price-amount');
        
        if (pricingSwitch) {
            pricingSwitch.addEventListener('click', () => {
                pricingSwitch.classList.toggle('annual');
                const isAnnual = pricingSwitch.classList.contains('annual');
                
                priceAmounts.forEach(amount => {
                    const monthlyPrice = amount.dataset.monthly;
                    const annualPrice = amount.dataset.annual;
                    const price = isAnnual ? annualPrice : monthlyPrice;
                    
                    // Animate price change
                    amount.style.transform = 'scale(1.1)';
                    setTimeout(() => {
                        amount.textContent = price === '0' ? '$0' : `$${price}`;
                        amount.style.transform = 'scale(1)';
                    }, 150);
                });
                
                // Track pricing toggle
                this.trackEvent('pricing_toggle', {
                    period: isAnnual ? 'annual' : 'monthly'
                });
            });
        }
    }
    
    initializeDemoTabs() {
        const demoTabs = document.querySelectorAll('.demo-tab');
        const demoPanels = document.querySelectorAll('.demo-panel');
        
        demoTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const targetDemo = tab.dataset.demo;
                
                // Update active tab
                demoTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                // Update active panel
                demoPanels.forEach(panel => {
                    panel.classList.remove('active');
                    if (panel.dataset.panel === targetDemo) {
                        panel.classList.add('active');
                    }
                });
                
                this.demoState.currentTab = targetDemo;
                
                // Track demo tab change
                this.trackEvent('demo_tab_change', {
                    tab: targetDemo
                });
            });
        });
    }
    
    initializePipelineDemo() {
        const triggerBtn = document.getElementById('trigger-pipeline');
        const pipelineSteps = document.querySelectorAll('.pipeline-step');
        
        if (triggerBtn) {
            triggerBtn.addEventListener('click', () => {
                this.runPipelineDemo();
            });
        }
        
        // Auto-run demo every 10 seconds if user hasn't interacted
        let autoRunTimer = setInterval(() => {
            if (!this.demoState.pipelineRunning) {
                this.runPipelineDemo();
            }
        }, 10000);
        
        // Clear auto-run on user interaction
        document.addEventListener('click', () => {
            clearInterval(autoRunTimer);
            autoRunTimer = setInterval(() => {
                if (!this.demoState.pipelineRunning) {
                    this.runPipelineDemo();
                }
            }, 15000);
        });
    }
    
    async runPipelineDemo() {
        if (this.demoState.pipelineRunning) return;
        
        this.demoState.pipelineRunning = true;
        const steps = ['source', 'build', 'test', 'deploy'];
        const pipelineSteps = document.querySelectorAll('.pipeline-step');
        
        // Reset all steps
        pipelineSteps.forEach(step => {
            step.classList.remove('success', 'running');
            const status = step.querySelector('.step-status');
            if (status) status.textContent = '⏸️';
        });
        
        // Track demo start
        this.trackEvent('pipeline_demo_start', {
            source: 'button_click'
        });
        
        // Run through each step
        for (let i = 0; i < steps.length; i++) {
            const stepElement = document.querySelector(`[data-step="${steps[i]}"]`);
            if (stepElement) {
                // Set current step to running
                stepElement.classList.add('running');
                const status = stepElement.querySelector('.step-status');
                if (status) status.textContent = '⚡';
                
                // Wait for step duration
                const duration = i === 0 ? 500 : (i === 1 ? 2000 : (i === 2 ? 1500 : 1000));
                await this.delay(duration);
                
                // Complete current step
                stepElement.classList.remove('running');
                stepElement.classList.add('success');
                if (status) status.textContent = '✅';
            }
        }
        
        this.demoState.pipelineRunning = false;
        
        // Track demo completion
        this.trackEvent('pipeline_demo_complete', {
            duration: 5000
        });
    }
    
    animateHeroStats() {
        const statNumbers = document.querySelectorAll('.stat-number');
        
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.animateCounter(entry.target);
                        observer.unobserve(entry.target);
                    }
                });
            });
            
            statNumbers.forEach(stat => observer.observe(stat));
        }
    }
    
    animateCounter(element) {
        const text = element.textContent;
        const number = parseFloat(text.replace(/[^\\d.-]/g, ''));
        const suffix = text.replace(/[\\d.-]/g, '');
        
        if (isNaN(number)) return;
        
        const duration = 2000;
        const steps = 60;
        const stepValue = number / steps;
        const stepDuration = duration / steps;
        
        let currentValue = 0;
        let currentStep = 0;
        
        const timer = setInterval(() => {
            currentValue += stepValue;
            currentStep++;
            
            if (currentStep >= steps) {
                currentValue = number;
                clearInterval(timer);
            }
            
            element.textContent = Math.round(currentValue) + suffix;
        }, stepDuration);
    }
    
    setupAnalyticsTracking() {
        // Track CTA clicks
        document.querySelectorAll('[data-track="cta_click"]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.trackEvent('cta_click', {
                    source: e.target.dataset.source || 'unknown',
                    text: e.target.textContent.trim(),
                    href: e.target.href
                });
            });
        });
        
        // Track demo requests
        document.querySelectorAll('[data-track="demo_request"]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.trackEvent('demo_request', {
                    source: e.target.dataset.source || 'unknown',
                    page: 'devops-suite'
                });
            });
        });
        
        // Track pricing plan selections
        document.querySelectorAll('[data-plan]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.trackEvent('pricing_plan_click', {
                    plan: e.target.dataset.plan,
                    action: e.target.textContent.trim()
                });
            });
        });
        
        // Track feature interest via scroll depth
        this.trackScrollDepth();
        
        // Track time spent on page
        this.trackTimeOnPage();
    }
    
    trackScrollDepth() {
        const sections = document.querySelectorAll('section[id]');
        const sectionMap = new Map();
        
        sections.forEach(section => {
            sectionMap.set(section.id, false);
        });
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
                    const sectionId = entry.target.id;
                    if (!sectionMap.get(sectionId)) {
                        sectionMap.set(sectionId, true);
                        this.trackEvent('section_view', {
                            section: sectionId,
                            page: 'devops-suite'
                        });
                    }
                }
            });
        }, { threshold: 0.5 });
        
        sections.forEach(section => observer.observe(section));
    }
    
    trackTimeOnPage() {
        let startTime = Date.now();
        let isActive = true;
        
        // Track when user becomes inactive
        let inactivityTimer;
        const resetInactivityTimer = () => {
            clearTimeout(inactivityTimer);
            isActive = true;
            inactivityTimer = setTimeout(() => {
                isActive = false;
            }, 30000); // 30 seconds of inactivity
        };
        
        ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'].forEach(event => {
            document.addEventListener(event, resetInactivityTimer, true);
        });
        
        resetInactivityTimer();
        
        // Track time on page when user leaves
        window.addEventListener('beforeunload', () => {
            const timeSpent = Math.round((Date.now() - startTime) / 1000);
            if (timeSpent > 10) { // Only track if user spent more than 10 seconds
                this.trackEvent('time_on_page', {
                    duration: timeSpent,
                    page: 'devops-suite',
                    was_active: isActive
                });
            }
        });
        
        // Track periodic time milestones
        const milestones = [30, 60, 120, 300]; // 30s, 1m, 2m, 5m
        milestones.forEach(milestone => {
            setTimeout(() => {
                if (isActive) {
                    this.trackEvent('time_milestone', {
                        milestone: milestone,
                        page: 'devops-suite'
                    });
                }
            }, milestone * 1000);
        });
    }
    
    trackEvent(eventName, properties = {}) {
        // Track with lead scoring system
        if (window.leadScoringSystem) {
            window.leadScoringSystem.trackBehavior(eventName, {
                ...properties,
                product: 'devops-suite',
                page: window.location.pathname
            });
        }
        
        // Track with analytics manager
        if (window.analyticsManager) {
            window.analyticsManager.trackEvent(eventName, {
                ...properties,
                product: 'devops-suite',
                timestamp: new Date().toISOString()
            });
        }
    }
    
    // Utility method
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    // Public API methods
    getCurrentPricing() {
        const isAnnual = document.getElementById('pricing-switch')?.classList.contains('annual');
        return {
            period: isAnnual ? 'annual' : 'monthly',
            prices: Object.keys(this.pricingData).reduce((acc, plan) => {
                acc[plan] = this.pricingData[plan][isAnnual ? 'annual' : 'monthly'];
                return acc;
            }, {})
        };
    }
    
    triggerDemo(demoType = 'pipeline') {
        if (demoType === 'pipeline') {
            this.runPipelineDemo();
        }
    }
}

// Interactive demo enhancements
class DevOpsInteractiveDemo {
    constructor() {
        this.init();
    }
    
    init() {
        this.setupInfrastructureDemo();
        this.setupMonitoringDemo();
    }
    
    setupInfrastructureDemo() {
        const planBtn = document.querySelector('.action-btn:not(.primary)');
        const applyBtn = document.querySelector('.action-btn.primary');
        
        if (planBtn) {
            planBtn.addEventListener('click', () => {
                this.showInfraOutput('terraform plan', [
                    'Plan: 1 to add, 0 to change, 0 to destroy.',
                    '+ aws_instance.web',
                    '    + ami           = "ami-0abcdef1234567890"',
                    '    + instance_type = "t3.medium"'
                ]);
            });
        }
        
        if (applyBtn) {
            applyBtn.addEventListener('click', () => {
                this.showInfraOutput('terraform apply', [
                    'Apply complete! Resources: 1 added, 0 changed, 0 destroyed.',
                    'aws_instance.web: Creating...',
                    'aws_instance.web: Still creating... [10s elapsed]',
                    'aws_instance.web: Creation complete after 12s'
                ]);
            });
        }
    }
    
    showInfraOutput(command, outputs) {
        // Create temporary output display
        const demoPanel = document.querySelector('[data-panel="infrastructure"]');
        if (!demoPanel) return;
        
        let outputDiv = demoPanel.querySelector('.terraform-output');
        if (!outputDiv) {
            outputDiv = document.createElement('div');
            outputDiv.className = 'terraform-output';
            outputDiv.style.cssText = `
                background: #1e1e1e;
                color: #00ff00;
                font-family: monospace;
                padding: 1rem;
                border-radius: 8px;
                margin-top: 1rem;
                font-size: 0.85rem;
                line-height: 1.4;
                max-height: 200px;
                overflow-y: auto;
            `;
            demoPanel.querySelector('.infra-demo').appendChild(outputDiv);
        }
        
        outputDiv.innerHTML = `<div style="color: #00bfff;">$ ${command}</div>`;
        
        // Animate output lines
        outputs.forEach((line, index) => {
            setTimeout(() => {
                const lineDiv = document.createElement('div');
                lineDiv.textContent = line;
                outputDiv.appendChild(lineDiv);
                outputDiv.scrollTop = outputDiv.scrollHeight;
            }, (index + 1) * 500);
        });
    }
    
    setupMonitoringDemo() {
        const metricCards = document.querySelectorAll('.metric-card');
        
        // Simulate real-time updates
        setInterval(() => {
            metricCards.forEach(card => {
                const metricValue = card.querySelector('.metric-value');
                const header = card.querySelector('.metric-header').textContent;
                
                if (metricValue) {
                    let newValue;
                    switch (header) {
                        case 'CPU Usage':
                            newValue = (Math.random() * 40 + 30).toFixed(0) + '%';
                            break;
                        case 'Memory':
                            newValue = (Math.random() * 1 + 2).toFixed(1) + 'GB';
                            break;
                        case 'Response Time':
                            newValue = Math.floor(Math.random() * 50 + 100) + 'ms';
                            break;
                        default:
                            return;
                    }
                    
                    // Smooth transition
                    metricValue.style.transform = 'scale(1.1)';
                    setTimeout(() => {
                        metricValue.textContent = newValue;
                        metricValue.style.transform = 'scale(1)';
                    }, 150);
                }
            });
        }, 3000);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.devOpsSuiteManager = new DevOpsSuiteManager();
    window.devOpsInteractiveDemo = new DevOpsInteractiveDemo();
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { DevOpsSuiteManager, DevOpsInteractiveDemo };
}