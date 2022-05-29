'use strict';

const util = require('util');
//import getUsers from '../helpers/connection'


const connection  = require('../helpers/db/connection')
const mitemHelper = require('../helpers/item/mitemHelper')
const multer = require('multer');
const global = require('../helpers/constants/constant')

module.exports = {
  getCategories,
  saveOrdersDetails,
  getorders,
  updateOrdersDetails
};


  async function getCategories(req, res) {
    try {
        var response = await mitemHelper.getAllData(req, res)
        if(response){          
          return res.status(response.statusCode).send(response.data)
        }     
    } catch(err) {      
      let errorResponse = global.post.errorResponse
      errorResponse.message = err
      return res.status(errorResponse.statusCode).send(errorResponse.message)
    }
  }



  async function getorders(req, res) {
    try {
      let user_id = req.query.user_id
        var response = await mitemHelper.getAllOrders(user_id)
        if(response){          
          return res.status(response.statusCode).send(response.data)
        }     
    } catch(err) {      
      let errorResponse = err
      return res.status(errorResponse.statusCode).send(errorResponse.message)
    }
  }






  async function saveOrdersDetails(req, res) {
    try {
      let orderBody =  req.body
      if(orderBody !== undefined){
        var response = await mitemHelper.saveOrderDetails(orderBody)
        if(response){
       return res.status(response.statusCode).send(response.message)
        }
      }      
    } catch(err) {      
      let errorResponse = err
      return res.status(errorResponse.statusCode).send(errorResponse.message)
    }
  }

  async function updateOrdersDetails(req, res) {
    try {
      let orderBody =  req.body
      if(orderBody !== undefined){
        var response = await mitemHelper.updateOrderDetails(orderBody)
        if(response){
       return res.status(response.statusCode).send(response.message)
        }
      }      
    } catch(err) {      
      let errorResponse = err
      return res.status(errorResponse.statusCode).send(errorResponse.message)
    }
  }



  
 




  