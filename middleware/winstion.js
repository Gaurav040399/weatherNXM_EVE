const { Collection } = require("mongoose");
const winston = require("winston");

const {MongoDB} = require("winston-mongodb")


const winstonLogger = winston.createLogger({
    transports:[
        new winston.transports.Console(),
        new winston.transports.MongoDB({
            db : process.env.mongoURL,
            options : {useUnifedTopology : true},
            collection : "errors",
            level : "error"
        })
    ]
})

module.exports = {
    winstonLogger
}