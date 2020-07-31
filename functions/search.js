require('dotenv').config()

/////////////////////////////////////////////////
///       Handle Venue Geospatial Search      //
//      copyright 2020 Strategic Machines    //
//////////////////////////////////////////////

const {createClient} =      require('./db/client')
const {createConnection} =  require('./db/connection')
const {isConnected} =       require('./db/isConnected')

let conn

// https://docs.mongodb.com/v3.6/geospatial-queries/

exports.handler = async function(event, context) {
  let client 
  if (isConnected(conn)) {    
    client = await createClient(conn)
  } else {    
    conn = await createConnection()
    client = await createClient(conn)
  }   
  let location = JSON.parse(event.body)      
  
  console.log(`----FUNCTION FIND VENUES -------`)   
  const response = await client.getVenues(location)    
  console.log(response)

  
     
    return {
        headers: {
          'Content-Type': 'application/json'        
        },
        statusCode: 200,
        body: JSON.stringify(response)
      }    
     
  
}
