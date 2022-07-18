require('dotenv').config()

const connectDB = require('./db/connect')
const Product = require('./models/product')

const jsonProducts = require('./products.json')

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI)
        await Product.deleteMany() //delete all the products there first (optional)
        await Product.create(jsonProducts)
        console.log('success')
        process.exit(0) //we don't need this file to run continuously so we can terminate this process
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}

start()