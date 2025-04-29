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
    .get("/api/articles/5/comments")
    .expect(200)
    .then(({body:{comments}})=>{
      expect(comments).toHaveLength(2)
      expect(comments).toBeSortedBy("created_at", { descending: true})
      comments.forEach(comment=>{
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
})

describe("GET /api/articles", ()=>{
  test("200: Responds with an array of all articles in descending order of date with no body and a comment_count", ()=>{
    return request(app)
    .get("/api/articles")
    .expect(200)
    .then(({body:{articles}})=>{
      expect(articles).toHaveLength(13)
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
    .send({votes:50})
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
  test("200: Responds with the updated article for the specified article_id when given a negative value of votes", ()=>{
    return request(app)
    .patch("/api/articles/1")
    .send({votes:-10})
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
  test("400: Responds with Bad Request when passed an object with a votes property that is not a number", ()=>{
    return request(app)
    .patch("/api/articles/2")
    .send({votes:"Not a number"})
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
    .send({votes:10,invalidKey:"error"})
    .expect(400)
    .then(({body:{msg}})=>{
      expect(msg).toBe("Bad Request")
    })
  })
  test("404: Responds with Id Not Found when given article_id is out of range", ()=>{
    return request(app)
    .patch("/api/articles/10000")
    .send({votes:10})
    .expect(404)
    .then(({body:{msg}})=>{
      expect(msg).toBe("Id Not Found")
    })
  })
  test("400: Responds with Bad Request when given article_id is not a number", ()=>{
    return request(app)
    .patch("/api/articles/notValidId")
    .send({votes:10})
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