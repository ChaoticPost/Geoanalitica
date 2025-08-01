import type { CianProperty } from './cianDataLoader';
import type { TerminalLocation } from './transactionDataLoader';
import type { PropertyMarker } from './markerUtils';
import type { TerminalMarker } from './terminalMarkerUtils';

export interface IntegratedLocation {
    lat: number;
    lng: number;
    address: string;
    properties: CianProperty[];
    terminals: TerminalLocation[];
}

export interface IntegratedMarker {
    marker: any;
    location: IntegratedLocation;
    destroy: () => void;
}

// Функция для группировки объектов по координатам
export const groupByLocation = (
    properties: CianProperty[],
    terminals: TerminalLocation[]
): IntegratedLocation[] => {
    const locationMap = new Map<string, IntegratedLocation>();

    // Добавляем объекты недвижимости
    properties.forEach(property => {
        if (!property.lat || !property.lng) return;

        const key = `${property.lat.toFixed(6)},${property.lng.toFixed(6)}`;
        if (!locationMap.has(key)) {
            locationMap.set(key, {
                lat: property.lat,
                lng: property.lng,
                address: property.address || 'Неизвестный адрес',
                properties: [],
                terminals: []
            });
        }
        locationMap.get(key)!.properties.push(property);
    });

    // Добавляем терминалы
    terminals.forEach(terminal => {
        const key = `${terminal.lat.toFixed(6)},${terminal.lng.toFixed(6)}`;
        if (!locationMap.has(key)) {
            locationMap.set(key, {
                lat: terminal.lat,
                lng: terminal.lng,
                address: terminal.address,
                properties: [],
                terminals: []
            });
        }
        locationMap.get(key)!.terminals.push(terminal);
    });

    return Array.from(locationMap.values());
};

// Функция для создания интегрированных маркеров
export const createIntegratedMarkers = (
    map: any,
    locations: IntegratedLocation[],
    onPropertySelect?: (property: CianProperty) => void,
    onTerminalSelect?: (terminal: TerminalLocation) => void
): IntegratedMarker[] => {
    const markers: IntegratedMarker[] = [];

    locations.forEach(location => {
        try {
            const marker = createIntegratedMarker(
                map,
                location,
                onPropertySelect,
                onTerminalSelect
            );
            markers.push(marker);
        } catch (error) {
            console.error('Error creating integrated marker:', error);
        }
    });

    return markers;
};

// Функция для создания одного интегрированного маркера
const createIntegratedMarker = (
  map: any,
  location: IntegratedLocation,
  onPropertySelect?: (property: CianProperty) => void,
  onTerminalSelect?: (terminal: TerminalLocation) => void
): IntegratedMarker => {
  const icon = createIntegratedIcon(location);
  
  const marker = (window as any).DG.marker([location.lat, location.lng], {
    icon,
    title: getMarkerTitle(location)
  });

  // Создаем всплывающую подсказку
  const popup = (window as any).DG.popup({
    maxWidth: 400,
    className: 'integrated-popup'
  }).setContent(createIntegratedPopupContent(location, onPropertySelect, onTerminalSelect));

  marker.bindPopup(popup);

  // Добавляем обработчик клика
  marker.on('click', () => {
    // Если есть только один объект, сразу его выбираем
    if (location.properties.length === 1 && location.terminals.length === 0) {
      onPropertySelect?.(location.properties[0]);
    } else if (location.terminals.length === 1 && location.properties.length === 0) {
      onTerminalSelect?.(location.terminals[0]);
    }
    // Иначе показываем popup с выбором
  });

  // Добавляем обработчики для элементов в popup
  marker.on('popupopen', () => {
    setTimeout(() => {
      const popupElement = document.querySelector('.integrated-popup');
      if (popupElement) {
        // Обработчики для объектов недвижимости
        popupElement.querySelectorAll('.property-item').forEach((element, index) => {
          element.addEventListener('click', () => {
            onPropertySelect?.(location.properties[index]);
          });
        });

        // Обработчики для терминалов
        popupElement.querySelectorAll('.terminal-item').forEach((element, index) => {
          element.addEventListener('click', () => {
            onTerminalSelect?.(location.terminals[index]);
          });
        });
      }
    }, 100);
  });

  marker.addTo(map);

  return {
    marker,
    location,
    destroy: () => {
      marker.remove();
    }
  };
};

