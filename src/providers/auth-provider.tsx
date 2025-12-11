'use client';

import { Auth0Provider } from '@auth0/auth0-react';
import { ReactNode } from 'react';

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const domain = process.env.NEXT_PUBLIC_AUTH0_DOMAIN;
    const clientId = process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID;
    const audience = process.env.NEXT_PUBLIC_AUTH0_AUDIENCE;

    if (!domain || !clientId) {
        if (process.env.NODE_ENV === 'development') {
            console.warn('Auth0 domain or client ID missing');
        }
        return <>{children}</>;
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
        >
            {children}
        </Auth0Provider>
    );
}
