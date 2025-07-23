import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { Check } from 'lucide-react'

const plans = [
    {
        name: 'Базовый',
        price: '4 900',
        description: 'Идеально для малого бизнеса',
        features: [
            'До 5 локаций в месяц',
            'Базовая аналитика',
            'Экспорт в PDF',
            'Email поддержка'
        ]
    },
    {
        name: 'Бизнес',
        price: '14 900',
        description: 'Для растущих компаний',
        features: [
            'До 20 локаций в месяц',
            'Расширенная аналитика',
            'Экспорт в любом формате',
            'Приоритетная поддержка',
            'API доступ'
        ],
        popular: true
    },
    {
        name: 'Корпоративный',
        price: '49 900',
        description: 'Максимальные возможности',
        features: [
            'Безлимитные локации',
            'Премиум аналитика',
            'Интеграция с CRM',
            '24/7 поддержка',
            'Персональный менеджер'
        ]
    }
]

export const PricingSection = () => {
    return (
        <section className="py-16 bg-gray-50 dark:bg-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                        Тарифные планы
                    </h2>
                    <p className="text-xl text-gray-500 dark:text-gray-300">
                        Выберите подходящий для вас план
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {plans.map((plan, index) => (
                        <motion.div
                            key={plan.name}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            className={`
                relative bg-white dark:bg-gray-900 rounded-lg shadow-sm p-8
                ${plan.popular ? 'ring-2 ring-red-500' : ''}
              `}
                        >
                            {plan.popular && (
                                <div className="absolute top-0 right-0 -mt-4 mr-4">
                                    <span className="bg-red-500 text-white text-sm font-medium px-3 py-1 rounded-full">
                                        Популярный
                                    </span>
                                </div>
                            )}
                            <div className="text-center">
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                    {plan.name}
                                </h3>
                                <p className="text-gray-500 dark:text-gray-300 mb-6">
                                    {plan.description}
                                </p>
                                <div className="flex items-center justify-center mb-6">
                                    <span className="text-4xl font-bold text-gray-900 dark:text-white">
                                        {plan.price}
                                    </span>
                                    <span className="text-gray-500 dark:text-gray-300 ml-2">₽/мес</span>
                                </div>
                                <Button
                                    variant={plan.popular ? 'default' : 'outline'}
                                    className="w-full mb-6"
                                >
                                    Выбрать план
                                </Button>
                                <ul className="space-y-4 text-left">
                                    {plan.features.map((feature) => (
                                        <li key={feature} className="flex items-start">
                                            <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                                            <span className="text-gray-500 dark:text-gray-300">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
} 