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
                        className="block text-base font-medium text-foreground mb-2"
                    >
                        {label}
                    </label>
                )}
                <div className="relative rounded-md">
                    {Icon && (
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Icon className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                        </div>
                    )}
                    <input
                        type={type}
                        className={cn(
                            "block w-full rounded-lg transition-colors duration-200",
                            "bg-background border border-input",
                            "text-foreground placeholder:text-muted-foreground",
                            "focus:outline-none focus:ring-2 focus:ring-ring focus:border-input",
                            "disabled:cursor-not-allowed disabled:opacity-50",
                            "text-base py-2.5",
                            Icon ? "pl-12" : "pl-4",
                            rightIcon ? "pr-12" : "pr-4",
                            error && "border-destructive focus:ring-destructive",
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
                    <p className="mt-2 text-sm text-destructive">{error}</p>
                )}
            </div>
        );
    }
); 