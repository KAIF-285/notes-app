//this will be starting file of the project

const express=require("express")
const mongoose=require("mongoose")
const app=express()
const bcrypt=require("bcryptjs")
const server_config=require("./configs/server.config")//this is done to generalise port number so that in 1 file we can make changes
//so if trrw i want tto change port no. then that can be done at place
const db_config=require("./configs/db.config")
const user_model=require("./models/user.model")
const cors = require('cors');
app.use(cors())
app.use(express.json())//middleware:whenever you get json you need to convert to js
//create an admin user if not already present

//connection with mongodb
mongoose.connect(db_config.DB_URL)

const db=mongoose.connection

db.on("error",()=>{ 
console.log("error connection to db")})

db.once("open",()=>{
    console.log("connected to mongodb")
    init()//create admin if not present

})

async function init(){

    try{
        let user=await user_model.findOne({userId:"admin"})
        if(user){
            console.log("admin is already present")
            return
        }
    }
    catch(err){
        console.log("error while reading data",err)
    }

   

    try{
       user=await user_model.create({
        name : "Kaif",
        userId : "admin",
        email : "kaif882@gmail.com",
        userType:"ADMIN",
        password:bcrypt.hashSync("Welcome1",8)
       })

       console.log("admin created",user)
    }

    catch(err){
        console.log("error while creating admin",err)

    }
}


//stitch the route to the server

require("./routes/auth.routes")(app)//calling routes and passing app object
require("./routes/category.routes")(app)
require("./routes/notes.routes")(app)
//start server

app.listen(server_config.PORT,()=>{
    console.log("server started at port no:",server_config.PORT)}
)




//start db:
//brew services start mongodb-community