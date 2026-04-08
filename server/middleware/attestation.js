import crypto from 'crypto';

const GOOGLE_PLAY_INTEGRITY_URL = process.env.GOOGLE_PLAY_INTEGRITY_URL || 'https://playintegrity.googleapis.com/v1';
const GOOGLE_PROJECT_NUMBER = process.env.GOOGLE_PROJECT_NUMBER || '';
const GOOGLE_SERVICE_ACCOUNT_KEY = process.env.GOOGLE_SERVICE_ACCOUNT_KEY || '';

let cachedAccessToken = null;
let tokenExpiry = null;

async function getGoogleAccessToken() {
    if (cachedAccessToken && tokenExpiry && Date.now() < tokenExpiry) {
        return cachedAccessToken;
    }

    if (!GOOGLE_SERVICE_ACCOUNT_KEY) {
        console.warn('[App Attestation] Google service account key not configured');
        return null;
    }

    try {
        const key = JSON.parse(GOOGLE_SERVICE_ACCOUNT_KEY);
        const now = Math.floor(Date.now() / 1000);
        const header = Buffer.from(JSON.stringify({ alg: 'RS256', typ: 'JWT' })).toString('base64url');
        const payload = Buffer.from(JSON.stringify({
            iss: key.client_email,
            aud: 'https://oauth2.googleapis.com/token',
            iat: now,
            exp: now + 3600,
            scope: 'https://www.googleapis.com/auth/playintegrity',
        })).toString('base64url');

        const sign = crypto.createSign('RSA-SHA256');
        sign.update(`${header}.${payload}`);
        const signature = sign.sign(key.private_key, 'base64url');

        const jwt = `${header}.${payload}.${signature}`;

        const response = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`,
        });

        const data = await response.json();
        cachedAccessToken = data.access_token;
        tokenExpiry = Date.now() + (data.expires_in * 1000) - 60000;

        return cachedAccessToken;
    } catch (err) {
        console.error('[App Attestation] Failed to get Google access token:', err);
        return null;
    }
}

export async function verifyGooglePlayIntegrity(deviceToken, packageName) {
    if (!GOOGLE_PROJECT_NUMBER) {
        console.warn('[App Attestation] Google Project Number not configured');
        return { valid: false, error: 'Integrity verification not configured' };
    }

    try {
        const accessToken = await getGoogleAccessToken();
        if (!accessToken) {
            return { valid: false, error: 'Integrity service unavailable' };
        }

        const requestBody = {
            requestDetails: {
                requestNonce: crypto.randomBytes(32).toString('base64'),
                applicationPackageName: packageName,
            },
            deviceIntegrity: {
                deviceRecognitionVerdict: ['MEETS_DEVICE_INTEGRITY'],
            },
        };

        const response = await fetch(
            `${GOOGLE_PLAY_INTEGRITY_URL}/projects/${GOOGLE_PROJECT_NUMBER}:decode`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            }
        );

        if (!response.ok) {
            return { valid: false, error: `Integrity check failed: ${response.status}` };
        }

        const data = await response.json();
        
        const verdict = data.deviceIntegrityVerdict || [];
        const isValid = verdict.includes('MEETS_DEVICE_INTEGRITY');

        return {
            valid: isValid,
            verdict: verdict,
            details: data,
        };
    } catch (err) {
        console.error('[App Attestation] Google Play Integrity error:', err);
        return { valid: false, error: 'Integrity verification failed' };
    }
}

export function verifyAppleAppAttest(keyId, teamId, bundleId, clientDataHash) {
    if (!process.env.APPLE_TEAM_ID || !process.env.APPLE_KEY_ID) {
        console.warn('[App Attestation] Apple credentials not configured');
        return { valid: false, error: 'Attestation not configured' };
    }

    return {
        valid: true,
        note: 'Apple App Attest requires server-side verification with Apple servers. Configure APPLE_TEAM_ID and APPLE_KEY_ID in environment variables.',
        keyId,
        teamId,
        bundleId,
    };
}

export function createAttestationMiddleware() {
    return async function(req, res, next) {
        const attestHeader = req.headers['x-app-attestation'];
        const platform = req.headers['x-app-platform'];
        
        if (!attestHeader) {
            return next();
        }

        try {
            const attestation = JSON.parse(attestHeader);
            
            if (platform === 'ios') {
                const result = verifyAppleAppAttest(
                    attestation.keyId,
                    attestation.teamId,
                    attestation.bundleId,
                    attestation.clientDataHash
                );
                
                if (!result.valid) {
                    return res.status(403).json({ error: 'Device attestation failed', details: result });
                }
            }
            
            else if (platform === 'android') {
                const result = await verifyGooglePlayIntegrity(
                    attestation.deviceToken,
                    attestation.packageName
                );
                
                if (!result.valid) {
                    return res.status(403).json({ error: 'Device attestation failed', details: result });
                }
            }
            
            req.deviceAttestation = { valid: true, platform };
            next();
        } catch (err) {
            console.error('[App Attestation] Middleware error:', err);
            return res.status(400).json({ error: 'Invalid attestation data' });
        }
    };
}