
const connection = require('./connection')

const utility = require('../utils/utility')




const getAllCategories = (userName) => {
    return new Promise((resolve, reject) => {
      let queryObj = {
        type : 'Select',
        tableName : 'types'
      }
      let query = utility.queryGenerator(queryObj)
      if(query !== '') {
        connection.pool.query(query, (error, results) => {
            if (error) {
              reject(error)
            }else{
              console.log('hi', results.rows)
              resolve(results.rows)
            }
          })
      }
      else{
          reject('Error in fetching User Data')
      }
           
  })
}



const getDataForent = (tableName) => {
  return new Promise((resolve, reject) => {
    let queryObj = {
      type : 'Select',
      tableName : tableName
    }
    let query = utility.queryGenerator(queryObj)
    if(query !== '') {
      connection.pool.query(query, (error, results) => {
          if (error) {
            reject(error)
          }else{
            resolve(results.rows)
          }
        })
    }
    else{
        reject('Error in fetching User Data')
    }
         
})
}



const getStateData = () => {
  return new Promise((resolve, reject) => {
    let queryObj = {
      type : 'Select',
      tableName : 'state'
    }
    let query = utility.queryGenerator(queryObj)
    if(query !== '') {
      connection.pool.query(query, (error, results) => {
          if (error) {
            reject(error)
          }else{
            resolve(results.rows)
          }
        })
    }
    else{
        reject('Error in fetching state Data')
    }
         
})
}
const getZoneData = () => {
  return new Promise((resolve, reject) => {
    let queryObj = {
      type : 'Select',
      tableName : 'zone'
    }
    let query = utility.queryGenerator(queryObj)
    if(query !== '') {
      connection.pool.query(query, (error, results) => {
          if (error) {
            reject(error)
          }else{
            resolve(results.rows)
          }
        })
    }
    else{
        reject('Error in fetching state Data')
    }
         
})
}


const getBrandData = () => {
  return new Promise((resolve, reject) => {
    let queryObj = {
      type : 'Select',
      tableName : 'brand'
    }
    let query = utility.queryGenerator(queryObj)
    if(query !== '') {
      connection.pool.query(query, (error, results) => {
          if (error) {
            reject(error)
          }else{
            resolve(results.rows)
          }
        })
    }
    else{
        reject('Error in fetching state Data')
    }
         
})
}



const getRoleData = () => {
  return new Promise((resolve, reject) => {
    let queryObj = {
      type : 'Select',
      tableName : 'role'
    }
    let query = utility.queryGenerator(queryObj)
    if(query !== '') {
      connection.pool.query(query, (error, results) => {
          if (error) {
            reject(error)
          }else{
            resolve(results.rows)
          }
        })
    }
    else{
        reject('Error in fetching role Data')
    }
         
})
}


const   addCategoryToDatabase = (categoryObject) => {
  return new Promise((resolve, reject) => {
    let queryObj = {
      type : 'Insert',
      tableName : 'types',
      data : categoryObject
    }
   // let query = utility.queryGenerator(queryObj)
   let query = `INSERT INTO types(name, imageurl) VALUES ('${categoryObject.name}', '${categoryObject.imageurl}');`
    if(query !== '') {
      connection.pool.query(query, (error, results) => {
          if (error) {
            reject(error)
          }else{
            resolve(results)
          }
        })
    }
    else{
        reject('Error in fetching User Data')
    }
         
})
}

