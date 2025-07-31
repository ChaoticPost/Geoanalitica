// Координаты районов Коптево и Коньково (Москва)
const KOPTEVO_BOUNDS = {
  north: 55.850000,
  south: 55.620000,
  east: 37.550000,
  west: 37.510000
};

// Центр между районами
const KOPTEVO_CENTER = {
  lat: 55.735000,
  lng: 37.530000
};

// Типы зон
export type ZoneType = 'NW' | 'NE' | 'SW' | 'SE';

export interface Zone {
  id: ZoneType;
  name: string;
  bounds: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
}

// Определение 4 зон Коптево
export const KOPTEVO_ZONES: Zone[] = [
  {
    id: 'NW',
    name: 'Северо-Запад',
    bounds: {
      north: KOPTEVO_BOUNDS.north,
      south: KOPTEVO_CENTER.lat,
      east: KOPTEVO_CENTER.lng,
      west: KOPTEVO_BOUNDS.west
    }
  },
  {
    id: 'NE',
    name: 'Северо-Восток',
    bounds: {
      north: KOPTEVO_BOUNDS.north,
      south: KOPTEVO_CENTER.lat,
      east: KOPTEVO_BOUNDS.east,
      west: KOPTEVO_CENTER.lng
    }
  },
  {
    id: 'SW',
    name: 'Юго-Запад',
    bounds: {
      north: KOPTEVO_CENTER.lat,
      south: KOPTEVO_BOUNDS.south,
      east: KOPTEVO_CENTER.lng,
      west: KOPTEVO_BOUNDS.west
    }
  },
  {
    id: 'SE',
    name: 'Юго-Восток',
    bounds: {
      north: KOPTEVO_CENTER.lat,
      south: KOPTEVO_BOUNDS.south,
      east: KOPTEVO_BOUNDS.east,
      west: KOPTEVO_CENTER.lng
    }
  }
];

// Функция для определения зоны по координатам
export const getZoneByCoordinates = (lat: number, lng: number): Zone | null => {
  // Проверяем, что точка находится в пределах района Коптево
  if (lat < KOPTEVO_BOUNDS.south || lat > KOPTEVO_BOUNDS.north ||
    lng < KOPTEVO_BOUNDS.west || lng > KOPTEVO_BOUNDS.east) {
    return null;
  }

  // Определяем зону
  for (const zone of KOPTEVO_ZONES) {
    if (lat >= zone.bounds.south && lat <= zone.bounds.north &&
      lng >= zone.bounds.west && lng <= zone.bounds.east) {
      return zone;
    }
  }

  return null;
};

// Функция для получения зоны по ID
export const getZoneById = (zoneId: ZoneType): Zone | undefined => {
  return KOPTEVO_ZONES.find(zone => zone.id === zoneId);
};

// Функция для логирования информации о зоне
export const logZoneInfo = (lat: number, lng: number, objectId?: string, objectNumber?: number) => {
  const zone = getZoneByCoordinates(lat, lng);

  if (zone) {
    const logMessage = objectId
      ? `Объект №${objectNumber || 'N/A'} (${objectId}) находится в зоне: ${zone.name} (${zone.id})`
      : `Координаты [${lat.toFixed(6)}, ${lng.toFixed(6)}] находятся в зоне: ${zone.name} (${zone.id})`;

    console.log(logMessage);
    return zone;
  } else {
    console.log(`Координаты [${lat.toFixed(6)}, ${lng.toFixed(6)}] находятся за пределами района Коптево`);
    return null;
  }
};

// Функция для создания обработчика кликов по карте
export const createZoneClickHandler = (map: any) => {
  return (event: any) => {
    const { lat, lng } = event.latlng;
    logZoneInfo(lat, lng);
  };
};

// Функция для создания обработчика кликов по маркерам
export const createMarkerZoneClickHandler = (objectId?: string) => {
  return (event: any) => {
    const { lat, lng } = event.latlng;
    logZoneInfo(lat, lng, objectId);
  };
};

export interface ZonePolygon {
  destroy: () => void;
  setActive: (active: boolean) => void;
}

export const createZonePolygons = (map: any): ZonePolygon[] => {
  const polygons: ZonePolygon[] = [];

  KOPTEVO_ZONES.forEach((zone, index) => {
    // Создаем координаты полигона для зоны
    const zoneCoordinates = [
      [zone.bounds.north, zone.bounds.west], // Северо-запад
      [zone.bounds.north, zone.bounds.east], // Северо-восток
      [zone.bounds.south, zone.bounds.east], // Юго-восток
      [zone.bounds.south, zone.bounds.west], // Юго-запад
      [zone.bounds.north, zone.bounds.west]  // Замыкаем полигон
    ];

    // Создаем полигон для зоны
    const polygon = (window as any).DG.polygon(zoneCoordinates, {
      color: '#3b82f6',
      weight: 2,
      fillColor: '#3b82f6',
      fillOpacity: 0.1,
      opacity: 0.8
    });

    // Добавляем обработчик клика
    polygon.on('click', () => {
      console.log(`🎯 Зона: ${zone.name} (ID: ${zone.id})`);
      console.log(`📍 Границы: ${zone.bounds.south.toFixed(6)}-${zone.bounds.north.toFixed(6)}, ${zone.bounds.west.toFixed(6)}-${zone.bounds.east.toFixed(6)}`);

      // Можно добавить дополнительную логику здесь
      // Например, фильтрация недвижимости по зоне
    });

    // Добавляем hover эффекты
    polygon.on('mouseover', () => {
      polygon.setStyle({
        fillOpacity: 0.3,
        weight: 3,
        color: '#1d4ed8'
      });
    });

    polygon.on('mouseout', () => {
      polygon.setStyle({
        fillOpacity: 0.1,
        weight: 2,
        color: '#3b82f6'
      });
    });

    // Добавляем на карту
    polygon.addTo(map);

    // Создаем объект для управления полигоном
    const zonePolygon: ZonePolygon = {
      destroy: () => {
        polygon.removeFrom(map);
      },
      setActive: (active: boolean) => {
        if (active) {
          polygon.setStyle({
            fillOpacity: 0.4,
            weight: 4,
            color: '#1d4ed8'
          });
        } else {
          polygon.setStyle({
            fillOpacity: 0.1,
            weight: 2,
            color: '#3b82f6'
          });
        }
      }
    };

    polygons.push(zonePolygon);
  });

  return polygons;
};



