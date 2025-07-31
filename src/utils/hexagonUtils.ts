import { cellToLatLng, latLngToCell, getRes0Cells } from 'h3-js';

export interface HexagonLayer {
  destroy: () => void;
  update: () => void;
}

// Координаты района Коптево
const KOPTEVO_BOUNDS = {
  north: 55.841216,
  south: 55.821216,
  east: 37.536286,
  west: 37.516286
};

const KOPTEVO_CENTER = [55.831216, 37.526286];

export const createHexagonLayer = (map: any): HexagonLayer => {
  let hexagons: any[] = [];
  let isUpdating = false;

  const createHexagonElement = (lat: number, lng: number, size: number) => {
    const hexagon = document.createElement('div');
    hexagon.style.position = 'absolute';
    hexagon.style.width = `${size}px`;
    hexagon.style.height = `${size}px`;
    hexagon.style.backgroundColor = 'rgba(0, 128, 255, 0.4)'; // Более заметный цвет
    hexagon.style.border = '2px solid rgba(0, 128, 255, 0.8)'; // Более заметная граница
    hexagon.style.borderRadius = '50%';
    hexagon.style.pointerEvents = 'auto';
    hexagon.style.cursor = 'pointer';
    hexagon.style.zIndex = '5';
    hexagon.style.transform = 'translate(-50%, -50%)';
    hexagon.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)'; // Добавляем тень
    hexagon.title = `Гексагон: ${lat.toFixed(6)}, ${lng.toFixed(6)}`;

    // Добавляем hover эффект
    hexagon.addEventListener('mouseenter', () => {
      hexagon.style.backgroundColor = 'rgba(0, 128, 255, 0.6)';
      hexagon.style.border = '2px solid rgba(0, 128, 255, 1)';
      hexagon.style.boxShadow = '0 4px 8px rgba(0,0,0,0.3)';
    });

    hexagon.addEventListener('mouseleave', () => {
      hexagon.style.backgroundColor = 'rgba(0, 128, 255, 0.4)';
      hexagon.style.border = '2px solid rgba(0, 128, 255, 0.8)';
      hexagon.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
    });

    // Добавляем клик обработчик
    hexagon.addEventListener('click', () => {
      console.log('Hexagon clicked:', { lat, lng });
      // Здесь можно добавить логику для отображения данных гексагона
    });

    return hexagon;
  };

  const projectPoint = (lat: number, lng: number, mapContainer: HTMLElement, map: any) => {
    try {
      const bounds = map.getBounds();
      if (!bounds) return null;

      const containerRect = mapContainer.getBoundingClientRect();
      const width = containerRect.width;
      const height = containerRect.height;

      // Нормализуем координаты относительно границ карты
      const latRatio = (lat - bounds.getSouth()) / (bounds.getNorth() - bounds.getSouth());
      const lngRatio = (lng - bounds.getWest()) / (bounds.getEast() - bounds.getWest());

      // Преобразуем в пиксели
      const x = lngRatio * width;
      const y = (1 - latRatio) * height; // Инвертируем Y

      return { x, y };
    } catch (error) {
      console.warn('Error projecting point:', error);
      return null;
    }
  };

  const updateGrid = () => {
    if (isUpdating) return;
    isUpdating = true;

    try {
      console.log('Updating hexagon grid for Koptevo district');

      // Очищаем предыдущие гексагоны
      hexagons.forEach(hex => {
        if (hex.element && hex.element.parentNode) {
          hex.element.parentNode.removeChild(hex.element);
        }
      });
      hexagons = [];

      if (!map || !map.getContainer) {
        console.warn('Map not ready for hexagon grid');
        isUpdating = false;
        return;
      }

      const mapContainer = map.getContainer();
      if (!mapContainer) {
        console.warn('Map container not found');
        isUpdating = false;
        return;
      }

      // Создаем контейнер для гексагонов
      let hexagonContainer = mapContainer.querySelector('.hexagon-container');
      if (!hexagonContainer) {
        hexagonContainer = document.createElement('div');
        hexagonContainer.className = 'hexagon-container';
        hexagonContainer.style.position = 'absolute';
        hexagonContainer.style.top = '0';
        hexagonContainer.style.left = '0';
        hexagonContainer.style.width = '100%';
        hexagonContainer.style.height = '100%';
        hexagonContainer.style.pointerEvents = 'none';
        hexagonContainer.style.zIndex = '5';
        mapContainer.appendChild(hexagonContainer);
      }

      // Создаем равномерную сетку гексагонов в районе Коптево
      const gridSize = 20; // Размер сетки
      const hexSize = 40; // Увеличиваем размер гексагона

      for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
          // Вычисляем координаты в районе Коптево
          const lat = KOPTEVO_BOUNDS.south + (i / (gridSize - 1)) * (KOPTEVO_BOUNDS.north - KOPTEVO_BOUNDS.south);
          const lng = KOPTEVO_BOUNDS.west + (j / (gridSize - 1)) * (KOPTEVO_BOUNDS.east - KOPTEVO_BOUNDS.west);

          // Проверяем, что точка в пределах района Коптево
          if (lat >= KOPTEVO_BOUNDS.south && lat <= KOPTEVO_BOUNDS.north &&
            lng >= KOPTEVO_BOUNDS.west && lng <= KOPTEVO_BOUNDS.east) {

            const projected = projectPoint(lat, lng, mapContainer, map);
            if (projected) {
              const hexElement = createHexagonElement(lat, lng, hexSize);
              hexElement.style.left = `${projected.x}px`;
              hexElement.style.top = `${projected.y}px`;
              hexElement.style.pointerEvents = 'auto'; // Разрешаем взаимодействие

              hexagonContainer.appendChild(hexElement);

              hexagons.push({
                element: hexElement,
                lat,
                lng,
                projected
              });
            }
          }
        }
      }

      console.log(`Created ${hexagons.length} hexagons in Koptevo district`);

    } catch (error) {
      console.error('Error updating hexagon grid:', error);
    } finally {
      isUpdating = false;
    }
  };

  // Обновляем позиции гексагонов при изменении карты
  const updateHexagonPositions = () => {
    if (isUpdating) return;

    hexagons.forEach(hex => {
      if (hex.element && map) {
        const mapContainer = map.getContainer();
        if (mapContainer) {
          const projected = projectPoint(hex.lat, hex.lng, mapContainer, map);
          if (projected) {
            hex.element.style.left = `${projected.x}px`;
            hex.element.style.top = `${projected.y}px`;
            hex.projected = projected;
          }
        }
      }
    });
  };

  // Добавляем обработчики событий карты
  if (map) {
    map.on('moveend', updateHexagonPositions);
    map.on('zoomend', updateHexagonPositions);
  }

  return {
    destroy: () => {
      console.log('Destroying hexagon layer');
      hexagons.forEach(hex => {
        if (hex.element && hex.element.parentNode) {
          hex.element.parentNode.removeChild(hex.element);
        }
      });
      hexagons = [];

      if (map) {
        map.off('moveend', updateHexagonPositions);
        map.off('zoomend', updateHexagonPositions);
      }
    },
    update: () => {
      console.log('Updating hexagon layer');
      updateGrid();
    }
  };
}; 