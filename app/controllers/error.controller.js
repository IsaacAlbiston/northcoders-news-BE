exports.handleSQLErr = (err,req,res,next)=>{
    const badRequestCodeArr = ["23505", "22P02", "23502"]
    if (badRequestCodeArr.includes(err.code)){
        res.status(400).send({msg:"Bad Request"})
    }else if (err.code === "23503"){
        res.status(404).send({msg:"Foreign Key Not Found"})
    } else next(err)
}

exports.handleCustomErr = (err,req,res,next)=>{
    if (err.msg && err.status) res.status(err.status).send({msg:err.msg})
    else next(err)
}

exports.handleInternalServerErr = (err,req,res,next)=>{
    console.log(err)
    res.status(500).send({msg:"Internal Server Error"})
}