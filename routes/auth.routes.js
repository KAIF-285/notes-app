// POST localhost:8888/notes/api/v1/auth/signup

//i need to intercept this

const authController=require("../controllers/auth.controller")
const authMW=require("../middlewares/auth.mw")

module.exports=(app)=>{
    //if app intercepts a post from this uri the appropriate controller should be handed over
    app.post("/notes/api/v1/auth/signup", authController.signup)
    app.post("/notes/api/v1/auth/signin", authController.signin)
    app.post("/notes/api/v1/auth/request-otp", authController.requestOtp)
    app.post("/notes/api/v1/auth/verify-otp", authController.verifyOtp)
    app.post("/notes/api/v1/auth/google", authController.googleLogin)
}


//route for POST localhost:8888/notes/api/v1/auth/signin

