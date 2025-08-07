/**
 * Enhanced Performance Monitoring with Real User Monitoring (RUM)
 * Tracks Core Web Vitals and provides actionable insights
 */

class AdvancedPerformanceMonitor {
    constructor() {
        this.config = {
            enableRUM: true,
            enableCLS: true,
            enableLCP: true,
            enableFID: true,
            enableTTFB: true,
            sampleRate: 0.1, // Only monitor 10% of users to reduce overhead
            debugMode: window.location.hostname === 'localhost'
        };
        
        this.metrics = {
            startTime: performance.now(),
            navigationStart: performance.timeOrigin,
            pageLoadTime: 0,
            domContentLoaded: 0,
            firstPaint: 0,
            firstContentfulPaint: 0,
            largestContentfulPaint: 0,
            firstInputDelay: 0,
            cumulativeLayoutShift: 0,
            timeToFirstByte: 0,
            resourceLoadTime: 0,
            memoryUsage: {},
            networkConnection: {},
            userAgent: navigator.userAgent,
            viewport: {
                width: window.innerWidth,
                height: window.innerHeight
            }
        };
        
        this.thresholds = {
            LCP: { good: 2500, needsImprovement: 4000 },
            FID: { good: 100, needsImprovement: 300 },
            CLS: { good: 0.1, needsImprovement: 0.25 },
            TTFB: { good: 800, needsImprovement: 1800 }
        };
        
        this.init();
    }
    
