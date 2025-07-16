// Blog-specific JavaScript with centralized data and filtering/sorting
class BlogManager {
    constructor() {
        this.currentPosts = [];
        this.filteredPosts = [];
        this.currentPlatform = 'all';
        this.currentCategory = 'all';
        this.currentSort = 'date-desc';
        this.postsPerPage = 9;
        this.currentPage = 1;
        
        this.initBlogFeatures();
    }

    initBlogFeatures() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                console.log('DOM loaded, initializing blog features...');
                setTimeout(() => {                this.loadBlogPosts();
                this.initPlatformFilters();
                this.initCategoryFilters();
                this.initSorting();
                this.initSearch();
                this.initLoadMore();
                this.initProgressBar();
                }, 100);
            });
        } else {
            console.log('DOM already loaded, initializing blog features...');
            setTimeout(() => {
                this.loadBlogPosts();
                this.initPlatformFilters();
                this.initCategoryFilters();
                this.initSorting();
                this.initSearch();
                this.initLoadMore();
                this.initProgressBar();
            }, 100);
        }
    }

    loadBlogPosts() {
        console.log('Loading blog posts...');
        console.log('resourcesData available:', typeof resourcesData);
        
        if (typeof resourcesData === 'undefined') {
            console.error('Blog data not loaded');
            // Try to load after a short delay
            setTimeout(() => {
                if (typeof resourcesData !== 'undefined') {
                    this.loadBlogPosts();
                } else {
                    console.error('Blog data still not available after delay');
                }
            }, 500);
            return;
        }

        console.log('Blog data loaded, processing posts...');
        this.currentPosts = resourcesData.getAllPosts();
        this.filteredPosts = [...this.currentPosts];
        console.log('Posts loaded:', this.currentPosts.length);
        this.renderPosts();
        this.updateResultsCount();
    }

    initSorting() {
        const sortSelect = document.getElementById('sort-select');
        if (!sortSelect) return;

        sortSelect.addEventListener('change', (e) => {
            this.currentSort = e.target.value;
            this.filterAndSortPosts();
        });
    }

    initSearch() {
        const searchInput = document.getElementById('search-input');
        const searchBtn = document.getElementById('search-btn');
        
        if (searchInput) {
            const performSearch = () => {
                this.filterAndSortPosts(searchInput.value.trim());
            };

            // Search on input with debouncing
            searchInput.addEventListener('input', 
                this.constructor.debounce(performSearch, 300)
            );
            
            // Search on button click
            if (searchBtn) {
                searchBtn.addEventListener('click', performSearch);
            }
            
            // Search on Enter key
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    performSearch();
                }
            });
        }
    }

    initPlatformFilters() {
        const platformFilters = document.querySelectorAll('.platform-btn');
        
        platformFilters.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Remove active class from all platform buttons
                platformFilters.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to clicked button
                button.classList.add('active');
                
                // Get platform value
                const platform = button.dataset.platform;
                this.currentPlatform = platform;
                
                // Re-filter and display posts
                this.filterAndSortPosts();
            });
        });
    }

    initCategoryFilters() {
        // Generate category buttons
        if (typeof resourcesData !== 'undefined' && resourcesData.getUniqueCategories) {
            const categoryContainer = document.getElementById('category-filters');
            if (categoryContainer) {
                const categories = resourcesData.getUniqueCategories();
                
                // Add category buttons dynamically
                categories.forEach(category => {
                    const button = document.createElement('button');
                    button.className = 'category-btn';
                    button.dataset.category = category;
                    button.textContent = category;
                    categoryContainer.appendChild(button);
                });
            }
        }

        const categoryFilters = document.querySelectorAll('.category-btn');
        
        categoryFilters.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Remove active class from all category buttons
                categoryFilters.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to clicked button
                button.classList.add('active');
                
                // Get category value
                const category = button.dataset.category;
                this.currentCategory = category;
                
                // Re-filter and display posts
                this.filterAndSortPosts();
            });
        });
    }

    filterAndSortPosts(searchQuery = '') {
        let posts = [...this.currentPosts];

        // Filter by platform
        if (this.currentPlatform !== 'all') {
            posts = posts.filter(post => post.platform === this.currentPlatform);
        }

        // Filter by category
        if (this.currentCategory !== 'all') {
            posts = posts.filter(post => post.category === this.currentCategory);
        }

        // Filter by search query
        if (searchQuery) {
            posts = posts.filter(post => 
                post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
            );
        }

        // Sort posts
        posts.sort((a, b) => {
            switch (this.currentSort) {
                case 'date-desc':
                    return new Date(b.date) - new Date(a.date);
                case 'date-asc':
                    return new Date(a.date) - new Date(b.date);
                case 'reading-time-asc':
                    return parseInt(a.readingTime) - parseInt(b.readingTime);
                case 'reading-time-desc':
                    return parseInt(b.readingTime) - parseInt(a.readingTime);
                case 'title-asc':
                    return a.title.localeCompare(b.title);
                case 'title-desc':
                    return b.title.localeCompare(a.title);
                default:
                    return 0;
            }
        });

        this.filteredPosts = posts;
        this.currentPage = 1;
        this.renderPosts();
        this.updateResultsCount();
    }

    renderPosts() {
        const postsGrid = document.getElementById('posts-grid');
        if (!postsGrid) return;

        const postsToShow = this.filteredPosts.slice(0, this.currentPage * this.postsPerPage);
        
        postsGrid.innerHTML = postsToShow.map(post => {
            const platformIcon = resourcesData.getPlatformIcon(post.platform);
            const platformName = resourcesData.getPlatformName(post.platform);
            const actionText = post.platform === 'youtube' ? 'Watch on' : 'Read on';
            
            return `
                <article class="post-card" data-platform="${post.platform}" data-url="${post.url}">
                    <div class="post-card-header">
                        <div class="post-card-category">${post.tags[0]}</div>
                        <div class="post-card-date">${post.date}</div>
                    </div>
                    <div class="post-card-image">
                        <img src="${post.image}" alt="${post.title}" loading="lazy">
                        <div class="post-card-platform" title="${platformName}">
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                ${platformIcon}
                            </svg>
                        </div>
                    </div>
                    <div class="post-card-content">
                        <h3 class="post-card-title">${post.title}</h3>
                        <p class="post-card-excerpt">${post.excerpt}</p>
                        <div class="post-card-meta">
                            <span class="post-card-reading-time">${post.readingTime}</span>
                            <div class="post-card-tags">
                                ${post.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                            </div>
                        </div>
                        <a href="${post.url}" class="post-card-link btn btn-outline" target="_blank" rel="noopener noreferrer">
                            ${actionText} ${platformName}
                        </a>
                    </div>
                </article>
            `;
        }).join('');

        // Add click handlers for entire cards
        this.addCardClickHandlers();

        // Update load more button
        this.updateLoadMoreButton();
        
        // Initialize lazy loading for new images
        this.initLazyLoading();
    }

    updateLoadMoreButton() {
        const loadMoreBtn = document.getElementById('load-more-btn');
        if (!loadMoreBtn) return;

        const totalShowing = this.currentPage * this.postsPerPage;
        const hasMore = totalShowing < this.filteredPosts.length;
        
        loadMoreBtn.style.display = hasMore ? 'block' : 'none';
    }

    updateResultsCount() {
        const resultsCount = document.getElementById('results-count');
        if (!resultsCount) return;

        const totalShowing = Math.min(this.currentPage * this.postsPerPage, this.filteredPosts.length);
        const total = this.filteredPosts.length;
        
        if (total === 0) {
            resultsCount.textContent = 'No posts found';
        } else if (totalShowing === total) {
            resultsCount.textContent = `Showing all ${total} posts`;
        } else {
            resultsCount.textContent = `Showing ${totalShowing} of ${total} posts`;
        }
    }

    initLoadMore() {
        const loadMoreBtn = document.getElementById('load-more-btn');
        if (!loadMoreBtn) return;

        loadMoreBtn.addEventListener('click', () => {
            this.currentPage++;
            this.renderPosts();
        });
    }

    initProgressBar() {
        // Reading progress bar
        const progressBar = document.createElement('div');
        progressBar.className = 'reading-progress';
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 0%;
            height: 3px;
            background: var(--primary-color);
            z-index: 1000;
            transition: width 0.3s ease;
        `;
        document.body.appendChild(progressBar);

        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const maxHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = (scrolled / maxHeight) * 100;
            progressBar.style.width = Math.min(progress, 100) + '%';
        });
    }

    initLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src || img.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });

            document.querySelectorAll('img[loading="lazy"]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }

    addCardClickHandlers() {
        const postCards = document.querySelectorAll('.post-card');
        
        postCards.forEach(card => {
            card.addEventListener('click', (e) => {
                // Don't trigger card click if user clicked on the button or a link
                if (e.target.closest('.post-card-link') || e.target.closest('a')) {
                    return;
                }
                
                const url = card.getAttribute('data-url');
                if (url) {
                    window.open(url, '_blank', 'noopener,noreferrer');
                }
            });
            
            // Add cursor pointer to indicate clickability
            card.style.cursor = 'pointer';
        });
    }

    // Debounce utility function
    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        console.log('Initializing BlogManager...');
        new BlogManager();
    });
} else {
    console.log('DOM already loaded, initializing BlogManager...');
    new BlogManager();
}
