const endpointsJson = require("../endpoints.json");
const db = require("../db/connection")
const request = require("supertest")
const app = require("../app")
const data = require("../db/data/test-data")
const seed = require("../db/seeds/seed")
const jestSorted = require("jest-sorted")
/* Set up your test imports here */

beforeEach(()=> seed(data))

afterAll(()=> db.end())
/* Set up your beforeEach & afterAll functions here */

describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});

describe("testing bad endpoint", ()=>{
  test("404: Responds with Not Found when endpoint is invalid", ()=>{
    return request(app)
    .get("/api/invalidEndpoint")
    .expect(404)
    .then(({body:{msg}})=>{
      expect(msg).toBe("Endpoint Not Found")
    })
  })
})

describe("GET /api/topics", ()=>{
  test("200: Responds with an array of all topics, each with a slug and a description", ()=>{
    return request(app)
    .get("/api/topics")
    .expect(200)
    .then(({body:{topics}})=>{
      expect(topics).toHaveLength(3)
      topics.forEach(topic=>{
        expect(topic).toMatchObject({
          slug: expect.any(String),
          description: expect.any(String)
        })
      })
    })
  })
})

describe("GET /api/articles/:article_id", ()=>{
  test("200: Responds with an article object with the specified article_id", ()=>{
    return request(app)
    .get("/api/articles/3")
    .expect(200)
    .then(({body:{article}})=>{
      expect(article).toMatchObject({
        article_id: 3,
        title: 'Eight pug gifs that remind me of mitch',
        topic: 'mitch',
        author: 'icellusedkars',
        body: 'some gifs',
        created_at: "2020-11-03T09:12:00.000Z",
        votes: 0,
        article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
      })
    })
  })
  test("200: Responds Responds with an article object with the specified article_id including comment_count", ()=>{
    return request(app)
    .get("/api/articles/9")
    .expect(200)
    .then(({body:{article}})=>{
      expect(article).toMatchObject({
        article_id: 9,
        title: "They're not exactly dogs, are they?",
        topic: 'mitch',
        author: "butter_bridge",
        body: "Well? Think about it.",
        created_at: "2020-06-06T09:10:00.000Z",
        votes: 0,
        article_img_url:  "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        comment_count: 2
      })
    })
  })
  test("404: Responds with Not Found when given article_id is out of range", ()=>{
    return request(app)
    .get("/api/articles/10000")
    .expect(404)
    .then(({body:{msg}})=>{
      expect(msg).toBe("Id Not Found")
    })
  })
  test("400: Responds with Bad Request when given article_id is not a number", ()=>{
    return request(app)
    .get("/api/articles/notValidId")
    .expect(400)
    .then(({body:{msg}})=>{
      expect(msg).toBe("Bad Request")
    })
  })
})

