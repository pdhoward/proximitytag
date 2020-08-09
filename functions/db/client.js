
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
    // get the locations from obj - need to parse
    console.log(obj)
    // test coordinates for Austin - using market test dataset
    let testLongitude = '-97.7430608'
    let testLatitude = '30.267153'
    let testRange = 600
    return new Promise ((resolve, reject) => {
      client.db().collection('markets').aggregate([
        {
          "$geoNear": {
              "near": {
                  "type": "Point",
                  "coordinates": [ testLongitude, testLatitude ]
              },
              "distanceField": "calculated",
              "maxDistance": 600,
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
