'use strict';

var util = require('util');
//import getUsers from '../helpers/connection'
var connection  = require('../helpers/db/connection')
var userHelper = require('../helpers/user/userHelper')


module.exports = {
  handleLogin,
  addUser,
  getUsers,
  getUserInfo,
  updateUser,
  deleteUser
};


async function handleLogin(req, res) {
  try {
    let userInfo =  req.body
    if(userInfo !== undefined){
      var response = await userHelper.handleLogin(userInfo)
     
      if(response){
        return res.status(response.statusCode).json(response.message)
      }
    }  
  } catch(errorResponse) {
    return res.status(errorResponse.statusCode).send(errorResponse.message)
  }}

  async function getUserInfo(req, res) {
    try {
        var response = await userHelper.getUserInfo(req, res)
       
        if(response){
          return res.status(response.statusCode).send(response.message)
        
      }  
    } catch(errorResponse) {
      return res.status(errorResponse.statusCode).send(errorResponse.message)
  }}
  
  
async function addUser(req, res) {
  try {
    var response = await userHelper.addUser(req, res)
    if(response){          
      return res.status(response.statusCode).send(response.message)
    }     
} catch(err) {      
  let errorResponse = global.post.errorResponse
  errorResponse.message = err
  return res.status(errorResponse.statusCode).send(errorResponse.message)
}
}
    

async function getUsers(req, res) {
  try {
      var response = await userHelper.getUsers(req, res)
      if(response){          
        return res.status(response.statusCode).send(response.data)
      }     
  } catch(err) {      
    return res.status(err.statusCode).send(err.message)
  }
}

async function updateUser(req, res) {
  try {
    let userData =  req.body
    if(userData !== undefined){
      var response = await userHelper.putEntityData(req, res)
      if(response){          
        return res.status(response.statusCode).send(response.message)
      }     
  }} catch(errorResponse) {      
    let error ={
      message : errorResponse.message
    }
    return res.status(errorResponse.statusCode).send(error)
  }}

  async function deleteUser(req, res) {
    try {
        var response = await userHelper.deleteUser(req, res)
        if(response){          
          return res.status(response.statusCode).send(response.message)
        }     
    } catch(err) {      
      let errorResponse = global.post.errorResponse
      errorResponse.message = err
      return res.status(errorResponse.statusCode).send(errorResponse.message)
    }
  }


  