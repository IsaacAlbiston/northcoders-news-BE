const express = require("express")
const { handleInternalServerErr, handleCustomErr, handleSQLErr } = require("./app/controllers/error.controller"); 
const apiRouter = require("./routes/api-router")
const cors = require ("cors")

const app = express()

app.use(cors())

app.use(express.json())

app.use("/api", apiRouter)

app.all('/*splat', (req,res)=>{
    res.status(404).send({msg:"Endpoint Not Found"})
})

app.use(handleSQLErr)

app.use(handleCustomErr)

app.use(handleInternalServerErr)

module.exports = app