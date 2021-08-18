import { storageService } from './storage.service.js'


export const locService = {
    getLocs,
    createLoc
}


const gLocs = [
    createLoc('Greatplace', 32.047104, 34.832384),
    createLoc('Neveragain', 32.047201, 34.832581)
]

function getLocs() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(gLocs);
        }, 2000)
    });
}

function createLoc(name, lat, lng) {
    return {
        id: _createId(),
        name,
        lat,
        lng,
        weather: 'cloudy',
        createdAt: new Date(),
        updatedAt: 'hasnt been updated'
    }
}

function _createId() {
    return Math.random().toString(36).substr(2, 9);
}