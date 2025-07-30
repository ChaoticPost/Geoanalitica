import type { Map as MapGL } from '@2gis/mapgl/types';

// Интерфейс для объекта недвижимости
export interface CianProperty {
  url: string;
  area: number;
  pricePerMeter: number;
  location: {
    lat: number;
    lng: number;
  };
}

// Границы района Коньково (координаты в формате [lng, lat] для 2GIS)
export const KONKOVO_BOUNDS = {
  type: "Polygon",
  coordinates: [[
    [37.5434, 55.6376],
    [37.5432, 55.6449],
    [37.5585, 55.6448],
    [37.5587, 55.6375],
    [37.5434, 55.6376]
  ]]
};

// Проверка, находится ли точка внутри полигона (алгоритм ray casting)
export const isPointInKonkovo = (lat: number, lng: number): boolean => {
  const polygon = KONKOVO_BOUNDS.coordinates[0];
  let inside = false;
  
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [xi, yi] = polygon[i];
    const [xj, yj] = polygon[j];
    
    const intersect = ((yi > lat) !== (yj > lat))
        && (lng < (xj - xi) * (lat - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  
  return inside;
};

// Нормализация цен для цветовой шкалы
export const normalizePrices = (properties: CianProperty[]): CianProperty[] => {
  const prices = properties.map(p => p.pricePerMeter);
  const q1 = quantile(prices, 0.25);
  const q3 = quantile(prices, 0.75);
  const iqr = q3 - q1;
  const upperBound = q3 + 1.5 * iqr;
  const lowerBound = q1 - 1.5 * iqr;

  return properties.filter(p => 
    p.pricePerMeter >= lowerBound && 
    p.pricePerMeter <= upperBound
  );
};

// Получение цвета маркера в зависимости от цены
export const getPriceColor = (price: number, minPrice: number, maxPrice: number): string => {
  const normalizedPrice = (price - minPrice) / (maxPrice - minPrice);
  const hue = (1 - normalizedPrice) * 120; // От красного (0) до зеленого (120)
  return `hsla(${hue}, 70%, 50%, 0.8)`;
};

// Получение размера маркера в зависимости от площади
export const getMarkerSize = (area: number, minArea: number, maxArea: number): number => {
  const normalizedArea = (area - minArea) / (maxArea - minArea);
  return 10 + normalizedArea * 20; // От 10 до 30 пикселей
};

// Функция для создания маркеров на карте
export const createPropertyMarkers = (
  map: MapGL,
  properties: CianProperty[],
  onSelect: (property: CianProperty) => void
) => {
  const normalizedProperties = normalizePrices(properties);
  const prices = normalizedProperties.map(p => p.pricePerMeter);
  const areas = normalizedProperties.map(p => p.area);

  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const minArea = Math.min(...areas);
  const maxArea = Math.max(...areas);

  return normalizedProperties.map(property => {
    if (!isPointInKonkovo(property.location.lat, property.location.lng)) {
      return null;
    }

    const marker = map.addMarker({
      coordinates: [property.location.lng, property.location.lat], // [lng, lat] для 2GIS
      icon: 'pin',
      size: getMarkerSize(property.area, minArea, maxArea),
      color: getPriceColor(property.pricePerMeter, minPrice, maxPrice),
      interactive: true
    });

    map.on('click', marker, () => {
      onSelect(property);
    });

    return marker;
  }).filter(Boolean);
};

// Вспомогательная функция для вычисления квантиля
function quantile(arr: number[], q: number): number {
  const sorted = [...arr].sort((a, b) => a - b);
  const pos = (sorted.length - 1) * q;
  const base = Math.floor(pos);
  const rest = pos - base;
  if (sorted[base + 1] !== undefined) {
    return sorted[base] + rest * (sorted[base + 1] - sorted[base]);
  } else {
    return sorted[base];
  }
} 