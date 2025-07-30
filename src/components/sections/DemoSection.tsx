import { useEffect, useRef, useState } from 'react';
import { load } from '@2gis/mapgl';
import type { Map as MapGL, MapGLOptions } from '@2gis/mapgl/types';
import { Plus, Minus } from 'lucide-react';
import { HeatScale } from '@/components/ui/HeatScale';
import {
  KONKOVO_BOUNDS,
  type CianProperty,
  createPropertyMarkers
} from '@/utils/cianUtils';

// 2GIS API Key
const MAP_API_KEY = '2cb31629-9703-41ac-8398-e2da9fa78838';

// Центр Коньково
const KONKOVO_CENTER = {
  lat: 55.6412,
  lng: 37.5509
};

export const DemoSection = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<MapGL | null>(null);
  const markersRef = useRef<Array<{ destroy: () => void }>>([]);
  const [mapError, setMapError] = useState<string | null>(null);
  const [isMapReady, setIsMapReady] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<CianProperty | null>(null);
  const [properties, setProperties] = useState<CianProperty[]>([]);

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
            area: 100,
            pricePerMeter: 150000,
            location: { lat: 55.6390, lng: 37.5220 }
          },
          {
            url: 'https://cian.ru/2',
            area: 75,
            pricePerMeter: 180000,
            location: { lat: 55.6400, lng: 37.5240 }
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
          center: [37.5509, 55.6412], // [lng, lat] для 2GIS
          zoom: isMobile ? 14 : 15,
          key: MAP_API_KEY,
          style: 'c080bb6a-8134-4993-93a1-5b4d8c36a59b',
          zoomControl: false,
          maxZoom: 19,
          minZoom: 13,
          maxBounds: [
            [37.5334, 55.6276], // [lng, lat] для юго-западного угла
            [37.5685, 55.6549]  // [lng, lat] для северо-восточного угла
          ]
        };

        const map = new mapglAPI.Map(mapContainer.current, mapOptions);

        if (!mounted) {
          map.destroy();
          return;
        }

        mapInstance.current = map;

        // Добавляем полигон границ Коньково
        map.addPolygon({
          coordinates: [KONKOVO_BOUNDS.coordinates[0]],
          color: '#3388ff20',
          strokeColor: '#3388ff',
          strokeWidth: 2,
          fillOpacity: 0.5,
          interactive: false,
          zIndex: 1
        });

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
          Недвижимость в Коньково
        </h2>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
          Интерактивная карта объектов ЦИАН
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
                  <div className={`absolute ${isMobile ? 'bottom-20 left-1/2 -translate-x-1/2' : 'bottom-24 left-4'} z-20`}>
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