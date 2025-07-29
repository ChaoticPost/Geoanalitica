import { useEffect, useRef, useState } from 'react';
import { load } from '@2gis/mapgl';
import type { MapglMap } from '@2gis/mapgl';
import { motion } from 'framer-motion';
import { Lightbulb, Plus, Minus, Maximize2, Store, Users, Building } from 'lucide-react';
import { RecommendationsGrid } from '@/components/sections/RecommendationsGrid';
import { useNavigate } from 'react-router-dom';
import { HeatScale } from '@/components/ui/HeatScale';
import { HexagonLayer } from '@/components/map/HexagonLayer';

// 2GIS API Key
const MAP_API_KEY = '2cb31629-9703-41ac-8398-e2da9fa78838';

type AnalysisType = 'buyers' | 'competitors' | 'products';

const scaleLabels = {
  buyers: { min: 'Низкий трафик', max: 'Высокий трафик' },
  competitors: { min: 'Мало конкурентов', max: 'Много конкурентов' },
  products: { min: 'Узкий ассортимент', max: 'Широкий ассортимент' },
};

export const DemoSection = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<MapglMap | null>(null);
  const hexagonLayer = useRef<HexagonLayer | null>(null);
  const [mapError, setMapError] = useState<string | null>(null);
  const [showTutorial, setShowTutorial] = useState(true);
  const [analysisType, setAnalysisType] = useState<AnalysisType>('buyers');
  const [isMapReady, setIsMapReady] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();

  // Определяем мобильное устройство
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const analysisOptions = [
    { id: 'buyers' as const, label: 'Покупатели', icon: Users },
    { id: 'competitors' as const, label: 'Конкуренты', icon: Store },
    { id: 'products' as const, label: 'Продукты', icon: Building }
  ];

  // Функция для изменения зума
  const handleZoom = (direction: 'in' | 'out') => {
    if (!mapInstance.current) return;

    const currentZoom = mapInstance.current.getZoom();
    const newZoom = direction === 'in' ? currentZoom + 1 : currentZoom - 1;
    mapInstance.current.setZoom(newZoom);
  };

  // Функция для инициализации слоя гексагонов
  const initHexagonLayer = () => {
    if (!mapInstance.current) return;

    try {
      // Очищаем предыдущий слой
      if (hexagonLayer.current) {
        hexagonLayer.current.destroy();
        hexagonLayer.current = null;
      }

      // Яркие цвета для каждого типа анализа
      const colors = {
        buyers: '#ef4444',      // Красный
        competitors: '#22c55e', // Зеленый
        products: '#a855f7'     // Фиолетовый
      };

      // Создаем новый слой с выбранным цветом
      hexagonLayer.current = new HexagonLayer(mapInstance.current, colors[analysisType]);
    } catch (error) {
      console.error('Error creating hexagon layer:', error);
      setMapError('Ошибка при создании слоя гексагонов');
    }
  };

  useEffect(() => {
    let cleanup: (() => void) | undefined;

    const initializeMap = async () => {
      try {
        if (!mapContainer.current) return;

        // Загружаем API
        const mapglAPI = await load();

        // Если карта уже создана, не создаем новую
        if (mapInstance.current) return;

        // Создаем карту с фиксированным зумом
        const map = new mapglAPI.Map(mapContainer.current, {
          center: [37.519352, 55.633520], // Коньково
          zoom: isMobile ? 12 : 14, // Меньший зум для мобильных
          key: MAP_API_KEY,
          styleZoom: isMobile ? 12 : 14,
          style: 'c080bb6a-8134-4993-93a1-5b4d8c36a59b',
          zoomControl: false,
          maxZoom: 19,
          minZoom: 5,
        });

        // Сохраняем инстанс карты
        mapInstance.current = map;

        // Ждем полной загрузки карты
        map.on('load', () => {
          setIsMapReady(true);
          // Инициализируем слой только если не показываем обучение
          if (!showTutorial) {
            setTimeout(() => {
              initHexagonLayer();
            }, 100);
          }
        });

        cleanup = () => {
          if (hexagonLayer.current) {
            hexagonLayer.current.destroy();
            hexagonLayer.current = null;
          }
          if (mapInstance.current) {
            mapInstance.current.destroy();
            mapInstance.current = null;
          }
        };
      } catch (error) {
        console.error('Error initializing map:', error);
        setMapError('Ошибка при загрузке карты');
      }
    };

    initializeMap();
    return () => cleanup?.();
  }, [isMobile]);

  // Обновляем слой при закрытии обучающего меню
  useEffect(() => {
    if (!showTutorial && isMapReady && mapInstance.current) {
      setTimeout(() => {
        initHexagonLayer();
      }, 100);
    }
  }, [showTutorial, isMapReady]);

  // Обновляем при смене типа анализа
  useEffect(() => {
    if (!showTutorial && isMapReady && mapInstance.current) {
      setTimeout(() => {
        initHexagonLayer();
      }, 100);
    }
  }, [analysisType, isMapReady]);

  return (
    <section id="demo" className="min-h-[calc(100vh-4rem)] flex items-center bg-white dark:bg-[#0f0f0f]">
      <div className="max-w-6xl mx-auto px-4 w-full py-8">
        <h2 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-4">
          Интерактивная демонстрация
        </h2>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
          Посмотрите, как работает наша платформа на реальных данных
        </p>

        {/* Карта на всю ширину */}
        <div className="w-full">
          <div className="relative w-full h-[400px] md:h-[500px] rounded-xl overflow-hidden">
            <div className="absolute inset-0 bg-gray-100 dark:bg-gray-800">
              {mapError ? (
                <div className="absolute inset-0 flex items-center justify-center p-4 text-red-500">
                  {mapError}
                </div>
              ) : (
                <>
                  <div
                    ref={mapContainer}
                    className="absolute inset-0 z-10"
                    style={{ width: '100%', height: '100%' }}
                  />
                  {showTutorial ? (
                    // Обучающее меню
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 w-[90%] md:w-[360px] bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-200/20 dark:border-gray-700/20">
                      <div className="p-4 md:p-5 border-b border-gray-200 dark:border-gray-700/50">
                        <div className="text-lg font-semibold text-gray-900 dark:text-white text-center">
                          ВЫ В ДЕМО-ВЕРСИИ КАРТЫ
                        </div>
                        <div className="mt-1 text-sm text-gray-600 dark:text-gray-400 flex items-center justify-center gap-2">
                          <span className="font-medium">Москва</span>
                          <span className="w-1 h-1 rounded-full bg-gray-400 dark:bg-gray-500"></span>
                          <span>район Коньково</span>
                        </div>
                      </div>

                      {/* Таб */}
                      <div className="px-4 md:px-5 py-4">
                        <button
                          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary/10 dark:bg-primary/20 text-primary rounded-lg"
                        >
                          <Store className="w-4 h-4" />
                          <span className="font-medium">Ритейл</span>
                        </button>
                      </div>

                      <div className="px-4 md:px-5 pb-4 md:pb-5">
                        <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-4">
                          Чтобы посмотреть детальную статистику района,
                          нажмите на нужную область карты
                        </p>

                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => setShowTutorial(false)}
                            className="text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors underline-offset-2 hover:underline"
                          >
                            Пропустить обучение
                          </button>
                          <button
                            onClick={() => setShowTutorial(false)}
                            className="flex-1 px-4 py-1.5 text-sm font-medium text-white bg-primary hover:bg-primary/90 rounded-lg transition-colors"
                          >
                            Далее
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* Верхняя панель с опциями анализа */}
                      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20 w-[90%] md:w-auto">
                        <div className="flex flex-wrap md:flex-nowrap justify-center bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-full shadow-lg border border-gray-200/20 dark:border-gray-700/20 p-1 gap-1">
                          {analysisOptions.map((option) => {
                            const Icon = option.icon;
                            return (
                              <button
                                key={option.id}
                                onClick={() => setAnalysisType(option.id)}
                                className={`flex items-center gap-2 px-3 md:px-4 py-2 rounded-full transition-all flex-1 md:flex-none justify-center ${analysisType === option.id
                                  ? 'bg-primary text-white shadow-sm'
                                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50'
                                  }`}
                              >
                                <Icon className="w-4 h-4" />
                                <span className="text-sm font-medium whitespace-nowrap">{option.label}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Шкала интенсивности */}
                      <div className={`absolute ${isMobile ? 'bottom-20 left-1/2 -translate-x-1/2' : 'bottom-24 left-4'} z-20`}>
                        <HeatScale
                          min={scaleLabels[analysisType].min}
                          max={scaleLabels[analysisType].max}
                          className={isMobile ? 'transform scale-90' : ''}
                        />
                      </div>
                    </>
                  )}

                  {/* Кастомные кнопки зума в правом верхнем углу */}
                  <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
                    <button
                      onClick={() => handleZoom('in')}
                      className="w-8 h-8 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-lg shadow-lg flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border border-gray-200/20 dark:border-gray-700/20"
                      aria-label="Приблизить"
                    >
                      <Plus className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                    </button>
                    <button
                      onClick={() => handleZoom('out')}
                      className="w-8 h-8 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-lg shadow-lg flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border border-gray-200/20 dark:border-gray-700/20"
                      aria-label="Отдалить"
                    >
                      <Minus className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                    </button>
                  </div>

                  {/* Кнопка открытия полной карты */}
                  <button
                    onClick={() => navigate('/map')}
                    className="absolute bottom-4 left-1/2 transform -translate-x-1/2 md:left-4 md:transform-none z-20 px-4 py-2 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-lg shadow-lg flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-medium text-gray-900 dark:text-white border border-gray-200/20 dark:border-gray-700/20"
                  >
                    <Maximize2 className="w-4 h-4" />
                    <span className="whitespace-nowrap">Открыть полную карту</span>
                  </button>
                </>
              )}
            </div>
          </div>
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

        {/* Заголовок для рекомендаций */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="mt-16 text-center"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Топ рекомендации для вашего бизнеса
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8">
            На основе анализа локаций подберем оптимальные варианты помещений с учетом проходимости, конкуренции и стоимости аренды
          </p>
        </motion.div>

        {/* Сетка рекомендаций */}
        <RecommendationsGrid />
      </div>
    </section>
  );
}; 