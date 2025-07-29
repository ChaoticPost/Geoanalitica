import React, { forwardRef, useRef, useState, useEffect } from 'react';
import { cn } from '@/utils/cn';

interface PhoneInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
    value: string;
    onChange: (value: string) => void;
    className?: string;
    error?: boolean;
}

export const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(
    ({ value, onChange, className, error, ...props }, ref) => {
        const [cursorPosition, setCursorPosition] = useState<number>(0);
        const inputRef = useRef<HTMLInputElement>(null);

        // Форматирование номера телефона
        const formatPhoneNumber = (input: string): string => {
            // Убираем все нецифровые символы
            const digits = input.replace(/\D/g, '');

            let formatted = '';
            if (digits.length > 0) {
                formatted += '(' + digits.slice(0, 3);
                if (digits.length > 3) {
                    formatted += ') ' + digits.slice(3, 6);
                    if (digits.length > 6) {
                        formatted += '-' + digits.slice(6, 8);
                        if (digits.length > 8) {
                            formatted += '-' + digits.slice(8, 10);
                        }
                    }
                }
            }
            return formatted;
        };

        // Обработка изменения значения
        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const input = e.target.value;
            const digits = input.replace(/\D/g, '').slice(0, 10); // Ограничиваем 10 цифрами

            // Сохраняем позицию курсора
            const currentCursorPosition = e.target.selectionStart || 0;
            setCursorPosition(currentCursorPosition);

            onChange(digits);
        };

        // Восстанавливаем позицию курсора после форматирования
        useEffect(() => {
            if (inputRef.current) {
                inputRef.current.setSelectionRange(cursorPosition, cursorPosition);
            }
        }, [value, cursorPosition]);

        return (
            <input
                ref={(node) => {
                    // Обрабатываем оба ref - внутренний и внешний
                    if (typeof ref === 'function') {
                        ref(node);
                    } else if (ref) {
                        ref.current = node;
                    }
                    inputRef.current = node;
                }}
                type="tel"
                value={formatPhoneNumber(value)}
                onChange={handleChange}
                className={cn(
                    'w-full px-4 py-3 rounded-xl bg-white/5 dark:bg-[#1E1E1E] border',
                    error ? 'border-red-500' : 'border-gray-200/20 dark:border-gray-700/30',
                    'text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400',
                    'focus:ring-2 focus:ring-red-500/50 dark:focus:ring-red-400/50',
                    'focus:border-red-500/30 transition-colors duration-200',
                    className
                )}
                placeholder="(___) ___-__-__"
                {...props}
            />
        );
    }
);

PhoneInput.displayName = 'PhoneInput'; 