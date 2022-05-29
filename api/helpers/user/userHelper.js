
const userDb =  require('../db/user')
const itemDb = require('../db/item')
const multer = require('multer');
const global = require('../constants/constant')

const fs = require('fs')
const path = require('path')
const util = require('util');
const utilityHelper = require('../utils/utility')
const _ = require('lodash')
// require the bcrypt module
var bcrypt = require('bcrypt')
var jwt = require('jsonwebtoken');
const config = require('../config.js');




const generateJWTForUser= (username) => {

    try{
        let token = jwt.sign({username: username},
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
    let successResponse = global.post.successResponse,
    errorResponse = global.post.errorResponse
    try {

        
      
       let userFromDatabase = await userDb.getSpecificUserInfo(userObj.userName),
            response={}
        if (userFromDatabase && userFromDatabase.length > 0) {
            let recivedUser = userFromDatabase[0],
                verificationPass = false,
                authtoken = ''
            if (recivedUser.password && recivedUser.isactive){
                verificationPass = comparePassword(recivedUser.password, userObj.password)
                
                //vertificationPass = true
            }
            if(verificationPass){
                console.log('this is aall', verificationPass)

                authToken = await generateJWTForUser(recivedUser.username)
                successResponse.message = {
                    success: true,
                    message: 'Authentication successful!',
                    token: authToken
                  }

                  console.log('this is aall successResponse', successResponse)

                  response= successResponse
                

            }
            else{
                errorResponse.message = {
                    success: false,
                    message: 'Incorrect username or password'
                  }
                  errorResponse.statusCode = 403
                  
              response= errorResponse
                }

                
        }
        else{
            errorResponse.message = {
                success: false,
                message: 'Incorrect username or password'
              }
              errorResponse.statusCode = 403
              response= errorResponse
            }

        return response
       
    }
    catch (err) {
     
            errorResponse.message = err
            throw errorResponse
        

    }
}

const getUserInfo = async (req, res) => {
    let successResponse = global.post.successResponse,
    errorResponse = global.post.errorResponse
    try {
        let usernameFromToken = req.decoded.username,
            usernameFromReq = req.query.username,
            isUserVerifed = usernameFromToken === usernameFromReq
            response = {
                message: 'Auth Fail',
                userInfo: {},
                roles: [],
                status : [],
                statusCode: 200
            }
        if(isUserVerifed){
           console.log('dddd', isUserVerifed)
        
                let userFromDatabase = await userDb.getSpecificUserInfo(usernameFromReq)
                
              
           console.log('userFromDatabase', userFromDatabase)
                
                 if (userFromDatabase && userFromDatabase.length > 0) {
                    let recivedUser = userFromDatabase[0]
                    let roleFromDataBase = await userDb.getRoleData()
                    if(userFromDatabase[0].roleid){
                        UsersDataFromDb = changeRoleIdToRoleName(userFromDatabase , roleFromDataBase)
    
                    }
                        
                    // if (userFromDatabase) {
                    //     var promisedData = []
            
                    //         if (userFromDatabase && userFromDatabase[0].profilepicurl) {
                    //             promisedData.push(utilityHelper.imageReaderAsync(userFromDatabase[0].profilepicurl))
                    //         }
                        
                    //     let data = await Promise.all(promisedData.map(
                    //         (catg, index) => catg.then(catgInfo => {
                    //             userFromDatabase[0].profilepicurl = utilityHelper.converTimageToBase64(userFromDatabase[0].profilepicurl, catgInfo)
                    //         }).catch(e => 
                                
                    //             userFromDatabase[0].profilepicurl
                    //             )))
                    // }
        
                        response.message = 'Auth Pass'
                        response.userInfo = userFromDatabase
                        response.roles = roleFromDataBase
                    
                  
                }
                
            }
console.log('response', response)
            successResponse.message = response
            return successResponse
           
        }
        catch (err) {
            
           console.log('err', err)
                
            errorResponse.message = err
            throw errorResponse
    
        }
            
}




var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let imageStorePath = global.imageUpoadPath+ '/' +  global.imagePathMap[req.path]
        cb(null, imageStorePath)
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})

var upload = multer({
    storage: storage,
    limits: { fieldSize: 25 * 1024 * 1024 }
}

).fields([{ name: 'file', maxCount: 1 }])


const encryptPassword = (password) => {

    try{
        
    
let salt = bcrypt.genSaltSync(10),
hash = bcrypt.hashSync(password, salt)
return hash 

    }
catch(err){
    throw err

}

}
const comparePassword = (hash, password) => {

    try{
        
    
       return bcrypt.compareSync(password, hash); 

    }
catch(err){
    throw err

}

}


