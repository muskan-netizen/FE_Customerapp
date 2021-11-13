
export const googlePlacesApi = async (data, key) => {
    console.log("key",key)
    try {
        // AIzaSyD0nhmGVsfQ3JwVaJeSa-yRKovdzMrEvwM
        let res = await fetch(`https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${data}&types=geocode&key=${key}`, {
            method: 'GET',
        });
  
        let response = await res.json();
        console.log("ressss",response)
        return response
    } catch (e) {
        console.log("erorr in goole place", e)
    }
}

export const getPlaceDetails = async (id, key) => {
    try {
        let res = await fetch(`https://maps.googleapis.com/maps/api/place/details/json?place_id=${id}&fields=name,formatted_address,geometry,rating,formatted_phone_number&key=${key}`, {
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
