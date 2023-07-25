import React, { useRef, useEffect, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import './map.css';
import { getRoute, convertRoute } from '../services/RouteService';

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
    const [routes, setRoutes] = useState([]);

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

        // Get the last two markers 
        if (markers.length > 1) {
            const routeCoords = markers.slice(-2).map(marker => [marker.getLngLat().lng, marker.getLngLat().lat])
            getRoute(routeCoords[0], routeCoords[1]).then(data => { updateRoute(data, true) })
        }


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
        // Clear the lines as well
        map.current.removeLayer('my-route-layer');
    }

    function updateRoute(geoJSONData, updateLayers) {
        if (map.current.getSource('my-route')) {
            // update source data
            map.current.getSource("my-route").setData(geoJSONData);
        } else {
            // create a new source
            map.current.addSource("my-route", {
                "type": "geojson",
                "data": geoJSONData
            });
        }

        if (map.current.getLayer('my-route-layer') || updateLayers) {
            // remove the previous version of layer
            if (map.current.getLayer('my-route-layer')) {
                map.current.removeLayer('my-route-layer');
            }

            map.current.addLayer({
                id: 'my-route-layer',
                source: 'my-route',
                type: 'line',
                layout: {
                    'line-cap': "round",
                    'line-join': "round"
                },
                paint: {
                    'line-color': "#6084eb",
                    'line-width': 8
                }
            });
        }
    }

    return (
        <div className="map-wrap">
            <button onClick={handleRemoveMarkers}>Remove Markers</button>
            <div ref={mapContainer} className="map" />
            <pre id="coordinates" className="coordinates"></pre>
        </div>
    );
}