// Функция для создания иконки интегрированного маркера
const createIntegratedIcon = (location: IntegratedLocation) => {
    const hasProperties = location.properties.length > 0;
    const hasTerminals = location.terminals.length > 0;

    let backgroundColor = '#666666'; // Серый по умолчанию
    let iconText = '?';

    if (hasProperties && hasTerminals) {
        backgroundColor = '#9c27b0'; // Фиолетовый - смешанный
        iconText = '🏢💳';
    } else if (hasProperties) {
        backgroundColor = '#2196f3'; // Синий - недвижимость
        iconText = '🏢';
    } else if (hasTerminals) {
        backgroundColor = '#4caf50'; // Зеленый - терминалы
        iconText = '💳';
    }

    const totalItems = location.properties.length + location.terminals.length;
    const size = Math.max(20, Math.min(40, 20 + totalItems * 2));

    return (window as any).DG.divIcon({
        html: `
      <div style="
        width: ${size}px;
        height: ${size}px;
        background-color: ${backgroundColor};
        border: 3px solid white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 3px 6px rgba(0,0,0,0.3);
        position: relative;
        font-size: ${Math.max(10, size * 0.4)}px;
        color: white;
        font-weight: bold;
      ">
        ${iconText}
        ${totalItems > 1 ? `<div style="
          position: absolute;
          top: -5px;
          right: -5px;
          background: #ff5722;
          color: white;
          border-radius: 50%;
          width: 18px;
          height: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          font-weight: bold;
        ">${totalItems}</div>` : ''}
      </div>
    `,
        className: 'integrated-marker',
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2]
    });
};

// Функция для получения заголовка маркера
const getMarkerTitle = (location: IntegratedLocation): string => {
    const parts = [];
    if (location.properties.length > 0) {
        parts.push(`${location.properties.length} объект(ов) недвижимости`);
    }
    if (location.terminals.length > 0) {
        parts.push(`${location.terminals.length} терминал(ов)`);
    }
    return parts.join(', ');
};

// Функция для создания содержимого всплывающей подсказки
const createIntegratedPopupContent = (
  location: IntegratedLocation,
  onPropertySelect?: (property: CianProperty) => void,
  onTerminalSelect?: (terminal: TerminalLocation) => void
) => {
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Создаем уникальные ID для обработчиков
  const popupId = `popup_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  return `
    <div style="font-family: Arial, sans-serif; min-width: 350px; max-width: 400px;">
      <div style="
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 12px;
        margin: -12px -12px 12px -12px;
        border-radius: 8px 8px 0 0;
        font-weight: bold;
        font-size: 14px;
      ">
        📍 ${location.address}
      </div>
      
      ${location.properties.length > 0 ? `
        <div style="margin-bottom: 16px;">
          <h4 style="margin: 0 0 8px 0; color: #2196f3; font-size: 14px;">
            🏢 Объекты недвижимости (${location.properties.length})
          </h4>
          <div style="max-height: 150px; overflow-y: auto;">
            ${location.properties.map((property, index) => `
              <div style="
                background: #f8f9fa;
                padding: 8px;
                margin-bottom: 6px;
                border-radius: 6px;
                border-left: 3px solid #2196f3;
                cursor: pointer;
                transition: background-color 0.2s;
              " 
              data-property-index="${index}"
              data-popup-id="${popupId}"
              class="property-item"
              onmouseover="this.style.backgroundColor='#e3f2fd'"
              onmouseout="this.style.backgroundColor='#f8f9fa'"
              >
                <div style="font-weight: bold; margin-bottom: 4px;">
                  ${property.buildingName || `Объект ${property.objectNumber}`}
                </div>
                <div style="font-size: 12px; color: #666;">
                  Площадь: ${property.area} м² • Цена: ${formatAmount(property.pricePerMeter)}/м²
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}
      
      ${location.terminals.length > 0 ? `
        <div style="margin-bottom: 16px;">
          <h4 style="margin: 0 0 8px 0; color: #4caf50; font-size: 14px;">
            💳 Терминалы (${location.terminals.length})
          </h4>
          <div style="max-height: 150px; overflow-y: auto;">
            ${location.terminals.map((terminal, index) => `
              <div style="
                background: #f8f9fa;
                padding: 8px;
                margin-bottom: 6px;
                border-radius: 6px;
                border-left: 3px solid #4caf50;
                cursor: pointer;
                transition: background-color 0.2s;
              "
              data-terminal-index="${index}"
              data-popup-id="${popupId}"
              class="terminal-item"
              onmouseover="this.style.backgroundColor='#e8f5e8'"
              onmouseout="this.style.backgroundColor='#f8f9fa'"
              >
                <div style="font-weight: bold; margin-bottom: 4px;">
                  Терминал ${terminal.terminal_id}
                </div>
                <div style="font-size: 12px; color: #666;">
                  ${terminal.category} • ${formatAmount(terminal.totalAmount)} (${terminal.transactionCount} транзакций)
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}
      
      <div style="
        background: #f1f3f4;
        padding: 8px;
        border-radius: 6px;
        font-size: 12px;
        color: #666;
        text-align: center;
      ">
        💡 Нажмите на объект для детальной информации
      </div>
    </div>
  `;
};

// Функция для обновления интегрированных маркеров
export const updateIntegratedMarkers = (
    markers: IntegratedMarker[],
    locations: IntegratedLocation[]
) => {
    // Удаляем старые маркеры
    markers.forEach(marker => marker.destroy());

    // Создаем новые маркеры (если есть доступ к карте)
    // В реальном приложении нужно передать map как параметр
    return [];
}; 