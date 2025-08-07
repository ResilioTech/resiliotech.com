const { DateTime } = require("luxon");
const htmlmin = require("html-minifier");
const bundlerPlugin = require("@11ty/eleventy-plugin-bundle");

module.exports = function(eleventyConfig) {
    // Plugins
    eleventyConfig.addPlugin(bundlerPlugin);

    // Copy static assets with versioning
    eleventyConfig.addPassthroughCopy({ "assets": "assets" });
    eleventyConfig.addPassthroughCopy({ "shared": "shared" });
    eleventyConfig.addPassthroughCopy({ "_headers": "_headers" });
    eleventyConfig.addPassthroughCopy({ "_redirects": "_redirects" });
    eleventyConfig.addPassthroughCopy({ "robots.txt": "robots.txt" });
    eleventyConfig.addPassthroughCopy({ "sitemap.xml": "sitemap.xml" });
    eleventyConfig.addPassthroughCopy({ "manifest.json": "manifest.json" });
    eleventyConfig.addPassthroughCopy({ "sw.js": "sw.js" });
    eleventyConfig.addPassthroughCopy({ "offline.html": "offline.html" });

    // Watch targets for development
    eleventyConfig.addWatchTarget("./assets/css/");
    eleventyConfig.addWatchTarget("./assets/js/");
    eleventyConfig.addWatchTarget("./shared/");

    // Filters
    eleventyConfig.addFilter("dateISO", (dateObj) => {
        return DateTime.fromJSDate(dateObj).toISODate();
    });

    eleventyConfig.addFilter("dateReadable", (dateObj) => {
        return DateTime.fromJSDate(dateObj).toLocaleString(DateTime.DATE_FULL);
    });

    // Add cache busting filter
    eleventyConfig.addFilter("cacheBust", function(url) {
        if (process.env.NODE_ENV === 'production') {
            const timestamp = Date.now();
            return `${url}?v=${timestamp}`;
        }
        return url;
    });

    // Add fingerprint filter for production
    eleventyConfig.addFilter("fingerprint", function(url) {
        if (process.env.NODE_ENV === 'production') {
            // This will be replaced by the fingerprinting script
            const manifestPath = './dist/assets-manifest.json';
            try {
                const manifest = require(manifestPath);
                return manifest[url] || url;
            } catch (e) {
                return url;
            }
        }
        return url;
    });

    // Shortcodes for reusable components
    eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);
    
    eleventyConfig.addShortcode("analytics", function(gaId, clarityId) {
        if (process.env.NODE_ENV === 'production') {
            return `
<!-- Google Analytics 4 with Enhanced Measurement -->
<script async src="https://www.googletagmanager.com/gtag/js?id=${gaId}"></script>
<script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${gaId}', {
        enhanced_measurement: true,
        page_title: true,
        send_page_view: true,
        custom_map: {
            'custom_parameter_1': 'startup_type',
            'custom_parameter_2': 'lead_source'
        }
    });
</script>

<!-- Microsoft Clarity -->
<script type="text/javascript">
    (function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", "${clarityId}");
</script>`;
        }
        return '<!-- Analytics disabled in development -->';
    });

    // Transform for HTML minification in production
    eleventyConfig.addTransform("htmlmin", function(content, outputPath) {
        if (process.env.NODE_ENV === 'production' && outputPath && outputPath.endsWith(".html")) {
            try {
                let minified = htmlmin.minify(content, {
                    useShortDoctype: true,
                    removeComments: true,
                    collapseWhitespace: true,
                    removeAttributeQuotes: false, // Disable to avoid parsing issues
                    removeEmptyAttributes: true,
                    minifyCSS: true,
                    minifyJS: true,
                    ignoreCustomFragments: [/<%[\s\S]*?%>/, /<\?[\s\S]*?\?>/]
                });
                return minified;
            } catch (error) {
                console.warn(`HTML minification failed for ${outputPath}: ${error.message}`);
                return content; // Return original content if minification fails
            }
        }
        return content;
    });

    // Collections for content organization
    eleventyConfig.addCollection("projects", function(collectionApi) {
        return collectionApi.getFilteredByGlob("src/projects/*.md").sort((a, b) => {
            return b.data.featured - a.data.featured || b.date - a.date;
        });
    });

    eleventyConfig.addCollection("resources", function(collectionApi) {
        return collectionApi.getFilteredByGlob("src/resources/*.md").sort((a, b) => {
            return b.data.featured - a.data.featured || b.date - a.date;
        });
    });

    eleventyConfig.addCollection("blog", function(collectionApi) {
        return collectionApi.getFilteredByGlob("src/blog/*.md").sort((a, b) => {
            return b.date - a.date;
        });
    });

    // Custom data processing
    eleventyConfig.addGlobalData("site", {
        title: "Resiliotech | DevOps Automation for Startups",
        description: "We automate tech ops for early-stage startups. Launch faster with resilient infrastructure, frictionless CI/CD, and observability—no full-time DevOps hire needed.",
        url: process.env.NODE_ENV === 'production' ? 'https://resiliotech.com' : 'http://localhost:8080',
        author: "Resiliotech",
        buildTime: new Date()
    });

    // Development server configuration
    eleventyConfig.setServerOptions({
        port: 8080,
        showAllHosts: true,
        https: false
    });

    return {
        templateFormats: ["md", "njk", "html", "liquid"],
        markdownTemplateEngine: "njk",
        htmlTemplateEngine: "njk",
        dataTemplateEngine: "njk",
        dir: {
            input: ".",
            output: "dist"
        }
    };
};
