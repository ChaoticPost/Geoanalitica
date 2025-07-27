import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const NotFoundPage = () => {
    return (
        <div className="min-h-screen bg-[#0d0d0d] text-white flex items-center justify-center p-4">
            <div className="w-full max-w-3xl text-center">
                {/* Анимированный номер ошибки */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-8"
                >
                    <h1 className="text-[150px] font-bold leading-none bg-clip-text text-transparent bg-gradient-to-r from-[#EF3124] to-red-500">
                        404
                    </h1>
                </motion.div>

                {/* Сообщение об ошибке */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="space-y-4 mb-12"
                >
                    <h2 className="text-3xl font-bold text-white">
                        Страница не найдена
                    </h2>
                    <p className="text-gray-400 text-lg max-w-lg mx-auto">
                        Возможно, страница была удалена или её адрес был изменён.
                        Проверьте правильность ссылки или вернитесь на главную.
                    </p>
                </motion.div>

                {/* Кнопки */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="flex flex-col sm:flex-row gap-4 justify-center"
                >
                    <Button
                        onClick={() => window.history.back()}
                        variant="outline"
                        className="border-[#333] text-white hover:bg-[#1a1a1a] group"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                        Вернуться назад
                    </Button>
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