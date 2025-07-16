// Projects data for the website
const projectsData = [
    {
        id: 1,
        title: "Cloud Migration & Modernization",
        description: "Complete cloud migration strategy and implementation for a Fortune 500 company, reducing infrastructure costs by 40% while improving performance and scalability.",
        technologies: ["AWS", "Kubernetes", "Docker", "Terraform", "Jenkins"],
        icon: "cloud",
        outcomes: {
            costReduction: "40%",
            performance: "3x faster"
        },
        category: "Cloud Migration",
        client: "Fortune 500 Company",
        duration: "8 months",
        teamSize: "12 members",
        featured: true,
        image: "/assets/images/projects/cloud-migration.jpg",
        link: "#",
        githubRepo: "https://github.com/resiliotech/cloud-migration-toolkit",
        details: "Led a comprehensive cloud migration initiative that transformed legacy infrastructure into a modern, scalable cloud environment. Implemented automated CI/CD pipelines, containerized applications, and established monitoring and observability systems."
    },
    {
        id: 2,
        title: "DevOps Transformation",
        description: "Implemented comprehensive DevOps practices including CI/CD pipelines, automated testing, and infrastructure as code for a mid-size technology company.",
        technologies: ["Jenkins", "Docker", "Ansible", "GitLab", "Prometheus"],
        icon: "settings",
        outcomes: {
            deployment: "10x faster",
            uptime: "99.9%"
        },
        category: "DevOps",
        client: "Tech Startup",
        duration: "6 months",
        teamSize: "8 members",
        featured: true,
        image: "/assets/images/projects/devops-transformation.jpg",
        link: "#",
        githubRepo: "https://github.com/resiliotech/devops-automation-suite",
        details: "Transformed development and deployment processes by implementing automated CI/CD pipelines, containerization strategies, and comprehensive monitoring solutions. Reduced deployment time from hours to minutes while improving system reliability."
    },
    {
        id: 3,
        title: "Microservices Architecture",
        description: "Redesigned monolithic application into microservices architecture, improving scalability and maintainability for a e-commerce platform.",
        technologies: ["Node.js", "MongoDB", "Redis", "RabbitMQ", "Docker"],
        icon: "layers",
        outcomes: {
            scalability: "5x improved",
            maintenance: "60% easier"
        },
        category: "Architecture",
        client: "E-commerce Platform",
        duration: "10 months",
        teamSize: "15 members",
        featured: true,
        image: "/assets/images/projects/microservices.jpg",
        link: "#",
        details: "Architected and implemented a complete microservices transformation, breaking down a monolithic e-commerce platform into independently deployable services. Established service mesh, API gateways, and distributed monitoring systems."
    },
    {
        id: 4,
        title: "Site Reliability Engineering",
        description: "Established SRE practices including incident response, monitoring, and performance optimization for a financial services company.",
        technologies: ["Grafana", "Prometheus", "ELK Stack", "PagerDuty", "Terraform"],
        icon: "shield",
        outcomes: {
            incidents: "80% reduction",
            mttr: "5 minutes"
        },
        category: "SRE",
        client: "Financial Services",
        duration: "12 months",
        teamSize: "6 members",
        featured: false,
        image: "/assets/images/projects/sre.jpg",
        link: "#",
        details: "Implemented comprehensive SRE practices including error budgets, SLIs/SLOs, automated incident response, and performance monitoring. Established a culture of reliability and continuous improvement."
    },
    {
        id: 5,
        title: "Kubernetes Orchestration",
        description: "Deployed and managed Kubernetes clusters for container orchestration, enabling auto-scaling and improved resource utilization.",
        technologies: ["Kubernetes", "Helm", "Istio", "Prometheus", "Grafana"],
        icon: "cpu",
        outcomes: {
            efficiency: "70% improved",
            scaling: "Automatic"
        },
        category: "Container Orchestration",
        client: "Software Company",
        duration: "4 months",
        teamSize: "5 members",
        featured: false,
        image: "/assets/images/projects/kubernetes.jpg",
        link: "#",
        githubRepo: "https://github.com/resiliotech/k8s-orchestration",
        details: "Designed and implemented a production-ready Kubernetes environment with service mesh, automated scaling, and comprehensive monitoring. Enabled efficient resource utilization and improved application reliability."
    },
    {
        id: 6,
        title: "Security & Compliance",
        description: "Implemented comprehensive security measures and compliance frameworks for a healthcare technology company.",
        technologies: ["Vault", "Consul", "SIEM", "Terraform", "Ansible"],
        icon: "lock",
        outcomes: {
            compliance: "100% SOC2",
            security: "Zero breaches"
        },
        category: "Security",
        client: "Healthcare Tech",
        duration: "9 months",
        teamSize: "10 members",
        featured: false,
        image: "/assets/images/projects/security.jpg",
        link: "#",
        details: "Established comprehensive security posture including secrets management, access controls, compliance monitoring, and incident response procedures. Achieved SOC2 Type II certification and implemented zero-trust architecture."
    }
];

// Helper functions
function getLatestProjects(count = 3) {
    return projectsData
        .sort((a, b) => b.id - a.id)
        .slice(0, count);
}

function getFeaturedProjects() {
    return projectsData.filter(project => project.featured);
}

function getProjectsByCategory(category) {
    return projectsData.filter(project => project.category === category);
}

function getProjectById(id) {
    return projectsData.find(project => project.id === parseInt(id));
}

function getAllCategories() {
    return [...new Set(projectsData.map(project => project.category))];
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        projectsData,
        getLatestProjects,
        getFeaturedProjects,
        getProjectsByCategory,
        getProjectById,
        getAllCategories
    };
}
