declare module '@2gis/mapgl' {
    export interface MapGLOptions {
        container: string | HTMLElement;
        center: [number, number];
        zoom: number;
        key: string;
        style?: string;
        pitch?: number;
        rotation?: number;
        zoomControl?: boolean;
    }

    export default class Map {
        constructor(options: MapGLOptions);
        setCenter(center: [number, number]): void;
        setZoom(zoom: number): void;
        destroy(): void;
        on(event: string, callback: Function): void;
        off(event: string, callback: Function): void;
    }

    export class Marker {
        constructor(options?: {
            coordinates: [number, number];
            icon?: string;
            size?: [number, number];
            anchor?: [number, number];
            color?: string;
            label?: {
                text: string;
                offset?: [number, number];
                color?: string;
                fontSize?: number;
            };
        });
        setCoordinates(coordinates: [number, number]): void;
        remove(): void;
    }

    export class Clusterer {
        constructor(map: Map, options?: {
            radius?: number;
            minZoom?: number;
            maxZoom?: number;
        });
        load(points: Array<{
            coordinates: [number, number];
            type?: string;
            color?: string;
        }>): void;
        destroy(): void;
    }
} 