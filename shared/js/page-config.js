/**
 * Page Configuration System for Resilio Tech
 * Centralizes page-specific configurations and meta data
 */

class PageConfig {
    constructor() {
        this.configs = {
            home: {
                title: 'Resiliotech - DevOps Automation for Fast-Moving Startups',
                description: 'Resilient automation for fast-moving startups. We help early-stage companies scale tech through automation & tooling without the full-time DevOps hire.',
                keywords: 'DevOps automation for startups, startup DevOps consulting, infrastructure automation for early-stage companies, CI/CD automation services, automated infrastructure for startups',
                ogType: 'website',
                ogTitle: 'Resiliotech - Resilient Automation for Fast-Moving Startups',
                ogDescription: 'We help early-stage companies scale tech through automation & tooling—without the full-time DevOps hire.',
                ogImage: 'https://resiliotech.com/assets/images/social/homepage-og-1200x630.jpg',
                ogImageWidth: '1200',
                ogImageHeight: '630',
                ogSiteName: 'Resiliotech',
                twitterTitle: 'Resiliotech - Resilient Automation for Fast-Moving Startups',
                twitterDescription: 'We help early-stage companies scale tech through automation & tooling—without the full-time DevOps hire.',
                twitterImage: 'https://resiliotech.com/assets/images/social/homepage-twitter-1200x630.jpg',
                twitterCard: 'summary_large_image',
                twitterSite: '@resiliotech',
                twitterCreator: '@resiliotech',
                linkedinTitle: 'Resiliotech - Resilient Automation for Fast-Moving Startups',
                linkedinDescription: 'We help early-stage companies scale tech through automation & tooling—without the full-time DevOps hire.',
                css: [
                    'assets/css/styles.css'
                ],
                js: [
                    'assets/js/main.js'
                ]
            },
            blog: {
                title: 'Blog - Resilio Tech | SRE & Infrastructure Insights',
                description: 'Read our latest insights on Site Reliability Engineering, infrastructure best practices, and cloud solutions.',
                keywords: 'SRE blog, DevOps insights, infrastructure best practices, cloud solutions, monitoring, observability',
                ogType: 'website',
                ogTitle: 'Resilio Tech Blog - SRE & Infrastructure Insights',
                ogDescription: 'Expert insights on Site Reliability Engineering, DevOps, Cloud Infrastructure, and Platform Engineering.',
                ogImage: 'https://resiliotech.com/assets/images/blog-og-image.jpg',
                twitterTitle: 'Resilio Tech Blog - SRE & Infrastructure Insights',
                twitterDescription: 'Expert insights on Site Reliability Engineering, DevOps, Cloud Infrastructure, and Platform Engineering.',
                twitterImage: 'https://resiliotech.com/assets/images/blog-twitter-card.jpg',
                css: [
                    'assets/css/blog.css'
                ],
                js: [
                    'assets/js/blog.js'
                ],
                external: {
                    css: [
                        'https://unpkg.com/aos@2.3.1/dist/aos.css'
                    ],
                    js: [
                        'https://unpkg.com/aos@2.3.1/dist/aos.js'
                    ]
                }
            },
            products: {
                title: 'Products - Resiliotech | Coming Soon: SaaS Automation Tools',
                description: 'Revolutionary SaaS automation tools for startups. Be first to access our DevOps Health Monitor and Automation Audit Tool. Join the waitlist today.',
                keywords: 'SaaS automation tools, DevOps automation software, startup automation platform, automated DevOps monitoring, infrastructure automation SaaS',
                ogType: 'website',
                ogTitle: 'Resiliotech Products - SaaS Automation Tools Coming Soon',
                ogDescription: 'Revolutionary SaaS automation tools for startups. Be first to access our DevOps Health Monitor and Automation Audit Tool.',
                ogImage: 'https://resiliotech.com/assets/images/products-og-image.jpg',
                twitterTitle: 'Resiliotech Products - SaaS Automation Tools Coming Soon',
                twitterDescription: 'Revolutionary SaaS automation tools for startups. Be first to access our DevOps Health Monitor and Automation Audit Tool.',
                twitterImage: 'https://resiliotech.com/assets/images/products-twitter-card.jpg',
                css: [
                    'assets/css/products.css'
                ],
                js: [
                    'assets/js/products.js'
                ]
            },
            resources: {
                title: 'Resources - Resilio Tech | SRE & Infrastructure Insights',
                description: 'Access our comprehensive resources on Site Reliability Engineering, DevOps practices, and infrastructure best practices.',
                keywords: 'SRE resources, DevOps articles, infrastructure guides, monitoring best practices, observability',
                ogType: 'website',
                ogTitle: 'Resilio Tech Resources - SRE & Infrastructure Insights',
                ogDescription: 'Comprehensive resources on Site Reliability Engineering, DevOps practices, and infrastructure best practices.',
                ogImage: 'https://resiliotech.com/assets/images/resources-og-image.jpg',
                twitterTitle: 'Resilio Tech Resources - SRE & Infrastructure Insights',
                twitterDescription: 'Comprehensive resources on Site Reliability Engineering, DevOps practices, and infrastructure best practices.',
                twitterImage: 'https://resiliotech.com/assets/images/resources-twitter-card.jpg',
                css: [
                    'assets/css/resources.css'
                ],
                js: [
                    'assets/js/resources.js'
                ]
            },
            newsletter: {
                title: 'Resilient Startups Newsletter - Resiliotech | DevOps Automation Insights',
                description: 'Subscribe to Resilient Startups newsletter for bi-monthly insights on startup automation, DevOps best practices, and early access to our SaaS tools.',
                keywords: 'DevOps newsletter, startup automation newsletter, DevOps insights, infrastructure best practices, startup automation tips',
                ogType: 'website',
                ogTitle: 'Resilient Startups Newsletter - DevOps Automation Insights',
                ogDescription: 'Get bi-monthly insights on startup automation, DevOps best practices, case studies, and early access to our SaaS tools.',
                ogImage: 'https://resiliotech.com/assets/images/social/newsletter-og-1200x630.jpg',
                ogImageWidth: '1200',
                ogImageHeight: '630',
                ogSiteName: 'Resiliotech',
                twitterTitle: 'Resilient Startups Newsletter - DevOps Automation Insights',
                twitterDescription: 'Get bi-monthly insights on startup automation, DevOps best practices, case studies, and early access to our SaaS tools.',
                twitterImage: 'https://resiliotech.com/assets/images/social/newsletter-twitter-1200x630.jpg',
                twitterCard: 'summary_large_image',
                twitterSite: '@resiliotech',
                twitterCreator: '@resiliotech',
                css: [
                    'assets/css/newsletter.css'
                ],
                js: [
                    'assets/js/newsletter-manager.js'
                ]
            },
            consulting: {
                title: 'DevOps Automation Consulting for Startups - Resiliotech',
                description: 'DevOps automation consulting for startups. We help early-stage companies scale through automated infrastructure, CI/CD pipelines, and monitoring without hiring full-time DevOps engineers.',
                keywords: 'DevOps automation consulting, startup DevOps services, infrastructure automation for startups, CI/CD automation services, startup DevOps consulting',
                ogType: 'website',
                ogTitle: 'DevOps Automation Consulting for Startups - Resiliotech',
                ogDescription: 'Launch faster, scale effortlessly with startup-focused DevOps automation. From CI/CD pipelines to infrastructure automation - no full-time DevOps hire needed.',
                ogImage: 'https://resiliotech.com/assets/images/social/consulting-og-1200x630.jpg',
                ogImageWidth: '1200',
                ogImageHeight: '630',
                ogSiteName: 'Resiliotech',
                twitterTitle: 'DevOps Automation Consulting for Startups - Resiliotech',
                twitterDescription: 'Launch faster, scale effortlessly with startup-focused DevOps automation. From CI/CD pipelines to infrastructure automation - no full-time DevOps hire needed.',
                twitterImage: 'https://resiliotech.com/assets/images/social/consulting-twitter-1200x630.jpg',
                twitterCard: 'summary_large_image',
                twitterSite: '@resiliotech',
                twitterCreator: '@resiliotech',
                css: [
                    'assets/css/styles.css'
                ],
                js: [
                    'assets/js/enhanced-forms.js',
                    'assets/js/contact-form.js',
                    'shared/js/common.js',
                    'assets/js/analytics.js'
                ]
            },
            
            blog: {
                title: 'DevOps & Automation Blog - Resiliotech | Startup Automation Guides',
                description: 'DevOps automation insights, tutorials, and guides for startups. Learn how to implement CI/CD, infrastructure automation, and scale your technical operations.',
                keywords: 'DevOps blog, startup automation guides, CI/CD tutorials, infrastructure automation, startup DevOps consulting',
                ogType: 'website',
                ogTitle: 'DevOps & Automation Blog - Resiliotech',
                ogDescription: 'DevOps automation insights, tutorials, and guides for startups. Learn how to implement CI/CD, infrastructure automation, and scale your technical operations.',
                ogImage: 'https://resiliotech.com/assets/images/social/blog-og-1200x630.jpg',
                ogImageWidth: '1200',
                ogImageHeight: '630',
                ogSiteName: 'Resiliotech',
                twitterTitle: 'DevOps & Automation Blog - Resiliotech',
                twitterDescription: 'DevOps automation insights, tutorials, and guides for startups. Learn how to implement CI/CD, infrastructure automation, and scale your technical operations.',
                twitterImage: 'https://resiliotech.com/assets/images/social/blog-twitter-1200x630.jpg',
                twitterCard: 'summary_large_image',
                twitterSite: '@resiliotech',
                twitterCreator: '@resiliotech',
                css: [
                    'blog/assets/css/blog.css'
                ],
                js: [
                    'blog/assets/js/blog-manager.js',
                    'assets/data/blog-content.js',
                    'assets/js/content-manager.js'
                ]
            }
        };
    }

