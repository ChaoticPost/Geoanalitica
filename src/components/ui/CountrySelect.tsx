import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { Country, countries } from '@/utils/countries';
import 'flag-icons/css/flag-icons.min.css';

interface CountrySelectProps {
    selectedCountry: Country;
    onSelect: (country: Country) => void;
    onPhoneCodeChange: (code: string) => void;
}

export const CountrySelect = ({ selectedCountry, onSelect, onPhoneCodeChange }: CountrySelectProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (country: Country) => {
        onSelect(country);
        onPhoneCodeChange(country.phoneCode);
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center space-x-1 focus:outline-none"
            >
                <span className={`fi fi-${selectedCountry.code.toLowerCase()} w-6`} />
                <ChevronDown className="w-4 h-4 text-gray-500" />
            </button>

            {isOpen && (
                <div className="absolute z-50 mt-1 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 max-h-60 overflow-auto">
                    <div className="py-1">
                        {countries.map((country) => (
                            <button
                                key={country.code}
                                onClick={() => handleSelect(country)}
                                className="w-full flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                                <span className={`fi fi-${country.code.toLowerCase()} mr-2`} />
                                <span>{country.name}</span>
                                <span className="ml-auto text-gray-500">{country.phoneCode}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}; 