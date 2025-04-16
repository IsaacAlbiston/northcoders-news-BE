const {
  convertTimestampToDate,
  formatInsertQuery,
  createArticleRefObj
} = require("../db/seeds/utils");

describe("convertTimestampToDate", () => {
  test("returns a new object", () => {
    const timestamp = 1557572706232;
    const input = { created_at: timestamp };
    const result = convertTimestampToDate(input);
    expect(result).not.toBe(input);
    expect(result).toBeObject();
  });
  test("converts a created_at property to a date", () => {
    const timestamp = 1557572706232;
    const input = { created_at: timestamp };
    const result = convertTimestampToDate(input);
    expect(result.created_at).toBeDate();
    expect(result.created_at).toEqual(new Date(timestamp));
  });
  test("does not mutate the input", () => {
    const timestamp = 1557572706232;
    const input = { created_at: timestamp };
    convertTimestampToDate(input);
    const control = { created_at: timestamp };
    expect(input).toEqual(control);
  });
  test("ignores includes any other key-value-pairs in returned object", () => {
    const input = { created_at: 0, key1: true, key2: 1 };
    const result = convertTimestampToDate(input);
    expect(result.key1).toBe(true);
    expect(result.key2).toBe(1);
  });
  test("returns unchanged object if no created_at property", () => {
    const input = { key: "value" };
    const result = convertTimestampToDate(input);
    const expected = { key: "value" };
    expect(result).toEqual(expected);
  });
});

describe("formatInsertQuery", ()=>{
  test("returns an empty array when passed an empty array and an array", ()=>{
    const inputDataToInsert = []
    const inputColumnNamesArr = ["some","names"]
    const actual = formatInsertQuery(inputDataToInsert,inputColumnNamesArr)
    expect(actual).toEqual([])
  })
  test("returns an array of empty arrays when passed an array of objects and an empty array", ()=>{
    const inputDataToInsert = [{A:1},{B:2},{C:3}]
    const inputColumnNamesArr = []
    const actual = formatInsertQuery(inputDataToInsert,inputColumnNamesArr)
    expect(actual).toEqual([[],[],[]])
  })
  test("returns an array containing an array with data to be inserted into columns, when passed an array of one object and an array of column names", ()=>{
    const inputDataToInsert = [{
      description: "FOOTIE!",
      slug: "football",
      img_url:
        "https://images.pexels.com/photos/209841/pexels-photo-209841.jpeg?w=700&h=700",
    }]
    const inputColumnNamesArr = ["slug","description","img_url"]
    const expectedResult = [["football","FOOTIE!","https://images.pexels.com/photos/209841/pexels-photo-209841.jpeg?w=700&h=700"]]
    const actual = formatInsertQuery(inputDataToInsert,inputColumnNamesArr)
    expect(actual).toEqual(expectedResult)
  })
  test("returns an array containing multiple arrays with data to be inserted into columns, when passed an array of multiple objects and an array of column names", ()=>{
    const inputDataToInsert = [
      {
        description: 'The man, the Mitch, the legend',
        slug: 'mitch',
        img_url: ""
      },
      {
        description: 'Not dogs',
        slug: 'cats',
        img_url: ""
      },
      {
        description: 'what books are made of',
        slug: 'paper',
        img_url: ""
      }
    ]
    const inputColumnNamesArr = ["slug","description","img_url"]
    const expectedResult = [
      ['mitch','The man, the Mitch, the legend',""],
      ['cats','Not dogs',""],
      ['paper','what books are made of',""]
    ]
    const actual = formatInsertQuery(inputDataToInsert,inputColumnNamesArr)
    expect(actual).toEqual(expectedResult)
  })
  test("converts created_at timestamps to correct format", ()=>{
    const inputDataToInsert = [{
      title: "Living in the shadow of a great man",
      topic: "mitch",
      author: "butter_bridge",
      body: "I find this existence challenging",
      created_at: 1594329060000,
      votes: 100,
      article_img_url:
        "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
    }]
    const inputColumnNamesArr = ['title', 'topic', 'author', 'body', 'created_at', 'votes', 'article_img_url']
    const expectedOutput = [
      ["Living in the shadow of a great man",
        "mitch",
        "butter_bridge",
        "I find this existence challenging",
        new Date(1594329060000),
        100,
        "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"]
    ]
    const actual = formatInsertQuery(inputDataToInsert,inputColumnNamesArr)
    expect(actual).toEqual(expectedOutput)
  })
})

describe("createArticleRefObj", ()=>{
  test("returns an empty object when passed an empty array", ()=>{
    const inputArr = []
    const actual = createArticleRefObj(inputArr)
    expect(actual).toEqual({})
  })
  test("returns an object with a single key value pair when passed an array of one object", ()=>{
    const inputArr = [{
      article_id: 1,
      title: 'Living in the shadow of a great man',
      topic: 'mitch',
      author: 'butter_bridge',
      body: 'I find this existence challenging',
      created_at: "2020-07-09T20:11:00.000Z",
      votes: 100,
      article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
    }]
    const expectedOutput = {'Living in the shadow of a great man':1}
    const actual = createArticleRefObj(inputArr)
    expect(actual).toEqual(expectedOutput)
  })
  test("returns an object with a multiple key value pairs when passed an array of multiple objects", ()=>{
    const inputArr = [{
      article_id: 1,
      title: 'Living in the shadow of a great man',
      topic: 'mitch',
      author: 'butter_bridge',
      body: 'I find this existence challenging',
      created_at: "2020-07-09T20:11:00.000Z",
      votes: 100,
      article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
    },
    {
      article_id: 2,
      title: 'Sony Vaio; or, The Laptop',
      topic: 'mitch',
      author: 'icellusedkars',
      body: 'Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.',
      created_at: "2020-10-16T05:03:00.000Z",
      votes: 0,
      article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
    },
    {
      article_id: 3,
      title: 'Eight pug gifs that remind me of mitch',
      topic: 'mitch',
      author: 'icellusedkars',
      body: 'some gifs',
      created_at: "2020-11-03T09:12:00.000Z",
      votes: 0,
      article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
    }]
    const expectedOutput = {
      'Living in the shadow of a great man':1,
      'Sony Vaio; or, The Laptop':2,
      'Eight pug gifs that remind me of mitch':3
    }
    const actual = createArticleRefObj(inputArr)
    expect(actual).toEqual(expectedOutput)
  })
})