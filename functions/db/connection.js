require('dotenv').config()
const {MongoClient} = require('mongodb')

// Initialize connection to database
const url = process.env.ATLAS_SUBSCRIBERS || "mongodb://localhost/auth"
const options = {
        useNewUrlParser: true,       
        useUnifiedTopology: true }

exports.createConnection = async () => {
  console.log('---debug connections-----')
  console.log(url)
  const client = new MongoClient(url, options)
  await client.connect()
  return client
}