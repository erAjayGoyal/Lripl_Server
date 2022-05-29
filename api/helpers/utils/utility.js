const Pool = require('pg').Pool

const fs = require('fs')
const path = require('path')
const util = require('util');

const readFile = util.promisify(fs.readFile);
const global = require('../constants/constant')
const sharp = require('sharp')
const imageReaderAsync = util.promisify(fs.readFile);

const converTimageToBase64 = (imageUrl, imageSrc) => {
  let extensionName = path.extname(imageUrl);
  let base64Image = new Buffer(imageSrc, 'binary').toString('base64');
  let imgSrcString = `data:image/${extensionName.split('.').pop()};base64,${base64Image}`;
  return imgSrcString
}



function createAppendQueryInsert(data) {
  let queryCol = `( `
  let queryVal = `( `
  let count = 1;
  for (let key in data) {

    queryCol = queryCol + key + ` , `
    queryVal = queryVal + `${data[key]}` + ` , `

  }

  queryVal = queryVal + ` )`
  queryCol = queryCol + ` )`

  return queryCol + queryVal

}


const queryGenerator = (queryObj) => {
  let operation = queryObj && queryObj.type;
  let query = ``;
  switch (operation) {
    case 'Select':
      (queryObj.tableName) ? (query = `SELECT * FROM ${queryObj.tableName} `) : '';
      (queryObj.identifier &&
        queryObj.conditionParam &&
        queryObj.operator) ? (query = query + `WHERE "${queryObj.identifier}" ${queryObj.operator} '${queryObj.conditionParam}' `) : '';
      break;
    case 'Insert':
      let data = queryObj.data
      queryObj.tableName ? (query = query = `INSERT INTO ${queryObj.tableName} ("Full Name", "User Id", "Password", "Role", "Status") VALUES
            ('${data.fullName}', '${data.userId}','${data.password}','${data.role}','${data.status}');`) : '';

      // code block
      break;
    default:
    // code block
  }
  return query;

}


const createErrorResponse = (err) => {
let errMsg
  if(err.code &&  err.table){
    let entityName = err.table
    if(err.code === '23505'){

errMsg = global.tableNameMapping[entityName] + ' already exists';
    }
  }else{
    errMsg = err
  }
return errMsg
}

const  compare = (a, b) => {
  // Use toUpperCase() to ignore character casing
  const bandA = a.name.toUpperCase();
  const bandB = b.name.toUpperCase();

  let comparison = 0;
  if (bandA > bandB) {
    comparison = 1;
  } else if (bandA < bandB) {
    comparison = -1;
  }
  return comparison;
}


const  compressAndSaveThumb = (url) =>{

  try{
    
    let inPath = path.join(__dirname, '..','../..', 'public', url);
            
    let outPath = path.join(__dirname, '..','../..', 'public', 'mobile', url);
sharp(inPath).resize(200,200) 
.jpeg({quality : 50}).toFile(outPath); 
  }
  catch(e){
    throw e
  }


}
module.exports = {
  queryGenerator,
  imageReaderAsync,
  converTimageToBase64,
  createErrorResponse,
  compare,
  compressAndSaveThumb
}