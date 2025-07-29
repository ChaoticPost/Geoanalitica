import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { toast } from 'react-hot-toast';
import { CountrySelect } from '@/components/ui/CountrySelect';
import { Country, countries } from '@/utils/countries';
import { PhoneInput } from '@/components/ui/PhoneInput';
import { CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { MotionWrapper } from '@/components/ui/MotionWrapper';
import 'flag-icons/css/flag-icons.min.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

interface ContactFormData {
    full_name: string;
    city: string;
    phone: string;
    email: string;
    company: string;
    direction: string;
    description: string;
}

interface ValidationErrors {
    full_name?: string;
    city?: string;
    phone?: string;
    email?: string;
    description?: string;
}

const initialFormData: ContactFormData = {
    full_name: '',
    city: '',
    phone: '',
    email: '',
    company: '',
    direction: 'Геоаналитика',
    description: ''
};

export const ContactSection = () => {
    const formRef = useRef<HTMLFormElement>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState<ContactFormData>(initialFormData);
    const [errors, setErrors] = useState<ValidationErrors>({});
    const [selectedCountry, setSelectedCountry] = useState<Country>(countries[0]); // Россия по умолчанию
    const [phoneCode, setPhoneCode] = useState(countries[0].phoneCode);
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (showSuccess) {
            timer = setTimeout(() => {
                setShowSuccess(false);
            }, 4000); // 4 секунды
        }
        return () => clearTimeout(timer);
    }, [showSuccess]);

    const handlePhoneCodeChange = (code: string) => {
        setPhoneCode(code);
        // Обновляем номер телефона с новым кодом страны
        const phoneWithoutCode = getPhoneNumberWithoutCode(formData.phone);
        setFormData(prev => ({
            ...prev,
            phone: phoneWithoutCode ? `${code}${phoneWithoutCode}` : ''
        }));
    };

    const validateField = (name: string, value: string) => {
        const newErrors: ValidationErrors = { ...errors };

        switch (name) {
            case 'email':
                if (!value.includes('@')) {
                    newErrors.email = 'Email должен содержать символ @';
                } else {
                    delete newErrors.email;
                }
                break;
            case 'phone':
                const digitsOnly = value.replace(/\D/g, '');
                if (digitsOnly.length < 11) {
                    newErrors.phone = 'Введите полный номер телефона';
                } else {
                    delete newErrors.phone;
                }
                break;
            case 'full_name':
                if (value.length < 2) {
                    newErrors.full_name = 'Имя должно содержать минимум 2 символа';
                } else {
                    delete newErrors.full_name;
                }
                break;
            case 'city':
                if (value.length < 2) {
                    newErrors.city = 'Название города должно содержать минимум 2 символа';
                } else {
                    delete newErrors.city;
                }
                break;
            case 'description':
                if (value.length < 10) {
                    newErrors.description = 'Описание должно содержать минимум 10 символов';
                } else {
                    delete newErrors.description;
                }
                break;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        validateField(name, value);
    };

    const handlePhoneChange = (value: string) => {
        // Получаем только цифры из введенного номера
        const digitsOnly = value.replace(/\D/g, '');
        setFormData(prev => ({
            ...prev,
            phone: digitsOnly ? `${phoneCode}${digitsOnly}` : ''
        }));
        validateField('phone', `${phoneCode}${digitsOnly}`);
    };

    // Форматируем номер телефона для отображения
    const formatPhoneNumber = (number: string) => {
        const digits = number.replace(/\D/g, '');

        let result = '';
        if (digits.length > 0) {
            result += '(' + digits.slice(0, 3);
            if (digits.length > 3) {
                result += ') ' + digits.slice(3, 6);
                if (digits.length > 6) {
                    result += '-' + digits.slice(6, 8);
                    if (digits.length > 8) {
                        result += '-' + digits.slice(8, 10);
                    }
                }
            }
        }
        return result;
    };

    // Получаем только номер без кода страны для отображения в поле ввода
    const getPhoneNumberWithoutCode = (fullNumber: string) => {
        // Убираем код страны и все нецифровые символы
        return fullNumber.replace(phoneCode, '').replace(/\D/g, '');
    };

    const resetForm = () => {
        setFormData(initialFormData);
        setErrors({});
        setSelectedCountry(countries[0]);
        setPhoneCode(countries[0].phoneCode);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Валидация всех полей перед отправкой
        const fieldsToValidate = ['full_name', 'city', 'phone', 'email', 'description'];
        const validationResults = fieldsToValidate.map(field =>
            validateField(field, formData[field as keyof ContactFormData])
        );

        if (validationResults.includes(false)) {
            toast.error('Пожалуйста, исправьте ошибки в форме');
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch(`${API_URL}/api/v1/contact/submit`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    // Убеждаемся, что телефон содержит код страны
                    phone: formData.phone.startsWith('+') ? formData.phone : `+${formData.phone}`
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.detail || 'Произошла ошибка при отправке формы');
            }

            resetForm();
            setShowSuccess(true);
            toast.success('Заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.');

        } catch (error) {
            console.error('Ошибка при отправке формы:', error);
            toast.error(error instanceof Error ? error.message : 'Произошла ошибка при отправке формы');
        } finally {
            setIsLoading(false);
        }
    };

    const renderError = (fieldName: keyof ValidationErrors) => {
        return errors[fieldName] ? (
            <span className="text-red-500 text-sm mt-1">{errors[fieldName]}</span>
        ) : null;
    };

    return (
        <section id="contact" className="py-16 bg-white dark:bg-[#121212] relative overflow-hidden">
            <MotionWrapper
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="max-w-6xl mx-auto px-4"
            >
                <div className="flex flex-col lg:flex-row gap-12 items-start">
                    <MotionWrapper
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        viewport={{ once: true }}
                        className="lg:w-1/2 flex flex-col items-start"
                    >
                        <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                            Расскажите о задаче — поможем её решить
                        </h2>
                        <div className="flex justify-center w-full">
                            <img
                                src="/src/assets/images/photos/form_geo.png"
                                alt="Геоаналитика форма"
                                className="w-64 h-auto mt-8 hidden lg:block"
                            />
                        </div>
                    </MotionWrapper>

                    <form
                        ref={formRef}
                        onSubmit={handleSubmit}
                        className="lg:w-1/2 space-y-4 w-full opacity-0 transform translate-x-5"
                        style={{
                            animation: 'fadeInRight 0.5s ease-out 0.4s forwards'
                        }}
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex flex-col">
                                <Input
                                    type="text"
                                    name="full_name"
                                    value={formData.full_name}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 rounded-xl bg-white/10 dark:bg-gray-900/50 border ${errors.full_name ? 'border-red-500' : 'border-gray-200/20 dark:border-gray-700/30'
                                        } text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-red-500/50 dark:focus:ring-red-400/50 focus:border-transparent transition-colors duration-200`}
                                    placeholder="Имя и фамилия"
                                    required
                                    minLength={2}
                                />
                                {renderError('full_name')}
                            </div>
                            <div className="flex flex-col">
                                <Input
                                    type="text"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 rounded-xl bg-white/10 dark:bg-gray-900/50 border ${errors.city ? 'border-red-500' : 'border-gray-200/20 dark:border-gray-700/30'
                                        } text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-red-500/50 dark:focus:ring-red-400/50 focus:border-transparent transition-colors duration-200`}
                                    placeholder="Город"
                                    required
                                    minLength={2}
                                />
                                {renderError('city')}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex flex-col">
                                <div className="relative flex items-center">
                                    <div className="absolute left-3 z-10 flex items-center">
                                        <CountrySelect
                                            selectedCountry={selectedCountry}
                                            onSelect={setSelectedCountry}
                                            onPhoneCodeChange={handlePhoneCodeChange}
                                        />
                                    </div>
                                    <PhoneInput
                                        value={getPhoneNumberWithoutCode(formData.phone)}
                                        onChange={handlePhoneChange}
                                        className="pl-[5.5rem]"
                                        error={!!errors.phone}
                                        required
                                    />
                                </div>
                                {renderError('phone')}
                            </div>
                            <div className="flex flex-col">
                                <Input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 rounded-xl bg-white/10 dark:bg-gray-900/50 border ${errors.email ? 'border-red-500' : 'border-gray-200/20 dark:border-gray-700/30'
                                        } text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-red-500/50 dark:focus:ring-red-400/50 focus:border-transparent transition-colors duration-200`}
                                    placeholder="Эл. почта"
                                    required
                                    pattern="[^@]+@[^@]+\.[^@]+"
                                    title="Пожалуйста, введите корректный email адрес"
                                />
                                {renderError('email')}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                type="text"
                                name="company"
                                value={formData.company}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl bg-white/10 dark:bg-gray-900/50 border border-gray-200/20 dark:border-gray-700/30 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-red-500/50 dark:focus:ring-red-400/50 focus:border-transparent transition-colors duration-200"
                                placeholder="Компания"
                            />
                            <select
                                name="direction"
                                value={formData.direction}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl bg-white/10 dark:bg-gray-900/50 border border-gray-200/20 dark:border-gray-700/30 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-red-500/50 dark:focus:ring-red-400/50 focus:border-transparent transition-colors duration-200"
                                required
                            >
                                <option value="Геоаналитика">Геоаналитика</option>
                                <option value="Розничная торговля">Розничная торговля</option>
                                <option value="Другое">Другое</option>
                            </select>
                        </div>

                        <div className="flex flex-col">
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                className={`w-full px-4 py-3 rounded-xl bg-white/10 dark:bg-gray-900/50 border ${errors.description ? 'border-red-500' : 'border-gray-200/20 dark:border-gray-700/30'
                                    } text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-red-500/50 dark:focus:ring-red-400/50 focus:border-transparent transition-colors duration-200 min-h-[120px] resize-none`}
                                placeholder="Опишите задачу (минимум 10 символов)"
                                required
                                minLength={10}
                            />
                            {renderError('description')}
                        </div>

                        <Button
                            type="submit"
                            disabled={isLoading || Object.keys(errors).length > 0}
                            className="w-full justify-center py-3 bg-red-500 hover:bg-red-600 text-white font-medium text-lg rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Отправка...' : 'Отправить заявку'}
                        </Button>

                        {showSuccess && (
                            <MotionWrapper
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="flex items-center justify-center space-x-2 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl mt-4"
                            >
                                <CheckCircle2 className="w-5 h-5 text-green-500 dark:text-green-400" />
                                <span className="text-green-700 dark:text-green-300">
                                    Заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.
                                </span>
                            </MotionWrapper>
                        )}
                    </form>
                </div>
            </MotionWrapper>
        </section>
    );
}; 