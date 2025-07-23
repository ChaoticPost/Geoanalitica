import { motion } from 'framer-motion'
import { CheckCircle } from 'lucide-react'

const features = [
  {
    title: 'Точность данных',
    description: 'Используем только проверенные источники и актуальные данные'
  },
  {
    title: 'Быстрый анализ',
    description: 'Результаты анализа доступны в течение нескольких минут'
  },
  {
    title: 'Гибкая настройка',
    description: 'Настраивайте параметры анализа под ваши задачи'
  },
  {
    title: 'Экспорт отчетов',
    description: 'Выгружайте результаты в удобном для вас формате'
  }
]

export const PromoSection = () => {
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
            Почему выбирают нас
          </h2>
          <p className="text-xl text-gray-500 dark:text-gray-300">
            Мы предоставляем полный набор инструментов для геоаналитики
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="bg-white dark:bg-gray-900 rounded-lg shadow-sm p-6"
            >
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-200 mb-4 mx-auto">
                <CheckCircle className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white text-center mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-500 dark:text-gray-300 text-center">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
} 