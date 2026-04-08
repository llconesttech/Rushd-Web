'use client';

import { Component } from 'react';

export default class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('ErrorBoundary caught:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{ padding: '2rem', textAlign: 'center' }}>
                    <h2>Something went wrong</h2>
                    <p>{this.state.error?.message}</p>
                    <button 
                        onClick={() => this.setState({ hasError: false, error: null })}
                        style={{ padding: '0.5rem 1rem', marginTop: '1rem', cursor: 'pointer' }}
                    >
                        Try Again
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}