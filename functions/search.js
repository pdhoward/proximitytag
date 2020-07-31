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

  if (!response.isVerified) {
    const mailObject = {
      from: '"Strategic Machines 👥" <strategicmachines@gmail.com>',
      subject: 'PROXIMITY VERIFICATION CODE',
      text: '',
      html: '<strong></strong>'
    }
    mailObject.to = response.email
    mailObject.text = `Your verification code is ${response.token}. If you did not apply for early access to the Proximity beta program, please ignore this email.`
    mailObject.html= `<strong>Your verification code is ${response.token}. If you did not apply for early access to the Proximity beta program, please ignore this email.<strong>`
    // mail the response
    const result = await beta(mailObject)
     
    return {
        headers: {
          'Content-Type': 'application/json'        
        },
        statusCode: 200,
        body: JSON.stringify(response)
      }    
     
    } else {
      return {
          headers: {
            'Content-Type': 'application/json'        
          },
          statusCode: 200,
          body: JSON.stringify(response)
        } 
    }
}
