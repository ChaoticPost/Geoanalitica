import { useEffect, useRef, useState } from 'react';
import Map from '@2gis/mapgl';
import { API_CONFIG } from '../config/api';

interface UseMapProps {
    containerId: string;
    center?: [number, number];
    zoom?: number;
}

export const useMap = ({ 
    containerId,
    center = API_CONFIG.DEFAULT_CENTER,
    zoom = API_CONFIG.DEFAULT_ZOOM 
}: UseMapProps) => {
    const mapRef = useRef<Map | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        // Инициализация карты
        if (!mapRef.current) {
            mapRef.current = new Map({
                container: containerId,
                center: center,
                zoom: zoom,
                key: API_CONFIG.DGIS_API_KEY,
                style: API_CONFIG.MAP_STYLE,
                pitch: 0, // Убираем наклон
                rotation: 0,
                zoomControl: false, // Отключаем стандартный контрол зума
                rotateControl: false, // Отключаем контрол поворота
                pitchControl: false, // Отключаем контрол наклона
                fullscreenControl: false, // Отключаем контрол полноэкранного режима
                baseIndex: 0
            });

            setIsLoaded(true);
        }

        // Очистка при размонтировании
        return () => {
            if (mapRef.current) {
                mapRef.current.destroy();
                mapRef.current = null;
            }
        };
    }, [containerId]);

    // Обновление центра карты при изменении пропсов
    useEffect(() => {
        if (mapRef.current) {
            mapRef.current.setCenter(center);
        }
    }, [center]);

    // Обновление зума при изменении пропсов
    useEffect(() => {
        if (mapRef.current) {
            mapRef.current.setZoom(zoom);
        }
    }, [zoom]);

    return {
        map: mapRef.current,
        isLoaded
    };
}; 