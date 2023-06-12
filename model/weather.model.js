const mongoose = require("mongoose");

const weatherSchema = mongoose.Schema({
    data : {type : String , require:true}
})

const WeatherModel = mongoose.Schema("weather", weatherSchema)

module.exports = {
    WeatherModel
}