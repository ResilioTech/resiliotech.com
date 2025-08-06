/**
 * Social Sharing Manager for Resiliotech
 * Handles social media sharing functionality across the site
 */

class SocialSharingManager {
    constructor() {
        this.config = {
            baseUrl: window.location.origin,
            twitterHandle: '@resiliotech',
            linkedinCompany: 'resiliotech',
            defaultHashtags: ['DevOps', 'StartupTech', 'Automation', 'Infrastructure']
        };
        
        this.init();
    }
    
    init() {
        this.bindShareButtons();
        this.generateShareUrls();
        this.trackSocialClicks();
    }
    
    /**
     * Bind click handlers to share buttons
     */
    bindShareButtons() {
        document.addEventListener('click', (e) => {
            if (e.target.closest('[data-share]')) {
                e.preventDefault();
                const shareBtn = e.target.closest('[data-share]');
                const platform = shareBtn.dataset.share;
                const url = shareBtn.dataset.url || window.location.href;
                const title = shareBtn.dataset.title || document.title;
                const text = shareBtn.dataset.text || this.getPageDescription();
                
                this.share(platform, { url, title, text });
            }
        });
    }
    
    /**
     * Share content on specified platform
     * @param {string} platform - Social media platform
     * @param {Object} content - Content to share
     */
    share(platform, content) {
        const shareUrls = {
            twitter: this.generateTwitterUrl(content),
            linkedin: this.generateLinkedInUrl(content),
            facebook: this.generateFacebookUrl(content),
            reddit: this.generateRedditUrl(content),
            hackernews: this.generateHackerNewsUrl(content),
            copy: null // Special case for copy link
        };
        
        if (platform === 'copy') {
            this.copyToClipboard(content.url);
            return;
        }
        
        const shareUrl = shareUrls[platform];
        if (shareUrl) {
            this.openShareWindow(shareUrl, platform);
            this.trackShare(platform, content);
        }
    }
    
    /**
     * Generate Twitter share URL
     */
    generateTwitterUrl({ url, title, text }) {
        const tweetText = this.formatTweetText(title, text);
        const hashtags = this.config.defaultHashtags.join(',');
        
        const params = new URLSearchParams({
            text: tweetText,
            url: url,
            hashtags: hashtags,
            via: this.config.twitterHandle.replace('@', '')
        });
        
        return `https://twitter.com/intent/tweet?${params.toString()}`;
    }
    
    /**
     * Generate LinkedIn share URL
     */
    generateLinkedInUrl({ url, title, text }) {
        const params = new URLSearchParams({
            url: url,
            title: title,
            summary: text,
            source: 'Resiliotech'
        });
        
        return `https://www.linkedin.com/sharing/share-offsite/?${params.toString()}`;
    }
    
    /**
     * Generate Facebook share URL
     */
    generateFacebookUrl({ url, title }) {
        const params = new URLSearchParams({
            u: url,
            quote: title
        });
        
        return `https://www.facebook.com/sharer/sharer.php?${params.toString()}`;
    }
    
    /**
     * Generate Reddit share URL
     */
    generateRedditUrl({ url, title }) {
        const params = new URLSearchParams({
            url: url,
            title: title
        });
        
        return `https://reddit.com/submit?${params.toString()}`;
    }
    
    /**
     * Generate Hacker News share URL
     */
    generateHackerNewsUrl({ url, title }) {
        const params = new URLSearchParams({
            u: url,
            t: title
        });
        
        return `https://news.ycombinator.com/submitlink?${params.toString()}`;
    }
    
    /**
     * Format text for Twitter character limit
     */
    formatTweetText(title, text) {
        const maxLength = 240; // Leave room for URL and hashtags
        
        if (title.length <= maxLength) {
            return title;
        }
        
        // Try to use text if title is too long
        if (text && text.length <= maxLength) {
            return text;
        }
        
        // Truncate title
        return title.substring(0, maxLength - 3) + '...';
    }
    
    /**
     * Open share window
     */
    openShareWindow(url, platform) {
        const windowFeatures = 'width=600,height=400,scrollbars=yes,resizable=yes';
        window.open(url, `share-${platform}`, windowFeatures);
    }
    
    /**
     * Copy URL to clipboard
     */
    async copyToClipboard(url) {
        try {
            await navigator.clipboard.writeText(url);
            this.showCopyFeedback();
        } catch (err) {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = url;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            this.showCopyFeedback();
        }
    }
    
