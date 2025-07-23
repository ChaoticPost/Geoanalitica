import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Search } from 'lucide-react'

export const DemoSection = () => {
  return (
    <section className="py-16 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Попробуйте демо-анализ
            </h2>
            <p className="text-xl text-gray-500 dark:text-gray-300 mb-8">
              Введите адрес и получите бесплатный пробный анализ локации с основными метриками
            </p>
            <form className="space-y-4">
              <Input
                type="text"
                placeholder="Введите адрес локации"
                icon={Search}
                className="w-full"
              />
              <Button size="lg" className="w-full sm:w-auto">
                Получить анализ
              </Button>
            </form>
          </motion.div>

          <motion.div
            className="mt-10 lg:mt-0"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
              <div className="aspect-w-16 aspect-h-9 mb-6">
                <img
                  src="/demo-map.jpg"
                  alt="Демо карта"
                  className="rounded-lg object-cover"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white dark:bg-gray-900 p-4 rounded-lg">
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Проходимость
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    2,500+
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    человек/день
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-900 p-4 rounded-lg">
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Конкуренты
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    12
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    в радиусе 1 км
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
} 