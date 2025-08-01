import { useEffect, useRef, useState } from 'react';
import type { CianProperty } from '@/utils/cianDataLoader';
import type { TerminalLocation } from '@/utils/transactionDataLoader';

import { loadCianData, KOPTEVO_CENTER, KOPTEVO_POLYGON } from '@/utils/cianDataLoader';
import { loadTransactionData } from '@/utils/transactionDataLoader';
import { createPropertyMarkers, type PropertyMarker } from '@/utils/markerUtils';
import { createTerminalMarkers, type TerminalMarker } from '@/utils/terminalMarkerUtils';
import { createIntegratedMarkers, type IntegratedMarker, groupByLocation } from '@/utils/integratedMarkerUtils';
import { getBuildingBoundaries, createBuildingPolygon } from '@/utils/buildingBoundaries';
import { createHexagonLayer, type HexagonLayer } from '@/utils/hexagonUtils';
import { createZoneClickHandler, createZonePolygons, getZoneByCoordinates } from '@/utils/zoneUtils';
import AnalyticsPanel from '@/components/ui/AnalyticsPanel';
import ZoneAnalyticsCard from '@/components/ui/ZoneAnalyticsCard';
import { generateAnalyticsData, getAreaName, getCategoryFromTransactions, getCurrentPeriod } from '@/utils/analyticsUtils';
import { generateZoneAnalytics, getZoneDisplayName } from '@/utils/zoneAnalyticsUtils';

// 2GIS API Key
const MAP_API_KEY = '2a1e9263-06de-4f55-89e4-985684639490';

