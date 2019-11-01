const mongoose = require("mongoose");
const config = require("config");
const db = config.get("mongoURI");

//To connect to mongoDB use:
//mongoose.connect(db)
//or
//async/await
const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false
    });
    console.log("MongoDB Connected...");
  } catch (err) {
    console.error(err.message);
    //Exit process with failure
    process.exit(1);
  }
};
//Adding com
module.exports = connectDB;