describe("GET /api/articles/:article_id/comments", ()=>{
  test("200: Responds with an array of all comments in descending order of date for an article with the specified article_id", ()=>{
    return request(app)
    .get("/api/articles/1/comments")
    .expect(200)
    .then(({body:{comments}})=>{
      expect(comments.length).toBeGreaterThan(0)
      expect(comments).toBeSortedBy("created_at", { descending: true})
      comments.forEach(comment=>{
        expect(comment).toMatchObject({
          author: expect.any(String),
          body: expect.any(String),
          comment_id: expect.any(Number),
          created_at: expect.any(String),
          votes: expect.any(Number),
          article_id: 1
        })
      })
    })
  })
  test("404: Responds with Not Found when given article_id is out of range", ()=>{
    return request(app)
    .get("/api/articles/10000/comments")
    .expect(404)
    .then(({body:{msg}})=>{
      expect(msg).toBe("Id Not Found")
    })
  })
  test("200: Responds with an empty array for an article that has no comments", ()=>{
    return request(app)
    .get("/api/articles/2/comments")
    .expect(200)
    .then(({body:{comments}})=>{
      expect(comments).toEqual([])
    })
  })
  test("400: Responds with Bad Request when given article_id is not a number", ()=>{
    return request(app)
    .get("/api/articles/notValidId/comments")
    .expect(400)
    .then(({body:{msg}})=>{
      expect(msg).toBe("Bad Request")
    })
  })
  test("200: Responds with an array of the first 10 comments and a total_count when the limit query is not given", ()=>{
    return request(app)
    .get("/api/articles/1/comments")
    .expect(200)
    .then(({body:{comments,total_count}})=>{
      expect(comments).toHaveLength(10)
      expect(total_count).toBe(11)
      expect(comments).toBeSortedBy("created_at", { descending: true})
      comments.forEach(comment=>{
        expect(comment.created_at>="2020-02-23T12:01:00.000Z").toBe(true)
        expect(comment).toMatchObject({
          author: expect.any(String),
          body: expect.any(String),
          comment_id: expect.any(Number),
          created_at: expect.any(String),
          votes: expect.any(Number),
          article_id: expect.any(Number)
        })
      })
    })
  })
  test("200: Responds with an array of the first 5 comments and a total_count when the limit query is 5", ()=>{
    return request(app)
    .get("/api/articles/1/comments?limit=5")
    .expect(200)
    .then(({body:{comments,total_count}})=>{
      expect(comments).toHaveLength(5)
      expect(total_count).toBe(11)
      expect(comments).toBeSortedBy("created_at", { descending: true})
      comments.forEach(comment=>{
        expect(comment.created_at>="2020-05-15T20:19:00.000Z").toBe(true)
        expect(comment).toMatchObject({
          author: expect.any(String),
          body: expect.any(String),
          comment_id: expect.any(Number),
          created_at: expect.any(String),
          votes: expect.any(Number),
          article_id: expect.any(Number)
        })
      })
    })
  })
  test("200: Responds with an array of comments 6-10 when the limit query is 5 and the p query is 2", ()=>{
    return request(app)
    .get("/api/articles/1/comments?limit=5&p=2&sort_by=article_id&order=asc")
    .expect(200)
    .then(({body:{comments,total_count}})=>{
      expect(comments).toHaveLength(5)
      expect(total_count).toBe(11)
      expect(comments).toBeSortedBy("created_at", { descending: true})
      comments.forEach(comment=>{
        expect(comment.created_at<"2020-05-15T20:19:00.000Z").toBe(true)
        expect(comment.created_at>="2020-02-23T12:01:00.000Z").toBe(true)
        expect(comment).toMatchObject({
          author: expect.any(String),
          body: expect.any(String),
          comment_id: expect.any(Number),
          created_at: expect.any(String),
          votes: expect.any(Number),
          article_id: expect.any(Number)
        })
      })
    })
  })
  test("400: Responds with Bad Request when the limit query is not a number", ()=>{
    return request(app)
    .get("/api/articles/3/comments?limit=notNumber")
    .expect(400)
    .then(({body:{msg}})=>{
      expect(msg).toBe("Bad Request")
    })
  })
  test("400: Responds with Bad Request when the limit query is less than or equal to 0", ()=>{
    return request(app)
    .get("/api/articles/3/comments?limit=-10")
    .expect(400)
    .then(({body:{msg}})=>{
      expect(msg).toBe("Bad Request")
    })
  })
  test("400: Responds with Bad Request when the p query is not a number", ()=>{
    return request(app)
    .get("/api/articles/3/comments?p=notNumber")
    .expect(400)
    .then(({body:{msg}})=>{
      expect(msg).toBe("Bad Request")
    })
  })
  test("400: Responds with Bad Request when the p query is less than or equal to 0", ()=>{
    return request(app)
    .get("/api/articles/3/comments?p=-10")
    .expect(400)
    .then(({body:{msg}})=>{
      expect(msg).toBe("Bad Request")
    })
  })
})

