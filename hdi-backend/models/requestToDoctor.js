const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema(
    {
       sender:{
        type:String,
        required:true
       },
       receiver:{
        type:String,
        required:true
       },
       dateOfAppeal:{
        type:Date
       },
       expireDate:{
        type:Date
       },
       location:{
        type:String
       },
       status:{
        default:"Pending",
        required:true,
        type:String
       },
       salary:{
        type:String,
        required:true
       }
    }
);

module.exports = mongoose.model('requestColl',requestSchema);