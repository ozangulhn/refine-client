'use client';

import { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Mail, Lock, User, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/atoms';

type AuthMode = 'login' | 'signup';

export default function LoginPage() {
  const { loginWithRedirect, isAuthenticated, isLoading, error, logout } = useAuth0();
  const router = useRouter();
  
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  // Handle Auth0 errors - show on page
  useEffect(() => {
    if (error) {
      setFormError(error.message);
    }
  }, [error]);

  const handleGoogleLogin = () => {
    loginWithRedirect({
      authorizationParams: {
        connection: 'google-oauth2',
      },
    });
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setSubmitting(true);

    try {
      // Use Auth0's resource owner password grant
      // Note: This requires enabling "Password" grant in Auth0 Application settings
      await loginWithRedirect({
        authorizationParams: {
          connection: 'Username-Password-Authentication',
          login_hint: email,
        },
      });
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setSubmitting(true);

    try {
      // Redirect to Auth0's signup page with pre-filled email
      await loginWithRedirect({
        authorizationParams: {
          screen_hint: 'signup',
          login_hint: email,
        },
      });
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Signup failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="loading-page">
        <Loader2 className="spinner-lg animate-spin" size={36} />
        <span>Loading...</span>
      </div>
    );
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">
            <span style={{ fontSize: '1.5rem', fontWeight: 700 }}>R</span>
          </div>
          <h1 className="login-title">Refine</h1>
          <p className="login-subtitle">
            {mode === 'login' ? 'Sign in to continue' : 'Create your account'}
          </p>
        </div>

        {formError && (
          <div className="login-error">
            <AlertCircle size={18} />
            {formError}
          </div>
        )}

        {/* Google OAuth Button */}
        <Button
          onClick={handleGoogleLogin}
          variant="secondary"
          size="lg"
          style={{ width: '100%', marginBottom: 'var(--space-4)' }}
          disabled={submitting}
        >
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Continue with Google
        </Button>

        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 'var(--space-3)',
          margin: 'var(--space-4) 0',
          color: 'var(--text-muted)',
          fontSize: '0.8125rem'
        }}>
          <div style={{ flex: 1, height: '1px', background: 'var(--border-primary)' }} />
          or
          <div style={{ flex: 1, height: '1px', background: 'var(--border-primary)' }} />
        </div>

        {/* Email/Password Form */}
        <form onSubmit={mode === 'login' ? handleEmailLogin : handleSignup}>
          {mode === 'signup' && (
            <div style={{ marginBottom: 'var(--space-4)' }}>
              <label style={{ 
                display: 'block', 
                fontSize: '0.8125rem', 
                color: 'var(--text-secondary)',
                marginBottom: 'var(--space-2)'
              }}>
                Full Name
              </label>
              <div style={{ position: 'relative' }}>
                <User 
                  size={18} 
                  style={{ 
                    position: 'absolute', 
                    left: 'var(--space-3)', 
                    top: '50%', 
                    transform: 'translateY(-50%)',
                    color: 'var(--text-muted)'
                  }} 
                />
                <input
                  type="text"
                  className="input"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{ paddingLeft: 'var(--space-10)' }}
                  required
                />
              </div>
            </div>
          )}

          <div style={{ marginBottom: 'var(--space-4)' }}>
            <label style={{ 
              display: 'block', 
              fontSize: '0.8125rem', 
              color: 'var(--text-secondary)',
              marginBottom: 'var(--space-2)'
            }}>
              Email
            </label>
            <div style={{ position: 'relative' }}>
              <Mail 
                size={18} 
                style={{ 
                  position: 'absolute', 
                  left: 'var(--space-3)', 
                  top: '50%', 
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)'
                }} 
              />
              <input
                type="email"
                className="input"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ paddingLeft: 'var(--space-10)' }}
                required
              />
            </div>
          </div>

          <div style={{ marginBottom: 'var(--space-6)' }}>
            <label style={{ 
              display: 'block', 
              fontSize: '0.8125rem', 
              color: 'var(--text-secondary)',
              marginBottom: 'var(--space-2)'
            }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock 
                size={18} 
                style={{ 
                  position: 'absolute', 
                  left: 'var(--space-3)', 
                  top: '50%', 
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)'
                }} 
              />
              <input
                type="password"
                className="input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingLeft: 'var(--space-10)' }}
                required
                minLength={8}
              />
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            style={{ width: '100%' }}
            disabled={submitting}
            loading={submitting}
          >
            {mode === 'login' ? 'Sign In' : 'Create Account'}
          </Button>
        </form>

        <div style={{ 
          marginTop: 'var(--space-6)', 
          textAlign: 'center',
          fontSize: '0.875rem',
          color: 'var(--text-secondary)'
        }}>
          {mode === 'login' ? (
            <>
              Don&apos;t have an account?{' '}
              <button
                onClick={() => { setMode('signup'); setFormError(null); }}
                style={{ 
                  color: 'var(--accent-primary)', 
                  background: 'none', 
                  border: 'none', 
                  cursor: 'pointer',
                  fontWeight: 500
                }}
              >
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button
                onClick={() => { setMode('login'); setFormError(null); }}
                style={{ 
                  color: 'var(--accent-primary)', 
                  background: 'none', 
                  border: 'none', 
                  cursor: 'pointer',
                  fontWeight: 500
                }}
              >
                Sign in
              </button>
            </>
          )}
        </div>

        <div className="login-footer">
          <p>PDF to EPUB conversion made simple</p>
        </div>
      </div>
    </div>
  );
}
