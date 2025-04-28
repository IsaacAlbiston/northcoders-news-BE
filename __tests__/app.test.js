const endpointsJson = require("../endpoints.json");
const db = require("../db/connection")
const request = require("supertest")
const app = require("../app")
const data = require("../db/data/test-data")
const seed = require("../db/seeds/seed")
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
      expect(msg).toBe("Index Not Found")
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