    /**
     * Get configuration for a specific page
     * @param {string} pageType - Type of page (home, blog, etc.)
     * @returns {Object} Page configuration
     */
    getConfig(pageType) {
        return this.configs[pageType] || this.configs.home;
    }

    /**
     * Get meta variables for a page
     * @param {string} pageType - Type of page
     * @param {Object} overrides - Override values
     * @returns {Object} Meta variables
     */
    getMetaVariables(pageType, overrides = {}) {
        const config = this.getConfig(pageType);
        const basePath = this.getBasePath();
        
        return {
            description: config.description,
            keywords: config.keywords,
            ogType: config.ogType,
            ogUrl: this.getCurrentUrl(),
            ogTitle: config.ogTitle,
            ogDescription: config.ogDescription,
            ogImage: config.ogImage,
            ogImageWidth: config.ogImageWidth || '1200',
            ogImageHeight: config.ogImageHeight || '630',
            ogSiteName: config.ogSiteName || 'Resiliotech',
            twitterUrl: this.getCurrentUrl(),
            twitterTitle: config.twitterTitle,
            twitterDescription: config.twitterDescription,
            twitterImage: config.twitterImage,
            twitterCard: config.twitterCard || 'summary_large_image',
            twitterSite: config.twitterSite || '@resiliotech',
            twitterCreator: config.twitterCreator || '@resiliotech',
            linkedinTitle: config.linkedinTitle,
            linkedinDescription: config.linkedinDescription,
            faviconUrl: basePath + 'assets/images/favicon.svg',
            commonCssUrl: basePath + 'shared/css/common.css',
            additionalCss: this.generateCssLinks(config.css, basePath, config.external?.css),
            ...overrides
        };
    }

