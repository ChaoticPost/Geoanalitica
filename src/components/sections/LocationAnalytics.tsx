import { MapPin, User, DollarSign, BarChart2, Clock, Target } from 'lucide-react';
import { motion } from 'framer-motion';

interface Feature {
    icon: React.ElementType;
    title: string;
    description: string;
}

const features: Feature[] = [
    {
        icon: MapPin,
        title: 'Анализ локации',
        description: 'Детальный анализ каждого района с учетом пешеходного трафика, транспортной доступности и конкурентной среды'
    },
    {
        icon: User,
        title: 'Портрет аудитории',
        description: 'Изучение демографии и покупательской способности потенциальных клиентов в выбранном районе'
    },
    {
        icon: DollarSign,
        title: 'Прогноз доходности',
        description: 'Расчет ожидаемой выручки и ROI на основе данных о схожих точках в аналогичных локациях'
    },
    {
        icon: BarChart2,
        title: 'Конкурентный анализ',
        description: 'Оценка конкурентной среды, анализ цен и уникальных преимуществ ваших конкурентов'
    },
    {
        icon: Clock,
        title: 'Оптимальное время',
        description: 'Рекомендации по времени открытия с учетом сезонности и рыночных трендов'
    },
    {
        icon: Target,
        title: 'Точные рекомендации',
        description: 'Готовые решения с конкретными адресами и обоснованием выбора каждой локации'
    }
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5
        }
    }
};

const FeatureCard = ({ feature, index }: { feature: Feature; index: number }) => {
    const Icon = feature.icon;

    return (
        <motion.div
            variants={itemVariants}
            className="relative flex flex-col p-8 bg-gray-50 dark:bg-gray-900 rounded-3xl group hover:shadow-xl transition-shadow"
        >
            <div className="relative">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 dark:bg-gray-800 group-hover:bg-red-500 transition-colors">
                    <Icon className="h-8 w-8 text-gray-500 dark:text-gray-400 group-hover:text-white transition-colors" />
                </div>
                {/* Декоративный элемент */}
                <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-red-500/20 to-transparent opacity-0 group-hover:opacity-100 blur transition-opacity" />
            </div>

            <h3 className="mt-6 text-2xl font-semibold text-gray-900 dark:text-white group-hover:text-red-500 dark:group-hover:text-red-400 transition-colors">
                {feature.title}
            </h3>
            <p className="mt-4 text-lg leading-relaxed text-gray-500 dark:text-gray-400">
                {feature.description}
            </p>
        </motion.div>
    );
};

export const LocationAnalytics = () => {
    return (
        <section id="features" className="py-24 bg-white dark:bg-black relative overflow-hidden">
            {/* Декоративный фоновый элемент */}
            <div className="absolute inset-0 bg-gradient-to-b from-gray-50/50 to-transparent dark:from-gray-900/50 pointer-events-none" />

            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={containerVariants}
                className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
            >
                {/* Заголовок секции */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        Комплексный анализ локаций
                    </h2>
                    <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                        Используйте передовые технологии геоаналитики для принятия обоснованных решений при выборе места для вашего бизнеса
                    </p>
                </motion.div>

                {/* Сетка с фичами */}
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {features.map((feature, index) => (
                        <FeatureCard key={index} feature={feature} index={index} />
                    ))}
                </div>
            </motion.div>
        </section>
    );
}; 