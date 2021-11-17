
import Geocoder from 'react-native-geocoder';
import Geolocation from 'react-native-geolocation-service';

export const googlePlacesApi = async (data, key) => {
    console.log("key", key)
    try {
        // AIzaSyD0nhmGVsfQ3JwVaJeSa-yRKovdzMrEvwM
        let res = await fetch(`https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${data}&types=geocode&key=${key}`, {
            method: 'GET',
        });

        let response = await res.json();
        console.log("ressss", response)
        return response
    } catch (e) {
        console.log("erorr in goole place", e)
    }
}

export const getPlaceDetails = async (id, key) => {
    try {
        let res = await fetch(`https://maps.googleapis.com/maps/api/place/details/json?place_id=${id}&key=${key}`, {
            method: 'GET',
        });
        let response = await res.json();
        return response
    } catch (e) {
        console.log("erorr in goole place", e)
    }
}

export const placesGeoCoding = async (lat, long) => {
    try {
        let res = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${long}&key=${key}`, {
            method: 'GET',
        });
        let response = await res.json();
        return response
    } catch (e) {
        console.log("erorr in goole place", e)
    }
}

export const nearbySearch = async (latlng, key) => {
    try {
        let res = await fetch(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latlng}&types=city&radius=5000&key=${key}`, {
            method: 'GET',
        });
        let response = await res.json();
        return response
    } catch (e) {
        console.log("erorr in goole place", e)
    }
}
// https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=-33.8670,151.1957&radius=5000&types=street&key=API_KEY

export const getCurrentLocationFromApi = () =>
    new Promise((resolve, reject) => {
        Geolocation.getCurrentPosition(
            position => {
                console.log("posisition",position)
                const cords = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                };
                resolve(cords);
            },
            error => {
                reject(error.message);
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
        )
    })
