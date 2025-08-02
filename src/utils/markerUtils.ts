import type { CianProperty } from './cianDataLoader';
import { logZoneInfo } from './zoneUtils';

export interface PropertyMarker {
  id: string;
  marker: any; // DG.marker instance
  property: CianProperty;
  destroy: () => void;
}

// Интерфейс для кластера объектов
export interface PropertyCluster {
  lat: number;
  lng: number;
  properties: CianProperty[];
  centerProperty: CianProperty; // Основной объект для отображения
}

// Функция для группировки объектов по координатам
export const groupPropertiesByCoordinates = (properties: CianProperty[]): PropertyCluster[] => {
  const clusters: Map<string, PropertyCluster> = new Map();

  properties.forEach(property => {
    if (!property.lat || !property.lng) return;

    const key = `${property.lat.toFixed(6)},${property.lng.toFixed(6)}`;

    if (clusters.has(key)) {
      clusters.get(key)!.properties.push(property);
    } else {
      clusters.set(key, {
        lat: property.lat,
        lng: property.lng,
        properties: [property],
        centerProperty: property
      });
    }
  });

  // Для кластеров с несколькими объектами выбираем основной объект
  clusters.forEach(cluster => {
    if (cluster.properties.length > 1) {
      // Выбираем объект с наибольшей площадью как основной
      cluster.centerProperty = cluster.properties.reduce((max, current) =>
        current.area > max.area ? current : max, cluster.properties[0]
      );
    }
  });

  return Array.from(clusters.values());
};

