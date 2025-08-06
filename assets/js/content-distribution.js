/**
 * Content Distribution & Repurposing System for Resiliotech
 * Handles content sharing, repurposing, and cross-platform distribution
 */

class ContentDistributionManager {
    constructor() {
        this.config = {
            platforms: ['twitter', 'linkedin', 'youtube', 'newsletter'],
            twitterHandle: '@resiliotech',
            linkedinCompany: 'resiliotech',
            defaultHashtags: ['DevOps', 'StartupTech', 'Automation', 'Infrastructure'],
            youtubeChannel: '@ResilioTech',
            newsletterUrl: 'https://resiliotech.substack.com'
        };
        
        this.contentCache = new Map();
        this.templates = new Map();
        
        this.init();
    }
    
    init() {
        this.loadContentTemplates();
        this.setupContentExtraction();
        this.bindDistributionButtons();
        this.initializeRSSFeeds();
        this.setupAutomationEndpoints();
    }
    
    /**
     * Load platform-specific content templates
     */
    loadContentTemplates() {
        this.templates.set('twitter-thread', {
            maxLength: 280,
            threadIndicator: '🧵',
            hashtags: this.config.defaultHashtags.slice(0, 3),
            callToAction: 'What are your thoughts? 💭'
        });
        
        this.templates.set('linkedin-post', {
            maxLength: 3000,
            tone: 'professional',
            includeHashtags: true,
            callToAction: 'What has been your experience with this? Share your thoughts in the comments.'
        });
        
        this.templates.set('youtube-description', {
            maxLength: 5000,
            includeTimestamps: true,
            includeLinks: true,
            callToAction: 'Subscribe for more DevOps automation content!'
        });
        
        this.templates.set('newsletter-snippet', {
            maxLength: 500,
            tone: 'conversational',
            includeReadMore: true
        });
        
        this.templates.set('email-subject', {
            maxLength: 50,
            tone: 'compelling',
            includeEmoji: true
        });
    }
    
    /**
     * Setup content extraction from blog posts
     */
    setupContentExtraction() {
        // Auto-extract content from blog posts
        if (this.isBlogPost()) {
            setTimeout(() => {
                this.extractBlogContent();
            }, 1000);
        }
        
        // Setup manual extraction buttons
        this.addExtractionButtons();
    }
    
    /**
     * Check if current page is a blog post
     */
    isBlogPost() {
        return window.location.pathname.includes('/blog/') && 
               window.location.pathname !== '/blog/';
    }
    
    /**
     * Extract content from current blog post
     */
    extractBlogContent() {
        const content = {
            title: this.extractTitle(),
            summary: this.extractSummary(),
            keyPoints: this.extractKeyPoints(),
            quotes: this.extractQuotes(),
            hashtags: this.generateHashtags(),
            readingTime: this.calculateReadingTime(),
            wordCount: this.getWordCount(),
            publishDate: this.getPublishDate(),
            author: this.getAuthor(),
            url: window.location.href
        };
        
        this.contentCache.set('current-blog-post', content);
        this.generateDistributionContent(content);
        
        return content;
    }
    
    /**
     * Extract title from blog post
     */
    extractTitle() {
        const titleElement = document.querySelector('h1, .blog-title, .post-title');
        return titleElement ? titleElement.textContent.trim() : document.title;
    }
    
    /**
     * Extract summary from blog post
     */
    extractSummary() {
        // Look for meta description first
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) return metaDesc.content;
        
        // Extract first paragraph
        const firstParagraph = document.querySelector('.blog-content p, .post-content p, article p');
        if (firstParagraph) {
            return firstParagraph.textContent.trim().substring(0, 200) + '...';
        }
        
