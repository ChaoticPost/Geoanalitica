import { useEffect, useRef, useState } from 'react';
import { load } from '@2gis/mapgl';
import type { Map as MapGL, MapGLOptions } from '@2gis/mapgl/types';
import { Plus, Minus } from 'lucide-react';
import { HeatScale } from '@/components/ui/HeatScale';
import {
  KOPTEVO_BOUNDS,
  KOPTEVO_CENTER,
  type CianProperty,
  createPropertyMarkers
} from '@/utils/cianUtils';

// 2GIS API Key
const MAP_API_KEY = '2a1e9263-06de-4f55-89e4-985684639490';

// Типы для 2GIS MapGL
type LngLatArray = [number, number];
type LngLatBoundsArray = [LngLatArray, LngLatArray];

export const DemoSection = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<MapGL | null>(null);
  const markersRef = useRef<Array<{ destroy: () => void }>>([]);
  const [mapError, setMapError] = useState<string | null>(null);
  const [isMapReady, setIsMapReady] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<CianProperty | null>(null);
  const [properties, setProperties] = useState<CianProperty[]>([]);
  const [showDemoModal, setShowDemoModal] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('Ритейл');

  // Определяем мобильное устройство
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Загрузка данных ЦИАН
  useEffect(() => {
    const loadCianData = async () => {
      try {
        // TODO: Здесь будет загрузка реальных данных
        const mockData: CianProperty[] = [
          {
            url: 'https://cian.ru/1',
            area: 85,
            pricePerMeter: 165000,
            location: { lat: 55.8358, lng: 37.5268 }
          },
          {
            url: 'https://cian.ru/2',
            area: 120,
            pricePerMeter: 190000,
            location: { lat: 55.8398, lng: 37.5318 }
          },
          {
            url: 'https://cian.ru/3',
            area: 65,
            pricePerMeter: 170000,
            location: { lat: 55.8338, lng: 37.5428 }
          },
          // Добавьте больше тестовых данных
        ];
        setProperties(mockData);
      } catch (error) {
        console.error('Error loading CIAN data:', error);
        setMapError('Ошибка при загрузке данных ЦИАН');
      }
    };

    loadCianData();
  }, []);

  // Инициализация карты
  useEffect(() => {
    let mounted = true;

    const initializeMap = async () => {
      if (mapInstance.current) {
        markersRef.current.forEach(marker => marker.destroy());
        markersRef.current = [];
        mapInstance.current.destroy();
        mapInstance.current = null;
        setIsMapReady(false);
      }

      try {
        if (!mapContainer.current || !mounted) return;

        console.log('Loading 2GIS API');
        const mapglAPI = await load();

        if (!mounted) return;

        console.log('Creating map instance');
        const mapOptions: MapGLOptions = {
          center: KOPTEVO_CENTER,
          zoom: isMobile ? 14 : 15,
          key: MAP_API_KEY,
          style: 'c080bb6a-8134-4993-93a1-5b4d8c36a59b',
          zoomControl: false,
          maxZoom: 19,
          minZoom: 13
        };

        const map = new mapglAPI.Map(mapContainer.current, mapOptions);

        if (!mounted) {
          map.destroy();
          return;
        }

        mapInstance.current = map;

        // Пока убираем полигон, чтобы карта загружалась
        // TODO: Добавить полигон после исправления API

        // Ждем загрузку карты
        map.on('load', () => {
          console.log('Map loaded');
          setIsMapReady(true);
        });

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
      markersRef.current.forEach(marker => marker.destroy());
      markersRef.current = [];
      if (mapInstance.current) {
        mapInstance.current.destroy();
        mapInstance.current = null;
      }
      setIsMapReady(false);
    };
  }, [isMobile]);

  // Добавление маркеров при загрузке данных и карты
  useEffect(() => {
    if (isMapReady && mapInstance.current && properties.length > 0) {
      console.log('Adding property markers');
      const markers = createPropertyMarkers(
        mapInstance.current,
        properties,
        setSelectedProperty
      );
      markersRef.current = markers;
    }
  }, [isMapReady, properties]);

  return (
    <section className="min-h-[calc(100vh-4rem)] flex items-center bg-white dark:bg-[#0f0f0f]">
      <div className="max-w-6xl mx-auto px-4 w-full py-8">
        <h2 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-4">
          Аналитика недвижимости в Коптево
        </h2>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
          Демо-версия интерактивной карты с данными ЦИАН
        </p>

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

                  {/* Шкала цен */}
                  <div className={`absolute ${isMobile ? 'bottom-8 left-1/2 -translate-x-1/2' : 'bottom-8 left-4'} z-20`}>
                    <HeatScale
                      min="Низкая цена"
                      max="Высокая цена"
                      className={isMobile ? 'transform scale-90' : ''}
                    />
                  </div>

                  {/* Кнопки зума */}
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



                  {/* Демо-модальное окно */}
                  {showDemoModal && (
                    <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-6 rounded-2xl max-w-sm mx-4 shadow-2xl border border-gray-700/50 transform transition-all duration-300 hover:scale-105">
                        {/* Декоративные элементы */}
                        <div className="absolute -top-1 -left-1 w-3 h-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full animate-pulse"></div>
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-r from-red-500 to-orange-500 rounded-full animate-pulse delay-1000"></div>

                        {/* Заголовок с градиентом */}
                        <div className="text-center mb-4">
                          <h2 className="text-xl font-bold mb-2 text-white">
                            ДЕМО-ВЕРСИЯ КАРТЫ
                          </h2>
                          <div className="w-16 h-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 mx-auto rounded-full mb-3"></div>
                          <p className="text-gray-300 text-sm font-medium">
                            Москва • район Коптево
                          </p>
                        </div>

                        {/* Категория с улучшенным дизайном */}
                        <div className="bg-gradient-to-r from-red-500 via-red-600 to-red-700 text-white p-4 rounded-xl mb-4 flex items-center justify-center shadow-lg border border-red-400/30 transform hover:scale-105 transition-transform duration-200">
                          <div className="bg-white/20 p-1.5 rounded-lg mr-2">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                            </svg>
                          </div>
                          <span className="font-bold text-base">{selectedCategory}</span>
                        </div>

                        {/* Инструкция с иконкой */}
                        <div className="bg-gray-800/50 p-4 rounded-xl mb-6 border border-gray-700/50">
                          <div className="flex items-start">
                            <div className="bg-blue-500/20 p-1.5 rounded-lg mr-2 mt-0.5">
                              <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <p className="text-gray-300 text-sm leading-relaxed">
                              Чтобы посмотреть детальную статистику района, нажмите на нужную область карты
                            </p>
                          </div>
                        </div>

                        {/* Кнопки с градиентами */}
                        <div className="flex gap-3">
                          <button
                            onClick={() => setShowDemoModal(false)}
                            className="flex-1 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg border border-gray-600/50 font-medium text-sm"
                          >
                            Пропустить обучение
                          </button>
                          <button
                            onClick={() => setShowDemoModal(false)}
                            className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg border border-red-400/50 font-medium text-sm"
                          >
                            Далее
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Информация об объекте */}
                  {selectedProperty && (
                    <div className="absolute bottom-4 left-4 z-20 bg-white/95 dark:bg-gray-800/95 p-4 rounded-lg shadow-lg">
                      <h3 className="font-semibold mb-2">Информация об объекте</h3>
                      <div className="space-y-1 text-sm">
                        <p>Площадь: {selectedProperty.area} м²</p>
                        <p>Цена за м²: {selectedProperty.pricePerMeter.toLocaleString()} ₽</p>
                        <a
                          href={selectedProperty.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:text-blue-600"
                        >
                          Открыть на ЦИАН
                        </a>
                      </div>
                      <button
                        onClick={() => setSelectedProperty(null)}
                        className="mt-3 text-xs text-gray-500 hover:text-gray-700"
                      >
                        Закрыть
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}; 