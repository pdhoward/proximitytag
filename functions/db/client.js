
require('dotenv').config()
const ObjectID = require('mongodb').ObjectID

// function takes an object which is a live connection to mongdb

exports.createClient = (client) => {
  
  let db = {} 
  // venue selected for targeted messages
  db.selectVenue = (venue) => {
    let email = subscriber.email
    return new Promise(async (resolve, reject) => {
      try {
        let id = venue._id
        let result = await client.db().collection('markets')
        .updateOne({ "_id": ObjectID(id) }, { $set:{"isVerified": true }})                        
        resolve(result)
        return  
      } catch(e){
        console.log(`Error updating verified subscriber in db`)
        console.log(e)
        reject(e)
        return
      }
     
    })    
  }
  // https://mongodb.github.io/node-mongodb-native/2.2/tutorials/geospatial-search/
  
  db.getVenues = (obj) => {
    let latitude
    let longitude
    // test coordinates for Austin - corresponds with test dataset
    let testLongitude = -97.7430608
    let testLatitude = 30.267153

    let distance = 1600
    console.log(`----- Inside of Get Venues Function ----`)
    console.log(obj)
    if (obj.timestamp){
      latitude = obj.latitude
      longitude = obj.longitude 
    } else {
      latitude = testLatitude
      longitude = testLongitude 
    }
    
    // test coordinates for Austin - using market test dataset
    //let testLongitude = -97.7430608
    //let testLatitude = 30.267153
    
    let testRange = 1600
    return new Promise ((resolve, reject) => {
      client.db().collection('markets').aggregate([
        {
          "$geoNear": {
              "near": {
                  "type": "Point",
                  "coordinates": [longitude, latitude ]
              },
              "distanceField": "calculated",
              "maxDistance": distance,
              "spherical": true
            }
          }          
      ],
      function(err, docs){
          if (err){
              console.log(err)
          }
          else{
              docs.toArray((error, result) => {
                if(error) console.log(error)
                resolve(result)
                return
              })
          }
      })
      
    })    
  }
  return db
}
