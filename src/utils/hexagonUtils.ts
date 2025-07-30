import * as h3 from 'h3-js';
import type { Map as MapGL, LngLatArray } from '@2gis/mapgl/types';

export interface Point {
  lat: number;
  lng: number;
}

// Получаем оптимальное разрешение H3 в зависимости от зума карты
const getOptimalResolution = (zoom: number): number => {
  if (typeof zoom !== 'number' || isNaN(zoom)) {
    console.warn('Invalid zoom level:', zoom);
    return 9; // Возвращаем безопасное значение по умолчанию
  }
  // H3 resolution mapping based on zoom level
  if (zoom <= 9) return 7;  // Увеличили базовое разрешение
  if (zoom <= 11) return 8;
  if (zoom <= 13) return 9;
  if (zoom <= 15) return 10;
  return 11;
};

// Получаем цвет для гексагона
const getColor = (): string => {
  return 'rgba(51, 136, 255, 0.2)'; // Полупрозрачный синий
};

// Проверяем валидность координат
const isValidCoordinate = (lat: number, lng: number): boolean => {
  return (
    typeof lat === 'number' && 
    typeof lng === 'number' && 
    !isNaN(lat) && 
    !isNaN(lng) && 
    lat >= -90 && 
    lat <= 90 && 
    lng >= -180 && 
    lng <= 180
  );
};

// Проверяем валидность границ карты
const isValidBounds = (bounds: unknown): bounds is [[number, number], [number, number]] => {
  if (!Array.isArray(bounds) || bounds.length !== 2) return false;
  const [sw, ne] = bounds;
  if (!Array.isArray(sw) || !Array.isArray(ne) || sw.length !== 2 || ne.length !== 2) return false;
  const [swLng, swLat] = sw;
  const [neLng, neLat] = ne;
  return isValidCoordinate(swLat, swLng) && isValidCoordinate(neLat, neLng);
};

// Создаем слой гексагонов
export const createHexagonLayer = (
  map: MapGL,
  _points: Point[], // Игнорируем points, так как создаем равномерную сетку
  onError: (error: string) => void
) => {
  console.log('Creating hexagon layer');
  
  const polygons: Array<{ destroy: () => void }> = [];
  let isDestroyed = false;
  let isUpdating = false;
  
  const updateGrid = () => {
    if (isDestroyed) {
      console.log('Skipping update - layer is destroyed');
      return;
    }

    if (isUpdating) {
      console.log('Update already in progress, skipping');
      return;
    }

    isUpdating = true;

    try {
      console.log('Starting grid update');
      
      // Очищаем старые полигоны
      polygons.forEach(polygon => polygon.destroy());
      polygons.length = 0;
      
      // Получаем и проверяем границы карты
      const bounds = map.getBounds();
      if (!isValidBounds(bounds)) {
        throw new Error('Invalid map bounds');
      }
      
      const [[swLng, swLat], [neLng, neLat]] = bounds;
      console.log('Map bounds:', { swLat, swLng, neLat, neLng });
      
      // Получаем зум и определяем размер гексагонов
      const zoom = map.getZoom();
      const resolution = getOptimalResolution(zoom);
      console.log('Map zoom and resolution:', { zoom, resolution });

      // Проверяем, что центр карты валиден
      const centerLat = (swLat + neLat) / 2;
      const centerLng = (swLng + neLng) / 2;
      if (!isValidCoordinate(centerLat, centerLng)) {
        throw new Error('Invalid map center coordinates');
      }

      // Создаем базовый гексагон в центре
      const centerHex = h3.latLngToCell(centerLat, centerLng, resolution);
      console.log('Center hex:', { centerLat, centerLng, centerHex });

      // Получаем кольца гексагонов
      const ringSize = Math.max(2, Math.ceil((20 - zoom))); // Увеличили минимальный размер кольца
      const hexagons = h3.gridDisk(centerHex, ringSize);
      
      if (!Array.isArray(hexagons) || hexagons.length === 0) {
        throw new Error('Failed to generate hexagons');
      }
      
      console.log('Generated hexagons:', { count: hexagons.length, ringSize });

      // Фильтруем гексагоны по видимой области
      const visibleHexagons = hexagons.filter(hexId => {
        try {
          const hexBounds = h3.cellToBoundary(hexId);
          if (!Array.isArray(hexBounds) || hexBounds.length === 0) return false;
          
          return hexBounds.some(([lat, lng]) => 
            isValidCoordinate(lat, lng) &&
            lat >= swLat && lat <= neLat && 
            lng >= swLng && lng <= neLng
          );
        } catch (error) {
          console.warn('Error checking hexagon visibility:', { hexId, error });
          return false;
        }
      });

      console.log('Visible hexagons:', visibleHexagons.length);

      // Создаем полигоны для каждого гексагона
      visibleHexagons.forEach(hexId => {
        try {
          // Получаем границы гексагона
          const boundaries = h3.cellToBoundary(hexId);
          if (!Array.isArray(boundaries) || boundaries.length < 6) {
            console.warn('Invalid hexagon boundaries:', { hexId, boundaries });
            return;
          }
          
          // Преобразуем координаты для 2GIS MapGL
          const coordinates = boundaries.map(([lat, lng]) => {
            if (!isValidCoordinate(lat, lng)) {
              console.warn('Invalid coordinate:', { lat, lng });
              return null;
            }
            return [lng, lat] as LngLatArray;
          }).filter((coord): coord is LngLatArray => coord !== null);

          if (coordinates.length < 6) {
            console.warn('Not enough valid coordinates for hexagon:', { 
              hexId, 
              validPoints: coordinates.length 
            });
            return;
          }

          // Замыкаем полигон
          coordinates.push(coordinates[0]);
          
          // Создаем полигон
          const polygon = map.addPolygon({
            coordinates: [coordinates],
            color: getColor(),
            strokeColor: '#FFFFFF',
            strokeWidth: 1,
            fillOpacity: 0.5,
            zIndex: 1
          });
          
          polygons.push(polygon);
        } catch (error) {
          console.error('Error creating polygon for hexagon:', { hexId, error });
        }
      });
      
      console.log('Created polygons:', polygons.length);
    } catch (error) {
      console.error('Error updating grid:', error);
      onError('Ошибка при обновлении сетки гексагонов');
    } finally {
      isUpdating = false;
    }
  };
  
  // Обновляем сетку при изменении границ карты
  const boundsChangeHandler = () => {
    console.log('Map bounds changed, updating grid');
    updateGrid();
  };
  
  map.on('moveend', boundsChangeHandler);
  
  // Создаем начальную сетку
  console.log('Creating initial grid');
  updateGrid();
  
  return {
    destroy: () => {
      console.log('Destroying hexagon layer');
      isDestroyed = true;
      map.off('moveend', boundsChangeHandler);
      polygons.forEach(polygon => polygon.destroy());
      polygons.length = 0;
    },
    update: updateGrid
  };
};