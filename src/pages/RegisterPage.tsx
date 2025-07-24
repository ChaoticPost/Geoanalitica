import { useState } from 'react';
import { Mail, User } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { PasswordInput } from '@/components/ui/PasswordInput';
import { Link } from 'react-router-dom';
import AuthLayout from '@/layouts/AuthLayout';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';

interface RegisterFormData {
    name: string;
    email: string;
    password: string;
}

const RegisterPage = () => {
    const [formData, setFormData] = useState<RegisterFormData>({
        name: '',
        email: '',
        password: ''
    });
    const [acceptTerms, setAcceptTerms] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!acceptTerms) {
            toast.error('Необходимо принять условия использования');
            return;
        }

        setIsLoading(true);
        try {
            // TODO: Implement registration logic
            await new Promise(resolve => setTimeout(resolve, 1000)); // Имитация запроса
            toast.success('Регистрация успешна!');
            // Redirect to login or dashboard
        } catch (error) {
            toast.error('Ошибка при регистрации');
            console.error('Registration error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSignIn = () => {
        // TODO: Implement Google sign in
        toast.error('Google авторизация пока не реализована');
    };

    return (
        <AuthLayout
            title="Создать аккаунт"
            subtitle="Заполните форму для создания аккаунта"
        >
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <Input
                            id="name"
                            name="name"
                            type="text"
                            label="Имя"
                            icon={User}
                            autoComplete="name"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Иван Иванов"
                            className="bg-white dark:bg-neutral-900 border-gray-300 dark:border-gray-700 focus:ring-red-500 dark:focus:ring-red-500"
                        />

                        <Input
                            id="email"
                            name="email"
                            type="email"
                            label="Email"
                            icon={Mail}
                            autoComplete="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="your@email.com"
                            className="bg-white dark:bg-neutral-900 border-gray-300 dark:border-gray-700 focus:ring-red-500 dark:focus:ring-red-500"
                        />

                        <PasswordInput
                            id="password"
                            name="password"
                            label="Пароль"
                            autoComplete="new-password"
                            required
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="••••••••"
                            className="bg-white dark:bg-neutral-900 border-gray-300 dark:border-gray-700 focus:ring-red-500 dark:focus:ring-red-500"
                        />
                    </div>

                    <div className="flex items-center">
                        <input
                            id="accept-terms"
                            name="accept-terms"
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 dark:border-gray-700 text-red-500 focus:ring-red-500"
                            checked={acceptTerms}
                            onChange={(e) => setAcceptTerms(e.target.checked)}
                            required
                        />
                        <label htmlFor="accept-terms" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                            Я согласен с{' '}
                            <Link to="/terms" className="font-medium text-red-500 hover:text-red-600 transition-colors">
                                условиями использования
                            </Link>
                        </label>
                    </div>

                    <div className="space-y-4">
                        <Button
                            type="submit"
                            className="w-full bg-red-500 text-white hover:bg-red-600 transition-colors"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
                        </Button>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300 dark:border-gray-700" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white dark:bg-black text-gray-500">или</span>
                            </div>
                        </div>

                        <motion.button
                            type="button"
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            onClick={handleGoogleSignIn}
                            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors"
                        >
                            <img
                                className="h-5 w-5"
                                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                                alt="Google"
                            />
                            <span className="text-gray-700 dark:text-gray-300">
                                Продолжить через Google
                            </span>
                        </motion.button>
                    </div>

                    <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                        Уже есть аккаунт?{' '}
                        <Link
                            to="/login"
                            className="font-medium text-red-500 hover:text-red-600 transition-colors"
                        >
                            Войти
                        </Link>
                    </p>
                </form>
            </motion.div>
        </AuthLayout>
    );
};

export default RegisterPage; 