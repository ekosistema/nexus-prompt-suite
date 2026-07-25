import { InputHTMLAttributes, ReactNode } from 'react';
import { cn } from '../../lib/utils';

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    icon?: ReactNode;
    error?: string;
    helperText?: string;
}

export function FormField({
    label,
    icon,
    error,
    helperText,
    className,
    id,
    required,
    ...props
}: FormFieldProps) {
    const fieldId = id || `field-${label.toLowerCase().replace(/\s+/g, '-')}`;
    const errorId = `${fieldId}-error`;
    const helperId = `${fieldId}-helper`;

    return (
        <div className="space-y-2">
            <label
                htmlFor={fieldId}
                className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-2"
            >
                {icon && <span aria-hidden="true">{icon}</span>}
                {label}
                {required && <span className="text-destructive" aria-label="required">*</span>}
            </label>

            <input
                id={fieldId}
                aria-invalid={error ? 'true' : 'false'}
                aria-describedby={cn(
                    error && errorId,
                    helperText && helperId
                )}
                aria-required={required}
                className={cn(
                    "w-full bg-secondary/50 border rounded-md px-3 py-2 text-sm transition-colors",
                    "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
                    error
                        ? "border-destructive focus:ring-destructive"
                        : "border-input",
                    className
                )}
                required={required}
                {...props}
            />

            {error && (
                <p
                    id={errorId}
                    className="text-xs text-destructive flex items-center gap-1"
                    role="alert"
                >
                    <span aria-hidden="true">⚠</span>
                    {error}
                </p>
            )}

            {helperText && !error && (
                <p
                    id={helperId}
                    className="text-xs text-muted-foreground"
                >
                    {helperText}
                </p>
            )}
        </div>
    );
}
