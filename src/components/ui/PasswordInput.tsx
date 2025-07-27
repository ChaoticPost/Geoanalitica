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
                    <label htmlFor={props.id} className="block text-sm font-medium text-foreground">
                        {label}
                    </label>
                )}
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Icon className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                    </div>
                    <input
                        type={showPassword ? 'text' : 'password'}
                        className={cn(
                            'block w-full pl-10 pr-12 py-2.5 rounded-lg transition-colors duration-200',
                            'bg-background border border-input',
                            'text-foreground placeholder:text-muted-foreground',
                            'focus:outline-none focus:ring-2 focus:ring-ring focus:border-input',
                            'disabled:cursor-not-allowed disabled:opacity-50',
                            error && 'border-destructive focus:ring-destructive',
                            className
                        )}
                        ref={ref}
                        {...props}
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center">
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="p-2 text-muted-foreground hover:text-foreground focus:outline-none focus:text-foreground transition-colors duration-200"
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
                    <p className="text-sm text-destructive mt-1">
                        {error}
                    </p>
                )}
            </div>
        );
    }
); 