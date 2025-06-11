const mongoose = require('mongoose');
require('dotenv').config({ path: '../.env' }); 

const connectDB = async () => {
  try {
    // console.log('MONGO_URI:', process.env.MONGO_URI); // Pour débogage
    if (!process.env.MONGO_URI) {
        throw new Error('MONGO_URI is not defined in your .env file');
    }
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;