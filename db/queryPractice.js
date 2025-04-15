const db = require('./connection');

function runQueries(){
    db.query("SELECT * FROM users")
    .then(result=>{
        console.log("--ALL users--")
        console.log(result.rows)
        return db.query(
            `SELECT * FROM articles 
            WHERE topic='coding'`
        )
    })
    .then(result=>{
        console.log("--ALL Articles about coding--")
        console.log(result.rows)
        return db.query(
            `SELECT * FROM comments
            WHERE votes<0`
        )
    })
    .then(result=>{
        console.log("--ALL comments with less than 0 votes--")
        console.log(result.rows)
        return db.query(
            `SELECT * FROM topics`
        )
    })
    .then(result=>{
        console.log("--ALL topics--")
        console.log(result.rows)
        return db.query(
            `SELECT * FROM articles
            WHERE author = 'grumpy19'`
        )
    })
    .then(result=>{
        console.log("--ALL articles by grumpy19--")
        console.log(result.rows)
        return db.query(
            `SELECT * FROM comments
            WHERE votes>10`
        )
    })
    .then(result=>{
        console.log("--ALL comments with more than 10 votes--")
        console.log(result.rows)
    })
}

runQueries()