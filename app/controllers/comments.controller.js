const { selectArticleById } = require("../models/articles.model")
const { selectCommentsByArticleId, insertCommentToArticleId } = require("../models/comments.model")

exports.getCommentsByArticleId = (req,res,next)=>{
    const {article_id} = req.params
    const selectComments = selectCommentsByArticleId(article_id)
    const checkIfArticleExists = selectArticleById(article_id)
    Promise.all([selectComments, checkIfArticleExists])
    .then(([comments])=>{
        res.status(200).send({comments})
    })
    .catch(next)
}

exports.postCommentToArticleId = (req,res,next)=>{
    const {article_id} = req.params
    const {body} = req
    insertCommentToArticleId(article_id, body)
    .then(comment=>{
        res.status(200).send({comment})
    })
    .catch(next)
}