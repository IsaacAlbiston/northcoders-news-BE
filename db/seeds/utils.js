const db = require("../../db/connection");

function formatInsertQuery(dataToInsert, columnNamesArr){
  const formattedData = dataToInsert.map((data)=>{
    const convertedData = convertTimestampToDate(data)
    const dataArr = []
    columnNamesArr.forEach((columnName)=>{
      dataArr.push(convertedData[columnName])
    })
    return dataArr
  })
  return formattedData
}

function createArticleRefObj(articlesData){
  const refObj = {}
  articlesData.forEach((article)=>{
    refObj[article.title] = article.article_id
  })
  return refObj
}

convertTimestampToDate = ({ created_at, ...otherProperties }) => {
  if (!created_at) return { ...otherProperties };
  return { created_at: new Date(created_at), ...otherProperties };
};

module.exports = {
  convertTimestampToDate, 
  formatInsertQuery, 
  createArticleRefObj
}



