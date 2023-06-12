const red = require("redis")

const redis = red.createClient();
redis.on("connect", async()=>{
    console.log("Connected")
})

redis.off("error",(err)=>{
    console.log(err.message)
})

redis.connect();

module.exports = {
    redis
}