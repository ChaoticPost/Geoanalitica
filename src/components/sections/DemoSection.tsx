import { useEffect, useRef, useState } from 'react';
import { load } from '@2gis/mapgl';
import { motion } from 'framer-motion';
import { MapPin, Users, TrendingUp, BarChart, Lightbulb } from 'lucide-react';

// 2GIS API Key from environment variables
const MAP_API_KEY = import.meta.env.VITE_2GIS_API_KEY;

if (!MAP_API_KEY) {
  console.error('2GIS API key is not set in environment variables');
}

type BusinessType = 'retail' | 'restaurants' | 'services';

interface Metric {
  icon: React.ElementType;
  value: string;
  description: string;
  color: string;
}

const metrics: Metric[] = [
  {
    icon: MapPin,
    value: '1M+',
    description: 'Проанализированных локаций',
    color: 'bg-blue-500'
  },
  {
    icon: Users,
    value: '500+',
    description: 'Довольных клиентов',
    color: 'bg-green-500'
  },
  {
    icon: TrendingUp,
    value: '150%',
    description: 'Средний рост выручки',
    color: 'bg-purple-500'
  },
  {
    icon: BarChart,
    value: '250+',
    description: 'Факторов анализа',
    color: 'bg-red-500'
  }
];

export const DemoSection = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const [selectedType, setSelectedType] = useState<BusinessType>('restaurants');
  const [mapError, setMapError] = useState<string | null>(null);

  useEffect(() => {
    let cleanup: (() => void) | undefined;

    const initializeMap = async () => {
      try {
        console.log('Initializing 2GIS map...');
        const mapglAPI = await load();

        if (mapInstance.current || !mapContainer.current) return;

        console.log('Creating map instance...');
        // Создаем карту
        mapInstance.current = new mapglAPI.Map(mapContainer.current, {
          center: [37.618423, 55.751244], // Москва
          zoom: 13,
          key: MAP_API_KEY,
          style: 'c080bb6a-8134-4993-93a1-5b4d8c36a59b', // Темная тема для карты
        });

        console.log('Map initialized successfully');

        cleanup = () => {
          if (mapInstance.current) {
            console.log('Destroying map instance...');
            mapInstance.current.destroy();
            mapInstance.current = null;
          }
        };
      } catch (error) {
        console.error('Error initializing map:', error);
        setMapError('Ошибка при загрузке карты. Пожалуйста, попробуйте позже.');
      }
    };

    initializeMap();
    return () => cleanup?.();
  }, []);

  const businessTypes: { id: BusinessType; label: string }[] = [
    { id: 'retail', label: 'Ритейл' },
    { id: 'restaurants', label: 'Рестораны' },
    { id: 'services', label: 'Услуги' }
  ];

  return (
    <section id="demo" className="py-16 bg-white dark:bg-[#121212] relative">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto px-4"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Интерактивная демонстрация
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            Посмотрите, как работает наша платформа на реальных данных. Выберите тип бизнеса и исследуйте аналитику для разных локаций.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Правая колонка с картой */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="order-2 lg:order-1"
          >
            <div className="w-full" style={{ height: '500px' }}>
              <div className="relative w-full h-full rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 shadow-lg">
                {mapError ? (
                  <div className="absolute inset-0 flex items-center justify-center p-4 text-red-500 bg-gray-100 dark:bg-gray-800">
                    {mapError}
                  </div>
                ) : (
                  <div
                    ref={mapContainer}
                    className="absolute inset-0"
                    style={{
                      width: '100%',
                      height: '100%',
                    }}
                  />
                )}
              </div>
            </div>
          </motion.div>

          {/* Левая колонка с контролами */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="space-y-6 order-1 lg:order-2 relative z-10"
          >
            {/* Кнопки выбора */}
            <div className="grid grid-cols-1 gap-3">
              {businessTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  className={`px-5 py-3 text-sm font-medium rounded-lg transition-colors ${selectedType === type.id
                    ? 'bg-red-500 text-white hover:bg-red-600'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                >
                  {type.label}
                </button>
              ))}
              </div>

            {/* Метрики */}
            <div className="grid grid-cols-2 gap-3">
              {metrics.map((metric, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  className="p-4 rounded-lg bg-gray-100 dark:bg-gray-800 hover:shadow-lg transition-shadow"
                >
                  <div className={`w-10 h-10 ${metric.color} rounded-lg flex items-center justify-center mb-3`}>
                    <metric.icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                    {metric.value}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {metric.description}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Информационный блок */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-16 bg-slate-50 dark:bg-gray-800/50 rounded-2xl p-6 shadow-sm"
        >
          <div className="flex items-start gap-4 max-w-3xl mx-auto">
            <div className="flex-shrink-0 w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center">
              <Lightbulb className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Совет
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Благодаря геоаналитике вы сможете получить информацию о лучших локациях для вашего бизнеса. Используйте анализ трафика, конкуренции и стоимости аренды, чтобы принимать обоснованные решения.
              </p>
        </div>
      </div>
        </motion.div>

        {/* Заголовок для карточек */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="text-2xl font-bold text-gray-900 dark:text-white mt-16 mb-8 text-center"
        >
          Топ рекомендации для вашего бизнеса
        </motion.h2>
      </motion.div>
    </section>
  );
}; 