// Создаем маркер для кластера объектов
export const createClusterMarker = (
  map: any,
  cluster: PropertyCluster,
  onSelect: (property: CianProperty) => void,
  priceType: 'perMeter' | 'total' = 'perMeter'
): PropertyMarker | null => {
  const property = cluster.centerProperty;

  console.log('Creating cluster marker for:', {
    address: property.address,
    lat: property.lat,
    lng: property.lng,
    price: property.pricePerMeter,
    area: property.area,
    clusterSize: cluster.properties.length
  });

  if (!property.lat || !property.lng) {
    console.warn('Property missing coordinates:', property);
    return null;
  }

  try {
    console.log('Checking 2GIS API availability:', {
      DG: (window as any).DG,
      map: map
    });

    // Проверяем, доступен ли 2GIS API
    if (!(window as any).DG) {
      console.error('2GIS API (DG) not available!');
      return null;
    }

    // Определяем цвет и размер на основе данных
    const getMarkerColor = (pricePerMeter: number, totalPrice?: number, priceType: 'perMeter' | 'total' = 'perMeter'): string => {
      if (priceType === 'perMeter') {
        if (pricePerMeter < 35000) return '#28a745'; // Зеленый - низкая цена
        if (pricePerMeter < 45000) return '#ffc107'; // Желтый - средняя цена
        if (pricePerMeter < 55000) return '#fd7e14'; // Оранжевый - высокая цена
        return '#dc3545'; // Красный - очень высокая цена
      } else {
        // Для общей цены
        if (!totalPrice) return '#28a745'; // По умолчанию зеленый
        if (totalPrice < 200000) return '#28a745'; // Зеленый - низкая цена
        if (totalPrice < 500000) return '#ffc107'; // Желтый - средняя цена
        if (totalPrice < 1000000) return '#fd7e14'; // Оранжевый - высокая цена
        return '#dc3545'; // Красный - очень высокая цена
      }
    };

    const getMarkerSize = (area: number, clusterSize: number): number => {
      let baseSize = 16;
      if (area < 50) baseSize = 12;
      if (area < 100) baseSize = 16;
      if (area < 200) baseSize = 20;
      if (area >= 200) baseSize = 24;

      // Увеличиваем размер для кластеров
      if (clusterSize > 1) {
        baseSize += Math.min(clusterSize * 2, 8);
      }

      return baseSize;
    };

    const color = getMarkerColor(property.pricePerMeter, property.totalPrice, priceType);
    const size = getMarkerSize(property.area, cluster.properties.length);

    console.log('Creating cluster marker with:', {
      lat: property.lat,
      lng: property.lng,
      color,
      size,
      clusterSize: cluster.properties.length,
      DG: (window as any).DG
    });

    // Создаем красивую SVG иконку с градиентом, тенью и номером объекта
    const objectNumber = property.objectNumber || 0;
    const clusterIndicator = cluster.properties.length > 1 ?
      `<circle cx="${size - 8}" cy="8" r="6" fill="#ff4444" stroke="white" stroke-width="2"/>
       <text x="${size - 8}" y="11" text-anchor="middle" fill="white" font-size="8" font-weight="bold" font-family="Arial, sans-serif">${cluster.properties.length}</text>` : '';

    const svgIcon = `
      <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="shadow-${property.url.replace(/[^a-zA-Z0-9]/g, '')}" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="1" dy="2" stdDeviation="2" flood-color="rgba(0,0,0,0.3)"/>
          </filter>
          <linearGradient id="gradient-${property.url.replace(/[^a-zA-Z0-9]/g, '')}" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:${color};stop-opacity:1" />
            <stop offset="100%" style="stop-color:${color};stop-opacity:0.8" />
          </linearGradient>
        </defs>
        <circle cx="${size / 2}" cy="${size / 2}" r="${size / 2 - 3}" fill="url(#gradient-${property.url.replace(/[^a-zA-Z0-9]/g, '')})" stroke="white" stroke-width="3" filter="url(#shadow-${property.url.replace(/[^a-zA-Z0-9]/g, '')})"/>
        <circle cx="${size / 2}" cy="${size / 2}" r="${size / 2 - 6}" fill="rgba(255,255,255,0.2)"/>
        <text x="${size / 2}" y="${size / 2 + 3}" text-anchor="middle" fill="white" font-size="${Math.max(10, size / 4)}" font-weight="bold" font-family="Arial, sans-serif">${objectNumber}</text>
        ${clusterIndicator}
      </svg>
    `;

    // Создаем кастомную иконку с улучшенными опциями
    const customIcon = (window as any).DG.divIcon({
      html: svgIcon,
      className: 'custom-property-marker',
      iconSize: [size, size],
      iconAnchor: [size / 2, size / 2]
    });

    // Создаем маркер с улучшенными опциями
    const marker = (window as any).DG.marker([property.lat, property.lng], {
      icon: customIcon,
      title: cluster.properties.length > 1
        ? `Кластер из ${cluster.properties.length} объектов • Объект №${objectNumber} • ${property.area} м² • ${property.pricePerMeter.toLocaleString()} ₽/м²`
        : `Объект №${objectNumber} • ${property.area} м² • ${property.pricePerMeter.toLocaleString()} ₽/м²`,
      riseOnHover: true,
      riseOffset: 500,
      zIndexOffset: 1000,
      opacity: 0.9,
      interactive: true,
      draggable: false,
      keyboard: true
    }).addTo(map);

    // Создаем миниатюрный красивый попап с иконками Lucide для кластера
    const popupContent = `
      <div style="min-width:200px;max-width:240px;font-family:'Segoe UI',Arial,sans-serif;padding:0;margin:0;border:none;outline:none;box-shadow:none;">
        <div style="background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);color:white;padding:12px 12px 8px 12px;border-radius:12px 12px 0 0;box-shadow:0 4px 16px rgba(102,126,234,0.12);border:none;">
          <div>
            <div style='font-size:0.95rem;font-weight:700;line-height:1.2;'>${property.address || 'Объект недвижимости'}</div>
            <div style='font-size:0.75rem;opacity:0.9;margin-top:1px;'>${property.area} м²</div>
          </div>
        </div>
        <div style="background:white;padding:12px;border-radius:0 0 12px 12px;box-shadow:0 2px 12px rgba(0,0,0,0.06);margin-bottom:0;border:none;">
          <div style='display:flex;align-items:center;gap:6px;margin-bottom:6px;padding:4px;background:linear-gradient(135deg,#f8f9ff 0%,#f0f2ff 100%);border-radius:6px;'>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#28a745" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            <span style='font-weight:600;color:#495057;font-size:0.8rem;'>Площадь:</span>
            <span style='font-weight:700;color:#28a745;font-size:0.85rem;'>${property.area} м²</span>
          </div>
          <div style='display:flex;align-items:center;gap:6px;margin-bottom:6px;padding:4px;background:linear-gradient(135deg,#fff5f5 0%,#ffe8e8 100%);border-radius:6px;'>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#dc3545" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <path d="M16 8s-1.5 2-4 2-4-2-4-2"/>
              <line x1="9" y1="9" x2="9.01" y2="9"/>
              <line x1="15" y1="9" x2="15.01" y2="9"/>
              <path d="M9 15c.5.667 1.667 1 3 1s2.5-.333 3-1"/>
            </svg>
            <span style='font-weight:600;color:#495057;font-size:0.8rem;'>Цена за м²:</span>
            <span style='font-weight:700;color:#dc3545;font-size:0.85rem;'>${property.pricePerMeter.toLocaleString()} ₽/мес</span>
          </div>
          <div style='display:flex;align-items:center;gap:6px;margin-bottom:6px;padding:4px;background:linear-gradient(135deg,#f0f8ff 0%,#e6f3ff 100%);border-radius:6px;'>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1976d2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            <span style='font-weight:600;color:#495057;font-size:0.8rem;'>Цена за год:</span>
            <span style='font-weight:700;color:#1976d2;font-size:0.85rem;'>${property.pricePerYear.toLocaleString()} ₽</span>
          </div>
          ${property.totalPrice ? `<div style='display:flex;align-items:center;gap:6px;margin-bottom:6px;padding:4px;background:linear-gradient(135deg,#fff0f0 0%,#ffe6e6 100%);border-radius:6px;'>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#e74c3c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
            </svg>
            <span style='font-weight:600;color:#495057;font-size:0.8rem;'>Аренда:</span>
            <span style='font-weight:700;color:#e74c3c;font-size:0.85rem;'>${property.totalPrice.toLocaleString()} ₽/мес</span>
          </div>` : ''}
          <div style='display:flex;align-items:center;gap:6px;margin-bottom:6px;padding:4px;background:linear-gradient(135deg,#f8f0ff 0%,#f0e6ff 100%);border-radius:6px;'>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6f42c1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
              <rect x="16" y="21" width="4" height="7"/>
              <rect x="4" y="21" width="4" height="7"/>
            </svg>
            <span style='font-weight:600;color:#495057;font-size:0.8rem;'>Налог:</span>
            <span style='font-weight:700;color:#6f42c1;font-size:0.85rem;'>${property.tax}</span>
          </div>
          ${property.commission !== '-' ? `<div style='display:flex;align-items:center;gap:6px;margin-bottom:6px;padding:4px;background:linear-gradient(135deg,#fff8f0 0%,#ffe8d6 100%);border-radius:6px;'>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fd7e14" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
            </svg>
            <span style='font-weight:600;color:#495057;font-size:0.8rem;'>Комиссия:</span>
            <span style='font-weight:700;color:#fd7e14;font-size:0.85rem;'>${property.commission}</span>
          </div>` : ''}
          <div style='text-align:center;margin-top:12px;'>
            <a href='${property.url}' target='_blank' style='display:inline-block;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);color:white;padding:8px 20px;text-decoration:none;border-radius:20px;font-weight:600;font-size:12px;box-shadow:0 2px 8px rgba(102,126,234,0.2);transition:all 0.3s ease;border:none;'>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;margin-right:4px;vertical-align:middle;">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14,2 14,8 20,8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
                <polyline points="10,9 9,9 8,9"/>
              </svg>
              Открыть на ЦИАН →
            </a>
          </div>
        </div>
      </div>
    `;
    marker.bindPopup(popupContent, { maxWidth: 340, className: 'custom-popup' });

    // Убираем попапы - оставляем только красивые маркеры

    // Добавляем обработчики событий
    marker.on('click', () => {
      // Логируем информацию о зоне при клике на маркер
      if (property.lat && property.lng) {
        logZoneInfo(property.lat, property.lng, property.buildingId || property.url, property.objectNumber);
      }
      onSelect(property);
    });

    marker.on('mouseover', () => {
      marker.setZIndexOffset(2000); // Поднимаем маркер при наведении
    });

    marker.on('mouseout', () => {
      marker.setZIndexOffset(1000); // Возвращаем обычный z-index
    });

    console.log(`✓ Created 2GIS marker for ${property.address}:`, {
      lat: property.lat,
      lng: property.lng,
      price: property.pricePerMeter,
      area: property.area,
      marker: marker
    });

    return {
      id: property.url,
      marker: marker,
      property,
      destroy: () => {
        if (marker && marker.removeFrom) {
          marker.removeFrom(map);
        }
      }
    };
  } catch (error) {
    console.error('Error creating property marker:', error);
    return null;
  }
};

