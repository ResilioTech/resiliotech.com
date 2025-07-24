// Performance Monitoring for Resilio Tech Website
// Tracks Core Web Vitals and other performance metrics

class PerformanceMonitor {
    constructor() {
        this.metrics = {};
        this.observers = [];
        this.init();
    }
    
    init() {
        // Only run in production or when explicitly enabled
        if (this.shouldRunMonitoring()) {
            this.measureCoreWebVitals();
            this.measureResourceTiming();
            this.measureUserTiming();
            this.setupErrorTracking();
            this.setupNetworkMonitoring();
        }
    }
    
    shouldRunMonitoring() {
        // Check if monitoring is enabled
        return (
            window.location.hostname !== 'localhost' &&
            window.location.hostname !== '127.0.0.1' &&
            !window.location.hostname.includes('local')
        ) || sessionStorage.getItem('enablePerformanceMonitoring') === 'true';
    }
    
    // Core Web Vitals
    measureCoreWebVitals() {
        // Largest Contentful Paint (LCP)
        if ('PerformanceObserver' in window) {
            const lcpObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const lastEntry = entries[entries.length - 1];
                
                this.metrics.lcp = {
                    value: lastEntry.startTime,
                    rating: this.getLCPRating(lastEntry.startTime),
                    element: lastEntry.element
                };
                
                this.reportMetric('lcp', this.metrics.lcp);
            });
            
            lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
            this.observers.push(lcpObserver);
        }
        
        // First Input Delay (FID)
        if ('PerformanceObserver' in window) {
            const fidObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach((entry) => {
                    this.metrics.fid = {
                        value: entry.processingStart - entry.startTime,
                        rating: this.getFIDRating(entry.processingStart - entry.startTime),
                        target: entry.target
                    };
                    
                    this.reportMetric('fid', this.metrics.fid);
                });
            });
            
            fidObserver.observe({ entryTypes: ['first-input'] });
            this.observers.push(fidObserver);
        }
        
        // Cumulative Layout Shift (CLS)
        if ('PerformanceObserver' in window) {
            let clsValue = 0;
            let clsEntries = [];
            
            const clsObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach((entry) => {
                    if (!entry.hadRecentInput) {
                        clsValue += entry.value;
                        clsEntries.push(entry);
                    }
                });
                
                this.metrics.cls = {
                    value: clsValue,
                    rating: this.getCLSRating(clsValue),
                    entries: clsEntries
                };
                
                this.reportMetric('cls', this.metrics.cls);
            });
            
            clsObserver.observe({ entryTypes: ['layout-shift'] });
            this.observers.push(clsObserver);
        }
        
        // Time to First Byte (TTFB)
        if ('PerformanceObserver' in window) {
            const navigationObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach((entry) => {
                    this.metrics.ttfb = {
                        value: entry.responseStart - entry.requestStart,
                        rating: this.getTTFBRating(entry.responseStart - entry.requestStart)
                    };
                    
                    this.reportMetric('ttfb', this.metrics.ttfb);
                });
            });
            
            navigationObserver.observe({ entryTypes: ['navigation'] });
            this.observers.push(navigationObserver);
        }
    }
    
    // Resource timing
    measureResourceTiming() {
        if ('PerformanceObserver' in window) {
            const resourceObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                
                entries.forEach((entry) => {
                    // Track slow resources
                    if (entry.duration > 1000) {
                        this.reportMetric('slow_resource', {
                            name: entry.name,
                            duration: entry.duration,
                            size: entry.transferSize || entry.encodedBodySize,
                            type: this.getResourceType(entry.name)
                        });
                    }
                    
                    // Track failed resources
                    if (entry.responseEnd === 0) {
                        this.reportMetric('failed_resource', {
                            name: entry.name,
                            type: this.getResourceType(entry.name)
                        });
                    }
                });
            });
            
            resourceObserver.observe({ entryTypes: ['resource'] });
            this.observers.push(resourceObserver);
        }
    }
    
    // User timing
    measureUserTiming() {
        if ('PerformanceObserver' in window) {
            const userTimingObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                
                entries.forEach((entry) => {
                    this.reportMetric('user_timing', {
                        name: entry.name,
                        duration: entry.duration,
                        startTime: entry.startTime,
                        entryType: entry.entryType
                    });
                });
            });
            
            userTimingObserver.observe({ entryTypes: ['measure', 'mark'] });
            this.observers.push(userTimingObserver);
        }
    }
    
    // Error tracking
    setupErrorTracking() {
        // JavaScript errors
        window.addEventListener('error', (event) => {
            this.reportMetric('javascript_error', {
                message: event.message,
                filename: event.filename,
                line: event.lineno,
                column: event.colno,
                stack: event.error ? event.error.stack : null
            });
        });
        
        // Unhandled promise rejections
        window.addEventListener('unhandledrejection', (event) => {
            this.reportMetric('unhandled_rejection', {
                reason: event.reason,
                stack: event.reason && event.reason.stack
            });
        });
        
        // Resource loading errors
        window.addEventListener('error', (event) => {
            if (event.target !== window) {
                this.reportMetric('resource_error', {
                    element: event.target.tagName,
                    source: event.target.src || event.target.href,
                    message: event.message
                });
            }
        }, true);
    }
    
    // Network monitoring
    setupNetworkMonitoring() {
        // Connection information
        if ('connection' in navigator) {
            const connection = navigator.connection;
            
            this.metrics.network = {
                effectiveType: connection.effectiveType,
                downlink: connection.downlink,
                rtt: connection.rtt,
                saveData: connection.saveData
            };
            
            // Monitor connection changes
            connection.addEventListener('change', () => {
                this.reportMetric('network_change', {
                    effectiveType: connection.effectiveType,
                    downlink: connection.downlink,
                    rtt: connection.rtt,
                    saveData: connection.saveData
                });
            });
        }
        
        // Online/offline status
        window.addEventListener('online', () => {
            this.reportMetric('network_status', { status: 'online' });
        });
        
        window.addEventListener('offline', () => {
            this.reportMetric('network_status', { status: 'offline' });
        });
    }
    
    // Rating helpers
    getLCPRating(value) {
        if (value <= 2500) return 'good';
        if (value <= 4000) return 'needs-improvement';
        return 'poor';
    }
    
    getFIDRating(value) {
        if (value <= 100) return 'good';
        if (value <= 300) return 'needs-improvement';
        return 'poor';
    }
    
    getCLSRating(value) {
        if (value <= 0.1) return 'good';
        if (value <= 0.25) return 'needs-improvement';
        return 'poor';
    }
    
    getTTFBRating(value) {
        if (value <= 800) return 'good';
        if (value <= 1800) return 'needs-improvement';
        return 'poor';
    }
    
    getResourceType(url) {
        if (url.includes('.css')) return 'css';
        if (url.includes('.js')) return 'javascript';
        if (url.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)) return 'image';
        if (url.match(/\.(woff|woff2|ttf|eot)$/i)) return 'font';
        return 'other';
    }
    
    // Report metrics
    reportMetric(name, data) {
        // Log to console in development
        if (window.location.hostname.includes('localhost') || window.location.hostname.includes('127.0.0.1')) {
            console.log(`[Performance] ${name}:`, data);
        }
        
        // Send to analytics service
        this.sendToAnalytics(name, data);
        
        // Store locally for debugging
        this.storeMetric(name, data);
    }
    
    sendToAnalytics(name, data) {
        // Send to Google Analytics (if available)
        if (typeof gtag !== 'undefined') {
            gtag('event', name, {
                event_category: 'performance',
                event_label: name,
                value: data.value || 0,
                custom_map: {
                    metric_data: JSON.stringify(data)
                }
            });
        }
        
        // Send to custom analytics endpoint
        if (navigator.sendBeacon) {
            const payload = JSON.stringify({
                metric: name,
                data: data,
                timestamp: Date.now(),
                url: window.location.href,
                userAgent: navigator.userAgent
            });
            
            navigator.sendBeacon('/api/metrics', payload);
        }
    }
    
    storeMetric(name, data) {
        try {
            const metrics = JSON.parse(localStorage.getItem('performanceMetrics') || '[]');
            metrics.push({
                name,
                data,
                timestamp: Date.now(),
                url: window.location.href
            });
            
            // Keep only last 100 metrics
            if (metrics.length > 100) {
                metrics.splice(0, metrics.length - 100);
            }
            
            localStorage.setItem('performanceMetrics', JSON.stringify(metrics));
        } catch (error) {
            console.warn('Failed to store performance metric:', error);
        }
    }
    
    // Get stored metrics
    getStoredMetrics() {
        try {
            return JSON.parse(localStorage.getItem('performanceMetrics') || '[]');
        } catch (error) {
            return [];
        }
    }
    
    // Generate performance report
    generateReport() {
        const metrics = this.getStoredMetrics();
        const report = {
            coreWebVitals: {
                lcp: this.metrics.lcp,
                fid: this.metrics.fid,
                cls: this.metrics.cls,
                ttfb: this.metrics.ttfb
            },
            network: this.metrics.network,
            storedMetrics: metrics,
            recommendations: this.generateRecommendations()
        };
        
        return report;
    }
    
    generateRecommendations() {
        const recommendations = [];
        
        if (this.metrics.lcp && this.metrics.lcp.rating === 'poor') {
            recommendations.push('Consider optimizing your largest contentful paint by improving server response times and optimizing images');
        }
        
        if (this.metrics.fid && this.metrics.fid.rating === 'poor') {
            recommendations.push('Reduce first input delay by breaking up long tasks and using web workers');
        }
        
        if (this.metrics.cls && this.metrics.cls.rating === 'poor') {
            recommendations.push('Improve layout stability by including dimensions for images and avoiding dynamic content injection');
        }
        
        if (this.metrics.ttfb && this.metrics.ttfb.rating === 'poor') {
            recommendations.push('Optimize time to first byte by improving server response times and using CDN');
        }
        
        return recommendations;
    }
    
    // Cleanup
    disconnect() {
        this.observers.forEach(observer => observer.disconnect());
        this.observers = [];
    }
}

// Initialize performance monitoring
const performanceMonitor = new PerformanceMonitor();

// Export for external use
window.PerformanceMonitor = performanceMonitor;

// Add console commands for debugging
if (typeof console !== 'undefined') {
    console.log('Performance monitoring initialized. Use PerformanceMonitor.generateReport() to see metrics.');
}

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    performanceMonitor.disconnect();
});
