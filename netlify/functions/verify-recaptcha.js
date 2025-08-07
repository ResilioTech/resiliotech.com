/**
 * Netlify Function for reCAPTCHA v3 Verification
 * Verifies reCAPTCHA tokens before processing form submissions
 */

const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY || '6Ld9bp0rAAAAAE-k05wVOvdMd_R1VNM-CFRkv2dG';
const MIN_SCORE = 0.5; // Minimum score for human verification (0.0 = bot, 1.0 = human)

exports.handler = async (event, context) => {
    // Handle CORS for browser requests
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
    };

    // Handle preflight requests
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: '',
        };
    }

    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Method not allowed' }),
        };
    }

    try {
        const { token, action, expectedAction } = JSON.parse(event.body);

        // Validate required parameters
        if (!token) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ 
                    success: false, 
                    error: 'reCAPTCHA token is required' 
                }),
            };
        }

        // Verify token with Google reCAPTCHA API
        const verificationResponse = await fetch('https://www.google.com/recaptcha/api/siteverify', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                secret: RECAPTCHA_SECRET_KEY,
                response: token,
                remoteip: event.headers['x-forwarded-for'] || event.headers['client-ip'],
            }),
        });

        const verificationResult = await verificationResponse.json();

        // Check verification result
        if (!verificationResult.success) {
            console.error('reCAPTCHA verification failed:', verificationResult['error-codes']);
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({
                    success: false,
                    error: 'reCAPTCHA verification failed',
                    details: verificationResult['error-codes'],
                }),
            };
        }

        // Check action if provided
        if (expectedAction && verificationResult.action !== expectedAction) {
            console.error(`Action mismatch: expected ${expectedAction}, got ${verificationResult.action}`);
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({
                    success: false,
                    error: 'Action verification failed',
                }),
            };
        }

        // Check score (reCAPTCHA v3)
        if (verificationResult.score < MIN_SCORE) {
            console.warn(`Low reCAPTCHA score: ${verificationResult.score} (minimum: ${MIN_SCORE})`);
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({
                    success: false,
                    error: 'Security verification failed',
                    score: verificationResult.score,
                }),
            };
        }

        // Success response
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                score: verificationResult.score,
                action: verificationResult.action,
                challenge_ts: verificationResult.challenge_ts,
                hostname: verificationResult.hostname,
            }),
        };

    } catch (error) {
        console.error('reCAPTCHA verification error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                success: false,
                error: 'Internal server error',
            }),
        };
    }
};
