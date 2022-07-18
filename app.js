
const http = require('http')
require('dotenv').config()
// async errors: package to help with async warpper instead of building our own async wrapper like in previous app, with this package instead of using next(), we simply need to throw the error.
require('express-async-errors')

const express = require('express');
const app = express();
const connectDB = require('./db/connect')
const products = require('./routes/products')

const notFoundMiddleware = require('./middleware/not-found')
const errorMiddleware = require('./middleware/error-handler')

//middleware
app.use(express.json())

//routes

app.get('/',(req,res)=>{
  return res.status(200).json({
    message: 'furniture store API',
  })
})

app.use('/api/v1/products', products)

//products route

app.use(notFoundMiddleware)
app.use(errorMiddleware)

let port = process.env.PORT || 5000
const server = http.createServer(app)
const start = async () =>{
  try {
    //connect DB
    await connectDB(process.env.MONGO_URI)
    server.listen(port,'0.0.0.0', console.log(`server is listening on port ${port}...`))
  } catch (error) {
    
  }  
}

start()