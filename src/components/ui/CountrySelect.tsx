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
        className="flex items-center gap-1.5 focus:outline-none min-w-[60px]"
      >
        <span className={`fi fi-${selectedCountry.code.toLowerCase()} fis h-4 rounded-sm`} />
        <span className="text-gray-900 dark:text-gray-100 text-sm font-medium">
          {selectedCountry.phoneCode}
        </span>
        <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-2 w-64 rounded-xl bg-white dark:bg-gray-800/95 shadow-lg border border-gray-200/20 dark:border-gray-700/30 py-2 max-h-[280px] overflow-auto backdrop-blur-sm">
          {countries.map((country) => (
            <button
              key={country.code}
              type="button"
              onClick={() => handleSelect(country)}
              className={`w-full px-4 py-2.5 text-left flex items-center space-x-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${selectedCountry.code === country.code ? 'bg-gray-50 dark:bg-gray-700/50' : ''
                }`}
            >
              <span className={`fi fi-${country.code.toLowerCase()} fis h-4 rounded-sm`} />
              <span className="text-gray-900 dark:text-gray-100 text-sm font-medium min-w-[48px]">
                {country.phoneCode}
              </span>
              <span className="text-gray-600 dark:text-gray-400 text-sm">
                {country.name}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}; 