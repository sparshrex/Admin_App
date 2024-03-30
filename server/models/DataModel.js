const mongoose = require('mongoose');

//schema
const userSchema=new mongoose.Schema({
    email:{type:String, required:true, trim:true},
    password:{type:String, required:true, trim:true}
})

//model
const UserModel= mongoose.model("user",userSchema)

module.exports = UserModel
