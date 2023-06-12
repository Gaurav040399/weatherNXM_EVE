const express = require("express");
const weatherRoute = express.Router()
const axios = require("axios");
const { error } = require("winston");
const {validation} = require("../middleware/validation")
const {WeatherModel} = require("../model/weather.model")

weatherRoute.get("/",validation,async(req,res)=>{
    try {
         const {cityName} = req.query
        axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=170fb9bebd9d6ece3443b33fa4ff4407`)
        .then( async res => {
            console.log(JSON.parse(res))
            console.log("cityName:" + res.sys.name)
            const weatherdata = new WeatherModel(res)
            await weatherdata.save()
            res.status(200).send({weatherdata: weatherdata , CityName : res.sys.name})
        })
        .catch(error =>{
            console.log(error.message)
        })
    } catch (error) {
        winstonLogger.error(error.message)
        res.status(400).send({msg:error.message})
    }
})

module.exports = {weatherRoute}