declare module '@2gis/mapgl' {
    export interface MapOptions {
        container: string | HTMLElement;
        center: number[];
        zoom: number;
        key: string;
        style?: string;
        disableRotation?: boolean;
    }

    export class Map {
        constructor(options: MapOptions);
        destroy(): void;
        setCenter(center: number[]): void;
        setZoom(zoom: number): void;
    }

    export function load(): Promise<typeof Map>;
}

declare module '@2gis/mapgl/global' {
    export interface MapOptions {
        container: string | HTMLElement;
        center: number[];
        zoom: number;
        key: string;
        style?: string;
        disableRotation?: boolean;
    }

    export interface MapGL {
        Map: new (options: MapOptions) => {
            destroy(): void;
            setCenter(center: number[]): void;
            setZoom(zoom: number): void;
        };
    }

    export function load(): Promise<MapGL>;
} 