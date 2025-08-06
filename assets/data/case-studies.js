/**
 * Case Studies Data for Resiliotech
 * Detailed success stories showcasing automation results
 */

const caseStudiesData = {
    featured: [
        {
            id: 'fintech-startup-cicd',
            title: 'FinTech Startup Achieves 90% Faster Deployments',
            company: 'Anonymous FinTech Startup',
            industry: 'Financial Technology',
            teamSize: '12 developers',
            timeline: '3 weeks',
            challenge: 'Manual deployment process taking 4-6 hours, frequent production issues, and developers spending 30% of time on operations tasks.',
            solution: 'Implemented automated CI/CD pipeline with infrastructure as code, automated testing, and deployment orchestration.',
            results: {
                deploymentTime: {
                    before: '4-6 hours',
                    after: '8 minutes',
                    improvement: '90% reduction'
                },
                deploymentFrequency: {
                    before: '2-3 per week',
                    after: '10-15 per day',
                    improvement: '500% increase'
                },
                productionIssues: {
                    before: '8-10 per month',
                    after: '1-2 per month',
                    improvement: '85% reduction'
                },
                developerProductivity: {
                    before: '70% feature work',
                    after: '95% feature work',
                    improvement: '25% increase'
                },
                timeToMarket: {
                    before: '6-8 weeks',
                    after: '2-3 weeks',
                    improvement: '65% faster'
                }
            },
            technologies: ['AWS', 'GitHub Actions', 'Terraform', 'Docker', 'Kubernetes', 'Prometheus'],
            testimonial: {
                quote: "Resiliotech transformed our development workflow. We went from dreading deployments to deploying multiple times per day with confidence. Our team can now focus on building features instead of fighting with infrastructure.",
                author: "Lead Developer",
                company: "FinTech Startup"
            },
            metrics: [
                {
                    label: 'Deployment Time Reduction',
                    value: '90%',
                    description: 'From 4-6 hours to 8 minutes'
                },
                {
                    label: 'Production Issues',
                    value: '85%',
                    description: 'Fewer incidents per month'
                },
                {
                    label: 'Developer Productivity',
                    value: '25%',
                    description: 'More time for feature work'
                },
                {
                    label: 'Time to Market',
                    value: '65%',
                    description: 'Faster feature delivery'
                }
            ],
            keyLearnings: [
                'Automation reduces human error by 95%',
                'Automated testing catches 80% of issues before production',
                'Infrastructure as Code ensures consistency across environments',
                'Monitoring and alerting prevent issues from becoming incidents'
            ],
            implementation: {
                phase1: {
                    title: 'Foundation Setup (Week 1)',
                    tasks: [
                        'Infrastructure audit and planning',
                        'CI/CD pipeline architecture design',
                        'Development environment setup',
                        'Initial automation scripts creation'
                    ]
                },
                phase2: {
                    title: 'Core Implementation (Week 2)',
                    tasks: [
                        'Automated testing pipeline setup',
                        'Deployment automation implementation',
                        'Infrastructure as Code deployment',
                        'Monitoring and alerting configuration'
                    ]
                },
                phase3: {
                    title: 'Optimization & Training (Week 3)',
                    tasks: [
                        'Performance optimization',
                        'Security hardening',
                        'Team training and documentation',
                        'Go-live support and monitoring'
                    ]
                }
            }
        },
        {
            id: 'healthtech-monitoring',
            title: 'HealthTech Company Eliminates Downtime',
            company: 'Anonymous HealthTech Company',
            industry: 'Healthcare Technology',
            teamSize: '8 developers',
            timeline: '2 weeks',
            challenge: 'Frequent production outages, manual monitoring, and 4-hour average incident resolution time affecting patient care systems.',
            solution: 'Implemented comprehensive monitoring, automated alerting, and self-healing infrastructure with predictive scaling.',
            results: {
                uptime: {
                    before: '97.2%',
                    after: '99.8%',
                    improvement: '2.6% increase'
                },
                incidentResolution: {
                    before: '4 hours average',
                    after: '15 minutes average',
                    improvement: '93% faster'
                },
                preventedOutages: {
                    before: '0 prevented',
                    after: '12 prevented',
                    improvement: '100% prevention'
                },
                alertingAccuracy: {
                    before: '40% false positives',
                    after: '5% false positives',
                    improvement: '87% improvement'
                }
            },
            technologies: ['AWS', 'Prometheus', 'Grafana', 'PagerDuty', 'ELK Stack', 'Terraform'],
            testimonial: {
                quote: "Our patients depend on our systems 24/7. Resiliotech's monitoring and automation solution gave us the reliability we needed. We've prevented over a dozen potential outages and sleep better at night.",
                author: "CTO",
                company: "HealthTech Company"
            },
            metrics: [
                {
                    label: 'System Uptime',
                    value: '99.8%',
                    description: 'Up from 97.2%'
                },
                {
                    label: 'Incident Resolution',
                    value: '15min',
                    description: 'Down from 4 hours'
                },
                {
                    label: 'Prevented Outages',
                    value: '12',
                    description: 'In the first 6 months'
                },
                {
                    label: 'False Alerts',
                    value: '5%',
                    description: 'Down from 40%'
                }
            ]
        },
        {
            id: 'ecommerce-scaling',
            title: 'E-commerce Platform Scales 10x During Black Friday',
            company: 'Anonymous E-commerce Platform',
            industry: 'E-commerce',
            teamSize: '15 developers',
            timeline: '4 weeks',
            challenge: 'Manual scaling during traffic spikes, over-provisioned infrastructure, and inability to handle Black Friday traffic without downtime.',
            solution: 'Implemented auto-scaling infrastructure, load balancing, and predictive scaling based on traffic patterns and business events.',
            results: {
                trafficHandling: {
                    before: '10,000 concurrent users',
                    after: '100,000+ concurrent users',
                    improvement: '1000% increase'
                },
                infrastructureCost: {
                    before: '$12,000/month',
                    after: '$4,800/month',
                    improvement: '60% reduction'
                },
                pageLoadTime: {
                    before: '3.2 seconds',
                    after: '0.8 seconds',
                    improvement: '75% faster'
                },
                downtime: {
                    before: '6 hours during Black Friday',
                    after: '0 downtime',
                    improvement: '100% elimination'
                }
            },
            technologies: ['AWS', 'Auto Scaling Groups', 'Application Load Balancer', 'CloudWatch', 'Lambda', 'RDS'],
            testimonial: {
                quote: "Black Friday was always our nightmare - until now. We handled 10x our normal traffic with zero downtime and actually reduced our infrastructure costs. The automated scaling worked flawlessly.",
                author: "VP of Engineering",
                company: "E-commerce Platform"
            },
            metrics: [
                {
                    label: 'Traffic Capacity',
                    value: '10x',
                    description: '100k+ concurrent users'
                },
                {
                    label: 'Cost Reduction',
                    value: '60%',
                    description: 'Infrastructure savings'
                },
                {
                    label: 'Page Load Time',
                    value: '75%',
                    description: 'Faster user experience'
                },
                {
                    label: 'Black Friday Uptime',
                    value: '100%',
                    description: 'Zero downtime'
                }
            ]
        }
    ],
    
    byIndustry: {
        fintech: ['fintech-startup-cicd'],
        healthcare: ['healthtech-monitoring'],
        ecommerce: ['ecommerce-scaling']
    },
    
    byChallenge: {
        'slow-deployments': ['fintech-startup-cicd'],
        'downtime-issues': ['healthtech-monitoring'],
        'scaling-problems': ['ecommerce-scaling']
    },
    
    byTeamSize: {
        'small': ['healthtech-monitoring'],
        'medium': ['fintech-startup-cicd', 'ecommerce-scaling']
    },
    
    getAll() {
        return this.featured;
    },
    
    getById(id) {
        return this.featured.find(study => study.id === id);
    },
    
    getByIndustry(industry) {
        const ids = this.byIndustry[industry] || [];
        return ids.map(id => this.getById(id)).filter(Boolean);
    },
    
    getByChallenge(challenge) {
        const ids = this.byChallenge[challenge] || [];
        return ids.map(id => this.getById(id)).filter(Boolean);
    },
    
    getFeatured(count = 3) {
        return this.featured.slice(0, count);
    }
};

// Export for use in other modules
if (typeof window !== 'undefined') {
    window.caseStudiesData = caseStudiesData;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = caseStudiesData;
}