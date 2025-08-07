# Microsoft Clarity Setup Guide

## Overview
Microsoft Clarity is now configured and ready to be activated on the Resiliotech website. This document explains how to complete the setup.

## Current Status
✅ **Code Implementation**: Complete
✅ **Environment Variables**: Configured
⏳ **Clarity Project**: Needs activation with real project ID

## Setup Steps

### 1. Create Microsoft Clarity Account
1. Go to [Microsoft Clarity](https://clarity.microsoft.com/)
2. Sign in with your Microsoft account (or create one)
3. Click "Get started" or "Create new project"

### 2. Create a New Project
1. Enter project details:
   - **Name**: Resiliotech
   - **Website URL**: https://resiliotech.com
   - **Category**: Professional Services / Technology
2. Click "Create"

### 3. Get Your Project ID
1. After creating the project, you'll see your Clarity setup code
2. Copy the Project ID (it looks like: `abcd1234ef`)
3. The Project ID is the string after `clarity("init", "YOUR_PROJECT_ID")`

### 4. Update Environment Variables
Update the `CLARITY_PROJECT_ID` in these locations:

#### Netlify Environment Variables (Recommended)
1. Go to Netlify Dashboard > Site Settings > Environment Variables
2. Edit `CLARITY_PROJECT_ID` from `sr1y78mww9` to your actual Project ID

#### Or update netlify.toml
Replace `sr1y78mww9` with your actual Project ID in:
- Line 12: `CLARITY_PROJECT_ID = "YOUR_ACTUAL_PROJECT_ID"`
- Line 140: `CLARITY_PROJECT_ID = "YOUR_ACTUAL_PROJECT_ID"`
- Line 145: `CLARITY_PROJECT_ID = "YOUR_ACTUAL_PROJECT_ID"`
- Line 150: `CLARITY_PROJECT_ID = "YOUR_ACTUAL_PROJECT_ID"`

### 5. Deploy and Verify
1. Commit and push changes to trigger a new Netlify deployment
2. Visit your live site at https://resiliotech.com
3. Check Microsoft Clarity dashboard for incoming data (may take 5-10 minutes)

## What Clarity Will Track

Once activated, Microsoft Clarity will automatically capture:

### 📊 **User Sessions**
- Complete user session recordings
- Mouse movements, clicks, scrolls
- Form interactions
- Page navigation

### 🔥 **Heatmaps**
- Click heatmaps showing where users click most
- Scroll heatmaps showing how far users scroll
- Area attention maps

### 📈 **Analytics**
- Page performance metrics
- User engagement patterns
- Conversion funnel analysis
- Dead clicks and rage clicks

### 🎯 **User Insights**
- Traffic sources breakdown
- Device and browser analytics
- Geographic user distribution
- Session duration and bounce rates

## Privacy & Compliance

Microsoft Clarity is GDPR and privacy-compliant:
- ✅ No personally identifiable information (PII) is collected
- ✅ IP addresses are masked
- ✅ Text in form fields is automatically masked
- ✅ Sensitive elements can be hidden with CSS classes
- ✅ Data is stored securely by Microsoft

## Current Configuration

The implementation includes:
- **DNS Prefetch**: Optimized loading for clarity.ms
- **Content Security Policy**: Whitelisted clarity.ms domains
- **Async Loading**: Non-blocking script implementation
- **Environment Variables**: Clean separation of config from code

## Quick Test
After deployment, you can verify Clarity is working by:
1. Open browser developer tools (F12)
2. Go to Network tab
3. Visit your site
4. Look for requests to `clarity.ms/tag/[YOUR_PROJECT_ID]`
5. Check Clarity dashboard after 5-10 minutes

## Support
- [Microsoft Clarity Documentation](https://docs.microsoft.com/en-us/clarity/)
- [Setup Troubleshooting](https://docs.microsoft.com/en-us/clarity/setup-and-installation/clarity-setup)
- [Privacy & Compliance](https://docs.microsoft.com/en-us/clarity/setup-and-installation/privacy-and-compliance)
