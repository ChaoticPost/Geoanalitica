import { useState, useEffect, useCallback } from 'react';
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
    // Валидация происходит только при изменении value
    const validateEmail = useCallback((email: string): string | undefined => {
        if (!email) return undefined;
        if (!email.includes('@')) {
            return 'Email должен содержать символ @';
        }
        return undefined;
    }, []);

    // Обработчик изменения значения
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        onChange(newValue);

        // Валидируем и отправляем ошибку наверх
        const validationError = validateEmail(newValue);
        onErrorChange?.(validationError);
    };

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
                onChange={handleChange}
                placeholder={placeholder}
                className={`w-full px-4 py-3 rounded-xl bg-white/10 dark:bg-gray-900/50 border ${error ? 'border-red-500' : 'border-gray-200/20 dark:border-gray-700/30'
                    } text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-red-500/50 dark:focus:ring-red-400/50 focus:border-transparent transition-colors duration-200 ${className}`}
            />
            {error && (
                <p className="text-sm text-destructive">
                    {error}
                </p>
            )}
        </div>
    );
}; 