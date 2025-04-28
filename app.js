const express = require("express")
const endpointsJson = require("./endpoints.json");
const { handleInternalServerErr } = require("./app/controllers/error.controller"); 
const { getTopics } = require("./app/controllers/topics.controller");

const app = express()

app.use(express.json())

app.get("/api", (req,res)=>{
    res.status(200).send({endpoints:endpointsJson})
})

app.get("/api/topics", getTopics)

app.all('/*splat', (req,res)=>{
    res.status(404).send({msg:"Endpoint Not Found"})
})

app.use(handleInternalServerErr)

module.exports = app