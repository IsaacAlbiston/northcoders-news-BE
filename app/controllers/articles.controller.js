const { selectArticleById, selectArticles, updateArticle } = require("../models/articles.model")

exports.getArticleById = (req,res,next)=>{
    const {article_id} = req.params
    selectArticleById(article_id)
    .then(article=>{
        res.status(200).send({article})
    })
    .catch(next)
}

exports.getArticles = (req,res,next)=>{
    const {sort_by,order} = req.query
    selectArticles({sort_by,order})
    .then(articles=>{
        res.status(200).send({articles})
    })
    .catch(next)
}

exports.patchArticle = (req,res,next)=>{
    if (Object.keys(req.body).length>1||!req.body.votes){
        return Promise.reject({status:400,msg:"Bad Request"})
    }
    const {article_id} = req.params
    const {votes} = req.body
    const updateCurrentArticle = updateArticle(article_id, votes)
    const checkIfArticleExists = selectArticleById(article_id)
    Promise.all([updateCurrentArticle, checkIfArticleExists])
    .then(([article])=>{
        res.status(200).send({article})
    })
    .catch(next)
}