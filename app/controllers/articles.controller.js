const { selectArticleById, selectArticles, updateArticle } = require("../models/articles.model")
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
    const promiseArr = []
    const {sort_by,order,topic} = req.query
    promiseArr.push(selectArticles({sort_by,order,topic}))
    //console.log(req.query)
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
        res.status(200).send({articles:results[0]})
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