const express = require("express")
const endpointsJson = require("./endpoints.json");
const { handleInternalServerErr, handleCustomErr, handleSQLErr } = require("./app/controllers/error.controller"); 
const { getTopics } = require("./app/controllers/topics.controller");
const { getArticleById, getArticles, patchArticle } = require("./app/controllers/articles.controller");
const { getCommentsByArticleId, postCommentToArticleId, deleteCommentById } = require("./app/controllers/comments.controller");
const { getUsers } = require("./app/controllers/users.controller");

const app = express()

app.use(express.json())

app.get("/api", (req,res)=>{
    res.status(200).send({endpoints:endpointsJson})
})

app.get("/api/topics", getTopics)

app.get("/api/articles", getArticles)

app.get("/api/articles/:article_id", getArticleById)

app.get("/api/articles/:article_id/comments", getCommentsByArticleId)

app.post("/api/articles/:article_id/comments", postCommentToArticleId)

app.patch("/api/articles/:article_id", patchArticle)

app.delete("/api/comments/:comment_id", deleteCommentById)

app.get("/api/users", getUsers)

app.all('/*splat', (req,res)=>{
    res.status(404).send({msg:"Endpoint Not Found"})
})

app.use(handleSQLErr)

app.use(handleCustomErr)

app.use(handleInternalServerErr)

module.exports = app