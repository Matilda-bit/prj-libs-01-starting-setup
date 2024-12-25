import axios from 'axios';
const GOOGLE_API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;

if (!GOOGLE_API_KEY) {
    throw new Error('Google API Key is not defined in .env file');
}

console.log('Google API Key:', GOOGLE_API_KEY);
const form = document.querySelector('form')!;
const addressInput = document.getElementById('address')! as HTMLInputElement;

type GoogleGeocodingResponse  = {
    results: {geometry: {location: {lat: number, lng: number}}}[];
    status: 'OK' | 'ZERO_RESULTS';
};

function searchAddressHandler( event: Event) {
    event.preventDefault();

    const enteredAddress = addressInput.value;

    //send this to google's API
//    fetch('')
    //no compilation error, -> get()
    //need promise

    axios
    .get<GoogleGeocodingResponse>(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURI(enteredAddress)}&key=${GOOGLE_API_KEY}`)
    .then(response => {
        console.log(response);
        if(response.data.status != 'OK') {
            throw new Error('Could not fetch location!');
        }
        const coordinates = response.data.results[0].geometry.location;
        console.log(coordinates);

    })
    .catch (error => {
        alert(error.message);
        console.log(error);
    })

}

form.addEventListener('submit', searchAddressHandler)

