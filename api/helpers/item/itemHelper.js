
const itemDb = require('../db/item')
const multer = require('multer');
const global = require('../constants/constant')
const sharp = require('sharp')

const fs = require('fs')
const util = require('util');
const utilityHelper = require('../utils/utility')


var path = require('path');


var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let type = req.query && req.query.type,
        imageStorePath = ""
        if(type){
            imageStorePath = global.imageUpoadPath+ '/' +  global.imagePathMapforEdit[type]
     
        }
        else{
     imageStorePath = global.imageUpoadPath+ '/' +  global.imagePathMap[req.path]
        }  
     cb(null, imageStorePath)
    },
    filename: function (req, file, cb) {
        file.originalname = req.body.name.replace(/ /g, "_");
        cb(null, file.originalname)
    }
})

var upload = multer({
    storage: storage,
    limits: { fieldSize: 25 * 1024 * 1024 }
}

).fields([{ name: 'file', maxCount: 1 }])


// Convert fs.readFile into Promise version of same    
//const readFile = util.promisify(fs.readFile);





const imageUpoad = (req, res) => {
    try{
        return new Promise((resolve, reject) => {
        
            upload(req, res, function (err) {
                if (err) {
                    reject(err)
                }
                let reqBody = req.body,
                reqFile = req.files && req.files.file && req.files.file[0]
                var object = {
                    name: '',
                    imageurl: ''
                }               
                reqBody.name ? object.name = reqBody.name : ''
                if(req.query && req.query.type){
                    reqFile && reqFile.originalname &&  reqBody.name ? object.imageurl= 'images/'+ global.imagePathMapforEdit[req.query.type] +'/' + reqBody.name + '.jpeg' : ''
                
                }
                else{
                    reqFile && reqFile.originalname && reqBody.name ? object.imageurl= 'images/'+ global.imagePathMap[req.path] +'/' + reqBody.name + '.jpeg' : ''
                
                }

                utilityHelper.compressAndSaveThumb(object.imageurl)
    
                
      
      
                reqBody.item_type_id ? object.item_type_id = reqBody.item_type_id : ''
                reqBody.zoneId ? object.zone_id = reqBody.zoneId : ''
                reqBody.stateId ? object.state_id = reqBody.stateId : ''
                reqBody.brandId ? object.brand_id = reqBody.brandId : ''
                reqBody.item_id ? object.item_id = reqBody.item_id : ''
                reqBody.description ? object.description = reqBody.description : ''
                reqBody.price ? object.price = reqBody.price : ''   
                reqBody.id ? object.id = reqBody.id : ''
                resolve(object)

        
       
        })

    })
    
 
}

catch(e){
    throw e;
}

}




const addCategory = async (req, res) => {
    let successResponse = global.post.successResponse,
        errorResponse = global.post.errorResponse
    try {
        let imgUpResp = await imageUpoad(req, res)
        let responseFromDb = await itemDb.addCategoryToDatabase(imgUpResp)
        successResponse.message = 'Category Added Successfully'
        if (responseFromDb) {
            return successResponse
        }
    }
    catch (err) {
        errorResponse.message = err
        return errorResponse
    }
}

const addSubCategory = async (req, res) => {
    let successResponse = global.post.successResponse,
        errorResponse = global.post.errorResponse
    try {
        let imgUpResp = await imageUpoad(req, res)
        let responseFromDb = await itemDb.addSubCategoryToDatabase(imgUpResp)
        successResponse.message = 'Sub Category Added Successfully'
        if (responseFromDb) {
            return successResponse
        }
    }
    catch (err) {
        errorResponse.message = eru
        throw errorResponse
    }
}

const addProduct = async (req, res) => {
    let successResponse = global.post.successResponse,
        errorResponse = global.post.errorResponse
    try {
        let imgUpResp = await imageUpoad(req, res)
        let responseFromDb = await itemDb.addproductToDatabase(imgUpResp)
        successResponse.message = 'Product Added Successfully'
        if (responseFromDb) {
            return successResponse
        }
    }
    catch (err) {
        
        errorResponse.message = utilityHelper.createErrorResponse(err)
        //errorResponse.message = err
        throw errorResponse
    }
}

const addBrand = async (brandData) => {
    let successResponse = global.post.successResponse,
        errorResponse = global.post.errorResponse
    try {
        let responseFromDb = await itemDb.addBrand(brandData)
        successResponse.message = 'Brand Added Successfully'
        if (responseFromDb) {
            return successResponse
        }
    }
    catch (err) {
        
        errorResponse.message = utilityHelper.createErrorResponse(err)
        //errorResponse.message = err
        throw errorResponse
    }
}

const getDataForSpecifiedEntity = async (req, res, entity) => {
    let successResponse = global.get.successResponse,
        errorResponse = global.get.errorResponse
    try {
        let dataFromDb = []
        switch(entity) {
            case 'Category':
                dataFromDb = await itemDb.getAllCategories()
              break;
            case 'subCategory':  
                let itemTypesId = req.query && req.query.item_type_id              
            dataFromDb = await itemDb.getSubCategoryForCategory(itemTypesId)
              break;
            case 'Product': 
            let productConfig = {
                 item_type_id : req.query && req.query.item_type_id ,
                 item_id : req.query && req.query.item_id         
               
            }  
            dataFromDb = await itemDb.getProductForSubcategory(productConfig)
            
               break;
            default:
              // code block
          }
        if (dataFromDb) {
        }
        successResponse.data = dataFromDb
        if (dataFromDb) {

            return successResponse
        }
    }
    catch (err) {

        errorResponse.message = err
        return errorResponse

    }
}


