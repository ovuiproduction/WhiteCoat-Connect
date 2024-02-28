const mongoose = require('mongoose');

const DL_Schema = new mongoose.Schema(
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
        education:{
            type:String,
            required:true
        },
        specialityArray:{
            type:Array
        }
    }
);

module.exports = mongoose.model('DLC',DL_Schema);