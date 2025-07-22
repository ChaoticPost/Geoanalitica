import { motion } from 'framer-motion'
import { MapPin, BarChart, Users, Building } from 'lucide-react'

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
]

const AboutPage = () => {
    return (
        <div className="py-12 bg-white dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="lg:text-center">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                        О нашей платформе
                    </h2>
                    <p className="mt-4 max-w-2xl text-xl text-gray-500 dark:text-gray-300 lg:mx-auto">
                        Мы помогаем бизнесу принимать правильные решения на основе данных
                    </p>
                </div>

                <div className="mt-10">
                    <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
                        {features.map((feature, index) => {
                            const Icon = feature.icon
                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.2 }}
                                    className="relative"
                                >
                                    <div className="flex flex-col items-center text-center">
                                        <div className="flex items-center justify-center h-12 w-12 rounded-md bg-red-500 text-white mb-4">
                                            <Icon className="h-6 w-6" aria-hidden="true" />
                                        </div>
                                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                            {feature.title}
                                        </h3>
                                        <p className="text-base text-gray-500 dark:text-gray-300">
                                            {feature.description}
                                        </p>
                                    </div>
                                </motion.div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AboutPage
