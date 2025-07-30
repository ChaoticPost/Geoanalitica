declare module 'h3-js' {
  export type H3Index = string;
  export type CoordPair = [number, number]; // [lat, lng]
  export type GeoCoord = [number, number]; // [lat, lng]
  export type GeoBoundary = GeoCoord[];

  export function latLngToCell(lat: number, lng: number, res: number): H3Index;
  export function cellToBoundary(h3Index: H3Index, formatAsGeoJson?: boolean): GeoBoundary;
  export function polyfill(coordinates: GeoCoord[], res: number, formatAsGeoJson?: boolean): H3Index[];
  export function getResolution(h3Index: H3Index): number;
} 