const express = require("express");
require("dotenv").config();
const cookieParser = require("cookie-parser")
const {connection} = require("./db/db")
const {userRoute} = require("./route/user.route")
const {weatherRoute} = require("./route/weather.route");
const { auth } = require("./middleware/auth");
const app = express();


app.use(express.json());
app.use(cookieParser())

app.use("/weather",weatherRoute)
app.use(auth)
app.use("/user",userRoute)

app.listen(process.env.PORT || 3000,async()=>{
    console.log(`Server is running on port ${process.env.PORT}`)
    try {
        await connection
        console.log("Connected to Database")
    } catch (err) {
        console.log("Cannot connected to DB")
    }
})