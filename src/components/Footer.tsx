import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MapPin, Mail, Phone } from 'lucide-react';

const footerAnimation = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            staggerChildren: 0.1
        }
    }
};

const itemAnimation = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
};

export const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={footerAnimation}
                className="mx-auto max-w-7xl px-6 py-12 lg:px-8"
            >
                <div className="flex flex-wrap justify-between gap-8 mb-12">
                    {/* Геоаналитика */}
                    <motion.div variants={itemAnimation} className="flex-1 min-w-[200px]">
                        <div className="flex items-center gap-2 mb-4">
                            <img src="/src/assets/images/icons/icon_geo.png" alt="GeoAnalitica" className="h-8 w-8" />
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                                GeoAnalitica
                            </h3>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 max-w-md mb-6">
                            Инновационные решения для анализа локаций и развития вашего бизнеса
                        </p>
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                                <MapPin className="h-5 w-5 text-red-500" />
                                <span>Москва, Пресненская наб., 12</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                                <Mail className="h-5 w-5 text-red-500" />
                                <a href="mailto:info@geoanalitica.com" className="hover:text-red-500 dark:hover:text-red-400">
                                    info@geoanalitica.com
                                </a>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                                <Phone className="h-5 w-5 text-red-500" />
                                <a href="tel:+74951234567" className="hover:text-red-500 dark:hover:text-red-400">
                                    +7 (495) 123-45-67
                                </a>
                            </div>
                        </div>
                    </motion.div>

                    {/* Продукт */}
                    <motion.div variants={itemAnimation} className="flex-1 min-w-[200px]">
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
                            ПРОДУКТ
                        </h4>
                        <ul className="space-y-3">
                            <li>
                                <a href="#features" className="text-gray-600 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400">
                                    Возможности
                                </a>
                            </li>
                            <li>
                                <a href="#pricing" className="text-gray-600 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400">
                                    Цены
                                </a>
                            </li>
                            <li>
                                <a href="#demo" className="text-gray-600 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400">
                                    Демо
                                </a>
                            </li>
                        </ul>
                    </motion.div>

                    {/* Компания */}
                    <motion.div variants={itemAnimation} className="flex-1 min-w-[200px]">
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
                            КОМПАНИЯ
                        </h4>
                        <ul className="space-y-3">
                            <li>
                                <a href="#about" className="text-gray-600 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400">
                                    О нас
                                </a>
                            </li>
                            <li>
                                <Link to="/contact" className="text-gray-600 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400">
                                    Контакты
                                </Link>
                            </li>
                            <li>
                                <Link to="/privacy" className="text-gray-600 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400">
                                    Конфиденциальность
                                </Link>
                            </li>
                        </ul>
                    </motion.div>

                    {/* Поддержка */}
                    <motion.div variants={itemAnimation} className="flex-1 min-w-[200px]">
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
                            ПОДДЕРЖКА
                        </h4>
                        <ul className="space-y-3">
                            <li>
                                <Link to="/faq" className="text-gray-600 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400">
                                    FAQ
                                </Link>
                            </li>
                            <li>
                                <Link to="/docs" className="text-gray-600 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400">
                                    Документация
                                </Link>
                            </li>
                            <li>
                                <a href="#contact" className="text-gray-600 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400">
                                    Связаться с нами
                                </a>
                            </li>
                        </ul>
                    </motion.div>
                </div>

                {/* Copyright */}
                <motion.div
                    variants={itemAnimation}
                    className="pt-8 mt-8 border-t border-gray-200 dark:border-gray-800"
                >
                    <p className="text-center text-gray-500 dark:text-gray-400">
                        © {currentYear} GeoAnalitica. Все права защищены.
                    </p>
                </motion.div>
            </motion.div>
        </footer>
    );
}; 