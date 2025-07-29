import { Map } from '@2gis/mapgl';

declare module '@2gis/mapgl-terra-draw' {
  interface TerraDrawOptions {
    map: Map;
    style?: {
      fillColor?: string;
      fillOpacity?: number;
      strokeColor?: string;
      strokeWidth?: number;
    };
  }

  interface GeoJSONFeature {
    type: 'Feature';
    geometry: {
      type: string;
      coordinates: number[][][];
    };
    properties: Record<string, any>;
  }

  interface GeoJSONFeatureCollection {
    type: 'FeatureCollection';
    features: GeoJSONFeature[];
  }

  class TerraDraw {
    constructor(options: TerraDrawOptions);
    setMode(mode: string): void;
    updateData(data: GeoJSONFeatureCollection): void;
    destroy(): void;
  }

  export default TerraDraw;
} 