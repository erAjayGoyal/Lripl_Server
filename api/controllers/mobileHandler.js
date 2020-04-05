'use strict';

var util = require('util');
//import getUsers from '../helpers/connection'
var connection  = require('../helpers/db/connection')
var mobileHelper = require('../helpers/mobileHandler/mobileHelper')


const global = require('../helpers/constants/constant')
module.exports = {
  getOtp,
  verifyOtp,
  getAllZoneState,
  resendOtp,
  handleMobileLogin,
  saveProfileInfo
};




async function handleMobileLogin(req, res) {
  try {
    let userInfo =  req.body
    if(userInfo !== undefined){
      var response = await mobileHelper.handleLogin(userInfo)
      if(response){
     return res.status(response.statusCode).send(response.message)
      }
    }  
  } catch(err) {
    let errResp = {
      message : err,
      statusCode : 500
    }  
     return res.status(errResp.statusCode).send(errResp.message)
   
  }}

  async function saveProfileInfo(req, res) {
    try {
      let userInfo =  req.body
      if(userInfo !== undefined){
        var response = await mobileHelper.saveUserProfile(userInfo)
        if(response){
       return res.status(response.statusCode).send(response.message)
        }
      }  
    } catch(err) {
      let errResp = {
        message : err,
        statusCode : 500
      }  
       return res.status(errResp.statusCode).send(errResp.message)
     
    }}


async function getOtp(req, res) {
  try {
    let otpInfo =  req.body
    if(otpInfo !== undefined){
      var response = await mobileHelper.getOtp(otpInfo)
      if(response){
        return res.status(response.statusCode).send(response.message)
      }     
      
    }  
  } catch(err) {
    let errorResponse = global.post.errorResponse
    errorResponse.message = err
    return res.status(errorResponse.statusCode).send(errorResponse.message)
     
  }}


  async function resendOtp(req, res) {
    try {
      let otpInfo =  req.body
      if(otpInfo !== undefined){
        var response = await mobileHelper.getOtp(otpInfo)
        if(response){
          
          return res.status(response.statusCode).send(response.message)
        }     
        
      }  
    } catch(err) {
      let errorResponse = global.post.errorResponse
      errorResponse.message = err
      return res.status(errorResponse.statusCode).send(errorResponse.message)
       
    }}

  
async function verifyOtp(req, res) {
  try {
    let otpInfo =  req.body
    if(otpInfo !== undefined){
      var response = await mobileHelper.verifyOtp(otpInfo)
      if(response){
        
        return res.status(response.statusCode).send(response.message)
      }     
      
    }  
  } catch(err) {
    let errorResponse = global.post.errorResponse
    errorResponse.message = err
    return res.status(errorResponse.statusCode).send(errorResponse.message)
     
  }}

  
  async function getAllZoneState(req, res) {
    try {
        var response = await mobileHelper.getZoneData(req, res)
        if(response){          
          return res.status(response.statusCode).send(response.data)
        }     
    } catch(err) {      
      let errorResponse = global.post.errorResponse
      errorResponse.message = err
      return res.status(errorResponse.statusCode).send(errorResponse.message)
    }
  }