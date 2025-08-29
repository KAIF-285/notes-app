const category_model=require("../models/category.model")


//controller for creating the category

 // POST localhost:8080/notes/api/v1/categories

 exports.createNewCategory=async (req,res)=>{
    //read the req body

    //create the category object
     const cat_data={
        name:req.body.name,
        description:req.body.description
     }
    try{
        //insert into mongodb
     const category=await category_model.create(cat_data)//reason for try catch:when insering into db there can be problems like low speed in db etc...
     return res.status(201).send(category)
    }catch(err){
       console.log("Error while creating the category",err)
       return res.status(500).send({
        message:"Error while creating the category"
       })
    }
    //return the response of the created category


 }
