const db = require("../../db/connection")

exports.deleteFromCommentsById = (commentId)=>{
    return db.query(`DELETE FROM comments
        WHERE comment_id = $1 RETURNING *`, [commentId])
    .then(result=>{
        if (result.rows.length) return result.rows
        return Promise.reject({status:404,msg:"Id Not Found"})
    })
}

exports.selectCommentsByArticleId = (articleId,limit,p)=>{
    const promiseArr = []
    const offset = (p-1)*limit
    promiseArr.push(db.query(`SELECT * FROM comments 
        WHERE article_id = $1
        ORDER BY created_at DESC
        LIMIT $2
        OFFSET $3`, [articleId,limit,offset]))
    promiseArr.push(db.query(`SELECT CAST(COUNT(comment_id) AS int) AS total_count 
        FROM comments WHERE article_id = $1`, [articleId]))

    return Promise.all(promiseArr)
    .then(result=>{
        return {
            comments: result[0].rows,
            total_count: result[1].rows[0].total_count
        }
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

exports.updateCommentById = (commentId, newVotes)=>{
    return db.query(`UPDATE comments
        SET votes = votes + $1
        WHERE comment_id = $2
        RETURNING *`, [newVotes,commentId])
    .then(result=>{
        if (result.rows.length) return result.rows[0]
        return Promise.reject({status:404,msg:"Id Not Found"})
    })
}