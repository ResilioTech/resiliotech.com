/**
 * Shared Component Loader for Resilio Tech
 * Handles loading and rendering of shared components with template variables
 */

class ComponentLoader {
    constructor() {
        this.components = {};
        this.templateCache = {};
    }

    /**
     * Load a component from the shared components directory
     * @param {string} componentName - Name of the component file (without .html)
     * @param {string} basePath - Base path to shared components
     * @returns {Promise<string>} Component HTML content
     */
    async loadComponent(componentName, basePath = '../shared/components/') {
        if (this.templateCache[componentName]) {
            return this.templateCache[componentName];
        }

        try {
            console.log(`Loading component: ${componentName} from ${basePath}`);
            const response = await fetch(`${basePath}${componentName}.html`);
            if (!response.ok) {
                throw new Error(`Failed to load component: ${componentName} (${response.status})`);
            }
            const html = await response.text();
            this.templateCache[componentName] = html;
            console.log(`Successfully loaded component: ${componentName}`);
            return html;
        } catch (error) {
            console.error(`Error loading component ${componentName}:`, error);
            return '';
        }
    }

    /**
     * Replace template variables in HTML content
     * @param {string} html - HTML content with template variables
     * @param {Object} variables - Object containing variable values
     * @returns {string} Processed HTML
     */
    processTemplate(html, variables = {}) {
        let processedHtml = html;
        
        // Replace template variables like {{variableName}}
        Object.entries(variables).forEach(([key, value]) => {
            const regex = new RegExp(`{{${key}}}`, 'g');
            processedHtml = processedHtml.replace(regex, value || '');
        });
        
        return processedHtml;
    }

    /**
     * Load and render a component with variables
     * @param {string} componentName - Name of the component
     * @param {Object} variables - Template variables
     * @param {string} basePath - Base path to components
     * @returns {Promise<string>} Rendered HTML
     */
    async renderComponent(componentName, variables = {}, basePath = null) {
        if (!basePath) {
            basePath = this.getBasePath() + 'shared/components/';
        }
        const html = await this.loadComponent(componentName, basePath);
        return this.processTemplate(html, variables);
    }

    /**
     * Load and inject navigation component
     * @param {string} containerId - ID of container element
     * @param {Object} config - Navigation configuration
     */
    async loadNavigation(containerId = 'navigation', config = {}) {
        const defaultConfig = {
            homeUrl: this.getBasePath(),
            projectsUrl: this.getBasePath() + 'projects/',
            resourcesUrl: this.getBasePath() + 'resources/',
            logoUrl: this.getBasePath() + 'assets/images/logo.svg',
            homeActive: this.isCurrentPage('home') ? 'active' : '',
            servicesActive: this.isCurrentPage('services') ? 'active' : '',
            aboutActive: this.isCurrentPage('about') ? 'active' : '',
            projectsActive: this.isCurrentPage('projects') ? 'active' : '',
            resourcesActive: this.isCurrentPage('resources') ? 'active' : '',
            contactActive: this.isCurrentPage('contact') ? 'active' : ''
        };

        const finalConfig = { ...defaultConfig, ...config };
        const componentBasePath = this.getBasePath() + 'shared/components/';
        const html = await this.renderComponent('navigation', finalConfig, componentBasePath);
        
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = html;
        } else {
            // If no container, inject before body's first child
            document.body.insertAdjacentHTML('afterbegin', html);
        }
    }

    /**
     * Load and inject footer component
     * @param {string} containerId - ID of container element
     * @param {Object} config - Footer configuration
     */
    async loadFooter(containerId = 'footer', config = {}) {
        const defaultConfig = {
            homeUrl: this.getBasePath(),
            blogUrl: this.getBasePath() + 'blog/',
            logoUrl: this.getBasePath() + 'assets/images/logo.svg'
        };

        const finalConfig = { ...defaultConfig, ...config };
        const componentBasePath = this.getBasePath() + 'shared/components/';
        const html = await this.renderComponent('footer', finalConfig, componentBasePath);
        
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = html;
        } else {
            // If no container, append to body
            document.body.insertAdjacentHTML('beforeend', html);
        }
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
     * Check if current page matches given page type
     * @param {string} pageType - Type of page (home, blog, etc.)
     * @returns {boolean} True if current page matches
     */
    isCurrentPage(pageType) {
        const path = window.location.pathname;
        const hash = window.location.hash;

        switch (pageType) {
            case 'home':
                return path === '/' || path.endsWith('/index.html') || path.endsWith('/');
            case 'blog':
                return path.includes('/blog/');
            case 'services':
                return hash === '#services';
            case 'about':
                return hash === '#about';
            case 'projects':
                return hash === '#projects';
            case 'contact':
                return hash === '#contact';
            default:
                return false;
        }
    }

    /**
     * Initialize common components for a page
     * @param {Object} config - Configuration object
     */
    async initializeComponents(config = {}) {
        // Load navigation
        await this.loadNavigation(config.navigationId, config.navigation);
        
        // Load footer
        await this.loadFooter(config.footerId, config.footer);
        
        // Initialize common JavaScript functionality
        if (window.ResilioCommon) {
            new ResilioCommon();
        }
    }
}

// Create global instance
window.ComponentLoader = new ComponentLoader();

// Note: Auto-initialization is disabled. Components are loaded manually in each page.
