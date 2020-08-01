'use strict';

/////////////////////////////////////////////////////////////
//// routes transaction to localhost 9000 - aws functions///
///////////////////////////////////////////////////////////
const fetch =               require('node-fetch')

const search = "http://localhost:9000/search.js"
const select = "http://localhost:9000/select.js"
const searchFn = `/.netlify/functions/search`
const selectFn = `/.netlify/functions/select`
let URL = "https://proximity-demo.vercel.app/unknown"

const proxy = (router) => {

	router.use(async(req, res, next) => {
    console.log(`----------------in proxy server----------`)    
      
    if (req.originalUrl == searchFn){
      URL = search
    } 
    
    if (req.originalUrl == selectFn){
      URL = select
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
 