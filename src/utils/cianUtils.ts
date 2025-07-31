import type { Map as MapGL } from '@2gis/mapgl/types';

// Типы для 2GIS MapGL
type LngLatArray = [number, number];
type LngLatBoundsArray = [LngLatArray, LngLatArray];

export interface CianProperty {
  url: string;
  area: number;
  pricePerMeter: number;
  location: {
    lat: number;
    lng: number;
  };
}

// Границы Коптево (координаты в формате [lng, lat] для 2GIS)
export const KOPTEVO_BOUNDS = {
  type: "Polygon",
  coordinates: [[
    [37.5168, 55.8278], // юго-западный угол
    [37.5168, 55.8478], // северо-западный угол
    [37.5568, 55.8478], // северо-восточный угол
    [37.5568, 55.8278], // юго-восточный угол
    [37.5168, 55.8278]  // замыкаем полигон
  ]] as LngLatArray[][]
};

// Центр Коптево
export const KOPTEVO_CENTER: LngLatArray = [37.5368, 55.8378];

// Проверка, находится ли точка внутри полигона
export const isPointInKoptevo = (point: { lat: number; lng: number }): boolean => {
  const polygon = KOPTEVO_BOUNDS.coordinates[0];
  let inside = false;

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [xi, yi] = polygon[i];
    const [xj, yj] = polygon[j];

    const intersect = ((yi > point.lat) !== (yj > point.lat)) &&
      (point.lng < (xj - xi) * (point.lat - yi) / (yj - yi) + xi);

    if (intersect) inside = !inside;
  }

  return inside;
};

// Получение цвета маркера в зависимости от цены
const getPriceColor = (price: number): string => {
  if (price > 200000) return '#FF4444';
  if (price > 150000) return '#FFAA00';
  return '#44AA44';
};

// Создание маркеров для объектов недвижимости
export const createPropertyMarkers = (
  map: MapGL,
  properties: CianProperty[],
  onSelect: (property: CianProperty) => void
): Array<{ destroy: () => void }> => {
  // Пока возвращаем пустой массив, чтобы карта загружалась
  // TODO: Добавить маркеры после исправления API
  return [];
};