    /**
     * Get navigation variables for a page
     * @param {string} pageType - Type of page
     * @param {Object} overrides - Override values
     * @returns {Object} Navigation variables
     */
    getNavigationVariables(pageType, overrides = {}) {
        const basePath = this.getBasePath();
        
        return {
            homeUrl: basePath,
            consultingUrl: basePath + 'consulting/',
            productsUrl: basePath + 'products/',
            projectsUrl: basePath + 'projects/',
            resourcesUrl: basePath + 'resources/',
            blogUrl: basePath + 'blog/',
            newsletterUrl: basePath + 'newsletter/',
            logoUrl: basePath + 'assets/images/logo.svg',
            homeActive: pageType === 'home' ? 'active' : '',
            consultingActive: pageType === 'consulting' ? 'active' : '',
            productsActive: pageType === 'products' ? 'active' : '',
            projectsActive: pageType === 'projects' ? 'active' : '',
            resourcesActive: pageType === 'resources' ? 'active' : '',
            aboutActive: '',
            blogActive: pageType === 'blog' ? 'active' : '',
            contactActive: '',
            ...overrides
        };
    }

    /**
     * Get footer variables for a page
     * @param {string} pageType - Type of page
     * @param {Object} overrides - Override values
     * @returns {Object} Footer variables
     */
    getFooterVariables(pageType, overrides = {}) {
        const basePath = this.getBasePath();
        
        return {
            homeUrl: basePath,
            consultingUrl: basePath + 'consulting/',
            blogUrl: basePath + 'blog/',
            productsUrl: basePath + 'products/',
            resourcesUrl: basePath + 'resources/',
            newsletterUrl: basePath + 'newsletter/',
            logoUrl: basePath + 'assets/images/logo.svg',
            ...overrides
        };
    }

