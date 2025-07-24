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
        this.searchQuery = '';
        this.activeFilters = new Map();
        this.recentSearches = JSON.parse(localStorage.getItem('recentSearches') || '[]');
        this.searchSuggestions = [];
        this.currentSuggestionIndex = -1;
        
        this.initBlogFeatures();
    }

    initBlogFeatures() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                // console.log('DOM loaded, initializing blog features...');
                setTimeout(() => {
                    this.loadBlogPosts();
                    this.initPlatformFilters();
                    this.initCategoryFilters();
                    this.initSorting();
                    this.initSearch();
                    this.initSearchEnhancements();
                    this.initLoadMore();
                    this.initProgressBar();
                    this.initMobileToggle();
                    this.initActiveFilters();
                    this.initKeyboardNavigation();
                    this.initAccessibility();
                    this.initBreadcrumbs();
                }, 100);
            });
        } else {
            // console.log('DOM already loaded, initializing blog features...');
            setTimeout(() => {
                this.loadBlogPosts();
                this.initPlatformFilters();
                this.initCategoryFilters();
                this.initSorting();
                this.initSearch();
                this.initSearchEnhancements();
                this.initLoadMore();
                this.initProgressBar();
                this.initMobileToggle();
                this.initActiveFilters();
                this.initKeyboardNavigation();
                this.initAccessibility();
                this.initBreadcrumbs();
            }, 100);
        }
    }

    loadBlogPosts() {
        // console.log('Loading blog posts...');
        // console.log('resourcesData available:', typeof resourcesData);
        
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

        // console.log('Blog data loaded, processing posts...');
        this.currentPosts = resourcesData.getAllPosts();
        this.filteredPosts = [...this.currentPosts];
        // console.log('Posts loaded:', this.currentPosts.length);
        this.renderPosts();
        this.updateResultsCount();
        
        // Set initial button states
        this.updatePlatformButtons();
        this.updateCategoryButtons();
        this.updateActiveFilters();
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
        const searchClear = document.getElementById('search-clear');
        
        if (searchInput) {
            const performSearch = () => {
                const query = searchInput.value.trim();
                this.filterAndSortPosts(query);
                
                // Show/hide clear button
                if (searchClear) {
                    searchClear.style.display = query ? 'flex' : 'none';
                }
            };

            // Search on input with debouncing
            searchInput.addEventListener('input', 
                this.constructor.debounce(performSearch, 300)
            );
            
            // Clear search
            if (searchClear) {
                searchClear.addEventListener('click', () => {
                    searchInput.value = '';
                    searchClear.style.display = 'none';
                    this.filterAndSortPosts('');
                    searchInput.focus();
                });
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
        const platformFilters = document.querySelectorAll('.filter-btn[data-platform]');
        
        platformFilters.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Remove active class from all platform buttons
                platformFilters.forEach(btn => {
                    btn.classList.remove('active');
                    btn.setAttribute('aria-pressed', 'false');
                });
                
                // Add active class to clicked button
                button.classList.add('active');
                button.setAttribute('aria-pressed', 'true');
                
                // Get platform value
                const platform = button.dataset.platform;
                this.currentPlatform = platform;
                
                // Re-filter and display posts
                this.filterAndSortPosts();
                this.onFilterChange();
            });
        });
    }

    initCategoryFilters() {
        // Generate category buttons
        if (typeof resourcesData !== 'undefined' && resourcesData.getUniqueCategories) {
            const categoryContainer = document.getElementById('category-filters');
            if (categoryContainer) {
                // Clear existing buttons (except the "All" button)
                const existingButtons = categoryContainer.querySelectorAll('.filter-btn:not([data-category="all"])');
                existingButtons.forEach(btn => btn.remove());
                
                const categories = resourcesData.getUniqueCategories();
                
                // Add category buttons dynamically
                categories.forEach(category => {
                    const button = document.createElement('button');
                    button.className = 'filter-btn';
                    button.dataset.category = category;
                    button.textContent = category;
                    button.setAttribute('aria-pressed', 'false');
                    categoryContainer.appendChild(button);
                });
            }
        }

        const categoryFilters = document.querySelectorAll('.filter-btn[data-category]');
        
        categoryFilters.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Remove active class from all category buttons
                categoryFilters.forEach(btn => {
                    btn.classList.remove('active');
                    btn.setAttribute('aria-pressed', 'false');
                });
                
                // Add active class to clicked button
                button.classList.add('active');
                button.setAttribute('aria-pressed', 'true');
                
                // Get category value
                const category = button.dataset.category;
                this.currentCategory = category;
                
                // Re-filter and display posts
                this.filterAndSortPosts();
                this.onFilterChange();
            });
        });
    }

    filterAndSortPosts(searchQuery = '') {
        // Show loading state
        this.showLoadingState();
        
        // Store search query
        this.searchQuery = searchQuery;
        
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
        
        // Scroll to the top of the resource content section smoothly
        setTimeout(() => {
            const resourceContent = document.querySelector('.resource-content');
            if (resourceContent) {
                const offsetTop = resourceContent.offsetTop - 80; // Account for fixed header
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            } else {
                // Fallback: scroll to top of content-main if resource-content not found
                const contentMain = document.querySelector('.content-main');
                if (contentMain) {
                    const offsetTop = contentMain.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        }, 100); // Small delay to ensure content is rendered
    }

    renderPosts() {
        const postsGrid = document.getElementById('posts-grid');
        if (!postsGrid) return;

        // Hide loading state
        this.hideLoadingState();

        const postsToShow = this.filteredPosts.slice(0, this.currentPage * this.postsPerPage);
        
        // Handle empty state
        if (postsToShow.length === 0) {
            this.showEmptyState();
            return;
        } else {
            this.hideEmptyState();
        }
        
        postsGrid.innerHTML = postsToShow.map(post => {
            const platformIcon = resourcesData.getPlatformIcon(post.platform);
            const platformName = resourcesData.getPlatformName(post.platform);
            const actionText = post.platform === 'youtube' ? 'Watch on' : 'Read on';
            
            return `
                <article class="post-card" data-platform="${post.platform}" data-url="${post.url}" tabindex="0" role="article">
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
            resultsCount.textContent = `Showing all ${total} ${total === 1 ? 'post' : 'posts'}`;
        } else {
            resultsCount.textContent = `Showing ${totalShowing} of ${total} ${total === 1 ? 'post' : 'posts'}`;
        }
    }

    initLoadMore() {
        const loadMoreBtn = document.getElementById('load-more-btn');
        if (!loadMoreBtn) return;

        loadMoreBtn.addEventListener('click', () => {
            this.currentPage++;
            this.renderPosts();
            this.updateResultsCount();
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

    // Mobile filter toggle functionality
    initMobileToggle() {
        const mobileToggle = document.getElementById('mobile-filter-toggle');
        const sidebar = document.querySelector('.filters-sidebar');
        
        if (!mobileToggle || !sidebar) return;

        // Create overlay for mobile
        const overlay = document.createElement('div');
        overlay.className = 'sidebar-overlay';
        document.body.appendChild(overlay);

        // Toggle sidebar on mobile
        mobileToggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
            overlay.classList.toggle('active');
            document.body.style.overflow = sidebar.classList.contains('active') ? 'hidden' : 'auto';
        });

        // Close sidebar when clicking overlay
        overlay.addEventListener('click', () => {
            sidebar.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = 'auto';
        });

        // Close sidebar when clicking outside on mobile
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 768 && 
                !sidebar.contains(e.target) && 
                !mobileToggle.contains(e.target) && 
                sidebar.classList.contains('active')) {
                sidebar.classList.remove('active');
                overlay.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });

        // Handle window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                sidebar.classList.remove('active');
                overlay.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
    }

    // Active Filters Management
    initActiveFilters() {
        this.updateActiveFilters();
    }

    updateActiveFilters() {
        const activeFiltersSection = document.getElementById('active-filters');
        const activeFiltersList = document.getElementById('active-filters-list');
        
        if (!activeFiltersSection || !activeFiltersList) return;

        // Clear existing filters
        activeFiltersList.innerHTML = '';

        // Build active filters
        const filters = [];
        
        if (this.currentPlatform !== 'all') {
            filters.push({ type: 'Platform', value: this.currentPlatform, key: 'platform' });
        }
        
        if (this.currentCategory !== 'all') {
            filters.push({ type: 'Category', value: this.currentCategory, key: 'category' });
        }
        
        if (this.searchQuery) {
            filters.push({ type: 'Search', value: this.searchQuery, key: 'search' });
        }

        if (filters.length === 0) {
            activeFiltersSection.classList.add('hidden');
            return;
        }

        activeFiltersSection.classList.remove('hidden');

        // Add filter pills
        filters.forEach(filter => {
            const pill = document.createElement('div');
            pill.className = 'filter-pill';
            pill.innerHTML = `
                <span>${filter.type}: ${filter.value}</span>
                <button class="filter-pill-remove" data-filter="${filter.key}" aria-label="Remove ${filter.type} filter">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            `;
            
            // Add remove functionality
            const removeBtn = pill.querySelector('.filter-pill-remove');
            removeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.removeFilter(filter.key);
            });
            
            activeFiltersList.appendChild(pill);
        });

        // Add clear all button
        const clearAllBtn = document.createElement('button');
        clearAllBtn.className = 'clear-all-filters';
        clearAllBtn.textContent = 'Clear All';
        clearAllBtn.addEventListener('click', () => {
            this.clearAllFilters();
        });
        
        activeFiltersList.appendChild(clearAllBtn);
    }

    removeFilter(filterKey) {
        switch(filterKey) {
            case 'platform':
                this.currentPlatform = 'all';
                break;
            case 'category':
                this.currentCategory = 'all';
                break;
            case 'search':
                this.searchQuery = '';
                document.getElementById('search-input').value = '';
                break;
        }
        
        this.filterAndSortPosts(this.searchQuery);
        this.onFilterChange();
    }

    clearAllFilters() {
        this.currentPlatform = 'all';
        this.currentCategory = 'all';
        this.searchQuery = '';
        
        // Update UI
        document.getElementById('search-input').value = '';
        
        this.filterAndSortPosts('');
        this.onFilterChange();
    }

    updatePlatformButtons() {
        const buttons = document.querySelectorAll('[data-platform]');
        buttons.forEach(btn => {
            const platform = btn.getAttribute('data-platform');
            if (platform === this.currentPlatform) {
                btn.classList.add('active');
                btn.setAttribute('aria-pressed', 'true');
            } else {
                btn.classList.remove('active');
                btn.setAttribute('aria-pressed', 'false');
            }
        });
    }

    updateCategoryButtons() {
        const buttons = document.querySelectorAll('[data-category]');
        buttons.forEach(btn => {
            const category = btn.getAttribute('data-category');
            if (category === this.currentCategory) {
                btn.classList.add('active');
                btn.setAttribute('aria-pressed', 'true');
            } else {
                btn.classList.remove('active');
                btn.setAttribute('aria-pressed', 'false');
            }
        });
    }

    // Search Enhancements
    initSearchEnhancements() {
        const searchInput = document.getElementById('search-input');
        const searchSuggestions = document.getElementById('search-suggestions');
        const suggestionsList = document.getElementById('suggestions-list');
        
        if (!searchInput || !searchSuggestions || !suggestionsList) return;

        // Build search suggestions from current posts
        this.buildSearchSuggestions();

        // Show suggestions on focus
        searchInput.addEventListener('focus', () => {
            this.showSearchSuggestions();
        });

        // Hide suggestions on blur (with delay for clicking)
        searchInput.addEventListener('blur', () => {
            setTimeout(() => {
                this.hideSearchSuggestions();
            }, 200);
        });

        // Handle typing with debounce
        let searchTimeout;
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                this.handleSearchInput(e.target.value);
            }, 300);
        });

        // Handle keyboard navigation
        searchInput.addEventListener('keydown', (e) => {
            this.handleSearchKeyboard(e);
        });
    }

    buildSearchSuggestions() {
        const suggestions = new Set();
        
        this.currentPosts.forEach(post => {
            // Add title words
            post.title.split(' ').forEach(word => {
                if (word.length > 2) {
                    suggestions.add(word.toLowerCase());
                }
            });
            
            // Add categories
            suggestions.add(post.category.toLowerCase());
            
            // Add platform
            suggestions.add(post.platform.toLowerCase());
            
            // Add tags
            post.tags.forEach(tag => {
                suggestions.add(tag.toLowerCase());
            });
        });

        this.searchSuggestions = Array.from(suggestions).sort();
    }

    showSearchSuggestions() {
        const searchSuggestions = document.getElementById('search-suggestions');
        if (searchSuggestions) {
            searchSuggestions.classList.add('active');
            this.populateRecentSearches();
        }
    }

    hideSearchSuggestions() {
        const searchSuggestions = document.getElementById('search-suggestions');
        if (searchSuggestions) {
            searchSuggestions.classList.remove('active');
        }
    }

    handleSearchInput(query) {
        if (query.length < 2) {
            this.populateRecentSearches();
            return;
        }

        const filteredSuggestions = this.searchSuggestions.filter(suggestion =>
            suggestion.includes(query.toLowerCase())
        ).slice(0, 5);

        this.populateSuggestions(filteredSuggestions, query);
    }

    populateRecentSearches() {
        const recentSearchesContainer = document.getElementById('recent-searches');
        const suggestionsList = document.getElementById('suggestions-list');
        
        if (!recentSearchesContainer || !suggestionsList) return;

        suggestionsList.innerHTML = '';
        
        if (this.recentSearches.length === 0) {
            recentSearchesContainer.style.display = 'none';
            return;
        }

        recentSearchesContainer.style.display = 'block';
        const recentList = recentSearchesContainer.querySelector('.recent-searches-list') || 
                          document.createElement('div');
        recentList.className = 'recent-searches-list';
        recentList.innerHTML = '';

        this.recentSearches.slice(0, 3).forEach(search => {
            const item = document.createElement('div');
            item.className = 'recent-search-item';
            item.innerHTML = `
                <svg class="recent-search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12,6 12,12 16,14"></polyline>
                </svg>
                <span>${search}</span>
            `;
            
            item.addEventListener('click', () => {
                this.selectSuggestion(search);
            });
            
            recentList.appendChild(item);
        });

        recentSearchesContainer.appendChild(recentList);
    }

    populateSuggestions(suggestions, query) {
        const suggestionsList = document.getElementById('suggestions-list');
        if (!suggestionsList) return;

        suggestionsList.innerHTML = '';
        
        if (suggestions.length === 0) {
            suggestionsList.innerHTML = '<div class="search-no-results">No suggestions found</div>';
            return;
        }

        suggestions.forEach((suggestion, index) => {
            const item = document.createElement('div');
            item.className = 'search-suggestion';
            item.setAttribute('data-suggestion', suggestion);
            item.innerHTML = `
                <svg class="search-suggestion-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="M21 21l-4.35-4.35"></path>
                </svg>
                <span class="search-suggestion-text">${this.highlightMatch(suggestion, query)}</span>
                <span class="search-suggestion-type">Search</span>
            `;
            
            item.addEventListener('click', () => {
                this.selectSuggestion(suggestion);
            });
            
            suggestionsList.appendChild(item);
        });
    }

    highlightMatch(text, query) {
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<strong>$1</strong>');
    }

    selectSuggestion(suggestion) {
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.value = suggestion;
            this.searchQuery = suggestion;
            this.saveRecentSearch(suggestion);
            this.hideSearchSuggestions();
            this.filterAndSortPosts(suggestion);
            this.updateActiveFilters();
        }
    }

    saveRecentSearch(query) {
        // Remove if already exists
        this.recentSearches = this.recentSearches.filter(search => search !== query);
        
        // Add to beginning
        this.recentSearches.unshift(query);
        
        // Keep only last 5
        this.recentSearches = this.recentSearches.slice(0, 5);
        
        // Save to localStorage
        localStorage.setItem('recentSearches', JSON.stringify(this.recentSearches));
    }

    handleSearchKeyboard(e) {
        const suggestions = document.querySelectorAll('.search-suggestion, .recent-search-item');
        
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            this.currentSuggestionIndex = Math.min(this.currentSuggestionIndex + 1, suggestions.length - 1);
            this.highlightSuggestion(suggestions);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            this.currentSuggestionIndex = Math.max(this.currentSuggestionIndex - 1, -1);
            this.highlightSuggestion(suggestions);
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (this.currentSuggestionIndex >= 0 && suggestions[this.currentSuggestionIndex]) {
                const suggestion = suggestions[this.currentSuggestionIndex];
                const text = suggestion.querySelector('.search-suggestion-text, span')?.textContent;
                if (text) {
                    this.selectSuggestion(text);
                }
            }
        } else if (e.key === 'Escape') {
            this.hideSearchSuggestions();
        }
    }

    highlightSuggestion(suggestions) {
        suggestions.forEach((suggestion, index) => {
            suggestion.classList.toggle('keyboard-focus', index === this.currentSuggestionIndex);
        });
    }

    // Loading States
    showLoadingState() {
        const postsGrid = document.getElementById('posts-grid');
        const skeletonContainer = document.getElementById('skeleton-container');
        
        if (postsGrid && skeletonContainer) {
            postsGrid.classList.add('loading');
            skeletonContainer.classList.remove('hidden');
        }
    }

    hideLoadingState() {
        const postsGrid = document.getElementById('posts-grid');
        const skeletonContainer = document.getElementById('skeleton-container');
        
        if (postsGrid && skeletonContainer) {
            postsGrid.classList.remove('loading');
            skeletonContainer.classList.add('hidden');
        }
    }

    // Empty State Management
    showEmptyState() {
        const emptyState = document.getElementById('empty-state');
        const postsGrid = document.getElementById('posts-grid');
        
        if (emptyState && postsGrid) {
            emptyState.classList.remove('hidden');
            postsGrid.style.display = 'none';
        }
    }

    hideEmptyState() {
        const emptyState = document.getElementById('empty-state');
        const postsGrid = document.getElementById('posts-grid');
        
        if (emptyState && postsGrid) {
            emptyState.classList.add('hidden');
            postsGrid.style.display = 'grid';
        }
    }

    // Keyboard Navigation
    initKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });

        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
        });

        // Make post cards keyboard accessible
        const postCards = document.querySelectorAll('.post-card');
        postCards.forEach(card => {
            card.setAttribute('tabindex', '0');
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    const link = card.querySelector('.post-card-link');
                    if (link) {
                        link.click();
                    }
                }
            });
        });
    }

    // Accessibility Improvements
    initAccessibility() {
        // Add ARIA labels
        this.updateAriaLabels();
        
        // Add live region for results
        const resultsCount = document.getElementById('results-count');
        if (resultsCount) {
            resultsCount.setAttribute('aria-live', 'polite');
            resultsCount.setAttribute('aria-atomic', 'true');
        }
        
        // Initialize filter button states
        this.initFilterButtonStates();
    }

    initFilterButtonStates() {
        // Set initial aria-pressed states for all filter buttons
        const allButtons = document.querySelectorAll('.filter-btn');
        allButtons.forEach(btn => {
            if (!btn.hasAttribute('aria-pressed')) {
                btn.setAttribute('aria-pressed', 'false');
            }
        });
        
        // Set active states for "All" buttons
        const allPlatformBtn = document.querySelector('[data-platform="all"]');
        if (allPlatformBtn) {
            allPlatformBtn.setAttribute('aria-pressed', 'true');
        }
        
        const allCategoryBtn = document.querySelector('[data-category="all"]');
        if (allCategoryBtn) {
            allCategoryBtn.setAttribute('aria-pressed', 'true');
        }
    }

    updateAriaLabels() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(btn => {
            const isActive = btn.classList.contains('active');
            btn.setAttribute('aria-pressed', isActive);
            btn.setAttribute('role', 'button');
        });
    }

    // Global filter state management
    onFilterChange() {
        this.updatePlatformButtons();
        this.updateCategoryButtons();
        this.updateActiveFilters();
        this.updateAriaLabels();
    }

    // Debounce utility function - use shared utility
    static debounce(func, wait) {
        return Utils ? Utils.debounce(func, wait) : this.fallbackDebounce(func, wait);
    }

    // Fallback debounce if Utils not available
    static fallbackDebounce(func, wait) {
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

    // Initialize breadcrumbs
    initBreadcrumbs() {
        if (typeof window.ResilioCommon !== 'undefined') {
            const common = new window.ResilioCommon();
            common.initBreadcrumbs();
        }
    }
}

// Initialize the BlogManager when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // console.log('Initializing BlogManager...');
    new BlogManager();
});
