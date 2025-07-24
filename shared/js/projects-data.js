// Projects data for the website - SRE/DevOps/MLOps focused
const projectsData = [
    {
        id: 1,
        title: "MLOps Platform for AI Startup",
        description: "Built end-to-end MLOps platform enabling automated model training, deployment, and monitoring for an early-stage AI startup, reducing model deployment time from weeks to hours.",
        technologies: ["Kubernetes", "MLflow", "Kubeflow", "Prometheus", "Grafana", "TensorFlow", "Docker"],
        icon: "cpu",
        outcomes: {
            deploymentTime: "98% reduction",
            modelAccuracy: "15% improvement"
        },
        category: "MLOps",
        client: "AI Startup",
        duration: "4 months",
        teamSize: "5 members",
        featured: true,
        image: "/assets/images/projects/mlops-platform.jpg",
        link: "#",
        githubRepo: "https://github.com/resiliotech/mlops-platform-starter",
        details: "Designed and implemented a complete MLOps platform from scratch, including automated CI/CD for ML models, feature stores, model versioning, A/B testing infrastructure, and comprehensive monitoring for model drift and performance."
    },
    {
        id: 2,
        title: "SRE Implementation for E-commerce Scale-up",
        description: "Established SRE practices and infrastructure reliability for a rapidly growing e-commerce platform, achieving 99.95% uptime during Black Friday traffic spikes.",
        technologies: ["Kubernetes", "Terraform", "Prometheus", "Grafana", "ELK Stack", "AWS", "Istio"],
        icon: "shield",
        outcomes: {
            uptime: "99.95%",
            incidentResponse: "80% faster"
        },
        category: "SRE",
        client: "E-commerce Scale-up",
        duration: "6 months",
        teamSize: "7 members",
        featured: true,
        image: "/assets/images/projects/sre-implementation.jpg",
        link: "#",
        githubRepo: "https://github.com/resiliotech/sre-toolkit",
        details: "Implemented comprehensive SRE practices including SLI/SLO definitions, error budgets, automated incident response, chaos engineering practices, and established a robust on-call rotation with runbook automation."
    },
    {
        id: 3,
        title: "Multi-Cloud Kubernetes Platform",
        description: "Designed and deployed a multi-cloud Kubernetes platform with automated failover and load balancing across AWS, Azure, and GCP for a fintech startup.",
        technologies: ["Kubernetes", "Helm", "ArgoCD", "Crossplane", "Cilium", "Vault", "Terraform"],
        icon: "globe",
        outcomes: {
            availability: "99.99%",
            costReduction: "35%"
        },
        category: "DevOps",
        client: "Fintech Startup",
        duration: "5 months",
        teamSize: "6 members",
        featured: true,
        image: "/assets/images/projects/multi-cloud-k8s.jpg",
        link: "#",
        githubRepo: "https://github.com/resiliotech/multi-cloud-k8s-platform",
        details: "Architected and implemented a multi-cloud Kubernetes platform with GitOps workflows, automated disaster recovery, policy-as-code security, and unified observability across all cloud providers."
    },
    {
        id: 4,
        title: "Real-time ML Model Serving Infrastructure",
        description: "Built high-performance ML model serving infrastructure capable of handling 10M+ predictions per day with sub-100ms latency for a recommendation engine.",
        technologies: ["Kubernetes", "NVIDIA Triton", "Redis", "Apache Kafka", "Prometheus", "Python", "TensorFlow"],
        icon: "zap",
        outcomes: {
            latency: "Sub-100ms",
            throughput: "10M+ predictions/day"
        },
        category: "MLOps",
        client: "Media Streaming Startup",
        duration: "3 months",
        teamSize: "4 members",
        featured: false,
        image: "/assets/images/projects/ml-serving.jpg",
        link: "#",
        githubRepo: "https://github.com/resiliotech/ml-serving-platform",
        details: "Designed and implemented a high-performance ML model serving infrastructure with auto-scaling, A/B testing capabilities, real-time monitoring, and automated model deployment pipelines."
    },
    {
        id: 5,
        title: "DevOps Pipeline for CI/CD at Scale",
        description: "Built enterprise-grade CI/CD pipelines supporting 100+ microservices with automated testing, security scanning, and progressive deployment strategies.",
        technologies: ["GitLab CI", "ArgoCD", "Helm", "SonarQube", "Vault", "Tekton", "Terraform"],
        icon: "git-branch",
        outcomes: {
            deploymentFrequency: "10x increase",
            leadTime: "90% reduction"
        },
        category: "DevOps",
        client: "Enterprise SaaS Company",
        duration: "7 months",
        teamSize: "8 members",
        featured: false,
        image: "/assets/images/projects/cicd-scale.jpg",
        link: "#",
        githubRepo: "https://github.com/resiliotech/enterprise-cicd-pipeline",
        details: "Implemented a comprehensive CI/CD platform with GitOps workflows, automated security scanning, progressive deployment strategies, and comprehensive testing automation supporting multiple development teams."
    },
    {
        id: 6,
        title: "Automated Data Pipeline for ML Feature Engineering",
        description: "Built robust data pipelines with automated feature engineering, data validation, and monitoring for a fintech ML platform handling 1TB+ daily data.",
        technologies: ["Apache Airflow", "Apache Spark", "Kafka", "Delta Lake", "Great Expectations", "Python"],
        icon: "database",
        outcomes: {
            dataQuality: "99.9% accuracy",
            processingTime: "70% reduction"
        },
        category: "MLOps",
        client: "Fintech Startup",
        duration: "4 months",
        teamSize: "5 members",
        featured: false,
        image: "/assets/images/projects/data-pipeline.jpg",
        link: "#",
        githubRepo: "https://github.com/resiliotech/ml-data-pipeline",
        details: "Designed and implemented scalable data pipelines with automated feature engineering, real-time data validation, lineage tracking, and comprehensive monitoring for ML feature stores."
    },
    {
        id: 7,
        title: "Observability Stack for Microservices",
        description: "Implemented comprehensive observability with distributed tracing, metrics, and logging for a microservices architecture serving 50M+ requests daily.",
        technologies: ["Jaeger", "Prometheus", "Grafana", "ELK Stack", "OpenTelemetry", "Kubernetes"],
        icon: "eye",
        outcomes: {
            debuggingTime: "85% reduction",
            mttr: "Sub-5 minutes"
        },
        category: "SRE",
        client: "E-commerce Platform",
        duration: "5 months",
        teamSize: "6 members",
        featured: false,
        image: "/assets/images/projects/observability.jpg",
        link: "#",
        githubRepo: "https://github.com/resiliotech/observability-stack",
        details: "Built a comprehensive observability platform with distributed tracing, custom metrics, centralized logging, and automated alerting that provides complete visibility into microservices performance and health."
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