    /**
     * Generate CSS link tags
     * @param {Array} cssFiles - Array of CSS file paths
     * @param {string} basePath - Base path
     * @param {Array} externalCss - Array of external CSS URLs
     * @returns {string} CSS link tags
     */
    generateCssLinks(cssFiles = [], basePath = '', externalCss = []) {
        let links = '';
        
        // Add local CSS files
        cssFiles.forEach(file => {
            links += `<link rel="stylesheet" href="${basePath}${file}">\n`;
        });
        
        // Add external CSS files
        externalCss.forEach(url => {
            links += `<link rel="stylesheet" href="${url}">\n`;
        });
        
        return links;
    }

    /**
     * Generate JavaScript script tags
     * @param {Array} jsFiles - Array of JS file paths
     * @param {string} basePath - Base path
     * @param {Array} externalJs - Array of external JS URLs
     * @returns {string} Script tags
     */
    generateScriptTags(jsFiles = [], basePath = '', externalJs = []) {
        let scripts = '';
        
        // Add local JS files
        jsFiles.forEach(file => {
            scripts += `<script src="${basePath}${file}"></script>\n`;
        });
        
        // Add external JS files
        externalJs.forEach(url => {
            scripts += `<script src="${url}"></script>\n`;
        });
        
        return scripts;
    }

    /**
     * Get base path based on current location
     * @returns {string} Base path
     */
    getBasePath() {
        const path = window.location.pathname;
        if (path.includes('/blog/')) {
            return '../';
        }
        return './';
    }

    /**
     * Get current URL
     * @returns {string} Current URL
     */
    getCurrentUrl() {
        return window.location.href;
    }

    /**
     * Initialize page with configuration
     * @param {string} pageType - Type of page
     * @param {Object} customConfig - Custom configuration
     */
    async initializePage(pageType, customConfig = {}) {
        const config = this.getConfig(pageType);
        
        // Set page title
        document.title = config.title;
        
        // Initialize components with proper configuration
        await this.loadComponents(pageType, customConfig);
        
        // Load page-specific scripts
        this.loadPageScripts(config, customConfig);
    }

    /**
     * Load all components for a page
     * @param {string} pageType - Type of page
     * @param {Object} customConfig - Custom configuration
     */
    async loadComponents(pageType, customConfig = {}) {
        const basePath = this.getBasePath();
        
        // Load navigation component
        await this.loadComponent('navigation', 'navigation-container', basePath, 
            this.getNavigationVariables(pageType, customConfig.navigation));
        
        // Load header component
        await this.loadComponent('header', 'header-container', basePath, 
            this.getHeaderVariables(pageType, customConfig.header));
        
        // Load footer component
        await this.loadComponent('footer', 'footer-container', basePath, 
            this.getFooterVariables(pageType, customConfig.footer));
    }

