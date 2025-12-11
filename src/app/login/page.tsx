'use client';

import { useAuth0 } from '@auth0/auth0-react';
import { Lock } from 'lucide-react';
import { Button } from '@/components/atoms';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const { loginWithRedirect, isAuthenticated, isLoading } = useAuth0();
    const router = useRouter();

    useEffect(() => {
        if (isAuthenticated) {
            router.push('/');
        }
    }, [isAuthenticated, router]);

    if (isLoading) {
        return (
            <div className="loading-page">
                <div className="spinner spinner-lg" />
                <span>Loading...</span>
            </div>
        );
    }

    return (
        <div className="login-page">
            <div className="login-card">
                <div className="login-header">
                    <div className="login-logo">
                        <Lock size={28} />
                    </div>
                    <h1 className="login-title">Refine</h1>
                    <p className="login-subtitle">PDF to EPUB Conversion</p>
                </div>

                <Button
                    onClick={() => loginWithRedirect()}
                    variant="primary"
                    size="lg"
                    style={{ width: '100%' }}
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" style={{ marginRight: '8px' }}>
                        <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                        <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Sign in with Google
                </Button>

                <div className="login-footer">
                    <p>Convert your PDFs to beautiful EPUBs</p>
                </div>
            </div>
        </div>
    );
}
