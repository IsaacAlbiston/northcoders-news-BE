const db = require("../../db/connection")

exports.deleteFromCommentsById = (commentId)=>{
    return db.query(`DELETE FROM comments
        WHERE comment_id = $1 RETURNING *`, [commentId])
    .then(result=>{
        if (result.rows.length){
            return result.rows
        }
        return Promise.reject({status:404,msg:"Id Not Found"})
    })
}

exports.selectCommentsByArticleId = (articleId)=>{
    return db.query(`SELECT * FROM comments 
        WHERE article_id = $1
        ORDER BY created_at DESC`, [articleId])
    .then(result=>{
        return result.rows
    })
}

exports.insertCommentToArticleId = (articleId, comment)=>{
    if (Object.keys(comment).length>2){
        return Promise.reject({status:400,msg:"Bad Request"})
    }
    return db.query(`INSERT INTO comments (article_id, body, votes, author)
        VALUES ($1, $2, 0, $3)
        RETURNING *`, [articleId,comment.body,comment.username])
    .then(result=>{
        return result.rows[0]
    })
}