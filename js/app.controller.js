import { locService } from './services/loc.service.js'
import { mapService } from './services/map.service.js'


let gLocation;

window.onload = onInit;
window.onGetPos = onGetPos;
window.onGetLoc = onGetLoc;
window.onDeleteLoc = onDeleteLoc;
window.onPanTo = onPanTo;

function onInit() {
    mapService.initMap()
        .then(() => {
            console.log('Map is ready');
        })
        .then(() => {
            clickMap()
        })
        .catch(() => console.log('Error: cannot init map'));

    renderLocs()

}

// This function provides a Promise API to the callback-based-api of getCurrentPosition
function getPosition() {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    })
}

function onGetPos(location) {
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

function onPanTo(lat, lng) {
    const prm = new Promise(resolve => {
        return resolve(mapService.panToLoc(lat, lng));
    })
}

function onDeleteLoc(id) {
    console.log(id);
    locService.deleteLoc(id)
        .then(() => {
            renderLocs();
        })
}

function onGetLoc() {
    const location = gLocation;
    locService.getLoc(location.lat, location.lng, renderLocs);

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
        onGetPos(location);
        mapService.addMarker({ lat: location.lat, lng: location.lng });
        gLocation = location;
    });
}

function renderLocs() {
    const elLocsTable = document.querySelector('.locations-table tbody');
    const locPrm = locService.getLocs();
    locPrm.then(locs => {
        const strHTMLs = locs.map(loc => {
            return `<tr>
            <td>${loc.name}</td>
            <td>${loc.weather}</td>
            <td><button class="action" onclick="onPanTo(${loc.lat}, ${loc.lng})" >GO</button></td>
            <td><button class="action" onclick="onDeleteLoc('${loc.id}')" >Delete</button></td>
        </tr>`
        })
        elLocsTable.innerHTML = strHTMLs.join('')
    })
}