const express = require("express");
const userRoute = express.Router();
const bcrypt = require("bcrypt") ;
const jwt = require("jsonwebtoken")
const {UserModel} = require("../model/user.model")
const {redis} = require("../redis/redis");
const {winstonLogger} = require("../middleware/winstion")

userRoute.post("/signup",async(req,res)=>{
    try {
         const {name , email, password} = req.body
         const isUserPresent = await UserModel.findOne({email});

         if(isUserPresent){
            return res.status(400).send({msg:"user already present , Please login"})
         }

         const hash = await bcrypt.hash(password,4)

         const newUser = new UserModel({...req.body,password:hash});
         await newUser.save();
         res.status(200).send({msg:"Signup seccessfull",user:newUser})

    } catch (error) {
        winstonLogger.error(error.message)
        res.status(400).send({msg:error.message})
    }
})
userRoute.post("/login",async(req,res)=>{
    try {
        const {email,password} = req.body
        const isUserPresent = await UserModel.findOne({email})

        if(!isUserPresent){
            return res.status(400).send({msg:"user not present , Please signup"})
        }

        const isPasswordCorrect = await bcrypt.compare(password,isUserPresent.password);

        if(!isPasswordCorrect){
            return res.status(400).send({msg:"Invalid Credential"});
        }

        const accessToken = jwt.sign({userid : isUserPresent._id},process.env.secretKey,{expiresIn:process.env.accessTokenEx})

        const refreshToken = jwt.sign({userid : isUserPresent._id},process.env.refreshsecretKey,{expiresIn:process.env.refreshTokenEx});

        await redis.set(isUserPresent._id +"_access_token",accessToken,"EX", 60 * 1)
        await redis.set(isUserPresent._id +"_refresh_token",refreshToken,"EX", 60 * 3)

        res.cookie("accessToken" , isUserPresent._id + "_access_token")
        res.cookie("refreshToken" , isUserPresent._id + "_refresh_token")
        res.status(200).send({msg:"login seccessfull"});
    } catch (error) {

        winstonLogger.error(error.message)
        res.status(400).send({msg:error.message})
    }
})


userRoute.get("/logout",async(req,res)=>{
    try {
        const accessToken = req?.cookies?.accessToken
        const refreshToken = req?.cookies?.refreshToken

        const accT = await redis.get(accessToken)
        const refT = await redis.get(refreshToken)

        await redis.set(accessToken, accT, "EX" ,60^10)
        await redis.set(refreshToken, refT, "EX" ,60^10)

        await redis.del(accessToken)
        await redis.del(refreshTokenToken)
        
    } catch (error) {
        winstonLogger.error(error.message)
        res.status(400).send({msg:error.message})
    }
})


userRoute.get("/refreshToken",async(req,res)=>{
    try {
        const tokenKey = req?.cookies?.refreshToken
        const refreshToken = await redis.get(tokenKey);
        if(!refreshToken){
            return res.status(400).send({msg:"Unauthorise"})
        }

        const isTokenValid =  await jwt.verify(refreshToken,process.env.refreshsecretKey)

        if(!isTokenValid){
            return res.status(400).send({sg:"unauthorise"})
        }

        const accessToken = jwt.sign({userid : isTokenValid.userid}, process.env.secretKey, {expiresIn: process.env.refreshsecretKey})

        await redis.set(isTokenValid.userid +"_access_token",accessToken,"EX", 60 * 1)
        res.cookie("accessToken" , isTokenValid.userid + "_access_token")

        res.status(200).send({msg:"Token generated"})
    } catch (error) {
        winstonLogger.error(error.message)
        res.status(400).send({msg:error.message})
    }
})


module.exports ={
    userRoute
}