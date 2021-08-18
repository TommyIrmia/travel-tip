import { storageService } from './storage.service.js'


export const locService = {
    getLocs,
    createLoc,
    getLoc: getLocByCoords,
    deleteLoc,
    getLocByName,
    getWeather
}

const API_KEY = 'AIzaSyAFK3WXm2qO-8zSwLe3PKKP1OOgM375asM';
const KEY = 'locsDB';
const gLocs = storageService.load(KEY) || [];
var gCurrWeather;

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

function getLocByName(cb1, cb2, name) {
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
            cb1(location)
            console.log(gCurrWeather);
            cb2();
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
        weather: gCurrWeather,
        createdAt: new Date(),
        updatedAt: 'hasnt been updated'
    }
    console.log('log.weather', loc.weather);

    gLocs.push(loc);
    storageService.save(KEY, gLocs);
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

function getWeather(cb, lat, lng) {
    const API = '50eaa7ad79344dabbbe21bda82485a31'
    const url = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&APPID=${API}`

    axios.get(url)
        .then((res) => {
            const weather = res.data.weather[0].description;
            gCurrWeather = weather;
            const weatherImg = res.data.weather[0].icon + '@2x.png';
            const imageUrl = `http://openweathermap.org/img/wn/${weatherImg}`;
            cb(weather, imageUrl)
        })
        .catch((err) => {
            console.log('Cannot reach server GOT:', err);
        })

}