import { motion } from 'framer-motion';
import { MapPin, Clock, Building2, ArrowRight } from 'lucide-react';

interface Recommendation {
    address: string;
    price: string;
    type: string;
    walkTime: string;
    district: string;
    rating: number;
}

const recommendations: Recommendation[] = [
    {
        address: 'ул. Тверская, 15',
        price: '120 000 руб/мес',
        type: 'Аренда',
        walkTime: '15 мин',
        district: 'Центральный',
        rating: 4.5
    },
    {
        address: 'ул. Арбат, 42',
        price: '95 000 руб/мес',
        type: 'Аренда',
        walkTime: '25 мин',
        district: 'Туристический район',
        rating: 4.8
    },
    {
        address: 'ул. Покровка, 27',
        price: '85 000 руб/мес',
        type: 'Аренда',
        walkTime: '10 мин',
        district: 'Деловой район',
        rating: 4.3
    }
];

export const RecommendationsGrid = () => {
    return (
        <div className="mt-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recommendations.map((rec, index) => (
                    <motion.div
                        key={rec.address}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1, duration: 0.5 }}
                        className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
                    >
                        {/* Рейтинг */}
                        <div className="flex items-center justify-between mb-4">
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300">
                                {rec.rating} / 5.0
                            </span>
                            <span className="text-sm text-gray-500 dark:text-gray-400">{rec.district}</span>
                        </div>

                        {/* Адрес */}
                        <div className="flex items-start gap-3 mb-4">
                            <MapPin className="w-5 h-5 text-red-500 flex-shrink-0 mt-1" />
                            <div>
                                <h3 className="font-medium text-gray-900 dark:text-white mb-1">
                                    {rec.address}
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {rec.type}
                                </p>
                            </div>
                        </div>

                        {/* Время и цена */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                                <Clock className="w-4 h-4 text-gray-400" />
                                <span>До метро: {rec.walkTime}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                                <Building2 className="w-4 h-4 text-gray-400" />
                                <span>{rec.price}</span>
                            </div>
                        </div>

                        {/* Кнопка "Подробнее" */}
                        <button className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-red-500 dark:hover:text-red-400 transition-colors rounded-lg border border-gray-200 dark:border-gray-700 hover:border-red-500 dark:hover:border-red-500 group">
                            Подробнее
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}; 