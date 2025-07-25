import { useEffect } from 'react';
import { useMap } from '../hooks/useMap';
import { API_CONFIG } from '../config/api';

interface MapProps {
    className?: string;
    center?: [number, number];
    zoom?: number;
}

export const Map = ({
    className = '',
    center = API_CONFIG.DEFAULT_CENTER,
    zoom = API_CONFIG.DEFAULT_ZOOM
}: MapProps) => {
    const containerId = 'map';
    const { map, isLoaded } = useMap({ containerId, center, zoom });

    useEffect(() => {
        // Здесь можно добавить дополнительную логику после загрузки карты
        if (isLoaded && map) {
            console.log('Map loaded successfully');
        }
    }, [isLoaded, map]);

    return (
        <div
            id={containerId}
            className={`w-full h-full min-h-[400px] rounded-lg overflow-hidden ${className}`}
        />
    );
}; 