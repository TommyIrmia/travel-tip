export const storageService = {
        save: saveToStorage,
        load: loadFromStorage
    }
    // technique for debug from console:
    // window.storush = storageService


function saveToStorage(key, val) {
    localStorage.setItem(key, JSON.stringify(val))
}

function loadFromStorage(key) {
    const json = localStorage.getItem(key)
    return JSON.parse(json)
}