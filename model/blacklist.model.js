const mongoose = require("mongoose");

const blacklistSchema = mongoose.Schema({
    token : {require: true, type:String}
})

const Blacklist = mongoose.model("blacklist",blacklistSchema)

module.exports = {
    Blacklist
}