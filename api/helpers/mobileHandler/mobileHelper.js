
const userDb =  require('../db/user')
const multer = require('multer');
const global = require('../constants/constant')

const itemDb = require('../db/item')
const fs = require('fs')

var request = require('request');
const path = require('path')
const util = require('util');
const utilityHelper = require('../utils/utility')
const _ = require('lodash');
const config = require('../config.js');

var jwt = require('jsonwebtoken');


const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000)
}


const generateJWTForUser= (phonenumber) => {

    try{
        let token = jwt.sign({phonenumber: phonenumber},
            config.secret,
            { expiresIn: config.expiryTime
            }
          );
        return token
        }

    catch(err){
        throw err
    }

      
      
}


const handleLogin = async (userObj) => {
    try {
        
        
        let response = {}
        let roleid = await userDb.getDealerRoleId()
        let addUserForMobile = await userDb.addUserOnLoginForMobile(userObj, roleid)
        if(addUserForMobile){

            let phonenumber = userObj.phonenumber
            if(phonenumber.includes('+91')){
                phonenumber = userObj.phonenumber.slice(3, userObj.phonenumber.length)

            }
            let userFromDatabase = await userDb.getUserForMobile(phonenumber)
            let userInfoAdded =  await userDb.addUserMobileInfo(userObj)
            if (userFromDatabase && userFromDatabase.length > 0) {
            

                let authToken = await generateJWTForUser(userFromDatabase[0].phonenumber)
                

            userFromDatabase[0].token =  authToken
            response.message = userFromDatabase[0]
            response.statusCode = 200
        }
        else{
            
            response.message = {}
            response.statusCode = 400

        }
          
        }
        else{
            
            response.message = {}
            response.statusCode = 400

        }
        
        return response
    }
    catch (err) {
        let response = {
            message: err,
            statusCode: 500
        }
        return response

    }
}

;


const saveUserProfileImage = async (base64String, fullname) => {
    try{
let base64Image = base64String.split(';base64,').pop();


await fs.writeFile(`public/images/users/${fullname.trim()}.png`, base64Image, {encoding: 'base64'}, function(err) {
    console.log('File saved for user');
})

let imageUrl = `/images/users/${fullname}.png`
return imageUrl

}
catch(err)
{throw err
}
}

const saveUserProfile = async (userObj) => {
    try {
        let imagePathUrl = ''
        if(userObj.profilepicurl && userObj.profilepicurl.length > 0){
                
         imagePathUrl = await saveUserProfileImage(userObj.profilepicurl, userObj.fullname)
        }
        userObj.profilepicurl = imagePathUrl
        let userInfoAdded =  await userDb.saveUserProfileToDb(userObj)
        
        let response = {}
        if (userInfoAdded ) {
            
            
            let userFromDatabase = await userDb.getUserForMobile(userObj.phonenumber)
            if (userFromDatabase && userFromDatabase.length > 0) {
            

                response.message = userFromDatabase[0]
                response.statusCode = 200
            }
            else{
                
                response.message = {}
                response.statusCode = 400

            }
            }
            else{
                response.profile = userObj
                response.message = 'Error in saveinf user profile'
            

            }
          
        
        return response
    }
    catch (err) {
        let response = {
            message: err,
            statusCode: 500
        }
        return response

    }
}


