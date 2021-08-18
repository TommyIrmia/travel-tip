export const mapService = {
    initMap,
    addMarker,
    panToLoc
}
var gMap;
var gMarker;

function initMap(lat = 32.0749831, lng = 34.9120554) {
    return _connectGoogleApi()
        .then((result) => {
            gMap = new google.maps.Map(
                document.querySelector('#map'), {
                    center: { lat, lng },
                    zoom: 15
                })
            return gMap
        })
}

function addMarker(loc) {
    if (gMarker) {
        gMarker.setMap(null)
    }
    gMarker = new google.maps.Marker({
        position: loc,
        map: gMap,
        title: 'Hello World!'
    });
    return gMarker;
}

function panToLoc(lat, lng) {
    console.log('lat', lat, 'lng', lng);
    addMarker({ lat, lng })
    const latLng = new google.maps.LatLng(lat, lng);
    gMap.panTo(latLng);
}

function _connectGoogleApi() {
    if (window.google) return Promise.resolve()
    const API_KEY = 'AIzaSyC_1P-SUEB9onV_8-rapOx5gTAWojdzqXY';
    var elGoogleApi = document.createElement('script');
    elGoogleApi.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}`;
    elGoogleApi.async = true;
    document.body.append(elGoogleApi);

    return new Promise((resolve, reject) => {
        elGoogleApi.onload = resolve;
        elGoogleApi.onerror = () => reject('Google script failed to load')
    })
}