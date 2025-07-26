import { useEffect, useRef } from 'react';
import { apiConfig } from '../config/api';
import { load } from '@2gis/mapgl/global';

interface MapProps {
    className?: string;
    center?: number[];
    zoom?: number;
}

export const Map = ({
    className = '',
    center = apiConfig.map.DEFAULT_CENTER,
    zoom = apiConfig.map.DEFAULT_ZOOM
}: MapProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<any>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        load().then((mapgl) => {
            mapRef.current = new mapgl.Map({
                container: containerRef.current!,
                center,
                zoom,
                key: apiConfig.map.API_KEY,
                style: apiConfig.map.STYLE,
                disableRotation: true,
            });
        });

        return () => {
            if (mapRef.current) {
                mapRef.current.destroy();
            }
        };
    }, [center, zoom]);

    return (
        <div ref={containerRef} className={`w-full h-full ${className}`} />
    );
}; 