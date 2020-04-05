

const itemDb = require('../db/item')
const multer = require('multer');
const global = require('../constants/constant')

const fs = require('fs')
const path = require('path')
const util = require('util');
const utilityHelper = require('../utils/utility')
const _ = require('lodash')


const filterData = (data, id, operator) => {
    let dataOfId = _.filter(data, function(row) {
        return row[operator] === id 
    });
    return dataOfId
}


const formatDatainShape = (categoryData, subCategoryData, productData) =>{
 
if(categoryData){
    categoryData.forEach(element => {
        
        if(element.item_type_id){

            let dataOfSubCategory = filterData(subCategoryData, element.item_type_id, 'item_type_id')
            let dataOfProducts = filterData(productData, element.item_type_id, 'item_type_id')
            element.itemslist = dataOfSubCategory
            element.productsList = dataOfProducts



        }
    });
}

return categoryData

}

const formatBaradData = (brandData, productData) => {

    if(productData){
        productData.forEach(element => {
            if(element.brand_id){
                var arrayOfNames = []
                var arrayOfBrands = element.brand_id.trim().split(',')
                arrayOfBrands.forEach(brand_id => {
                   let data = filterData(brandData, brand_id, 'brand_id')
                   arrayOfNames.push(data[0].name)

                })
            }
            element.brandName = arrayOfNames
            delete brand_id
        })
    }

    return productData

}


const getAllData = async () => {
    let successResponse = global.get.successResponse,
    errorResponse = global.get.errorResponse
try {
    let cayegoryData = [],
    subCategoryData = [],
    productData = []
    cayegoryData = await itemDb.getAllCategories()
    subCategoryData = await itemDb.getDataForent('items')
    productData = await itemDb.getDataForent('products')
    brandData = await itemDb.getBrandData()

    let formattedBrandDat = formatBaradData(brandData, productData)

    let formattedData = formatDatainShape(cayegoryData, subCategoryData, formattedBrandDat, brandData)
          
    if (formattedData) {
    successResponse.data = formattedData
        return successResponse
    }
}
catch (err) {

    errorResponse.message = err
    return errorResponse

}
}

const formatOrderResponse = (orderData, productData) =>{
 
    if(orderData){
        orderData.forEach(order => {
            
            if(order.order_id){
    
                let dataOfSubCategory = filterData(productData, order.order_id, 'order_id')
                order.orderItemObjs = dataOfSubCategory
    
    
    
            }
        });
    }
    
    return orderData
    
    }


const getAllOrders = async (user_id) => {
    let successResponse = global.get.successResponse,
    errorResponse = global.get.errorResponse
try {
    let orderData = []
        productData = []
        formattedData = []
    // prody = [],
    // productData = []
    orderData =  await itemDb.getOrderDetails('user_id' , user_id)
    productData = await itemDb.getAllprodForOrder(user_id)
    formattedData = formatOrderResponse(orderData, productData)

     
    if (formattedData) {
    successResponse.data = formattedData
        return successResponse
    }
}
catch (err) {

    errorResponse.message = err
    return errorResponse

}
}


const getFormttedDataForOrder= (orderDetails) => {
    let orderData = {}
    let order_number = `LX-${Math.floor(100000 + Math.random() * 900000)}`
    orderData.user_id = orderDetails.user_id
    orderData.status = orderDetails.status
    orderData.order_number = order_number
    return orderData
}



const saveOrderDetails = async (orderDetails) => {
    let successResponse = global.post.successResponse,
        errorResponse = global.post.errorResponse
    try {
            let orderData = getFormttedDataForOrder(orderDetails.Order)
            await itemDb.saveOrderDetails(orderData)
            let orderDataFromDb =  await itemDb.getOrderDetails('order_number' , orderData.order_number)
            await itemDb.saveOrderedProductAdded(orderDetails.Order.orderItemObjs , orderDataFromDb[0].order_id)
            let respObj = {
                serverStringResponse: 'Your enquiry is saved sucscessfully.',
                serverHttpStatusCode: 200
            }
            successResponse.message = respObj
         
                return successResponse
         
    }
    catch (err) {
        
        errorResponse.message = utilityHelper.createErrorResponse(err)
        //errorResponse.message = err
        throw errorResponse
    }
}



module.exports = {
    getAllData,
    saveOrderDetails,
    getAllOrders


}