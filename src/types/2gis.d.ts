declare module '@2gis/mapgl' {
  export interface MapOptions {
    center: [number, number];
    zoom: number;
    key: string;
    style?: string;
    styleZoom?: number;
    zoomControl?: boolean;
  }

  export interface MapBounds {
    northEast: { lat: number; lng: number };
    southWest: { lat: number; lng: number };
  }

  export interface PolygonOptions {
    coordinates: Array<[number, number]>[];
    fillColor?: string;
    fillOpacity?: number;
    strokeColor?: string;
    strokeWidth?: number;
    zIndex?: number;
  }

  export class MapglMap {
    constructor(container: HTMLElement, options: MapOptions);
    getZoom(): number;
    setZoom(zoom: number): void;
    getBounds(): MapBounds;
    on(event: string, handler: (...args: any[]) => void): void;
    off(event: string, handler: (...args: any[]) => void): void;
    destroy(): void;
  }

  export class Polygon {
    constructor(map: MapglMap, options: PolygonOptions);
    destroy(): void;
  }

  export function load(): Promise<{
    Map: typeof MapglMap;
    Polygon: typeof Polygon;
  }>;
} 