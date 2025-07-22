import React, { useState } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';
import { Input } from './Input';

interface PasswordInputProps extends Omit<React.ComponentProps<typeof Input>, 'type' | 'icon' | 'rightIcon'> {
    showPasswordLabel?: string;
    hidePasswordLabel?: string;
}

export const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
    ({ showPasswordLabel = "Show password", hidePasswordLabel = "Hide password", ...props }, ref) => {
        const [showPassword, setShowPassword] = useState(false);

        const togglePassword = () => {
            setShowPassword(!showPassword);
        };

        const ToggleButton = (
            <button
                type="button"
                onClick={togglePassword}
                className="text-gray-400 hover:text-gray-500 focus:outline-none focus:text-gray-500"
                aria-label={showPassword ? hidePasswordLabel : showPasswordLabel}
            >
                {showPassword ? (
                    <EyeOff className="h-6 w-6" aria-hidden="true" />
                ) : (
                    <Eye className="h-6 w-6" aria-hidden="true" />
                )}
            </button>
        );

        return (
            <Input
                {...props}
                ref={ref}
                type={showPassword ? 'text' : 'password'}
                icon={Lock}
                rightIcon={ToggleButton}
            />
        );
    }
); 