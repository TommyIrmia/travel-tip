import { storageService } from './storage.service.js'


export const locService = {
    getLocs,
    createLoc,
    getLoc: getLocByCoords,
    deleteLoc,
    getLocByName
}

const API_KEY = 'AIzaSyAFK3WXm2qO-8zSwLe3PKKP1OOgM375asM';
const KEY = 'locsDB';
const gLocs = storageService.load(KEY) || [];

function deleteLoc(locId) {
    const locIdx = gLocs.findIndex(loc => loc.id === locId);
    gLocs.splice(locIdx, 1);
    storageService.save(KEY, gLocs);
    return Promise.resolve(gLocs);

}

function getLocs() {
    return new Promise((resolve) => {
        resolve(gLocs);
    });
}

function getLocByName(bc, name) {
    const isExist = gLocs.every(loc => loc.name !== name)
    if (!isExist) {
        console.log('already exists');
        return;
    }

    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${name}&key=${API_KEY}`;
    axios.get(url)
        .then((res) => {
            const placeId = res.data.results[0].place_id;
            const location = res.data.results[0].geometry.location;
            createLoc(placeId, name, location.lat, location.lng)
            bc(location)
        })
        .catch((err) => {
            console.log('Cannot reach server GOT:', err);
        })
}

function createLoc(id, name, lat, lng) {
    const loc = {
        id,
        name,
        lat,
        lng,
        weather: 'cloudy',
        createdAt: new Date(),
        updatedAt: 'hasnt been updated'
    }

    gLocs.push(loc);
    storageService.save(KEY, gLocs);
    return loc;
}

function getLocByCoords(lat, lng, cb) {
    const isExist = gLocs.every(loc => { return loc.lat !== lat && loc.lng !== lng })
    if (!isExist) {
        console.log('already exists');
        return;
    }
    const prm = axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${API_KEY}`)
    prm.then(res => {
            const placeId = res.data.results[0].place_id;
            const placeName = res.data.results[0].formatted_address;
            createLoc(placeId, placeName, lat, lng);
        })
        .then(() => {
            cb(gLocs)
        })
}