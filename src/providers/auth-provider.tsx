'use client';

import { Auth0Provider, useAuth0 } from '@auth0/auth0-react';
import { ReactNode, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface AuthProviderProps {
    children: ReactNode;
}

// Inner component that uses Auth0 hooks
function AuthGuard({ children }: { children: ReactNode }) {
    const { isAuthenticated, isLoading, error, logout } = useAuth0();
    const router = useRouter();
    const pathname = usePathname();

    // Handle auth errors - logout and redirect to login
    useEffect(() => {
        if (error) {
            console.error('Auth0 error:', error.message);
            // Clear any stale state and redirect to login
            logout({ logoutParams: { returnTo: window.location.origin + '/login' } });
        }
    }, [error, logout]);

    // Redirect to login if not authenticated and not on login page
    useEffect(() => {
        if (!isLoading && !isAuthenticated && pathname !== '/login') {
            router.push('/login');
        }
    }, [isLoading, isAuthenticated, pathname, router]);

    // Show loading while checking auth
    if (isLoading) {
        return (
            <div className="loading-page">
                <div className="spinner spinner-lg" />
                <span>Loading...</span>
            </div>
        );
    }

    // If not on login page and not authenticated, show nothing (will redirect)
    if (!isAuthenticated && pathname !== '/login') {
        return (
            <div className="loading-page">
                <div className="spinner spinner-lg" />
                <span>Redirecting to login...</span>
            </div>
        );
    }

    return <>{children}</>;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const domain = process.env.NEXT_PUBLIC_AUTH0_DOMAIN;
    const clientId = process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID;
    const audience = process.env.NEXT_PUBLIC_AUTH0_AUDIENCE;

    // If Auth0 not configured, show error
    if (!domain || !clientId) {
        return (
            <div className="loading-page">
                <div style={{
                    background: 'var(--bg-card)',
                    padding: 'var(--space-6)',
                    borderRadius: 'var(--radius-lg)',
                    textAlign: 'center',
                    maxWidth: '400px'
                }}>
                    <h2 style={{ color: 'var(--accent-danger)', marginBottom: 'var(--space-4)' }}>
                        Configuration Error
                    </h2>
                    <p style={{ color: 'var(--text-secondary)' }}>
                        Auth0 is not configured. Please set NEXT_PUBLIC_AUTH0_DOMAIN and NEXT_PUBLIC_AUTH0_CLIENT_ID.
                    </p>
                </div>
            </div>
        );
    }

    const redirectUri = typeof window !== 'undefined' ? window.location.origin : '';

    return (
        <Auth0Provider
            domain={domain}
            clientId={clientId}
            authorizationParams={{
                redirect_uri: redirectUri,
                audience: audience,
            }}
            cacheLocation="localstorage"
            onRedirectCallback={(appState) => {
                // After login, redirect to the intended page or dashboard
                window.location.href = appState?.returnTo || '/';
            }}
        >
            <AuthGuard>{children}</AuthGuard>
        </Auth0Provider>
    );
}
