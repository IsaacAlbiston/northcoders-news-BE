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
    const countQueryArgs = []
    let queryStr = `SELECT articles.article_id, articles.author, articles.title, articles.topic, articles.created_at, articles.votes, articles.article_img_url, 
        CAST(COUNT(comments.article_id) AS INT) AS comment_count 
        FROM articles
        LEFT JOIN comments ON articles.article_id = comments.article_id`
    let countQueryStr = `SELECT CAST(COUNT(article_id) AS int) AS total_count 
        FROM articles`
    if (query.topic){
        queryArgs.push(query.topic)
        queryStr += ` WHERE topic = $${queryArgs.length}`
        countQueryArgs.push(query.topic)
        countQueryStr += ` WHERE topic = $${countQueryArgs.length}`
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
    queryArgs.push(query.limit)
    queryStr += ` LIMIT $${queryArgs.length}`
    const offset = (query.p-1)*query.limit
    queryArgs.push(offset)
    queryStr += ` OFFSET $${queryArgs.length}`

    promiseArr = []
    promiseArr.push(db.query(queryStr, queryArgs))
    promiseArr.push(db.query(countQueryStr, countQueryArgs))
    
    return Promise.all(promiseArr)
    .then(result=>{
        return {
            articles: result[0].rows,
            total_count: result[1].rows[0].total_count
        }
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

exports.insertArticle = (newArticle)=>{
    if (newArticle.article_img_url){
        return db.query(`INSERT INTO articles 
            (author, title, body, topic, article_img_url)
            VALUES ($1,$2,$3,$4,$5)
            RETURNING *`,[newArticle.author, newArticle.title, newArticle.body, newArticle.topic, newArticle.article_img_url])
        .then(result=>{
            return result.rows[0]
        })
    }
    return db.query(`INSERT INTO articles 
        (author, title, body, topic)
        VALUES ($1,$2,$3,$4)
        RETURNING *`,[newArticle.author, newArticle.title, newArticle.body, newArticle.topic])
    .then(result=>{
        return result.rows[0]
    })
}

exports.deleteFromArticlesById = (articleId)=>{
    return db.query(`DELETE FROM articles
        WHERE article_id = $1
        RETURNING *`,[articleId])
    .then(result=>{
        if (result.rows.length) return result.rows[0]
        return Promise.reject({status:404,msg:"Id Not Found"})
    })
}