const DemoSection = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const markersRef = useRef<PropertyMarker[]>([]);
  const terminalMarkersRef = useRef<TerminalMarker[]>([]);
  const integratedMarkersRef = useRef<IntegratedMarker[]>([]);
  const [mapError, setMapError] = useState<string | null>(null);
  const [isMapReady, setIsMapReady] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [properties, setProperties] = useState<CianProperty[]>([]);
  const [terminals, setTerminals] = useState<TerminalLocation[]>([]);
  const [showDemoModal, setShowDemoModal] = useState(true);
  const [selectedCategory] = useState('Ритейл');
  const [showHexagons, setShowHexagons] = useState(false);
  const [priceType, setPriceType] = useState<'perMeter' | 'total'>('perMeter');
  const [showTerminals, setShowTerminals] = useState(true);
  const [selectedTerminalCategory, setSelectedTerminalCategory] = useState('Все');
  const [useIntegratedMarkers, setUseIntegratedMarkers] = useState(true);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [selectedArea, setSelectedArea] = useState('');
  const [showLegend, setShowLegend] = useState(true);
  const [showZoneAnalytics, setShowZoneAnalytics] = useState(false);
  const [zoneAnalyticsData, setZoneAnalyticsData] = useState<any>(null);
  const [zoneAnalyticsPosition, setZoneAnalyticsPosition] = useState({ x: 0, y: 0 });

  const buildingPolygonRef = useRef<{ destroy: () => void } | null>(null);
  const hexagonLayerRef = useRef<HexagonLayer | null>(null);
  const zonePolygonsRef = useRef<any[]>([]);

  // Определяем мобильное устройство
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Загрузка данных ЦИАН и транзакций
  useEffect(() => {
    const loadData = async () => {
      try {
        console.log('Loading CIAN data...');
        const cianData = await loadCianData();
        console.log('Loaded CIAN data:', cianData.length, 'properties');
        setProperties(cianData);

        console.log('Loading transaction data...');
        const terminalData = await loadTransactionData();
        console.log('Loaded transaction data:', terminalData.length, 'terminals');
        setTerminals(terminalData);
      } catch (error) {
        console.error('Error loading data:', error);
        setMapError('Ошибка при загрузке данных');
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
        terminalMarkersRef.current.forEach(marker => marker.destroy());
        terminalMarkersRef.current = [];
        integratedMarkersRef.current.forEach(marker => marker.destroy());
        integratedMarkersRef.current = [];
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

      // Очищаем контейнер перед созданием новой карты
      mapContainer.current.innerHTML = '';

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

      // Создаем зоны на карте (скрыто от пользователя)
      // zonePolygonsRef.current = createZonePolygons(map);

      // Добавляем обработчик кликов по карте для определения зон
      const zoneClickHandler = createZoneClickHandler(map);
      map.on('click', zoneClickHandler);

      // Добавляем обработчик кликов по карте для аналитики
      map.on('click', handleAreaClick);

      // Добавляем обработчик кликов по карте для зональной аналитики
      map.on('click', handleZoneClick);
    };

    initializeMap();

    return () => {
      mounted = false;
      markersRef.current.forEach(marker => marker.destroy());
      markersRef.current = [];
      terminalMarkersRef.current.forEach(marker => marker.destroy());
      terminalMarkersRef.current = [];
      integratedMarkersRef.current.forEach(marker => marker.destroy());
      integratedMarkersRef.current = [];
      if (buildingPolygonRef.current) {
        buildingPolygonRef.current.destroy();
        buildingPolygonRef.current = null;
      }
      if (hexagonLayerRef.current) {
        hexagonLayerRef.current.destroy();
        hexagonLayerRef.current = null;
      }
      if (zonePolygonsRef.current.length > 0) {
        zonePolygonsRef.current.forEach(polygon => polygon.destroy());
        zonePolygonsRef.current = [];
      }

      if (mapInstance.current) {
        mapInstance.current = null;
      }
      if (mapContainer.current) {
        mapContainer.current.innerHTML = '';
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

  // Функция для обработки выбора терминала
  const handleTerminalSelect = (terminal: TerminalLocation) => {
    console.log('Terminal selected:', terminal);
    // Здесь можно добавить дополнительную логику для терминалов
  };

  // Функция для обработки клика по области карты
  const handleAreaClick = (event: any) => {
    const { lat, lng } = event.latlng;
    const areaName = getAreaName(lat, lng);

    // Проверяем, что клик был в пределах определенной области
    if (areaName !== 'Выбранная область') {
      const category = getCategoryFromTransactions(terminals);
      const period = getCurrentPeriod();

      // Генерируем аналитические данные для выбранной области
      const data = generateAnalyticsData(terminals, properties, areaName);

      setAnalyticsData({
        data,
        areaName,
        category,
        period
      });
      setSelectedArea(areaName);
      setShowAnalytics(true);
    }
  };

  // Функция для обработки клика по зонам
  const handleZoneClick = (event: any) => {
    const { lat, lng } = event.latlng;
    const zone = getZoneByCoordinates(lat, lng);

    if (zone) {
      // Получаем позицию клика для отображения плашки
      const x = event.originalEvent.clientX;
      const y = event.originalEvent.clientY;

      // Генерируем аналитику для зоны
      const zoneData = generateZoneAnalytics(zone);
      const zoneName = getZoneDisplayName(zone.id);

      setZoneAnalyticsData({ ...zoneData, zoneId: zone.id });
      setZoneAnalyticsPosition({ x, y });
      setShowZoneAnalytics(true);

      console.log(`🎯 Клик по зоне: ${zoneName} (${zone.id})`);
    }
  };

  // Добавление маркеров при загрузке данных и карты
  useEffect(() => {
    console.log('useEffect triggered:', {
      isMapReady,
      hasMapInstance: !!mapInstance.current,
      propertiesLength: properties.length,
      terminalsLength: terminals.length,
      priceType,
      showTerminals,
      useIntegratedMarkers
    });

    // Очищаем старые маркеры
    if (markersRef.current.length > 0) {
      console.log('Clearing old property markers');
      markersRef.current.forEach(marker => marker.destroy());
      markersRef.current = [];
    }

    if (terminalMarkersRef.current.length > 0) {
      console.log('Clearing old terminal markers');
      terminalMarkersRef.current.forEach(marker => marker.destroy());
      terminalMarkersRef.current = [];
    }

    if (integratedMarkersRef.current.length > 0) {
      console.log('Clearing old integrated markers');
      integratedMarkersRef.current.forEach(marker => marker.destroy());
      integratedMarkersRef.current = [];
    }

    if (isMapReady && mapInstance.current) {
      if (useIntegratedMarkers) {
        // Используем интегрированные маркеры
        console.log('Creating integrated markers');
        const filteredTerminals = selectedTerminalCategory === 'Все'
          ? terminals
          : terminals.filter(terminal =>
            terminal.category.toLowerCase().includes(selectedTerminalCategory.toLowerCase())
          );

        const locations = groupByLocation(properties, filteredTerminals);
        const integratedMarkers = createIntegratedMarkers(
          mapInstance.current,
          locations,
          handlePropertySelect,
          handleTerminalSelect
        );
        integratedMarkersRef.current = integratedMarkers;
      } else {
        // Используем отдельные маркеры
        if (properties.length > 0) {
          console.log('Adding property markers with priceType:', priceType);
          const markers = createPropertyMarkers(
            mapInstance.current,
            properties,
            handlePropertySelect,
            priceType
          );
          markersRef.current = markers;
        }

        if (showTerminals && terminals.length > 0) {
          console.log('Adding terminal markers');
          const filteredTerminals = selectedTerminalCategory === 'Все'
            ? terminals
            : terminals.filter(terminal =>
              terminal.category.toLowerCase().includes(selectedTerminalCategory.toLowerCase())
            );

          const terminalMarkers = createTerminalMarkers(
            mapInstance.current,
            filteredTerminals,
            handleTerminalSelect
          );
          terminalMarkersRef.current = terminalMarkers;
        }
      }

      console.log('Markers will automatically update with 2GIS API');
    }
  }, [isMapReady, properties, terminals, priceType, showTerminals, selectedTerminalCategory, useIntegratedMarkers]);

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
          Аналитика коммерческой недвижимости и транзакций
        </h2>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
          Интерактивная карта районов Коптево и Коньково - объекты недвижимости с данными ЦИАН и терминалы с транзакционными данными
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
                  <div className={`absolute ${isMobile ? 'bottom-6 left-3' : 'bottom-6 left-3'} z-20 bg-white/95 dark:bg-gray-800/95 p-2 rounded-lg shadow-lg max-w-64 transition-all duration-300 ${isMobile && showLegend ? 'translate-x-0' : isMobile ? '-translate-x-full' : ''}`}>
                    {/* Кнопка сворачивания для мобильных */}
                    {isMobile && (
                      <button
                        onClick={() => setShowLegend(!showLegend)}
                        className="absolute -right-6 top-1/2 -translate-y-1/2 bg-white/95 dark:bg-gray-800/95 p-1.5 rounded-r-lg shadow-lg transition-all duration-300"
                        title={showLegend ? 'Скрыть легенду' : 'Показать легенду'}
                      >
                        <svg className={`w-3 h-3 text-gray-600 dark:text-gray-400 transition-transform duration-300 ${showLegend ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                    )}

                    {/* Переключатель типа цены */}
                    <div className="flex items-center gap-1 mb-2">
                      <button
                        onClick={() => setPriceType('perMeter')}
                        className={`px-1.5 py-0.5 text-xs rounded transition-colors ${priceType === 'perMeter'
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                          }`}
                      >
                        Цена за м²
                      </button>
                      <button
                        onClick={() => setPriceType('total')}
                        className={`px-1.5 py-0.5 text-xs rounded transition-colors ${priceType === 'total'
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
                        <h4 className="text-xs font-semibold mb-1">Цена за м²:</h4>
                        <div className="space-y-0.5 text-xs">
                          <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                            <span>До 35 000 ₽</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                            <span>35 000-45 000 ₽</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                            <span>45 000-55 000 ₽</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-red-500"></div>
                            <span>Более 55 000 ₽</span>
                          </div>
                        </div>
                      </>
                    )}

                    {/* Легенда для общей цены */}
                    {priceType === 'total' && (
                      <>
                        <h4 className="text-xs font-semibold mb-1">Общая цена (аренда):</h4>
                        <div className="space-y-0.5 text-xs">
                          <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                            <span>До 200 000 ₽</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                            <span>200 000-500 000 ₽</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                            <span>500 000-1 000 000 ₽</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-red-500"></div>
                            <span>Более 1 000 000 ₽</span>
                          </div>
                        </div>
                      </>
                    )}

                    {/* Разделитель */}
                    <div className="border-t border-gray-300 dark:border-gray-600 my-2"></div>

                    {/* Легенда интегрированных маркеров */}
                    {useIntegratedMarkers && (
                      <div className="mb-2">
                        <h4 className="text-xs font-semibold mb-1">Интегрированные маркеры:</h4>
                        <div className="space-y-0.5 text-xs">
                          <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                            <span>🏢 Только недвижимость</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                            <span>💳 Только терминалы</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                            <span>🏢💳 Недвижимость + терминалы</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Легенда терминалов (только когда не интегрированные) */}
                    {!useIntegratedMarkers && (
                      <div className="mb-2">
                        <h4 className="text-xs font-semibold mb-1">Терминалы:</h4>
                        <div className="space-y-0.5 text-xs">
                          <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                            <span>До 50 000 ₽</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                            <span>50 000-100 000 ₽</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                            <span>100 000-150 000 ₽</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-red-500"></div>
                            <span>Более 150 000 ₽</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Кнопки управления */}
                  <div className={`absolute ${isMobile ? 'bottom-4 right-4' : 'bottom-4 right-4'} z-20 flex flex-col gap-2`}>
                    {/* Кнопка переключения интегрированных маркеров */}
                    <button
                      onClick={() => setUseIntegratedMarkers(!useIntegratedMarkers)}
                      className={`w-12 h-12 rounded-full shadow-lg transition-all duration-200 flex items-center justify-center ${useIntegratedMarkers
                        ? 'bg-purple-600 text-white shadow-purple-500/50'
                        : 'bg-white/95 dark:bg-gray-800/95 text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700'
                        }`}
                      title={useIntegratedMarkers ? 'Отключить интегрированные маркеры' : 'Включить интегрированные маркеры'}
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                      </svg>
                    </button>

                    {/* Кнопка переключения терминалов */}
                    <button
                      onClick={() => setShowTerminals(!showTerminals)}
                      className={`w-12 h-12 rounded-full shadow-lg transition-all duration-200 flex items-center justify-center ${showTerminals
                        ? 'bg-green-600 text-white shadow-green-500/50'
                        : 'bg-white/95 dark:bg-gray-800/95 text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700'
                        }`}
                      title={showTerminals ? 'Скрыть терминалы' : 'Показать терминалы'}
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" />
                      </svg>
                    </button>
                  </div>









                  {/* Демо-модальное окно - только на карте */}
                  {showDemoModal && isMapReady && (
                    <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-4 rounded-xl max-w-xs mx-4 shadow-2xl border border-gray-700/50 transform transition-all duration-300 hover:scale-105">
                        {/* Декоративные элементы */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-t-xl"></div>
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full opacity-20"></div>
                        <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-purple-500 rounded-full opacity-20"></div>

                        <div className="text-center mb-3">
                          <h2 className="text-lg font-bold mb-1 text-white">
                            ДЕМО-ВЕРСИЯ
                          </h2>
                          <div className="w-12 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 mx-auto mb-2"></div>
                          <p className="text-gray-300 text-xs font-medium">
                            Коптево • недвижимость + транзакции
                          </p>
                        </div>

                        {/* Категория */}
                        <div className="bg-gray-800/50 p-2 rounded-lg mb-3 border border-gray-700/50">
                          <p className="text-gray-300 text-xs">
                            <span className="text-blue-400 font-semibold">Категория:</span> {selectedCategory}
                          </p>
                        </div>

                        {/* Инструкция с иконкой */}
                        <div className="bg-gray-800/50 p-3 rounded-lg mb-4 border border-gray-700/50">
                          <div className="flex items-start">
                            <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                              <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <div className="text-gray-300 text-xs leading-relaxed">
                              <p className="mb-1">
                                💡 <strong>Интегрированные маркеры:</strong> Объекты недвижимости и терминалы объединены
                              </p>
                              <p className="mb-1">
                                🏢 <strong>Синие:</strong> Только недвижимость
                              </p>
                              <p className="mb-1">
                                💳 <strong>Зеленые:</strong> Только терминалы
                              </p>
                              <p>
                                🏢💳 <strong>Фиолетовые:</strong> Недвижимость + терминалы
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Кнопки */}
                        <div className="flex gap-2">
                          <button
                            onClick={() => setShowDemoModal(false)}
                            className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-1.5 px-3 rounded-lg transition-all duration-200 transform hover:scale-105 text-sm"
                          >
                            Начать
                          </button>
                          <button
                            onClick={() => setShowDemoModal(false)}
                            className="px-3 py-1.5 text-gray-400 hover:text-white transition-colors text-sm"
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

      {/* Аналитическая панель */}
      {showAnalytics && analyticsData && (
        <AnalyticsPanel
          isVisible={showAnalytics}
          onClose={() => setShowAnalytics(false)}
          data={analyticsData.data}
          areaName={analyticsData.areaName}
          category={analyticsData.category}
          period={analyticsData.period}
        />
      )}

      {/* Зональная аналитическая плашка */}
      {showZoneAnalytics && zoneAnalyticsData && (
        <ZoneAnalyticsCard
          isVisible={showZoneAnalytics}
          onClose={() => setShowZoneAnalytics(false)}
          data={zoneAnalyticsData}
          zoneName={getZoneDisplayName(zoneAnalyticsData.zoneId)}
          position={zoneAnalyticsPosition}
        />
      )}
    </section>
  );
};

export default DemoSection; 