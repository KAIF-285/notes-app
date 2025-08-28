const mongoose=require("mongoose");

//create category schema

const categorySchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true
    },
    description:{
        type:String,
        required:true
    }
},{timestamps:true,versionKey:false})

module.exports=mongoose.model("Category",categorySchema)