        return 'DevOps automation insights for fast-moving startups.';
    }
    
    /**
     * Extract key points from blog post
     */
    extractKeyPoints() {
        const points = [];
        
        // Look for bullet points
        const listItems = document.querySelectorAll('.blog-content li, .post-content li, article li');
        listItems.forEach((item, index) => {
            if (index < 5 && item.textContent.trim().length > 20) {
                points.push(item.textContent.trim());
            }
        });
        
        // Look for subheadings
        if (points.length < 3) {
            const headings = document.querySelectorAll('.blog-content h2, .blog-content h3, .post-content h2, .post-content h3, article h2, article h3');
            headings.forEach((heading, index) => {
                if (index < 5) {
                    points.push(heading.textContent.trim());
                }
            });
        }
        
        return points;
    }
    
    /**
     * Extract quotable snippets
     */
    extractQuotes() {
        const quotes = [];
        
        // Look for blockquotes
        const blockquotes = document.querySelectorAll('blockquote');
        blockquotes.forEach(quote => {
            quotes.push(quote.textContent.trim());
        });
        
        // Look for sentences with strong emphasis
        const strongSentences = document.querySelectorAll('strong, b, .highlight');
        strongSentences.forEach(element => {
            const text = element.textContent.trim();
            if (text.length > 30 && text.length < 200) {
                quotes.push(text);
            }
        });
        
        return quotes.slice(0, 5);
    }
    
    /**
     * Generate relevant hashtags
     */
    generateHashtags() {
        const content = document.body.textContent.toLowerCase();
        const hashtagMap = {
            'kubernetes': '#Kubernetes',
            'docker': '#Docker',
            'devops': '#DevOps',
            'automation': '#Automation',
            'ci/cd': '#CICD',
            'infrastructure': '#Infrastructure',
            'monitoring': '#Monitoring',
            'startup': '#StartupTech',
            'terraform': '#Terraform',
            'aws': '#AWS',
            'azure': '#Azure',
            'gcp': '#GCP',
            'prometheus': '#Prometheus',
            'grafana': '#Grafana'
        };
        
        const foundHashtags = [];
        Object.entries(hashtagMap).forEach(([keyword, hashtag]) => {
            if (content.includes(keyword) && foundHashtags.length < 5) {
                foundHashtags.push(hashtag);
            }
        });
        
        // Add default hashtags if not enough found
        const defaultTags = ['#DevOps', '#StartupTech', '#Automation'];
        defaultTags.forEach(tag => {
            if (!foundHashtags.includes(tag) && foundHashtags.length < 5) {
                foundHashtags.push(tag);
            }
        });
        
        return foundHashtags;
    }
    
    /**
     * Calculate reading time
     */
    calculateReadingTime() {
        const wordsPerMinute = 200;
        const wordCount = this.getWordCount();
        const minutes = Math.ceil(wordCount / wordsPerMinute);
        return `${minutes} min read`;
    }
    
    /**
     * Get word count
     */
    getWordCount() {
        const content = document.querySelector('.blog-content, .post-content, article');
        if (!content) return 0;
        
        const text = content.textContent || content.innerText;
        return text.trim().split(/\s+/).length;
    }
    
    /**
     * Get publish date
     */
    getPublishDate() {
        const dateElement = document.querySelector('.post-date, .publish-date, time[datetime]');
        if (dateElement) {
            const datetime = dateElement.getAttribute('datetime') || dateElement.textContent;
            return new Date(datetime).toISOString().split('T')[0];
        }
        return new Date().toISOString().split('T')[0];
    }
    
    /**
     * Get author
     */
    getAuthor() {
        const authorElement = document.querySelector('.post-author, .author-name, [rel="author"]');
        return authorElement ? authorElement.textContent.trim() : 'Resiliotech Team';
    }
    
    /**
     * Generate distribution content for all platforms
     */
    generateDistributionContent(blogContent) {
        const distributions = {
            twitterThread: this.generateTwitterThread(blogContent),
            linkedinPost: this.generateLinkedInPost(blogContent),
            youtubeDescription: this.generateYouTubeDescription(blogContent),
            newsletterSnippet: this.generateNewsletterSnippet(blogContent),
            emailSubject: this.generateEmailSubject(blogContent),
            quotableImages: this.generateQuotableImages(blogContent)
        };
        
        this.contentCache.set('distributions', distributions);
        this.displayDistributionOptions(distributions);
        
        return distributions;
    }
    
    /**
     * Generate Twitter thread from blog content
     */
    generateTwitterThread(content) {
        const template = this.templates.get('twitter-thread');
        const tweets = [];
        
        // First tweet: Title + hook
        const hook = this.generateHook(content.title);
        tweets.push(`${hook}\n\n${this.formatHashtags(content.hashtags.slice(0, 3))} 🧵`);
        
        // Key points as individual tweets
        content.keyPoints.forEach((point, index) => {
            if (tweets.length < 8) { // Limit thread length
                const tweetNumber = tweets.length + 1;
                const formattedPoint = this.formatForTwitter(point, tweetNumber);
                tweets.push(formattedPoint);
            }
        });
        
        // Final tweet with CTA
        tweets.push(`That's a wrap!\n\nIf you found this helpful:\n• Follow ${this.config.twitterHandle} for more DevOps tips\n• Read the full post: ${content.url}\n• Join our newsletter for startup automation insights`);
        
        return {
            tweets: tweets,
            totalTweets: tweets.length,
            estimatedReach: this.estimateTwitterReach(tweets),
            scheduledTime: this.suggestOptimalPostTime('twitter')
        };
    }
    
    /**
     * Generate LinkedIn post
     */
    generateLinkedInPost(content) {
        const template = this.templates.get('linkedin-post');
        
        const post = `${content.title}\n\n${content.summary}\n\n🔧 Key takeaways:\n\n${content.keyPoints.slice(0, 4).map((point, i) => `${i + 1}. ${point}`).join('\n\n')}\n\n💡 ${template.callToAction}\n\nRead the full article: ${content.url}\n\n${this.formatHashtags(content.hashtags)}`;
        
        return {
            content: post,
            wordCount: post.split(' ').length,
            estimatedReach: this.estimateLinkedInReach(post),
            scheduledTime: this.suggestOptimalPostTime('linkedin'),
            carouselImages: this.generateCarouselContent(content)
        };
    }
    
    /**
     * Generate YouTube description
     */
    generateYouTubeDescription(content) {
        const template = this.templates.get('youtube-description');
        
        const description = `${content.summary}\n\n🎯 What you'll learn:\n${content.keyPoints.slice(0, 5).map((point, i) => `${i + 1}. ${point}`).join('\n')}\n\n⏰ Timestamps:\n0:00 Introduction\n2:00 Overview\n5:00 Implementation\n8:00 Best Practices\n10:00 Wrap-up\n\n🔗 Resources mentioned:\n• Blog post: ${content.url}\n• Newsletter: ${this.config.newsletterUrl}\n• LinkedIn: https://linkedin.com/company/${this.config.linkedinCompany}\n\n${template.callToAction}\n\n${this.formatHashtags(content.hashtags)}`;
        
        return {
            content: description,
            suggestedTitle: this.generateVideoTitle(content.title),
            tags: content.hashtags.map(h => h.replace('#', '')),
            thumbnailSuggestions: this.generateThumbnailIdeas(content)
        };
    }
    
    /**
     * Generate newsletter snippet
     */
    generateNewsletterSnippet(content) {
        const snippet = `📖 Latest from the blog: ${content.title}\n\n${content.summary}\n\n💡 Key insight: ${content.quotes[0] || content.keyPoints[0]}\n\nRead more: ${content.url}`;
        
        return {
            content: snippet,
            wordCount: snippet.split(' ').length,
            placement: 'middle', // Where to place in newsletter
            category: this.categorizeContent(content)
        };
    }
    
    /**
     * Generate email subject lines
     */
    generateEmailSubject(content) {
        const subjects = [
            `🚀 ${this.extractKeyword(content.title)} for startups`,
            `💡 New guide: ${content.title}`,
            `🔧 ${this.extractActionablePhrase(content.title)}`,
            `📈 How to: ${this.simplifyTitle(content.title)}`,
            `⚡ Quick read: ${content.readingTime} on ${this.extractTopic(content.title)}`
        ];
        
        return {
            suggestions: subjects,
            recommended: subjects[0],
            abtestVariants: subjects.slice(0, 3)
        };
    }
    
    /**
     * Generate quotable images content
     */
    generateQuotableImages(content) {
        const quotes = content.quotes.length > 0 ? content.quotes : content.keyPoints;
        
        return quotes.slice(0, 3).map((quote, index) => ({
            text: this.formatQuoteForImage(quote),
            background: this.selectBackgroundStyle(index),
            branding: true,
            size: '1080x1080', // Instagram square
            platform: ['instagram', 'twitter', 'linkedin']
        }));
    }
    
    /**
     * Format content for Twitter
     */
    formatForTwitter(content, tweetNumber) {
        const maxLength = 250; // Leave room for thread indicator
        let formatted = content.length > maxLength ? 
            content.substring(0, maxLength - 3) + '...' : content;
        
        return `${tweetNumber}/🧵 ${formatted}`;
    }
    
    /**
     * Format hashtags for different platforms
     */
    formatHashtags(hashtags) {
        return hashtags.join(' ');
    }
    
    /**
     * Generate hook for social media posts
     */
    generateHook(title) {
        const hooks = [
            `Ever wondered how to ${this.extractAction(title)}?`,
            `Here's what I learned about ${this.extractTopic(title)}:`,
            `Quick thread on ${this.extractTopic(title)} 👇`,
            `${this.extractNumber(title)} things about ${this.extractTopic(title)}:`,
            `Let's talk about ${this.extractTopic(title)}.`
        ];
        
        return hooks[Math.floor(Math.random() * hooks.length)];
    }
    
    /**
     * Extract action verb from title
     */
    extractAction(title) {
        const actionWords = ['implement', 'build', 'setup', 'create', 'deploy', 'automate', 'scale', 'optimize'];
        const words = title.toLowerCase().split(' ');
        
        for (const action of actionWords) {
            if (words.some(word => word.includes(action))) {
                return action;
            }
        }
        
        return 'improve your DevOps';
    }
    
    /**
     * Extract main topic from title
     */
    extractTopic(title) {
        const topics = ['CI/CD', 'Kubernetes', 'Docker', 'monitoring', 'automation', 'infrastructure', 'DevOps'];
        const titleLower = title.toLowerCase();
        
        for (const topic of topics) {
            if (titleLower.includes(topic.toLowerCase())) {
                return topic;
            }
        }
        
        return 'DevOps automation';
    }
    
    /**
     * Extract numbers from title
     */
    extractNumber(title) {
        const numberMatch = title.match(/\d+/);
        return numberMatch ? numberMatch[0] : '5';
    }
    
    /**
     * Extract keyword from title
     */
    extractKeyword(title) {
        const keywords = title.split(' ').filter(word => 
            word.length > 4 && !['with', 'your', 'for'].includes(word.toLowerCase())
        );
        return keywords[0] || 'DevOps';
    }
    
    /**
     * Display distribution options to user
     */
    displayDistributionOptions(distributions) {
        // Create distribution panel if it doesn't exist
        let panel = document.getElementById('content-distribution-panel');
        if (!panel) {
            panel = this.createDistributionPanel();
            document.body.appendChild(panel);
        }
        
        this.populateDistributionPanel(panel, distributions);
    }
    
    /**
     * Create distribution panel UI
     */
    createDistributionPanel() {
        const panel = document.createElement('div');
        panel.id = 'content-distribution-panel';
        panel.className = 'distribution-panel';
        panel.innerHTML = `
            <div class="panel-header">
                <h3>📤 Content Distribution</h3>
                <button class="panel-close" onclick="this.closest('.distribution-panel').style.display='none'">×</button>
            </div>
            <div class="panel-content">
                <div class="platform-tabs">
                    <button class="tab-btn active" data-tab="twitter">Twitter</button>
                    <button class="tab-btn" data-tab="linkedin">LinkedIn</button>
                    <button class="tab-btn" data-tab="youtube">YouTube</button>
                    <button class="tab-btn" data-tab="newsletter">Newsletter</button>
                </div>
                <div class="tab-content"></div>
            </div>
        `;
        
        // Bind tab switching
        panel.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                panel.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.showTabContent(e.target.dataset.tab, distributions);
            });
        });
        
        return panel;
    }
    
    /**
     * Populate distribution panel with content
     */
    populateDistributionPanel(panel, distributions) {
        // Show Twitter tab by default
        this.showTabContent('twitter', distributions);
        panel.style.display = 'block';
    }
    
    /**
     * Show content for specific platform tab
     */
    showTabContent(platform, distributions) {
        const tabContent = document.querySelector('.distribution-panel .tab-content');
        if (!tabContent) return;
        
        const content = this.generateTabContent(platform, distributions);
        tabContent.innerHTML = content;
        
        // Bind copy buttons
        tabContent.querySelectorAll('.copy-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const textToCopy = e.target.dataset.content;
                this.copyToClipboard(textToCopy);
                e.target.textContent = 'Copied!';
                setTimeout(() => {
                    e.target.textContent = 'Copy';
                }, 2000);
            });
        });
    }
    
    /**
     * Generate tab content HTML
     */
    generateTabContent(platform, distributions) {
        switch (platform) {
            case 'twitter':
                return this.generateTwitterTabContent(distributions.twitterThread);
            case 'linkedin':
                return this.generateLinkedInTabContent(distributions.linkedinPost);
            case 'youtube':
                return this.generateYouTubeTabContent(distributions.youtubeDescription);
            case 'newsletter':
                return this.generateNewsletterTabContent(distributions.newsletterSnippet);
            default:
                return '<p>Platform content not available.</p>';
        }
    }
    
    /**
     * Generate Twitter tab content
     */
    generateTwitterTabContent(twitterContent) {
        return `
            <div class="platform-content">
                <div class="content-stats">
                    <span class="stat">📝 ${twitterContent.totalTweets} tweets</span>
                    <span class="stat">👥 Est. ${twitterContent.estimatedReach} reach</span>
                    <span class="stat">⏰ Best time: ${twitterContent.scheduledTime}</span>
                </div>
                
                <div class="thread-preview">
                    ${twitterContent.tweets.map((tweet, i) => `
                        <div class="tweet-preview">
                            <div class="tweet-header">Tweet ${i + 1}</div>
                            <div class="tweet-content">${tweet}</div>
                            <button class="copy-btn" data-content="${this.escapeHtml(tweet)}">Copy</button>
                        </div>
                    `).join('')}
                </div>
                
                <div class="action-buttons">
                    <button class="btn btn-primary" onclick="window.open('https://twitter.com/compose/tweet', '_blank')">Post to Twitter</button>
                    <button class="btn btn-outline" onclick="this.copyAllTweets()">Copy All Tweets</button>
                </div>
            </div>
        `;
    }
    
    /**
     * Generate LinkedIn tab content
     */
    generateLinkedInTabContent(linkedinContent) {
        return `
            <div class="platform-content">
                <div class="content-stats">
                    <span class="stat">📝 ${linkedinContent.wordCount} words</span>
                    <span class="stat">👥 Est. ${linkedinContent.estimatedReach} reach</span>
                    <span class="stat">⏰ Best time: ${linkedinContent.scheduledTime}</span>
                </div>
                
                <div class="post-preview">
                    <div class="post-content">${linkedinContent.content.replace(/\n/g, '<br>')}</div>
                    <button class="copy-btn" data-content="${this.escapeHtml(linkedinContent.content)}">Copy</button>
                </div>
                
                <div class="carousel-suggestions">
                    <h4>💡 Carousel Ideas:</h4>
                    ${linkedinContent.carouselImages ? linkedinContent.carouselImages.map(idea => `
                        <div class="carousel-idea">${idea}</div>
                    `).join('') : '<p>Generate carousel slides from key points</p>'}
                </div>
                
                <div class="action-buttons">
                    <button class="btn btn-primary" onclick="window.open('https://linkedin.com/feed/', '_blank')">Post to LinkedIn</button>
                </div>
            </div>
        `;
    }
    
    /**
     * Generate YouTube tab content
     */
    generateYouTubeTabContent(youtubeContent) {
        return `
            <div class="platform-content">
                <div class="video-suggestions">
                    <div class="suggestion-group">
                        <h4>📺 Video Title:</h4>
                        <div class="suggestion-item">
                            ${youtubeContent.suggestedTitle}
                            <button class="copy-btn" data-content="${this.escapeHtml(youtubeContent.suggestedTitle)}">Copy</button>
                        </div>
                    </div>
                    
                    <div class="suggestion-group">
                        <h4>📝 Description:</h4>
                        <div class="description-preview">${youtubeContent.content.replace(/\n/g, '<br>')}</div>
                        <button class="copy-btn" data-content="${this.escapeHtml(youtubeContent.content)}">Copy</button>
                    </div>
                    
                    <div class="suggestion-group">
                        <h4>🏷️ Tags:</h4>
                        <div class="tags">${youtubeContent.tags.join(', ')}</div>
                        <button class="copy-btn" data-content="${youtubeContent.tags.join(', ')}">Copy</button>
                    </div>
                    
                    <div class="suggestion-group">
                        <h4>🖼️ Thumbnail Ideas:</h4>
                        ${youtubeContent.thumbnailSuggestions ? youtubeContent.thumbnailSuggestions.map(idea => `
                            <div class="thumbnail-idea">${idea}</div>
                        `).join('') : '<p>Visual elements from the blog post</p>'}
                    </div>
                </div>
                
                <div class="action-buttons">
                    <button class="btn btn-primary" onclick="window.open('https://studio.youtube.com', '_blank')">Open YouTube Studio</button>
                </div>
            </div>
        `;
    }
    
    /**
     * Generate Newsletter tab content
     */
    generateNewsletterTabContent(newsletterContent) {
        return `
            <div class="platform-content">
                <div class="content-stats">
                    <span class="stat">📝 ${newsletterContent.wordCount} words</span>
                    <span class="stat">📊 Category: ${newsletterContent.category}</span>
                    <span class="stat">📍 Placement: ${newsletterContent.placement}</span>
                </div>
                
                <div class="newsletter-preview">
                    <h4>📧 Newsletter Snippet:</h4>
                    <div class="snippet-content">${newsletterContent.content.replace(/\n/g, '<br>')}</div>
                    <button class="copy-btn" data-content="${this.escapeHtml(newsletterContent.content)}">Copy</button>
                </div>
                
                <div class="action-buttons">
                    <button class="btn btn-primary" onclick="window.open('${this.config.newsletterUrl}', '_blank')">Open Substack</button>
                </div>
            </div>
        `;
    }
    
    /**
     * Copy text to clipboard
     */
    async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
        } catch (err) {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
        }
    }
    
    /**
     * Escape HTML for safe insertion
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    /**
     * Estimate Twitter reach
     */
    estimateTwitterReach(tweets) {
        const baseReach = 500; // Estimated follower count
        const engagementRate = 0.03; // 3% engagement rate
        const threadMultiplier = 1.5; // Threads get more engagement
        
        return Math.floor(baseReach * engagementRate * threadMultiplier * tweets.length);
    }
    
    /**
     * Estimate LinkedIn reach
     */
    estimateLinkedInReach(post) {
        const baseReach = 1000; // Professional network
        const engagementRate = 0.05; // Higher engagement on LinkedIn
        const contentQuality = post.length > 1000 ? 1.3 : 1.0; // Longer posts perform better
        
        return Math.floor(baseReach * engagementRate * contentQuality);
    }
    
    /**
     * Suggest optimal posting time
     */
    suggestOptimalPostTime(platform) {
        const times = {
            twitter: '9:00 AM EST (high engagement)',
            linkedin: '8:00 AM EST (business hours)',
            youtube: '2:00 PM EST (afternoon peak)',
            newsletter: 'Tuesday 10:00 AM EST'
        };
        
        return times[platform] || 'Morning hours';
    }
    
    /**
     * Add extraction buttons to blog posts
     */
    addExtractionButtons() {
        if (!this.isBlogPost()) return;
        
        const extractButton = document.createElement('button');
        extractButton.className = 'extract-content-btn';
        extractButton.innerHTML = '📤 Generate Social Content';
        extractButton.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: var(--primary-color);
            color: white;
            border: none;
            border-radius: 50px;
            padding: 12px 24px;
            font-weight: 600;
            cursor: pointer;
            z-index: 1000;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            transition: all 0.2s ease;
        `;
        
        extractButton.addEventListener('click', () => {
            this.extractBlogContent();
        });
        
        document.body.appendChild(extractButton);
    }
    
    /**
     * Bind distribution buttons
     */
    bindDistributionButtons() {
        // This method can be extended to bind buttons in the admin interface
    }
    
    /**
     * Initialize RSS feeds for automation
     */
    initializeRSSFeeds() {
        // This would set up RSS feed endpoints for Zapier integration
        this.rssFeeds = {
            blog: '/feed.xml',
            newsletter: '/newsletter-feed.xml',
            products: '/products-feed.xml'
        };
    }
    
    /**
     * Setup automation endpoints
     */
    setupAutomationEndpoints() {
        // These would be webhook endpoints for automation tools
        this.webhooks = {
            zapier: '/api/webhooks/zapier',
            ifttt: '/api/webhooks/ifttt',
            buffer: '/api/webhooks/buffer'
        };
    }
    
    // Additional utility methods...
    categorizeContent(content) {
        const title = content.title.toLowerCase();
        if (title.includes('tutorial') || title.includes('guide')) return 'Tutorial';
        if (title.includes('case study')) return 'Case Study';
        if (title.includes('tool') || title.includes('review')) return 'Tool Review';
        return 'Insight';
    }
    
    generateVideoTitle(blogTitle) {
        return `${blogTitle} | DevOps Tutorial for Startups`;
    }
    
    generateThumbnailIdeas(content) {
        return [
            'Split screen: Problem vs Solution',
            'Before/After comparison',
            'Step-by-step process diagram',
            'Key statistic with bold text',
            'Tool logos with vs. comparison'
        ];
    }
    
    generateCarouselContent(content) {
        return content.keyPoints.map((point, i) => `Slide ${i + 1}: ${point}`);
    }
    
    formatQuoteForImage(quote) {
        return quote.length > 100 ? quote.substring(0, 97) + '...' : quote;
    }
    
    selectBackgroundStyle(index) {
        const styles = ['gradient-blue', 'solid-dark', 'minimal-white'];
        return styles[index % styles.length];
    }
    
    extractActionablePhrase(title) {
        return title.replace(/^how to /i, '').replace(/^a guide to /i, '');
    }
    
    simplifyTitle(title) {
        return title.replace(/^.*: /, '').replace(/\| .*$/, '');
    }
}

// Add distribution panel styles
const distributionStyles = `
<style>
.distribution-panel {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 90%;
    max-width: 800px;
    max-height: 90vh;
    background: var(--background-light);
    border: 1px solid var(--border-color);
    border-radius: 16px;
    z-index: 10001;
    display: none;
    overflow: hidden;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.panel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem 2rem;
    border-bottom: 1px solid var(--border-color);
    background: var(--background-dark);
}

.panel-header h3 {
    margin: 0;
    color: var(--text-primary);
    font-size: 1.25rem;
}

.panel-close {
    background: none;
    border: none;
    font-size: 1.5rem;
    color: var(--text-secondary);
    cursor: pointer;
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
}

.panel-close:hover {
    background: var(--background-light);
    color: var(--text-primary);
}

.platform-tabs {
    display: flex;
    border-bottom: 1px solid var(--border-color);
    background: var(--background-dark);
}

.tab-btn {
    flex: 1;
    padding: 1rem;
    background: none;
    border: none;
    color: var(--text-secondary);
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    border-bottom: 2px solid transparent;
}

.tab-btn.active,
.tab-btn:hover {
    color: var(--text-primary);
    background: var(--background-light);
    border-bottom-color: var(--primary-color);
}

.tab-content {
    padding: 2rem;
    max-height: 60vh;
    overflow-y: auto;
}

.platform-content {
    color: var(--text-primary);
}

.content-stats {
    display: flex;
    gap: 1rem;
    margin-bottom: 1.5rem;
    flex-wrap: wrap;
}

.stat {
    background: var(--background-dark);
    padding: 0.5rem 1rem;
    border-radius: 8px;
    font-size: 0.875rem;
    color: var(--text-secondary);
}

.thread-preview,
.post-preview,
.newsletter-preview {
    margin-bottom: 1.5rem;
}

.tweet-preview {
    background: var(--background-dark);
    border: 1px solid var(--border-color);
    border-radius: 12px;
    padding: 1rem;
    margin-bottom: 1rem;
    position: relative;
}

.tweet-header {
    font-size: 0.875rem;
    color: var(--text-light);
    margin-bottom: 0.5rem;
    font-weight: 500;
}

.tweet-content {
    color: var(--text-primary);
    line-height: 1.5;
    margin-bottom: 0.5rem;
}

.copy-btn {
    background: var(--primary-color);
    color: white;
    border: none;
    border-radius: 6px;
    padding: 0.25rem 0.75rem;
    font-size: 0.75rem;
    cursor: pointer;
    transition: all 0.2s ease;
    margin-top: 0.5rem;
}

.copy-btn:hover {
    background: var(--primary-dark);
}

.post-content,
.description-preview,
.snippet-content {
    background: var(--background-dark);
    border: 1px solid var(--border-color);
    border-radius: 8px;
    padding: 1rem;
    color: var(--text-primary);
    line-height: 1.6;
    margin-bottom: 1rem;
}

.action-buttons {
    display: flex;
    gap: 1rem;
    margin-top: 1.5rem;
}

.suggestion-group {
    margin-bottom: 1.5rem;
}

.suggestion-group h4 {
    color: var(--text-primary);
    margin-bottom: 0.75rem;
    font-size: 1rem;
}

.suggestion-item {
    background: var(--background-dark);
    border: 1px solid var(--border-color);
    border-radius: 8px;
    padding: 1rem;
    color: var(--text-primary);
    position: relative;
}

.tags {
    color: var(--text-secondary);
    font-family: monospace;
    background: var(--background-dark);
    padding: 0.5rem;
    border-radius: 6px;
    margin-bottom: 0.5rem;
}

.carousel-idea,
.thumbnail-idea {
    background: var(--background-dark);
    border: 1px solid var(--border-color);
    border-radius: 6px;
    padding: 0.75rem;
    margin-bottom: 0.5rem;
    color: var(--text-secondary);
    font-size: 0.875rem;
}

.extract-content-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 25px rgba(0,0,0,0.4);
}

@media (max-width: 768px) {
    .distribution-panel {
        width: 95%;
        max-height: 95vh;
    }
    
    .panel-header {
        padding: 1rem;
    }
    
    .tab-content {
        padding: 1rem;
    }
    
    .content-stats {
        flex-direction: column;
        gap: 0.5rem;
    }
    
    .action-buttons {
        flex-direction: column;
    }
}
</style>
`;

// Inject styles
document.head.insertAdjacentHTML('beforeend', distributionStyles);

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.contentDistributionManager = new ContentDistributionManager();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ContentDistributionManager;
}