const imageUpoad = (req, res) => {
    return new Promise((resolve, reject) => {
        upload(req, res, function (err) {
            if (err) {
                reject(err)
            }
            let reqBody = req.body,
            reqFile = req.files && req.files.file && req.files.file[0]
            var object = {
                fullName: '',
                profilePic: ''
            }               
            reqBody.fullName ? object.fullName = reqBody.fullName : ''
            reqFile && reqFile.originalname  ? object.profilePic= 'images/'+ global.imagePathMap[req.path] +'/' + reqFile.originalname : ''
            
            reqBody.userId ? object.userId = reqBody.userId : ''
            reqBody.passWord && reqBody.passWord.length > 0 ? object.passWord = encryptPassword(reqBody.passWord) : ''
            reqBody.role ? object.roleId = reqBody.role : ''
            reqBody.status === 'Active' ? object.status = true  : object.status = false
            reqBody.userIdentifier ? object.id = reqBody.userIdentifier : ''
            reqBody.id ? object.id = reqBody.id : ''

            utilityHelper.compressAndSaveThumb(object.profilePic);
            resolve(object)
        })
     })
}

const addUser = async (req, res) => {
    let successResponse = global.post.successResponse,
        errorResponse = global.post.errorResponse
    try {
        let imgUpResp = await imageUpoad(req, res)
        let responseFromDb = await userDb.addUserToDataBase(imgUpResp)
        successResponse.message = 'User Added Successfully'
        if (responseFromDb) {
            return successResponse
        }
    }
    catch (err) {
        errorResponse.message = err
        return errorResponse
    }
}
const changeRoleIdToRoleName = (userData, roleData) => {
    userData.forEach(user => {
        if(user.roleid){
            var roleDataForRoleId =  _.findIndex(roleData, function(o) { return o.roleid == user.roleid; });
            user.roleName = roleData[roleDataForRoleId].name
        }
        
    });
    return userData
}


const getUsers = async () => {
    let successResponse = global.get.successResponse,
    errorResponse = global.get.errorResponse
try {
    let UsersDataFromDb = [],
        roleDataFromDb = []
    UsersDataFromDb = await userDb.getUsers()
    roleDataFromDb = await itemDb.getRoleData()
    if (UsersDataFromDb && UsersDataFromDb.length > 0 ) {
        UsersDataFromDb = changeRoleIdToRoleName(UsersDataFromDb , roleDataFromDb)
    }
    successResponse.data = UsersDataFromDb
    return successResponse
}
catch (err) {

    errorResponse.message = err
    return errorResponse

}
}

const putEntityData = async (req, res) => {
    let successResponse = global.get.successResponse,
        errorResponse = global.get.errorResponse
    try {
        let imgUpResp
        imgUpResp = await imageUpoad(req, res)
        await userDb.UpdateSpecifiedEntityData('users', 'user_id', imgUpResp )
        successResponse.message = 'User Updated Successfully'
        return successResponse
        
    }
    catch (err) {

        errorResponse.message = err
        return errorResponse

    }
}

const getAllImagePathToDelete = async (id ) => {
    try {
            let dataFromDb  = {}
            dataFromDb = await itemDb.getEntityForId('users', 'user_id', id)
            return dataFromDb
        
    }
    catch (err) {

        errorResponse.message = err
        return errorResponse

    }
}

const deleteImageFromPath = async (imagesPathFull) => {
    try {
       if(imagesPathFull[0].profilepicurl){
                    
 
// delete file named 'sample.txt' Synchronously
let varIf = fs.existsSync(imagesPathFull[0].profilepicurl)

if(varIf){
    
    fs.unlinkSync(imagesPathFull[0].profilepicurl);


}

}
                
            }

        
 
    catch (err) {

        errorResponse.message = err
        return errorResponse

    }
}


const deleteUser = async (req, res) => {
    let successResponse = global.get.successResponse,
        errorResponse = global.get.errorResponse
    try {
        let id = req.body.id,
            imagessTodelfullPayload = []

            
            imagessTodelfullPayload = await getAllImagePathToDelete(id)
            if(imagessTodelfullPayload && imagessTodelfullPayload.length > 0){
                
            deleteImageFromPath(imagessTodelfullPayload)

            }
            await itemDb.deleteSepecifedEntity('user_id' , 'users', id)
        


          successResponse.message = `User deleted`

            return successResponse
        
    }
    catch (err) {

        errorResponse.message = err
        return errorResponse

    }
}







module.exports = {
    handleLogin,
    addUser,
    getUsers,
    getUserInfo,
    putEntityData,
    deleteUser
}







// important code to be ueed later


//  if (recivedUser.password === userObj.password) {
//                 let roleFromDataBase = await userDb.getRoleData()
                
//                 if (userFromDatabase) {
//                     var promisedData = []
        
//                         if (userFromDatabase && userFromDatabase[0].profilepicurl) {
//                             promisedData.push(utilityHelper.imageReaderAsync(userFromDatabase[0].profilepicurl))
//                         }
                    
//                     let data = await Promise.all(promisedData.map(
//                         (catg, index) => catg.then(catgInfo => {
//                             userFromDatabase[0].profilepicurl = utilityHelper.converTimageToBase64(userFromDatabase[0].profilepicurl, catgInfo)
//                         }).catch(e => 
                            
//                             userFromDatabase[0].profilepicurl
//                             )))
//                 }

//                 response.message = 'Auth Pass'
//                 response.userInfo = userFromDatabase
//                 response.roles = roleFromDataBase
//             }