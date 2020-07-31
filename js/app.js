var domButton = document.getElementById('huebutton'),
  domOutput = document.getElementById('output'),
  domLocale = document.getElementById('longlat'),
  lightUnit = 180 / 100,
  domColorvalue = document.createElement('div'),
  domFooter = document.querySelector('.txt-small');

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
  }

  const processGeoLocation = (form, e) => {
    const email = document.getElementById('email').value
    console.log(`---------STEP 1 - PROCESS Geo Location----`)
    console.log(email) 
    return fetch(`/.netlify/functions/geosearch`, {
      headers: {
        'Content-Type': 'application/json'},
      method: 'POST',
      body: JSON.stringify({email})
    })
    .then( async (result) => {
      console.log(`-----STEP 2 - Present Venue Options ----`)
      //console.log(result)
      //const response = await result.json()
      em = await result.json()
      console.log(em)

      // send to canvas
      if (!em.isVerified) {
        $('#dspemail').css('display','none');
        $('#dspverify').css('display','inline');
      } else {
        form.innerHTML = duplicate;
      }         
                    
      return {message: 'success'}
    })
    .catch(error => {
      form.innerHTML = `<div class="form--error">Error: ${error}</div>`;
    })
  }

domButton.addEventListener('click', fetchGeo, false);
} else {
  userFeedback('This app uses features not supported by your browser');
  domOutput.focus();
}