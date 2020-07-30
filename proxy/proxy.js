'use strict';

/////////////////////////////////////////////////////////////
//// routes transaction to localhost 9000 - aws functions///
///////////////////////////////////////////////////////////
const fetch =               require('node-fetch')

const newsubscriber = "http://localhost:9000/newsubscriber.js"
const betasubscriber = "http://localhost:9000/betasubscriber.js"
const verifysubscriber = "http://localhost:9000/verifysubscriber.js"
const GETSUB = `/.netlify/functions/newsubscriber`
const GETBETA = `/.netlify/functions/betasubscriber`
const VERIFYSUB = `/.netlify/functions/verifysubscriber`
let URL = "http://localhost:9000/newsubscriber.js"

const proxy = (router) => {

	router.use(async(req, res, next) => {
    console.log(`----------------in proxy server----------`)    
      
    if (req.originalUrl == GETSUB){
      URL = newsubscriber
    } 
    
    if (req.originalUrl == GETBETA){
      URL = betasubscriber
    }

    if (req.originalUrl == VERIFYSUB){
      URL = verifysubscriber
    }

    return new Promise(async (resolve, reject) =>{
      try {       
         const response = await fetch(URL, {
          method: "POST",
          headers: {
            'Content-Type': 'application/json'
          },  
          body: JSON.stringify(req.body)
          });     
         let resp = await response.json()
         console.log(`------------back in proxy response-------`)         
         res.json(resp)
         resolve('success')
         next()
        }
        catch(err){      
            console.log(`err`)
            reject(err)            
        }
    })     

  })  
}

module.exports = proxy
 