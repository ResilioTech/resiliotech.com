/**
 * Projects Data for Portfolio Display
 * Real case studies with detailed technical implementations
 */

window.projectsData = {
    featured: [
        {
            id: 'fintech-cicd-automation',
            title: 'FinTech Startup CI/CD Automation',
            subtitle: 'Zero-downtime deployments for payment processing platform',
            category: 'CI/CD Automation',
            tags: ['AWS', 'GitHub Actions', 'Terraform', 'Docker', 'Kubernetes'],
            featured: true,
            image: '../assets/images/projects/fintech-cicd.jpg',
            description: 'Transformed manual deployment process to fully automated CI/CD pipeline with 90% time reduction and zero production incidents.',
            
            challenge: {
                title: 'Manual Deployments Blocking Growth',
                description: 'Growing FinTech startup with 4-6 hour manual deployments, frequent rollbacks, and development team spending 40% of time on DevOps tasks instead of feature development.',
                problems: [
                    'Manual deployments taking 4-6 hours',
                    'High rollback rate (30% of deployments)',
                    'No automated testing pipeline',
                    'Developer productivity bottleneck',
                    'Compliance audit trail missing'
                ]
            },
            
            solution: {
                title: 'End-to-End CI/CD Automation',
                description: 'Implemented comprehensive automation pipeline with Infrastructure as Code, automated testing, and zero-downtime deployment strategy.',
                implementation: [
                    'GitHub Actions CI/CD pipeline with multi-stage environments',
                    'Terraform Infrastructure as Code for AWS resources',
                    'Docker containerization with Kubernetes orchestration',
                    'Automated security scanning and compliance checks',
                    'Blue-green deployment strategy for zero downtime',
                    'Comprehensive monitoring and alerting setup'
                ]
            },
            
            results: {
                metrics: [
                    { label: 'Deployment Time', before: '4-6 hours', after: '8 minutes', improvement: '90% reduction' },
                    { label: 'Production Issues', before: '12/month', after: '2/month', improvement: '83% reduction' },
                    { label: 'Developer Productivity', before: '60% feature work', after: '95% feature work', improvement: '58% increase' },
                    { label: 'Deployment Frequency', before: '1-2/week', after: '8-10/day', improvement: '2000% increase' }
                ],
                impact: 'Team can now deploy multiple times per day with confidence, enabling rapid feature iteration and improved customer responsiveness.'
            },
            
            testimonial: {
                quote: "Resiliotech transformed our development workflow completely. We went from dreading deployments to deploying multiple times per day with complete confidence. Our team can finally focus on building features instead of fighting with infrastructure.",
                author: "Sarah Kim",
                position: "Lead Developer",
                company: "PayFlow Technologies"
            },
            
            techStack: {
                infrastructure: ['AWS ECS', 'Application Load Balancer', 'RDS PostgreSQL', 'ElastiCache'],
                cicd: ['GitHub Actions', 'AWS CodeDeploy', 'Docker Hub', 'Terraform Cloud'],
                monitoring: ['CloudWatch', 'New Relic', 'PagerDuty', 'AWS X-Ray'],
                security: ['AWS Secrets Manager', 'IAM Roles', 'VPC', 'AWS WAF']
            },
            
            timeline: '3 weeks implementation',
            caseStudyUrl: '/case-studies/fintech-cicd-automation'
        },
        
        {
            id: 'saas-infrastructure-scaling',
            title: 'SaaS Platform Auto-Scaling Infrastructure',
            subtitle: 'Kubernetes auto-scaling for 10x traffic growth',
            category: 'Infrastructure Automation',
            tags: ['Kubernetes', 'AWS', 'Terraform', 'Prometheus', 'Grafana'],
            featured: true,
            image: '../assets/images/projects/saas-scaling.jpg',
            description: 'Built auto-scaling infrastructure to handle 10x traffic growth while reducing costs by 40% through intelligent resource optimization.',
            
            challenge: {
                title: 'Rapid Growth Overwhelming Infrastructure',
                description: 'Fast-growing SaaS platform experiencing 300% month-over-month user growth with infrastructure costs skyrocketing and frequent downtime during traffic spikes.',
                problems: [
                    'Manual scaling causing frequent downtime',
                    'Infrastructure costs growing faster than revenue',
                    'No visibility into resource utilization',
                    'Performance degradation during peak usage',
                    'Development team blocked by infrastructure issues'
                ]
            },
            
            solution: {
                title: 'Intelligent Auto-Scaling Architecture',
                description: 'Implemented Kubernetes-based auto-scaling infrastructure with predictive scaling, cost optimization, and comprehensive observability.',
                implementation: [
                    'Kubernetes cluster with Horizontal Pod Autoscaler (HPA)',
                    'Vertical Pod Autoscaler (VPA) for resource optimization',
                    'Cluster Autoscaler for node-level scaling',
                    'Prometheus & Grafana for metrics and observability',
                    'Custom metrics-based scaling (queue length, response time)',
                    'Cost optimization through spot instances and reserved capacity'
                ]
            },
            
            results: {
                metrics: [
                    { label: 'Infrastructure Costs', before: '$8,000/month', after: '$4,800/month', improvement: '40% reduction' },
                    { label: 'Uptime', before: '97.2%', after: '99.8%', improvement: '2.6% increase' },
                    { label: 'Auto-Scale Time', before: '15-20 min', after: '30 seconds', improvement: '95% faster' },
                    { label: 'Peak Traffic Handling', before: '5,000 CCU', after: '50,000 CCU', improvement: '10x capacity' }
                ],
                impact: 'Platform now handles 10x traffic automatically while reducing costs, enabling focus on product development instead of infrastructure firefighting.'
            },
            
            testimonial: {
                quote: "The auto-scaling solution was a game-changer. We went through Black Friday with zero downtime and 50x our normal traffic. Meanwhile, our infrastructure costs actually went down. It\'s like having a full DevOps team working 24/7.",
                author: "Marcus Chen",
                position: "CTO",
                company: "GrowthFlow SaaS"
            },
            
            techStack: {
                orchestration: ['Amazon EKS', 'Kubernetes 1.28', 'Helm Charts', 'Kustomize'],
                scaling: ['HPA', 'VPA', 'Cluster Autoscaler', 'KEDA'],
                monitoring: ['Prometheus', 'Grafana', 'AlertManager', 'AWS CloudWatch'],
                infrastructure: ['Terraform', 'AWS Load Balancer Controller', 'ExternalDNS', 'cert-manager']
            },
            
            timeline: '4 weeks implementation',
            caseStudyUrl: '/case-studies/saas-infrastructure-scaling'
        },
        
        {
            id: 'startup-observability-platform',
            title: 'Startup Observability & Incident Response',
            subtitle: 'End-to-end monitoring with automated incident response',
            category: 'Monitoring & Observability',
            tags: ['Prometheus', 'Grafana', 'PagerDuty', 'ELK Stack', 'AWS'],
            featured: true,
            image: '../assets/images/projects/observability.jpg',
            description: 'Implemented comprehensive observability platform reducing mean time to resolution by 85% and preventing 90% of incidents through predictive alerting.',
            
            challenge: {
                title: 'Blind to Production Issues',
                description: 'Early-stage startup discovering critical issues from customer complaints, with no visibility into system health and hours-long incident resolution times.',
                problems: [
                    'Learning about issues from customer support tickets',
                    'No centralized logging or metrics',
                    'Mean time to resolution: 4+ hours',
                    'No alerting or incident response process',
                    'Performance bottlenecks going undetected'
                ]
            },
            
            solution: {
                title: 'Comprehensive Observability Stack',
                description: 'Built full observability platform with metrics, logging, tracing, and automated incident response workflows.',
                implementation: [
                    'Prometheus for metrics collection and alerting',
                    'Grafana dashboards for visualization and analysis',
                    'ELK Stack (Elasticsearch, Logstash, Kibana) for centralized logging',
                    'AWS X-Ray for distributed tracing',
                    'PagerDuty integration for incident management',
                    'Custom SLI/SLO framework with error budgets'
                ]
            },
            
            results: {
                metrics: [
                    { label: 'Mean Time to Detection', before: '4+ hours', after: '30 seconds', improvement: '99.8% faster' },
                    { label: 'Mean Time to Resolution', before: '4 hours', after: '35 minutes', improvement: '85% reduction' },
                    { label: 'Prevented Incidents', before: '0%', after: '90%', improvement: 'Predictive alerting' },
                    { label: 'On-call Stress', before: 'High', after: 'Low', improvement: 'Automated runbooks' }
                ],
                impact: 'Team now proactively prevents issues before customers are affected, with automated incident response reducing on-call burden by 80%.'
            },
            
            testimonial: {
                quote: "We went from being constantly surprised by production issues to having complete visibility and control. The predictive alerting has prevented dozens of potential outages. Our customers now experience better uptime than much larger competitors.",
                author: "Alex Thompson",
                position: "Engineering Manager",
                company: "DataSync Solutions"
            },
            
            techStack: {
                metrics: ['Prometheus', 'Grafana', 'AlertManager', 'Custom Exporters'],
                logging: ['Elasticsearch', 'Logstash', 'Kibana', 'Filebeat'],
                tracing: ['AWS X-Ray', 'OpenTelemetry', 'Jaeger'],
                incident: ['PagerDuty', 'Slack Integration', 'Automated Runbooks']
            },
            
            timeline: '2 weeks implementation',
            caseStudyUrl: '/case-studies/startup-observability-platform'
        }
    ],
    
    regular: [
        {
            id: 'api-first-automation',
            title: 'API-First Startup Documentation Automation',
            subtitle: 'Automated API docs and testing pipeline',
            category: 'Developer Experience',
            tags: ['OpenAPI', 'Postman', 'GitHub Actions', 'Docker'],
            featured: false,
            description: 'Automated API documentation generation and testing, reducing documentation maintenance by 90% and improving developer onboarding.',
            results: {
                metrics: [
                    { label: 'Documentation Updates', improvement: '90% automated' },
                    { label: 'Developer Onboarding', improvement: '75% faster' },
                    { label: 'API Test Coverage', improvement: '95% automated' }
                ]
            },
            timeline: '1 week implementation'
        },
        
        {
            id: 'multi-environment-security',
            title: 'Multi-Environment Security Automation',
            subtitle: 'Automated security scanning and compliance',
            category: 'Security Automation',
            tags: ['AWS Security Hub', 'Terraform', 'SAST', 'DAST'],
            featured: false,
            description: 'Implemented automated security scanning across all environments with compliance reporting and automatic remediation.',
            results: {
                metrics: [
                    { label: 'Security Scan Time', improvement: '95% reduction' },
                    { label: 'Compliance Reporting', improvement: 'Fully automated' },
                    { label: 'Vulnerability Detection', improvement: '10x faster' }
                ]
            },
            timeline: '2 weeks implementation'
        },
        
        {
            id: 'cost-optimization-automation',
            title: 'AWS Cost Optimization Automation',
            subtitle: 'Intelligent resource scheduling and rightsizing',
            category: 'Cost Optimization',
            tags: ['AWS Lambda', 'CloudWatch', 'Terraform', 'Cost Explorer'],
            featured: false,
            description: 'Automated cost optimization through intelligent resource scheduling, rightsizing recommendations, and waste elimination.',
            results: {
                metrics: [
                    { label: 'Monthly AWS Costs', improvement: '45% reduction' },
                    { label: 'Resource Utilization', improvement: '80% improvement' },
                    { label: 'Cost Visibility', improvement: 'Real-time dashboards' }
                ]
            },
            timeline: '1 week implementation'
        }
    ],
    
    categories: [
        'All Projects',
        'CI/CD Automation', 
        'Infrastructure Automation',
        'Monitoring & Observability',
        'Security Automation',
        'Developer Experience',
        'Cost Optimization'
    ],
    
    stats: {
        totalProjects: 47,
        totalClients: 32,
        avgTimeToValue: '2 weeks',
        avgCostSavings: '40%'
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = window.projectsData;
}