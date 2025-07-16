/**
 * Page Configuration System for Resilio Tech
 * Centralizes page-specific configurations and meta data
 */

class PageConfig {
    constructor() {
        this.configs = {
            home: {
                title: 'Resilio Tech - Expert SRE Consulting | Infrastructure Resilience',
                description: 'Resilio Tech - Expert SRE consulting that transforms your tech stack from fragile to fortress-strong. Infrastructure resilience, monitoring, and DevOps acceleration.',
                keywords: 'SRE consulting, infrastructure resilience, DevOps, monitoring, observability, site reliability engineering',
                ogType: 'website',
                ogTitle: 'Resilio Tech - Bulletproof Infrastructure. Zero-Downtime Dreams.',
                ogDescription: 'Expert SRE consulting that transforms your tech stack from fragile to fortress-strong.',
                ogImage: 'https://resiliotech.com/assets/images/og-image.jpg',
                twitterTitle: 'Resilio Tech - Bulletproof Infrastructure. Zero-Downtime Dreams.',
                twitterDescription: 'Expert SRE consulting that transforms your tech stack from fragile to fortress-strong.',
                twitterImage: 'https://resiliotech.com/assets/images/twitter-card.jpg',
                css: [
                    'assets/css/styles.css',
                    'assets/css/hero-animation.css'
                ],
                js: [
                    'assets/js/main.js',
                    'assets/js/hero-animation.js'
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
            projects: {
                title: 'Projects - Resilio Tech | SRE Success Stories',
                description: 'Explore our latest projects showcasing expertise in cloud migration, DevOps transformation, microservices architecture, and site reliability engineering.',
                keywords: 'SRE projects, cloud migration, DevOps transformation, microservices, Kubernetes, infrastructure projects',
                ogType: 'website',
                ogTitle: 'Resilio Tech Projects - SRE Success Stories',
                ogDescription: 'Discover our successful implementations across cloud infrastructure, DevOps, and site reliability engineering.',
                ogImage: 'https://resiliotech.com/assets/images/projects-og-image.jpg',
                twitterTitle: 'Resilio Tech Projects - SRE Success Stories',
                twitterDescription: 'Discover our successful implementations across cloud infrastructure, DevOps, and site reliability engineering.',
                twitterImage: 'https://resiliotech.com/assets/images/projects-twitter-card.jpg',
                css: [
                    'assets/css/projects.css'
                ],
                js: [
                    'assets/js/projects.js'
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
            twitterUrl: this.getCurrentUrl(),
            twitterTitle: config.twitterTitle,
            twitterDescription: config.twitterDescription,
            twitterImage: config.twitterImage,
            faviconUrl: basePath + 'assets/images/favicon.ico',
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
            blogUrl: basePath + 'blog/',
            logoUrl: basePath + 'assets/images/logo.svg',
            homeActive: pageType === 'home' ? 'active' : '',
            servicesActive: '',
            aboutActive: '',
            projectsActive: '',
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
            blogUrl: basePath + 'blog/',
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
                heroTitle: '<span class="hero-title-main">Bulletproof Infrastructure.</span><span class="hero-title-accent">Zero-Downtime Dreams.</span>',
                heroDescription: 'Expert SRE consulting that transforms your tech stack from fragile to fortress-strong. Sleep better knowing your systems won\'t wake you at 3 AM.',
                heroAdditionalContent: `
                    <div class="hero-cta">
                        <a href="#contact" class="btn btn-primary">Get Your Free Infrastructure Health Check</a>
                        <a href="#services" class="btn btn-secondary">Learn More</a>
                    </div>
                    <div class="hero-stats">
                        <div class="stat">
                            <span class="stat-number">99.99%</span>
                            <span class="stat-label">Uptime Delivered</span>
                        </div>
                        <div class="stat">
                            <span class="stat-number">500+</span>
                            <span class="stat-label">Companies Served</span>
                        </div>
                        <div class="stat">
                            <span class="stat-number">24/7</span>
                            <span class="stat-label">Monitoring</span>
                        </div>
                    </div>
                `,
                heroRightContent: `
                    <div class="hero-animation-container">
                        <object data="${basePath}assets/images/hero-animation.svg" type="image/svg+xml" class="hero-animation" aria-label="Interactive visualization showcasing SRE and DevOps technologies including Kubernetes, Docker, AWS, Azure, Jenkins, GitHub Actions, Terraform, Prometheus, Grafana, Ansible, Helm, Blockchain, and GCP" role="img" tabindex="0">
                            <img src="${basePath}assets/images/hero-animation.svg" alt="Animated diagram showing orbiting technology icons around a central SRE hub, representing our expertise in cloud infrastructure, containerization, CI/CD, monitoring, and automation tools" class="hero-animation">
                        </object>
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