    /**
     * Load a single component
     * @param {string} componentName - Name of the component
     * @param {string} containerId - ID of the container element
     * @param {string} basePath - Base path for component files
     * @param {Object} variables - Variables to replace in the component
     */
    async loadComponent(componentName, containerId, basePath, variables) {
        try {
            const container = document.getElementById(containerId);
            if (!container || container.innerHTML.trim()) {
                return; // Skip if container doesn't exist or already has content
            }

            const response = await fetch(`${basePath}shared/components/${componentName}.html`);
            if (!response.ok) {
                console.error(`Failed to load ${componentName} component`);
                return;
            }

            let html = await response.text();
            
            // Replace template variables
            Object.entries(variables).forEach(([key, value]) => {
                const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
                html = html.replace(regex, value || '');
            });

            container.innerHTML = html;
            console.log(`${componentName} component loaded successfully`);
        } catch (error) {
            console.error(`Error loading ${componentName} component:`, error);
        }
    }

    /**
     * Get header variables for a page
     * @param {string} pageType - Type of page
     * @param {Object} overrides - Override values
     * @returns {Object} Header variables
     */
    getHeaderVariables(pageType, overrides = {}) {
        const basePath = this.getBasePath();
        
        const defaultVariables = {
            homePageHeader: {
                heroClass: 'hero',
                heroId: ' id="home"',
                heroContainerClass: 'hero-container',
                heroContentClass: 'hero-content',
                heroTitle: '<span class="hero-title-main">Resilient automation</span><span class="hero-title-accent">for fast-moving startups.</span>',
                heroDescription: 'We help early-stage companies scale tech through automation & tooling—without the full-time DevOps hire.',
                heroAdditionalContent: `
                    <div class="hero-cta">
                        <a href="#contact" class="btn btn-primary" data-track="hero-cta">Book Free Automation Audit</a>
                    </div>
                    <div class="hero-stats">
                        <div class="stat">
                            <span class="stat-number">3x</span>
                            <span class="stat-label">Faster Deployments</span>
                        </div>
                        <div class="stat">
                            <span class="stat-number">80%</span>
                            <span class="stat-label">Fewer Incidents</span>
                        </div>
                        <div class="stat">
                            <span class="stat-number">50+</span>
                            <span class="stat-label">Startups Automated</span>
                        </div>
                    </div>
                `,
                heroRightContent: `
                    <div class="tech-grid-container">
                        <div class="tech-grid" role="img" aria-label="Technologies we use for startup automation">
                            <div class="tech-item" title="Kubernetes container orchestration"><img src="${basePath}assets/images/1-kubernetes.svg" alt="Kubernetes logo - Container orchestration for scalable applications" loading="lazy"></div>
                            <div class="tech-item" title="Docker containerization"><img src="${basePath}assets/images/2-docker.svg" alt="Docker logo - Application containerization platform" loading="lazy"></div>
                            <div class="tech-item" title="Amazon Web Services"><img src="${basePath}assets/images/3-aws.svg" alt="AWS logo - Amazon Web Services cloud platform" loading="lazy"></div>
                            <div class="tech-item" title="Microsoft Azure cloud"><img src="${basePath}assets/images/4-azure.svg" alt="Microsoft Azure logo - Cloud computing platform" loading="lazy"></div>
                            <div class="tech-item" title="Google Cloud Platform"><img src="${basePath}assets/images/5-google-cloud.svg" alt="Google Cloud logo - Google Cloud Platform services" loading="lazy"></div>
                            <div class="tech-item" title="Terraform infrastructure as code"><img src="${basePath}assets/images/6-terraform.svg" alt="Terraform logo - Infrastructure as code tool" loading="lazy"></div>
                            <div class="tech-item" title="Ansible automation"><img src="${basePath}assets/images/7-ansible.svg" alt="Ansible logo - IT automation platform" loading="lazy"></div>
                            <div class="tech-item" title="Jenkins CI/CD"><img src="${basePath}assets/images/8-jenkins.svg" alt="Jenkins logo - Continuous integration and deployment" loading="lazy"></div>
                            <div class="tech-item" title="GitHub Actions workflows"><img src="${basePath}assets/images/9-gitHub-actions.svg" alt="GitHub Actions logo - Automated CI/CD workflows" loading="lazy"></div>
                            <div class="tech-item" title="Prometheus monitoring"><img src="${basePath}assets/images/10-prometheus.svg" alt="Prometheus logo - Application monitoring and alerting" loading="lazy"></div>
                            <div class="tech-item" title="Grafana dashboards"><img src="${basePath}assets/images/11-grafana.svg" alt="Grafana logo - Data visualization and monitoring dashboards" loading="lazy"></div>
                            <div class="tech-item" title="Helm Kubernetes packages"><img src="${basePath}assets/images/12-helm.svg" alt="Helm logo - Kubernetes package manager" loading="lazy"></div>
                            <div class="tech-item" title="ArgoCD GitOps"><img src="${basePath}assets/images/13-argocd.svg" alt="ArgoCD logo - GitOps continuous delivery" loading="lazy"></div>
                            <div class="tech-item" title="Elasticsearch search engine"><img src="${basePath}assets/images/14-elasticsearch.svg" alt="Elasticsearch logo - Search and analytics engine" loading="lazy"></div>
                            <div class="tech-item" title="HashiCorp Vault security"><img src="${basePath}assets/images/15-vault.svg" alt="HashiCorp Vault logo - Secrets management" loading="lazy"></div>
                            <div class="tech-item" title="Blockchain technology"><img src="${basePath}assets/images/16-bitcoin.svg" alt="Bitcoin logo - Blockchain and cryptocurrency technology" loading="lazy"></div>
                        </div>
                    </div>
                `,
                heroBottomContent: `
                    <div class="hero-scroll-indicator">
                        <div class="scroll-arrow"></div>
                    </div>
                `
            },
            blogPageHeader: {
                heroClass: 'blog-hero',
                heroId: '',
                heroContainerClass: 'container',
                heroContentClass: 'blog-hero-content',
                heroTitle: 'SRE & DevOps Insights',
                heroDescription: 'Expert perspectives on Site Reliability Engineering, Cloud Infrastructure, Platform Engineering, and DevOps best practices from industry practitioners.',
                heroAdditionalContent: `
                    <div class="hero-search">
                        <div class="search-box">
                            <input type="text" id="search-input" placeholder="Search articles..." aria-label="Search articles">
                            <button type="button" class="search-btn" id="search-btn" aria-label="Search">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <circle cx="11" cy="11" r="8"></circle>
                                    <path d="m21 21-4.35-4.35"></path>
                                </svg>
                            </button>
                        </div>
                    </div>
                `,
                heroRightContent: '',
                heroBottomContent: ''
            }
        };

        const headerConfig = pageType === 'home' ? defaultVariables.homePageHeader : defaultVariables.blogPageHeader;
        
        return {
            ...headerConfig,
            ...overrides
        };
    }

    /**
     * Load page-specific scripts
     * @param {Object} config - Page configuration
     * @param {Object} customConfig - Custom configuration
     */
    loadPageScripts(config, customConfig = {}) {
        const basePath = this.getBasePath();
        
        // Load external JS
        if (config.external?.js) {
            config.external.js.forEach(url => {
                const script = document.createElement('script');
                script.src = url;
                document.head.appendChild(script);
            });
        }
        
        // Load local JS
        if (config.js) {
            config.js.forEach(file => {
                const script = document.createElement('script');
                script.src = basePath + file;
                document.body.appendChild(script);
            });
        }
    }
}

// Create global instance
window.PageConfig = new PageConfig();
