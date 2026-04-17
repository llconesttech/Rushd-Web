import { NextResponse } from 'next/server';
import crypto from 'crypto';

const API_SECRET = process.env.API_SECRET || 'rushd-app-secret-change-this-in-production';
const BACKEND_URL = process.env.API_BASE_URL || process.env.API_URL || '';

function getBackendOrigin(request) {
    const origin = new URL(request.url).origin;
    return BACKEND_URL || origin;
}

function generateHMAC() {
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const signature = crypto
        .createHmac('sha256', API_SECRET)
        .update(timestamp)
        .digest('hex');
    return { token: signature, timestamp };
}

async function handleRequest(request, path, queryParams = {}) {
    try {
        const { token, timestamp } = generateHMAC();
        
        const base = getBackendOrigin(request);
        const url = new URL(`${base}/api/v1${path}`);
        Object.entries(queryParams).forEach(([key, value]) => {
            if (value) url.searchParams.append(key, value);
        });

        const response = await fetch(url.toString(), {
            method: request.method,
            headers: {
                'X-App-Token': token,
                'X-App-Ts': timestamp,
                'Content-Type': 'application/json',
            },
            body: request.method !== 'GET' && request.method !== 'HEAD' ? await request.text() : undefined,
            cache: 'no-store',
        });

        const contentType = response.headers.get('content-type') || '';
        const isJson = contentType.includes('application/json');
        const data = isJson ? await response.json().catch(() => null) : null;
        if (data) return NextResponse.json(data, { status: response.status });
        const text = await response.text().catch(() => '');
        return NextResponse.json(
            {
                error: 'Unexpected backend response',
                status: response.status,
                hint: 'Is /api/v1 running in production?',
                sample: text.slice(0, 300),
            },
            { status: response.status >= 400 ? response.status : 502 },
        );
    } catch (error) {
        console.error('[BFF Error]', error);
        return NextResponse.json(
            { error: 'Backend service unavailable' },
            { status: 503 }
        );
    }
}

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const path = searchParams.get('path') || '/';
    const queryParams = {};
    
    for (const [key, value] of searchParams) {
        if (key !== 'path') queryParams[key] = value;
    }

    return handleRequest(request, path, queryParams);
}

export async function POST(request) {
    const { searchParams } = new URL(request.url);
    const path = searchParams.get('path') || '/';
    const queryParams = {};
    
    for (const [key, value] of searchParams) {
        if (key !== 'path') queryParams[key] = value;
    }

    return handleRequest(request, path, queryParams);
}