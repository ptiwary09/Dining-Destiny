document.addEventListener("DOMContentLoaded", function () {
    if (typeof mapToken !== 'undefined' && typeof coordinates !== 'undefined') {
        mapboxgl.accessToken = mapToken;
        
        const map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/streets-v11',
            center: coordinates,
            zoom: 9
        });

        console.log(coordinates);

        const marker = new mapboxgl.Marker({ color: "red" })
            .setLngLat(coordinates)
            .setPopup(new mapboxgl.Popup({ offset: 25 })
                .setHTML("<p></p>"))
            .addTo(map);
    } else {
        console.error("Mapbox token or coordinates are undefined.");
    }
});
