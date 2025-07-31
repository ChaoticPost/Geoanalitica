import type { Map as MapGL } from '@2gis/mapgl/types';

export interface BuildingBoundary {
  id: string;
  coordinates: [number, number][];
  name: string;
  address: string;
  purpose: string;
}

// Моковые границы зданий для демонстрации
const mockBuildingBoundaries: Record<string, BuildingBoundary> = {
  // === РАЙОН КОПТЕВО ===
  "4504235283009009": { // Торговый центр Коптево
    id: "4504235283009009",
    coordinates: [
      [37.526286, 55.831216],
      [37.526386, 55.831216],
      [37.526386, 55.831316],
      [37.526286, 55.831316],
      [37.526286, 55.831216]
    ],
    name: "Торговый центр Коптево",
    address: "Коптевская улица, 12",
    purpose: "Торговый центр"
  },
  "4504235282574073": { // Бизнес-центр Север
    id: "4504235282574073",
    coordinates: [
      [37.520000, 55.835000],
      [37.520100, 55.835000],
      [37.520100, 55.835100],
      [37.520000, 55.835100],
      [37.520000, 55.835000]
    ],
    name: "Бизнес-центр Север",
    address: "Коптевская улица, 25",
    purpose: "Бизнес-центр"
  },
  "4504235282681371": { // Офисный центр Зорге
    id: "4504235282681371",
    coordinates: [
      [37.532000, 55.828000],
      [37.532100, 55.828000],
      [37.532100, 55.828100],
      [37.532000, 55.828100],
      [37.532000, 55.828000]
    ],
    name: "Офисный центр Зорге",
    address: "улица Зорге, 8",
    purpose: "Офисный центр"
  },
  // === РАЙОН КОНЬКОВО ===
  "70030076318986627": { // улица Введенского, 5
    id: "70030076318986627",
    coordinates: [
      [37.535000, 55.645000],
      [37.535100, 55.645000],
      [37.535100, 55.645100],
      [37.535000, 55.645100],
      [37.535000, 55.645000]
    ],
    name: "улица Введенского, 5",
    address: "улица Введенского, 5",
    purpose: "Жилой дом"
  },
  "4504235282716518": { // Neo Geo, бизнес-центр
    id: "4504235282716518",
    coordinates: [
      [37.530000, 55.638000],
      [37.530100, 55.638000],
      [37.530100, 55.638100],
      [37.530000, 55.638100],
      [37.530000, 55.638000]
    ],
    name: "Neo Geo, бизнес-центр",
    address: "улица Бутлерова, 17",
    purpose: "Бизнес-центр"
  }
};

// Функция для получения границ здания по ID
export const getBuildingBoundaries = async (buildingId: string): Promise<BuildingBoundary | null> => {
  try {
    // В реальном приложении здесь будет вызов к 2ГИС API
    // Пока используем моковые данные
    return mockBuildingBoundaries[buildingId] || null;
  } catch (error) {
    console.error('Error getting building boundaries:', error);
    return null;
  }
};