// Создаем маркер для объекта недвижимости
export const createPropertyMarker = (
  map: any,
  property: CianProperty,
  onSelect: (property: CianProperty) => void,
  priceType: 'perMeter' | 'total' = 'perMeter'
): PropertyMarker | null => {
  console.log('Creating marker for property:', {
    address: property.address,
    lat: property.lat,
    lng: property.lng,
    price: property.pricePerMeter,
    area: property.area
  });

  if (!property.lat || !property.lng) {
    console.warn('Property missing coordinates:', property);
    return null;
  }

  try {
    console.log('Checking 2GIS API availability:', {
      DG: (window as any).DG,
      map: map
    });

    // Проверяем, доступен ли 2GIS API
    if (!(window as any).DG) {
      console.error('2GIS API (DG) not available!');
      return null;
    }

    // Определяем цвет и размер на основе данных
    const getMarkerColor = (pricePerMeter: number, totalPrice?: number, priceType: 'perMeter' | 'total' = 'perMeter'): string => {
      if (priceType === 'perMeter') {
        if (pricePerMeter < 35000) return '#28a745'; // Зеленый - низкая цена
        if (pricePerMeter < 45000) return '#ffc107'; // Желтый - средняя цена
        if (pricePerMeter < 55000) return '#fd7e14'; // Оранжевый - высокая цена
        return '#dc3545'; // Красный - очень высокая цена
      } else {
        // Для общей цены
        if (!totalPrice) return '#28a745'; // По умолчанию зеленый
        if (totalPrice < 200000) return '#28a745'; // Зеленый - низкая цена
        if (totalPrice < 500000) return '#ffc107'; // Желтый - средняя цена
        if (totalPrice < 1000000) return '#fd7e14'; // Оранжевый - высокая цена
        return '#dc3545'; // Красный - очень высокая цена
      }
    };

    const getMarkerSize = (area: number): number => {
      if (area < 50) return 12;
      if (area < 100) return 16;
      if (area < 200) return 20;
      return 24;
    };

    const color = getMarkerColor(property.pricePerMeter, property.totalPrice, priceType);
    const size = getMarkerSize(property.area);

    console.log('Creating marker with:', {
      lat: property.lat,
      lng: property.lng,
      color,
      size,
      DG: (window as any).DG
    });

    // Создаем красивую SVG иконку с градиентом, тенью и номером объекта
    const objectNumber = property.objectNumber || 0;
    const svgIcon = `
      <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="shadow-${property.url.replace(/[^a-zA-Z0-9]/g, '')}" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="1" dy="2" stdDeviation="2" flood-color="rgba(0,0,0,0.3)"/>
          </filter>
          <linearGradient id="gradient-${property.url.replace(/[^a-zA-Z0-9]/g, '')}" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:${color};stop-opacity:1" />
            <stop offset="100%" style="stop-color:${color};stop-opacity:0.8" />
          </linearGradient>
        </defs>
        <circle cx="${size / 2}" cy="${size / 2}" r="${size / 2 - 3}" fill="url(#gradient-${property.url.replace(/[^a-zA-Z0-9]/g, '')})" stroke="white" stroke-width="3" filter="url(#shadow-${property.url.replace(/[^a-zA-Z0-9]/g, '')})"/>
        <circle cx="${size / 2}" cy="${size / 2}" r="${size / 2 - 6}" fill="rgba(255,255,255,0.2)"/>
        <text x="${size / 2}" y="${size / 2 + 3}" text-anchor="middle" fill="white" font-size="${Math.max(10, size / 4)}" font-weight="bold" font-family="Arial, sans-serif">${objectNumber}</text>
      </svg>
    `;

    // Создаем кастомную иконку с улучшенными опциями
    const customIcon = (window as any).DG.divIcon({
      html: svgIcon,
      className: 'custom-property-marker',
      iconSize: [size, size],
      iconAnchor: [size / 2, size / 2]
    });

    // Создаем маркер с улучшенными опциями
    const marker = (window as any).DG.marker([property.lat, property.lng], {
      icon: customIcon,
      title: `Объект №${property.objectNumber || 'N/A'} • ${property.area} м² • ${property.pricePerMeter.toLocaleString()} ₽/м²`,
      riseOnHover: true,
      riseOffset: 500,
      zIndexOffset: 1000,
      opacity: 0.9,
      interactive: true,
      draggable: false,
      keyboard: true
    }).addTo(map);

    // Создаем миниатюрный красивый попап с иконками Lucide для одиночного объекта
    const popupContent = `
      <div style="min-width:200px;max-width:240px;font-family:'Segoe UI',Arial,sans-serif;padding:0;margin:0;border:none;outline:none;box-shadow:none;">
        <div style="background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);color:white;padding:12px 12px 8px 12px;border-radius:12px 12px 0 0;box-shadow:0 4px 16px rgba(102,126,234,0.12);border:none;">
          <div>
            <div style='font-size:0.95rem;font-weight:700;line-height:1.2;'>${property.address || 'Объект недвижимости'}</div>
            <div style='font-size:0.75rem;opacity:0.9;margin-top:1px;'>${property.area} м²</div>
          </div>
        </div>
        <div style="background:white;padding:12px;border-radius:0 0 12px 12px;box-shadow:0 2px 12px rgba(0,0,0,0.06);margin-bottom:0;border:none;">
          <div style='display:flex;align-items:center;gap:6px;margin-bottom:6px;padding:4px;background:linear-gradient(135deg,#f8f9ff 0%,#f0f2ff 100%);border-radius:6px;'>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#28a745" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            <span style='font-weight:600;color:#495057;font-size:0.8rem;'>Площадь:</span>
            <span style='font-weight:700;color:#28a745;font-size:0.85rem;'>${property.area} м²</span>
          </div>
          <div style='display:flex;align-items:center;gap:6px;margin-bottom:6px;padding:4px;background:linear-gradient(135deg,#fff5f5 0%,#ffe8e8 100%);border-radius:6px;'>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#dc3545" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <path d="M16 8s-1.5 2-4 2-4-2-4-2"/>
              <line x1="9" y1="9" x2="9.01" y2="9"/>
              <line x1="15" y1="9" x2="15.01" y2="9"/>
              <path d="M9 15c.5.667 1.667 1 3 1s2.5-.333 3-1"/>
            </svg>
            <span style='font-weight:600;color:#495057;font-size:0.8rem;'>Цена за м²:</span>
            <span style='font-weight:700;color:#dc3545;font-size:0.85rem;'>${property.pricePerMeter.toLocaleString()} ₽/мес</span>
          </div>
          <div style='display:flex;align-items:center;gap:6px;margin-bottom:6px;padding:4px;background:linear-gradient(135deg,#f0f8ff 0%,#e6f3ff 100%);border-radius:6px;'>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1976d2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            <span style='font-weight:600;color:#495057;font-size:0.8rem;'>Цена за год:</span>
            <span style='font-weight:700;color:#1976d2;font-size:0.85rem;'>${property.pricePerYear.toLocaleString()} ₽</span>
          </div>
          ${property.totalPrice ? `<div style='display:flex;align-items:center;gap:6px;margin-bottom:6px;padding:4px;background:linear-gradient(135deg,#fff0f0 0%,#ffe6e6 100%);border-radius:6px;'>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#e74c3c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
            </svg>
            <span style='font-weight:600;color:#495057;font-size:0.8rem;'>Аренда:</span>
            <span style='font-weight:700;color:#e74c3c;font-size:0.85rem;'>${property.totalPrice.toLocaleString()} ₽/мес</span>
          </div>` : ''}
          <div style='display:flex;align-items:center;gap:6px;margin-bottom:6px;padding:4px;background:linear-gradient(135deg,#f8f0ff 0%,#f0e6ff 100%);border-radius:6px;'>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6f42c1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
              <rect x="16" y="21" width="4" height="7"/>
              <rect x="4" y="21" width="4" height="7"/>
            </svg>
            <span style='font-weight:600;color:#495057;font-size:0.8rem;'>Налог:</span>
            <span style='font-weight:700;color:#6f42c1;font-size:0.85rem;'>${property.tax}</span>
          </div>
          ${property.commission !== '-' ? `<div style='display:flex;align-items:center;gap:6px;margin-bottom:6px;padding:4px;background:linear-gradient(135deg,#fff8f0 0%,#ffe8d6 100%);border-radius:6px;'>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fd7e14" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
            </svg>
            <span style='font-weight:600;color:#495057;font-size:0.8rem;'>Комиссия:</span>
            <span style='font-weight:700;color:#fd7e14;font-size:0.85rem;'>${property.commission}</span>
          </div>` : ''}
          <div style='text-align:center;margin-top:12px;'>
            <a href='${property.url}' target='_blank' style='display:inline-block;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);color:white;padding:8px 20px;text-decoration:none;border-radius:20px;font-weight:600;font-size:12px;box-shadow:0 2px 8px rgba(102,126,234,0.2);transition:all 0.3s ease;border:none;'>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;margin-right:4px;vertical-align:middle;">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14,2 14,8 20,8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
                <polyline points="10,9 9,9 8,9"/>
              </svg>
              Открыть на ЦИАН →
            </a>
          </div>
        </div>
      </div>
    `;
    marker.bindPopup(popupContent, { maxWidth: 340, className: 'custom-popup' });

    // Убираем попапы - оставляем только красивые маркеры

    // Добавляем обработчики событий
    marker.on('click', () => {
      // Логируем информацию о зоне при клике на маркер
      if (property.lat && property.lng) {
        logZoneInfo(property.lat, property.lng, property.buildingId || property.url, property.objectNumber);
      }
      onSelect(property);
    });

    marker.on('mouseover', () => {
      marker.setZIndexOffset(2000); // Поднимаем маркер при наведении
    });

    marker.on('mouseout', () => {
      marker.setZIndexOffset(1000); // Возвращаем обычный z-index
    });

    console.log(`✓ Created 2GIS marker for ${property.address}:`, {
      lat: property.lat,
      lng: property.lng,
      price: property.pricePerMeter,
      area: property.area,
      marker: marker
    });

    return {
      id: property.url,
      marker: marker,
      property,
      destroy: () => {
        if (marker && marker.removeFrom) {
          marker.removeFrom(map);
        }
      }
    };
  } catch (error) {
    console.error('Error creating property marker:', error);
    return null;
  }
};

