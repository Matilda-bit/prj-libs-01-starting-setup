import axios from 'axios';
const GOOGLE_API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;

if (!GOOGLE_API_KEY) {
    throw new Error('Google API Key is not defined in .env file');
}

console.log('Google API Key:', GOOGLE_API_KEY);
const form = document.querySelector('form')!;
const addressInput = document.getElementById('address')! as HTMLInputElement;

// const GOOGLE_API_KEY  = 'AIzaSyDMoA1B-RyfP8DGEB41sr5ZgW2UlpQ6W_Y';

function searchAddressHandler( event: Event) {
    event.preventDefault();

    const enteredAddress = addressInput.value;

    //send this to google's API
//    fetch('')
    //no compilation error, -> get()
    //need promise

    axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURI(enteredAddress)}&key=${GOOGLE_API_KEY}`)
    .then(response => {
        console.log(response);
    })
    .catch (error => {
        console.log(error);
    })

}

form.addEventListener('submit', searchAddressHandler)

