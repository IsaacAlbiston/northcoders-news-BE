const { selectArticleById, selectArticles, updateArticleById, insertArticle } = require("../models/articles.model")
const { selectTopics } = require("../models/topics.model")

exports.getArticleById = (req,res,next)=>{
    const {article_id} = req.params
    selectArticleById(article_id)
    .then(article=>{
        res.status(200).send({article})
    })
    .catch(next)
}

exports.getArticles = (req,res,next)=>{
    const {sort_by,order,topic} = req.query
    let {limit,p} = req.query
    if(!limit) limit = 10
    if(!p) p = 1
    if(limit<=0||p<=0) return Promise.reject({status:400,msg:"Bad Request"}) 
    const promiseArr = []
    promiseArr.push(selectArticles({sort_by,order,topic,limit,p}))
    if (topic){
        promiseArr.push(selectTopics())
    }
    Promise.all(promiseArr)
    .then((results)=>{
        if (topic){
            let rejectFlag = true
            results[1].forEach(topicObj=>{
                if (topicObj.slug===topic){
                    rejectFlag = false
                }
            })
            if (rejectFlag){
                return Promise.reject({status:400,msg:"Bad Request"})
            }
        }
        res.status(200).send(results[0])
    })
    .catch(next)
}

exports.patchArticleById = (req,res,next)=>{
    if (Object.keys(req.body).length>1||!req.body.inc_votes){
        return Promise.reject({status:400,msg:"Bad Request"})
    }
    const {article_id} = req.params
    const {inc_votes} = req.body
    const updateCurrentArticle = updateArticleById(article_id, inc_votes)
    const checkIfArticleExists = selectArticleById(article_id)
    Promise.all([updateCurrentArticle, checkIfArticleExists])
    .then(([article])=>{
        res.status(200).send({article})
    })
    .catch(next)
}

exports.postArticle = (req,res,next)=>{
    const validInputArr = ["author","title","body","topic","article_img_url"]
    let invalidInputFlag = false
    Object.keys(req.body).forEach((key)=>{
        if (!validInputArr.includes(key)){
            invalidInputFlag = true
        }
    })
    if (invalidInputFlag) return Promise.reject({status:400,msg:"Bad Request"})
    const newArticle = req.body
    insertArticle(newArticle)
    .then(article=>{
        selectArticleById(article.article_id)
        .then(article=>{
            res.status(201).send({article})
        })
    })
    .catch(next)
}