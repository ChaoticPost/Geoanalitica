import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Link, Outlet } from 'react-router-dom';

interface AuthLayoutProps {
    children?: ReactNode;
    title?: string;
    subtitle?: string;
}

const AuthLayout = ({ title, subtitle }: AuthLayoutProps) => {
    console.log('AuthLayout rendered');

    return (
        <div className="min-h-screen bg-white dark:bg-black flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <Link to="/" className="flex justify-center mb-6">
                    <img
                        src="/src/assets/images/icons/icon_geo.png"
                        alt="GeoAnalitica"
                        className="h-12 w-auto"
                    />
                </Link>
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {title && (
                        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
                            {title}
                        </h2>
                    )}
                    {subtitle && (
                        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
                            {subtitle}
                        </p>
                    )}
                </motion.div>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white dark:bg-black py-8 px-4 shadow-xl dark:shadow-2xl sm:rounded-lg sm:px-10 border border-gray-200 dark:border-gray-800">
                    <Outlet />
                </div>
            </div>

            {/* Декоративные элементы */}
            <div className="absolute inset-0 -z-10 overflow-hidden">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.5 }}
                    transition={{ duration: 1 }}
                    className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-red-500/30 to-transparent dark:from-red-500/10 blur-3xl transform rotate-12"
                />
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.5 }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-red-500/30 to-transparent dark:from-red-500/10 blur-3xl transform -rotate-12"
                />
            </div>
        </div>
    );
};

export default AuthLayout; 