// Создаем все маркеры для объектов недвижимости с кластеризацией
export const createPropertyMarkers = (
  map: any,
  properties: CianProperty[],
  onSelect: (property: CianProperty) => void,
  priceType: 'perMeter' | 'total' = 'perMeter'
): PropertyMarker[] => {
  const markers: PropertyMarker[] = [];

  console.log('Creating property markers for', properties.length, 'properties');

  // Группируем объекты по координатам
  const clusters = groupPropertiesByCoordinates(properties);
  console.log(`Created ${clusters.length} clusters from ${properties.length} properties`);

  clusters.forEach((cluster, index) => {
    console.log(`Processing cluster ${index + 1}:`, {
      address: cluster.centerProperty.address,
      lat: cluster.centerProperty.lat,
      lng: cluster.centerProperty.lng,
      price: cluster.centerProperty.pricePerMeter,
      clusterSize: cluster.properties.length
    });

    const marker = createClusterMarker(map, cluster, onSelect, priceType);
    if (marker) {
      markers.push(marker);
      console.log(`✓ Created cluster marker for ${cluster.centerProperty.address} (${cluster.properties.length} objects)`);
    } else {
      console.warn(`✗ Failed to create cluster marker for ${cluster.centerProperty.address}`);
    }
  });

  console.log(`Created ${markers.length} cluster markers out of ${clusters.length} clusters`);
  return markers;
};

// Обновляем позиции маркеров при изменении карты
export const updateMarkerPositions = (
  markers: PropertyMarker[],
  map: any
): void => {
  // При использовании 2GIS API маркеры автоматически обновляют свои позиции
  // при изменении карты, поэтому эта функция больше не нужна
  console.log('Markers automatically update positions with 2GIS API');
}; 