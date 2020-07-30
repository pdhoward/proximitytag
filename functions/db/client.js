
require('dotenv').config()
const ObjectID = require('mongodb').ObjectID

function subscriberTemplate() {
  this.email = "strategicmachines@gmail.com"
  this.token = "12345"
  this.name = "anonymous"
  this.company = "Strategic Machines"
  this.url = "https:proximitymachine.netlify.com"
  this.sector = "software"
  this.comments = "Audience of One"
  this.isVerified = false
  this.beta = false 
  this.unsubscribe = false
  this.timestamp = Date.now()
}

exports.createClient = (client) => {
  
  let db = {}
  db.getSubscriber = (email) => {
    return new Promise ((resolve, reject) => {
      client.db().collection('subscribers').findOne(email, (err, result) => {
        if (err) {
          reject({error: err})
        }
        // found email and it is a verified subscriber
        if (result && result.isVerified) {
          console.log(`-----found verified email----------------`)
          resolve(result)
          return
        }
        // found email but not verified, regen token and return
        if (result && !result.isVerified) {
          console.log(`-----found unverified email----------------`)
          let token =  Math.floor(Math.random()*90000) + 10000;
          let timestamp = Date.now() 
          let id = result._id
          result.token = token // update token on result object  
          client.db().collection('subscribers')
                     .updateOne({ "_id": ObjectID(id) }, 
                                  { $set: {
                                    token: token, 
                                    timestamp: timestamp}})
          resolve(result)
          return
        }
        // new subscriber - gen token - save document
        console.log(`-----email not found--------------`)       
        //let newSub = new subscriberTemplate
        let newsubscriber = new subscriberTemplate()
        newsubscriber.email = email.email
        newsubscriber.timestamp = Date.now()
        // generate a 5 digit random number
        newsubscriber.token =  Math.floor(Math.random()*90000) + 10000;  
        client.db().collection('subscribers').insertOne(newsubscriber)
        resolve(newsubscriber)
      })
    })    
  }
  // verify receives a subscriber object where verified has been set to true
  // and replaces in mongodb
  db.verifySubscriber = (subscriber) => {
    let email = subscriber.email
    return new Promise(async (resolve, reject) => {
      try {
        let id = subscriber._id
        let result = await client.db().collection('subscribers')
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
  
  db.getBeta = (obj) => {
    return new Promise ((resolve, reject) => {
      let email = obj.email
      let name = obj.name
      let company = obj.coname
      let sector = obj.sector
      let website = obj.website 
      let comments = obj.comments      
      client.db().collection('subscribers').findOne({email: email}, (err, result) => {
        if (err) {
          console.log(`-----ERROR IN DB READ`)
          console.log(err)
          reject({error: err})
        }
        // found email and it is a verified subscriber
        if (result && result.isVerified) {
          console.log(`-----BETA - found verified email-update and save doc---`)
          let timestamp = Date.now() 
          let id = result._id
          client.db().collection('subscribers')
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
        // found email but not verified, regen token and return
        if (result && !result.isVerified) {
          console.log(`-----BETA - found unverified email----------------`)
          let token =  Math.floor(Math.random()*90000) + 10000;
          let timestamp = Date.now() 
          let id = result._id
          result.token = token // update token on result object 
          client.db().collection('subscribers')
                     .updateOne({ "_id": ObjectID(id) }, 
                                { $set: {
                                  token: token, 
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
        // new subscriber - gen token - save document
        console.log(`-----BETA - email not found--------------`)
        //let newSub = new subscriberTemplate
        let newsubscriber = new subscriberTemplate()       
        newsubscriber.email = email        
        newsubscriber.name = name
        newsubscriber.beta = true
        newsubscriber.company = company 
        newsubscriber.sector = sector
        newsubscriber.url = website 
        newsubscriber.comments = comments
        newsubscriber.timestamp = Date.now()
        // generate a 5 digit random number
        newsubscriber.token =  Math.floor(Math.random()*90000) + 10000;        
        client.db().collection('subscribers').insertOne(newsubscriber)
        resolve(newsubscriber)
        return
      })
    })    
  }
  return db
}
