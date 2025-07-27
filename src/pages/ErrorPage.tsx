import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, RefreshCw, AlertTriangle } from 'lucide-react';
import { Button } from '../components/ui/Button';

interface ErrorPageProps {
    error?: Error | undefined;
    resetError?: () => void;
}

export const ErrorPage = ({ error, resetError }: ErrorPageProps) => {
    return (
        <div className="min-h-screen bg-[#0d0d0d] text-white flex items-center justify-center p-4">
            <div className="w-full max-w-3xl text-center">
                {/* Анимированная иконка ошибки */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="mb-8 flex justify-center"
                >
                    <div className="w-32 h-32 rounded-full bg-[#EF3124]/10 flex items-center justify-center">
                        <AlertTriangle className="w-16 h-16 text-[#EF3124]" />
                    </div>
                </motion.div>

                {/* Сообщение об ошибке */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="space-y-4 mb-12"
                >
                    <h1 className="text-3xl font-bold text-white">
                        Что-то пошло не так
                    </h1>
                    <p className="text-gray-400 text-lg max-w-lg mx-auto">
                        В работе приложения произошла ошибка.
                        Мы уже работаем над её устранением.
                    </p>

                    {/* Детали ошибки */}
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.4 }}
                            className="mt-6"
                        >
                            <details className="text-left bg-[#1a1a1a] rounded-lg p-4 max-w-lg mx-auto">
                                <summary className="text-gray-400 cursor-pointer hover:text-white transition-colors">
                                    Показать детали ошибки
                                </summary>
                                <pre className="mt-2 text-sm text-red-400 overflow-auto p-2">
                                    {error.message}
                                    {error.stack && (
                                        <div className="mt-2 text-gray-500">
                                            {error.stack}
                                        </div>
                                    )}
                                </pre>
                            </details>
                        </motion.div>
                    )}
                </motion.div>

                {/* Кнопки */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="flex flex-col sm:flex-row gap-4 justify-center"
                >
                    {resetError && (
                        <Button
                            onClick={resetError}
                            variant="outline"
                            className="border-[#333] text-white hover:bg-[#1a1a1a] group"
                        >
                            <RefreshCw className="mr-2 h-4 w-4 transition-transform group-hover:rotate-180" />
                            Попробовать снова
                        </Button>
                    )}
                    <Link to="/">
                        <Button className="bg-[#EF3124] hover:bg-red-600 text-white group">
                            <Home className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
                            На главную
                        </Button>
                    </Link>
                </motion.div>

                {/* Декоративный элемент */}
                <div className="absolute inset-0 -z-10 overflow-hidden">
                    <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-gradient-to-br from-[#EF3124]/20 to-red-500/20 rounded-full blur-3xl" />
                </div>
            </div>
        </div>
    );
}; 