// Функция для создания полигона границ здания
export const createBuildingPolygon = (
  map: MapGL,
  boundary: BuildingBoundary
): { destroy: () => void } | null => {
  try {
    console.log('Creating building polygon for:', boundary.name);
    console.log('Map bounds:', map.getBounds());
    console.log('Boundary coordinates:', boundary.coordinates);
    // Создаем SVG элемент для отображения границ
    const svgContainer = document.createElement('div');
    svgContainer.style.position = 'absolute';
    svgContainer.style.top = '0';
    svgContainer.style.left = '0';
    svgContainer.style.width = '100%';
    svgContainer.style.height = '100%';
    svgContainer.style.pointerEvents = 'none';
    svgContainer.style.zIndex = '15';

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    svg.style.position = 'absolute';
    svg.style.top = '0';
    svg.style.left = '0';
    svgContainer.appendChild(svg);

    // Функция для преобразования координат в пиксели
    const projectPoint = (lat: number, lng: number) => {
      const bounds = map.getBounds();

      // Проверяем, что bounds валидны
      if (!bounds) {
        console.error('Map bounds not available');
        return { x: 0, y: 0 };
      }

      // Проверяем формат bounds и адаптируемся к нему
      let swLat, swLng, neLat, neLng;

      if (bounds && typeof bounds === 'object') {
        // Проверяем формат n.LatLngBounds с _southWest и _northEast
        if ('_southWest' in bounds && '_northEast' in bounds) {
          console.log('Using _southWest/_northEast format');
          swLat = bounds._southWest.lat;
          swLng = bounds._southWest.lng;
          neLat = bounds._northEast.lat;
          neLng = bounds._northEast.lng;
        } else if ('southWest' in bounds && 'northEast' in bounds) {
          // Формат {southWest: {lat, lng}, northEast: {lat, lng}}
          console.log('Using southWest/northEast format');
          swLat = bounds.southWest.lat;
          swLng = bounds.southWest.lng;
          neLat = bounds.northEast.lat;
          neLng = bounds.northEast.lng;
        } else if (Array.isArray(bounds) && bounds.length === 2) {
          // Формат [[swLng, swLat], [neLng, neLat]]
          console.log('Using array format');
          const [sw, ne] = bounds;
          if (Array.isArray(sw) && Array.isArray(ne)) {
            [swLng, swLat] = sw;
            [neLng, neLat] = ne;
          } else {
            // Формат [[swLat, swLng], [neLat, neLng]]
            [swLat, swLng] = sw;
            [neLat, neLng] = ne;
          }
        } else {
          console.error('Unknown bounds format:', bounds);
          return { x: 0, y: 0 };
        }
      } else {
        console.error('Invalid bounds:', bounds);
        return { x: 0, y: 0 };
      }

      // Альтернативный способ получения bounds через методы карты
      if (!swLat || !swLng || !neLat || !neLng) {
        console.log('Trying alternative bounds method...');
        try {
          const center = map.getCenter();
          const zoom = map.getZoom();
          const halfLat = 0.01 / Math.pow(2, zoom);
          const halfLng = 0.01 / Math.pow(2, zoom);

          swLat = center.lat - halfLat;
          swLng = center.lng - halfLng;
          neLat = center.lat + halfLat;
          neLng = center.lng + halfLng;

          console.log('Using calculated bounds:', { swLat, swLng, neLat, neLng });
        } catch (error) {
          console.error('Failed to calculate bounds:', error);
          return { x: 0, y: 0 };
        }
      }

      console.log('Bounds values:', { swLat, swLng, neLat, neLng });
      console.log('Input coordinates:', { lat, lng });

      // Проверяем, что координаты находятся в пределах bounds
      if (lat < swLat || lat > neLat || lng < swLng || lng > neLng) {
        console.warn('Coordinate outside bounds:', { lat, lng, swLat, swLng, neLat, neLng });
      }

      // Проверяем деление на ноль
      if (neLat === swLat || neLng === swLng) {
        console.error('Invalid bounds: zero width or height');
        return { x: 0, y: 0 };
      }

      const latRatio = (lat - swLat) / (neLat - swLat);
      const lngRatio = (lng - swLng) / (neLng - swLng);

      console.log('Ratios:', { latRatio, lngRatio });

      const containerRect = map.getContainer().getBoundingClientRect();
      const result = {
        x: lngRatio * containerRect.width,
        y: (1 - latRatio) * containerRect.height
      };

      console.log('Container rect:', containerRect);
      console.log('Result:', result);

      // Проверяем на NaN и Infinity
      if (isNaN(result.x) || isNaN(result.y) || !isFinite(result.x) || !isFinite(result.y)) {
        console.error('Invalid result:', result);
        return { x: 0, y: 0 };
      }

      return result;
    };

    // Создаем path для границ здания
    if (!boundary.coordinates || boundary.coordinates.length === 0) {
      console.error('No coordinates provided for boundary:', boundary);
      return null;
    }

    const points = boundary.coordinates.map(([lng, lat]) => {
      console.log(`Processing coordinate: [${lng}, ${lat}]`);
      const position = projectPoint(lat, lng);
      console.log(`Projected point: ${lat},${lng} -> ${position.x},${position.y}`);
      return `${position.x},${position.y}`;
    }).join(' ');

    const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    polygon.setAttribute('points', points);
    polygon.setAttribute('fill', 'rgba(255, 0, 0, 0.2)');
    polygon.setAttribute('stroke', '#FF0000');
    polygon.setAttribute('stroke-width', '3');
    polygon.setAttribute('stroke-dasharray', '5,5');

    svg.appendChild(polygon);

    // Добавляем контейнер на карту
    const mapContainer = map.getContainer();
    mapContainer.appendChild(svgContainer);

    return {
      destroy: () => {
        if (svgContainer.parentNode) {
          svgContainer.parentNode.removeChild(svgContainer);
        }
      }
    };
  } catch (error) {
    console.error('Error creating building polygon:', error);
    return null;
  }
};

// Функция для обновления позиции полигона при изменении карты
export const updateBuildingPolygon = (
  polygon: { destroy: () => void },
  map: MapGL,
  boundary: BuildingBoundary
): void => {
  // Для простоты пересоздаем полигон
  polygon.destroy();
  const newPolygon = createBuildingPolygon(map, boundary);
  if (newPolygon) {
    Object.assign(polygon, newPolygon);
  }
}; 