import { ReactNode } from 'react';

interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    className?: string;
    label?: string;
}

export function LoadingSpinner({ size = 'md', className = '', label }: LoadingSpinnerProps) {
    const sizeClasses = {
        sm: 'w-4 h-4 border-2',
        md: 'w-8 h-8 border-3',
        lg: 'w-12 h-12 border-4'
    };

    return (
        <div
            className={`flex flex-col items-center justify-center gap-2 ${className}`}
            role="status"
            aria-live="polite"
            aria-label={label || 'Loading'}
        >
            <div
                className={`${sizeClasses[size]} border-primary border-t-transparent rounded-full animate-spin`}
                aria-hidden="true"
            />
            {label && (
                <span className="text-sm text-muted-foreground">
                    {label}
                </span>
            )}
        </div>
    );
}
