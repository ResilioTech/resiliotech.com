/**
 * Blog Manager for Resiliotech
 * Handles dynamic blog content loading, filtering, search, and user interactions
 */

class BlogManager {
    constructor() {
        this.config = {
            postsPerPage: 6,
            enableAnalytics: true,
            enablePersonalization: true,
            debugMode: window.location.hostname === 'localhost'
        };
        
        this.currentFilter = 'all';
        this.currentSearchQuery = '';
        this.displayedPosts = 0;
        this.allPosts = [];
        this.filteredPosts = [];
        
        this.init();
    }
    
    init() {
        this.log('Blog Manager initializing...');
        
        // Load blog content
        this.loadBlogContent();
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Initialize content display
        this.displayInitialPosts();
        
        // Set up analytics tracking
        this.setupAnalyticsTracking();
        
        this.log('Blog Manager initialized');
    }
    
    loadBlogContent() {
        if (window.blogContent) {
            this.allPosts = window.blogContent.getAll();
            this.filteredPosts = [...this.allPosts];
            this.log(`Loaded ${this.allPosts.length} blog posts`);
        } else {
            this.log('Blog content not available');
            this.showEmptyState();
        }
    }
    
    setupEventListeners() {
        // Category filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handleFilterClick(e.target);
            });
        });
        
        // Newsletter form
        const newsletterForm = document.getElementById('blog-newsletter-form');
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', (e) => {
                this.handleNewsletterSignup(e);
            });
        }
        
        // Search input with debouncing
        const searchInput = document.getElementById('blog-search-input');
        if (searchInput) {
            let searchTimeout;
            searchInput.addEventListener('input', (e) => {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    this.handleSearch(e.target.value);
                }, 300);
            });
        }
    }
    
    setupAnalyticsTracking() {
        if (!this.config.enableAnalytics) return;
        
        // Track blog page view
        if (window.analyticsManager) {
            window.analyticsManager.trackEvent('blog_page_view', {
                total_posts: this.allPosts.length,
                business_model: 'both',
                page_type: 'content'
            });
        }
        
        // Track scroll depth on blog posts
        this.trackScrollDepth();
        
        // Track reading time
        this.trackReadingTime();
    }
    
    displayInitialPosts() {
        this.displayedPosts = 0;
        this.renderPosts();
        this.updateLoadMoreButton();
    }
    
    renderPosts() {
        const container = document.getElementById('blog-posts-container');
        if (!container) return;
        
        const postsToShow = this.filteredPosts.slice(0, this.displayedPosts + this.config.postsPerPage);
        this.displayedPosts = postsToShow.length;
        
        if (this.displayedPosts === 0 || postsToShow.length === 0) {
            this.showEmptyState();
            return;
        }
        
        container.innerHTML = postsToShow.map(post => this.createPostCard(post)).join('');
        
        // Set up click tracking for post cards
        this.setupPostCardTracking();
    }
    
    createPostCard(post) {
        const categoryInfo = window.blogContent?.categories?.[post.category] || { 
            name: 'Article', 
            color: '#6366f1' 
        };
        
        return `
            <article class="blog-card" data-post-id="${post.id}" data-category="${post.category}">
                <div class="blog-card-image">
                    <div class="blog-category-badge" style="background: ${categoryInfo.color}20; color: ${categoryInfo.color};">
                        ${categoryInfo.name}
                    </div>
                </div>
                <div class="blog-card-content">
                    <div class="blog-card-meta">
                        <span>📅 ${this.formatDate(post.publishedAt)}</span>
                        <span>⏱️ ${post.readTime}</span>
                        <span>👁️ ${this.formatNumber(post.views)} views</span>
                    </div>
                    
                    <h3 class="blog-card-title">
                        <a href="posts/${post.slug}/" onclick="trackPostClick('${post.id}', '${post.title}')">
                            ${post.title}
                        </a>
                    </h3>
                    
                    <p class="blog-card-excerpt">${post.excerpt}</p>
                    
                    <div class="blog-card-tags">
                        ${post.tags.slice(0, 3).map(tag => 
                            `<span class="blog-tag" onclick="filterByTag('${tag}')">${tag}</span>`
                        ).join('')}
                        ${post.tags.length > 3 ? `<span class="blog-tag">+${post.tags.length - 3}</span>` : ''}
                    </div>
                    
                    <div class="blog-card-stats">
                        <div class="blog-stats-item">
                            <span>❤️ ${this.formatNumber(post.likes)}</span>
                        </div>
                        <div class="blog-stats-item">
                            <span>📤 ${this.formatNumber(post.shares)}</span>
                        </div>
                        <div class="blog-stats-item">
                            <a href="posts/${post.slug}/" class="btn-link" onclick="trackPostClick('${post.id}', '${post.title}')">
                                Read More →
                            </a>
                        </div>
                    </div>
                </div>
            </article>
        `;
    }
    
    setupPostCardTracking() {
        document.querySelectorAll('.blog-card').forEach(card => {
            // Track card hover for engagement
            let hoverStartTime;
            card.addEventListener('mouseenter', () => {
                hoverStartTime = Date.now();
            });
            
            card.addEventListener('mouseleave', () => {
                if (hoverStartTime) {
                    const hoverDuration = Date.now() - hoverStartTime;
                    if (hoverDuration > 2000) { // 2+ seconds
                        const postId = card.dataset.postId;
                        this.trackPostEngagement('card_hover', postId, { duration: hoverDuration });
                    }
                }
            });
            
            // Track card clicks
            card.addEventListener('click', (e) => {
                if (!e.target.closest('a')) { // Don't double-track link clicks
                    const postId = card.dataset.postId;
                    this.trackPostEngagement('card_click', postId);
                }
            });
        });
    }
    
    handleFilterClick(button) {
        // Update active state
        document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        const filter = button.dataset.filter;
        this.currentFilter = filter;
        
        // Filter posts
        this.applyFilters();
        
        // Track filter usage
        this.trackFilterUsage(filter);
    }
    
    handleSearch(query) {
        this.currentSearchQuery = query.trim();
        this.applyFilters();
        
        // Track search
        if (this.currentSearchQuery) {
            this.trackSearchUsage(this.currentSearchQuery);
        }
    }
    
    applyFilters() {
        let posts = [...this.allPosts];
        
        // Apply category filter
        if (this.currentFilter !== 'all') {
            posts = posts.filter(post => post.category === this.currentFilter);
        }
        
        // Apply search filter
        if (this.currentSearchQuery) {
            posts = window.blogContent.search(this.currentSearchQuery);
        }
        
        this.filteredPosts = posts;
        this.displayedPosts = 0;
        this.renderPosts();
        this.updateLoadMoreButton();
        
        // Show results count
        this.updateResultsCount();
    }
    
    loadMore() {
        this.renderPosts();
        this.updateLoadMoreButton();
        
        // Track load more usage
        this.trackLoadMoreUsage();
    }
    
    updateLoadMoreButton() {
        const button = document.getElementById('load-more-btn');
        if (!button) return;
        
        const hasMore = this.displayedPosts < this.filteredPosts.length;
        button.style.display = hasMore ? 'inline-block' : 'none';
        
        if (hasMore) {
            const remaining = this.filteredPosts.length - this.displayedPosts;
            button.textContent = `Load ${Math.min(remaining, this.config.postsPerPage)} More Articles`;
        }
    }
    
    updateResultsCount() {
        const total = this.filteredPosts.length;
        let message = '';
        
        if (this.currentSearchQuery && this.currentFilter !== 'all') {
            message = `Found ${total} articles matching "${this.currentSearchQuery}" in ${this.getCategoryName(this.currentFilter)}`;
        } else if (this.currentSearchQuery) {
            message = `Found ${total} articles matching "${this.currentSearchQuery}"`;
        } else if (this.currentFilter !== 'all') {
            message = `${total} articles in ${this.getCategoryName(this.currentFilter)}`;
        }
        
        if (message) {
            this.showResultsMessage(message);
        } else {
            this.hideResultsMessage();
        }
    }
    
    showResultsMessage(message) {
        let messageEl = document.getElementById('results-message');
        if (!messageEl) {
            messageEl = document.createElement('div');
            messageEl.id = 'results-message';
            messageEl.style.cssText = `
                text-align: center;
                margin: 20px 0;
                padding: 15px;
                background: var(--color-gray-50);
                border-radius: 10px;
                color: var(--text-secondary);
                font-style: italic;
            `;
            document.getElementById('blog-posts-container').parentNode.insertBefore(
                messageEl, 
                document.getElementById('blog-posts-container')
            );
        }
        messageEl.textContent = message;
        messageEl.style.display = 'block';
    }
    
    hideResultsMessage() {
        const messageEl = document.getElementById('results-message');
        if (messageEl) {
            messageEl.style.display = 'none';
        }
    }
    
    showEmptyState() {
        const container = document.getElementById('blog-posts-container');
        if (!container) return;
        
        container.innerHTML = `
            <div style="text-align: center; padding: 80px 20px; grid-column: 1 / -1;">
                <div style="font-size: 4rem; margin-bottom: 20px;">📝</div>
                <h3 style="margin-bottom: 15px; color: var(--text-primary);">No Articles Found</h3>
                <p style="color: var(--text-secondary); margin-bottom: 30px;">
                    ${this.currentSearchQuery ? 
                        `No articles match your search for "${this.currentSearchQuery}"` :
                        'No articles available for this category'
                    }
                </p>
                <button class="btn btn-outline" onclick="clearFilters()">
                    View All Articles
                </button>
            </div>
        `;
    }
    
    handleNewsletterSignup(e) {
        e.preventDefault();
        const form = e.target;
        const email = form.querySelector('input[type="email"]').value;
        
        // Track newsletter signup
        if (window.analyticsManager) {
            window.analyticsManager.trackConversion('newsletter_subscribe', 5, {
                email_domain: email.split('@')[1],
                source: 'blog_page',
                business_model: 'both'
            });
        }
        
        // Show success message
        this.showNewsletterSuccess(form);
        
        this.log('Newsletter signup:', email);
    }
    
    showNewsletterSuccess(form) {
        const button = form.querySelector('button');
        const originalText = button.textContent;
        
        button.textContent = 'Subscribed! ✓';
        button.style.background = '#10b981';
        button.disabled = true;
        
        setTimeout(() => {
            button.textContent = originalText;
            button.style.background = '';
            button.disabled = false;
            form.reset();
        }, 3000);
    }
    
    // Analytics Methods
    trackPostEngagement(action, postId, data = {}) {
        if (!window.analyticsManager) return;
        
        const post = this.allPosts.find(p => p.id === postId);
        if (!post) return;
        
        window.analyticsManager.trackEvent('blog_post_engagement', {
            action: action,
            post_id: postId,
            post_title: post.title,
            post_category: post.category,
            business_model: 'both',
            ...data
        });
    }
    
    trackFilterUsage(filter) {
        if (!window.analyticsManager) return;
        
        window.analyticsManager.trackEvent('blog_filter_used', {
            filter_type: 'category',
            filter_value: filter,
            results_count: this.filteredPosts.length
        });
    }
    
    trackSearchUsage(query) {
        if (!window.analyticsManager) return;
        
        window.analyticsManager.trackEvent('blog_search', {
            search_query: query,
            results_count: this.filteredPosts.length,
            has_results: this.filteredPosts.length > 0
        });
    }
    
    trackLoadMoreUsage() {
        if (!window.analyticsManager) return;
        
        window.analyticsManager.trackEvent('blog_load_more', {
            posts_loaded: Math.min(this.config.postsPerPage, this.filteredPosts.length - this.displayedPosts),
            total_displayed: this.displayedPosts + this.config.postsPerPage
        });
    }
    
    trackScrollDepth() {
        let maxScroll = 0;
        const milestones = [25, 50, 75, 100];
        const tracked = new Set();
        
        window.addEventListener('scroll', this.throttle(() => {
            const scrollPercent = Math.round(
                (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
            );
            
            if (scrollPercent > maxScroll) {
                maxScroll = scrollPercent;
                
                milestones.forEach(milestone => {
                    if (scrollPercent >= milestone && !tracked.has(milestone)) {
                        tracked.add(milestone);
                        if (window.analyticsManager) {
                            window.analyticsManager.trackEvent('blog_scroll_depth', {
                                depth: milestone,
                                page: 'blog_index'
                            });
                        }
                    }
                });
            }
        }, 1000));
    }
    
    trackReadingTime() {
        const startTime = Date.now();
        
        window.addEventListener('beforeunload', () => {
            const timeSpent = Date.now() - startTime;
            if (timeSpent > 30000 && window.analyticsManager) { // More than 30 seconds
                window.analyticsManager.trackEvent('blog_reading_time', {
                    time_spent: timeSpent,
                    page: 'blog_index',
                    posts_viewed: this.displayedPosts
                });
            }
        });
    }
    
    // Utility Methods
    formatDate(dateString) {
        const date = new Date(dateString);
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    }
    
    formatNumber(num) {
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'k';
        }
        return num.toString();
    }
    
    getCategoryName(category) {
        return window.blogContent?.categories?.[category]?.name || category;
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
            console.log('[Blog Manager]', ...args);
        }
    }
    
    // Public API Methods
    search(query) {
        const searchInput = document.getElementById('blog-search-input');
        if (searchInput) {
            searchInput.value = query;
        }
        this.handleSearch(query);
    }
    
    filterByCategory(category) {
        const button = document.querySelector(`[data-filter="${category}"]`);
        if (button) {
            this.handleFilterClick(button);
        }
    }
    
    clearFilters() {
        const allButton = document.querySelector('[data-filter="all"]');
        if (allButton) {
            this.handleFilterClick(allButton);
        }
        
        const searchInput = document.getElementById('blog-search-input');
        if (searchInput) {
            searchInput.value = '';
            this.handleSearch('');
        }
    }
}

// Global helper functions
window.trackPostClick = function(postId, postTitle) {
    if (window.analyticsManager) {
        window.analyticsManager.trackEvent('blog_post_click', {
            post_id: postId,
            post_title: postTitle,
            click_location: 'blog_index'
        });
    }
};

window.filterByTag = function(tag) {
    if (window.blogManager) {
        window.blogManager.search(tag);
    }
};

window.clearFilters = function() {
    if (window.blogManager) {
        window.blogManager.clearFilters();
    }
};

// Initialize blog manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.blogManager = new BlogManager();
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BlogManager;
}