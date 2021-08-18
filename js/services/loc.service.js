import { storageService } from './storage.service.js'


export const locService = {
    getLocs,
    createLoc
}



const placeKey = 'AIzaSyAFK3WXm2qO-8zSwLe3PKKP1OOgM375asM';
const KEY = 'locsDB'
const gLocs = storageService.load(KEY) || [];


function getLocs() {
    return new Promise((resolve, reject) => {
        resolve(gLocs);
    });
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
}

function getLoc(lat, lng, cb) {
    const prm = axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${placeKey}`)
    prm.then(res => {
        const placeId = res.data.results[0].place_id;
        const placeName = res.data.results[0].address_components[0].long_name;
        createLoc(placeId, placeName, lat, lng);
        cb(gLocs);
    })
}