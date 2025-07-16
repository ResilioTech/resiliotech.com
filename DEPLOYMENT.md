# Deployment Guide for Resilio Tech Website

This guide covers various deployment options for the Resilio Tech website.

## 🚀 Quick Deployment Options

### 1. Netlify (Recommended)
1. Create account at [netlify.com](https://netlify.com)
2. Drag and drop your project folder to Netlify
3. Your site will be live instantly with a random URL
4. Configure custom domain in site settings

### 2. Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Navigate to project directory
3. Run: `vercel`
4. Follow the prompts

### 3. GitHub Pages
1. Push code to GitHub repository
2. Go to repository Settings > Pages
3. Select source branch (usually `main`)
4. Site will be available at `https://username.github.io/repository-name`

### 4. Traditional Web Hosting
1. Upload all files via FTP/SFTP to your web server
2. Ensure `index.html` is in the root directory
3. Configure domain DNS to point to your server

## 🔧 Pre-Deployment Checklist

### Content Updates
- [ ] Update company email addresses
- [ ] Replace placeholder blog links
- [ ] Add real social media links
- [ ] Update contact information
- [ ] Replace placeholder images if needed

### SEO Optimization
- [ ] Update meta descriptions for your target keywords
- [ ] Add Google Analytics tracking code
- [ ] Submit sitemap to Google Search Console
- [ ] Set up Google My Business (if applicable)

### Performance Optimization
- [ ] Enable gzip compression on server
- [ ] Set up CDN (Cloudflare recommended)
- [ ] Configure caching headers
- [ ] Optimize images for web

### Security
- [ ] Set up SSL certificate (usually automatic with modern hosts)
- [ ] Configure security headers
- [ ] Set up Content Security Policy (CSP)

## 📊 Analytics Setup

### Google Analytics 4
Add this to the `<head>` section of `index.html`:

```html
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### Google Search Console
1. Verify ownership of your domain
2. Submit your sitemap: `https://yourdomain.com/sitemap.xml`
3. Monitor search performance and indexing

## 🔄 Contact Form Backend

The contact form currently uses client-side simulation. For production:

### Option 1: Netlify Forms
Add `netlify` attribute to the form tag:
```html
<form class="contact-form" id="contact-form" netlify>
```

### Option 2: Formspree
1. Sign up at [formspree.io](https://formspree.io)
2. Update form action:
```html
<form action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
```

### Option 3: Custom Backend
Implement your own backend API and update the `handleFormSubmission` function in `main.js`.

## 🌐 Domain Configuration

### DNS Settings
Point your domain to your hosting provider:
- **A Record**: Point to your server's IP address
- **CNAME**: Point to your hosting provider's domain
- **MX Records**: Set up email if using custom domain email

### Email Setup
For professional email addresses (@resiliotech.com):
1. **Google Workspace**: Professional email with Gmail interface
2. **Microsoft 365**: Business email with Outlook
3. **ProtonMail**: Privacy-focused business email

## 📱 Mobile Testing

Before going live, test on various devices:
- [ ] iPhone (Safari)
- [ ] Android (Chrome)
- [ ] iPad (Safari)
- [ ] Desktop browsers (Chrome, Firefox, Safari, Edge)

## 🔧 Maintenance

### Regular Updates
- Update content regularly
- Monitor site performance
- Check for broken links
- Update dependencies if any are added
- Monitor analytics and adjust based on user behavior

### Backup Strategy
- Regular backups of the website files
- Version control with Git
- Database backups if dynamic features are added

## 📞 Support

For technical issues or questions about deployment:
- Check hosting provider documentation
- Review browser console for JavaScript errors
- Validate HTML and CSS
- Test forms and interactive features

---

**Ready to launch your bulletproof infrastructure consulting website!** 🚀
