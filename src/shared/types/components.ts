import { ButtonHTMLAttributes, InputHTMLAttributes } from 'react';
import { WithClassName } from './index';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, WithClassName {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'link';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
}

export interface InputProps extends InputHTMLAttributes<HTMLInputElement>, WithClassName {
    label?: string;
    error?: string;
    helperText?: string;
} 