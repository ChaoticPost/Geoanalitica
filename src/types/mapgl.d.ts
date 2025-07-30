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
    size?: number;
    color?: string;
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
    addPolygon(options: PolygonOptions): { destroy: () => void };
    addMarker(options: MarkerOptions): { destroy: () => void };
  }

  export class Map implements MapglMap {
    constructor(container: HTMLElement, options: MapGLOptions);
    destroy(): void;
    setZoom(zoom: number): void;
    getZoom(): number;
    getBounds(): LngLatBoundsArray;
    on(event: string, handler: EventHandler): void;
    off(event: string, handler: EventHandler): void;
    addPolygon(options: PolygonOptions): { destroy: () => void };
    addMarker(options: MarkerOptions): { destroy: () => void };
  }
}

declare module '@2gis/mapgl' {
  import { Map, MapGLOptions } from '@2gis/mapgl/types';

  export interface MapglAPI {
    Map: new (container: HTMLElement, options: MapGLOptions) => Map;
  }

  export function load(): Promise<MapglAPI>;
} 