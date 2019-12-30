import axios from 'axios';

const form = document.querySelector('form')!;
const addressInput = document.getElementById('address')! as HTMLInputElement;

const GOOGLE_API_KEY = '';
const GOOGLE_ENDPOINT = 'https://maps.googleapis.com/maps/api/geocode/json';

declare var google: any;

type GoogleGeocodingResponse = { 
    results: { geometry: {location: { lat: number, lng: number } } }[],
    status: "OK" | "ZERO_RESULTS"
}

function searchAddressHandler( event: Event ){
    event.preventDefault();
    const enteredAddress = addressInput.value;

    axios
        .get<GoogleGeocodingResponse>(
            `${GOOGLE_ENDPOINT}?address=${encodeURI(enteredAddress)}&key=${GOOGLE_API_KEY}`
        ).then( response => {

            if ( response.data.status !== "OK") {
                throw new Error("Could not fetch response");
            }
            const coordinates = response.data.results[0].geometry.location;
            const map = new google.maps.Map(document.getElementById('map'), {
                center: coordinates,
                zoom: 16
              });   

            new google.maps.Marker({position: coordinates, map: map});
            console.log(response)
        })
        .catch(err => {
            console.log(err);
        });
}

form.addEventListener('submit',searchAddressHandler);
