import { latLngToCell, cellToBoundary } from 'h3-js';
import type { MapglMap } from '@2gis/mapgl/global';

export class HexagonLayer {
  private map: MapglMap;
  private polygons: any[] = [];
  private color: string;

  constructor(map: MapglMap, color: string = '#4287f5') {
    this.map = map;
    this.color = color;
    
    // Создаем фиксированную сетку для Коньково
    this.createFixedGrid();
  }

  private createFixedGrid() {
    // Очищаем старые полигоны
    this.polygons.forEach(p => p.destroy());
    this.polygons = [];

    // Фиксированная область вокруг Коньково
    const center = { lat: 55.633520, lng: 37.519352 };
    const resolution = 9; // Фиксированное разрешение для хорошей детализации

    // Создаем сетку 7x7 гексагонов вокруг центра
    for (let i = -3; i <= 3; i++) {
      for (let j = -3; j <= 3; j++) {
        const lat = center.lat + (i * 0.005);
        const lng = center.lng + (j * 0.005);
        
        try {
          // Получаем ID гексагона
          const hexId = latLngToCell(lat, lng, resolution);
          
          // Получаем координаты границ гексагона
          const boundary = cellToBoundary(hexId, true) as Array<[number, number]>;
          
          // Преобразуем координаты для 2GIS
          const coordinates = boundary.map(([lat, lng]) => [lng, lat] as [number, number]);
          coordinates.push(coordinates[0]); // замыкаем полигон

          // Создаем полигон
          const polygon = this.map.addPolygon({
            coordinates: [coordinates],
            fillColor: this.color,
            fillOpacity: 0.5,
            strokeColor: '#000000',
            strokeWidth: 1,
            zIndex: 500, // Максимально высокий z-index
          });

          this.polygons.push(polygon);
        } catch (error) {
          console.error('Error creating hexagon:', error);
        }
      }
    }
  }

  public destroy(): void {
    this.polygons.forEach(p => p.destroy());
    this.polygons = [];
  }
}
