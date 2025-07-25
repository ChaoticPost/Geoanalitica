import { motion } from 'framer-motion';
import { Button } from '../ui/Button';
import { ArrowRight } from 'lucide-react';
import storeImage from '../../assets/images/photos/rozn_geo.png';

export const PromoSection = () => {
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative max-w-4xl mx-auto"
        >
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
            <div className="flex flex-col md:flex-row items-center">
              {/* Текстовый контент */}
              <div className="p-8 md:p-12 flex-1">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  Не теряйте клиентов из-за неудачного расположения
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                  Используйте данные о проходимости и конкурентах, чтобы выбрать лучшее место для вашего магазина. Анализируйте потенциал локации и принимайте решения на основе точных данных.
                </p>
                <Button
                  variant="default"
                  size="lg"
                  className="bg-red-500 hover:bg-red-600 text-white w-full md:w-auto"
                >
                  Попробовать бесплатно
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>

              {/* Изображение */}
              <div className="flex-shrink-0 w-full md:w-2/5 p-4 md:p-0 md:self-end">
                <div className="relative w-full">
                  <motion.img
                    src={storeImage}
                    alt="Store location"
                    className="w-full h-auto object-contain md:scale-125 md:translate-x-4 md:translate-y-4"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}; 