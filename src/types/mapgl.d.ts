declare module '@2gis/mapgl' {
  export interface MapOptions {
    center: [number, number];
    zoom: number;
    key: string;
    styleZoom?: number;
    style?: string;
    zoomControl?: boolean;
  }

  export interface MapglAPI {
    Map: new (container: HTMLElement, options: MapOptions) => MapglMap;
  }

  export interface MapglMap {
    getZoom(): number;
    setZoom(zoom: number): void;
    destroy(): void;
  }

  export function load(): Promise<MapglAPI>;
}

export type Map = MapglMap; 