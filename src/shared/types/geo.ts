export interface Coordinates {
  latitude: number
  longitude: number
}

export interface GeoPoint {
  id: number
  name: string
  coordinates: Coordinates
  description?: string
}

export interface GeoPolygon {
  id: number
  name: string
  coordinates: Coordinates[]
  description?: string
} 