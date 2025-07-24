import { useState } from 'react';
import { Mail } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { PasswordInput } from '@/components/ui/PasswordInput';
import { Link } from 'react-router-dom';
import AuthLayout from '@/layouts/AuthLayout';
import { motion } from 'framer-motion';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            // TODO: Implement login logic
            await new Promise(resolve => setTimeout(resolve, 1000)); // Имитация запроса
        } catch (error) {
            console.error('Login error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthLayout
            title="Войти в аккаунт"
            subtitle="Введите данные для входа в систему"
        >
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            label="Email"
                            icon={Mail}
                            autoComplete="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="your@email.com"
                            className="bg-white dark:bg-neutral-900 border-gray-300 dark:border-gray-700 focus:ring-red-500 dark:focus:ring-red-500"
                        />

                        <PasswordInput
                            id="password"
                            name="password"
                            label="Пароль"
                            autoComplete="current-password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            showPasswordLabel="Показать"
                            hidePasswordLabel="Скрыть"
                            className="bg-white dark:bg-neutral-900 border-gray-300 dark:border-gray-700 focus:ring-red-500 dark:focus:ring-red-500"
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input
                                id="remember-me"
                                name="remember-me"
                                type="checkbox"
                                className="h-4 w-4 rounded border-gray-300 dark:border-gray-700 text-red-500 focus:ring-red-500"
                            />
                            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                                Запомнить меня
                            </label>
                        </div>

                        <div className="text-sm">
                            <Link to="/auth/forgot-password" className="font-medium text-red-500 hover:text-red-600 transition-colors">
                                Забыли пароль?
                            </Link>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <Button
                            type="submit"
                            className="w-full bg-red-500 text-white hover:bg-red-600 transition-colors"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Вход...' : 'Войти'}
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
                            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors"
                        >
                            <img
                                className="h-5 w-5"
                                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                                alt="Google"
                            />
                            <span className="text-gray-700 dark:text-gray-300">
                                Войти через Google
                            </span>
                        </motion.button>
                    </div>

                    <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                        Нет аккаунта?{' '}
                        <Link
                            to="/auth/register"
                            className="font-medium text-red-500 hover:text-red-600 transition-colors"
                        >
                            Зарегистрироваться
                        </Link>
                    </p>
                </form>
            </motion.div>
        </AuthLayout>
    );
};

export default LoginPage; 