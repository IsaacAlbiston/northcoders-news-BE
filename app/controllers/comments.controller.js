const { selectArticleById } = require("../models/articles.model")
const { selectCommentsByArticleId, insertCommentToArticleId, deleteFromCommentsById, updateCommentById } = require("../models/comments.model")

exports.deleteCommentById = (req,res,next)=>{
    const {comment_id} = req.params
    deleteFromCommentsById(comment_id)
    .then(()=>{
        res.status(204).send()
    })
    .catch(next)
}

exports.getCommentsByArticleId = (req,res,next)=>{
    const {article_id} = req.params
    let {limit, p} = req.query
    if (!limit) limit = 10
    if (!p) p = 1
    if (limit<=0||p<=0) return Promise.reject({status:400,msg:"Bad Request"})
    const selectComments = selectCommentsByArticleId(article_id,limit, p)
    const checkIfArticleExists = selectArticleById(article_id)
    Promise.all([selectComments, checkIfArticleExists])
    .then(([commentsResultObj])=>{
        res.status(200).send(commentsResultObj)
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

exports.patchCommentById = (req,res,next)=>{
    if (Object.keys(req.body).length>1||!req.body.inc_votes){
        return Promise.reject({status:400,msg:"Bad Request"})
    }
    const {comment_id} = req.params
    const {inc_votes} = req.body
    updateCommentById(comment_id,inc_votes)
    .then(comment=>{
        res.status(200).send({comment})
    })
    .catch(next)
}