'use client';
import QuranReader from '@/components/QuranReader';
import ErrorBoundary from '@/components/ErrorBoundary';

export default function QuranReaderPage() {
    return (
        <ErrorBoundary>
            <QuranReader />
        </ErrorBoundary>
    );
}
