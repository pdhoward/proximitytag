require('dotenv').config()

/////////////////////////////////////////////////
///   Handle Beta and Newsletter subscribers  //
//      copyright 2020 Strategic Machines    //
//////////////////////////////////////////////

// logic for processing a new subscriber
const {createConnection} =  require('./db/connection')
const {createClient} =      require('./db/client')
const {isConnected} =       require('./db/isConnected')
const sgMail =              require('./email')

let conn

const beta = (mailObject) => {
  return new Promise((resolve, reject) => {
    sgMail.send(mailObject)
    .then(([result, body]) => { 
      resolve({statusCode: 200})
    })
    .catch(error => reject(error))
  })
}

exports.handler = async function(event, context) {
  let client 
  if (isConnected(conn)) {
    console.log(`-------------using connection`)
    client = await createClient(conn)
  } else {
    console.log(`------------creating connection`)
    conn = await createConnection()
    client = await createClient(conn)
  }   
  let subscriber = JSON.parse(event.body)      
  
  console.log(`----FUNCTION BETA SUBSCRIBER -------`)   
  const response = await client.getBeta(subscriber)    
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