describe("GET /api/articles", ()=>{
  test("200: Responds with an array of all articles in descending order of date with no body and a comment_count", ()=>{
    return request(app)
    .get("/api/articles")
    .expect(200)
    .then(({body:{articles}})=>{
      expect(articles.length).toBeGreaterThan(0)
      expect(articles).toBeSortedBy("created_at", { descending: true})
      articles.forEach(article=>{
        expect(article).not.toHaveProperty("body")
        expect(article).toMatchObject({
          author: expect.any(String),
          title: expect.any(String),
          article_id: expect.any(Number),
          topic: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          article_img_url: expect.any(String),
          comment_count: expect.any(Number)
        })
      })
    })
  })
  test("200: Responds with an array of all articles in descending order of votes when the sort_by query is votes", ()=>{
    return request(app)
    .get("/api/articles?sort_by=votes")
    .expect(200)
    .then(({body:{articles}})=>{
      expect(articles.length).toBeGreaterThan(0)
      expect(articles).toBeSortedBy("votes", { descending: true})
      articles.forEach(article=>{
        expect(article).not.toHaveProperty("body")
        expect(article).toMatchObject({
          author: expect.any(String),
          title: expect.any(String),
          article_id: expect.any(Number),
          topic: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          article_img_url: expect.any(String),
          comment_count: expect.any(Number)
        })
      })
    })
  })
  test("200: Responds with an array of all articles in descending order of title when the sort_by query is title", ()=>{
    return request(app)
    .get("/api/articles?sort_by=title")
    .expect(200)
    .then(({body:{articles}})=>{
      expect(articles.length).toBeGreaterThan(0)
      expect(articles).toBeSortedBy("title", { descending: true})
      articles.forEach(article=>{
        expect(article).not.toHaveProperty("body")
        expect(article).toMatchObject({
          author: expect.any(String),
          title: expect.any(String),
          article_id: expect.any(Number),
          topic: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          article_img_url: expect.any(String),
          comment_count: expect.any(Number)
        })
      })
    })
  })
  test("400: Responds with Bad Request when the sort_by query is invalid", ()=>{
    return request(app)
    .get("/api/articles?sort_by=invalid_query")
    .expect(400)
    .then(({body:{msg}})=>{
      expect(msg).toBe("Bad Request")
    })
  })
  test("200: Responds with an array of all articles in ascending order of date when the order query is asc", ()=>{
    return request(app)
    .get("/api/articles?order=asc")
    .expect(200)
    .then(({body:{articles}})=>{
      expect(articles.length).toBeGreaterThan(0)
      expect(articles).toBeSortedBy("created_at", { ascending: true})
      articles.forEach(article=>{
        expect(article).not.toHaveProperty("body")
        expect(article).toMatchObject({
          author: expect.any(String),
          title: expect.any(String),
          article_id: expect.any(Number),
          topic: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          article_img_url: expect.any(String),
          comment_count: expect.any(Number)
        })
      })
    })
  })
  test("200: Responds with an array of all articles in descending order of date when the order query is desc", ()=>{
    return request(app)
    .get("/api/articles?order=desc")
    .expect(200)
    .then(({body:{articles}})=>{
      expect(articles.length).toBeGreaterThan(0)
      expect(articles).toBeSortedBy("created_at", { descending: true})
      articles.forEach(article=>{
        expect(article).not.toHaveProperty("body")
        expect(article).toMatchObject({
          author: expect.any(String),
          title: expect.any(String),
          article_id: expect.any(Number),
          topic: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          article_img_url: expect.any(String),
          comment_count: expect.any(Number)
        })
      })
    })
  })
  test("200: Responds with an array of all articles in ascending order of votes when the sort_by query is votes and the order query is asc", ()=>{
    return request(app)
    .get("/api/articles?sort_by=votes&order=asc")
    .expect(200)
    .then(({body:{articles}})=>{
      expect(articles.length).toBeGreaterThan(0)
      expect(articles).toBeSortedBy("votes", { ascending: true})
      articles.forEach(article=>{
        expect(article).not.toHaveProperty("body")
        expect(article).toMatchObject({
          author: expect.any(String),
          title: expect.any(String),
          article_id: expect.any(Number),
          topic: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          article_img_url: expect.any(String),
          comment_count: expect.any(Number)
        })
      })
    })
  })
  test("400: Responds with Bad Request when the order query is invalid", ()=>{
    return request(app)
    .get("/api/articles?order=invalid_query")
    .expect(400)
    .then(({body:{msg}})=>{
      expect(msg).toBe("Bad Request")
    })
  })
  test("200: Responds with an array of all articles for the cats topic in descending order of date when the topic query is mitch", ()=>{
    return request(app)
    .get("/api/articles?topic=mitch")
    .expect(200)
    .then(({body:{articles}})=>{
      expect(articles.length).toBeGreaterThan(0)
      expect(articles).toBeSortedBy("created_at", { descending: true})
      articles.forEach(article=>{
        expect(article).not.toHaveProperty("body")
        expect(article).toMatchObject({
          author: expect.any(String),
          title: expect.any(String),
          article_id: expect.any(Number),
          topic: "mitch",
          created_at: expect.any(String),
          votes: expect.any(Number),
          article_img_url: expect.any(String),
          comment_count: expect.any(Number)
        })
      })
    })
  })
  test("200: Responds with an array of all articles for the mitch topic in ascending order of votes when the topic query is mitch, the order query is asc and the sort_by query is votes", ()=>{
    return request(app)
    .get("/api/articles?topic=mitch&order=asc&sort_by=votes")
    .expect(200)
    .then(({body:{articles}})=>{
      expect(articles.length).toBeGreaterThan(0)
      expect(articles).toBeSortedBy("votes", { ascending: true})
      articles.forEach(article=>{
        expect(article).not.toHaveProperty("body")
        expect(article).toMatchObject({
          author: expect.any(String),
          title: expect.any(String),
          article_id: expect.any(Number),
          topic: "mitch",
          created_at: expect.any(String),
          votes: expect.any(Number),
          article_img_url: expect.any(String),
          comment_count: expect.any(Number)
        })
      })
    })
  })
  test("200: Responds with an empty array when the topic query is a topic that has no articles", ()=>{
    return request(app)
    .get("/api/articles?topic=paper")
    .expect(200)
    .then(({body:{articles}})=>{
      expect(articles).toEqual([])
    })
  })
  test("400: Responds with Bad Request when the topic query is invalid", ()=>{
    return request(app)
    .get("/api/articles?topic=invalid_query")
    .expect(400)
    .then(({body:{msg}})=>{
      expect(msg).toBe("Bad Request")
    })
  })
  test("200: Responds with an array of the first 10 articles and a total_count when the limit query is not given", ()=>{
    return request(app)
    .get("/api/articles")
    .expect(200)
    .then(({body:{articles,total_count}})=>{
      expect(articles).toHaveLength(10)
      expect(total_count).toBe(13)
      expect(articles).toBeSortedBy("created_at", { descending: true})
      articles.forEach(article=>{
        expect(article).not.toHaveProperty("body")
        expect(article).toMatchObject({
          author: expect.any(String),
          title: expect.any(String),
          article_id: expect.any(Number),
          topic: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          article_img_url: expect.any(String),
          comment_count: expect.any(Number)
        })
      })
    })
  })
  test("200: Responds with an array of the first 5 articles and a total_count when the limit query is 5", ()=>{
    return request(app)
    .get("/api/articles?limit=5")
    .expect(200)
    .then(({body:{articles,total_count}})=>{
      expect(articles).toHaveLength(5)
      expect(total_count).toBe(13)
      expect(articles).toBeSortedBy("created_at", { descending: true})
      articles.forEach(article=>{
        expect(article).not.toHaveProperty("body")
        expect(article).toMatchObject({
          author: expect.any(String),
          title: expect.any(String),
          article_id: expect.any(Number),
          topic: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          article_img_url: expect.any(String),
          comment_count: expect.any(Number)
        })
      })
    })
  })
  test("200: Responds with an array of articles 6-10 when the limit query is 5 and the p query is 2", ()=>{
    return request(app)
    .get("/api/articles?limit=5&p=2&sort_by=article_id&order=asc")
    .expect(200)
    .then(({body:{articles,total_count}})=>{
      expect(articles).toHaveLength(5)
      expect(total_count).toBe(13)
      let id_count = 6
      articles.forEach(article=>{
        expect(article).not.toHaveProperty("body")
        expect(article).toMatchObject({
          author: expect.any(String),
          title: expect.any(String),
          article_id: id_count++,
          topic: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          article_img_url: expect.any(String),
          comment_count: expect.any(Number)
        })
      })
    })
  })
  test("400: Responds with Bad Request when the limit query is not a number", ()=>{
    return request(app)
    .get("/api/articles?limit=notNumber")
    .expect(400)
    .then(({body:{msg}})=>{
      expect(msg).toBe("Bad Request")
    })
  })
  test("400: Responds with Bad Request when the limit query is less than or equal to 0", ()=>{
    return request(app)
    .get("/api/articles?limit=-10")
    .expect(400)
    .then(({body:{msg}})=>{
      expect(msg).toBe("Bad Request")
    })
  })
  test("400: Responds with Bad Request when the p query is not a number", ()=>{
    return request(app)
    .get("/api/articles?p=notNumber")
    .expect(400)
    .then(({body:{msg}})=>{
      expect(msg).toBe("Bad Request")
    })
  })
  test("400: Responds with Bad Request when the p query is less than or equal to 0", ()=>{
    return request(app)
    .get("/api/articles?p=-10")
    .expect(400)
    .then(({body:{msg}})=>{
      expect(msg).toBe("Bad Request")
    })
  })
})

