import React from 'react';
import { MapPin, BarChart, Users, Building } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
    {
        icon: MapPin,
        title: 'Точная геолокация',
        description: 'Определяем лучшие локации для вашего бизнеса с точностью до метра'
    },
    {
        icon: BarChart,
        title: 'Глубокая аналитика',
        description: 'Анализируем более 100 параметров для каждой локации'
    },
    {
        icon: Users,
        title: 'Анализ аудитории',
        description: 'Детальное понимание вашей целевой аудитории в каждой локации'
    },
    {
        icon: Building,
        title: 'Конкурентный анализ',
        description: 'Полный анализ конкурентной среды в выбранном районе'
    }
];

const FeatureCard = ({ Icon, title, description }: { Icon: React.ElementType; title: string; description: string }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="p-6 rounded-2xl bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 hover:border-red-500/30 dark:hover:border-red-500/30 hover:shadow-md transition-all"
    >
        <div className="w-12 h-12 rounded-lg bg-red-100 dark:bg-red-900/20 flex items-center justify-center mb-4">
            <Icon className="w-6 h-6 text-red-500" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
            {title}
        </h3>
        <p className="text-gray-600 dark:text-gray-300">
            {description}
        </p>
    </motion.div>
);

const BenefitCard = ({ title, description }: { title: string; description: string }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="p-6 rounded-2xl bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 hover:border-red-500/30 dark:hover:border-red-500/30 hover:shadow-md transition-all"
    >
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
            {title}
        </h3>
        <p className="text-gray-600 dark:text-gray-300">
            {description}
        </p>
    </motion.div>
);

export const AboutSection = () => {
    return (
        <section id="about" className="py-24 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Features Section */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                        Наши возможности
                    </h2>
                    <p className="text-xl text-gray-600 dark:text-gray-300">
                        Комплексный подход к анализу локаций
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
                    {features.map((feature, index) => (
                        <FeatureCard
                            key={index}
                            Icon={feature.icon}
                            title={feature.title}
                            description={feature.description}
                        />
                    ))}
                </div>

                {/* Benefits Section */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                        Почему выбирают нас
                    </h2>
                    <p className="text-xl text-gray-600 dark:text-gray-300">
                        Преимущества работы с GeoAnalytica
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[
                        {
                            title: "Точные данные",
                            description: "Используем актуальные данные о трафике, конкурентах и целевой аудитории"
                        },
                        {
                            title: "Быстрый результат",
                            description: "Предоставляем готовый анализ и рекомендации в течение 24 часов"
                        },
                        {
                            title: "Экономия ресурсов",
                            description: "Сокращаем время и затраты на поиск подходящей локации"
                        },
                        {
                            title: "Комплексный подход",
                            description: "Учитываем все факторы, влияющие на успех в выбранной локации"
                        },
                        {
                            title: "Поддержка экспертов",
                            description: "Консультируем по всем вопросам на каждом этапе работы"
                        },
                        {
                            title: "Гарантия результата",
                            description: "Предоставляем гарантию возврата средств, если вас не устроит результат"
                        }
                    ].map((item, index) => (
                        <BenefitCard
                            key={index}
                            title={item.title}
                            description={item.description}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}; 