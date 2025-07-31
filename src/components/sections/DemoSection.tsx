import { useEffect, useRef, useState } from 'react';
import type { CianProperty } from '@/utils/cianDataLoader';


import { loadCianData, KOPTEVO_CENTER, KOPTEVO_POLYGON } from '@/utils/cianDataLoader';
import { createPropertyMarkers, type PropertyMarker } from '@/utils/markerUtils';
import { getBuildingBoundaries, createBuildingPolygon } from '@/utils/buildingBoundaries';
import { createHexagonLayer, type HexagonLayer } from '@/utils/hexagonUtils';
import { createZoneClickHandler } from '@/utils/zoneUtils';

// 2GIS API Key
const MAP_API_KEY = '2a1e9263-06de-4f55-89e4-985684639490';

const DemoSection = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const markersRef = useRef<PropertyMarker[]>([]);
  const [mapError, setMapError] = useState<string | null>(null);
  const [isMapReady, setIsMapReady] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [properties, setProperties] = useState<CianProperty[]>([]);
  const [showDemoModal, setShowDemoModal] = useState(true);
  const [selectedCategory] = useState('Ритейл');
  const [showHexagons, setShowHexagons] = useState(false);
  const [priceType, setPriceType] = useState<'perMeter' | 'total'>('perMeter');

  const buildingPolygonRef = useRef<{ destroy: () => void } | null>(null);
  const hexagonLayerRef = useRef<HexagonLayer | null>(null);

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
    const loadData = async () => {
      try {
        console.log('Loading CIAN data...');
        const data = await loadCianData();
        console.log('Loaded CIAN data:', data.length, 'properties');
        setProperties(data);
      } catch (error) {
        console.error('Error loading CIAN data:', error);
        setMapError('Ошибка при загрузке данных ЦИАН');
      }
    };

    loadData();
  }, []);

  // Инициализация карты
  useEffect(() => {
    let mounted = true;

    const initializeMap = async () => {
      // Очищаем предыдущую карту
      if (mapInstance.current) {
        markersRef.current.forEach(marker => marker.destroy());
        markersRef.current = [];
        if (hexagonLayerRef.current) {
          hexagonLayerRef.current.destroy();
          hexagonLayerRef.current = null;
        }
        if (buildingPolygonRef.current) {
          buildingPolygonRef.current.destroy();
          buildingPolygonRef.current = null;
        }
        mapInstance.current = null;
        setIsMapReady(false);
      }

      // Полностью очищаем контейнер карты
      if (mapContainer.current) {
        mapContainer.current.innerHTML = '';
        // Удаляем все дочерние элементы
        while (mapContainer.current.firstChild) {
          mapContainer.current.removeChild(mapContainer.current.firstChild);
        }
      }

      try {
        if (!mapContainer.current || !mounted) return;

        console.log('Loading 2GIS API with key:', MAP_API_KEY);

        // Проверяем, не загружен ли уже 2GIS API
        if ((window as any).DG) {
          console.log('2GIS API already loaded, creating map');
          // Добавляем небольшую задержку для полной очистки контейнера
          setTimeout(() => {
            (window as any).DG.then(createMap);
          }, 100);
        } else {
          // Загружаем обычный 2GIS API с ключом и полным пакетом
          const script = document.createElement('script');
          script.src = `https://maps.api.2gis.ru/2.0/loader.js?pkg=full&key=${MAP_API_KEY}`;
          script.onload = () => {
            if (!mounted) return;
            console.log('2GIS API loaded, creating map');
            // Добавляем небольшую задержку для полной очистки контейнера
            setTimeout(() => {
              (window as any).DG.then(createMap);
            }, 100);
          };
          script.onerror = () => {
            console.error('Failed to load 2GIS API');
            setMapError('Ошибка при загрузке 2GIS API');
          };
          document.head.appendChild(script);
        }

      } catch (error) {
        console.error('Error initializing map:', error);
        if (mounted) {
          setMapError('Ошибка при загрузке карты');
        }
      }
    };

    const createMap = () => {
      if (!mounted || !mapContainer.current) return;

      // Проверяем, не создана ли уже карта
      if (mapInstance.current) {
        console.log('Map already exists, skipping creation');
        return;
      }

      console.log('DG available, creating map with center:', KOPTEVO_CENTER);

      const map = (window as any).DG.map(mapContainer.current, {
        center: KOPTEVO_CENTER, // Центр района Коптево
        zoom: isMobile ? 14 : 15,
        maxBounds: [
          [55.821216, 37.516286], // Юго-западная граница
          [55.841216, 37.536286]  // Северо-восточная граница
        ],
        maxBoundsViscosity: 1.0, // Полное ограничение - карта не может выйти за границы
        minZoom: 13, // Минимальный зум для района
        maxZoom: 18  // Максимальный зум для района
      });

      console.log('Map created successfully');

      mapInstance.current = map;
      setIsMapReady(true);

      // Добавляем точную границу района Коптево как полигон
      console.log('Adding Koptevo polygon with coordinates:', KOPTEVO_POLYGON);
      (window as any).DG.polygon(KOPTEVO_POLYGON, {
        color: '#ff0000',
        weight: 3,
        fillColor: '#ff0000',
        fillOpacity: 0.1
      }).addTo(map);

      console.log('✓ 2GIS map created successfully with Koptevo district polygon border');

      // Создаем слой гексагонов
      hexagonLayerRef.current = createHexagonLayer(map);

      // Добавляем обработчик кликов по карте для определения зон
      const zoneClickHandler = createZoneClickHandler(map);
      map.on('click', zoneClickHandler);
    };

    initializeMap();

    return () => {
      mounted = false;
      markersRef.current.forEach(marker => marker.destroy());
      markersRef.current = [];
      if (buildingPolygonRef.current) {
        buildingPolygonRef.current.destroy();
        buildingPolygonRef.current = null;
      }
      if (hexagonLayerRef.current) {
        hexagonLayerRef.current.destroy();
        hexagonLayerRef.current = null;
      }

      if (mapInstance.current) {
        mapInstance.current = null;
      }
      setIsMapReady(false);
    };
  }, [isMobile]);

  // Функция для обработки выбора объекта недвижимости
  const handlePropertySelect = async (property: CianProperty) => {
    console.log('Property selected:', property);

    // Очищаем предыдущие границы здания
    if (buildingPolygonRef.current) {
      buildingPolygonRef.current.destroy();
      buildingPolygonRef.current = null;
    }

    // Если у объекта есть ID здания, получаем и отображаем его границы
    if (property.buildingId && mapInstance.current) {
      try {
        console.log('Getting building boundaries for:', property.buildingId);
        const boundary = await getBuildingBoundaries(property.buildingId);

        if (boundary) {
          console.log('Creating building polygon for:', boundary.name);
          const polygon = createBuildingPolygon(mapInstance.current, boundary);
          if (polygon) {
            buildingPolygonRef.current = polygon;
          }
        } else {
          console.log('No building boundaries found for:', property.buildingId);
        }
      } catch (error) {
        console.error('Error getting building boundaries:', error);
      }
    }
  };

  // Добавление маркеров при загрузке данных и карты
  useEffect(() => {
    console.log('useEffect triggered:', {
      isMapReady,
      hasMapInstance: !!mapInstance.current,
      propertiesLength: properties.length,
      priceType
    });

    // Очищаем старые маркеры
    if (markersRef.current.length > 0) {
      console.log('Clearing old markers');
      markersRef.current.forEach(marker => marker.destroy());
      markersRef.current = [];
    }

    if (isMapReady && mapInstance.current && properties.length > 0) {
      console.log('Adding property markers with priceType:', priceType);
      const markers = createPropertyMarkers(
        mapInstance.current,
        properties,
        handlePropertySelect,
        priceType
      );
      markersRef.current = markers;

      // При использовании 2GIS API маркеры автоматически обновляют позиции
      console.log('Markers will automatically update with 2GIS API');
    }
  }, [isMapReady, properties, priceType]);

  // Управление гексагонами
  useEffect(() => {
    if (hexagonLayerRef.current) {
      if (showHexagons) {
        console.log('Showing hexagons');
        hexagonLayerRef.current.update();
      } else {
        console.log('Hiding hexagons');
        hexagonLayerRef.current.destroy();
        hexagonLayerRef.current = createHexagonLayer(mapInstance.current);
      }
    }
  }, [showHexagons]);



  return (
    <section className="min-h-[calc(100vh-4rem)] flex items-center bg-white dark:bg-[#0f0f0f]">
      <div className="max-w-6xl mx-auto px-4 w-full py-8">
        <h2 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-4">
          Аналитика коммерческой недвижимости
        </h2>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
          Интерактивная карта районов Коптево и Коньково - объекты недвижимости с данными ЦИАН
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

                  {/* Индикатор загрузки карты */}
                  {!isMapReady && !mapError && (
                    <div className="absolute inset-0 z-20 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-600 dark:text-gray-400">Загрузка карты...</p>
                      </div>
                    </div>
                  )}

                  {/* Легенда маркеров */}
                  <div className={`absolute ${isMobile ? 'bottom-8 left-1/2 -translate-x-1/2' : 'bottom-8 left-4'} z-20 bg-white/95 dark:bg-gray-800/95 p-3 rounded-lg shadow-lg`}>
                    {/* Переключатель типа цены */}
                    <div className="flex items-center gap-2 mb-3">
                      <button
                        onClick={() => setPriceType('perMeter')}
                        className={`px-2 py-1 text-xs rounded transition-colors ${priceType === 'perMeter'
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                          }`}
                      >
                        Цена за м²
                      </button>
                      <button
                        onClick={() => setPriceType('total')}
                        className={`px-2 py-1 text-xs rounded transition-colors ${priceType === 'total'
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                          }`}
                      >
                        Общая цена
                      </button>
                    </div>

                    {/* Легенда для цены за м² */}
                    {priceType === 'perMeter' && (
                      <>
                        <h4 className="text-sm font-semibold mb-2">Цена за м²:</h4>
                        <div className="space-y-1 text-xs">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                            <span>До 35 000 ₽</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                            <span>35 000-45 000 ₽</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                            <span>45 000-55 000 ₽</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-500"></div>
                            <span>Более 55 000 ₽</span>
                          </div>
                        </div>
                      </>
                    )}

                    {/* Легенда для общей цены */}
                    {priceType === 'total' && (
                      <>
                        <h4 className="text-sm font-semibold mb-2">Общая цена (аренда):</h4>
                        <div className="space-y-1 text-xs">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                            <span>До 200 000 ₽</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                            <span>200 000-500 000 ₽</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                            <span>500 000-1 000 000 ₽</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-500"></div>
                            <span>Более 1 000 000 ₽</span>
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Кнопки управления */}
                  <div className={`absolute ${isMobile ? 'bottom-4 right-4' : 'bottom-4 right-4'} z-20 flex flex-col gap-2`}>
                    {/* Кнопка переключения гексагонов */}
                    <button
                      onClick={() => setShowHexagons(!showHexagons)}
                      className={`w-12 h-12 rounded-full shadow-lg transition-all duration-200 flex items-center justify-center ${showHexagons
                        ? 'bg-blue-600 text-white shadow-blue-500/50'
                        : 'bg-white/95 dark:bg-gray-800/95 text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700'
                        }`}
                      title={showHexagons ? 'Скрыть гексагоны' : 'Показать гексагоны'}
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 3.5a1.5 1.5 0 113 0v4a1.5 1.5 0 01-3 0v-4zM10 8.5a1.5 1.5 0 013 0v4a1.5 1.5 0 01-3 0v-4zM10 13.5a1.5 1.5 0 013 0v4a1.5 1.5 0 01-3 0v-4z" />
                      </svg>
                    </button>
                  </div>





                  {/* Демо-модальное окно - только на карте */}
                  {showDemoModal && isMapReady && (
                    <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-6 rounded-2xl max-w-sm mx-4 shadow-2xl border border-gray-700/50 transform transition-all duration-300 hover:scale-105">
                        {/* Декоративные элементы */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-t-2xl"></div>
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full opacity-20"></div>
                        <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-purple-500 rounded-full opacity-20"></div>

                        <div className="text-center mb-4">
                          <h2 className="text-xl font-bold mb-2 text-white">
                            ДЕМО-ВЕРСИЯ КАРТЫ
                          </h2>
                          <div className="w-16 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 mx-auto mb-3"></div>
                          <p className="text-gray-300 text-sm font-medium">
                            Районы Коптево и Коньково • коммерческая недвижимость
                          </p>
                        </div>

                        {/* Категория */}
                        <div className="bg-gray-800/50 p-3 rounded-xl mb-4 border border-gray-700/50">
                          <p className="text-gray-300 text-sm">
                            <span className="text-blue-400 font-semibold">Категория:</span> {selectedCategory}
                          </p>
                        </div>

                        {/* Инструкция с иконкой */}
                        <div className="bg-gray-800/50 p-4 rounded-xl mb-6 border border-gray-700/50">
                          <div className="flex items-start">
                            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <p className="text-gray-300 text-sm leading-relaxed">
                              Нажмите на любой маркер объекта недвижимости, чтобы увидеть детальную информацию
                            </p>
                          </div>
                        </div>

                        {/* Кнопки */}
                        <div className="flex gap-3">
                          <button
                            onClick={() => setShowDemoModal(false)}
                            className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-105"
                          >
                            Начать
                          </button>
                          <button
                            onClick={() => setShowDemoModal(false)}
                            className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                          >
                            Пропустить
                          </button>
                        </div>
                      </div>
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

export default DemoSection; 