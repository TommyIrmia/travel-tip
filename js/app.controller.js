import { locService } from './services/loc.service.js'
import { mapService } from './services/map.service.js'

let gLocation =

    window.onload = onInit;
window.onAddMarker = onAddMarker;
window.onPanTo = onPanTo;
window.onGetLocs = onGetLocs;
window.onGetUserPos = onGetUserPos;
window.onCopyLoc = onCopyLoc;

function onInit() {
    mapService.initMap()
        .then(() => {
            console.log('Map is ready');
        })
        .then(() => {
            clickMap()
        })
        .catch(() => console.log('Error: cannot init map'));
}

// This function provides a Promise API to the callback-based-api of getCurrentPosition
function getPosition() {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    })
}

function onAddMarker() {
    console.log('Adding a marker');
    mapService.addMarker({ lat: 32.0749831, lng: 34.9120554 });
}

function onGetLocs() {
    locService.getLocs()
        .then(locs => {
            console.log('Locations:', locs)
            document.querySelector('.locs').innerText = JSON.stringify(locs)
        })
}

function onGetUserPos(location) {
    getPosition()
        .then(pos => {
            // console.log('User position is:', pos.coords);
            document.querySelector('.user-pos').innerText =
                (location) ? `Latitude: ${location.lat.toFixed(5)} - Longitude: ${location.lng.toFixed(5)}` :
                `Latitude: ${pos.coords.latitude.toFixed(5)} - Longitude: ${pos.coords.longitude.toFixed(5)}`;
        })
        .catch(err => {
            console.log('err!!!', err);
        })
}

function onPanTo() {
    mapService.panTo(35.6895, 139.6917);
}


function onCopyLoc() {
    const location = gLocation;

}

function clickMap() {
    const myLatlng = { lat: 32.0749831, lng: 34.9120554 };
    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 14,
        center: myLatlng,
    });
    let infoWindow = new google.maps.InfoWindow({
        content: "Click the map to get Lat/Lng!",
        position: myLatlng,
    });
    infoWindow.open(map);
    map.addListener("click", (mapsMouseEvent) => {
        infoWindow.close();
        infoWindow = new google.maps.InfoWindow({
            position: mapsMouseEvent.latLng,
        });
        infoWindow.setContent(
            JSON.stringify(mapsMouseEvent.latLng.toJSON(), null, 2)
        );
        infoWindow.open(map);
        const location = JSON.parse(infoWindow.content)
        onGetUserPos(location);
        gLocation = location;
    });
}