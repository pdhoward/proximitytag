const domButton = document.getElementById('huebutton')
const domOutput = document.getElementById('output')
const domLocale = document.getElementById('longlat')
const domVenues = document.getElementById('venues')
const domTestLocation = document.getElementById('testlocation')
const lightUnit = 180 / 100
const domColorvalue = document.createElement('div')
const domFooter = document.querySelector('.txt-small')


if (navigator.geolocation) {

  if (navigator.permissions) {
    navigator.permissions.query({
      name: 'geolocation'
    }).then(function(permissionStatus) {

      function permissionCheck() {
      	if (permissionStatus.state === 'denied') {
        	userFeedback('Geolocation required. Allow location when prompted by your browser');
      	}
      	if (permissionStatus.state === 'prompt') {
        	userFeedback('App requires geolocation. Allow location when prompted by your browser');
      	}
      	else if (permissionStatus.state === 'granted') {
      		userFeedback();
      	}
      }
      permissionCheck();

      permissionStatus.addEventListener('change', permissionCheck, false);

    });
  }
  
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js',{scope:'./'}).then(function(reg) {
      console.log('Service Worker Registered!');
      domFooter.textContent += ' \u2022 Available Offline';
    }).catch(function(error) {
      console.log('Registration failed with ' + error);
    });
  }
  
  function userFeedback(m) {
        domOutput.textContent = m ? m : "";
  }

  function fetchGeo(position) {
    navigator.geolocation.getCurrentPosition(makeColor, errorFeedback, {
      timeout: 30000,
      maximumAge: 600000
    });
    // ‘Finding’ placeholder...
    userFeedback();
    domColorvalue.className = 'color txt-small notranslate';
    domColorvalue.textContent = 'Finding…';
    domOutput.appendChild(domColorvalue);
  }

  function errorFeedback(error) {
    if (window.isSecureContext === false || error.message.indexOf('Only secure origins are allowed') == 0) {
      userFeedback('Browser prevents geolocation use via non-secure (HTTP) page');
    }
    else {
      alert('Error - ' + error.message);
   	  userFeedback('Geolocation failed! Check settings and signal. Reload page and try again');
    }
  }

  function makeHue(position) {    
    if (position.coords.longitude > 0) {
      return Math.round(position.coords.longitude);
    } else {
      return Math.round(position.coords.longitude - -180 * 2);
    }   
  }

  function makeSat(position) {   
    if (position.coords.latitude > 0) {
      return Math.round((180 - Math.round(position.coords.latitude) - 90) / lightUnit); //  Northern Latitude – Needs to range from 0 – 90
    } else {
      return Math.round((180 - (Math.round(position.coords.latitude) - -90)) / lightUnit); // Southern Latitude – Needs to range from 90 – 180
    }
  }

  function makeColor(position) {
	
	  userFeedback();
	
    var domOutputcolour = 'HSLA(' + makeHue(position) + ', ' + makeSat(position) + '%, 50%, 1)';

    // Display Colour Value
    domColorvalue.textContent = domOutputcolour;
    domOutput.style.backgroundColor = domOutputcolour;
    domOutput.appendChild(domColorvalue);
    // do a location lookup ... mongodb for a venue ... closest? or an Array?
    // use a redirect
    domOutput.focus();
    findVenues(position)
  }

  // function to retrieve venues from mongodb - machine/markets
  function findVenues(position) {    
    let coordinates = {}
    coordinates.latitude = position.coords.latitude
    coordinates.longitude = position.coords.longitude
    coordinates.timestamp = position.timestamp
    console.log(`---GeoLocation Fetched ---`)
    console.log(coordinates)
    return fetch(`/.netlify/functions/search`, {
      headers: {
        'Content-Type': 'application/json'},
      method: 'POST',
      body: JSON.stringify(coordinates)
    })
    .then( async (result) => {  
      let venues = await result.json()
      // only show 8 venues
      let maxVenues = 8
      let x = 0

      if (maxVenues > venues.length) {
        x = venues.length
      } else {
        x = maxVenues
      }      

      if (venues.length === 0) {
        userFeedback('No participating venues found near you. Try the test button ➹ below to experience the joy.');
      }

      domButton.style.display = 'none'

      for (var i = 0; i < x; i++) {
        var btn = document.createElement("a");
        btn.classList.add('button4')
        var t = document.createTextNode(venues[i].name);
        btn.appendChild(t);
        btn.setAttribute("href", "https://findit.vercel.app/venues/" + venues[i].marketid )
        btn.setAttribute("data-index", i )
        btn.setAttribute("style", "background-color: blue" )
        btn.setAttribute("target", "_blank" )
        domVenues.appendChild(btn);
      }
      
                    
      return {message: 'success'}
    })
    .catch(error => {
      console.log(error)
    })
  }

  // function to retrieve test venues from mongodb - machine/markets
 function fetchTestVenues() {    
    let coordinates = {}
    // test coordinates for Austin - corresponds with test dataset
    coordinates.longitude = -97.7430608
    coordinates.latitude = 30.267153    
    coordinates.timestamp = Date.now()  
    domColorvalue.className = 'color txt-small notranslate';
    domColorvalue.textContent = 'Demonstration: Fetching Venues in Austin, TX';
    domOutput.appendChild(domColorvalue);
    return fetch(`/.netlify/functions/search`, {
      headers: {
        'Content-Type': 'application/json'},
      method: 'POST',
      body: JSON.stringify(coordinates)
    })
    .then( async (result) => {   
      let venues = await result.json()    
      
      // only show 8 venues
      let maxVenues = 8
      let x = 0

      if (maxVenues > venues.length) {
        x = venues.length
      } else {
        x = maxVenues
      }
      userFeedback()

      domButton.style.display = 'none'
      userFeedback('Sample of test locations in Austin, TX. Connected conversations at scale')

      for (var i = 0; i < x; i++) {
        var btn = document.createElement("a");
        btn.classList.add('button4')
        var t = document.createTextNode(venues[i].name);
        btn.appendChild(t);
        btn.setAttribute("href", "https://findit.vercel.app/venues/" + venues[i].marketid )
        btn.setAttribute("data-index", i )
        btn.setAttribute("style", "background-color: blue" )
        btn.setAttribute("target", "_blank" )
        domVenues.appendChild(btn);
      }
      
                    
      return {message: 'success'}
    })
    .catch(error => {
      console.log(error)
    })
  }

  // register click events
    domButton.addEventListener('click', fetchGeo, false);
    domTestLocation.addEventListener('click', fetchTestVenues, false);

} else {
  userFeedback('This app uses features not supported by your browser');
  domOutput.focus();
}

