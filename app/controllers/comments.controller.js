const { selectArticleById } = require("../models/articles.model")
const { selectCommentsByArticleId } = require("../models/comments.model")

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