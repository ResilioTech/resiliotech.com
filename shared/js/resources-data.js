/**
 * Central Resources Data Management
 * All resource posts and articles stored in one place for easy management
 */

const resourcesData = {
    posts: [
        {
            id: 1,
            title: "Building Resilient Microservices: Lessons from Production",
            excerpt: "How to design microservices that survive network partitions, service failures, and traffic spikes...",
            date: "Dec 2024",
            readingTime: "5 min read",
            platform: "linkedin",
            url: "https://linkedin.com/pulse/building-resilient-microservices-lessons-production",
            image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=250&fit=crop&crop=center",
            tags: ["SRE", "Microservices", "Production"],
            category: "SRE",
            featured: true
        },
        {
            id: 2,
            title: "The Complete Guide to Infrastructure Monitoring",
            excerpt: "Everything you need to know about setting up comprehensive monitoring for modern applications...",
            date: "Nov 2024",
            readingTime: "8 min read",
            platform: "medium",
            url: "https://medium.com/@resiliotech/complete-guide-infrastructure-monitoring",
            image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop&crop=center",
            tags: ["Monitoring", "Infrastructure", "DevOps"],
            category: "Monitoring",
            featured: true
        },
        {
            id: 3,
            title: "Zero-Downtime Deployments: Theory and Practice",
            excerpt: "Step-by-step guide to implementing deployment strategies that eliminate service interruptions...",
            date: "Oct 2024",
            readingTime: "6 min read",
            platform: "medium",
            url: "https://medium.com/@resiliotech/zero-downtime-deployments-theory-practice",
            image: "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=400&h=250&fit=crop&crop=center",
            tags: ["DevOps", "Deployment", "CI/CD"],
            category: "DevOps",
            featured: true
        },
        {
            id: 4,
            title: "Kubernetes Production Best Practices",
            excerpt: "Essential patterns and anti-patterns for running Kubernetes workloads in production environments...",
            date: "Sep 2024",
            readingTime: "10 min read",
            platform: "linkedin",
            url: "https://linkedin.com/pulse/kubernetes-production-best-practices-resiliotech",
            image: "https://images.unsplash.com/photo-1667372335473-d4db11d72ad1?w=400&h=250&fit=crop&crop=center",
            tags: ["Kubernetes", "Container", "Production"],
            category: "Kubernetes",
            featured: false
        },
        {
            id: 5,
            title: "SRE Fundamentals: Building Reliable Systems",
            excerpt: "Learn the core principles of Site Reliability Engineering and how to build systems that scale...",
            date: "Aug 2024",
            readingTime: "15 min watch",
            platform: "youtube",
            url: "https://www.youtube.com/watch?v=example1",
            image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop&crop=center",
            tags: ["SRE", "Reliability", "Systems"],
            category: "SRE",
            featured: false
        },
        {
            id: 6,
            title: "Building an Effective Observability Strategy",
            excerpt: "How to implement comprehensive observability across your distributed systems and applications...",
            date: "Jul 2024",
            readingTime: "7 min read",
            platform: "medium",
            url: "https://medium.com/@resiliotech/building-effective-observability-strategy",
            image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop&crop=center",
            tags: ["Observability", "Monitoring", "APM"],
            category: "Monitoring",
            featured: false
        },
        {
            id: 7,
            title: "Cloud Security: A Comprehensive Approach",
            excerpt: "Essential security practices for protecting your cloud infrastructure and applications...",
            date: "Jun 2024",
            readingTime: "9 min read",
            platform: "linkedin",
            url: "https://linkedin.com/pulse/cloud-security-comprehensive-approach-resiliotech",
            image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=250&fit=crop&crop=center",
            tags: ["Security", "Cloud", "Best Practices"],
            category: "Security",
            featured: false
        },
        {
            id: 8,
            title: "DevOps Pipeline Optimization Techniques",
            excerpt: "Advanced strategies for optimizing your CI/CD pipelines for speed and reliability...",
            date: "May 2024",
            readingTime: "12 min watch",
            platform: "youtube",
            url: "https://www.youtube.com/watch?v=example2",
            image: "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=400&h=250&fit=crop&crop=center",
            tags: ["DevOps", "CI/CD", "Pipeline"],
            category: "DevOps",
            featured: false
        },
        {
            id: 9,
            title: "Disaster Recovery Planning for Modern Applications",
            excerpt: "How to design and implement robust disaster recovery strategies for cloud-native applications...",
            date: "Jun 2024",
            readingTime: "12 min read",
            platform: "medium",
            url: "https://medium.com/@resiliotech/disaster-recovery-planning-modern-applications",
            image: "https://images.unsplash.com/photo-1504384764586-bb4cdc1707b0?w=400&h=250&fit=crop&crop=center",
            tags: ["Disaster Recovery", "Cloud", "Business Continuity"],
            category: "Cloud",
            featured: false
        },
        {
            id: 10,
            title: "Performance Optimization Techniques for High-Traffic Systems",
            excerpt: "Proven strategies for optimizing system performance under heavy load conditions...",
            date: "May 2024",
            readingTime: "8 min read",
            platform: "linkedin",
            url: "https://linkedin.com/pulse/performance-optimization-techniques-high-traffic-systems",
            image: "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=400&h=250&fit=crop&crop=center",
            tags: ["Performance", "Optimization", "Scalability"],
            category: "Performance",
            featured: false
        },
        {
            id: 11,
            title: "Container Security: Beyond the Basics",
            excerpt: "Advanced security practices for containerized applications and orchestration platforms...",
            date: "Apr 2024",
            readingTime: "11 min read",
            platform: "medium",
            url: "https://medium.com/@resiliotech/container-security-beyond-basics",
            image: "https://images.unsplash.com/photo-1605745341112-85968b19335b?w=400&h=250&fit=crop&crop=center",
            tags: ["Security", "Containers", "Docker"],
            category: "Security",
            featured: false
        },
        {
            id: 12,
            title: "Infrastructure as Code: Best Practices and Pitfalls",
            excerpt: "Learn how to implement IaC effectively while avoiding common mistakes and anti-patterns...",
            date: "Mar 2024",
            readingTime: "9 min read",
            platform: "linkedin",
            url: "https://linkedin.com/pulse/infrastructure-code-best-practices-pitfalls-resiliotech",
            image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop&crop=center",
            tags: ["IaC", "Terraform", "DevOps"],
            category: "Infrastructure",
            featured: false
        },
        {
            id: 13,
            title: "Monitoring and Alerting at Scale",
            excerpt: "Complete guide to building effective monitoring systems for distributed applications...",
            date: "Feb 2024",
            readingTime: "15 min watch",
            platform: "youtube",
            url: "https://www.youtube.com/watch?v=example3",
            image: "https://images.unsplash.com/photo-1605792657660-596af9009e82?w=400&h=250&fit=crop&crop=center",
            tags: ["Monitoring", "Alerting", "Observability"],
            category: "Monitoring",
            featured: false
        },
        {
            id: 14,
            title: "Incident Response: From Chaos to Recovery",
            excerpt: "Learn how to build effective incident response procedures that minimize downtime and restore services quickly...",
            date: "Jan 2024",
            readingTime: "7 min read",
            platform: "medium",
            url: "https://medium.com/@resiliotech/incident-response-chaos-to-recovery",
            image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=250&fit=crop&crop=center",
            tags: ["Incident Response", "SRE", "Operations"],
            category: "SRE",
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
