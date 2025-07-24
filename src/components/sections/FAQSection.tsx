import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

interface FAQItem {
    id: number;
    question: string;
    answer: string;
}

const faqItems: FAQItem[] = [
    {
        id: 1,
        question: 'Что такое геоаналитика?',
        answer: 'Геоаналитика — это комплексный анализ географических данных для принятия бизнес-решений. Мы анализируем пешеходный и автомобильный трафик, конкурентное окружение, социально-демографические показатели и другие факторы, чтобы помочь вам выбрать оптимальное место для бизнеса.'
    },
    {
        id: 2,
        question: 'Откуда берутся данные в Геоэффект?',
        answer: 'Мы используем данные из множества проверенных источников: геоинформационные системы, мобильные операторы, государственные базы данных, OpenStreetMap и собственные исследования. Все данные проходят тщательную проверку и обработку перед использованием.'
    },
    {
        id: 3,
        question: 'Насколько данные точны?',
        answer: 'Точность наших данных достигает 95-98%. Мы постоянно обновляем информацию и проводим перекрестную проверку из разных источников. Каждый анализ проходит многоступенчатую валидацию перед тем, как попасть в итоговый отчет.'
    },
    {
        id: 4,
        question: 'Как происходит фильтрация данных?',
        answer: 'Мы применяем многоуровневую систему фильтрации: очищаем данные от выбросов, учитываем сезонность, отфильтровываем нерелевантную информацию. Используем машинное обучение для повышения точности анализа и выявления значимых закономерностей.'
    },
    {
        id: 5,
        question: 'Кому может быть полезен Геоэффект?',
        answer: 'Наш сервис будет полезен владельцам розничного бизнеса, ресторанов, сферы услуг, а также девелоперам и инвесторам. Геоэффект помогает принимать обоснованные решения при выборе локации для нового бизнеса или оценке эффективности существующих точек.'
    }
];

export const FAQSection = () => {
    const [openItem, setOpenItem] = useState<number | null>(null);

    const toggleItem = (id: number) => {
        setOpenItem(openItem === id ? null : id);
    };

    return (
        <section id="faq" className="py-16 bg-white dark:bg-[#121212] relative">
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="max-w-4xl mx-auto px-4"
            >
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-4xl font-bold text-gray-900 dark:text-white text-center mb-12"
                >
                    Вопросы и ответы
                </motion.h2>

                <div className="space-y-4">
                    {faqItems.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden"
                        >
                            <button
                                onClick={() => toggleItem(item.id)}
                                className="w-full flex items-center justify-between p-6 text-left bg-gray-50 dark:bg-gray-900/50 hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors duration-200"
                            >
                                <span className="text-lg font-semibold text-gray-900 dark:text-white">
                                    {item.question}
                                </span>
                                <ChevronDown
                                    className={`w-5 h-5 text-gray-500 dark:text-gray-400 transition-transform duration-200 ${openItem === item.id ? 'transform rotate-180' : ''
                                        }`}
                                />
                            </button>

                            <AnimatePresence>
                                {openItem === item.id && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="p-6 bg-white dark:bg-gray-900/30">
                                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                                {item.answer}
                                            </p>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </section>
    );
}; 