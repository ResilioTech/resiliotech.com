# reCAPTCHA v3 Setup Instructions

## Overview
reCAPTCHA v3 has been integrated into all lead forms to prevent bot submissions while maintaining a smooth user experience.

## Setup Steps

### 1. Get reCAPTCHA Keys
1. Visit [Google reCAPTCHA Admin Console](https://www.google.com/recaptcha/admin)
2. Click "+" to create a new site
3. Configure:
   - **Label**: Resiliotech Website
   - **reCAPTCHA type**: reCAPTCHA v3
   - **Domains**: Add your domain(s) - resiliotech.com, www.resiliotech.com
4. Accept terms and submit
5. Copy the **Site Key** and **Secret Key**

### 2. Update Site Key
Replace `6LcYourSiteKeyHere` in the following files with your actual Site Key:

**Files to update:**
- `index.html` (line with reCAPTCHA script tag)
- `assets/js/crm-integration.js` (in the executeRecaptcha method)

### 3. Backend Integration
Add server-side verification to your form handlers:

```javascript
// Example Node.js verification
const fetch = require('node-fetch');

async function verifyRecaptcha(token, expectedAction) {
    const secretKey = 'YOUR_SECRET_KEY'; // Store securely
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `secret=${secretKey}&response=${token}`
    });
    
    const data = await response.json();
    
    return data.success && 
           data.action === expectedAction && 
           data.score >= 0.5; // Adjust threshold as needed
}
```

### 4. Form Actions
The integration uses these action names:
- `newsletter_signup` - Newsletter subscription forms
- `contact_form` - Contact/consultation forms

### 5. Testing
1. Test forms on localhost (reCAPTCHA works on localhost)
2. Monitor the reCAPTCHA admin console for:
   - Request volume
   - Score distribution
   - Potential bot traffic

### 6. Score Thresholds
- **0.9-1.0**: Very likely human
- **0.7-0.9**: Likely human  
- **0.5-0.7**: Suspicious (recommended threshold)
- **0.1-0.5**: Likely bot
- **0.0-0.1**: Very likely bot

Adjust the threshold in your backend based on your tolerance for false positives.

## Benefits
- ✅ Invisible to users (no challenge required)
- ✅ Continuous bot protection
- ✅ Advanced risk analysis
- ✅ Detailed reporting and analytics
- ✅ No impact on conversion rates
