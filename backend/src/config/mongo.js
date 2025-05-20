const mongoose = require('mongoose');

const connectMongo = async() => {
  try {
    await mongoose.connect("mongodb://localhost:27017/collabs");
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1); // Exit the process with failure
  }
}

module.exports = connectMongo;