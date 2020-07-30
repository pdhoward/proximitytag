require('dotenv').config()

/////////////////////////////////////////////////
///   Handle Beta and Newsletter subscribers  //
//      copyright 2020 Strategic Machines    //
//////////////////////////////////////////////

import fetch from 'node-fetch'
const { EMAIL_TOKEN } = process.env

exports.handler = async (event, context, cb) => {  
  console.log(`------------------inside of netlify function --------`)
  console.log(event)    
  let subscriber = JSON.parse(event.body)
  console.log(subscriber) 
  console.log(`New Subscriber: ${subscriber.email}`)
  console.log(`-------------check out fetch ---------`)
  console.log(typeof fetch)
  let test = {
    "email": "william.brown@gmail.com"
  }
  try {
    let response = await fetch('https://api.buttondown.email/v1/subscribers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${EMAIL_TOKEN}`        
        },
      body: JSON.stringify(subscriber)
      })
    console.log(`------inside netlify function -- finished fetch`)  
    let data = await response.json()
    
    console.log(data)
    return {
      headers: {
        'Content-Type': 'application/json'        
      },
      statusCode: 201,
      body: JSON.stringify(data),
    }   
  } catch(err) {
    console.log(`FUNCTION ERROR`)
    return {
      headers: {
        'Content-Type': 'application/json'        
      },
      statusCode: 400,
      body: JSON.stringify(err)
    } 
  }
}
