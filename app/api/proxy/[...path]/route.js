import { NextResponse } from 'next/server';
import crypto from 'crypto';

const API_SECRET = process.env.API_SECRET || 'rushd-app-secret-change-this-in-production';
// Server-side base URL for the internal API (`/api/v1`).
// IMPORTANT: Do not rely on NEXT_PUBLIC_* here (those are meant for client bundles).
const BACKEND_URL = process.env.API_BASE_URL || process.env.API_URL || '';

const rateLimitMap = new Map();
const RATE_LIMIT = 30;
const WINDOW_MS = 60000;

function getClientIP(request) {
    return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
        || request.headers.get('cf-connecting-ip')
        || request.headers.get('x-real-ip')
        || 'unknown';
}

function getBackendOrigin(request) {
    // Default to same-origin, which works when `/api/v1` is served by the same node process
    // (e.g., via `server/index.js`).
    const origin = new URL(request.url).origin;
    return BACKEND_URL || origin;
}

function checkRateLimit(ip) {
    const now = Date.now();
    const record = rateLimitMap.get(ip) || { count: 0, windowStart: now };
    
    if (now - record.windowStart > WINDOW_MS) {
        record.count = 1;
        record.windowStart = now;
    } else {
        record.count++;
    }
    
    rateLimitMap.set(ip, record);
    return record.count <= RATE_LIMIT;
}

function generateHMAC() {
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const signature = crypto
        .createHmac('sha256', API_SECRET)
        .update(timestamp)
        .digest('hex');
    return { token: signature, timestamp };
}

async function proxyRequest(request, path) {
    const clientIP = getClientIP(request);
    
    if (!checkRateLimit(clientIP)) {
        return NextResponse.json(
            { error: 'Rate limit exceeded. Max 30 requests per minute.' },
            { status: 429 }
        );
    }

    try {
        const { token, timestamp } = generateHMAC();
        
        const base = getBackendOrigin(request);
        const url = new URL(`${base}/api/v1${path}`);
        
        const searchParams = new URL(request.url).searchParams;
        for (const [key, value] of searchParams) {
            if (key.startsWith('__') || key === 'ts' || key === 'token') continue;
            url.searchParams.append(key, value);
        }

        const response = await fetch(url.toString(), {
            method: request.method,
            headers: {
                'X-App-Token': token,
                'X-App-Ts': timestamp,
                'Content-Type': 'application/json',
            },
            cache: 'no-store',
        });

        const contentType = response.headers.get('content-type') || '';
        const isJson = contentType.includes('application/json');

        if (!response.ok) {
            const errorData = isJson
                ? await response.json().catch(() => ({ error: 'Request failed' }))
                : { error: 'Request failed', status: response.status };
            return NextResponse.json(errorData, { status: response.status });
        }

        if (!isJson) {
            const text = await response.text().catch(() => '');
            return NextResponse.json(
                {
                    error: 'Unexpected response format',
                    hint: 'Backend did not return JSON. Is /api/v1 running in production?',
                    sample: text.slice(0, 300),
                },
                { status: 502 },
            );
        }

        return NextResponse.json(await response.json());
    } catch (error) {
        return NextResponse.json(
            { error: 'Backend service unavailable', details: error?.message || String(error) },
            { status: 503 }
        );
    }
}

export async function GET(request, { params }) {
    const { path } = await params;
    const pathStr = `/${path.join('/')}`;
    return proxyRequest(request, pathStr);
}

export async function POST(request, { params }) {
    const { path } = await params;
    const pathStr = `/${path.join('/')}`;
    return proxyRequest(request, pathStr);
}
