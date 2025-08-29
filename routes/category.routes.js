

//POST localhost:8080/notes/api/v1/categories
category_controller=require("../controllers/category.controller")
//auth_mw=require("../middlewares/auth.mw")
module.exports=(app)=>{
    app.post("/notes/api/v1/categories",category_controller.createNewCategory)
}