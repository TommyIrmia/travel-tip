import { storageService } from './storage.service.js'


export const locService = {
    getLocs,
    createLoc,
    getLoc,
    deleteLoc,
    GetlocByName
}

const placeKey = 'AIzaSyAFK3WXm2qO-8zSwLe3PKKP1OOgM375asM';
const KEY = 'locsDB';
const LOC_KEY = 'locDB';
const SEARCH_KEY = 'searchDB';
const gLocs = storageService.load(KEY) || [];

function deleteLoc(locId) {
    const locIdx = gLocs.findIndex(loc => { loc.id === locId });
    return Promise.resolve(gLocs.splice(locIdx, 1));

}

function getLocs() {
    return new Promise((resolve, reject) => {
        resolve(gLocs);
    });
}


function GetlocByName(bc, name) {

    const SearchedLocs = storageService.load(SEARCH_KEY) || {};
    if (SearchedLocs[name]) {
        console.log('from cache');
        return Promise.resolve(SearchedLocs[name]);
    }

    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${name}&key=${placeKey}`

    axios.get(url)
        .then((res) => {
            const location = res.data.results[0].geometry.location;
            storageService.save(SEARCH_KEY, location)
            bc(location)
        })
        .catch((err) => {
            console.log('Cannot reach server yes:', err);
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
    console.log(loc);

    gLocs.push(loc);
    storageService.save(KEY, gLocs);
}

function getLoc(lat, lng, cb) {

    const prm = axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${placeKey}`)
    prm.then(res => {
            console.log(res.data.results[0].formatted_address);
            const placeId = res.data.results[0].place_id;
            const placeName = res.data.results[0].formatted_address;
            createLoc(placeId, placeName, lat, lng);
        })
        .then(() => {
            cb(gLocs)
        })
}