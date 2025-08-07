/**
 * Advanced Knowledge Base Search System
 * Provides instant search, categorization, and intelligent recommendations
 */

class KnowledgeBase {
    constructor() {
        this.articles = [];
        this.filteredArticles = [];
        this.currentCategory = 'all';
        this.currentSearchTerm = '';
        this.searchTimeout = null;
        this.selectedSuggestionIndex = -1;
        
        // Search configuration
        this.searchConfig = {
            minSearchLength: 2,
            maxSuggestions: 8,
            suggestionDelay: 300,
            searchWeights: {
                title: 3,
                excerpt: 2,
                tags: 2,
                category: 1,
                content: 1
            }
        };
        
        this.bindEvents();
    }
    
    async init() {
        this.showLoading(true);
        
        try {
            // Load articles data
            await this.loadArticles();
            
            // Initialize display
            this.updateCategoryCounts();
            this.displayArticles(this.articles);
            this.showLoading(false);
            
            // Parse URL parameters for initial search
            this.handleUrlParameters();
            
            console.log('Knowledge Base initialized with', this.articles.length, 'articles');
        } catch (error) {
            console.error('Failed to initialize knowledge base:', error);
            this.showError('Failed to load knowledge base articles');
        }
    }
    
    bindEvents() {
        // Search input events
        const searchInput = document.getElementById('kb-search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => this.handleSearchInput(e));
            searchInput.addEventListener('keydown', (e) => this.handleKeyNavigation(e));
            searchInput.addEventListener('focus', () => this.showSearchSuggestions());
            searchInput.addEventListener('blur', () => this.hideSearchSuggestions(200));
        }
        
        // Filter button events
        document.querySelectorAll('.filter-button').forEach(button => {
            button.addEventListener('click', (e) => this.handleFilterClick(e));
        });
        
        // Category link events
        document.querySelectorAll('.category-link').forEach(link => {
            link.addEventListener('click', (e) => this.handleCategoryClick(e));
        });
        
        // Popular search tag events
        document.querySelectorAll('.popular-tag').forEach(tag => {
            tag.addEventListener('click', (e) => this.handlePopularSearchClick(e));
        });
        
        // Article click events (delegated)
        document.addEventListener('click', (e) => {
            if (e.target.closest('.article-card')) {
                this.handleArticleClick(e.target.closest('.article-card'));
            }
            if (e.target.closest('.suggestion-item')) {
                this.handleSuggestionClick(e.target.closest('.suggestion-item'));
            }
        });
        
        // Outside click to hide suggestions
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.search-container')) {
                this.hideSearchSuggestions();
            }
        });
    }
    
    async loadArticles() {
        // In a real implementation, this would fetch from an API
        // For demo purposes, we'll use static data
        this.articles = [
            {
                id: 1,
                title: "Setting Up a Complete CI/CD Pipeline with GitHub Actions",
                excerpt: "Learn how to create a robust CI/CD pipeline using GitHub Actions, including automated testing, security scanning, and multi-environment deployments.",
                category: "ci-cd",
                difficulty: "intermediate",
                readTime: 15,
                tags: ["github-actions", "ci/cd", "automation", "testing", "deployment"],
                content: "Complete guide to implementing CI/CD pipelines with GitHub Actions...",
                author: "DevOps Team",
                publishDate: "2024-01-15",
                views: 1250
            },
            {
                id: 2,
                title: "Docker Best Practices for Production Deployments",
                excerpt: "Essential Docker practices for building secure, efficient, and maintainable containers in production environments.",
                category: "infrastructure",
                difficulty: "intermediate",
                readTime: 12,
                tags: ["docker", "containers", "production", "security", "optimization"],
                content: "Production-ready Docker practices and optimization techniques...",
                author: "Infrastructure Team",
                publishDate: "2024-01-10",
                views: 980
            },
            {
                id: 3,
                title: "Kubernetes Troubleshooting: Common Issues and Solutions",
                excerpt: "Comprehensive guide to diagnosing and fixing the most common Kubernetes issues, from pod failures to networking problems.",
                category: "troubleshooting",
                difficulty: "advanced",
                readTime: 20,
                tags: ["kubernetes", "troubleshooting", "debugging", "pods", "networking"],
                content: "Step-by-step troubleshooting guide for Kubernetes deployments...",
                author: "Platform Team",
                publishDate: "2024-01-08",
                views: 1500
            },
            {
                id: 4,
                title: "Infrastructure as Code with Terraform: Complete Guide",
                excerpt: "Master Terraform for infrastructure automation, including best practices, state management, and advanced patterns.",
                category: "infrastructure",
                difficulty: "intermediate",
                readTime: 18,
                tags: ["terraform", "iac", "infrastructure", "automation", "aws", "azure"],
                content: "Comprehensive Terraform guide covering basics to advanced patterns...",
                author: "Cloud Team",
                publishDate: "2024-01-05",
                views: 2100
            },
            {
                id: 5,
                title: "Setting Up Comprehensive Monitoring with Prometheus and Grafana",
                excerpt: "Build a complete monitoring stack with Prometheus for metrics collection and Grafana for visualization and alerting.",
                category: "monitoring",
                difficulty: "intermediate",
                readTime: 16,
                tags: ["prometheus", "grafana", "monitoring", "metrics", "alerting", "observability"],
                content: "Complete monitoring setup with Prometheus and Grafana...",
                author: "SRE Team",
                publishDate: "2024-01-03",
                views: 1750
            },
            {
                id: 6,
                title: "DevSecOps: Integrating Security into Your CI/CD Pipeline",
                excerpt: "Learn how to embed security scanning, vulnerability assessment, and compliance checks directly into your deployment pipeline.",
                category: "security",
                difficulty: "advanced",
                readTime: 22,
                tags: ["devsecops", "security", "ci/cd", "vulnerability-scanning", "compliance"],
                content: "Comprehensive guide to implementing DevSecOps practices...",
                author: "Security Team",
                publishDate: "2024-01-01",
                views: 1320
            },
            {
                id: 7,
                title: "Automated Testing Strategies for DevOps Teams",
                excerpt: "Implement comprehensive testing strategies including unit, integration, and end-to-end tests in your automation pipeline.",
                category: "best-practices",
                difficulty: "intermediate",
                readTime: 14,
                tags: ["testing", "automation", "quality-assurance", "ci/cd", "best-practices"],
                content: "Testing strategies for modern DevOps workflows...",
                author: "QA Team",
                publishDate: "2023-12-28",
                views: 890
            },
            {
                id: 8,
                title: "Database Migration Strategies in DevOps",
                excerpt: "Safe and reliable database schema migrations with zero-downtime deployment techniques and rollback strategies.",
                category: "best-practices",
                difficulty: "advanced",
                readTime: 19,
                tags: ["database", "migrations", "zero-downtime", "deployment", "rollback"],
                content: "Advanced database migration techniques for production systems...",
                author: "Database Team",
                publishDate: "2023-12-25",
                views: 1100
            },
            {
                id: 9,
                title: "Microservices Deployment with Kubernetes and Helm",
                excerpt: "Deploy and manage microservices architectures using Kubernetes orchestration and Helm package management.",
                category: "infrastructure",
                difficulty: "advanced",
                readTime: 25,
                tags: ["microservices", "kubernetes", "helm", "orchestration", "deployment"],
                content: "Complete microservices deployment guide with K8s and Helm...",
                author: "Architecture Team",
                publishDate: "2023-12-20",
                views: 1650
            },
            {
                id: 10,
                title: "Log Management and Analysis for DevOps",
                excerpt: "Centralized logging strategies using ELK stack, log aggregation, and automated analysis for better system observability.",
                category: "monitoring",
                difficulty: "intermediate",
                readTime: 17,
                tags: ["logging", "elk-stack", "observability", "analysis", "troubleshooting"],
                content: "Comprehensive logging strategy for DevOps teams...",
                author: "Observability Team",
                publishDate: "2023-12-18",
                views: 1340
            },
            {
                id: 11,
                title: "Git Workflow Best Practices for DevOps Teams",
                excerpt: "Optimize your Git workflow with branching strategies, commit conventions, and automated workflows for better collaboration.",
                category: "best-practices",
                difficulty: "beginner",
                readTime: 10,
                tags: ["git", "workflow", "collaboration", "branching", "best-practices"],
                content: "Git workflow optimization for development teams...",
                author: "Development Team",
                publishDate: "2023-12-15",
                views: 750
            },
            {
                id: 12,
                title: "Container Security Best Practices",
                excerpt: "Secure your containerized applications with image scanning, runtime protection, and security policy enforcement.",
                category: "security",
                difficulty: "intermediate",
                readTime: 16,
                tags: ["containers", "security", "docker", "scanning", "runtime-protection"],
                content: "Container security practices and implementation guide...",
                author: "Security Team",
                publishDate: "2023-12-12",
                views: 1180
            }
        ];
        
        // Sort articles by views (popularity) and date
        this.articles.sort((a, b) => {
            const viewsWeight = (b.views - a.views) * 0.1;
            const dateWeight = new Date(b.publishDate) - new Date(a.publishDate);
            return viewsWeight + dateWeight;
        });
        
        this.filteredArticles = [...this.articles];
    }
    
    handleSearchInput(e) {
        const searchTerm = e.target.value.trim();
        
        clearTimeout(this.searchTimeout);
        this.searchTimeout = setTimeout(() => {
            this.performSearch(searchTerm);
        }, this.searchConfig.suggestionDelay);
        
        // Show suggestions for longer queries
        if (searchTerm.length >= this.searchConfig.minSearchLength) {
            this.showSearchSuggestions(searchTerm);
        } else {
            this.hideSearchSuggestions();
        }
    }
    
    performSearch(searchTerm) {
        this.currentSearchTerm = searchTerm;
        
        if (!searchTerm) {
            this.filteredArticles = this.filterByCategory(this.articles, this.currentCategory);
        } else {
            const searchResults = this.searchArticles(searchTerm);
            this.filteredArticles = this.filterByCategory(searchResults, this.currentCategory);
        }
        
        this.displayArticles(this.filteredArticles);
        this.updateSearchStats(searchTerm, this.filteredArticles.length);
        this.trackSearchEvent(searchTerm, this.filteredArticles.length);
        
        // Update URL
        this.updateUrlParams({ q: searchTerm, category: this.currentCategory });
    }
    
    searchArticles(searchTerm) {
        const terms = searchTerm.toLowerCase().split(' ').filter(term => term.length > 0);
        
        return this.articles.map(article => {
            let score = 0;
            
            terms.forEach(term => {
                // Title matching
                if (article.title.toLowerCase().includes(term)) {
                    score += this.searchConfig.searchWeights.title;
                }
                
                // Exact title match bonus
                if (article.title.toLowerCase() === searchTerm.toLowerCase()) {
                    score += 5;
                }
                
                // Excerpt matching
                if (article.excerpt.toLowerCase().includes(term)) {
                    score += this.searchConfig.searchWeights.excerpt;
                }
                
                // Tags matching
                const tagMatch = article.tags.some(tag => tag.toLowerCase().includes(term));
                if (tagMatch) {
                    score += this.searchConfig.searchWeights.tags;
                }
                
                // Category matching
                if (article.category.toLowerCase().includes(term)) {
                    score += this.searchConfig.searchWeights.category;
                }
                
                // Content matching (simulated)
                if (article.content.toLowerCase().includes(term)) {
                    score += this.searchConfig.searchWeights.content;
                }
            });
            
            // Boost popular articles slightly
            score += Math.log(article.views) * 0.1;
            
            return { ...article, searchScore: score };
        })
        .filter(article => article.searchScore > 0)
        .sort((a, b) => b.searchScore - a.searchScore);
    }
    
    showSearchSuggestions(searchTerm = '') {
        const suggestionsContainer = document.getElementById('search-suggestions');
        if (!suggestionsContainer) return;
        
        if (searchTerm.length < this.searchConfig.minSearchLength) {
            suggestionsContainer.style.display = 'none';
            return;
        }
        
        const suggestions = this.generateSuggestions(searchTerm);
        
        if (suggestions.length === 0) {
            suggestionsContainer.style.display = 'none';
            return;
        }
        
        const suggestionsHTML = suggestions.map((suggestion, index) => `
            <div class="suggestion-item" data-suggestion="${suggestion.query}" data-index="${index}">
                <div class="suggestion-title">${this.highlightSearchTerm(suggestion.title, searchTerm)}</div>
                <div class="suggestion-category">${suggestion.category}</div>
            </div>
        `).join('');
        
        suggestionsContainer.innerHTML = suggestionsHTML;
        suggestionsContainer.style.display = 'block';
        this.selectedSuggestionIndex = -1;
    }
    
    generateSuggestions(searchTerm) {
        const suggestions = [];
        const lowerSearchTerm = searchTerm.toLowerCase();
        
        // Article title suggestions
        this.articles.forEach(article => {
            if (article.title.toLowerCase().includes(lowerSearchTerm)) {
                suggestions.push({
                    type: 'article',
                    title: article.title,
                    category: article.category,
                    query: article.title,
                    score: article.views
                });
            }
        });
        
        // Tag suggestions
        const tagSuggestions = new Set();
        this.articles.forEach(article => {
            article.tags.forEach(tag => {
                if (tag.toLowerCase().includes(lowerSearchTerm) && !tagSuggestions.has(tag)) {
                    tagSuggestions.add(tag);
                    suggestions.push({
                        type: 'tag',
                        title: `Articles tagged: ${tag}`,
                        category: 'Tag',
                        query: tag,
                        score: 100
                    });
                }
            });
        });
        
        // Category suggestions
        const categories = ['ci-cd', 'infrastructure', 'monitoring', 'security', 'troubleshooting', 'best-practices'];
        categories.forEach(category => {
            if (category.includes(lowerSearchTerm)) {
                suggestions.push({
                    type: 'category',
                    title: `All ${category.replace('-', ' ')} articles`,
                    category: 'Category',
                    query: category,
                    score: 200
                });
            }
        });
        
        return suggestions
            .sort((a, b) => b.score - a.score)
            .slice(0, this.searchConfig.maxSuggestions);
    }
    
    hideSearchSuggestions(delay = 0) {
        setTimeout(() => {
            const suggestionsContainer = document.getElementById('search-suggestions');
            if (suggestionsContainer) {
                suggestionsContainer.style.display = 'none';
            }
        }, delay);
    }
    
    handleKeyNavigation(e) {
        const suggestionsContainer = document.getElementById('search-suggestions');
        if (!suggestionsContainer || suggestionsContainer.style.display === 'none') return;
        
        const suggestions = suggestionsContainer.querySelectorAll('.suggestion-item');
        
        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                this.selectedSuggestionIndex = Math.min(this.selectedSuggestionIndex + 1, suggestions.length - 1);
                this.updateSuggestionHighlight(suggestions);
                break;
                
            case 'ArrowUp':
                e.preventDefault();
                this.selectedSuggestionIndex = Math.max(this.selectedSuggestionIndex - 1, -1);
                this.updateSuggestionHighlight(suggestions);
                break;
                
            case 'Enter':
                e.preventDefault();
                if (this.selectedSuggestionIndex >= 0 && suggestions[this.selectedSuggestionIndex]) {
                    const suggestion = suggestions[this.selectedSuggestionIndex];
                    this.applySuggestion(suggestion.dataset.suggestion);
                } else {
                    this.performSearch(e.target.value.trim());
                }
                this.hideSearchSuggestions();
                break;
                
            case 'Escape':
                this.hideSearchSuggestions();
                e.target.blur();
                break;
        }
    }
    
    updateSuggestionHighlight(suggestions) {
        suggestions.forEach((suggestion, index) => {
            if (index === this.selectedSuggestionIndex) {
                suggestion.classList.add('highlighted');
            } else {
                suggestion.classList.remove('highlighted');
            }
        });
    }
    
    handleSuggestionClick(suggestionElement) {
        const suggestion = suggestionElement.dataset.suggestion;
        this.applySuggestion(suggestion);
        this.hideSearchSuggestions();
    }
    
    applySuggestion(suggestion) {
        const searchInput = document.getElementById('kb-search-input');
        if (searchInput) {
            searchInput.value = suggestion;
            this.performSearch(suggestion);
        }
    }
    
    handleFilterClick(e) {
        e.preventDefault();
        const filter = e.target.dataset.filter;
        
        // Update active filter button
        document.querySelectorAll('.filter-button').forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');
        
        this.setCategory(filter);
    }
    
    handleCategoryClick(e) {
        e.preventDefault();
        const category = e.target.dataset.category;
        
        // Update active category link
        document.querySelectorAll('.category-link').forEach(link => link.classList.remove('active'));
        e.target.classList.add('active');
        
        // Update filter button to match
        document.querySelectorAll('.filter-button').forEach(btn => btn.classList.remove('active'));
        const matchingButton = document.querySelector(`.filter-button[data-filter="${category}"]`);
        if (matchingButton) {
            matchingButton.classList.add('active');
        }
        
        this.setCategory(category);
    }
    
    handlePopularSearchClick(e) {
        const searchTerm = e.target.dataset.search;
        const searchInput = document.getElementById('kb-search-input');
        
        if (searchInput && searchTerm) {
            searchInput.value = searchTerm;
            this.performSearch(searchTerm);
            
            // Track popular search click
            this.trackEvent('popular_search_click', { search_term: searchTerm });
        }
    }
    
    setCategory(category) {
        this.currentCategory = category;
        
        // Re-apply current search with new category filter
        const searchTerm = this.currentSearchTerm;
        if (searchTerm) {
            const searchResults = this.searchArticles(searchTerm);
            this.filteredArticles = this.filterByCategory(searchResults, category);
        } else {
            this.filteredArticles = this.filterByCategory(this.articles, category);
        }
        
        this.displayArticles(this.filteredArticles);
        this.updateSearchStats(searchTerm, this.filteredArticles.length);
        this.updateUrlParams({ q: searchTerm, category: category });
    }
    
    filterByCategory(articles, category) {
        if (category === 'all') {
            return articles;
        }
        return articles.filter(article => article.category === category);
    }
    
    displayArticles(articles) {
        const articleGrid = document.getElementById('article-grid');
        const noResults = document.getElementById('no-results');
        
        if (articles.length === 0) {
            articleGrid.style.display = 'none';
            noResults.style.display = 'block';
            return;
        }
        
        noResults.style.display = 'none';
        articleGrid.style.display = 'grid';
        
        const articlesHTML = articles.map(article => this.renderArticleCard(article)).join('');
        articleGrid.innerHTML = articlesHTML;
    }
    
    renderArticleCard(article) {
        const difficultyClass = `difficulty-${article.difficulty}`;
        const tagsHTML = article.tags.map(tag => `<span class="tag">${tag}</span>`).join('');
        
        return `
            <div class="article-card" data-article-id="${article.id}">
                <div class="article-meta">
                    <span class="article-category">${article.category.replace('-', ' ')}</span>
                    <span class="article-difficulty ${difficultyClass}">${article.difficulty}</span>
                </div>
                <h3 class="article-title">${this.highlightSearchTerm(article.title, this.currentSearchTerm)}</h3>
                <p class="article-excerpt">${this.highlightSearchTerm(article.excerpt, this.currentSearchTerm)}</p>
                <div class="article-footer">
                    <span class="read-time">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="12" r="10"></circle>
                            <polyline points="12,6 12,12 16,14"></polyline>
                        </svg>
                        ${article.readTime} min read
                    </span>
                    <span class="article-views">${article.views} views</span>
                </div>
                <div class="article-tags">${tagsHTML}</div>
            </div>
        `;
    }
    
    handleArticleClick(articleCard) {
        const articleId = parseInt(articleCard.dataset.articleId);
        const article = this.articles.find(a => a.id === articleId);
        
        if (article) {
            // Track article view
            this.trackEvent('knowledge_base_article_view', {
                article_id: articleId,
                article_title: article.title,
                category: article.category,
                search_term: this.currentSearchTerm
            });
            
            // Increment view count
            article.views++;
            
            // In a real implementation, you would navigate to the full article
            // For demo purposes, we'll show an alert
            alert(`Opening article: "${article.title}"\n\nThis would navigate to the full article page.`);
            
            // You could also open in a modal or navigate to a dedicated article page
            // window.open(`/articles/${articleId}`, '_blank');
        }
    }
    
    updateCategoryCounts() {
        const categories = ['all', 'ci-cd', 'infrastructure', 'monitoring', 'security', 'troubleshooting', 'best-practices'];
        
        categories.forEach(category => {
            const count = category === 'all' 
                ? this.articles.length 
                : this.articles.filter(article => article.category === category).length;
            
            const countElement = document.getElementById(`count-${category}`);
            if (countElement) {
                countElement.textContent = count;
            }
        });
    }
    
    updateSearchStats(searchTerm, resultCount) {
        const searchStats = document.getElementById('search-stats');
        const resultsCount = document.getElementById('results-count');
        const searchTermSpan = document.getElementById('search-term');
        
        if (searchTerm) {
            searchStats.style.display = 'block';
            resultsCount.textContent = resultCount;
            searchTermSpan.textContent = searchTerm;
        } else {
            searchStats.style.display = 'none';
        }
    }
    
    showLoading(show) {
        const loadingState = document.getElementById('loading-state');
        const articleGrid = document.getElementById('article-grid');
        
        if (show) {
            loadingState.style.display = 'flex';
            articleGrid.style.display = 'none';
        } else {
            loadingState.style.display = 'none';
            articleGrid.style.display = 'grid';
        }
    }
    
    showError(message) {
        const articleGrid = document.getElementById('article-grid');
        articleGrid.innerHTML = `
            <div class="error-state" style="text-align: center; padding: 3rem; color: #ef4444;">
                <h3>⚠️ Error Loading Articles</h3>
                <p>${message}</p>
            </div>
        `;
        this.showLoading(false);
    }
    
    highlightSearchTerm(text, searchTerm) {
        if (!searchTerm) return text;
        
        const regex = new RegExp(`(${searchTerm})`, 'gi');
        return text.replace(regex, '<mark style="background: #fef3c7; padding: 0.125rem 0.25rem; border-radius: 2px;">$1</mark>');
    }
    
    handleUrlParameters() {
        const urlParams = new URLSearchParams(window.location.search);
        const searchQuery = urlParams.get('q');
        const category = urlParams.get('category');
        
        if (searchQuery) {
            const searchInput = document.getElementById('kb-search-input');
            if (searchInput) {
                searchInput.value = searchQuery;
                this.performSearch(searchQuery);
            }
        }
        
        if (category && category !== 'all') {
            this.setCategory(category);
            
            // Update UI to reflect the category
            const categoryLink = document.querySelector(`[data-category="${category}"]`);
            const filterButton = document.querySelector(`[data-filter="${category}"]`);
            
            if (categoryLink) {
                document.querySelectorAll('.category-link').forEach(link => link.classList.remove('active'));
                categoryLink.classList.add('active');
            }
            
            if (filterButton) {
                document.querySelectorAll('.filter-button').forEach(btn => btn.classList.remove('active'));
                filterButton.classList.add('active');
            }
        }
    }
    
    updateUrlParams(params) {
        const url = new URL(window.location);
        
        Object.keys(params).forEach(key => {
            if (params[key]) {
                url.searchParams.set(key, params[key]);
            } else {
                url.searchParams.delete(key);
            }
        });
        
        // Update URL without page reload
        window.history.replaceState({}, '', url.toString());
    }
    
    trackSearchEvent(searchTerm, resultCount) {
        if (window.analyticsManager) {
            window.analyticsManager.trackEvent('knowledge_base_search', {
                search_term: searchTerm,
                result_count: resultCount,
                category: this.currentCategory,
                timestamp: new Date().toISOString()
            });
        }
    }
    
    trackEvent(eventName, eventData) {
        if (window.analyticsManager) {
            window.analyticsManager.trackEvent(eventName, {
                ...eventData,
                timestamp: new Date().toISOString()
            });
        }
    }
}

// Initialize knowledge base when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.knowledgeBase = new KnowledgeBase();
});