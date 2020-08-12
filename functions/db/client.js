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
    
    return new Promise ((resolve, reject) => {
      let latitude
      let longitude
      let distance = 3000    

      if (obj.timestamp){
        latitude = obj.latitude
        longitude = obj.longitude 
      } else {
        console.log(`----error detected. no coordinates---`)
        console.log(`inside functions/db/client`)
      }      
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
              reject(err)
          }
          else {
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