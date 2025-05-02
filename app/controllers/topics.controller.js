const { selectTopics, insertTopic } = require("../models/topics.model")

exports.getTopics = (req,res,next)=>{
    selectTopics()
    .then(topics=>{
        res.status(200).send({topics})
    })
    .catch(next)
}

exports.postTopic = (req,res,next)=>{
    const validInputArr = ["slug","description","img_url"]
    let invalidInputFlag = false
    Object.keys(req.body).forEach((key)=>{
        if (!validInputArr.includes(key)) invalidInputFlag = true
    })
    if (invalidInputFlag) return Promise.reject({status:400,msg:"Bad Request"})
    const {slug,description,img_url} = req.body
    insertTopic({slug,description,img_url})
    .then(topic=>{
        res.status(201).send({topic})
    })
    .catch(next)
}