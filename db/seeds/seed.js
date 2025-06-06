const db = require("../connection")
const format = require("pg-format")
const {formatInsertQuery, createArticleRefObj} = require("./utils")

const seed = ({ topicData, userData, articleData, commentData }) => {
  return db.query("DROP TABLE IF EXISTS comments;")
  .then(()=>{
    return db.query("DROP TABLE IF EXISTS articles;")
  })
  .then(()=>{
    return db.query("DROP TABLE IF EXISTS users;")
  })
  .then(()=>{
    return db.query("DROP TABLE IF EXISTS topics;")
  })
  .then(()=>{
    return db.query(
      `CREATE TABLE topics (
        slug VARCHAR(40) PRIMARY KEY, 
        description VARCHAR(300) NOT NULL, 
        img_url VARCHAR(1000) DEFAULT 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
      );`
    )
  })
  .then(()=>{
    return db.query(
      `CREATE TABLE users (
        username VARCHAR(40) PRIMARY KEY, 
        name VARCHAR(300) NOT NULL, 
        avatar_url VARCHAR(1000)
      );`
    )
  })
  .then(()=>{
    return db.query(
      `CREATE TABLE articles (
        article_id SERIAL PRIMARY KEY, 
        title VARCHAR(300) NOT NULL,
        topic VARCHAR(40) REFERENCES topics(slug),
        author VARCHAR(40) REFERENCES users(username),
        body TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        votes INT DEFAULT 0,
        article_img_url VARCHAR(1000) DEFAULT 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
      );`
    )
  })
  .then(()=>{
    return db.query(
      `CREATE TABLE comments (
        comment_id SERIAL PRIMARY KEY,
        article_id INT REFERENCES articles(article_id) ON DELETE CASCADE,
        body TEXT NOT NULL,
        votes INT DEFAULT 0,
        author VARCHAR(40) REFERENCES users(username),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );`
    )
  })
  .then(()=>{
    const topicsColumns = ['slug', 'description', 'img_url']
    const formattedTopics = formatInsertQuery(topicData, topicsColumns)
    const topicInsertQuery = format(
      `INSERT INTO topics (slug, description, img_url)
      VALUES %L`,
      formattedTopics
    )
    return db.query(topicInsertQuery)
  })
  .then(()=>{
    const userColumns = ['username', 'name', 'avatar_url']
    const formattedUsers = formatInsertQuery(userData, userColumns)
    const userInsertQuery = format(
      `INSERT INTO users (username, name, avatar_url)
      VALUES %L`,
      formattedUsers
    )
    return db.query(userInsertQuery)
  })
  .then(()=>{
    const articleColumns = ['title', 'topic', 'author', 'body', 'created_at', 'votes', 'article_img_url'];
    const formattedArticles = formatInsertQuery(articleData, articleColumns)
    const articleInsertQuery = format(
      `INSERT INTO articles (title, topic, author, body, 
      created_at, votes, article_img_url)
      VALUES %L RETURNING *`,
      formattedArticles
    )
    return db.query(articleInsertQuery)
  })
  .then((result)=>{
    articleRefObj = createArticleRefObj(result.rows)
    const commentColumns = ['article_id', 'body', 'votes', 'author', 'created_at']
    const updatedCommentData = []
    commentData.forEach((comment)=>{
      newComment = {...comment}
      newComment.article_id = articleRefObj[comment.article_title]
      updatedCommentData.push(newComment)
    })
    const formattedComments = formatInsertQuery(updatedCommentData, commentColumns)
    const commentInsertQuery = format(
      `INSERT INTO comments (article_id, body, votes, author, created_at)
      VALUES %L`,
      formattedComments
    )
    return db.query(commentInsertQuery)
  })
  .then(()=>{
    console.log("tables seeded")
  })
};
module.exports = seed;
