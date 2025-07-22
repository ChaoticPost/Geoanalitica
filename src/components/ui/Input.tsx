import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/utils/cn';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    icon?: LucideIcon;
    rightIcon?: React.ReactNode;
    label?: string;
    error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, icon: Icon, rightIcon, label, error, ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label
                        htmlFor={props.id}
                        className="block text-base font-medium text-gray-700 dark:text-gray-200 mb-2"
                    >
                        {label}
                    </label>
                )}
                <div className="relative rounded-md shadow-sm">
                    {Icon && (
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Icon className="h-6 w-6 text-gray-400" aria-hidden="true" />
                        </div>
                    )}
                    <input
                        type={type}
                        className={cn(
                            "block w-full border border-gray-300 dark:border-gray-600 rounded-md",
                            "bg-white dark:bg-gray-700 text-gray-900 dark:text-white",
                            "placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500",
                            "text-base py-3",
                            Icon ? "pl-12" : "pl-4",
                            rightIcon ? "pr-12" : "pr-4",
                            error && "border-red-500 focus:ring-red-500 focus:border-red-500",
                            className
                        )}
                        ref={ref}
                        {...props}
                    />
                    {rightIcon && (
                        <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                            {rightIcon}
                        </div>
                    )}
                </div>
                {error && (
                    <p className="mt-2 text-sm text-red-600">{error}</p>
                )}
            </div>
        );
    }
); 