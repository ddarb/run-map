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

    var coordinates = document.getElementById('coordinates');

    useEffect(() => {
        if (map.current) return; //stops map from intializing more than once
        map.current = new maplibregl.Map({
            container: mapContainer.current,
            style: mapStyle,
            center: [lng, lat],
            zoom: zoom
        });

        // map.current.addControl(new maplibregl.NavigationControl(), 'top-right');
        var marker = new maplibregl.Marker({
            color: "#FFFFFF",
            draggable: true
        }).setLngLat([lng, lat])
            .addTo(map.current);

        function onDragEnd() {
            var lngLat = marker.getLngLat();
            console.log(lngLat)
        }

        marker.on('dragend', onDragEnd);

        map.current.on('click', function (e) {
            console.log('A click event has occurred at ' + e.lngLat);
            var marker = new maplibregl.Marker({
                color: "#FFFFFF",
                draggable: true
            }).setLngLat(e.lngLat)
                .addTo(map.current);
        });
    });


    return (
        <div className="map-wrap">
            <div ref={mapContainer} className="map" />
            <pre id="coordinates" class="coordinates"></pre>
        </div>
    );

}