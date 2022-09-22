const mongoose = require("mongoose");
const mongo_uri = process.env.MONGODB_URI;
const connectDB = async () => {
  try {
    await mongoose.connect(mongo_uri);

    console.log("MongoDB connected");
  } catch (error) {
    throw error;
  }
};

module.exports = {
  connectDB,
};
