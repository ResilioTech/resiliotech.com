/**
 * Case Studies Manager
 * Handles detailed case study displays, modals, and analytics
 */

class CaseStudiesManager {
    constructor() {
        this.caseStudies = {
            'innovatelab': {
                company: 'InnovateLab',
                logo: '⚡',
                type: 'Pre-seed AI Startup',
                industry: 'AI/ML',
                teamSize: 5,
                challenge: {
                    title: '75% Faster ML Pipeline',
                    description: 'InnovateLab\'s machine learning model training and deployment pipeline was taking 3+ days per iteration, severely limiting their ability to experiment and improve their AI models.',
                    metrics: ['3+ days per model iteration', 'Manual model deployment', '80% time spent on ops'],
                    painPoints: [
                        'Manual data preprocessing took 8+ hours',
                        'Model training required constant babysitting',
                        'Deployment to production was error-prone',
                        'No automated model validation',
                        'Team spent more time on infrastructure than AI'
                    ]
                },
                solution: {
                    title: 'Automated ML Pipeline',
                    description: 'We built a comprehensive MLOps pipeline that automated the entire model lifecycle from data ingestion to production deployment.',
                    components: [
                        {
                            name: 'Automated Data Pipeline',
                            description: 'Airflow-based pipeline for data ingestion, cleaning, and feature engineering'
                        },
                        {
                            name: 'Model Training Automation',
                            description: 'Kubernetes jobs for scalable model training with automatic resource allocation'
                        },
                        {
                            name: 'Model Validation Framework',
                            description: 'Automated testing and validation of model performance and data drift'
                        },
                        {
                            name: 'Continuous Deployment',
                            description: 'GitOps-based model deployment with A/B testing capabilities'
                        }
                    ]
                },
                results: {
                    beforeAfter: {
                        before: [
                            '3+ days per model iteration',
                            'Manual data preprocessing (8+ hours)',
                            'Error-prone manual deployment',
                            'No automated validation',
                            '80% time spent on ops tasks'
                        ],
                        after: [
                            '6 hours per model iteration',
                            'Automated data preprocessing (15 mins)',
                            'One-click model deployment',
                            'Comprehensive automated validation',
                            '20% time spent on ops tasks'
                        ]
                    },
                    metrics: [
                        { label: 'Time Reduction', value: '88%', description: '3 days → 6 hours per iteration' },
                        { label: 'Deployment Speed', value: '12x', description: 'Faster model deployment' },
                        { label: 'Resource Efficiency', value: '60%', description: 'Better compute utilization' }
                    ]
                },
                testimonial: {
                    quote: "The ML pipeline automation transformed how we work. We can now experiment with 5 different model approaches in a single day instead of spending weeks on infrastructure setup.",
                    author: "Dr. Amanda Foster",
                    title: "Chief AI Officer, InnovateLab"
                },
                timeline: '4 weeks',
                investment: '$18K'
            },
            
            'shopflow': {
                company: 'ShopFlow',
                logo: '🛒',
                type: 'Seed E-commerce',
                industry: 'E-commerce',
                teamSize: 8,
                challenge: {
                    title: 'Zero-Downtime Scaling',
                    description: 'ShopFlow needed to handle massive traffic spikes during sales events without manual intervention. Their previous Black Friday crashed the site.',
                    metrics: ['99% downtime during Black Friday', '1000x traffic spikes', 'Manual scaling only'],
                    painPoints: [
                        'Previous Black Friday resulted in 99% downtime',
                        'Manual scaling couldn\'t keep up with traffic spikes',
                        'Database bottlenecks during peak hours',
                        'CDN configuration was static',
                        'No automated failover mechanisms'
                    ]
                },
                solution: {
                    title: 'Auto-Scaling E-commerce Infrastructure',
                    description: 'We implemented intelligent auto-scaling across all infrastructure layers with predictive scaling based on historical patterns.',
                    components: [
                        {
                            name: 'Predictive Auto-Scaling',
                            description: 'ML-powered scaling that anticipates traffic patterns and scales proactively'
                        },
                        {
                            name: 'Database Read Replicas',
                            description: 'Automated read replica scaling with intelligent query routing'
                        },
                        {
                            name: 'Global CDN Optimization',
                            description: 'Dynamic CDN configuration with edge computing for cart operations'
                        },
                        {
                            name: 'Circuit Breaker Pattern',
                            description: 'Automated failover and graceful degradation during peak loads'
                        }
                    ]
                },
                results: {
                    beforeAfter: {
                        before: [
                            '99% downtime during Black Friday',
                            'Manual scaling (30+ min response)',
                            'Single database bottleneck',
                            'Static CDN configuration',
                            'No failover mechanisms'
                        ],
                        after: [
                            '100% uptime during Black Friday',
                            'Automatic scaling (30 sec response)',
                            'Dynamic read replica scaling',
                            'Intelligent CDN optimization',
                            'Automated circuit breakers'
                        ]
                    },
                    metrics: [
                        { label: 'Uptime Improvement', value: '100%', description: 'Zero downtime during peak traffic' },
                        { label: 'Traffic Handled', value: '1000x', description: 'Peak traffic without issues' },
                        { label: 'Response Time', value: '60x', description: 'Faster scaling response' }
                    ]
                },
                testimonial: {
                    quote: "This Black Friday was our highest revenue day ever, with zero downtime. The automatic scaling handled traffic we never dreamed possible.",
                    author: "James Mitchell",
                    title: "Founder & CEO, ShopFlow"
                },
                timeline: '3 weeks',
                investment: '$22K'
            },
            
            'healthtech': {
                company: 'HealthTech Solutions',
                logo: '🏥',
                type: 'Series A HealthTech',
                industry: 'HealthTech',
                teamSize: 15,
                challenge: {
                    title: 'HIPAA-Compliant Automation',
                    description: 'HealthTech Solutions needed to automate their compliance monitoring and security controls while handling sensitive patient data.',
                    metrics: ['Manual compliance checks', '6+ weeks audit prep', '24/7 security monitoring needed'],
                    painPoints: [
                        'Manual HIPAA compliance checking was error-prone',
                        'Audit preparation took 6+ weeks of manual work',
                        'No automated security monitoring',
                        'Data encryption was inconsistently applied',
                        'Access logging was manual and incomplete'
                    ]
                },
                solution: {
                    title: 'Automated HIPAA Compliance',
                    description: 'We built a comprehensive compliance automation system that continuously monitors and enforces HIPAA requirements.',
                    components: [
                        {
                            name: 'Automated Security Scanning',
                            description: 'Continuous vulnerability scanning and compliance checking'
                        },
                        {
                            name: 'Encryption Automation',
                            description: 'Automatic encryption of data at rest and in transit with key rotation'
                        },
                        {
                            name: 'Access Control Automation',
                            description: 'Automated provisioning and deprovisioning with detailed audit logs'
                        },
                        {
                            name: 'Compliance Reporting',
                            description: 'Real-time compliance dashboard with automated audit reports'
                        }
                    ]
                },
                results: {
                    beforeAfter: {
                        before: [
                            'Manual compliance checks (weekly)',
                            '6+ weeks audit preparation',
                            'Inconsistent encryption',
                            'Manual access logging',
                            'Reactive security posture'
                        ],
                        after: [
                            'Continuous automated compliance',
                            '3 days audit preparation',
                            '100% consistent encryption',
                            'Automated comprehensive logging',
                            'Proactive security monitoring'
                        ]
                    },
                    metrics: [
                        { label: 'Audit Prep Time', value: '93%', description: 'Reduction in audit preparation time' },
                        { label: 'Compliance Score', value: '100%', description: 'Continuous compliance maintained' },
                        { label: 'Security Response', value: '15x', description: 'Faster incident detection' }
                    ]
                },
                testimonial: {
                    quote: "The automated compliance system not only saves us weeks of work but gives us confidence that we're always audit-ready. It's been a game-changer for our growth.",
                    author: "Dr. Rachel Kim",
                    title: "Chief Compliance Officer, HealthTech Solutions"
                },
                timeline: '6 weeks',
                investment: '$35K'
            },
            
            'gamestream': {
                company: 'GameStream',
                logo: '🎮',
                type: 'Seed Gaming Platform',
                industry: 'Gaming',
                teamSize: 10,
                challenge: {
                    title: 'Global Edge Deployment',
                    description: 'GameStream needed to reduce latency for their global user base while maintaining consistent game state synchronization.',
                    metrics: ['200ms+ latency globally', 'Single region deployment', 'Manual updates'],
                    painPoints: [
                        '200ms+ latency for international users',
                        'Single US-East deployment causing issues globally',
                        'Game state synchronization problems',
                        'Manual deployment to multiple regions',
                        'Inconsistent player experience across regions'
                    ]
                },
                solution: {
                    title: 'Global Multi-Region Deployment',
                    description: 'We implemented a sophisticated multi-region deployment with edge computing for optimal gaming performance worldwide.',
                    components: [
                        {
                            name: 'Multi-Region Architecture',
                            description: 'Automated deployment to 15 global regions with intelligent traffic routing'
                        },
                        {
                            name: 'Edge Computing Layer',
                            description: 'Game logic processing at edge locations for reduced latency'
                        },
                        {
                            name: 'Global State Management',
                            description: 'Distributed game state with eventual consistency and conflict resolution'
                        },
                        {
                            name: 'Performance Monitoring',
                            description: 'Real-time latency monitoring with automatic region failover'
                        }
                    ]
                },
                results: {
                    beforeAfter: {
                        before: [
                            '200ms+ latency globally',
                            'Single US region deployment',
                            'Manual regional updates',
                            'Inconsistent game performance',
                            'Poor international user experience'
                        ],
                        after: [
                            '<50ms latency globally',
                            '15 region automatic deployment',
                            'Synchronized global updates',
                            'Consistent 60fps performance',
                            'Premium experience worldwide'
                        ]
                    },
                    metrics: [
                        { label: 'Latency Reduction', value: '75%', description: 'Average latency improvement' },
                        { label: 'Global Coverage', value: '15', description: 'Regions deployed automatically' },
                        { label: 'User Satisfaction', value: '45%', description: 'Increase in player retention' }
                    ]
                },
                testimonial: {
                    quote: "Our international players now have the same amazing experience as our US users. The global deployment automation lets us focus on building great games instead of managing infrastructure.",
                    author: "Tyler Rodriguez",
                    title: "Lead Developer, GameStream"
                },
                timeline: '5 weeks',
                investment: '$28K'
            },
            
            'logitech': {
                company: 'LogiTech',
                logo: '📦',
                type: 'Series A Supply Chain',
                industry: 'IoT',
                teamSize: 12,
                challenge: {
                    title: 'IoT Data Pipeline',
                    description: 'LogiTech needed to process millions of IoT sensor events in real-time for their supply chain monitoring platform.',
                    metrics: ['1M+ events per second', 'Manual data processing', '24 hour delays'],
                    painPoints: [
                        '1M+ sensor events per second to process',
                        'Manual data validation and processing',
                        '24+ hour delays in supply chain insights',
                        'Data quality issues affecting decisions',
                        'No real-time alerting for supply chain disruptions'
                    ]
                },
                solution: {
                    title: 'Real-Time IoT Data Processing',
                    description: 'We built a scalable real-time data pipeline that processes millions of IoT events with sub-second latency.',
                    components: [
                        {
                            name: 'Stream Processing Pipeline',
                            description: 'Apache Kafka and Apache Flink for real-time event processing'
                        },
                        {
                            name: 'Automated Data Validation',
                            description: 'ML-powered anomaly detection and data quality validation'
                        },
                        {
                            name: 'Real-Time Analytics',
                            description: 'Time-series database with sub-second query performance'
                        },
                        {
                            name: 'Intelligent Alerting',
                            description: 'Predictive alerting for supply chain disruptions'
                        }
                    ]
                },
                results: {
                    beforeAfter: {
                        before: [
                            '24+ hour processing delays',
                            'Manual data validation',
                            'Batch processing only',
                            'Reactive supply chain management',
                            'Data quality issues'
                        ],
                        after: [
                            'Sub-second processing latency',
                            'Automated ML-based validation',
                            'Real-time streaming analytics',
                            'Predictive supply chain insights',
                            '99.99% data accuracy'
                        ]
                    },
                    metrics: [
                        { label: 'Processing Speed', value: '1440x', description: 'Faster data processing (24h → 1min)' },
                        { label: 'Data Accuracy', value: '99.99%', description: 'Automated validation accuracy' },
                        { label: 'Cost Reduction', value: '65%', description: 'Infrastructure cost optimization' }
                    ]
                },
                testimonial: {
                    quote: "Real-time supply chain visibility has transformed our operations. We can now predict and prevent disruptions before they impact our customers.",
                    author: "Maria Gonzalez",
                    title: "VP Operations, LogiTech"
                },
                timeline: '7 weeks',
                investment: '$42K'
            },
            
            'apifirst': {
                company: 'APIFirst',
                logo: '🔗',
                type: 'Seed Developer Tools',
                industry: 'Dev Tools',
                teamSize: 6,
                challenge: {
                    title: 'Developer Experience Automation',
                    description: 'APIFirst needed to automate their developer onboarding and documentation to improve API adoption rates.',
                    metrics: ['3+ days developer onboarding', 'Manual documentation', '60% drop-off rate'],
                    painPoints: [
                        '3+ days for developers to get started with their API',
                        'Manual documentation updates causing inconsistencies',
                        '60% developer drop-off during onboarding',
                        'No automated testing of API examples',
                        'SDK generation was completely manual'
                    ]
                },
                solution: {
                    title: 'Automated Developer Experience',
                    description: 'We created a comprehensive automation system for documentation, testing, and SDK generation that dramatically improved developer adoption.',
                    components: [
                        {
                            name: 'Auto-Generated Documentation',
                            description: 'OpenAPI-based documentation with interactive examples and testing'
                        },
                        {
                            name: 'Automated SDK Generation',
                            description: 'Multi-language SDK generation with CI/CD integration'
                        },
                        {
                            name: 'Developer Onboarding Automation',
                            description: 'Interactive tutorials with automated environment setup'
                        },
                        {
                            name: 'API Testing Automation',
                            description: 'Continuous testing of all API examples and code samples'
                        }
                    ]
                },
                results: {
                    beforeAfter: {
                        before: [
                            '3+ days developer onboarding',
                            'Manual documentation updates',
                            '60% developer drop-off rate',
                            'Manual SDK generation',
                            'Outdated API examples'
                        ],
                        after: [
                            '2 hours developer onboarding',
                            'Automated documentation sync',
                            '15% developer drop-off rate',
                            'Automated multi-language SDKs',
                            'Always-current API examples'
                        ]
                    },
                    metrics: [
                        { label: 'Onboarding Time', value: '90%', description: 'Reduction in time to first API call' },
                        { label: 'Developer Retention', value: '75%', description: 'Improvement in onboarding completion' },
                        { label: 'API Adoption', value: '3x', description: 'Faster developer API adoption' }
                    ]
                },
                testimonial: {
                    quote: "The automated developer experience has been incredible for our API adoption. Developers can now get started in minutes instead of days, and our documentation is always perfect.",
                    author: "David Park",
                    title: "Founder & CTO, APIFirst"
                },
                timeline: '4 weeks',
                investment: '$16K'
            }
        };
    }