    /**
     * Show copy feedback to user
     */
    showCopyFeedback() {
        // Create temporary notification
        const notification = document.createElement('div');
        notification.className = 'copy-notification';
        notification.textContent = 'Link copied to clipboard!';
        notification.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: var(--primary-color);
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 500;
            z-index: 10000;
            animation: slideInUp 0.3s ease, slideOutDown 0.3s ease 2.7s;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 3000);
    }
    
    /**
     * Track social sharing events
     */
    trackShare(platform, content) {
        // Track with analytics
        if (window.analyticsManager) {
            window.analyticsManager.trackEvent('social_share', {
                platform: platform,
                url: content.url,
                title: content.title,
                source: 'share_button'
            });
        }
        
        // Track with GTM
        if (window.dataLayer) {
            window.dataLayer.push({
                event: 'social_share',
                social_platform: platform,
                share_url: content.url,
                share_title: content.title
            });
        }
        
        console.log(`Shared on ${platform}:`, content);
    }
    
    /**
     * Track social media button clicks
     */
    trackSocialClicks() {
        document.addEventListener('click', (e) => {
            const socialLink = e.target.closest('.social-link');
            if (socialLink) {
                const platform = this.getSocialPlatformFromUrl(socialLink.href);
                
                if (window.analyticsManager) {
                    window.analyticsManager.trackEvent('social_follow', {
                        platform: platform,
                        source: 'footer'
                    });
                }
            }
        });
    }
    
    /**
     * Get social platform name from URL
     */
    getSocialPlatformFromUrl(url) {
        if (url.includes('linkedin')) return 'linkedin';
        if (url.includes('twitter') || url.includes('x.com')) return 'twitter';
        if (url.includes('youtube')) return 'youtube';
        if (url.includes('substack')) return 'newsletter';
        if (url.includes('facebook')) return 'facebook';
        return 'unknown';
    }
    
    /**
     * Get page description for sharing
     */
    getPageDescription() {
        const metaDesc = document.querySelector('meta[name="description"]');
        return metaDesc ? metaDesc.content : 'DevOps automation for fast-moving startups';
    }
    
    /**
     * Generate share buttons HTML
     */
    generateShareButtons(options = {}) {
        const { 
            url = window.location.href, 
            title = document.title, 
            text = this.getPageDescription(),
            platforms = ['twitter', 'linkedin', 'facebook', 'copy'],
            className = 'social-share-buttons'
        } = options;
        
        const buttonIcons = {
            twitter: `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/></svg>`,
            linkedin: `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>`,
            facebook: `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>`,
            copy: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>`
        };
        
        const platformLabels = {
            twitter: 'Share on X',
            linkedin: 'Share on LinkedIn',  
            facebook: 'Share on Facebook',
            copy: 'Copy Link'
        };
        
        const buttons = platforms.map(platform => `
            <button 
                class="share-btn share-btn-${platform}" 
                data-share="${platform}"
                data-url="${url}"
                data-title="${title}"
                data-text="${text}"
                aria-label="${platformLabels[platform]}"
                title="${platformLabels[platform]}"
            >
                ${buttonIcons[platform]}
                <span class="share-label">${platformLabels[platform].replace('Share on ', '').replace('Copy ', '')}</span>
            </button>
        `).join('');
        
        return `<div class="${className}">${buttons}</div>`;
    }
    
    /**
     * Insert share buttons into specified container
     */
    insertShareButtons(containerId, options = {}) {
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = this.generateShareButtons(options);
        }
    }
    
    /**
     * Auto-generate Twitter thread from blog post content
     */
    generateTwitterThread(content) {
        const maxTweetLength = 280;
        const tweets = [];
        
        // Split content into sentences
        const sentences = content.split(/[.!?]+/).filter(s => s.trim());
        let currentTweet = '';
        let tweetNumber = 1;
        
        sentences.forEach(sentence => {
            const trimmedSentence = sentence.trim();
            if (!trimmedSentence) return;
            
            const potentialTweet = currentTweet + (currentTweet ? '. ' : '') + trimmedSentence;
            const threadIndicator = tweetNumber > 1 ? `${tweetNumber}/🧵 ` : '';
            
            if ((potentialTweet + threadIndicator).length <= maxTweetLength) {
                currentTweet = potentialTweet;
            } else {
                // Finish current tweet
                if (currentTweet) {
                    tweets.push(`${tweetNumber > 1 ? `${tweetNumber}/🧵 ` : ''}${currentTweet}.`);
                    tweetNumber++;
                }
                
                // Start new tweet
                currentTweet = trimmedSentence;
            }
        });
        
        // Add final tweet
        if (currentTweet) {
            tweets.push(`${tweetNumber > 1 ? `${tweetNumber}/🧵 ` : ''}${currentTweet}.`);
        }
        
        return tweets;
    }
}

// Add CSS for share buttons and notifications
const shareButtonStyles = `
<style>
.social-share-buttons {
    display: flex;
    gap: var(--spacing-3, 12px);
    flex-wrap: wrap;
    margin: var(--spacing-4, 16px) 0;
}

.share-btn {
    display: flex;
    align-items: center;
    gap: var(--spacing-2, 8px);
    padding: var(--spacing-2, 8px) var(--spacing-3, 12px);
    background: var(--background-light, #1a1a1a);
    border: 1px solid var(--border-color, #27272a);
    border-radius: var(--border-radius, 8px);
    color: var(--text-secondary, #a1a1aa);
    font-size: var(--font-size-sm, 0.875rem);
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    text-decoration: none;
}

.share-btn:hover {
    background: var(--primary-color, #6366f1);
    color: white;
    border-color: var(--primary-color, #6366f1);
    transform: translateY(-1px);
}

.share-btn svg {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
}

.share-label {
    display: none;
}

@media (min-width: 768px) {
    .share-label {
        display: inline;
    }
}

@keyframes slideInUp {
    from {
        transform: translateY(100%);
        opacity: 0;
    }
    to {
        transform: translateY(0);
        opacity: 1;
    }
}

@keyframes slideOutDown {
    from {
        transform: translateY(0);
        opacity: 1;
    }
    to {
        transform: translateY(100%);
        opacity: 0;
    }
}
</style>
`;

// Inject styles
document.head.insertAdjacentHTML('beforeend', shareButtonStyles);

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.socialSharingManager = new SocialSharingManager();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SocialSharingManager;
}