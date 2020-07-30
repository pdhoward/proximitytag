'use strict';
require('dotenv').config();

///////////////////////////////////////////////////////////////
////////     prototype content-driven interactions     ///////
//////            netlify function testing            ///////
////// c strategic machines 2018 all rights reserved ///////
///////////////////////////////////////////////////////////

const express =               require('express');
const http =                  require('http')
const path =                  require('path');
const cors =                  require('cors')

// Express app
const app = express();

let server = http.Server(app);

//////////////////////////////////////////////////////////////////////////
////////////////////  Register Middleware       /////////////////////////
////////////////////////////////////////////////////////////////////////

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.resolve(__dirname, '../')));
app.use(cors())

const isDev = (app.get('env') === 'development');
console.log('isDev: ' + isDev);

 //////////////////////////////////////////////////////
 ////////// Register and Config Routes ///////////////
 ////////////////////////////////////////////////////
const proxy =              express.Router({mergeParams: true})

require('./proxy')(proxy)

//////////////////////////////////////////////////////////////////////////
///////////////////////////// API CATALOGUE /////////////////////////////
////////////////////////////////////////////////////////////////////////

app.get('/', (req, res)=>{
  let htmlFile = path.resolve(__dirname, '../index.html')
  res.sendFile(htmlFile)
})

app.use('*', (req, res, next) => {
  console.log(`----------------in the server -----------`)
  console.log(req.body)
  console.log(req.originalUrl)  
 next()
})
app.use('*', [proxy])

// start server
const port = process.env.VCAP_APP_PORT || process.env.localport

server.listen(port, () => {
    console.log(`listening on port ${port}`) 
  })

