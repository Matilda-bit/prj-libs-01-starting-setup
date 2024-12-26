import axios from 'axios';
const GOOGLE_API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;

if (!GOOGLE_API_KEY) {
    throw new Error('Google API Key is not defined in .env file');
}

console.log('Google API Key:', GOOGLE_API_KEY);
const form = document.querySelector('form')!;
const addressInput = document.getElementById('address')! as HTMLInputElement;

declare var google: any;

type GoogleGeocodingResponse  = {
    results: {geometry: {location: {lat: number, lng: number}}}[];
    status: 'OK' | 'ZERO_RESULTS';
};

function loadGoogleMapsApi(): Promise<void> {
    return new Promise((resolve, reject) => {
        const existingScript = document.querySelector(`script[src*="maps.googleapis.com"]`);
        if (existingScript) {
            resolve(); 
            return;
        }

        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_API_KEY}`;
        script.async = true; 
        script.defer = true;
        script.setAttribute('loading', 'async'); 
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('Failed to load the Google Maps API'));
        document.body.appendChild(script);
    });
}


async function searchAddressHandler(event: Event) {
    event.preventDefault();

    const enteredAddress = addressInput.value;

    try {
        const response = await axios.get<GoogleGeocodingResponse>(
            `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURI(enteredAddress)}&key=${GOOGLE_API_KEY}`
        );

        if (response.data.status !== 'OK') {
            throw new Error('Could not fetch location!');
        }

        const coordinates = response.data.results[0].geometry.location;

        await loadGoogleMapsApi();

        // Import necessary libraries
        //@ts-ignore
        const { Map } = await google.maps.importLibrary('maps') as google.maps.MapsLibrary;
        //@ts-ignore
        const { AdvancedMarkerElement } = await google.maps.importLibrary('marker') as google.maps.MarkerLibrary;

        const map = new Map(document.getElementById('map') as HTMLElement, {
            center: { lat: coordinates.lat, lng: coordinates.lng },
            zoom: 10,
            mapId: addressInput.value,
        });

        new AdvancedMarkerElement({
            position: coordinates,
            map: map,
            title: 'Location',
        });

    } catch (error: any) {
        alert(error.message);
        console.error(error);
    }
}


form.addEventListener('submit', searchAddressHandler)

