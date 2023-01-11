const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  name: String, 
  email: String,
  password: String,
  mobileno: String,
  qrc: String
});

module.exports = mongoose.model("userDet", userSchema);