describe("POST /api/articles", ()=>{
  test("200: Responds with the new article with a comment count and adds the article to the articles table", ()=>{
    return request(app)
    .post("/api/articles")
    .send({
      author: "rogersop",
      title: "New article",
      body: "This is a new article",
      topic: "paper",
      article_img_url: "some_img_url"
    })
    .expect(200)
    .then(({body:{article}})=>{
      expect(article).toMatchObject({
        author: "rogersop",
        title: "New article",
        body: "This is a new article",
        topic: "paper",
        article_img_url: "some_img_url",
        article_id: 14,
        votes: 0,
        created_at: expect.any(String),
        comment_count: 0
      })
    })
  })
  test("200: Responds with the new article with default article_img_url and adds the article to the articles table when article_img_url is not given", ()=>{
    return request(app)
    .post("/api/articles")
    .send({
      author: "rogersop",
      title: "New article",
      body: "This is a new article",
      topic: "paper"
    })
    .expect(200)
    .then(({body:{article}})=>{
      expect(article).toMatchObject({
        author: "rogersop",
        title: "New article",
        body: "This is a new article",
        topic: "paper",
        article_img_url: expect.any(String),
        article_id: 14,
        votes: 0,
        created_at: expect.any(String),
        comment_count: 0
      })
    })
  })
  test("400: Responds with Bad Request when passed an object that is missing required properties", ()=>{
    return request(app)
    .post("/api/articles")
    .send({
      author: "rogersop",
      topic: "paper"
    })
    .expect(400)
    .then(({body:{msg}})=>{
      expect(msg).toBe("Bad Request")
    })
  })
  test("400: Responds with Bad Request when passed an object that has more properties than required", ()=>{
    return request(app)
    .post("/api/articles")
    .send({
      author: "rogersop",
      title: "New article",
      body: "This is a new article",
      topic: "paper",
      unneeded: "This is not needed"
    })
    .expect(400)
    .then(({body:{msg}})=>{
      expect(msg).toBe("Bad Request")
    })
  })
  test("404: Responds with Foreign Key Not Found when passed an object that has an author that is not in the users table", ()=>{
    return request(app)
    .post("/api/articles")
    .send({
      author: "not a username",
      title: "New article",
      body: "This is a new article",
      topic: "paper"
    })
    .expect(404)
    .then(({body:{msg}})=>{
      expect(msg).toBe("Foreign Key Not Found")
    })
  })
  test("404: Responds with Foreign Key Not Found when passed an object that has a topic that is not in the topics table", ()=>{
    return request(app)
    .post("/api/articles")
    .send({
      author: "rogersop",
      title: "New article",
      body: "This is a new article",
      topic: "not a topic"
    })
    .expect(404)
    .then(({body:{msg}})=>{
      expect(msg).toBe("Foreign Key Not Found")
    })
  })
})