    init() {
        this.setupEventListeners();
        this.initializeAnimations();
        console.log('Case Studies Manager initialized');
    }

    setupEventListeners() {
        // Modal close handlers
        document.addEventListener('click', (e) => {
            if (e.target.matches('.modal-overlay') || e.target.matches('.modal-close')) {
                this.closeModal();
            }
        });

        // Escape key to close modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
            }
        });

        // Track case study card clicks
        document.querySelectorAll('.case-study-card .btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const card = e.target.closest('.case-study-card');
                const companyName = card.querySelector('h3').textContent;
                this.trackCaseStudyInteraction('case_study_card_click', companyName);
            });
        });

        // Track CTA button clicks
        document.querySelectorAll('.case-studies-cta .btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const buttonText = e.target.textContent.trim();
                this.trackCaseStudyInteraction('cta_click', buttonText);
            });
        });
    }

    initializeAnimations() {
        // Add scroll-triggered animations for metric counters
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.animateMetricCounters(entry.target);
                        observer.unobserve(entry.target);
                    }
                });
            });

            // Observe all metric elements
            document.querySelectorAll('.stat-number, .metric-value, .impact-number').forEach(el => {
                observer.observe(el);
            });
        }
    }

    animateMetricCounters(element) {
        const text = element.textContent;
        const number = parseFloat(text.replace(/[^\d.-]/g, ''));
        
        if (isNaN(number)) return;
        
        const suffix = text.replace(/[\d.-]/g, '');
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

    openCaseStudy(companyId) {
        const caseStudy = this.caseStudies[companyId];
        if (!caseStudy) {
            console.error('Case study not found:', companyId);
            return;
        }

        this.renderCaseStudyModal(caseStudy);
        this.showModal();
        this.trackCaseStudyInteraction('case_study_opened', caseStudy.company);
    }

    renderCaseStudyModal(caseStudy) {
        const modalTitle = document.getElementById('modal-title');
        const modalBody = document.getElementById('modal-body');

        modalTitle.textContent = `${caseStudy.company} Success Story`;

        modalBody.innerHTML = `
            <div class="modal-case-study">
                <div class="modal-company-header">
                    <div class="modal-company-info">
                        <div class="modal-company-logo">${caseStudy.logo}</div>
                        <div class="modal-company-details">
                            <h3>${caseStudy.company}</h3>
                            <span class="modal-company-meta">${caseStudy.type} • ${caseStudy.teamSize} engineers</span>
                        </div>
                    </div>
                    <div class="modal-case-result">
                        <span class="modal-result-highlight">${caseStudy.challenge.title}</span>
                    </div>
                </div>

                <div class="modal-case-content">
                    <div class="modal-section">
                        <h4>The Challenge</h4>
                        <p>${caseStudy.challenge.description}</p>
                        <div class="modal-pain-points">
                            <h5>Key Pain Points:</h5>
                            <ul>
                                ${caseStudy.challenge.painPoints.map(point => `<li>${point}</li>`).join('')}
                            </ul>
                        </div>
                    </div>

                    <div class="modal-section">
                        <h4>Our Solution</h4>
                        <p>${caseStudy.solution.description}</p>
                        <div class="modal-solution-components">
                            ${caseStudy.solution.components.map(component => `
                                <div class="modal-component">
                                    <h5>${component.name}</h5>
                                    <p>${component.description}</p>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <div class="modal-section">
                        <h4>The Results</h4>
                        <div class="modal-before-after">
                            <div class="modal-before">
                                <h5>❌ Before</h5>
                                <ul>
                                    ${caseStudy.results.beforeAfter.before.map(item => `<li>${item}</li>`).join('')}
                                </ul>
                            </div>
                            <div class="modal-after">
                                <h5>✅ After</h5>
                                <ul>
                                    ${caseStudy.results.beforeAfter.after.map(item => `<li>${item}</li>`).join('')}
                                </ul>
                            </div>
                        </div>
                        
                        <div class="modal-impact-metrics">
                            ${caseStudy.results.metrics.map(metric => `
                                <div class="modal-impact-item">
                                    <span class="modal-impact-number">${metric.value}</span>
                                    <span class="modal-impact-label">${metric.label}</span>
                                    <span class="modal-impact-description">${metric.description}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <div class="modal-testimonial">
                        <blockquote>"${caseStudy.testimonial.quote}"</blockquote>
                        <cite>
                            <div class="modal-testimonial-author">
                                <span class="modal-author-name">${caseStudy.testimonial.author}</span>
                                <span class="modal-author-title">${caseStudy.testimonial.title}</span>
                            </div>
                        </cite>
                    </div>

                    <div class="modal-project-details">
                        <div class="modal-detail-item">
                            <span class="modal-detail-label">Timeline:</span>
                            <span class="modal-detail-value">${caseStudy.timeline}</span>
                        </div>
                        <div class="modal-detail-item">
                            <span class="modal-detail-label">Investment:</span>
                            <span class="modal-detail-value">${caseStudy.investment}</span>
                        </div>
                        <div class="modal-detail-item">
                            <span class="modal-detail-label">Industry:</span>
                            <span class="modal-detail-value">${caseStudy.industry}</span>
                        </div>
                    </div>
                </div>

                <div class="modal-cta">
                    <h4>Ready for Similar Results?</h4>
                    <p>See how we can transform your operations with similar automation solutions.</p>
                    <div class="modal-cta-actions">
                        <a href="/tools/roi-calculator" class="btn btn-primary" onclick="closeCaseStudyModal()">
                            Calculate Your ROI
                        </a>
                        <a href="../#contact" class="btn btn-outline" onclick="closeCaseStudyModal()">
                            Get Free Audit
                        </a>
                    </div>
                </div>
            </div>
        `;

        // Add modal-specific styles
        this.addModalStyles();
    }

    addModalStyles() {
        // Check if styles already added
        if (document.getElementById('modal-case-study-styles')) return;

        const styles = document.createElement('style');
        styles.id = 'modal-case-study-styles';
        styles.textContent = `
            .modal-case-study {
                max-width: 100%;
            }

            .modal-company-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 2rem;
                flex-wrap: wrap;
                gap: 1rem;
            }

            .modal-company-info {
                display: flex;
                align-items: center;
                gap: 1rem;
            }

            .modal-company-logo {
                font-size: 2rem;
                width: 3.5rem;
                height: 3.5rem;
                background: var(--background-light);
                border-radius: 16px;
                display: flex;
                align-items: center;
                justify-content: center;
                border: 1px solid var(--border-color);
            }

            .modal-company-details h3 {
                color: var(--text-primary);
                margin-bottom: 0.25rem;
                font-size: 1.5rem;
            }

            .modal-company-meta {
                color: var(--text-secondary);
                font-size: 0.9rem;
            }

            .modal-result-highlight {
                background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
                color: white;
                padding: 0.75rem 1.5rem;
                border-radius: 24px;
                font-weight: 600;
                font-size: 1rem;
            }

            .modal-section {
                margin-bottom: 2rem;
                padding-bottom: 2rem;
                border-bottom: 1px solid var(--border-color);
            }

            .modal-section:last-child {
                border-bottom: none;
                margin-bottom: 0;
                padding-bottom: 0;
            }

            .modal-section h4 {
                color: var(--text-primary);
                margin-bottom: 1rem;
                font-size: 1.25rem;
            }

            .modal-section h5 {
                color: var(--text-primary);
                margin-bottom: 0.75rem;
                font-size: 1rem;
                font-weight: 600;
            }

            .modal-pain-points ul,
            .modal-before ul,
            .modal-after ul {
                list-style: none;
                padding: 0;
                margin: 0.5rem 0 0 0;
            }

            .modal-pain-points li,
            .modal-before li,
            .modal-after li {
                margin-bottom: 0.5rem;
                padding-left: 1rem;
                position: relative;
                color: var(--text-secondary);
                line-height: 1.4;
            }

            .modal-pain-points li::before {
                content: '•';
                position: absolute;
                left: 0;
                color: var(--primary-color);
                font-weight: bold;
            }

            .modal-solution-components {
                display: grid;
                gap: 1rem;
                margin-top: 1rem;
            }

            .modal-component {
                background: var(--background-light);
                padding: 1rem;
                border-radius: 12px;
                border: 1px solid var(--border-color);
            }

            .modal-component h5 {
                margin-bottom: 0.5rem;
                color: var(--text-primary);
            }

            .modal-component p {
                margin: 0;
                color: var(--text-secondary);
                font-size: 0.9rem;
                line-height: 1.4;
            }

            .modal-before-after {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 1rem;
                margin: 1rem 0;
            }

            .modal-before,
            .modal-after {
                background: var(--background-light);
                padding: 1rem;
                border-radius: 12px;
                border: 1px solid var(--border-color);
            }

            .modal-before h5 {
                color: #DC2626;
                margin-bottom: 0.75rem;
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }

            .modal-after h5 {
                color: #059669;
                margin-bottom: 0.75rem;
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }

            .modal-impact-metrics {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 1rem;
                margin-top: 1rem;
            }

            .modal-impact-item {
                background: rgba(99, 102, 241, 0.05);
                padding: 1rem;
                border-radius: 12px;
                text-align: center;
                border: 1px solid rgba(99, 102, 241, 0.2);
            }

            .modal-impact-number {
                display: block;
                font-size: 1.5rem;
                font-weight: 700;
                color: var(--primary-color);
                margin-bottom: 0.25rem;
            }

            .modal-impact-label {
                display: block;
                font-size: 0.9rem;
                color: var(--text-primary);
                font-weight: 500;
                margin-bottom: 0.25rem;
            }

            .modal-impact-description {
                display: block;
                font-size: 0.8rem;
                color: var(--text-secondary);
                line-height: 1.3;
            }

            .modal-testimonial {
                background: white;
                border-radius: 16px;
                padding: 2rem;
                border: 1px solid var(--border-color);
                position: relative;
                margin: 2rem 0;
            }

            .modal-testimonial::before {
                content: '"';
                position: absolute;
                top: -0.5rem;
                left: 1.5rem;
                font-size: 3rem;
                color: var(--primary-color);
                opacity: 0.3;
                font-family: Georgia, serif;
            }

            .modal-testimonial blockquote {
                font-style: italic;
                color: var(--text-primary);
                font-size: 1.125rem;
                line-height: 1.6;
                margin-bottom: 1rem;
                padding-left: 1rem;
            }

            .modal-testimonial-author {
                display: flex;
                flex-direction: column;
                gap: 0.25rem;
            }

            .modal-author-name {
                font-weight: 600;
                color: var(--text-primary);
            }

            .modal-author-title {
                font-size: 0.9rem;
                color: var(--text-secondary);
            }

            .modal-project-details {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                gap: 1rem;
                background: var(--background-light);
                padding: 1rem;
                border-radius: 12px;
                border: 1px solid var(--border-color);
                margin: 2rem 0;
            }

            .modal-detail-item {
                display: flex;
                flex-direction: column;
                gap: 0.25rem;
            }

            .modal-detail-label {
                font-size: 0.8rem;
                color: var(--text-secondary);
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }

            .modal-detail-value {
                font-weight: 600;
                color: var(--text-primary);
            }

            .modal-cta {
                background: var(--background-dark);
                border-radius: 16px;
                padding: 2rem;
                text-align: center;
                border: 1px solid var(--border-color);
                margin-top: 2rem;
            }

            .modal-cta h4 {
                color: var(--text-primary);
                margin-bottom: 0.5rem;
            }

            .modal-cta p {
                color: var(--text-secondary);
                margin-bottom: 1.5rem;
            }

            .modal-cta-actions {
                display: flex;
                gap: 1rem;
                justify-content: center;
                flex-wrap: wrap;
            }

            @media (max-width: 768px) {
                .modal-company-header {
                    flex-direction: column;
                    align-items: flex-start;
                }

                .modal-before-after {
                    grid-template-columns: 1fr;
                }

                .modal-impact-metrics {
                    grid-template-columns: 1fr;
                }

                .modal-cta-actions {
                    flex-direction: column;
                    align-items: center;
                }
            }
        `;

        document.head.appendChild(styles);
    }

    showModal() {
        const modal = document.getElementById('case-study-modal');
        if (modal) {
            modal.classList.add('show');
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }
    }

    closeModal() {
        const modal = document.getElementById('case-study-modal');
        if (modal) {
            modal.classList.remove('show');
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }
    }

    trackCaseStudyInteraction(event, details) {
        if (window.analyticsManager) {
            window.analyticsManager.trackEvent(event, {
                details,
                page: '/case-studies',
                timestamp: new Date().toISOString()
            });
        }
    }
}

// Global functions for HTML onclick handlers
function openCaseStudy(companyId) {
    if (window.caseStudiesManager) {
        window.caseStudiesManager.openCaseStudy(companyId);
    }
}

function closeCaseStudyModal() {
    if (window.caseStudiesManager) {
        window.caseStudiesManager.closeModal();
    }
}

// Initialize manager when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.caseStudiesManager = new CaseStudiesManager();
    window.caseStudiesManager.init();
});