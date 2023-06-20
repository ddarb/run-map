import React, { useRef, useEffect, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import './map.css';

export default function Map() {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const lng = 151.7817;
    const lat = -32.9283;
    const zoom = 10;

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
                "source": "osm"
            }
        ]
    };

    const [markers, setMarkers] = useState([]);

    useEffect(() => {
        if (map.current) return;

        map.current = new maplibregl.Map({
            container: mapContainer.current,
            style: mapStyle,
            center: [lng, lat],
            zoom: zoom
        });

        const initialMarker = createMarker([lng, lat]);
        setMarkers([initialMarker]);

        map.current.on('click', function (e) {
            console.log('A click event has occurred at ' + e.lngLat);
            const newMarker = createMarker(e.lngLat);
            setMarkers(prevMarkers => [...prevMarkers, newMarker]);
        });

    }, []);

    useEffect(() => {
        markers.forEach(marker => marker.addTo(map.current));

        return () => {
            markers.forEach(marker => marker.remove()); // Cleanup: Remove all markers when markers change
        };
    }, [markers]);

    function createMarker(lngLat) {
        const marker = new maplibregl.Marker({
            color: "#FFFFFF",
            draggable: true
        })
            .setLngLat(lngLat);

        return marker;
    }

    function handleRemoveMarkers() {
        setMarkers([]);
    }

    return (
        <div className="map-wrap">
            <button onClick={handleRemoveMarkers}>Remove Markers</button>
            <div ref={mapContainer} className="map" />
            <pre id="coordinates" className="coordinates"></pre>
        </div>
    );
}