const putEntityData = async (req, res, type) => {
    let successResponse = global.get.successResponse,
        errorResponse = global.get.errorResponse
    try {
        let entity = type,
            imgUpResp
           // putData = entityData.entityData
        switch(entity) {
            case 'Category':
                imgUpResp = await imageUpoad(req, res)
                await itemDb.UpdateSpecifiedEntityData('types', 'item_type_id', imgUpResp )
                successResponse.message = 'Category Updateds Successfully'
            break;
            case 'subCategory':  
                imgUpResp = await imageUpoad(req, res)
                await itemDb.UpdateSpecifiedEntityData('items', 'item_id', imgUpResp )
                successResponse.message = 'Sub Category Updated Successfully'
        
              break;
            case 'Product':  
            imgUpResp = await imageUpoad(req, res)
                await itemDb.UpdateSpecifiedEntityData('products', 'product_id', imgUpResp )
                successResponse.message = 'Product Updated Successfully'
               break;
            default:
              // code block
          }
        
            return successResponse
        
    }
    catch (err) {

        errorResponse.message = err
        return errorResponse

    }
}


const getAllImagePathToDelete = async (id , entity) => {
    try {
        let dataFromDb = []
        switch(entity) {
            case 'Category':
                dataFromDb =  dataFromDb.concat(await itemDb.getEntityForId('types', 'item_type_id', id))
                dataFromDb =   dataFromDb.concat(await itemDb.getEntityForId('items', 'item_type_id', id))
                dataFromDb =   dataFromDb.concat(await itemDb.getEntityForId('products', 'item_type_id', id))
              break;
            case 'subCategory':  
            dataFromDb = dataFromDb.concat(await itemDb.getEntityForId('items', 'item_id', id))
            dataFromDb = dataFromDb.concat(await itemDb.getEntityForId('products', 'item_id', id))
           break;
            case 'Product': 
            dataFromDb = dataFromDb.concat(await itemDb.getEntityForId('products', 'product_id', id))
              break;
            default:
              // code block
          }
        

            return dataFromDb
        
    }
    catch (err) {

        errorResponse.message = err
        return errorResponse

    }
}

const deleteImageFromPath = async (imagesPathFull) => {
    try {
        if(imagesPathFull){
            imagesPathFull.forEach((el ,index) => {
                if(el.imageurl){
                    
 
// delete file named 'sample.txt' Synchronously
let varIf = fs.existsSync(el.imageurl)

if(varIf){
    
    fs.unlinkSync(el.imageurl);
    console.log('File deleted!', index);

}

}
                
            })

        }
    }
    catch (err) {

        errorResponse.message = err
        return errorResponse

    }
}


const deleteEntity = async (req, res) => {
    let successResponse = global.get.successResponse,
        errorResponse = global.get.errorResponse
    try {
        let entity = req.body.entityType,
            id = req.body.entityId
            imagessTodelfullPayload = []

        switch(entity) {
            case 'Category':
                imagessTodelfullPayload = await getAllImagePathToDelete(id , entity)
                if(imagessTodelfullPayload && imagessTodelfullPayload.length > 0){
                    
                deleteImageFromPath(imagessTodelfullPayload)

                }
                await itemDb.deleteSepecifedEntity('item_type_id' , 'products', id)
                await itemDb.deleteSepecifedEntity('item_type_id' , 'items', id)
                await itemDb.deleteSepecifedEntity('item_type_id' , 'types', id)
                break;
            case 'subCategory':
                imagessTodelfullPayload = await getAllImagePathToDelete(id , entity)
                if(imagessTodelfullPayload && imagessTodelfullPayload.length > 0){
                    
                deleteImageFromPath(imagessTodelfullPayload)

                }await itemDb.deleteSepecifedEntity('item_id' , 'products', id)
                await itemDb.deleteSepecifedEntity('item_id' , 'items', id)
            break;
            case 'Product':
                
                imagessTodelfullPayload = await getAllImagePathToDelete(id , entity)
                if(imagessTodelfullPayload && imagessTodelfullPayload.length > 0){
                    
                deleteImageFromPath(imagessTodelfullPayload)

                }
                await itemDb.deleteSepecifedEntity('product_id' , 'products', id)
            break;
            default:
              // code block
          }


          successResponse.message = `${entity} deleted`

            return successResponse
        
    }
    catch (err) {

        errorResponse.message = err
        return errorResponse

    }
}


const getStateData = async () => {
    let successResponse = global.get.successResponse,
    errorResponse = global.get.errorResponse
try {
    let dataFromDb = []
        dataFromDb = await itemDb.getStateData()
          
    if (dataFromDb) {
        let sortedData = dataFromDb.sort(utilityHelper.compare)
    successResponse.data = sortedData

        return successResponse
    }
}
catch (err) {

    errorResponse.message = err
    return errorResponse

}
}

const getBrandData = async () => {
    let successResponse = global.get.successResponse,
    errorResponse = global.get.errorResponse
try {
    let dataFromDb = []
        dataFromDb = await itemDb.getBrandData()
          
    if (dataFromDb) {
        let sortedData = dataFromDb.sort(utilityHelper.compare)
    successResponse.data = sortedData

        return successResponse
    }
}
catch (err) {

    errorResponse.message = err
    return errorResponse

}
}

module.exports = {
    addCategory,
    getDataForSpecifiedEntity,
    addSubCategory,
    addProduct,
    getStateData,
    addBrand,
    deleteEntity,
    getBrandData,
    putEntityData


}