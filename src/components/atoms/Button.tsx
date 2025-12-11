'use client';

import { ButtonHTMLAttributes, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ variant = 'primary', size = 'md', loading, children, className = '', disabled, ...props }, ref) => {
        const variantClass = `btn-${variant}`;
        const sizeClass = size !== 'md' ? `btn-${size}` : '';

        return (
            <button
                ref={ref}
                className={`btn ${variantClass} ${sizeClass} ${className}`.trim()}
                disabled={disabled || loading}
                {...props}
            >
                {loading && <span className="spinner spinner-sm" />}
                {children}
            </button>
        );
    }
);

Button.displayName = 'Button';