describe("POST /api/articles/:article_id/comments", ()=>{
  test("200: Responds with posted comment", ()=>{
    return request(app)
    .post("/api/articles/2/comments")
    .send({username:"butter_bridge",body:"Some comment"})
    .expect(200)
    .then(({body:{comment}})=>{
      expect(comment).toMatchObject({
        author:"butter_bridge",
        body:"Some comment",
        comment_id: expect.any(Number),
        created_at: expect.any(String),
        votes: expect.any(Number),
        article_id: expect.any(Number)
      })
    })
  })
  test("404: Responds with Foreign Key Not Found when given article_id is out of range", ()=>{
    return request(app)
    .post("/api/articles/10000/comments")
    .send({username:"butter_bridge",body:"Some comment"})
    .expect(404)
    .then(({body:{msg}})=>{
      expect(msg).toBe("Foreign Key Not Found")
    })
  })
  test("400: Responds with Bad Request when given article_id is not a number", ()=>{
    return request(app)
    .post("/api/articles/notNumber/comments")
    .send({username:"butter_bridge",body:"Some comment"})
    .expect(400)
    .then(({body:{msg}})=>{
      expect(msg).toBe("Bad Request")
    })
  })
  test("400: Responds with Bad Request when passed an object that is missing required properties", ()=>{
    return request(app)
    .post("/api/articles/2/comments")
    .send({})
    .expect(400)
    .then(({body:{msg}})=>{
      expect(msg).toBe("Bad Request")
    })
  })
  test("400: Responds with Bad Request when passed an object that has more properties than required", ()=>{
    return request(app)
    .post("/api/articles/1/comments")
    .send({username:"butter_bridge",body:"Some comment",invalidKey:"error"})
    .expect(400)
    .then(({body:{msg}})=>{
      expect(msg).toBe("Bad Request")
    })
  })
  test("404: Responds with Foreign Key Not Found when passed an object that has a username that is not in the users table", ()=>{
    return request(app)
    .post("/api/articles/1/comments")
    .send({username:"not_a_user",body:"Some comment"})
    .expect(404)
    .then(({body:{msg}})=>{
      expect(msg).toBe("Foreign Key Not Found")
    })
  })
})

