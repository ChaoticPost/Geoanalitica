declare module '@2gis/mapgl' {
  export interface MapOptions {
    center: [number, number];
    zoom: number;
    key: string;
  }

  export class Map {
    constructor(container: HTMLElement, options: MapOptions);
    destroy(): void;
  }

  export function load(): Promise<{
    Map: typeof Map;
  }>;
} 