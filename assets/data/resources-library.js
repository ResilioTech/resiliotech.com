/**
 * Comprehensive Resources Library for Resiliotech
 * Templates, tools, guides, and educational content
 */

const resourcesLibrary = {
    categories: {
        templates: {
            name: 'Templates & Tools',
            description: 'Ready-to-use templates and tools for startup automation',
            color: '#6366f1'
        },
        guides: {
            name: 'Implementation Guides',
            description: 'Step-by-step guides for implementing automation',
            color: '#8b5cf6'
        },
        checklists: {
            name: 'Checklists & Audits',
            description: 'Comprehensive checklists to assess and improve your setup',
            color: '#06b6d4'
        },
        videos: {
            name: 'Video Content',
            description: 'Educational videos and demos',
            color: '#10b981'
        },
        tools: {
            name: 'Free Tools',
            description: 'Interactive tools and calculators',
            color: '#f59e0b'
        }
    },

    resources: [
        // Templates & Tools
        {
            id: 'terraform-startup-template',
            title: 'Terraform Infrastructure Template for Startups',
            category: 'templates',
            type: 'template',
            description: 'Complete Terraform template for setting up AWS infrastructure optimized for startups. Includes VPC, security groups, auto-scaling, and monitoring.',
            downloadUrl: '/assets/downloads/terraform-startup-template.zip',
            preview: '/resources/terraform-template-preview',
            tags: ['terraform', 'aws', 'infrastructure', 'iac'],
            difficulty: 'intermediate',
            timeToImplement: '2-4 hours',
            features: [
                'Multi-environment setup (dev, staging, prod)',
                'Auto-scaling groups with proper policies',
                'Security groups with least-privilege access',
                'Monitoring and logging configuration',
                'Cost optimization settings',
                'Backup and disaster recovery setup'
            ],
            requirements: [
                'AWS Account with appropriate permissions',
                'Terraform >= 1.0',
                'Basic understanding of AWS services'
            ],
            popularity: 95,
            downloads: 2847,
            rating: 4.8
        },
        
        {
            id: 'github-actions-cicd',
            title: 'GitHub Actions CI/CD Pipeline Templates',
            category: 'templates',
            type: 'template',
            description: 'Production-ready GitHub Actions workflows for different tech stacks. Includes testing, security scanning, and deployment automation.',
            downloadUrl: '/assets/downloads/github-actions-templates.zip',
            tags: ['github-actions', 'cicd', 'automation', 'deployment'],
            difficulty: 'beginner',
            timeToImplement: '1-2 hours',
            features: [
                'Node.js, Python, Go, and Java templates',
                'Automated testing and code quality checks',
                'Security vulnerability scanning',
                'Multi-environment deployment workflows',
                'Docker image building and publishing',
                'Slack/email notifications'
            ],
            popularity: 88,
            downloads: 3621,
            rating: 4.9
        },

        {
            id: 'kubernetes-startup-manifests',
            title: 'Kubernetes Manifests for Startup Applications',
            category: 'templates',
            type: 'template',
            description: 'Complete Kubernetes deployment manifests optimized for startup workloads. Includes deployments, services, ingress, and monitoring.',
            downloadUrl: '/assets/downloads/k8s-startup-manifests.zip',
            tags: ['kubernetes', 'containers', 'deployment', 'scaling'],
            difficulty: 'advanced',
            timeToImplement: '4-8 hours',
            features: [
                'Application deployment templates',
                'Horizontal Pod Autoscaling (HPA)',
                'Ingress with SSL termination',
                'ConfigMaps and Secrets management',
                'Resource limits and requests',
                'Health checks and readiness probes'
            ],
            popularity: 76,
            downloads: 1432,
            rating: 4.7
        },

        // Implementation Guides
        {
            id: 'cicd-implementation-guide',
            title: 'Complete CI/CD Implementation Guide for Startups',
            category: 'guides',
            type: 'guide',
            description: 'Comprehensive 50-page guide covering CI/CD implementation from planning to production for startup teams.',
            downloadUrl: '/assets/downloads/cicd-implementation-guide.pdf',
            preview: '/resources/cicd-guide-preview',
            tags: ['cicd', 'implementation', 'best-practices', 'startup'],
            difficulty: 'intermediate',
            timeToRead: '2-3 hours',
            timeToImplement: '1-2 weeks',
            chapters: [
                'CI/CD Fundamentals for Startups',
                'Choosing the Right Tools and Platforms',
                'Setting Up Your First Pipeline',
                'Automated Testing Strategies',
                'Deployment Patterns and Blue/Green Deployments',
                'Monitoring and Observability',
                'Security and Compliance',
                'Scaling Your CI/CD as You Grow'
            ],
            popularity: 92,
            downloads: 4156,
            rating: 4.9
        },

        {
            id: 'infrastructure-automation-guide',
            title: 'Infrastructure Automation: From Manual to Fully Automated',
            category: 'guides',
            type: 'guide',
            description: 'Step-by-step guide to transform your manual infrastructure management into a fully automated, code-driven system.',
            downloadUrl: '/assets/downloads/infrastructure-automation-guide.pdf',
            tags: ['infrastructure', 'automation', 'iac', 'cloud'],
            difficulty: 'intermediate',
            timeToRead: '3-4 hours',
            timeToImplement: '2-3 weeks',
            chapters: [
                'Infrastructure as Code Fundamentals',
                'Cloud Provider Selection and Setup',
                'Terraform Best Practices and Patterns',
                'Configuration Management with Ansible',
                'Secrets Management and Security',
                'Monitoring and Alerting Setup',
                'Disaster Recovery Planning',
                'Cost Optimization Strategies'
            ],
            popularity: 87,
            downloads: 3298,
            rating: 4.8
        },

        {
            id: 'monitoring-observability-guide',
            title: 'Monitoring and Observability for Startup Applications',
            category: 'guides',
            type: 'guide',
            description: 'Complete guide to implementing monitoring, logging, and observability for startup applications with practical examples.',
            downloadUrl: '/assets/downloads/monitoring-observability-guide.pdf',
            tags: ['monitoring', 'observability', 'logging', 'alerting'],
            difficulty: 'intermediate',
            timeToRead: '2-3 hours',
            timeToImplement: '1-2 weeks',
            chapters: [
                'The Three Pillars of Observability',
                'Metrics: What to Monitor and Why',
                'Logging Best Practices and Strategies',
                'Distributed Tracing for Microservices',
                'Alerting That Actually Works',
                'Dashboard Design and Visualization',
                'Incident Response and Post-mortems',
                'Cost-Effective Monitoring for Startups'
            ],
            popularity: 83,
            downloads: 2744,
            rating: 4.7
        },

        // Checklists & Audits
        {
            id: 'startup-devops-readiness-checklist',
            title: 'Startup DevOps Readiness Checklist',
            category: 'checklists',
            type: 'checklist',
            description: 'Comprehensive 100-point checklist to assess your startup\'s DevOps maturity and identify improvement areas.',
            downloadUrl: '/assets/downloads/devops-readiness-checklist.pdf',
            interactiveUrl: '/tools/devops-readiness-assessment',
            tags: ['devops', 'assessment', 'checklist', 'maturity'],
            difficulty: 'beginner',
            timeToComplete: '30-45 minutes',
            sections: [
                'Version Control and Code Management (15 points)',
                'CI/CD Pipeline Assessment (20 points)',
                'Infrastructure and Deployment (20 points)',
                'Monitoring and Observability (15 points)',
                'Security and Compliance (15 points)',
                'Team Collaboration and Culture (15 points)'
            ],
            popularity: 91,
            downloads: 5672,
            rating: 4.9
        },

        {
            id: 'security-automation-checklist',
            title: 'Security Automation Checklist for Startups',
            category: 'checklists',
            type: 'checklist',
            description: 'Essential security automation checklist covering code security, infrastructure security, and compliance requirements.',
            downloadUrl: '/assets/downloads/security-automation-checklist.pdf',
            tags: ['security', 'automation', 'compliance', 'checklist'],
            difficulty: 'intermediate',
            timeToComplete: '45-60 minutes',
            sections: [
                'Code Security and SAST Integration',
                'Infrastructure Security Automation',
                'Secrets Management and Rotation',
                'Compliance and Audit Automation',
                'Incident Response Automation',
                'Security Monitoring and Alerting'
            ],
            popularity: 78,
            downloads: 2156,
            rating: 4.6
        },

        // Video Content
        {
            id: 'cicd-basics-video-series',
            title: 'CI/CD Basics: 5-Part Video Series',
            category: 'videos',
            type: 'video',
            description: 'Comprehensive video series covering CI/CD fundamentals with hands-on examples and real-world scenarios.',
            videoUrl: 'https://youtube.com/playlist?list=resiliotech-cicd-basics',
            duration: '2 hours 30 minutes',
            tags: ['cicd', 'video', 'tutorial', 'basics'],
            difficulty: 'beginner',
            episodes: [
                'Introduction to CI/CD (25 minutes)',
                'Setting Up Your First Pipeline (35 minutes)',
                'Automated Testing Strategies (28 minutes)',
                'Deployment Automation (32 minutes)',
                'Monitoring and Debugging (30 minutes)'
            ],
            popularity: 89,
            views: 12847,
            rating: 4.8
        },

        // Free Tools
        {
            id: 'roi-calculator',
            title: 'DevOps Automation ROI Calculator',
            category: 'tools',
            type: 'tool',
            description: 'Interactive calculator to estimate the ROI of implementing DevOps automation in your startup.',
            toolUrl: '/tools/roi-calculator',
            tags: ['roi', 'calculator', 'automation', 'business-case'],
            difficulty: 'beginner',
            timeToUse: '5-10 minutes',
            features: [
                'Team size and cost analysis',
                'Deployment frequency impact calculation',
                'Incident reduction projections',
                'Productivity improvement estimates',
                'Shareable results and reports'
            ],
            popularity: 94,
            uses: 8934,
            rating: 4.9
        },

        {
            id: 'infrastructure-cost-optimizer',
            title: 'Cloud Infrastructure Cost Optimizer',
            category: 'tools',
            type: 'tool',
            description: 'Free tool to analyze and optimize your cloud infrastructure costs with actionable recommendations.',
            toolUrl: '/tools/cost-optimizer',
            tags: ['cost-optimization', 'cloud', 'aws', 'calculator'],
            difficulty: 'intermediate',
            timeToUse: '15-20 minutes',
            features: [
                'AWS cost analysis and recommendations',
                'Right-sizing suggestions for EC2 instances',
                'Storage optimization opportunities',
                'Reserved instance recommendations',
                'Automated savings projections'
            ],
            popularity: 86,
            uses: 3421,
            rating: 4.7
        }
    ],

    // Utility methods
    getAll() {
        return this.resources;
    },

    getByCategory(category) {
        return this.resources.filter(resource => resource.category === category);
    },

    getByTag(tag) {
        return this.resources.filter(resource => 
            resource.tags.includes(tag.toLowerCase())
        );
    },

    getByDifficulty(difficulty) {
        return this.resources.filter(resource => resource.difficulty === difficulty);
    },

    getPopular(count = 6) {
        return this.resources
            .sort((a, b) => b.popularity - a.popularity)
            .slice(0, count);
    },

    getRecent(count = 6) {
        // In a real implementation, this would sort by date
        return this.resources.slice(0, count);
    },

    getFeatured() {
        return this.resources.filter(resource => resource.popularity >= 90);
    },

    search(query) {
        const searchTerm = query.toLowerCase();
        return this.resources.filter(resource => 
            resource.title.toLowerCase().includes(searchTerm) ||
            resource.description.toLowerCase().includes(searchTerm) ||
            resource.tags.some(tag => tag.includes(searchTerm))
        );
    },

    getById(id) {
        return this.resources.find(resource => resource.id === id);
    },

    getRecommendations(currentResource, count = 3) {
        // Simple recommendation based on shared tags
        const currentTags = currentResource.tags;
        const scored = this.resources
            .filter(resource => resource.id !== currentResource.id)
            .map(resource => {
                const sharedTags = resource.tags.filter(tag => 
                    currentTags.includes(tag)
                ).length;
                return { ...resource, score: sharedTags };
            })
            .sort((a, b) => b.score - a.score);
        
        return scored.slice(0, count);
    }
};

// Export for use in other modules
if (typeof window !== 'undefined') {
    window.resourcesLibrary = resourcesLibrary;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = resourcesLibrary;
}