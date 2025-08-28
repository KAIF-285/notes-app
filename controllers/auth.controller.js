const bcrypt = require("bcryptjs");
const user_model = require("../models/user.model");
const jwt = require("jsonwebtoken");
const secret = require("../configs/auth.config");
const crypto = require("crypto");

// Controller to register a user (signup)
exports.signup = async (req, res) => {
  // 1. Read the request body
  const request_body = req.body;

  // 2. Create a user object to insert into the database
  const userObj = {
    name: request_body.name,
    userId: request_body.userId,
    email: request_body.email,
    dob: request_body.dob,
    userType: request_body.userType,
    password: request_body.password ? bcrypt.hashSync(request_body.password, 8) : undefined,
    provider: request_body.provider || "password"
  };

  try {
    // Insert user into the database
    const user_created = await user_model.create(userObj);

    // 3. Prepare the response object (do not return sensitive data like password)
    const res_obj = {
      name: user_created.name,
      userId: user_created.userId,
      email: user_created.email,
      dob: user_created.dob,
      userType: user_created.userType,
      createdAt: user_created.createdAt,
      updatedAt: user_created.updatedAt,
    };

    // 4. Send the response with status 201 (Created)
    return res.status(201).send(res_obj);
  } catch (err) {
    console.error("Error while registering the user:", err);
    
    // Return an error response with status 500 (Internal Server Error)
    return res.status(500).send({
      message: "Some error happened while registering the user",
    });
  }
};

// Controller to sign in a user (signin)
exports.signin = async (req, res) => {
  try {
    // 1. Check if user ID exists in the system
    const user = await user_model.findOne({ userId: req.body.userId });
    
    // If user is not found, return 400 (Bad Request)
    if (!user) {
      return res.status(400).send({ message: "User ID is not valid" });
    }

    // 2. Check if the provided password is correct
    const isPasswordValid = user.password && bcrypt.compareSync(req.body.password, user.password);
    
    // If password is invalid, return 401 (Unauthorized)
    if (!isPasswordValid) {
      return res.status(401).send({ message: "Wrong password" });
    }

    // 3. Generate JWT token with a 120-second expiration time
    const token = jwt.sign({ id: user.userId }, secret.secret, { expiresIn: 120 });

    // 4. Send the response with the user's information and JWT token
    return res.status(200).send({
      name: user.name,
      userId: user.userId,
      email: user.email,
      dob: user.dob,
      userType: user.userType,
      accessToken: token,
    });
  } catch (err) {
    console.error("Error during sign-in:", err);

    // Return an error response with status 500 (Internal Server Error)
    return res.status(500).send({ message: "An error occurred during sign-in" });
  }
};

// Request OTP for email signup/login
exports.requestOtp = async (req,res)=>{
  try{
    const email = req.body.email
    if(!email){
      return res.status(400).send({message:"email is required"})
    }
    const code = (""+Math.floor(100000+Math.random()*900000))
    const expiresAt = new Date(Date.now()+ 5*60*1000)
    let user = await user_model.findOne({email})
    if(!user){
      user = await user_model.create({
        name: req.body.name || email.split("@")[0],
        userId: (req.body.userId || crypto.randomUUID()),
        email,
        dob: req.body.dob,
        userType: "CUSTOMER",
        provider:"otp",
        isVerified:false,
        otpCode: code,
        otpExpiresAt: expiresAt
      })
    }else{
      user.provider = "otp"
      user.otpCode = code
      user.otpExpiresAt = expiresAt
      await user.save()
    }
    // For assignment: return OTP in response; in production, send via email/SMS.
    return res.status(200).send({message:"OTP generated", otp: code, expiresAt})
  }catch(err){
    console.error("Error generating OTP:",err)
    return res.status(500).send({message:"Failed to generate OTP"})
  }
}

// Verify OTP and issue JWT
exports.verifyOtp = async (req,res)=>{
  try{
    const { email, otp } = req.body
    if(!email || !otp){
      return res.status(400).send({message:"email and otp are required"})
    }
    const user = await user_model.findOne({email})
    if(!user || user.provider!=="otp" || !user.otpCode){
      return res.status(400).send({message:"Invalid request"})
    }
    if(user.otpCode !== otp){
      return res.status(401).send({message:"Invalid OTP"})
    }
    if(!user.otpExpiresAt || user.otpExpiresAt < new Date()){
      return res.status(410).send({message:"OTP expired"})
    }
    user.isVerified = true
    user.otpCode = undefined
    user.otpExpiresAt = undefined
    await user.save()
    const token = jwt.sign({ id: user.userId }, secret.secret, { expiresIn: 3600 })
    return res.status(200).send({
      name: user.name,
      userId: user.userId,
      email: user.email,
      dob: user.dob,
      userType: user.userType,
      accessToken: token
    })
  }catch(err){
    console.error("Error verifying OTP:",err)
    return res.status(500).send({message:"Failed to verify OTP"})
  }
}

// Google login/signup using ID token
exports.googleLogin = async (req,res)=>{
  try{
    const { idToken, name } = req.body
    if(!idToken){
      return res.status(400).send({message:"idToken is required"})
    }
    // Lightweight verification approach: decode header/payload and accept email from frontend
    // In production, verify with Google or use google-auth-library.
    const parts = idToken.split('.')
    if(parts.length!==3){
      return res.status(400).send({message:"Invalid token"})
    }
    const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf8'))
    const email = payload.email
    const sub = payload.sub
    if(!email || !sub){
      return res.status(400).send({message:"Token missing email/sub"})
    }
    let user = await user_model.findOne({ email })
    if(!user){
      user = await user_model.create({
        name: name || payload.name || email.split("@")[0],
        userId: payload.email || sub,
        email,
        dob: req.body.dob,
        userType: "CUSTOMER",
        provider: "google",
        googleId: sub,
        isVerified: true
      })
    }else{
      user.provider = "google"
      user.googleId = sub
      user.isVerified = true
      await user.save()
    }
    const token = jwt.sign({ id: user.userId }, secret.secret, { expiresIn: 3600 })
    return res.status(200).send({
      name: user.name,
      userId: user.userId,
      email: user.email,
      userType: user.userType,
      accessToken: token
    })
  }catch(err){
    console.error("Error with Google login:",err)
    return res.status(500).send({message:"Failed Google login"})
  }
}
