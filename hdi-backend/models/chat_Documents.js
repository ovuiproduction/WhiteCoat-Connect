const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema(
    {
        sender:{
            type:String,
            required:true
        },
        receiver:{
            type:String,
            required:true
        },
        msgContainer:{
            type:Array
        }
    }
);

module.exports = mongoose.model('chatcoll',chatSchema);