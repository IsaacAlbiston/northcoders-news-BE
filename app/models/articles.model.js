const db = require("../../db/connection")

exports.selectArticleById = (articleId)=>{
    return db.query(`SELECT * FROM articles WHERE article_id = $1`, [articleId])
    .then(result=>{
        if (result.rows.length){
            return result.rows[0]
        }
        return Promise.reject({status:404,msg:"Id Not Found"})
    })
}

exports.selectArticles = ()=>{
    return db.query(`SELECT articles.article_id, articles.author, articles.title, articles.topic, articles.created_at, articles.votes, articles.article_img_url, 
        CAST(COUNT(comments.article_id) AS INT) AS comment_count 
        FROM articles
        LEFT OUTER JOIN comments ON articles.article_id = comments.article_id
        GROUP BY articles.article_id
        ORDER BY created_at DESC`)
    .then(result=>{
        return result.rows
    })
}

exports.updateArticle = (articleId, newVotes)=>{
    return db.query(`UPDATE articles 
        SET votes = votes + $1
        WHERE article_id = $2 
        RETURNING *`, [newVotes, articleId])
    .then(result=>{
        return result.rows[0]
    })
}