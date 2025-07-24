/**
 * Central Resources Data Management
 * All resource posts and articles stored in one place for easy management
 */

const resourcesData = {
    posts: [
        {
            id: 1,
            title: "MLOps Pipeline Architecture for Startup Teams",
            excerpt: "Building production-ready machine learning pipelines with minimal resources and maximum reliability...",
            date: "Jan 2025",
            readingTime: "8 min read",
            platform: "medium",
            url: "https://medium.com/@resiliotech/mlops-pipeline-architecture-startup-teams",
            image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=250&fit=crop&crop=center",
            tags: ["MLOps", "Machine Learning", "Startups"],
            category: "MLOps",
            featured: true
        },
        {
            id: 2,
            title: "Kubernetes for AI/ML Workloads: A Practical Guide",
            excerpt: "Deploy and scale machine learning models using Kubernetes with GPU support and auto-scaling...",
            date: "Dec 2024",
            readingTime: "12 min read",
            platform: "linkedin",
            url: "https://linkedin.com/pulse/kubernetes-aiml-workloads-practical-guide-resiliotech",
            image: "https://images.unsplash.com/photo-1667372335473-d4db11d72ad1?w=400&h=250&fit=crop&crop=center",
            tags: ["Kubernetes", "AI/ML", "GPU"],
            category: "MLOps",
            featured: true
        },
        {
            id: 3,
            title: "SRE Principles for Early-Stage Startups",
            excerpt: "Implementing Site Reliability Engineering practices when you have limited resources but need maximum uptime...",
            date: "Nov 2024",
            readingTime: "10 min read",
            platform: "medium",
            url: "https://medium.com/@resiliotech/sre-principles-early-stage-startups",
            image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop&crop=center",
            tags: ["SRE", "Startups", "Reliability"],
            category: "SRE",
            featured: true
        },
        {
            id: 4,
            title: "Terraform for Multi-Cloud MLOps Infrastructure",
            excerpt: "Infrastructure as Code patterns for deploying ML workloads across AWS, Azure, and GCP...",
            date: "Oct 2024",
            readingTime: "15 min read",
            platform: "linkedin",
            url: "https://linkedin.com/pulse/terraform-multi-cloud-mlops-infrastructure-resiliotech",
            image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=250&fit=crop&crop=center",
            tags: ["Terraform", "MLOps", "Multi-Cloud"],
            category: "DevOps",
            featured: false
        },
        {
            id: 5,
            title: "Model Monitoring and Observability Best Practices",
            excerpt: "Comprehensive monitoring strategies for ML models in production, from drift detection to performance tracking...",
            date: "Sep 2024",
            readingTime: "20 min watch",
            platform: "youtube",
            url: "https://www.youtube.com/watch?v=mlops-monitoring-example",
            image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop&crop=center",
            tags: ["Monitoring", "MLOps", "Model Drift"],
            category: "MLOps",
            featured: false
        },
        {
            id: 6,
            title: "GitOps for Machine Learning: Version Control Everything",
            excerpt: "Applying GitOps principles to ML workflows, from data versioning to model deployment automation...",
            date: "Aug 2024",
            readingTime: "12 min read",
            platform: "medium",
            url: "https://medium.com/@resiliotech/gitops-machine-learning-version-control",
            image: "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=400&h=250&fit=crop&crop=center",
            tags: ["GitOps", "MLOps", "Version Control"],
            category: "DevOps",
            featured: false
        },
        {
            id: 7,
            title: "Building Resilient ML Data Pipelines",
            excerpt: "Design patterns for fault-tolerant data pipelines that power your machine learning models...",
            date: "Jul 2024",
            readingTime: "14 min read",
            platform: "linkedin",
            url: "https://linkedin.com/pulse/building-resilient-ml-data-pipelines-resiliotech",
            image: "https://images.unsplash.com/photo-1504384764586-bb4cdc1707b0?w=400&h=250&fit=crop&crop=center",
            tags: ["Data Engineering", "MLOps", "Pipelines"],
            category: "MLOps",
            featured: false
        },
        {
            id: 8,
            title: "Prometheus and Grafana for SRE Teams",
            excerpt: "Complete setup guide for monitoring infrastructure and applications with Prometheus and Grafana...",
            date: "Jun 2024",
            readingTime: "18 min watch",
            platform: "youtube",
            url: "https://www.youtube.com/watch?v=prometheus-grafana-sre",
            image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop&crop=center",
            tags: ["Prometheus", "Grafana", "Monitoring"],
            category: "SRE",
            featured: false
        },
        {
            id: 9,
            title: "Zero-Downtime ML Model Deployments",
            excerpt: "Strategies for deploying machine learning models without service interruption using blue-green and canary deployments...",
            date: "May 2024",
            readingTime: "9 min read",
            platform: "medium",
            url: "https://medium.com/@resiliotech/zero-downtime-ml-model-deployments",
            image: "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=400&h=250&fit=crop&crop=center",
            tags: ["Deployment", "MLOps", "Blue-Green"],
            category: "MLOps",
            featured: false
        },
        {
            id: 10,
            title: "Docker and Containerization for ML Engineers",
            excerpt: "Best practices for containerizing machine learning applications for reproducible deployments...",
            date: "Apr 2024",
            readingTime: "11 min read",
            platform: "linkedin",
            url: "https://linkedin.com/pulse/docker-containerization-ml-engineers-resiliotech",
            image: "https://images.unsplash.com/photo-1605745341112-85968b19335b?w=400&h=250&fit=crop&crop=center",
            tags: ["Docker", "Containers", "MLOps"],
            category: "DevOps",
            featured: false
        },
        {
            id: 11,
            title: "SLOs and Error Budgets for ML Systems",
            excerpt: "Applying Site Reliability Engineering metrics to machine learning systems and model performance...",
            date: "Mar 2024",
            readingTime: "13 min read",
            platform: "medium",
            url: "https://medium.com/@resiliotech/slos-error-budgets-ml-systems",
            image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop&crop=center",
            tags: ["SLO", "Error Budget", "ML Systems"],
            category: "SRE",
            featured: false
        },
        {
            id: 12,
            title: "Feature Stores for ML Teams: A Complete Guide",
            excerpt: "Building and managing feature stores to improve ML model performance and reduce training time...",
            date: "Feb 2024",
            readingTime: "16 min read",
            platform: "medium",
            url: "https://medium.com/@resiliotech/feature-stores-ml-teams-complete-guide",
            image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=250&fit=crop&crop=center",
            tags: ["Feature Store", "MLOps", "Data Engineering"],
            category: "MLOps",
            featured: false
        },
        {
            id: 13,
            title: "CI/CD for Machine Learning Models",
            excerpt: "Implementing continuous integration and deployment pipelines specifically designed for ML workflows...",
            date: "Jan 2024",
            readingTime: "22 min watch",
            platform: "youtube",
            url: "https://www.youtube.com/watch?v=cicd-ml-models",
            image: "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=400&h=250&fit=crop&crop=center",
            tags: ["CI/CD", "MLOps", "Automation"],
            category: "DevOps",
            featured: false
        },
        {
            id: 14,
            title: "Incident Response for ML Systems",
            excerpt: "How to handle incidents in machine learning systems, from model degradation to data pipeline failures...",
            date: "Dec 2023",
            readingTime: "10 min read",
            platform: "linkedin",
            url: "https://linkedin.com/pulse/incident-response-ml-systems-resiliotech",
            image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=250&fit=crop&crop=center",
            tags: ["Incident Response", "MLOps", "SRE"],
            category: "SRE",
            featured: false
        },
        {
            id: 15,
            title: "Scaling Jupyter Notebooks in Production",
            excerpt: "Best practices for moving from notebook experimentation to production-ready ML workflows...",
            date: "Nov 2023",
            readingTime: "12 min read",
            platform: "medium",
            url: "https://medium.com/@resiliotech/scaling-jupyter-notebooks-production",
            image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop&crop=center",
            tags: ["Jupyter", "MLOps", "Production"],
            category: "MLOps",
            featured: false
        }
    ],

    // Platform configurations
    platforms: {
        linkedin: {
            name: "LinkedIn",
            icon: `<path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>`,
            color: "#0077b5"
        },
        medium: {
            name: "Medium",
            icon: `<path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z"/>`,
            color: "#00ab6c"
        },
        youtube: {
            name: "YouTube",
            icon: `<path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>`,
            color: "#ff0000"
        }
    },

    // Helper functions
    getFeaturedPosts: function() {
        return this.posts.filter(post => post.featured);
    },

    getAllPosts: function() {
        return this.posts;
    },

    getPostsByPlatform: function(platform) {
        return this.posts.filter(post => post.platform === platform);
    },

    getPostsByTag: function(tag) {
        return this.posts.filter(post => post.tags.includes(tag));
    },

    getPlatformIcon: function(platform) {
        return this.platforms[platform] ? this.platforms[platform].icon : '';
    },

    getPlatformColor: function(platform) {
        return this.platforms[platform] ? this.platforms[platform].color : '#000000';
    },

    getPlatformName: function(platform) {
        return this.platforms[platform] ? this.platforms[platform].name : platform;
    },

    // Category helper functions
    getUniqueCategories: function() {
        const categories = [...new Set(this.posts.map(post => post.category))];
        return categories.sort();
    },

    getPostsByCategory: function(category) {
        return this.posts.filter(post => post.category === category);
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = resourcesData;
}
