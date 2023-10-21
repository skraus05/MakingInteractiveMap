// Create map
    // Create tile layer
    // Create marker
    // Create group of markers
// get user location
// use fouresquare API to obtain location data
// Parse through fouresquare data
// create select form
// create submit button
// configure submit button
// link select for with parsed data from fouresquare
// update map with new foursquare data

window.onload = async () => {
    let userLocation = await getUserCoordinates()
    myMap.coordinates = userLocation;
    myMap.createMap(userLocation)
}

const myMap = {
    createMap: function(userLocation){
        const map = L.map('map', {
            center: userLocation,
            zoom: 12,
        });
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: '19',
        }).addTo(map)
        
        const marker = L.marker(userLocation)
        marker.addTo(map).bindPopup('<p1><b>You Are Here</b></p1>').openPopup()
        myMap.map = map
    },
    addMarkers: function() {
        for (let i = 0; i < 5; i++) {
            L.marker([myMap.markers[i][1].latitude, myMap.markers[i][1].longitude]).bindPopup(`${myMap.markers[i][0]}`).addTo(myMap.map)
        }
        //L.marker([myMap.markers[0][1].latitude, myMap.markers[0][1].longitude]).bindPopup(`${myMap.markers[0][0]}`).addTo(myMap.map)
        //console.log(myMap.markers)
    }
}
// obtaining user location
async function getUserCoordinates() {
    let position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
    });
    return [position.coords.latitude, position.coords.longitude];
}

let options = { method: 'GET', headers: { Accept: 'application/json', Authorization: 'fsq3ZsRSsuqwjl2/FopkyHJrWzPwiO8esJTrDZ+1zYkZnzs=' } }; //installed fouresquare

async function fetchBusiness(select) {
    let response = await fetch(`https://cors-anywhere.herokuapp.com/https://api.foursquare.com/v3/places/search?&query=${select}&limit=5&ll=${myMap.coordinates}`, options) //fetched data from 4square
    let places = await response.json();
    return places.results
}

function parseBusiness(results) {
    let businessLocations = []
    results.forEach(result =>  {
        let location = [result.name, result.geocodes.main]
        businessLocations.push(location)
    })
    return businessLocations;
}

document.getElementById('submit').addEventListener('click', function(e) {
    e.preventDefault();
    submitButton()
})

async function submitButton() {
    let selection = document.getElementById('business').value;
    let fetchedSelection = await fetchBusiness(selection);
    let parsedSelection = parseBusiness(fetchedSelection);
    myMap.markers = parsedSelection;
    myMap.addMarkers();
}   