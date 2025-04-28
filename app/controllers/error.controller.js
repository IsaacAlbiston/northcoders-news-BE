exports.handleSQLErr = (err,req,res,next)=>{
    if (err.code === "22P02"){
        res.status(400).send({msg:"Bad Request"})
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