    init() {
        // Only monitor a sample of users
        if (Math.random() > this.config.sampleRate && !this.config.debugMode) {
            return;
        }
        
        this.log('🔍 Advanced Performance Monitor initialized');
        
        // Wait for page load
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.startMonitoring());
            window.addEventListener('load', () => this.onPageLoad());
        } else {
            this.startMonitoring();
            this.onPageLoad();
        }
    }
    
    startMonitoring() {
        this.collectBasicMetrics();
        this.monitorCoreWebVitals();
        this.monitorResourcePerformance();
        this.monitorUserExperience();
        this.monitorNetworkConditions();
        this.setupErrorTracking();
    }
    
    collectBasicMetrics() {
        // Navigation Timing API
        if (performance.timing) {
            const timing = performance.timing;
            this.metrics.domContentLoaded = timing.domContentLoadedEventEnd - timing.navigationStart;
            this.metrics.timeToFirstByte = timing.responseStart - timing.navigationStart;
        }
        
        // Paint Timing API
        if (performance.getEntriesByType) {
            const paintEntries = performance.getEntriesByType('paint');
            paintEntries.forEach(entry => {
                if (entry.name === 'first-paint') {
                    this.metrics.firstPaint = entry.startTime;
                } else if (entry.name === 'first-contentful-paint') {
                    this.metrics.firstContentfulPaint = entry.startTime;
                }
            });
        }
    }
    
    monitorCoreWebVitals() {
        // Largest Contentful Paint (LCP)
        if (this.config.enableLCP && 'PerformanceObserver' in window) {
            try {
                const lcpObserver = new PerformanceObserver((entryList) => {
                    const entries = entryList.getEntries();
                    const lastEntry = entries[entries.length - 1];
                    this.metrics.largestContentfulPaint = lastEntry.startTime;
                    this.evaluateMetric('LCP', lastEntry.startTime);
                });
                lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
            } catch (e) {
                this.log('LCP monitoring not supported');
            }
        }
        
        // First Input Delay (FID)
        if (this.config.enableFID && 'PerformanceObserver' in window) {
            try {
                const fidObserver = new PerformanceObserver((entryList) => {
                    for (const entry of entryList.getEntries()) {
                        const fid = entry.processingStart - entry.startTime;
                        this.metrics.firstInputDelay = fid;
                        this.evaluateMetric('FID', fid);
                        break; // Only measure the first input
                    }
                });
                fidObserver.observe({ type: 'first-input', buffered: true });
            } catch (e) {
                this.log('FID monitoring not supported');
            }
        }
        
        // Cumulative Layout Shift (CLS)
        if (this.config.enableCLS && 'PerformanceObserver' in window) {
            try {
                let clsValue = 0;
                const clsObserver = new PerformanceObserver((entryList) => {
                    for (const entry of entryList.getEntries()) {
                        if (!entry.hadRecentInput) {
                            clsValue += entry.value;
                            this.metrics.cumulativeLayoutShift = clsValue;
                            this.evaluateMetric('CLS', clsValue);
                        }
                    }
                });
                clsObserver.observe({ type: 'layout-shift', buffered: true });
            } catch (e) {
                this.log('CLS monitoring not supported');
            }
        }
    }
    
    monitorResourcePerformance() {
        if (!('PerformanceObserver' in window)) return;
        
        const resourceObserver = new PerformanceObserver((entryList) => {
            for (const entry of entryList.getEntries()) {
                const duration = entry.responseEnd - entry.startTime;
                
                // Track slow resources
                if (duration > 1000) {
                    this.reportSlowResource(entry.name, duration);
                }
                
                // Track specific resource types
                if (entry.name.includes('.css')) {
                    this.metrics.cssLoadTime = duration;
                } else if (entry.name.includes('.js')) {
                    this.metrics.jsLoadTime = duration;
                } else if (entry.name.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)) {
                    this.metrics.imageLoadTime = duration;
                }
            }
        });
        
        resourceObserver.observe({ type: 'resource', buffered: true });
    }
    
    monitorUserExperience() {
        // Track scroll performance
        let ticking = false;
        let scrollStart = 0;
        
        const scrollHandler = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    const scrollTime = performance.now() - scrollStart;
                    if (scrollTime > 16.67) { // Slower than 60fps
                        this.reportJankScroll(scrollTime);
                    }
                    ticking = false;
                });
                ticking = true;
            }
        };
        
        window.addEventListener('scroll', () => {
            scrollStart = performance.now();
            scrollHandler();
        }, { passive: true });
        
        // Track click responsiveness
        document.addEventListener('click', (event) => {
            const clickStart = performance.now();
            requestAnimationFrame(() => {
                const clickTime = performance.now() - clickStart;
                if (clickTime > 50) { // Slow response
                    this.reportSlowClick(event.target, clickTime);
                }
            });
        });
    }
    
    monitorNetworkConditions() {
        // Network Information API
        if ('connection' in navigator) {
            const connection = navigator.connection;
            this.metrics.networkConnection = {
                effectiveType: connection.effectiveType,
                downlink: connection.downlink,
                rtt: connection.rtt,
                saveData: connection.saveData
            };
            
            connection.addEventListener('change', () => {
                this.log('Network conditions changed:', connection.effectiveType);
            });
        }
    }
    
    setupErrorTracking() {
        // JavaScript errors
        window.addEventListener('error', (event) => {
            this.reportError('javascript', {
                message: event.message,
                filename: event.filename,
                lineno: event.lineno,
                colno: event.colno,
                stack: event.error?.stack
            });
        });
        
        // Promise rejections
        window.addEventListener('unhandledrejection', (event) => {
            this.reportError('unhandled-promise', {
                reason: event.reason
            });
        });
        
        // Resource loading errors
        document.addEventListener('error', (event) => {
            if (event.target !== window) {
                this.reportError('resource', {
                    element: event.target.tagName,
                    source: event.target.src || event.target.href
                });
            }
        }, true);
    }
    
    onPageLoad() {
        this.metrics.pageLoadTime = performance.now() - this.metrics.startTime;
        
        // Memory usage
        if ('memory' in performance) {
            this.metrics.memoryUsage = {
                used: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024),
                total: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024),
                limit: Math.round(performance.memory.jsHeapSizeLimit / 1024 / 1024)
            };
        }
        
        // Report after all metrics collected
        setTimeout(() => this.generateReport(), 2000);
    }
    
    evaluateMetric(metricName, value) {
        const threshold = this.thresholds[metricName];
        if (!threshold) return;
        
        let rating = 'good';
        if (value > threshold.needsImprovement) {
            rating = 'poor';
        } else if (value > threshold.good) {
            rating = 'needs-improvement';
        }
        
        this.log(`${metricName}: ${value}ms (${rating})`);
        
        // Store rating
        this.metrics[`${metricName.toLowerCase()}Rating`] = rating;
    }
    
    generateReport() {
        const report = {
            timestamp: Date.now(),
            url: window.location.href,
            userAgent: navigator.userAgent,
            viewport: this.metrics.viewport,
            metrics: this.metrics,
            performance_score: this.calculatePerformanceScore(),
            recommendations: this.generateRecommendations()
        };
        
        this.sendReport(report);
        
        if (this.config.debugMode) {
            console.table(this.metrics);
            console.log('Performance Report:', report);
        }
    }
    
    calculatePerformanceScore() {
        let score = 100;
        
        // Penalize poor Core Web Vitals
        if (this.metrics.lcpRating === 'poor') score -= 25;
        else if (this.metrics.lcpRating === 'needs-improvement') score -= 10;
        
        if (this.metrics.fidRating === 'poor') score -= 25;
        else if (this.metrics.fidRating === 'needs-improvement') score -= 10;
        
        if (this.metrics.clsRating === 'poor') score -= 25;
        else if (this.metrics.clsRating === 'needs-improvement') score -= 10;
        
        if (this.metrics.ttfbRating === 'poor') score -= 25;
        else if (this.metrics.ttfbRating === 'needs-improvement') score -= 10;
        
        return Math.max(0, score);
    }
    
    generateRecommendations() {
        const recommendations = [];
        
        if (this.metrics.largestContentfulPaint > 2500) {
            recommendations.push({
                type: 'LCP',
                priority: 'high',
                message: 'Optimize largest contentful paint by improving server response times and optimizing images'
            });
        }
        
        if (this.metrics.firstInputDelay > 100) {
            recommendations.push({
                type: 'FID',
                priority: 'high',
                message: 'Reduce first input delay by breaking up long tasks and deferring non-critical JavaScript'
            });
        }
        
        if (this.metrics.cumulativeLayoutShift > 0.1) {
            recommendations.push({
                type: 'CLS',
                priority: 'medium',
                message: 'Improve layout stability by including dimensions for images and avoiding dynamic content injection'
            });
        }
        
        if (this.metrics.timeToFirstByte > 800) {
            recommendations.push({
                type: 'TTFB',
                priority: 'medium',
                message: 'Optimize server response time and consider using a CDN'
            });
        }
        
        return recommendations;
    }
    
    // Utility methods
    reportSlowResource(resource, duration) {
        this.log(`Slow resource: ${resource} (${duration}ms)`);
    }
    
    reportJankScroll(duration) {
        this.log(`Janky scroll: ${duration}ms`);
    }
    
    reportSlowClick(target, duration) {
        this.log(`Slow click response: ${target.tagName} (${duration}ms)`);
    }
    
    reportError(type, details) {
        this.log(`Error [${type}]:`, details);
    }
    
    sendReport(report) {
        // Send to analytics endpoint
        if (window.gtag) {
            window.gtag('event', 'performance_report', {
                performance_score: report.performance_score,
                lcp: this.metrics.largestContentfulPaint,
                fid: this.metrics.firstInputDelay,
                cls: this.metrics.cumulativeLayoutShift
            });
        }
        
        // Send to custom endpoint (implement as needed)
        if (this.config.enableRUM && !this.config.debugMode) {
            fetch('/api/performance', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(report)
            }).catch(() => {}); // Silently fail
        }
    }
    
    log(...args) {
        if (this.config.debugMode) {
            console.log('[Performance Monitor]', ...args);
        }
    }
}

// Initialize monitor
document.addEventListener('DOMContentLoaded', () => {
    window.advancedPerformanceMonitor = new AdvancedPerformanceMonitor();
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AdvancedPerformanceMonitor;
}