describe("PATCH /api/articles/:article_id", ()=>{
  test("200: Responds with the updated article for the specified article_id", ()=>{
    return request(app)
    .patch("/api/articles/1")
    .send({inc_votes:50})
    .expect(200)
    .then(({body:{article}})=>{
      expect(article).toMatchObject({
        article_id: 1,
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: "2020-07-09T20:11:00.000Z",
        votes: 150,
        article_img_url:
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
      })
    })
  })
  test("200: Responds with the updated article for the specified article_id when given a negative value of inc_votes", ()=>{
    return request(app)
    .patch("/api/articles/1")
    .send({inc_votes:-10})
    .expect(200)
    .then(({body:{article}})=>{
      expect(article).toMatchObject({
        article_id: 1,
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: "2020-07-09T20:11:00.000Z",
        votes: 90,
        article_img_url:
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
      })
    })
  })
  test("400: Responds with Bad Request when passed an object with a inc_votes property that is not a number", ()=>{
    return request(app)
    .patch("/api/articles/2")
    .send({inc_votes:"Not a number"})
    .expect(400)
    .then(({body:{msg}})=>{
      expect(msg).toBe("Bad Request")
    })
  })
  test("400: Responds with Bad Request when passed an object that is missing required properties", ()=>{
    return request(app)
    .patch("/api/articles/2")
    .send({})
    .expect(400)
    .then(({body:{msg}})=>{
      expect(msg).toBe("Bad Request")
    })
  })
  test("400: Responds with Bad Request when passed an object that has more properties than required", ()=>{
    return request(app)
    .patch("/api/articles/1")
    .send({inc_votes:10,invalidKey:"error"})
    .expect(400)
    .then(({body:{msg}})=>{
      expect(msg).toBe("Bad Request")
    })
  })
  test("404: Responds with Id Not Found when given article_id is out of range", ()=>{
    return request(app)
    .patch("/api/articles/10000")
    .send({inc_votes:10})
    .expect(404)
    .then(({body:{msg}})=>{
      expect(msg).toBe("Id Not Found")
    })
  })
  test("400: Responds with Bad Request when given article_id is not a number", ()=>{
    return request(app)
    .patch("/api/articles/notValidId")
    .send({inc_votes:10})
    .expect(400)
    .then(({body:{msg}})=>{
      expect(msg).toBe("Bad Request")
    })
  })
})

