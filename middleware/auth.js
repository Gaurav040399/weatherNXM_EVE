const {winstonLogger} = require("../middleware/winstion")
const jwt =  require("jsonwebtoken")
const {redis } = require("../redis/redis")


const auth = async (req,res,next)=>{
    try {
        const tokenKey = req?.cookies?.accessToken
        const  accessToken = await redis.get(tokenKey)
        const isTokenValid = await jwt.verify(accessToken,process.env.secretKey)

        if(!isTokenValid){
            return res.status(400).send({msg:"JWT expired"})
        }

        req.payload = isTokenValid
        next()
    } catch (error) {
        winstonLogger.error(error.message);
        res.status(400).send({msg:"Authentication error",error: error.message})
    }
}

module.exports = {
    auth
}