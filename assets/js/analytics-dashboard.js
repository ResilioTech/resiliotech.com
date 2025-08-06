/**
 * Advanced Analytics and Reporting Dashboard for Resiliotech
 * Comprehensive analytics, conversion tracking, and business intelligence
 */

class AnalyticsDashboard {
    constructor() {
        this.config = {
            apiEndpoint: '/api/analytics',
            enableRealTimeTracking: true,
            enableHeatmaps: true,
            enableConversionFunnels: true,
            enableCohortAnalysis: true,
            debugMode: window.location.hostname === 'localhost'
        };
        
        this.metrics = {
            realtime: {},
            conversions: {},
            traffic: {},
            engagement: {},
            revenue: {}
        };
        
        this.eventQueue = [];
        this.batchSize = 10;
        this.flushInterval = 30000; // 30 seconds
        
        this.init();
    }
    
    init() {
        this.log('Analytics Dashboard initializing...');
        
        // Initialize core tracking
        this.initializePageTracking();
        this.initializeEventTracking();
        this.initializeConversionTracking();
        this.initializeEngagementTracking();
        
        // Set up real-time metrics
        this.initializeRealTimeMetrics();
        
        // Start batch processing
        this.startBatchProcessing();
        
        // Initialize dashboard UI if in admin mode
        if (this.isAdminUser()) {
            this.initializeDashboardUI();
        }
        
        this.log('Analytics Dashboard initialized');
    }
    
    // Core Tracking Methods
    trackEvent(eventName, properties = {}, options = {}) {
        const event = {
            id: this.generateEventId(),
            name: eventName,
            properties: {
                ...properties,
                timestamp: new Date().toISOString(),
                url: window.location.href,
                user_agent: navigator.userAgent,
                screen_resolution: `${screen.width}x${screen.height}`,
                viewport_size: `${window.innerWidth}x${window.innerHeight}`,
                referrer: document.referrer || 'direct'
            },
            options: options,
            session_id: this.getSessionId(),
            user_id: this.getUserId()
        };
        
        // Add to queue for batch processing
        this.eventQueue.push(event);
        
        // Process immediately if high priority
        if (options.priority === 'high' || this.eventQueue.length >= this.batchSize) {
            this.flushEventQueue();
        }
        
        // Update real-time metrics
        this.updateRealTimeMetrics(event);
        
        this.log('Event tracked:', eventName, properties);
        
        return event;
    }
    
    trackConversion(conversionType, properties = {}) {
        const conversion = {
            type: conversionType,
            value: properties.value || 0,
            properties: properties,
            timestamp: new Date().toISOString(),
            session_id: this.getSessionId(),
            user_id: this.getUserId(),
            attribution: this.getAttributionData()
        };
        
        this.trackEvent('conversion', conversion, { priority: 'high' });
        
        // Update conversion metrics
        this.updateConversionMetrics(conversion);
        
        this.log('Conversion tracked:', conversionType, properties);
        
        return conversion;
    }
    
    trackPageView(customProperties = {}) {
        const pageView = {
            page: window.location.pathname,
            title: document.title,
            url: window.location.href,
            ...customProperties
        };
        
        this.trackEvent('page_view', pageView);
        
        // Track page performance
        this.trackPagePerformance();
        
        // Update session data
        this.updateSessionData();
    }
    
    trackPagePerformance() {
        // Use Navigation Timing API
        if (window.performance && window.performance.timing) {
            const timing = window.performance.timing;
            const loadTime = timing.loadEventEnd - timing.navigationStart;
            const domReady = timing.domContentLoadedEventEnd - timing.navigationStart;
            const firstByte = timing.responseStart - timing.navigationStart;
            
            this.trackEvent('page_performance', {
                load_time: loadTime,
                dom_ready_time: domReady,
                time_to_first_byte: firstByte,
                page: window.location.pathname
            });
        }
        
        // Use Performance Observer for Core Web Vitals
        if ('PerformanceObserver' in window) {
            this.trackCoreWebVitals();
        }
    }
    
