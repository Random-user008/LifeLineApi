const mongoose = require("mongoose");

const pdfSchema = new mongoose.Schema({
    userID : String,
    bloodType : String,
    nameFile: {
    type: String,
    required: true
    },
    phoneNo:[
      {
        type:String
      }
    ],
    files: [
      {
        name:{
          type:String,
          required:true
        },
        file:{
          type: Buffer,
          required: true
        }
      }
      ]
});

module.exports = mongoose.model('Pdf', pdfSchema);
