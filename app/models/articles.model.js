const db = require("../../db/connection")

exports.selectArticleById = (articleId)=>{
    return db.query(`SELECT * FROM articles WHERE article_id = $1`, [articleId])
    .then(result=>{
        console.log(result.rows[0])
        return result.rows[0]
    })
}