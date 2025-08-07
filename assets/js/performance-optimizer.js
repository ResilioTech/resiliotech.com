/**
 * Advanced Performance Optimization System
 * Core Web Vitals focused - Handles lazy loading, caching, preloading, and performance monitoring
 * Optimized for <150KB critical path and excellent Core Web Vitals scores
 */

class PerformanceOptimizer {
    constructor() {
        this.config = {
            enableLazyLoading: true,
            enablePreloading: true,
            enableServiceWorker: true,
            enableCaching: true,
            performanceMetrics: true,
            debugMode: window.location.hostname === 'localhost',
            // Core Web Vitals thresholds
            thresholds: {
                LCP: 2500, // Good: <2.5s
                FID: 100,  // Good: <100ms  
                CLS: 0.1   // Good: <0.1
            }
        };
        
        this.metrics = {
            startTime: performance.now(),
            loadTime: 0,
            interactionTime: 0,
            cacheHits: 0,
            totalRequests: 0,
            // Core Web Vitals tracking
            LCP: 0,
            FID: 0,
            CLS: 0,
            TTFB: 0
        };
        
        this.cache = new Map();
        this.observers = {};
        this.calendlyPreloaded = false;
        
        this.init();
    }

    init() {
        this.log('Performance Optimizer initializing...');
        
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initialize());
        } else {
            this.initialize();
        }
    }

    initialize() {
        this.setupLazyLoading();
        this.setupImageOptimization();
        this.setupPreloading();
        this.setupCaching();
        this.setupPerformanceMonitoring();
        this.setupServiceWorker();
        this.optimizeAnimations();
        this.setupResourceHints();
        
        this.log('Performance Optimizer initialized');
    }

    // Lazy Loading Implementation
    setupLazyLoading() {
        if (!this.config.enableLazyLoading) return;

        // Intersection Observer for images
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    this.loadImage(img);
                    imageObserver.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.1
        });

        // Observe all images with data-src
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });

        // Lazy load sections/components
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const section = entry.target;
                    this.loadSection(section);
                    sectionObserver.unobserve(section);
                }
            });
        }, {
            rootMargin: '100px 0px',
            threshold: 0.1
        });

        document.querySelectorAll('[data-lazy-load]').forEach(section => {
            sectionObserver.observe(section);
        });

        this.observers.images = imageObserver;
        this.observers.sections = sectionObserver;
    }

    loadImage(img) {
        const src = img.getAttribute('data-src');
        if (!src) return;

        // Create a new image to preload
        const newImg = new Image();
        newImg.onload = () => {
            img.src = src;
            img.removeAttribute('data-src');
            img.classList.add('loaded');
            this.log(`Lazy loaded image: ${src}`);
        };
        newImg.onerror = () => {
            img.classList.add('error');
            this.log(`Failed to load image: ${src}`);
        };
        newImg.src = src;
    }

    loadSection(section) {
        section.classList.add('lazy-loaded');
        
        // Load any components within the section
        const components = section.querySelectorAll('[data-component]');
        components.forEach(component => {
            this.loadComponent(component);
        });
        
        this.log(`Lazy loaded section: ${section.id || section.className}`);
    }

    loadComponent(component) {
        const componentType = component.getAttribute('data-component');
        
        // Load component-specific functionality
        switch (componentType) {
            case 'modal':
                this.initializeModal(component);
                break;
            case 'form':
                this.initializeForm(component);
                break;
            case 'calculator':
                this.initializeCalculator(component);
                break;
            default:
                component.classList.add('component-loaded');
        }
    }

    // Image Optimization
    setupImageOptimization() {
        // Add responsive image support
        document.querySelectorAll('img').forEach(img => {
            if (!img.getAttribute('loading')) {
                img.setAttribute('loading', 'lazy');
            }
            
            if (!img.getAttribute('decoding')) {
                img.setAttribute('decoding', 'async');
            }
        });

        // Add WebP support detection
        this.detectWebPSupport().then(supportsWebP => {
            if (supportsWebP) {
                document.documentElement.classList.add('webp');
                this.log('WebP support detected');
            }
        });
    }

    async detectWebPSupport() {
        return new Promise(resolve => {
            const webP = new Image();
            webP.onload = webP.onerror = () => resolve(webP.height === 2);
            webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
        });
    }

    // Preloading Critical Resources
    setupPreloading() {
        if (!this.config.enablePreloading) return;

        // Preload critical CSS and fonts
        const criticalResources = [
            { href: '/shared/css/common.css', as: 'style' },
            { href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap', as: 'style' }
        ];

        criticalResources.forEach(resource => {
            this.preloadResource(resource);
        });

        // Preload next page resources on hover
        document.addEventListener('mouseover', this.handleLinkHover.bind(this));
        
        // Preload resources when user shows intent to navigate
        this.setupIntentPreloading();
    }

    preloadResource(resource) {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = resource.href;
        link.as = resource.as;
        if (resource.type) link.type = resource.type;
        if (resource.crossorigin) link.crossOrigin = resource.crossorigin;
        
        link.onload = () => this.log(`Preloaded: ${resource.href}`);
        link.onerror = () => this.log(`Failed to preload: ${resource.href}`);
        
        document.head.appendChild(link);
    }

    handleLinkHover(event) {
        const link = event.target.closest('a[href]');
        if (!link || link.hostname !== window.location.hostname) return;
        
        const href = link.getAttribute('href');
        if (href && !this.cache.has(href)) {
            this.preloadPage(href);
        }
    }

    setupIntentPreloading() {
        let mouseX = 0;
        let mouseY = 0;
        let isMovingTowardsTop = false;

        document.addEventListener('mousemove', (e) => {
            const movingUp = e.clientY < mouseY;
            const nearTop = e.clientY < 100;
            
            if (movingUp && nearTop && !isMovingTowardsTop) {
                isMovingTowardsTop = true;
                // User might be going to navigation - preload key pages
                this.preloadNavigationResources();
            } else if (e.clientY > 200) {
                isMovingTowardsTop = false;
            }
            
            mouseX = e.clientX;
            mouseY = e.clientY;
        });
    }

    preloadNavigationResources() {
        const navLinks = ['/resources/', '/projects/'];
        navLinks.forEach(href => {
            if (!this.cache.has(href)) {
                this.preloadPage(href);
            }
        });
    }

    async preloadPage(href) {
        try {
            const response = await fetch(href);
            if (response.ok) {
                const html = await response.text();
                this.cache.set(href, html);
                this.metrics.cacheHits++;
                this.log(`Preloaded page: ${href}`);
            }
        } catch (error) {
            this.log(`Failed to preload page: ${href}`, error);
        }
    }

    // Advanced Caching System
    setupCaching() {
        if (!this.config.enableCaching) return;

        // Cache API responses
        this.setupAPICache();
        
        // Cache static resources
        this.setupResourceCache();
        
        // Setup cache cleanup
        setInterval(() => this.cleanupCache(), 5 * 60 * 1000); // Every 5 minutes
    }

    setupAPICache() {
        // Intercept fetch requests
        const originalFetch = window.fetch;
        window.fetch = async (url, options = {}) => {
            const cacheKey = `api_${url}_${JSON.stringify(options)}`;
            
            // Return cached response if available and fresh
            if (this.cache.has(cacheKey)) {
                const cached = this.cache.get(cacheKey);
                if (Date.now() - cached.timestamp < 5 * 60 * 1000) { // 5 minutes
                    this.metrics.cacheHits++;
                    return new Response(cached.data);
                }
            }
            
            this.metrics.totalRequests++;
            
            try {
                const response = await originalFetch(url, options);
                
                // Cache successful GET requests
                if (response.ok && (!options.method || options.method === 'GET')) {
                    const clonedResponse = response.clone();
                    const data = await clonedResponse.text();
                    this.cache.set(cacheKey, {
                        data: data,
                        timestamp: Date.now()
                    });
                }
                
                return response;
            } catch (error) {
                this.log(`Fetch error for ${url}:`, error);
                throw error;
            }
        };
    }

    setupResourceCache() {
        // Cache images and other resources in memory
        const resourceCache = new Map();
        
        // Override image loading
        const originalImageSrc = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, 'src');
        Object.defineProperty(HTMLImageElement.prototype, 'src', {
            set: function(value) {
                if (resourceCache.has(value)) {
                    const cached = resourceCache.get(value);
                    originalImageSrc.set.call(this, cached.dataUrl);
                    return;
                }
                
                originalImageSrc.set.call(this, value);
                
                // Cache the image
                this.addEventListener('load', () => {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    canvas.width = this.naturalWidth;
                    canvas.height = this.naturalHeight;
                    ctx.drawImage(this, 0, 0);
                    
                    resourceCache.set(value, {
                        dataUrl: canvas.toDataURL(),
                        timestamp: Date.now()
                    });
                }, { once: true });
            },
            get: originalImageSrc.get
        });
    }

    cleanupCache() {
        const now = Date.now();
        const maxAge = 30 * 60 * 1000; // 30 minutes
        
        for (const [key, value] of this.cache.entries()) {
            if (now - value.timestamp > maxAge) {
                this.cache.delete(key);
            }
        }
        
        this.log(`Cache cleanup completed. Size: ${this.cache.size}`);
    }

    // Performance Monitoring
    setupPerformanceMonitoring() {
        if (!this.config.performanceMetrics) return;

        // Monitor Core Web Vitals
        this.monitorCoreWebVitals();
        
        // Monitor custom metrics
        this.monitorCustomMetrics();
        
        // Setup performance reporting
        this.setupPerformanceReporting();
    }

    monitorCoreWebVitals() {
        // First Input Delay (FID)
        new PerformanceObserver((entryList) => {
            for (const entry of entryList.getEntries()) {
                this.metrics.firstInputDelay = entry.processingStart - entry.startTime;
                this.log(`First Input Delay: ${this.metrics.firstInputDelay}ms`);
            }
        }).observe({ type: 'first-input', buffered: true });

        // Largest Contentful Paint (LCP)
        new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            const lastEntry = entries[entries.length - 1];
            this.metrics.largestContentfulPaint = lastEntry.startTime;
            this.log(`Largest Contentful Paint: ${this.metrics.largestContentfulPaint}ms`);
        }).observe({ type: 'largest-contentful-paint', buffered: true });

        // Cumulative Layout Shift (CLS)
        let clsValue = 0;
        new PerformanceObserver((entryList) => {
            for (const entry of entryList.getEntries()) {
                if (!entry.hadRecentInput) {
                    clsValue += entry.value;
                }
            }
            this.metrics.cumulativeLayoutShift = clsValue;
            this.log(`Cumulative Layout Shift: ${this.metrics.cumulativeLayoutShift}`);
        }).observe({ type: 'layout-shift', buffered: true });
    }

    monitorCustomMetrics() {
        // Time to Interactive
        this.measureTimeToInteractive();
        
        // Resource loading times
        this.monitorResourceTiming();
        
        // Memory usage
        if ('memory' in performance) {
            this.monitorMemoryUsage();
        }
    }

    measureTimeToInteractive() {
        let interactiveTime = 0;
        
        const checkInteractive = () => {
            if (document.readyState === 'complete' && !interactiveTime) {
                interactiveTime = performance.now();
                this.metrics.timeToInteractive = interactiveTime - this.metrics.startTime;
                this.log(`Time to Interactive: ${this.metrics.timeToInteractive}ms`);
            }
        };

        document.addEventListener('readystatechange', checkInteractive);
        window.addEventListener('load', checkInteractive);
    }

    monitorResourceTiming() {
        new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                if (entry.duration > 1000) { // Log slow resources
                    this.log(`Slow resource: ${entry.name} (${entry.duration}ms)`);
                }
            }
        }).observe({ entryTypes: ['resource'] });
    }

    monitorMemoryUsage() {
        setInterval(() => {
            const memory = performance.memory;
            this.metrics.memoryUsage = {
                used: Math.round(memory.usedJSHeapSize / 1024 / 1024),
                total: Math.round(memory.totalJSHeapSize / 1024 / 1024),
                limit: Math.round(memory.jsHeapSizeLimit / 1024 / 1024)
            };
            
            if (this.config.debugMode) {
                console.table(this.metrics.memoryUsage);
            }
        }, 30000); // Every 30 seconds
    }

    setupPerformanceReporting() {
        // Report performance metrics
        window.addEventListener('beforeunload', () => {
            this.reportPerformanceMetrics();
        });

        // Periodic reporting
        setInterval(() => {
            this.reportPerformanceMetrics();
        }, 60000); // Every minute
    }

    reportPerformanceMetrics() {
        const report = {
            timestamp: Date.now(),
            url: window.location.href,
            userAgent: navigator.userAgent,
            metrics: this.metrics,
            cacheStats: {
                size: this.cache.size,
                hitRate: this.metrics.totalRequests > 0 ? 
                    (this.metrics.cacheHits / this.metrics.totalRequests) * 100 : 0
            }
        };

        // Send to analytics if configured
        if (window.analyticsManager) {
            window.analyticsManager.trackEvent('performance_metrics', {
                performance_score: this.calculatePerformanceScore(),
                cache_hit_rate: report.cacheStats.hitRate,
                memory_usage: this.metrics.memoryUsage?.used || 0
            });
        }

        this.log('Performance report:', report);
    }

    calculatePerformanceScore() {
        let score = 100;
        
        if (this.metrics.largestContentfulPaint > 2500) score -= 20;
        if (this.metrics.firstInputDelay > 100) score -= 20;
        if (this.metrics.cumulativeLayoutShift > 0.1) score -= 20;
        if (this.metrics.timeToInteractive > 5000) score -= 20;
        
        return Math.max(0, score);
    }

    // Service Worker Setup
    setupServiceWorker() {
        if (!this.config.enableServiceWorker || !('serviceWorker' in navigator)) {
            return;
        }

        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                this.log('Service Worker registered successfully');
                
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            // Show update notification
                            this.showUpdateNotification();
                        }
                    });
                });
            })
            .catch(error => {
                this.log('Service Worker registration failed:', error);
            });
    }

    showUpdateNotification() {
        // Simple update notification
        const notification = document.createElement('div');
        notification.className = 'update-notification';
        notification.innerHTML = `
            <div class="update-content">
                <span>A new version is available!</span>
                <button onclick="window.location.reload()">Update</button>
                <button onclick="this.parentElement.parentElement.remove()">Later</button>
            </div>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--primary-color);
            color: white;
            padding: 16px;
            border-radius: 8px;
            box-shadow: var(--shadow-lg);
            z-index: 10000;
            animation: slideIn 0.3s ease-out;
        `;
        
        document.body.appendChild(notification);
    }

    // Animation Optimization
    optimizeAnimations() {
        // Reduce animations for users with prefers-reduced-motion
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            document.documentElement.classList.add('reduced-motion');
            return;
        }

        // Optimize animation performance
        this.setupAnimationOptimization();
    }

    setupAnimationOptimization() {
        // Use RAF for custom animations
        const animationFrames = new Map();
        
        window.requestAnimationFrame = new Proxy(window.requestAnimationFrame, {
            apply: (target, thisArg, argumentsList) => {
                const callback = argumentsList[0];
                const id = target.call(thisArg, (timestamp) => {
                    try {
                        callback(timestamp);
                    } catch (error) {
                        this.log('Animation error:', error);
                    } finally {
                        animationFrames.delete(id);
                    }
                });
                animationFrames.set(id, callback);
                return id;
            }
        });
    }

    // Resource Hints
    setupResourceHints() {
        // Add DNS prefetch for external domains
        const externalDomains = [
            'fonts.googleapis.com',
            'fonts.gstatic.com',
            'www.google-analytics.com'
        ];

        externalDomains.forEach(domain => {
            const link = document.createElement('link');
            link.rel = 'dns-prefetch';
            link.href = `//${domain}`;
            document.head.appendChild(link);
        });
    }

    // Utility methods
    log(...args) {
        if (this.config.debugMode) {
            console.log('[Performance]', ...args);
        }
    }

    // Public API
    getMetrics() {
        return { ...this.metrics };
    }

    clearCache() {
        this.cache.clear();
        this.log('Cache cleared');
    }

    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
        this.log('Configuration updated:', this.config);
    }
}

// Initialize performance optimizer
document.addEventListener('DOMContentLoaded', () => {
    window.performanceOptimizer = new PerformanceOptimizer();
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PerformanceOptimizer;
}