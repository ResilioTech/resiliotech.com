/**
 * Content Management System for Resiliotech
 * Dynamically loads and displays content from various sources
 */

class ContentManager {
    constructor() {
        this.caseStudies = [];
        this.resources = [];
        this.blogPosts = [];
        this.config = {
            enableContentPersonalization: true,
            contentRefreshInterval: 5 * 60 * 1000, // 5 minutes
            debugMode: window.location.hostname === 'localhost'
        };
        
        this.init();
    }

    async init() {
        this.log('Content Manager initializing...');
        
        // Load content data
        await this.loadContentSources();
        
        // Initialize content sections
        this.initializeCaseStudies();
        this.initializeResourcesSection();
        this.initializeBlogSection();
        this.initializeTestimonials();
        
        // Set up content refresh
        this.setupContentRefresh();
        
        this.log('Content Manager initialized');
    }

    async loadContentSources() {
        try {
            // Load case studies
            if (window.caseStudiesData) {
                this.caseStudies = window.caseStudiesData.getAll();
            }
            
            // Load resources
            if (window.resourcesLibrary) {
                this.resources = window.resourcesLibrary.getAll();
            }
            
            // Load blog content
            if (window.blogContent) {
                this.blogPosts = window.blogContent.getAll();
            }
            
            this.log('Content sources loaded successfully');
        } catch (error) {
            this.log('Error loading content sources:', error);
        }
    }

    initializeCaseStudies() {
        this.createCaseStudiesSection();
        this.createCaseStudyCards();
        this.setupCaseStudyFilters();
    }

    createCaseStudiesSection() {
        const existingSection = document.getElementById('case-studies');
        if (existingSection) return;

        const section = document.createElement('section');
        section.id = 'case-studies';
        section.className = 'case-studies section-padding';
        section.innerHTML = `
            <div class="container">
                <div class="case-studies-header">
                    <h2 class="section-title">Success Stories</h2>
                    <p class="section-description">
                        See how we've helped startups transform their operations with automation
                    </p>
                </div>
                
                <div class="case-study-filters">
                    <button class="filter-btn active" data-filter="all">All Stories</button>
                    <button class="filter-btn" data-filter="fintech">FinTech</button>
                    <button class="filter-btn" data-filter="healthcare">HealthTech</button>
                    <button class="filter-btn" data-filter="ecommerce">E-commerce</button>
                </div>
                
                <div class="case-studies-grid" id="case-studies-grid">
                    <!-- Case study cards will be inserted here -->
                </div>
                
                <div class="case-studies-cta">
                    <h3>Ready to Write Your Success Story?</h3>
                    <p>Join the startups that have transformed their operations with our automation solutions.</p>
                    <a href="#contact" class="btn btn-primary">Get Your Free Consultation</a>
                </div>
            </div>
        `;

        // Insert after services section
        const servicesSection = document.getElementById('services');
        if (servicesSection) {
            servicesSection.parentNode.insertBefore(section, servicesSection.nextSibling);
        }
    }

    createCaseStudyCards() {
        const gridContainer = document.getElementById('case-studies-grid');
        if (!gridContainer) return;

        const featuredCaseStudies = this.caseStudies.slice(0, 3); // Show first 3
        
        featuredCaseStudies.forEach(caseStudy => {
            const card = this.createCaseStudyCard(caseStudy);
            gridContainer.appendChild(card);
        });
    }

    createCaseStudyCard(caseStudy) {
        const card = document.createElement('div');
        card.className = 'case-study-card';
        card.dataset.industry = caseStudy.industry.toLowerCase().replace(/\s+/g, '');
        
        const metrics = caseStudy.metrics.slice(0, 2); // Show first 2 metrics
        
        card.innerHTML = `
            <div class="case-study-header">
                <div class="case-study-meta">
                    <span class="industry-tag">${caseStudy.industry}</span>
                    <span class="team-size">${caseStudy.teamSize}</span>
                </div>
                <h3 class="case-study-title">${caseStudy.title}</h3>
                <p class="case-study-challenge">${caseStudy.challenge}</p>
            </div>
            
            <div class="case-study-metrics">
                ${metrics.map(metric => `
                    <div class="metric">
                        <div class="metric-value">${metric.value}</div>
                        <div class="metric-label">${metric.label}</div>
                    </div>
                `).join('')}
            </div>
            
            <div class="case-study-technologies">
                <div class="tech-stack">
                    ${caseStudy.technologies.slice(0, 4).map(tech => 
                        `<span class="tech-tag">${tech}</span>`
                    ).join('')}
                </div>
            </div>
            
            <div class="case-study-footer">
                <blockquote class="testimonial">
                    "${caseStudy.testimonial.quote.substring(0, 120)}..."
                    <cite>- ${caseStudy.testimonial.author}</cite>
                </blockquote>
                <button class="case-study-cta" onclick="window.contentManager.openCaseStudyModal('${caseStudy.id}')">
                    Read Full Story
                </button>
            </div>
        `;
        
        return card;
    }