const    UpdateSpecifiedEntityData= (tableName, identifier, data) => {
  return new Promise((resolve, reject) => {
  
   let query = `SET `
   if(tableName === 'products'){

    
      query = query + `name = '${data.name}', zone_id = '${data.zone_id}', state_id = '${data.state_id}', brand_id = '${data.brand_id}'` 
    
    if(data.imageurl && data.imageurl.length > 0){
      
    query = query + `, imageurl = '${data.imageurl}'` 
    }

   }
   else{
    if(data.name){
      query = query + `name = '${data.name}'` 
    }
    if(data.imageurl && data.imageurl.length > 0){
      
    query = query + `, imageurl = '${data.imageurl}'` 
    }
     
   }
   

   let putDataQuery = `UPDATE ${tableName} ${query}
   WHERE "${identifier}" = '${data.id}';`
   if(putDataQuery !== '') {
      connection.pool.query(putDataQuery, (error, results) => {
          if (error) {
            reject(error)
          }else{
            resolve(results)
          }
        })
    }
    else{
        reject('Error in fetching User Data')
    }
         
})
}


const   deleteSepecifedEntity = (identifier , entityType, id) => {
  return new Promise((resolve, reject) => {
    
   // let query = utility.queryGenerator(queryObj)
   let query = `DELETE FROM ${entityType}
   WHERE "${identifier}" = '${id}' ;`
   if(query !== '') {
      connection.pool.query(query, (error, results) => {
          if (error) {
            reject(error)
          }else{
            resolve(results)
          }
        })
    }
    else{
        reject('Error in fetching User Data')
    }
         
})
}

const   addBrand = (brandObject) => {
  return new Promise((resolve, reject) => {
   let query = `INSERT INTO brand(name) VALUES ('${brandObject.name}');`
    if(query !== '') {
      connection.pool.query(query, (error, results) => {
          if (error) {
            reject(error)
          }else{
            resolve(results)
          }
        })
    }
    else{
        reject('Error in adding brand data')
    }
         
})
}


const getSubCategoryForCategory = (itemTypesId) => { 
  return new Promise((resolve, reject) => {
    try {
      let queryObj = {
        type : 'Select',
        tableName : 'items',
        identifier : 'item_type_id',
        conditionParam : itemTypesId,
        operator : '='
      }
      let query = utility.queryGenerator(queryObj)
      if(query !== '') {
        connection.pool.query(query, (error, results) => {
            if (error) {
              reject(error)
            }else{
              resolve(results.rows)
            }
          })
      }
      else{
          reject('Error in fetching User Data')
      }
   
    }
    catch(err){
      reject(err)

    }
    
         
})
}


const addproductToDatabase = (productData) => { 
  return new Promise((resolve, reject) => {
    try {
      let query = `INSERT INTO products(
        name, item_type_id, item_id, state_id, zone_id, imageurl, isactive, brand_id)
        VALUES ('${productData.name}', '${productData.item_type_id}', '${productData.item_id}', '${productData.state_id}', '${productData.zone_id}', '${productData.imageurl}', 'true', '${productData.brand_id}');`
    
      if(query !== '') {
        connection.pool.query(query, (error, results) => {
            if (error) {
              reject(error)
            }else{
              resolve(results.rows)
            }
          })
      }
      else{
          reject('Error in fetching User Data')
      }
   
    }
    catch(err){
      reject(err)

    }
    
         
})
}

const addSubCategoryToDatabase = (subCategoeyData) => { 
  return new Promise((resolve, reject) => {
    try {
      let query = `INSERT INTO items(item_type_id,name, imageurl) VALUES ('${subCategoeyData.item_type_id}','${subCategoeyData.name}' ,'${subCategoeyData.imageurl}');`
    
      if(query !== '') {
        connection.pool.query(query, (error, results) => {
            if (error) {
              reject(error)
            }else{
              resolve(results.rows)
            }
          })
      }
      else{
          reject('Error in fetching User Data')
      }
   
    }
    catch(err){
      reject(err)

    }
    
         
})
}

const getProductForSubcategory = (productConfig) => { 
  return new Promise((resolve, reject) => {
    try {
      let query = `SELECT * FROM products WHERE "item_type_id" = '${productConfig.item_type_id}' and "item_id" = '${productConfig.item_id}' `
      if(query !== '') {
        connection.pool.query(query, (error, results) => {
            if (error) {
              reject(error)
            }else{
              resolve(results.rows)
            }
          })
      }
      else{
          reject('Error in fetching User Data')
      }   
    }
    catch(err){
      reject(err)
    }         
})
}



