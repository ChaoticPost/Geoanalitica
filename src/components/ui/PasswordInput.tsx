import React, { useState } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';
import { cn } from '@/utils/cn';

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    icon?: React.ElementType;
    showPasswordLabel?: string;
    hidePasswordLabel?: string;
    error?: string;
}

export const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
    ({ className, label, icon: Icon = Lock, showPasswordLabel = "Показать", hidePasswordLabel = "Скрыть", error, ...props }, ref) => {
        const [showPassword, setShowPassword] = useState(false);

        return (
            <div className="space-y-1">
                {label && (
                    <label htmlFor={props.id} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        {label}
                    </label>
                )}
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Icon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </div>
                    <input
                        type={showPassword ? 'text' : 'password'}
                        className={cn(
                            'block w-full pl-10 pr-12 py-2 rounded-lg',
                            'focus:outline-none focus:ring-2',
                            'disabled:opacity-50 disabled:cursor-not-allowed',
                            error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-700 focus:ring-red-500',
                            'bg-white dark:bg-neutral-900',
                            'text-gray-900 dark:text-white',
                            'placeholder-gray-400 dark:placeholder-gray-500',
                            className
                        )}
                        ref={ref}
                        {...props}
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center">
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="p-2 text-gray-400 hover:text-gray-500 focus:outline-none focus:text-gray-500"
                            aria-label={showPassword ? hidePasswordLabel : showPasswordLabel}
                        >
                            {showPassword ? (
                                <EyeOff className="h-5 w-5" aria-hidden="true" />
                            ) : (
                                <Eye className="h-5 w-5" aria-hidden="true" />
                            )}
                        </button>
                    </div>
                </div>
                {error && (
                    <p className="text-sm text-red-600 dark:text-red-500 mt-1">
                        {error}
                    </p>
                )}
            </div>
        );
    }
); 