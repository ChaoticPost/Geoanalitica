import { useState, useEffect } from 'react';
import { Input } from './Input';
import { CountrySelect } from './CountrySelect';
import { Country, countries } from '@/utils/countries';
import InputMask from 'react-input-mask';

interface PhoneInputProps {
    value: string;
    onChange: (value: string) => void;
    label?: string;
    placeholder?: string;
    className?: string;
    error?: string;
    onErrorChange?: (error: string | undefined) => void;
}

export const PhoneInput = ({
    value,
    onChange,
    label = 'Телефон',
    placeholder = '(___) ___-__-__',
    className,
    error,
    onErrorChange
}: PhoneInputProps) => {
    const [localError, setLocalError] = useState<string | undefined>(error);
    const [selectedCountry, setSelectedCountry] = useState<Country>(countries[0]);
    const [phoneCode, setPhoneCode] = useState(countries[0].phoneCode);

    const handlePhoneCodeChange = (code: string) => {
        setPhoneCode(code);
        const phoneWithoutCode = getPhoneNumberWithoutCode(value);
        onChange(phoneWithoutCode ? `${code}${phoneWithoutCode}` : '');
    };

    const validatePhone = (phone: string): string | undefined => {
        const cleaned = phone.replace(/\D/g, '');
        if (cleaned && cleaned.length !== 11) {
            return 'Неверный формат телефона';
        }
        return undefined;
    };

    const getPhoneNumberWithoutCode = (fullNumber: string) => {
        return fullNumber.replace(phoneCode, '').replace(/\D/g, '');
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value: newValue } = e.target;
        const digitsOnly = newValue.replace(/\D/g, '');
        const newFullNumber = digitsOnly ? `${phoneCode}${digitsOnly}` : '';
        onChange(newFullNumber);
    };

    useEffect(() => {
        const validationError = validatePhone(value);
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
            <div className="relative flex items-center">
                <div className="absolute left-3 z-10 flex items-center">
                    <CountrySelect
                        selectedCountry={selectedCountry}
                        onSelect={setSelectedCountry}
                        onPhoneCodeChange={handlePhoneCodeChange}
                    />
                </div>
                <InputMask
                    mask="(999) 999-99-99"
                    maskChar="_"
                    type="tel"
                    value={getPhoneNumberWithoutCode(value)}
                    onChange={handleChange}
                    className={`w-full pl-[5.5rem] pr-4 py-3 rounded-xl bg-white/5 dark:bg-[#1E1E1E] border ${localError ? 'border-red-500' : 'border-gray-200/20 dark:border-gray-700/30'
                        } text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-red-500/50 dark:focus:ring-red-400/50 focus:border-red-500/30 transition-colors duration-200 ${className}`}
                    placeholder={placeholder}
                    alwaysShowMask
                />
            </div>
            {localError && (
                <p className="text-sm text-destructive">
                    {localError}
                </p>
            )}
        </div>
    );
}; 