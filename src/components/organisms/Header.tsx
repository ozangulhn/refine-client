'use client';

import { useAuth0 } from '@auth0/auth0-react';
import { LogOut, User } from 'lucide-react';
import { Button } from '../atoms';

export function Header() {
    const { user, logout, isAuthenticated } = useAuth0();

    const handleLogout = () => {
        logout({ logoutParams: { returnTo: window.location.origin } });
    };

    return (
        <header className="header">
            <div className="header-logo">
                <div className="logo-icon">R</div>
                <span className="logo-text">Refine</span>
            </div>

            {isAuthenticated && user && (
                <div className="header-user">
                    <div className="user-avatar">
                        {user.picture ? (
                            <img
                                src={user.picture}
                                alt={user.name || 'User'}
                                style={{ width: '100%', height: '100%', borderRadius: '50%' }}
                            />
                        ) : (
                            <User size={16} />
                        )}
                    </div>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                        {user.name || user.email}
                    </span>
                    <Button variant="ghost" size="sm" onClick={handleLogout}>
                        <LogOut size={16} />
                    </Button>
                </div>
            )}
        </header>
    );
}
