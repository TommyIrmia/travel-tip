import { locService } from './services/loc.service.js'
import { mapService } from './services/map.service.js'



let gLocation;

window.onload = onInit;
window.onGetPos = onGetPos;
window.onGetLoc = onGetLoc;
window.onDeleteLoc = onDeleteLoc;
window.onPanTo = onPanTo;
window.onSearchLoc = onSearchLoc;
window.onAddMarker = onAddMarker;

function onInit() {
    const prm = mapService.initMap()
    console.log(prm);
    prm.then((map) => {
            console.log('Map is ready');
            return map
        })
        .then((map) => {
            clickMap(map)
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
    locService.deleteLoc(id)
        .then(() => {
            renderLocs();
        })
}


function onGetWeather(Location) {
    locService.getWeather(renderWeather, Location.lat, Location.lng);
}

function renderWeather(img) {

}



function onSearchLoc(ev) {
    if (ev) ev.preventDefault();
    const elInput = document.querySelector('[name=search]');
    if (!elInput) return;
    locService.getLocByName(renderLocs, elInput.value)
    elInput.value = '';

}

function onGetLoc() {
    const location = gLocation;
    locService.getLoc(location.lat, location.lng, renderLocs);
}

function clickMap(map) {
    map.addListener("click", (mapsMouseEvent) => {
        gLocation = mapsMouseEvent.latLng.toJSON();
        onAddMarker(gLocation.lat, gLocation.lng);
        onGetPos(gLocation);
    });
}

function onAddMarker(lat, lng) {
    mapService.addMarker({ lat, lng });
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