import { NextResponse } from 'next/server';
import crypto from 'crypto';

const API_SECRET = process.env.API_SECRET || 'rushd-app-secret-change-this-in-production';
const MOBILE_API_KEYS = (process.env.MOBILE_API_KEYS || '').split(',').filter(Boolean);
const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

const RATE_LIMIT = 30;
const WINDOW_MS = 60000;
const TOKEN_WINDOW = 60;

const mobileRateLimitMap = new Map();

function getClientIP(request) {
    return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() 
        || request.headers.get('cf-connecting-ip')
        || request.headers.get('x-real-ip')
        || 'unknown';
}

function checkMobileRateLimit(ip) {
    const now = Date.now();
    const record = mobileRateLimitMap.get(ip) || { count: 0, windowStart: now };
    
    if (now - record.windowStart > WINDOW_MS) {
        record.count = 1;
        record.windowStart = now;
    } else {
        record.count++;
    }
    
    mobileRateLimitMap.set(ip, record);
    return record.count <= RATE_LIMIT;
}

async function validateMobileAuth(request) {
    const apiKey = request.headers.get('x-api-key');
    
    if (apiKey && MOBILE_API_KEYS.includes(apiKey)) {
        return { valid: true, clientType: 'mobile' };
    }
    
    const token = request.headers.get('x-app-token');
    const timestamp = request.headers.get('x-app-ts');
    
    if (!token || !timestamp) {
        return { valid: false, error: 'Forbidden: Missing credentials' };
    }
    
    const now = Math.floor(Date.now() / 1000);
    const ts = parseInt(timestamp, 10);
    
    if (Math.abs(now - ts) > TOKEN_WINDOW) {
        return { valid: false, error: 'Token expired' };
    }
    
    const expected = crypto
        .createHmac('sha256', API_SECRET)
        .update(`${ts}`)
        .digest('hex');
    
    if (token !== expected) {
        return { valid: false, error: 'Invalid token' };
    }
    
    return { valid: true, clientType: 'web' };
}

export async function GET(request, { params }) {
    const { path } = await params;
    const pathStr = `/${path.join('/')}`;
    
    const clientIP = getClientIP(request);
    
    if (!checkMobileRateLimit(clientIP)) {
        return NextResponse.json(
            { error: 'Rate limit exceeded. Max 30 requests per minute.' },
            { status: 429 }
        );
    }
    
    const auth = await validateMobileAuth(request);
    if (!auth.valid) {
        return NextResponse.json({ error: auth.error }, { status: 403 });
    }
    
    const url = new URL(`${BACKEND_URL}/api/v1${pathStr}`);
    request.nextUrl.searchParams.forEach((value, key) => {
        url.searchParams.append(key, value);
    });
    
    try {
        const response = await fetch(url.toString(), {
            headers: {
                'X-API-Key': request.headers.get('x-api-key') || '',
                'X-App-Token': request.headers.get('x-app-token') || '',
                'X-App-Ts': request.headers.get('x-app-ts') || '',
            },
        });
        
        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        console.error('[Mobile API Error]', error);
        return NextResponse.json(
            { error: 'Backend service unavailable' },
            { status: 503 }
        );
    }
}

export async function POST(request, { params }) {
    const { path } = await params;
    const pathStr = `/${path.join('/')}`;
    
    const clientIP = getClientIP(request);
    
    if (!checkMobileRateLimit(clientIP)) {
        return NextResponse.json(
            { error: 'Rate limit exceeded. Max 30 requests per minute.' },
            { status: 429 }
        );
    }
    
    const auth = await validateMobileAuth(request);
    if (!auth.valid) {
        return NextResponse.json({ error: auth.error }, { status: 403 });
    }
    
    const url = new URL(`${BACKEND_URL}/api/v1${pathStr}`);
    
    try {
        const body = await request.text();
        
        const response = await fetch(url.toString(), {
            method: 'POST',
            headers: {
                'X-API-Key': request.headers.get('x-api-key') || '',
                'X-App-Token': request.headers.get('x-app-token') || '',
                'X-App-Ts': request.headers.get('x-app-ts') || '',
                'Content-Type': 'application/json',
            },
            body,
        });
        
        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        console.error('[Mobile API Error]', error);
        return NextResponse.json(
            { error: 'Backend service unavailable' },
            { status: 503 }
        );
    }
}