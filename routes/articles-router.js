const { getArticles, getArticleById, patchArticleById } = require("../app/controllers/articles.controller")
const { getCommentsByArticleId, postCommentToArticleId } = require("../app/controllers/comments.controller")

const articlesRouter = require("express").Router()

articlesRouter.get("/", getArticles)

articlesRouter.route("/:article_id")
.get(getArticleById)
.patch(patchArticleById)

articlesRouter.route("/:article_id/comments")
.get(getCommentsByArticleId)
.post(postCommentToArticleId)

module.exports = articlesRouter