import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HomeButton } from '@/components/ui/HomeButton';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { motion } from 'framer-motion';

interface AuthLayoutProps {
    children?: ReactNode;
    title?: string;
    subtitle?: string;
}

export const AuthLayout = ({ children, title, subtitle }: AuthLayoutProps) => {
    const location = useLocation();
    const isLoginPage = location.pathname === '/login';

    const navigationContent = isLoginPage ? {
        text: 'Ещё нет аккаунта?',
        linkText: 'Зарегистрироваться',
        linkTo: '/register'
    } : {
        text: 'Уже есть аккаунт?',
        linkText: 'Войти',
        linkTo: '/login'
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-white to-gray-50 dark:from-black dark:to-neutral-900 relative overflow-hidden">
            {/* Декоративные элементы */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute top-0 -right-4 w-[500px] h-[500px] bg-gradient-to-br from-[#EF3124]/30 to-orange-500/30 dark:from-[#EF3124]/20 dark:to-orange-500/20 rounded-full blur-3xl" />
                <div className="absolute -bottom-32 -left-40 w-[500px] h-[500px] bg-gradient-to-tr from-[#EF3124]/30 to-orange-500/30 dark:from-[#EF3124]/20 dark:to-orange-500/20 rounded-full blur-3xl" />
            </div>

            {/* Main Content */}
            <div className="min-h-screen flex">
                {/* Left Side - Title */}
                <motion.div
                    className="hidden lg:flex lg:w-1/2 flex-col px-16 pt-12 relative"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {/* Navigation Buttons */}
                    <div className="flex items-center justify-between mb-16">
                        <HomeButton />
                        <ThemeToggle />
                    </div>

                    <h1 className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#EF3124] to-orange-500 mb-6">
                        {title}
                    </h1>
                    {subtitle && (
                        <p className="text-2xl text-gray-600 dark:text-gray-400 leading-relaxed">
                            {subtitle}
                        </p>
                    )}

                    {/* Navigation Link */}
                    <motion.div
                        className="absolute bottom-12 left-16"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        <p className="text-gray-600 dark:text-gray-400">
                            {navigationContent.text}{' '}
                            <Link
                                to={navigationContent.linkTo}
                                className="font-medium text-[#EF3124] hover:opacity-90 transition-opacity"
                            >
                                {navigationContent.linkText}
                            </Link>
                        </p>
                    </motion.div>
                </motion.div>

                {/* Right Side - Form */}
                <motion.div
                    className="w-full lg:w-1/2 flex flex-col items-center p-8"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    {/* Mobile Navigation Buttons */}
                    <div className="lg:hidden w-full flex items-center justify-between mb-12">
                        <HomeButton />
                        <ThemeToggle />
                    </div>

                    <div className="w-full max-w-md mt-8">
                        {/* Mobile Title (visible only on mobile) */}
                        <div className="lg:hidden mb-12">
                            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#EF3124] to-orange-500 mb-4">
                                {title}
                            </h1>
                            {subtitle && (
                                <p className="text-gray-600 dark:text-gray-400 text-lg">
                                    {subtitle}
                                </p>
                            )}
                        </div>

                        {/* Form Content */}
                        <div className="backdrop-blur-lg bg-white/80 dark:bg-black/80 rounded-2xl p-8 shadow-2xl dark:shadow-neutral-900/50">
                            {children}
                        </div>

                        {/* Mobile Navigation Link */}
                        <motion.div
                            className="lg:hidden mt-8 text-center"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                        >
                            <p className="text-gray-600 dark:text-gray-400">
                                {navigationContent.text}{' '}
                                <Link
                                    to={navigationContent.linkTo}
                                    className="font-medium text-[#EF3124] hover:opacity-90 transition-opacity"
                                >
                                    {navigationContent.linkText}
                                </Link>
                            </p>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}; 