const readData = (otpObject) => {
    return new Promise((resolve, reject) => {
        fs.readFile('file/otp.txt', function read(err, data) {
            if (err) {
                throw err;
            }
            const otpData = JSON.parse(data);
            otpData[otpObject.phonenumber] = otpObject.otp
            fs.writeFile("file/otp.txt", JSON.stringify(otpData), 'utf8', function (err) {
                if (err) {
                    console.log("An error occured while writing JSON Object to File.");
                    throw err                           
                }

console.log('dsffsffsdvsdcc', otpObject)
let url = `http://96.43.140.186/urlsms/index.php?uname=laxmi&pword=laxmi%40%23%24%25&mobile=${otpObject.phonenumber}&msg=Your%20otp%20is%20${otpObject.otp}%20for%20mobile%20app,%20kindly%20enter%20it%20for%20login.%20thank%20you%20-%20%20LRIPL!&sid=LRIPLC&unc=0&content_id=1707163039393297512`
console.log('url', url)
request(url, function (error, response, body) {


if (!error && response.statusCode == 200) {
      var info = JSON.parse(body)

      let responseObj = {
        serverStringResponse:body,
        serverHttpStatusCode:200
      }
      
      let response = {
        message: responseObj,
        statusCode: 200,
    }
console.log('this is response', response)
    resolve(response)
    }

            });

        
        });
      
           
  })
})}


const updateFile = (otpObject) => {
        fs.readFile('file/otp.txt', function read(err, data) {
            if (err) {
                throw err;
            }
            const otpData = JSON.parse(data);
            delete otpData[otpObject.phonenumber]
            fs.writeFile("file/otp.txt", JSON.stringify(otpData), 'utf8', function (err) {
                if (err) {
                    console.log("An error occured while writing JSON Object to File.");
                    throw err
                }
            
                console.log("JSON file has been saved.");
                


    

            });

        
        });
      
           
  }

const checkOtp = (otpObject) => {
    return new Promise((resolve, reject) => {
        fs.readFile('file/otp.txt', function read(err, data) {
            if (err) {
                throw err;
            }
            let message = '',
                sCode = 200
            const otpData = JSON.parse(data);
            if(otpData[otpObject.phonenumber] !== undefined){
                if(otpData[otpObject.phonenumber].toString() !== otpObject.otp){
                    message = 'OTP does not match'
                    sCode = 404
                }
                else{
                    message = 'Your OTP verified successfully'
                    updateFile(otpObject)
                }
            }
            else{
                message = 'OTP does not match'
                sCode = 404
            }
            let respObj = {
                serverStringResponse: message,
                serverHttpStatusCode: sCode
              }
              
      let response = {
        message: respObj,
        statusCode: 200,
    }
            

    resolve(response)
    

            });

        
        });
      
           
  }


const getOtp = async (otpObj) => {
    try {
        let otp
        if(otpObj)
        {
            otp = generateOtp()
        }
        let otpObject = {
            phonenumber : otpObj.phonenumber.slice(3, otpObj.phonenumber.length  ),
            otp : otp
        }

        var response = await readData(otpObject)
        
            
return response

        
    }
    catch (err) {
        let response = {
            message: err,
            statusCode: 500
        }
        return response

    }
}



const verifyOtp = async (otpObj) => {
    try {
        
        let otpObject = {
            phonenumber : otpObj.phonenumber.slice(3, otpObj.phonenumber.length  ),
            otp : otpObj.otp
        }
        
        var response = await checkOtp(otpObject)
            
return response

        
    }
    catch (err) {
        let response = {
            message: err,
            statusCode: 500
        }
        return response

    }
}

const formatZoneData = (zoneData, stateData) => {

    zoneData.forEach(zone => {
        let statesList =  _.filter(stateData, function(e){ return e.zone_id === zone.zone_id; });
        zone.statesList = statesList
    });
    return zoneData

}

const getZoneData = async () => {
    let successResponse = global.get.successResponse,
    errorResponse = global.get.errorResponse
try {
    let zoneData = [],
        stateData = []
        formedZoneData = []
        zoneData = await itemDb.getZoneData()
    
    stateData = await itemDb.getStateData()
    formedZoneData = formatZoneData(zoneData, stateData)
          
    if (formedZoneData) {
        let sortedData = formedZoneData.sort(utilityHelper.compare)
    successResponse.data = sortedData

        return successResponse
    }
}
catch (err) {

    errorResponse.message = err
    throw errorResponse

}
}







module.exports = {
    getOtp,
    verifyOtp,
    getZoneData,
    handleLogin,
    saveUserProfile
}