    trackCoreWebVitals() {
        // Track Largest Contentful Paint (LCP)
        new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            
            this.trackEvent('core_web_vital', {
                metric: 'lcp',
                value: lastEntry.startTime,
                page: window.location.pathname
            });
        }).observe({ type: 'largest-contentful-paint', buffered: true });
        
        // Track First Input Delay (FID)
        new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach(entry => {
                this.trackEvent('core_web_vital', {
                    metric: 'fid',
                    value: entry.processingStart - entry.startTime,
                    page: window.location.pathname
                });
            });
        }).observe({ type: 'first-input', buffered: true });
        
        // Track Cumulative Layout Shift (CLS)
        let clsScore = 0;
        new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach(entry => {
                if (!entry.hadRecentInput) {
                    clsScore += entry.value;
                }
            });
            
            this.trackEvent('core_web_vital', {
                metric: 'cls',
                value: clsScore,
                page: window.location.pathname
            });
        }).observe({ type: 'layout-shift', buffered: true });
    }
    
    // Engagement Tracking
    initializeEngagementTracking() {
        let scrollDepth = 0;
        let timeOnPage = Date.now();
        let isActive = true;
        
        // Scroll depth tracking
        window.addEventListener('scroll', this.throttle(() => {
            const currentScroll = (window.scrollY + window.innerHeight) / document.body.scrollHeight * 100;
            if (currentScroll > scrollDepth) {
                scrollDepth = Math.round(currentScroll);
                
                // Track scroll milestones
                if (scrollDepth >= 25 && scrollDepth < 50) {
                    this.trackEvent('scroll_depth', { depth: '25%' });
                } else if (scrollDepth >= 50 && scrollDepth < 75) {
                    this.trackEvent('scroll_depth', { depth: '50%' });
                } else if (scrollDepth >= 75 && scrollDepth < 100) {
                    this.trackEvent('scroll_depth', { depth: '75%' });
                } else if (scrollDepth >= 100) {
                    this.trackEvent('scroll_depth', { depth: '100%' });
                }
            }
        }, 1000));
        
        // Time on page tracking
        window.addEventListener('beforeunload', () => {
            const timeSpent = Date.now() - timeOnPage;
            this.trackEvent('time_on_page', { 
                duration: timeSpent,
                page: window.location.pathname
            }, { priority: 'high' });
        });
        
        // Activity tracking
        ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'].forEach(event => {
            document.addEventListener(event, () => {
                if (!isActive) {
                    isActive = true;
                    this.trackEvent('user_reactivated');
                }
            });
        });
        
        // Inactivity tracking
        setInterval(() => {
            if (isActive) {
                isActive = false;
                setTimeout(() => {
                    if (!isActive) {
                        this.trackEvent('user_inactive');
                    }
                }, 30000); // 30 seconds of inactivity
            }
        }, 60000); // Check every minute
    }
    
    // Conversion Funnel Tracking
    initializeConversionTracking() {
        this.conversionFunnels = {
            'lead_generation': {
                steps: [
                    'page_view',
                    'hero_cta_click',
                    'form_started',
                    'form_submitted',
                    'lead_qualified'
                ]
            },
            'roi_calculator': {
                steps: [
                    'calculator_opened',
                    'input_entered',
                    'results_viewed',
                    'contact_info_requested',
                    'lead_captured'
                ]
            },
            'resource_download': {
                steps: [
                    'resource_viewed',
                    'download_initiated',
                    'email_requested',
                    'download_completed',
                    'follow_up_engaged'
                ]
            }
        };
        
        // Track funnel progression
        document.addEventListener('click', (e) => {
            this.analyzeFunnelEvent(e);
        });
        
        document.addEventListener('submit', (e) => {
            this.analyzeFunnelEvent(e, 'form_submit');
        });
    }
    
    analyzeFunnelEvent(event, eventType = 'click') {
        const element = event.target;
        const funnelData = this.identifyFunnelStep(element, eventType);
        
        if (funnelData) {
            this.trackFunnelStep(funnelData.funnel, funnelData.step, {
                element_id: element.id,
                element_class: element.className,
                element_text: element.textContent?.substring(0, 50)
            });
        }
    }
    
    identifyFunnelStep(element, eventType) {
        // Identify which funnel step this element represents
        if (element.matches('[data-track="hero-cta"]')) {
            return { funnel: 'lead_generation', step: 'hero_cta_click' };
        }
        
        if (element.matches('[data-track="roi-calculator"]')) {
            return { funnel: 'roi_calculator', step: 'calculator_opened' };
        }
        
        if (element.matches('[data-track="resource-download"]')) {
            return { funnel: 'resource_download', step: 'download_initiated' };
        }
        
        if (eventType === 'form_submit') {
            const form = element.closest('form');
            if (form?.dataset.formType === 'contact') {
                return { funnel: 'lead_generation', step: 'form_submitted' };
            }
        }
        
        return null;
    }
    
    trackFunnelStep(funnelName, stepName, properties = {}) {
        this.trackEvent('funnel_step', {
            funnel: funnelName,
            step: stepName,
            ...properties
        });
        
        // Update funnel metrics
        this.updateFunnelMetrics(funnelName, stepName);
    }
    
    // Real-time Metrics
    initializeRealTimeMetrics() {
        this.metrics.realtime = {
            active_users: 1,
            page_views: 0,
            events_per_minute: 0,
            bounce_rate: 0,
            avg_session_duration: 0,
            top_pages: {},
            top_events: {},
            conversion_rate: 0
        };
        
        // Update metrics every minute
        setInterval(() => {
            this.calculateRealTimeMetrics();
        }, 60000);
    }
    
    updateRealTimeMetrics(event) {
        // Update event counts
        const eventName = event.name;
        if (!this.metrics.realtime.top_events[eventName]) {
            this.metrics.realtime.top_events[eventName] = 0;
        }
        this.metrics.realtime.top_events[eventName]++;
        
        // Update page view counts
        if (eventName === 'page_view') {
            this.metrics.realtime.page_views++;
            const page = event.properties.page;
            if (!this.metrics.realtime.top_pages[page]) {
                this.metrics.realtime.top_pages[page] = 0;
            }
            this.metrics.realtime.top_pages[page]++;
        }
    }
    
    calculateRealTimeMetrics() {
        const now = Date.now();
        const oneHourAgo = now - (60 * 60 * 1000);
        
        // Get recent events from localStorage
        const recentEvents = this.getRecentEvents(oneHourAgo);
        
        // Calculate metrics
        this.metrics.realtime.events_per_minute = recentEvents.length / 60;
        
        // Calculate bounce rate (single page sessions)
        const sessions = this.groupEventsBySession(recentEvents);
        const bouncedSessions = sessions.filter(session => 
            session.filter(e => e.name === 'page_view').length === 1
        ).length;
        this.metrics.realtime.bounce_rate = sessions.length > 0 ? 
            (bouncedSessions / sessions.length) * 100 : 0;
        
        // Calculate average session duration
        const sessionDurations = sessions.map(session => {
            const start = new Date(session[0].properties.timestamp);
            const end = new Date(session[session.length - 1].properties.timestamp);
            return end - start;
        });
        this.metrics.realtime.avg_session_duration = sessionDurations.length > 0 ?
            sessionDurations.reduce((a, b) => a + b, 0) / sessionDurations.length : 0;
        
        // Update dashboard if visible
        if (this.dashboardVisible) {
            this.updateDashboardDisplay();
        }
    }
    
    // Conversion Metrics
    updateConversionMetrics(conversion) {
        if (!this.metrics.conversions[conversion.type]) {
            this.metrics.conversions[conversion.type] = {
                count: 0,
                total_value: 0,
                avg_value: 0,
                conversion_rate: 0,
                by_source: {}
            };
        }
        
        const metric = this.metrics.conversions[conversion.type];
        metric.count++;
        metric.total_value += conversion.value;
        metric.avg_value = metric.total_value / metric.count;
        
        // Track by source
        const source = conversion.attribution?.source || 'direct';
        if (!metric.by_source[source]) {
            metric.by_source[source] = { count: 0, value: 0 };
        }
        metric.by_source[source].count++;
        metric.by_source[source].value += conversion.value;
    }
    
    updateFunnelMetrics(funnelName, stepName) {
        if (!this.metrics.funnels) {
            this.metrics.funnels = {};
        }
        
        if (!this.metrics.funnels[funnelName]) {
            this.metrics.funnels[funnelName] = {};
        }
        
        if (!this.metrics.funnels[funnelName][stepName]) {
            this.metrics.funnels[funnelName][stepName] = 0;
        }
        
        this.metrics.funnels[funnelName][stepName]++;
    }
    
    // Dashboard UI
    initializeDashboardUI() {
        this.createDashboardToggle();
        this.dashboardVisible = false;
    }
    
    createDashboardToggle() {
        // Add keyboard shortcut to show dashboard (Ctrl+Alt+D)
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.altKey && e.key === 'd') {
                e.preventDefault();
                this.toggleDashboard();
            }
        });
        
        // Add hidden button for mobile
        const toggleButton = document.createElement('div');
        toggleButton.id = 'analytics-dashboard-toggle';
        toggleButton.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            width: 40px;
            height: 40px;
            background: rgba(99, 102, 241, 0.8);
            border-radius: 50%;
            cursor: pointer;
            display: none;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            z-index: 10001;
        `;
        toggleButton.innerHTML = '📊';
        toggleButton.addEventListener('click', () => this.toggleDashboard());
        
        // Show toggle on triple-click anywhere
        let clickCount = 0;
        document.addEventListener('click', () => {
            clickCount++;
            if (clickCount === 3) {
                toggleButton.style.display = 'flex';
                setTimeout(() => {
                    toggleButton.style.display = 'none';
                    clickCount = 0;
                }, 5000);
            } else {
                setTimeout(() => { clickCount = 0; }, 1000);
            }
        });
        
        document.body.appendChild(toggleButton);
    }
    
    toggleDashboard() {
        if (this.dashboardVisible) {
            this.hideDashboard();
        } else {
            this.showDashboard();
        }
    }
    
    showDashboard() {
        const dashboard = this.createDashboardHTML();
        document.body.appendChild(dashboard);
        this.dashboardVisible = true;
        this.updateDashboardDisplay();
        
        // Auto-refresh every 30 seconds
        this.dashboardRefreshInterval = setInterval(() => {
            this.updateDashboardDisplay();
        }, 30000);
    }
    
    hideDashboard() {
        const dashboard = document.getElementById('analytics-dashboard');
        if (dashboard) {
            dashboard.remove();
        }
        this.dashboardVisible = false;
        
        if (this.dashboardRefreshInterval) {
            clearInterval(this.dashboardRefreshInterval);
        }
    }
    
    createDashboardHTML() {
        const dashboard = document.createElement('div');
        dashboard.id = 'analytics-dashboard';
        dashboard.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            z-index: 10000;
            padding: 20px;
            overflow-y: auto;
            font-family: Arial, sans-serif;
            color: white;
        `;
        
        dashboard.innerHTML = `
            <div style="max-width: 1200px; margin: 0 auto;">
                <header style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px;">
                    <h1>Analytics Dashboard</h1>
                    <button onclick="window.analyticsDashboard.hideDashboard()" 
                            style="background: #f43f5e; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;">
                        Close
                    </button>
                </header>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px;">
                    <div class="metric-card" id="realtime-metrics">
                        <h3>Real-time Metrics</h3>
                        <div id="realtime-data"></div>
                    </div>
                    
                    <div class="metric-card" id="conversion-metrics">
                        <h3>Conversions</h3>
                        <div id="conversion-data"></div>
                    </div>
                    
                    <div class="metric-card" id="funnel-metrics">
                        <h3>Conversion Funnels</h3>
                        <div id="funnel-data"></div>
                    </div>
                    
                    <div class="metric-card" id="performance-metrics">
                        <h3>Performance</h3>
                        <div id="performance-data"></div>
                    </div>
                </div>
            </div>
            
            <style>
                .metric-card {
                    background: rgba(255, 255, 255, 0.1);
                    padding: 20px;
                    border-radius: 10px;
                    margin-bottom: 20px;
                }
                .metric-card h3 {
                    margin: 0 0 15px 0;
                    color: #6366f1;
                }
                .metric-value {
                    font-size: 24px;
                    font-weight: bold;
                    margin: 10px 0;
                }
                .metric-label {
                    font-size: 14px;
                    opacity: 0.8;
                    margin-bottom: 15px;
                }
            </style>
        `;
        
        return dashboard;
    }
    
    updateDashboardDisplay() {
        this.calculateRealTimeMetrics();
        
        // Update real-time metrics
        const realtimeData = document.getElementById('realtime-data');
        if (realtimeData) {
            realtimeData.innerHTML = `
                <div class="metric-value">${this.metrics.realtime.active_users}</div>
                <div class="metric-label">Active Users</div>
                
                <div class="metric-value">${this.metrics.realtime.page_views}</div>
                <div class="metric-label">Page Views (Last Hour)</div>
                
                <div class="metric-value">${this.metrics.realtime.bounce_rate.toFixed(1)}%</div>
                <div class="metric-label">Bounce Rate</div>
                
                <div class="metric-value">${(this.metrics.realtime.avg_session_duration / 1000 / 60).toFixed(1)}m</div>
                <div class="metric-label">Avg Session Duration</div>
            `;
        }
        
        // Update conversion data
        const conversionData = document.getElementById('conversion-data');
        if (conversionData && this.metrics.conversions) {
            let html = '';
            Object.entries(this.metrics.conversions).forEach(([type, data]) => {
                html += `
                    <div style="margin-bottom: 15px;">
                        <strong>${type}</strong><br>
                        Count: ${data.count}<br>
                        Total Value: $${data.total_value.toFixed(2)}<br>
                        Avg Value: $${data.avg_value.toFixed(2)}
                    </div>
                `;
            });
            conversionData.innerHTML = html || 'No conversions yet';
        }
        
        // Update funnel data
        const funnelData = document.getElementById('funnel-data');
        if (funnelData && this.metrics.funnels) {
            let html = '';
            Object.entries(this.metrics.funnels).forEach(([funnelName, steps]) => {
                html += `<div><strong>${funnelName}</strong><br>`;
                Object.entries(steps).forEach(([step, count]) => {
                    html += `${step}: ${count}<br>`;
                });
                html += '</div><br>';
            });
            funnelData.innerHTML = html || 'No funnel data yet';
        }
    }
    
    // Data Processing
    startBatchProcessing() {
        setInterval(() => {
            if (this.eventQueue.length > 0) {
                this.flushEventQueue();
            }
        }, this.flushInterval);
    }
    
    async flushEventQueue() {
        if (this.eventQueue.length === 0) return;
        
        const eventsToSend = [...this.eventQueue];
        this.eventQueue = [];
        
        try {
            await this.sendEventsToAPI(eventsToSend);
            this.storeEventsLocally(eventsToSend);
        } catch (error) {
            this.log('Error sending events to API:', error);
            // Put events back in queue for retry
            this.eventQueue.unshift(...eventsToSend);
            this.storeEventsLocally(eventsToSend);
        }
    }
    
    async sendEventsToAPI(events) {
        const response = await fetch(this.config.apiEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ events })
        });
        
        if (!response.ok) {
            throw new Error(`Analytics API error: ${response.status}`);
        }
        
        return response.json();
    }
    
    storeEventsLocally(events) {
        let storedEvents = JSON.parse(localStorage.getItem('analytics_events') || '[]');
        storedEvents.push(...events);
        
        // Keep only last 1000 events locally
        if (storedEvents.length > 1000) {
            storedEvents = storedEvents.slice(-1000);
        }
        
        localStorage.setItem('analytics_events', JSON.stringify(storedEvents));
    }
    
    getRecentEvents(since) {
        const storedEvents = JSON.parse(localStorage.getItem('analytics_events') || '[]');
        return storedEvents.filter(event => 
            new Date(event.properties.timestamp).getTime() > since
        );
    }
    
    groupEventsBySession(events) {
        const sessions = {};
        
        events.forEach(event => {
            const sessionId = event.session_id;
            if (!sessions[sessionId]) {
                sessions[sessionId] = [];
            }
            sessions[sessionId].push(event);
        });
        
        return Object.values(sessions);
    }
    
    // Utility Methods
    getSessionId() {
        let sessionId = sessionStorage.getItem('analytics_session_id');
        if (!sessionId) {
            sessionId = this.generateSessionId();
            sessionStorage.setItem('analytics_session_id', sessionId);
        }
        return sessionId;
    }
    
    getUserId() {
        let userId = localStorage.getItem('analytics_user_id');
        if (!userId) {
            userId = this.generateUserId();
            localStorage.setItem('analytics_user_id', userId);
        }
        return userId;
    }
    
    getAttributionData() {
        return {
            source: this.getUTMParameter('utm_source') || 'direct',
            medium: this.getUTMParameter('utm_medium') || 'organic',
            campaign: this.getUTMParameter('utm_campaign'),
            referrer: document.referrer || 'direct'
        };
    }
    
    getUTMParameter(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    }
    
    updateSessionData() {
        const sessionData = JSON.parse(sessionStorage.getItem('analytics_session_data') || '{}');
        sessionData.page_views = (sessionData.page_views || 0) + 1;
        sessionData.last_activity = new Date().toISOString();
        sessionStorage.setItem('analytics_session_data', JSON.stringify(sessionData));
    }
    
    isAdminUser() {
        // Check if user has admin privileges
        return window.location.search.includes('admin=true') || 
               localStorage.getItem('admin_mode') === 'true';
    }
    
    generateEventId() {
        return 'evt_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    generateSessionId() {
        return 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    generateUserId() {
        return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    throttle(func, delay) {
        let timeoutId;
        let lastExecTime = 0;
        return function (...args) {
            const currentTime = Date.now();
            
            if (currentTime - lastExecTime > delay) {
                func.apply(this, args);
                lastExecTime = currentTime;
            } else {
                clearTimeout(timeoutId);
                timeoutId = setTimeout(() => {
                    func.apply(this, args);
                    lastExecTime = Date.now();
                }, delay - (currentTime - lastExecTime));
            }
        };
    }
    
    log(...args) {
        if (this.config.debugMode) {
            console.log('[Analytics Dashboard]', ...args);
        }
    }
}

// Initialize analytics dashboard when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.analyticsDashboard = new AnalyticsDashboard();
    
    // Make it globally available as analyticsManager for other modules
    window.analyticsManager = window.analyticsDashboard;
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AnalyticsDashboard;
}