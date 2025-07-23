import { motion } from 'framer-motion'
import { Map, Users, TrendingUp, Building2 } from 'lucide-react'

const analyticFeatures = [
    {
        icon: Map,
        title: 'Анализ локации',
        description: 'Оценка проходимости, транспортной доступности и инфраструктуры'
    },
    {
        icon: Users,
        title: 'Анализ аудитории',
        description: 'Исследование социально-демографических характеристик района'
    },
    {
        icon: TrendingUp,
        title: 'Прогноз развития',
        description: 'Оценка потенциала развития территории и будущего спроса'
    },
    {
        icon: Building2,
        title: 'Конкурентный анализ',
        description: 'Исследование конкурентной среды и рыночной ниши'
    }
]

export const LocationAnalytics = () => {
    return (
        <section className="py-16 bg-white dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                        Комплексный анализ локаций
                    </h2>
                    <p className="text-xl text-gray-500 dark:text-gray-300">
                        Получите полное понимание потенциала любой локации
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {analyticFeatures.map((feature, index) => {
                        const Icon = feature.icon
                        return (
                            <motion.div
                                key={feature.title}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1, duration: 0.5 }}
                                className="relative bg-gray-50 dark:bg-gray-800 rounded-lg p-6"
                            >
                                <div className="absolute top-0 right-0 -mt-4 mr-4">
                                    <div className="rounded-full bg-red-100 dark:bg-red-900 p-3">
                                        <Icon className="h-6 w-6 text-red-600 dark:text-red-200" />
                                    </div>
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3 mt-4">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-500 dark:text-gray-300">
                                    {feature.description}
                                </p>
                            </motion.div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
} 