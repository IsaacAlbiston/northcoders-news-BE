const { getArticles, getArticleById, patchArticleById, postArticle, deleteArticleById } = require("../app/controllers/articles.controller")
const { getCommentsByArticleId, postCommentToArticleId } = require("../app/controllers/comments.controller")

const articlesRouter = require("express").Router()

articlesRouter.route("/")
.get(getArticles)
.post(postArticle)

articlesRouter.route("/:article_id")
.get(getArticleById)
.patch(patchArticleById)
.delete(deleteArticleById)

articlesRouter.route("/:article_id/comments")
.get(getCommentsByArticleId)
.post(postCommentToArticleId)

module.exports = articlesRouter