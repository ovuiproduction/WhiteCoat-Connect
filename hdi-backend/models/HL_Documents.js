const mongoose = require('mongoose');

const HL_Schema = new mongoose.Schema(
    {
        name:{
            type:String,
            required:true
        },
        email:{
            type:String,
            required:true,
            unique:true
        },
        password:{
            type:String,
            required:true,
            unique:true,
            minLength:[3,"length is not enough"]
        },
        servicesArray:{
            type:Array
        }
    }
    
);

module.exports = mongoose.model('HLD',HL_Schema);