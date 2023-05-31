import React, { useRef, useEffect, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import './map.css';

export default function Map() {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const [lng] = useState(151.7817);
    const [lat] = useState(-32.9283);
    const [zoom] = useState(10);

    const mapStyle = {
        "version": 8,
        "sources": {
            "osm": {
                "type": "raster",
                "tiles": ["https://a.tile.openstreetmap.org/{z}/{x}/{y}.png"],
                "tileSize": 256,
                "attribution": "&copy; OpenStreetMap Contributors",
                "maxzoom": 19
            }
        },
        "layers": [
            {
                "id": "osm",
                "type": "raster",
                "source": "osm" // This must match the source key above
            }
        ]
    };


    useEffect(() => {
        if (map.current) return; //stops map from intializing more than once
        map.current = new maplibregl.Map({
            container: mapContainer.current,
            style: mapStyle,
            center: [lng, lat],
            zoom: zoom
        });

        // map.current.addControl(new maplibregl.NavigationControl(), 'top-right');
        new maplibregl.Marker({
            color: "#FFFFFF",
            // draggable: true
        }).setLngLat([lng, lat])
            .addTo(map.current);

    });




    return (
        // <div className="map-wrap">
        <div ref={mapContainer} className="map" />
        // </div>/
    );

}