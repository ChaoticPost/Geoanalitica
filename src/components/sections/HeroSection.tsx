import { type ReactElement } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/Button';

export const HeroSection = (): ReactElement => {
    return (
        <section className="relative isolate min-h-[calc(100vh-4rem)] flex items-center justify-center bg-white dark:bg-black">            {/* Subtle gradient accents */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.15 }}
                transition={{ duration: 2 }}
                className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden sm:-top-80 pointer-events-none"
                aria-hidden="true"
            >
                <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-red-500/20 to-transparent dark:from-red-500/10 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" />
            </motion.div>

            <div className="w-full">
                <div className="mx-auto max-w-2xl px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center relative z-10"
                    >
                        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl bg-transparent">
                            Геоаналитика для вашего бизнеса
                        </h1>
                        <p className="mt-6 text-lg leading-8 text-gray-700 dark:text-gray-300">
                            Используйте данные о проходимости и конкурентах, чтобы выбрать лучшее место для вашего магазина.
                            Анализируйте потенциал локации и принимайте решения на основе точных данных.
                        </p>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="mt-10 flex items-center justify-center gap-x-6"
                        >
                            <Button
                                className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                            >
                                Попробовать бесплатно
                            </Button>
                            <Button
                                variant="ghost"
                                className="text-base font-semibold text-gray-900 dark:text-gray-200 hover:text-red-500 dark:hover:text-red-400 transition-colors duration-200"
                                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                            >
                                Узнать больше
                            </Button>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}; 