declare module '@2gis/mapgl/types' {
  export type LngLatArray = [number, number];
  export type LngLatBoundsArray = [LngLatArray, LngLatArray];

  export interface MapGLOptions {
    center: LngLatArray;
    zoom: number;
    key: string;
    style?: string;
    zoomControl?: boolean;
    maxZoom?: number;
    minZoom?: number;
    maxBounds?: LngLatBoundsArray;
  }

  export interface PolygonOptions {
    coordinates: LngLatArray[][];
    color?: string;
    strokeColor?: string;
    strokeWidth?: number;
    fillOpacity?: number;
    interactive?: boolean;
    zIndex?: number;
  }

  export interface MarkerOptions {
    coordinates: LngLatArray;
    icon?: string;
    size?: [number, number];
    anchor?: [number, number];
    label?: {
      text: string;
      offset?: [number, number];
      fontSize?: number;
      color?: string;
      haloColor?: string;
      haloRadius?: number;
    };
    interactive?: boolean;
    zIndex?: number;
  }

  export interface MapglEvent {
    type: string;
    target: Map;
  }

  export type EventHandler = (event: MapglEvent) => void;

  export interface MapglMap {
    destroy(): void;
    setZoom(zoom: number): void;
    getZoom(): number;
    getBounds(): LngLatBoundsArray;
    on(event: string, handler: EventHandler): void;
    off(event: string, handler: EventHandler): void;
  }

  export class Map implements MapglMap {
    constructor(container: HTMLElement, options: MapGLOptions);
    destroy(): void;
    setZoom(zoom: number): void;
    getZoom(): number;
    getBounds(): LngLatBoundsArray;
    on(event: string, handler: EventHandler): void;
    off(event: string, handler: EventHandler): void;
  }

  export class Polygon {
    constructor(map: Map, options: PolygonOptions);
    destroy(): void;
    on(event: string, handler: EventHandler): void;
  }

  export class Marker {
    constructor(map: Map, options: MarkerOptions);
    destroy(): void;
    on(event: string, handler: EventHandler): void;
  }
}

declare module '@2gis/mapgl' {
  import { Map, MapGLOptions, Polygon, Marker } from '@2gis/mapgl/types';

  export interface MapglAPI {
    Map: new (container: HTMLElement, options: MapGLOptions) => Map;
    Polygon: new (map: Map, options: any) => Polygon;
    Marker: new (map: Map, options: any) => Marker;
  }

  export function load(): Promise<MapglAPI>;
}

// Добавляем глобальные типы для доступа к конструкторам
declare global {
  interface Window {
    mapgl?: {
      Map: any;
      Polygon: any;
      Marker: any;
    };
  }
} 