describe("DELETE /api/comments/:comment_id", ()=>{
  test("204: Responds with no content and deletes the specified comment", ()=>{
    return request(app)
    .delete("/api/comments/1")
    .expect(204)
    .then(({body})=>{
      expect(body).toEqual({})
      return request(app)
      .get("/api/articles/9/comments")
      .expect(200)
      .then(({body:{comments}})=>{
        expect(comments).toHaveLength(1)
      })
    })
  })
  test("404: Responds with Id Not Found when comment_id is out of range", ()=>{
    return request(app)
    .delete("/api/comments/10000")
    .expect(404)
    .then(({body:{msg}})=>{
      expect(msg).toBe("Id Not Found")
    })
  })
  test("400: Responds with Bad Request when comment_id is not a number", ()=>{
    return request(app)
    .delete("/api/comments/NotNumber")
    .expect(400)
    .then(({body:{msg}})=>{
      expect(msg).toBe("Bad Request")
    })
  })
})

describe("PATCH /api/comments/:comment_id", ()=>{
  test("Responds with the updated comment for the specified comment_id", ()=>{
    return request(app)
    .patch("/api/comments/1")
    .send({inc_votes:10})
    .expect(200)
    .then(({body:{comment}})=>{
      expect(comment).toMatchObject({
        comment_id: 1,
        article_id: 9,
        body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        votes: 26,
        author: "butter_bridge",
        created_at: "2020-04-06T12:17:00.000Z",
      })
    })
  })
  test("200: Responds with the updated comment for the specified comment_id when given a negative value of inc_votes", ()=>{
    return request(app)
    .patch("/api/comments/1")
    .send({inc_votes:-10})
    .expect(200)
    .then(({body:{comment}})=>{
      expect(comment).toMatchObject({
        comment_id: 1,
        article_id: 9,
        body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        votes: 6,
        author: "butter_bridge",
        created_at: "2020-04-06T12:17:00.000Z",
      })
    })
  })
  test("400: Responds with Bad Request when passed an object with a inc_votes property that is not a number", ()=>{
    return request(app)
    .patch("/api/comments/1")
    .send({inc_votes:"Not a number"})
    .expect(400)
    .then(({body:{msg}})=>{
      expect(msg).toBe("Bad Request")
    })
  })
  test("400: Responds with Bad Request when passed an object that is missing required properties", ()=>{
    return request(app)
    .patch("/api/comments/1")
    .send({})
    .expect(400)
    .then(({body:{msg}})=>{
      expect(msg).toBe("Bad Request")
    })
  })
  test("400: Responds with Bad Request when passed an object that has more properties than required", ()=>{
    return request(app)
    .patch("/api/comments/1")
    .send({inc_votes:10,tooMany:"I shouldn't be here"})
    .expect(400)
    .then(({body:{msg}})=>{
      expect(msg).toBe("Bad Request")
    })
  })
  test("404: Responds with Id Not Found when given comment_id is out of range ", ()=>{
    return request(app)
    .patch("/api/comments/10000")
    .send({inc_votes:10})
    .expect(404)
    .then(({body:{msg}})=>{
      expect(msg).toBe("Id Not Found")
    })
  })
  test("400: Responds with Bad Request when given comment_id is not a number", ()=>{
    return request(app)
    .patch("/api/comments/notANumber")
    .send({inc_votes:10})
    .expect(400)
    .then(({body:{msg}})=>{
      expect(msg).toBe("Bad Request")
    })
  })
})

describe("GET /api/users", ()=>{
  test("200: Responds with an array of all users", ()=>{
    return request(app)
    .get("/api/users")
    .expect(200)
    .then(({body:{users}})=>{
      expect(users).toHaveLength(4)
      users.forEach(user=>{
        expect(user).toMatchObject({
          username: expect.any(String),
          name: expect.any(String),
          avatar_url: expect.any(String)
        })
      })
    })
  })
})

describe("GET /api/users/:username", ()=>{
  test("200: Responds with a user object with the specified username", ()=>{
    return request(app)
    .get("/api/users/rogersop")
    .expect(200)
    .then(({body:{user}})=>{
      expect(user).toMatchObject({
        username: "rogersop",
        name: "paul",
        avatar_url: "https://avatars2.githubusercontent.com/u/24394918?s=400&v=4",
      })
    })
  })
  test("404: Responds with Username Not Found when given a username not in the database", ()=>{
    return request(app)
    .get("/api/users/invalidUsername")
    .expect(404)
    .then(({body:{msg}})=>{
      expect(msg).toBe("Username Not Found")
    })
  })
})