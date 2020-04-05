'use strict';

const util = require('util');
//import getUsers from '../helpers/connection'


const connection  = require('../helpers/db/connection')
const itemHelper = require('../helpers/item/itemHelper')
const multer = require('multer');
const global = require('../helpers/constants/constant')

module.exports = {
  addCategory,
  getAllCategories,
  addSubCategory,
  addProduct,
  getSubCategory,
  getProduct,
  getStateData,
  getBrandData,
  addBrand,
  deleteEntity,
  putEntityData,
  editProduct


  
};


async function deleteEntity(req, res) {
  try {
      var response = await itemHelper.deleteEntity(req, res)
      if(response){          
        return res.status(response.statusCode).send(response.message)
      }     
  } catch(err) {      
    let errorResponse = global.post.errorResponse
    errorResponse.message = err
    return res.status(errorResponse.statusCode).send(errorResponse.message)
  }
}

  async function addCategory(req, res) {
    try {
        var response = await itemHelper.addCategory(req, res)
        if(response){          
          return res.status(response.statusCode).send(response.message)
        }     
    } catch(err) {      
      let errorResponse = global.post.errorResponse
      errorResponse.message = err
      return res.status(errorResponse.statusCode).send(errorResponse.message)
    }
  }

  async function addSubCategory(req, res) {
    try {
        var response = await itemHelper.addSubCategory(req, res)
        if(response){          
          return res.status(response.statusCode).send(response.message)
        }     
    } catch(err) {      
      let errorResponse = global.post.errorResponse
      errorResponse.message = err
      return res.status(errorResponse.statusCode).send(errorResponse.message)
    }
  }

  async function addProduct(req, res) {
    try {
        var response = await itemHelper.addProduct(req, res)
        if(response){          
          return res.status(response.statusCode).send(response.message)
        }     
    } catch(errorResponse) {      
      let error ={
        message : errorResponse.message
      }
      return res.status(errorResponse.statusCode).send(error)
    }
  }

  async function addBrand(req, res) {
    try {
      let brandData =  req.body
      if(brandData !== undefined){
        var response = await itemHelper.addBrand(brandData)
        if(response){          
          return res.status(response.statusCode).send(response.message)
        }     
    }} catch(errorResponse) {      
      let error ={
        message : errorResponse.message
      }
      return res.status(errorResponse.statusCode).send(error)
    }}




async function putEntityData(req, res) {
  try {
    let entityData =  req.body,
    type = req.query.type
    if(entityData !== undefined){
      var response = await itemHelper.putEntityData(req, res, type)
      if(response){          
        return res.status(response.statusCode).send(response.message)
      }     
  }} catch(errorResponse) {      
    let error ={
      message : errorResponse.message
    }
    return res.status(errorResponse.statusCode).send(error)
  }}

  async function editProduct(req, res) {
    try {
      let entityData =  req.body
      if(entityData !== undefined){
        var response = await itemHelper.putEntityData(req, res, 'Product')
        if(response){          
          return res.status(response.statusCode).send(response.message)
        }     
    }} catch(errorResponse) {      
      let error ={
        message : errorResponse.message
      }
      return res.status(errorResponse.statusCode).send(error)
    }}
  
  
  async function getBrandData(req, res) {
    try {
        var response = await itemHelper.getBrandData(req, res, 'Category')
        if(response){          
          return res.status(response.statusCode).send(response.data)
        }     
    } catch(err) {      
      let errorResponse = global.post.errorResponse
      errorResponse.message = err
      return res.status(errorResponse.statusCode).send(errorResponse.message)
    }
  }

  
  async function getStateData(req, res) {
    try {
        var response = await itemHelper.getStateData(req, res, 'Category')
        if(response){          
          return res.status(response.statusCode).send(response.data)
        }     
    } catch(err) {      
      let errorResponse = global.post.errorResponse
      errorResponse.message = err
      return res.status(errorResponse.statusCode).send(errorResponse.message)
    }
  }

  async function getAllCategories(req, res) {
    try {
        var response = await itemHelper.getDataForSpecifiedEntity(req, res, 'Category')
        if(response){          
          return res.status(response.statusCode).send(response.data)
        }     
    } catch(err) {      
      let errorResponse = global.post.errorResponse
      errorResponse.message = err
      return res.status(errorResponse.statusCode).send(errorResponse.message)
    }
  }
 
  async function getSubCategory(req, res) {
    try {
        var response = await itemHelper.getDataForSpecifiedEntity(req, res, 'subCategory')
        if(response){          
          return res.status(response.statusCode).send(response.data)
        }     
    } catch(err) {      
      let errorResponse = global.post.errorResponse
      errorResponse.message = err
      return res.status(errorResponse.statusCode).send(errorResponse.message)
    }
  }

  async function getProduct(req, res) {
    try {
        var response = await itemHelper.getDataForSpecifiedEntity(req, res, 'Product')
        if(response){          
          return res.status(response.statusCode).send(response.data)
        }     
    } catch(err) {      
      let errorResponse = global.post.errorResponse
      errorResponse.message = err
      return res.status(errorResponse.statusCode).send(errorResponse.message)
    }
  }



  