const getEntityForId = (tableName , identifier, value) => { 
  return new Promise((resolve, reject) => {
    try {
      let query = `SELECT * FROM ${tableName} WHERE "${identifier}" = '${value}'`
      if(query !== '') {
        connection.pool.query(query, (error, results) => {
            if (error) {
              reject(error)
            }else{
              resolve(results.rows)
            }
          })
      }
      else{
          reject('Error in fetching EntityData Data')
      }   
    }
    catch(err){
      reject(err)
    }         
})
}


const getOrderDetails = (param, value) => { 
  return new Promise((resolve, reject) => {
    try {
      let query = `SELECT * FROM "order" WHERE "${param}" = '${value}'`
      if(query !== '') {
        connection.pool.query(query, (error, results) => {
            if (error) {
              reject(error)
            }else{
              resolve(results.rows)
            }
          })
      }
      else{
          reject('Error in fetching User Data')
      }   
    }
    catch(err){
      reject(err)
    }         
})
}

const getAllprodForOrder = (value) => { 
  return new Promise((resolve, reject) => {
    try {
      let query = `SELECT * FROM order_item WHERE "user_id" = '${value}'`
      if(query !== '') {
        connection.pool.query(query, (error, results) => {
            if (error) {
              reject(error)
            }else{
              resolve(results.rows)
            }
          })
      }
      else{
          reject('Error in fetching User Data')
      }   
    }
    catch(err){
      reject(err)
    }         
})
}


const saveOrderDetails = (orderData) => { 
  return new Promise((resolve, reject) => {
    try {
      let query = `INSERT INTO "order"(
        order_number, user_id, status)
        VALUES ('${orderData.order_number}', '${orderData.user_id}', '${orderData.status}');`
      if(query !== '') {
        connection.pool.query(query, (error, results) => {
            if (error) {
              reject(error)
            }else{
              resolve(results.rows)
            }
          })
      }
      else{
          reject('Error in inserting order Data')
      }
   
    }
    catch(err){
      reject(err)

    }
    
         
})
}


const getSubGueryForSaveOrders = (productArray, order_id) => {
  let subString = `VALUES`
  
  productArray.forEach((prod, index) => {
    let conc = `('${order_id}', '${prod.user_id}', '${prod.product_id}', '${prod.product_name}', '${prod.product_image}', '${prod.quantity}', '${prod.status}')`
    if(index !== productArray.length -1 ){
      conc = conc + `,`
    }
    subString = subString + conc
  })

  return subString

}

const saveOrderedProductAdded = (productArray, order_id) => { 
  return new Promise((resolve, reject) => {
    try {

      let subQuery = getSubGueryForSaveOrders(productArray, order_id)
      let query = `INSERT INTO order_item(
        order_id, user_id, product_id, product_name, product_image, quantity, status)`+ subQuery
      if(query !== '') {
        connection.pool.query(query, (error, results) => {
            if (error) {
              reject(error)
            }else{
              resolve(results.rows)
            }
          })
      }
      else{
          reject('Error in inserting order product Data')
      }
   
    }
    catch(err){
      reject(err)

    }
    
         
})
}











module.exports = {
  getAllCategories,
  addCategoryToDatabase,
  getSubCategoryForCategory    ,
  addproductToDatabase,
  addSubCategoryToDatabase,
  getProductForSubcategory,
  getStateData,
  getBrandData,
  addBrand,
  getZoneData,
  getDataForent,
  getOrderDetails,
  saveOrderDetails,
  saveOrderedProductAdded,
  getAllprodForOrder,
  deleteSepecifedEntity,
  getEntityForId,
  getRoleData,
  UpdateSpecifiedEntityData


}