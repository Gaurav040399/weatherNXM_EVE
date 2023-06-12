const validation = async (req,res,next)=>{
    const regExp = /^[A-Z][a-z]+$/

   const  {cityName} = req.query
    const check = regExp.test(cityName)

    if(check ){
        next()
    }else{
        res.status(400).send({msg:"provide correct format"})
    }

}

module.exports = {
    validation
}