const express = require("express")
const endpointsJson = require("./endpoints.json");
const { handleInternalServerErr, handleCustomErr, handleSQLErr } = require("./app/controllers/error.controller"); 
const { getTopics } = require("./app/controllers/topics.controller");
const { getArticleById, getArticles } = require("./app/controllers/articles.controller");

const app = express()

app.get("/api", (req,res)=>{
    res.status(200).send({endpoints:endpointsJson})
})

app.get("/api/topics", getTopics)

app.get("/api/articles", getArticles)

app.get("/api/articles/:article_id", getArticleById)

app.all('/*splat', (req,res)=>{
    res.status(404).send({msg:"Endpoint Not Found"})
})

app.use(handleSQLErr)

app.use(handleCustomErr)

app.use(handleInternalServerErr)

module.exports = app