const { timeStamp } = require("console");
const mongoose = require("mongoose");

const express = require('express');
const app = express();

const user = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    avatar:{
        type:String,
        default:"https://cdn-icons-png.flaticon.com/128/1177/1177568.png"
    },
    role:{
        type:String,
        default:"user", 
        enum:["user","admin"]
    },
    favourites: [
        {
            type: mongoose.Types.ObjectId,
            ref:"books",
        },
    ],
    cart:[
        {
            type:mongoose.Types.ObjectId, 
            ref:"books",
        }, 
    ],
    orders:[
        {
            type:mongoose.Types.ObjectId,
            ref:"order",
        }
    ]
},
{timeStamp :true}
);
module.exports = mongoose.model("user",user);