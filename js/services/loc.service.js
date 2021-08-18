import { storageService } from './storage.service.js'


export const locService = {
    getLocs,
    createLoc
}

const gLocs = [
    createLoc('Greatplace', 32.047104, 34.832384),
    createLoc('Neveragain', 32.047201, 34.832581)
]
const placeKey = 'AIzaSyAFK3WXm2qO-8zSwLe3PKKP1OOgM375asM';

function getLocs() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(gLocs);
        }, 2000)
    });
}

function createLoc(id = '1', name, lat, lng) {
    return {
        id,
        name,
        lat,
        lng,
        weather: 'cloudy',
        createdAt: new Date(),
        updatedAt: 'hasnt been updated'
    }
}

getId(32.07389546666, 34.78003970715)

function getId(lat, lng) {
    const prm = axios.get(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=32.07389546666,34.78003970715&radius=1500&key=AIzaSyAFK3WXm2qO-8zSwLe3PKKP1OOgM375asM`)
    prm.then(res => {
        console.log(res.data)
    })
}