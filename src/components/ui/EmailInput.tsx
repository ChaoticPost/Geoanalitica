import { useState, useEffect } from 'react';
import { Input } from './Input';

interface EmailInputProps {
    value: string;
    onChange: (value: string) => void;
    label?: string;
    placeholder?: string;
    className?: string;
    error?: string;
    onErrorChange?: (error: string | undefined) => void;
}

export const EmailInput = ({
    value,
    onChange,
    label = 'Email',
    placeholder = 'your@email.com',
    className,
    error,
    onErrorChange
}: EmailInputProps) => {
    const [localError, setLocalError] = useState<string | undefined>(error);

    const validateEmail = (email: string): string | undefined => {
        if (email && !email.includes('@')) {
            return 'Email должен содержать символ @';
        }
        return undefined;
    };

    useEffect(() => {
        const validationError = validateEmail(value);
        setLocalError(validationError);
        onErrorChange?.(validationError);
    }, [value, onErrorChange]);

    return (
        <div className="space-y-2">
            {label && (
                <label className="block text-sm font-medium text-foreground">
                    {label}
                </label>
            )}
            <Input
                type="email"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className={`w-full px-4 py-3 rounded-xl bg-white/10 dark:bg-gray-900/50 border ${localError ? 'border-red-500' : 'border-gray-200/20 dark:border-gray-700/30'
                    } text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-red-500/50 dark:focus:ring-red-400/50 focus:border-transparent transition-colors duration-200 ${className}`}
            />
            {localError && (
                <p className="text-sm text-destructive">
                    {localError}
                </p>
            )}
        </div>
    );
}; 