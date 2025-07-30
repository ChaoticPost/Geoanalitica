import { latLngToCell, cellToBoundary, cellToLatLng, getResolution } from 'h3-js';
import type { MapglMap } from '@2gis/mapgl/global';

interface Point {
  lat: number;
  lng: number;
}

export class HexagonLayer {
  private map: MapglMap;
  private polygons: any[] = [];
  private points: Point[] = [];
  private resolution: number = 9;
  private boundsChangeHandler: (() => void) | null = null;

  constructor(map: MapglMap, points: Point[] = []) {
    console.log('HexagonLayer constructor called with points:', points.length);
    this.map = map;
    this.points = points;
    
    // Создаем начальную сетку
    this.updateGrid();
    
    // Привязываем обработчик изменения границ карты
    this.boundsChangeHandler = this.updateGrid.bind(this);
    this.map.on('moveend', this.boundsChangeHandler);
  }

  private getOptimalResolution(): number {
    const zoom = this.map.getZoom();
    console.log('Current map zoom:', zoom);
    // Подбираем оптимальное разрешение H3 в зависимости от зума карты
    if (zoom <= 10) return 7;
    if (zoom <= 12) return 8;
    if (zoom <= 14) return 9;
    return 10;
  }

  private getColor(count: number, maxCount: number): string {
    // Нормализуем значение от 0 до 1
    const normalized = Math.min(count / (maxCount || 1), 1);
    
    // Определяем цвета для градиента (красный -> желтый -> зеленый)
    const colors = [
      { r: 239, g: 68, b: 68 },   // Красный
      { r: 250, g: 204, b: 21 },  // Желтый
      { r: 34, g: 197, b: 94 }    // Зеленый
    ];

    let segment: number;
    let color1: typeof colors[0];
    let color2: typeof colors[0];

    if (normalized <= 0.5) {
      segment = normalized * 2;
      color1 = colors[0];
      color2 = colors[1];
    } else {
      segment = (normalized - 0.5) * 2;
      color1 = colors[1];
      color2 = colors[2];
    }

    // Интерполируем между цветами
    const r = Math.round(color1.r + (color2.r - color1.r) * segment);
    const g = Math.round(color1.g + (color2.g - color1.g) * segment);
    const b = Math.round(color1.b + (color2.b - color1.b) * segment);

    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  }

  private getBoundingHexagons(bounds: { north: number; south: number; west: number; east: number }, resolution: number): string[] {
    console.log('Getting bounding hexagons for bounds:', bounds, 'with resolution:', resolution);
    const hexagons = new Set<string>();
    
    // Создаем сетку точек внутри границ
    const latStep = (bounds.north - bounds.south) / 10;
    const lngStep = (bounds.east - bounds.west) / 10;
    
    for (let lat = bounds.south; lat <= bounds.north; lat += latStep) {
      for (let lng = bounds.west; lng <= bounds.east; lng += lngStep) {
        try {
          const hexId = latLngToCell(lat, lng, resolution);
          hexagons.add(hexId);
        } catch (error) {
          console.error('Error getting hexagon for coordinates:', { lat, lng }, error);
        }
      }
    }
    
    console.log('Generated hexagons:', hexagons.size);
    return Array.from(hexagons);
  }

  private updateGrid() {
    console.log('Updating hexagon grid');
    try {
      // Очищаем старые полигоны
      this.polygons.forEach(p => p.destroy());
      this.polygons = [];

      // Получаем границы видимой области карты
      const bounds = this.map.getBounds();
      console.log('Map bounds:', bounds);
      const resolution = this.getOptimalResolution();
      console.log('Using resolution:', resolution);

      // Получаем все гексагоны в видимой области
      const visibleHexagons = this.getBoundingHexagons({
        north: bounds[1][1],
        south: bounds[0][1],
        west: bounds[0][0],
        east: bounds[1][0]
      }, resolution);

      // Считаем точки в каждом гексагоне
      const hexagonCounts = new Map<string, number>();
      
      this.points.forEach(point => {
        try {
          const hexId = latLngToCell(point.lat, point.lng, resolution);
          hexagonCounts.set(hexId, (hexagonCounts.get(hexId) || 0) + 1);
        } catch (error) {
          console.error('Error counting point:', point, error);
        }
      });

      // Находим максимальное количество точек
      const maxCount = Math.max(...Array.from(hexagonCounts.values(), v => v || 0), 1);
      console.log('Max points in hexagon:', maxCount);

      // Создаем полигоны для каждого гексагона
      console.log('Creating polygons for hexagons:', visibleHexagons.length);
      visibleHexagons.forEach(hexId => {
        try {
          const count = hexagonCounts.get(hexId) || 0;
          const boundary = cellToBoundary(hexId, true) as Array<[number, number]>;
          const coordinates = boundary.map(([lat, lng]) => [lng, lat] as [number, number]);
          coordinates.push(coordinates[0]); // замыкаем полигон

          const polygon = this.map.addPolygon({
            coordinates: [coordinates],
            fillColor: this.getColor(count, maxCount),
            fillOpacity: 0.5,
            strokeColor: '#ffffff',
            strokeWidth: 1,
            zIndex: 500
          });

          this.polygons.push(polygon);
        } catch (error) {
          console.error('Error creating hexagon:', error, 'hexId:', hexId);
        }
      });
      console.log('Created polygons:', this.polygons.length);
    } catch (error) {
      console.error('Error in updateGrid:', error);
    }
  }

  public setPoints(points: Point[]) {
    console.log('Setting new points:', points.length);
    this.points = points;
    this.updateGrid();
  }

  public destroy(): void {
    console.log('Destroying hexagon layer');
    if (this.boundsChangeHandler) {
      this.map.off('moveend', this.boundsChangeHandler);
    }
    this.polygons.forEach(p => p.destroy());
    this.polygons = [];
  }
}
