import { useEffect, useRef, useState, useCallback } from 'react';
import { load } from '@2gis/mapgl';
import type { Map as MapGL, MapGLOptions } from '@2gis/mapgl/types';
import { Maximize2, Store, Users, Building, Plus, Minus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { HeatScale } from '@/components/ui/HeatScale';
import { createHexagonLayer, type Point } from '@/utils/hexagonUtils';

// 2GIS API Key
const MAP_API_KEY = '2cb31629-9703-41ac-8398-e2da9fa78838';

type AnalysisType = 'buyers' | 'competitors' | 'products';

const scaleLabels = {
  buyers: { min: 'Низкий трафик', max: 'Высокий трафик' },
  competitors: { min: 'Мало конкурентов', max: 'Много конкурентов' },
  products: { min: 'Узкий ассортимент', max: 'Широкий ассортимент' },
};

// Генерируем тестовые точки вокруг Коньково
const generateTestPoints = (center: { lat: number; lng: number }, count: number): Point[] => {
  const points: Point[] = [];
  const radius = 0.02; // ~2km radius

  for (let i = 0; i < count; i++) {
    // Генерируем случайные точки в круге
    const r = Math.sqrt(Math.random()) * radius;
    const theta = Math.random() * 2 * Math.PI;

    const lat = center.lat + r * Math.cos(theta);
    const lng = center.lng + r * Math.sin(theta);

    points.push({ lat, lng });
  }

  console.log('Generated test points:', {
    center,
    count,
    firstPoint: points[0],
    lastPoint: points[points.length - 1],
    totalPoints: points.length
  });

  return points;
};

// Тестовые точки для демонстрации - генерируем больше точек для лучшей визуализации
const TEST_POINTS = [
  ...generateTestPoints({ lat: 55.633520, lng: 37.519352 }, 300), // Коньково
  ...generateTestPoints({ lat: 55.641109, lng: 37.510925 }, 200), // Беляево
  ...generateTestPoints({ lat: 55.628290, lng: 37.524487 }, 250)  // Тёплый Стан
];

console.log('Total test points:', TEST_POINTS.length);

const analysisOptions = [
  { id: 'buyers' as const, label: 'Покупатели', icon: Users },
  { id: 'competitors' as const, label: 'Конкуренты', icon: Store },
  { id: 'products' as const, label: 'Продукты', icon: Building }
];

export const DemoSection = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<MapGL | null>(null);
  const hexagonLayerRef = useRef<{ destroy: () => void; update: () => void } | null>(null);
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

  // Инициализация карты
  useEffect(() => {
    let mounted = true;

    const initializeMap = async () => {
      // Очищаем предыдущую карту, если она существует
      if (mapInstance.current) {
        if (hexagonLayerRef.current) {
          hexagonLayerRef.current.destroy();
          hexagonLayerRef.current = null;
        }
        mapInstance.current.destroy();
        mapInstance.current = null;
        setIsMapReady(false);
      }

      try {
        if (!mapContainer.current || !mounted) {
          return;
        }

        console.log('Loading 2GIS API');
        const mapglAPI = await load();

        if (!mounted) return;

        console.log('Creating map instance');
        const mapOptions: MapGLOptions = {
          center: [37.519352, 55.633520],
          zoom: isMobile ? 12 : 14,
          key: MAP_API_KEY,
          style: 'c080bb6a-8134-4993-93a1-5b4d8c36a59b',
          zoomControl: false,
          maxZoom: 19,
          minZoom: 5,
        };

        const map = new mapglAPI.Map(mapContainer.current, mapOptions);

        if (!mounted) {
          map.destroy();
          return;
        }

        mapInstance.current = map;

        // Ждем загрузку карты
        await new Promise<void>((resolve) => {
          const handler = () => {
            console.log('Map loaded');
            resolve();
          };
          map.on('load', handler);
        });

        if (!mounted) {
          map.destroy();
          mapInstance.current = null;
          return;
        }

        console.log('Map is initialized and ready');
        setIsMapReady(true);
      } catch (error) {
        console.error('Error initializing map:', error);
        if (mounted) {
          setMapError('Ошибка при загрузке карты');
        }
      }
    };

    initializeMap();

    return () => {
      mounted = false;
      if (hexagonLayerRef.current) {
        hexagonLayerRef.current.destroy();
        hexagonLayerRef.current = null;
      }
      if (mapInstance.current) {
        mapInstance.current.destroy();
        mapInstance.current = null;
      }
      setIsMapReady(false);
    };
  }, [isMobile]);

  // Инициализация гексагонов
  const initHexagonLayer = useCallback(() => {
    if (!isMapReady || !mapInstance.current || showTutorial) {
      console.log('Skipping hexagon initialization:', {
        isMapReady,
        hasMap: !!mapInstance.current,
        showTutorial
      });
      return;
    }

    try {
      console.log('Creating hexagon layer with points:', TEST_POINTS.length);

      if (hexagonLayerRef.current) {
        console.log('Destroying existing hexagon layer');
        hexagonLayerRef.current.destroy();
        hexagonLayerRef.current = null;
      }

      hexagonLayerRef.current = createHexagonLayer(
        mapInstance.current,
        TEST_POINTS,
        (error) => {
          console.error('Hexagon layer error:', error);
          setMapError('Ошибка при создании слоя гексагонов');
        }
      );

      console.log('Hexagon layer created successfully');
    } catch (error) {
      console.error('Error creating hexagon layer:', error);
      setMapError('Ошибка при создании слоя гексагонов');
    }
  }, [isMapReady, showTutorial]);

  // Обновление гексагонов при изменении состояния
  useEffect(() => {
    if (isMapReady && !showTutorial) {
      console.log('Map state changed, initializing hexagons');
      initHexagonLayer();
    }
  }, [isMapReady, showTutorial, initHexagonLayer]);

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
        <div className="w-full relative">
          <div className="relative w-full h-[600px] rounded-xl overflow-hidden shadow-lg">
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
                          ДЕМОНСТРАЦИЯ ПЛОТНОСТИ
                        </div>
                        <div className="mt-1 text-sm text-gray-600 dark:text-gray-400 flex items-center justify-center gap-2">
                          <span className="font-medium">Москва</span>
                          <span className="w-1 h-1 rounded-full bg-gray-400 dark:bg-gray-500"></span>
                          <span>район Коньково</span>
                        </div>
                      </div>

                      <div className="px-4 md:px-5 py-4">
                        <button
                          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary/10 dark:bg-primary/20 text-primary rounded-lg"
                        >
                          <Store className="w-4 h-4" />
                          <span className="font-medium">Плотность населения</span>
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
                      onClick={() => mapInstance.current?.setZoom(mapInstance.current.getZoom() + 1)}
                      className="w-8 h-8 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-lg shadow-lg flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border border-gray-200/20 dark:border-gray-700/20"
                      aria-label="Приблизить"
                    >
                      <Plus className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                    </button>
                    <button
                      onClick={() => mapInstance.current?.setZoom(mapInstance.current.getZoom() - 1)}
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
      </div>
    </section>
  );
}; 