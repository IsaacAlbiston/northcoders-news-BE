const db = require("../../db/connection")

exports.selectTopics = ()=>{
    return db.query(`SELECT * FROM topics`)
    .then(result=>{
        return result.rows
    })
}

exports.insertTopic = (newTopic)=>{
    const queryArgs = [newTopic.slug,newTopic.description]
    let queryStr = `INSERT INTO topics (slug, description`
    if (newTopic.img_url){
        queryArgs.push(newTopic.img_url)
        queryStr += `, img_url) VALUES ($1,$2,$3) RETURNING *`
    } else {
        queryStr += `) VALUES ($1,$2) RETURNING *`
    }
    return db.query(queryStr, queryArgs)
    .then(result=>{
        return result.rows[0]
    })
}