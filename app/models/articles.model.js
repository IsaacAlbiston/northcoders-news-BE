const db = require("../../db/connection")

exports.selectArticleById = (articleId)=>{
    return db.query(`SELECT * FROM articles WHERE article_id = $1`, [articleId])
    .then(result=>{
        if (result.rows.length){
            return result.rows[0]
        }
        return Promise.reject({status:404,msg:"Index Not Found"})
    })
}