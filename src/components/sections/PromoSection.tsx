import { Button } from '@/components/ui/Button';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export const PromoSection = () => {
  return (
    <section className="bg-gradient-to-b from-white to-gray-50 dark:from-black dark:to-gray-900 overflow-hidden">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="overflow-hidden rounded-3xl bg-white dark:bg-black shadow-lg border border-gray-100 dark:border-gray-800 relative"
        >
          {/* Градиентные подсветки */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.6 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="absolute -left-40 top-0 w-[400px] h-[400px] bg-gradient-to-r from-red-100 to-transparent dark:from-red-950 dark:to-transparent blur-3xl transform rotate-12"
          />
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.4 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2 }}
            className="absolute -right-40 bottom-0 w-[300px] h-[300px] bg-gradient-to-l from-red-100 to-transparent dark:from-red-950 dark:to-transparent blur-3xl transform -rotate-12"
          />

          <div className="relative px-6 py-8 sm:px-8 lg:p-12">
            <div className="flex flex-col lg:flex-row items-start justify-between gap-12">
              {/* Левая часть с текстом */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative z-10 max-w-lg"
              >
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6">
                  Не теряйте клиентов из-за неудачного расположения
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                  Используйте данные о проходимости и конкурентах, чтобы выбрать лучшее место для вашего магазина.
                  Анализируйте потенциал локации и принимайте решения на основе точных данных.
                </p>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    className="group bg-red-500 hover:bg-red-600 text-white px-8 py-3 text-lg rounded-xl w-full sm:w-auto flex items-center justify-center gap-2"
                    onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    Попробовать бесплатно
                    <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
                  </Button>
                </motion.div>
              </motion.div>

              {/* Правая часть с изображением */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="relative hidden lg:block lg:w-[50%] self-end"
              >
                <div className="w-full max-w-[480px]">
                  <motion.img
                    src="/src/assets/images/icons/rozn_geo.png"
                    alt="Геоаналитика для розничного бизнеса"
                    className="w-full h-auto object-contain"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}; 