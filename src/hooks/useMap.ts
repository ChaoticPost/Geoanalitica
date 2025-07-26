import { useEffect, useRef } from 'react';
import { load } from '@2gis/mapgl/global';
import { apiConfig } from '../config/api';

export const useMap = (
    containerId: string,
    center: number[],
    zoom: number
) => {
    const mapInstance = useRef(null);

    useEffect(() => {
        let map: any;

        load().then((mapgl) => {
            map = new mapgl.Map({
                container: containerId,
                center,
                zoom,
                key: apiConfig.map.API_KEY,
                style: apiConfig.map.STYLE,
                disableRotation: true,
            });

            mapInstance.current = map;
        });

        return () => {
            if (map) {
                map.destroy();
            }
        };
    }, [containerId, center, zoom]);

    return mapInstance;
}; 