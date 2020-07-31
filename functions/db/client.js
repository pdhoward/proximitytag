
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
      let email = obj.email
      let name = obj.name
      let company = obj.coname
      let sector = obj.sector
      let website = obj.website 
      let comments = obj.comments      
      client.db().collection('markets').findOne({email: email}, (err, result) => {
        if (err) {
          console.log(`-----ERROR IN DB READ`)
          console.log(err)
          reject({error: err})
        }
        // found venues - update metrics - offered to client
        if (result && result.isVerified) {          
          let timestamp = Date.now() 
          let id = result._id
          client.db().collection('markets')
                     .updateOne({ "_id": ObjectID(id) }, 
                                { $set: {                                   
                                  timestamp: timestamp,
                                  beta: true,
                                  name: name,
                                  company: company,
                                  url: website,
                                  sector: sector,
                                  comments: comments
                                }})          
          resolve(result)
          return
        }        
        // no venues found 
        // log metrics - geolocation needs venues       
             
        client.db().collection('markets').insertOne(newsubscriber)
        resolve(newsubscriber)
        return
      })
    })    
  }
  return db
}
