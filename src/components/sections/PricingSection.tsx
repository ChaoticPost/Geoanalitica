import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { Check, ArrowRight } from 'lucide-react'

const plans = [
    {
        name: 'Стартап',
        price: '4 900',
        description: 'Для малого бизнеса',
        features: [
            'До 3 локаций в месяц',
            'Базовая аналитика',
            'Экспорт в PDF',
            'Email поддержка',
            'Обновления раз в неделю'
        ]
    },
    {
        name: 'Бета-тест',
        price: '0',
        description: 'Попробуйте первым',
        features: [
            'Одна локация',
            'Базовая аналитика',
            'Экспорт в PDF',
            'Приоритетный доступ к новым функциям',
            'Помощь в развитии сервиса'
        ],
        popular: true,
        beta: true
    },
    {
        name: 'Бизнес',
        price: '14 900',
        description: 'Для растущих компаний',
        features: [
            'До 10 локаций в месяц',
            'Расширенная аналитика',
            'Экспорт в любом формате',
            'Приоритетная поддержка',
            'API доступ'
        ]
    }
]

export const PricingSection = () => {
    return (
        <section id="pricing" className="py-24 relative overflow-hidden">
            {/* Убираем декоративный фоновый элемент */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-16"
                >
                    <span className="inline-block text-primary font-medium mb-4 px-4 py-1 bg-primary/5 dark:bg-primary/10 rounded-full">
                        Тарифы
                    </span>
                    <h2 className="text-4xl font-bold text-foreground mb-4">
                        Выберите свой план
                    </h2>
                    <p className="text-muted-foreground text-lg">
                        Начните бесплатно в рамках бета-тестирования или выберите план для бизнеса
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                    {plans.map((plan, index) => (
                        <motion.div
                            key={plan.name}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            className={`
                                relative rounded-[32px] p-8 h-full
                                ${plan.popular
                                    ? 'bg-primary text-white shadow-xl'
                                    : 'bg-card hover:bg-card/80 transition-colors duration-300'
                                }
                            `}
                        >
                            {plan.beta && (
                                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                                    <span className="bg-background text-primary text-sm font-medium px-4 py-1 rounded-full shadow-sm">
                                        Бета
                                    </span>
                                </div>
                            )}
                            <div className="space-y-6">
                                <div>
                                    <h3 className={`text-2xl font-bold mb-2 ${plan.popular ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                                        {plan.name}
                                    </h3>
                                    <p className={`${plan.popular ? 'text-white/90' : 'text-gray-500 dark:text-gray-300'}`}>
                                        {plan.description}
                                    </p>
                                </div>

                                <div className={`pt-4 border-t ${plan.popular ? 'border-white/20' : 'border-gray-100 dark:border-gray-800'}`}>
                                    <div className="flex items-baseline">
                                        <span className={`text-5xl font-bold tracking-tight ${plan.popular ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                                            {plan.price}
                                        </span>
                                        <span className={`ml-2 text-2xl ${plan.popular ? 'text-white/90' : 'text-gray-500 dark:text-gray-300'}`}>
                                            {plan.price === '0' ? '' : '₽'}
                                        </span>
                                        <span className={`ml-2 ${plan.popular ? 'text-white/70' : 'text-gray-400 dark:text-gray-500'}`}>
                                            {plan.price === '0' ? '' : '/мес'}
                                        </span>
                                    </div>
                                </div>

                                <ul className="space-y-4 min-h-[280px]">
                                    {plan.features.map((feature) => (
                                        <li key={feature} className="flex items-start">
                                            <Check className={`h-5 w-5 mr-3 mt-0.5 ${plan.popular ? 'text-white' : 'text-red-500'}`}
                                                strokeWidth={3} />
                                            <span className={plan.popular ? 'text-white/90' : 'text-gray-600 dark:text-gray-300'}>
                                                {feature}
                                            </span>
                                        </li>
                                    ))}
                                </ul>

                                <Button
                                    variant={plan.popular ? 'outline' : 'default'}
                                    className={`
                                        w-full group relative overflow-hidden
                                        ${plan.popular
                                            ? 'bg-white text-red-500 hover:bg-red-50 border-white hover:border-white'
                                            : 'bg-red-500 text-white hover:bg-red-600 border-red-500'
                                        }
                                        h-12 rounded-2xl text-base font-medium
                                    `}
                                >
                                    <span className="relative z-10 flex items-center justify-center">
                                        {plan.beta ? 'Попробовать' : 'Выбрать план'}
                                        <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                                    </span>
                                </Button>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Нижняя подсказка */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    className="text-center mt-12 text-gray-500 dark:text-gray-400"
                >
                    Все цены указаны с учётом НДС. Оплата в рублях РФ.
                </motion.p>
            </div>
        </section>
    );
}; 