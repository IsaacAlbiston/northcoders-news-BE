const {
  convertTimestampToDate,
  formatInsertQuery
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
    const expectedResult = [
      ["Living in the shadow of a great man",
        "mitch",
        "butter_bridge",
        "I find this existence challenging",
        new Date(1594329060000),
        100,
        "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"]
    ]
    const actual = formatInsertQuery(inputDataToInsert,inputColumnNamesArr)
    expect(actual).toEqual(expectedResult)
  })
})

// describe("", ()=>{
  
// })