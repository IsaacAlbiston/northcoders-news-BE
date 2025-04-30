const db = require("../../db/connection")

exports.selectArticleById = (articleId)=>{
    return db.query(`SELECT articles.*, 
        CAST(COUNT(comments.article_id) AS INT) AS comment_count 
        FROM articles
        LEFT JOIN comments
        ON articles.article_id = comments.article_id
        WHERE articles.article_id = $1
        GROUP BY articles.article_id`, [articleId])
    .then(result=>{
        if (result.rows.length){
            return result.rows[0]
        }
        return Promise.reject({status:404,msg:"Id Not Found"})
    })
}

exports.selectArticles = (query)=>{
    const validSortByArr = ["author","title","article_id","topic","created_at","votes","comment_count"]
    const validOrderArr = ["ASC","DESC"]
    const queryArgs = []
    let queryStr = `SELECT articles.article_id, articles.author, articles.title, articles.topic, articles.created_at, articles.votes, articles.article_img_url, 
        CAST(COUNT(comments.article_id) AS INT) AS comment_count 
        FROM articles
        LEFT JOIN comments ON articles.article_id = comments.article_id`

    if (query.topic){
        queryStr += ` WHERE topic = $1`
        queryArgs.push(query.topic)
    }

    queryStr += ` GROUP BY articles.article_id`

    if(query.sort_by){
        if (validSortByArr.includes(query.sort_by)){
            queryStr += ` ORDER BY ${query.sort_by}`
        } else{
            return Promise.reject({status:400,msg:"Bad Request"}) 
        }
    } else{
        queryStr += ` ORDER BY created_at`
    }
    if(query.order){
        if (validOrderArr.includes(query.order.toUpperCase())){
            queryStr += ` ${query.order.toUpperCase()}`
        } else{
            return Promise.reject({status:400,msg:"Bad Request"})
        }
    } else {
        queryStr += ` DESC`
    }
    return db.query(queryStr,queryArgs)
    .then(result=>{
        return result.rows
    })
}

exports.updateArticleById = (articleId, newVotes)=>{
    return db.query(`UPDATE articles 
        SET votes = votes + $1
        WHERE article_id = $2 
        RETURNING *`, [newVotes, articleId])
    .then(result=>{
        return result.rows[0]
    })
}