    setupCaseStudyFilters() {
        const filterButtons = document.querySelectorAll('.case-study-filters .filter-btn');
        filterButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                // Update active button
                filterButtons.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                
                // Filter case studies
                const filter = e.target.dataset.filter;
                this.filterCaseStudies(filter);
            });
        });
    }

    filterCaseStudies(filter) {
        const cards = document.querySelectorAll('.case-study-card');
        cards.forEach(card => {
            if (filter === 'all' || card.dataset.industry.includes(filter)) {
                card.style.display = 'block';
                card.classList.add('animate__animated', 'animate__fadeInUp');
            } else {
                card.style.display = 'none';
            }
        });
    }

    openCaseStudyModal(caseStudyId) {
        const caseStudy = this.caseStudies.find(cs => cs.id === caseStudyId);
        if (!caseStudy) return;

        const modal = this.createCaseStudyModal(caseStudy);
        document.body.appendChild(modal);
        
        // Show modal
        setTimeout(() => modal.classList.add('active'), 10);
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
        
        // Track modal view
        if (window.analyticsManager) {
            window.analyticsManager.trackEvent('case_study_viewed', {
                case_study_id: caseStudyId,
                industry: caseStudy.industry
            });
        }
    }

    createCaseStudyModal(caseStudy) {
        const modal = document.createElement('div');
        modal.className = 'case-study-modal';
        modal.innerHTML = `
            <div class="modal-overlay" onclick="this.parentElement.remove(); document.body.style.overflow = ''"></div>
            <div class="modal-content">
                <button class="modal-close" onclick="this.closest('.case-study-modal').remove(); document.body.style.overflow = ''">&times;</button>
                
                <div class="modal-header">
                    <div class="case-study-meta">
                        <span class="industry-tag">${caseStudy.industry}</span>
                        <span class="timeline-tag">${caseStudy.timeline}</span>
                    </div>
                    <h2>${caseStudy.title}</h2>
                    <p class="company-info">${caseStudy.company} • ${caseStudy.teamSize}</p>
                </div>
                
                <div class="modal-body">
                    <div class="challenge-solution">
                        <div class="challenge">
                            <h3>The Challenge</h3>
                            <p>${caseStudy.challenge}</p>
                        </div>
                        <div class="solution">
                            <h3>Our Solution</h3>
                            <p>${caseStudy.solution}</p>
                        </div>
                    </div>
                    
                    <div class="results-section">
                        <h3>Results Achieved</h3>
                        <div class="results-grid">
                            ${caseStudy.metrics.map(metric => `
                                <div class="result-card">
                                    <div class="result-value">${metric.value}</div>
                                    <div class="result-label">${metric.label}</div>
                                    <div class="result-description">${metric.description}</div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    
                    <div class="implementation-section">
                        <h3>Implementation Timeline</h3>
                        <div class="implementation-phases">
                            ${Object.keys(caseStudy.implementation).map(phaseKey => {
                                const phase = caseStudy.implementation[phaseKey];
                                return `
                                    <div class="phase">
                                        <h4>${phase.title}</h4>
                                        <ul>
                                            ${phase.tasks.map(task => `<li>${task}</li>`).join('')}
                                        </ul>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                    </div>
                    
                    <div class="technologies-section">
                        <h3>Technologies Used</h3>
                        <div class="tech-grid">
                            ${caseStudy.technologies.map(tech => 
                                `<span class="tech-badge">${tech}</span>`
                            ).join('')}
                        </div>
                    </div>
                    
                    <div class="testimonial-section">
                        <blockquote class="full-testimonial">
                            "${caseStudy.testimonial.quote}"
                            <cite>
                                <strong>${caseStudy.testimonial.author}</strong><br>
                                ${caseStudy.testimonial.company}
                            </cite>
                        </blockquote>
                    </div>
                </div>
                
                <div class="modal-footer">
                    <h3>Ready for Similar Results?</h3>
                    <p>Let's discuss how we can help transform your startup's operations.</p>
                    <a href="#contact" class="btn btn-primary" onclick="this.closest('.case-study-modal').remove(); document.body.style.overflow = ''">
                        Get Your Free Consultation
                    </a>
                </div>
            </div>
        `;
        
        return modal;
    }

    initializeResourcesSection() {
        this.createResourcesPreview();
    }

    createResourcesPreview() {
        const existingSection = document.getElementById('resources-preview');
        if (existingSection) return;

        const section = document.createElement('section');
        section.id = 'resources-preview';
        section.className = 'resources-preview section-padding';
        section.innerHTML = `
            <div class="container">
                <div class="resources-header">
                    <h2 class="section-title">Free Resources & Tools</h2>
                    <p class="section-description">
                        Everything you need to implement world-class automation in your startup
                    </p>
                </div>
                
                <div class="resources-grid" id="resources-preview-grid">
                    <!-- Resource cards will be inserted here -->
                </div>
                
                <div class="resources-cta">
                    <a href="/resources/" class="btn btn-secondary">View All Resources</a>
                </div>
            </div>
        `;

        // Insert before contact section
        const contactSection = document.getElementById('contact');
        if (contactSection) {
            contactSection.parentNode.insertBefore(section, contactSection);
        }

        // Populate with featured resources
        this.populateResourcesPreview();
    }

    populateResourcesPreview() {
        const gridContainer = document.getElementById('resources-preview-grid');
        if (!gridContainer) return;

        const featuredResources = this.resources.filter(r => r.popularity >= 90).slice(0, 4);
        
        featuredResources.forEach(resource => {
            const card = this.createResourceCard(resource);
            gridContainer.appendChild(card);
        });
    }

    createResourceCard(resource) {
        const card = document.createElement('div');
        card.className = 'resource-card';
        
        card.innerHTML = `
            <div class="resource-icon">
                ${this.getResourceIcon(resource.type)}
            </div>
            <div class="resource-content">
                <h3 class="resource-title">${resource.title}</h3>
                <p class="resource-description">${resource.description.substring(0, 100)}...</p>
                
                <div class="resource-meta">
                    <span class="resource-type">${resource.type}</span>
                    <span class="resource-difficulty">${resource.difficulty}</span>
                    ${resource.timeToImplement ? `<span class="resource-time">${resource.timeToImplement}</span>` : ''}
                </div>
                
                <div class="resource-tags">
                    ${resource.tags.slice(0, 3).map(tag => 
                        `<span class="resource-tag">${tag}</span>`
                    ).join('')}
                </div>
                
                <div class="resource-footer">
                    <div class="resource-stats">
                        <span class="downloads">↓ ${resource.downloads || resource.uses || 0}</span>
                        <span class="rating">★ ${resource.rating}</span>
                    </div>
                    <a href="${resource.downloadUrl || resource.toolUrl || '#'}" 
                       class="resource-cta" 
                       ${resource.downloadUrl ? 'download' : ''}
                       onclick="window.contentManager.trackResourceAccess('${resource.id}')">
                        ${resource.type === 'tool' ? 'Use Tool' : 'Download'}
                    </a>
                </div>
            </div>
        `;
        
        return card;
    }

    getResourceIcon(type) {
        const icons = {
            template: '📄',
            guide: '📚',
            checklist: '✅',
            video: '🎥',
            tool: '🔧'
        };
        return icons[type] || '📄';
    }

    initializeBlogSection() {
        this.createBlogPreview();
    }

    createBlogPreview() {
        const existingSection = document.getElementById('blog-preview');
        if (existingSection) return;

        const section = document.createElement('section');
        section.id = 'blog-preview';
        section.className = 'blog-preview section-padding';
        section.innerHTML = `
            <div class="container">
                <div class="blog-header">
                    <h2 class="section-title">Latest Insights</h2>
                    <p class="section-description">
                        Learn about DevOps automation, startup scaling, and industry best practices
                    </p>
                </div>
                
                <div class="blog-grid" id="blog-preview-grid">
                    <!-- Blog cards will be inserted here -->
                </div>
                
                <div class="blog-cta">
                    <a href="/blog/" class="btn btn-secondary">Read More Articles</a>
                </div>
            </div>
        `;

        // Insert before resources section
        const resourcesSection = document.getElementById('resources-preview');
        if (resourcesSection) {
            resourcesSection.parentNode.insertBefore(section, resourcesSection);
        }

        // Populate with recent blog posts
        this.populateBlogPreview();
    }

    populateBlogPreview() {
        const gridContainer = document.getElementById('blog-preview-grid');
        if (!gridContainer) return;

        const recentPosts = window.blogContent ? window.blogContent.getFeatured().slice(0, 3) : [];
        
        recentPosts.forEach(post => {
            const card = this.createBlogCard(post);
            gridContainer.appendChild(card);
        });
    }

    createBlogCard(post) {
        const card = document.createElement('article');
        card.className = 'blog-card';
        
        const categoryInfo = window.blogContent ? 
            window.blogContent.categories[post.category] : 
            { name: post.category, color: '#6366f1' };
        
        card.innerHTML = `
            <div class="blog-header">
                <div class="blog-category" style="color: ${categoryInfo.color}">
                    ${categoryInfo.name}
                </div>
                <div class="blog-meta">
                    <span class="blog-date">${new Date(post.publishedAt).toLocaleDateString()}</span>
                    <span class="blog-read-time">${post.readTime}</span>
                </div>
            </div>
            
            <div class="blog-content">
                <h3 class="blog-title">
                    <a href="/blog/${post.slug}" onclick="window.contentManager.trackBlogView('${post.id}')">
                        ${post.title}
                    </a>
                </h3>
                <p class="blog-excerpt">${post.excerpt}</p>
            </div>
            
            <div class="blog-tags">
                ${post.tags.slice(0, 3).map(tag => 
                    `<span class="blog-tag">${tag}</span>`
                ).join('')}
            </div>
            
            <div class="blog-footer">
                <div class="blog-author">
                    <img src="${post.author.avatar}" alt="${post.author.name}" class="author-avatar">
                    <span class="author-name">${post.author.name}</span>
                </div>
                <a href="/blog/${post.slug}" class="read-more" onclick="window.contentManager.trackBlogView('${post.id}')">
                    Read More →
                </a>
            </div>
        `;
        
        return card;
    }

    initializeTestimonials() {
        this.createTestimonialsSection();
    }

    createTestimonialsSection() {
        const existingSection = document.getElementById('testimonials');
        if (existingSection) return;

        const section = document.createElement('section');
        section.id = 'testimonials';
        section.className = 'testimonials section-padding';
        section.innerHTML = `
            <div class="container">
                <div class="testimonials-header">
                    <h2 class="section-title">What Our Clients Say</h2>
                    <p class="section-description">
                        Don't just take our word for it - hear from the startups we've helped transform
                    </p>
                </div>
                
                <div class="testimonials-carousel" id="testimonials-carousel">
                    <!-- Testimonials will be inserted here -->
                </div>
            </div>
        `;

        // Insert after case studies section
        const caseStudiesSection = document.getElementById('case-studies');
        if (caseStudiesSection) {
            caseStudiesSection.parentNode.insertBefore(section, caseStudiesSection.nextSibling);
        }

        // Populate testimonials
        this.populateTestimonials();
    }

    populateTestimonials() {
        const carousel = document.getElementById('testimonials-carousel');
        if (!carousel) return;

        const testimonials = this.caseStudies.map(cs => cs.testimonial);
        
        testimonials.forEach((testimonial, index) => {
            const card = document.createElement('div');
            card.className = 'testimonial-card';
            if (index === 0) card.classList.add('active');
            
            card.innerHTML = `
                <blockquote class="testimonial-quote">
                    "${testimonial.quote}"
                </blockquote>
                <cite class="testimonial-author">
                    <strong>${testimonial.author}</strong><br>
                    ${testimonial.company}
                </cite>
            `;
            
            carousel.appendChild(card);
        });

        // Set up carousel rotation
        this.setupTestimonialCarousel();
    }

    setupTestimonialCarousel() {
        const cards = document.querySelectorAll('.testimonial-card');
        if (cards.length <= 1) return;

        let currentIndex = 0;
        
        setInterval(() => {
            cards[currentIndex].classList.remove('active');
            currentIndex = (currentIndex + 1) % cards.length;
            cards[currentIndex].classList.add('active');
        }, 5000); // Rotate every 5 seconds
    }

    // Analytics and tracking
    trackResourceAccess(resourceId) {
        if (window.analyticsManager) {
            window.analyticsManager.trackEvent('resource_accessed', {
                resource_id: resourceId,
                location: 'homepage_preview'
            });
        }
    }

    trackBlogView(postId) {
        if (window.analyticsManager) {
            window.analyticsManager.trackEvent('blog_post_viewed', {
                post_id: postId,
                location: 'homepage_preview'
            });
        }
    }

    // Content refresh
    setupContentRefresh() {
        setInterval(() => {
            this.refreshContent();
        }, this.config.contentRefreshInterval);
    }

    async refreshContent() {
        // In a real implementation, this would fetch updated content from an API
        this.log('Refreshing content...');
        
        // For now, just log the refresh
        if (this.config.debugMode) {
            console.log('Content refresh triggered');
        }
    }

    log(...args) {
        if (this.config.debugMode) {
            console.log('[Content Manager]', ...args);
        }
    }
}

// Initialize content manager when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Wait for other data sources to load
    setTimeout(() => {
        window.contentManager = new ContentManager();
    }, 500);
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ContentManager;
}