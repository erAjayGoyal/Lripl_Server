
const connection = require('./connection')

const utility = require('../utils/utility')




const getSpecificUserInfo = (userName) => {
    return new Promise((resolve, reject) => {
      let queryObj = {
        type : 'Select',
        tableName : 'users',
        identifier : 'username',
        conditionParam : userName,
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
           
  })
}

const getDealerRoleId = () => {
  return new Promise((resolve, reject) => {
    let queryObj = {
      type : 'Select',
      tableName : 'role',
      identifier : 'name',
      conditionParam : 'dealer',
      operator : '='
    }
    let query = utility.queryGenerator(queryObj)
    if(query !== '') {
      connection.pool.query(query, (error, results) => {
          if (error) {
            reject(error)
          }else{
            resolve(results.rows[0].roleid)
          }
        })
    }
    else{
        reject('Error in fetching User Data')
    }
         
})
}


const getUserForMobile = (phoneNumber) => {
  return new Promise((resolve, reject) => {
    let queryObj = {
      type : 'Select',
      tableName : 'users',
      identifier : 'phonenumber',
      conditionParam : phoneNumber,
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
         
})
}

const getRoleData = () => {
  return new Promise((resolve, reject) => {
    
    let query = `SELECT * FROM role`
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

const getUsers = () => {
  return new Promise((resolve, reject) => {
    
    let query = `SELECT * FROM users`
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
        reject('Error in fetching users Data')
    }
         
})
}


const getStatusData = () => {
  return new Promise((resolve, reject) => {
    
    let query = `SELECT * FROM status`
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



const   saveUserProfileToDb = (userDetails) => {
  return new Promise((resolve, reject) => {
    let query = `INSERT INTO public.users(
      emailid, companyname, gstnumber, roleid, isactive, fullname, state_id, phonenumber, profilepicurl)
      VALUES ( '${userDetails.emailid}', '${userDetails.companyname}', '${userDetails.gstnumber}', '${userDetails.roleid}', ${userDetails.isactive}, '${userDetails.fullname}' ,'${userDetails.state_id}','${userDetails.phonenumber}', '${userDetails.profilepicurl}') 
    ON CONFLICT (phonenumber) 
    DO
        UPDATE SET
         emailid =  '${userDetails.emailid}',
         companyname =  '${userDetails.companyname}',
         gstnumber = '${userDetails.gstnumber}', 
         roleid = '${userDetails.roleid}',
         isactive =   ${userDetails.isactive}, 
         fullname = '${userDetails.fullname}',
         state_id = '${userDetails.state_id}',
         profilepicurl = '${userDetails.profilepicurl}' `

    if(query !== '') {
      connection.pool.query(query, (error, results) => {
          if (error) {
            reject(false)
          }else{
            resolve(true)
          }
        })
    }
    else{
        reject('Error in fetching User Data')
    }
         
})
}

const   addUserOnLoginForMobile = (userDetails, roleid) => {
  return new Promise((resolve, reject) => {
    let query = `INSERT INTO public.users(
     isactive,phonenumber, roleid)
      VALUES (false, '${userDetails.phonenumber.slice(3, userDetails.phonenumber.length)}', '${roleid}') 
      ON CONFLICT (phonenumber) DO UPDATE SET isactive = true, roleid = '${roleid}' WHERE NOT users.fullname = '';`

    if(query !== '') {
      connection.pool.query(query, (error, results) => {
          if (error) {
            reject(false)
          }else{
            resolve(true)
          }
        })
    }
    else{
        reject('Error in fetching User Data')
    }
         
})
}


const   addUserToDataBase = (userDetails) => {
  return new Promise((resolve, reject) => {
    let query = `INSERT INTO users(
       username, password, profilepicurl, roleid, fullname, isactive)
	
      VALUES ('${userDetails.userId}', '${userDetails.passWord}', '${userDetails.profilePic}', '${userDetails.roleId}', '${userDetails.fullName}', '${userDetails.status}');`
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


const   addUserMobileInfo = (userDetails) => {
  return new Promise((resolve, reject) => {
    let query = `INSERT INTO user_device_tokens(
      devicetoken, platform, device, deviceos)
      VALUES ('${userDetails.devicetoken}','${userDetails.platform}','${userDetails.device}','${userDetails.deviceos}');`
    if(query !== '') {
      let resp = {
        isSuccess : true

      }
      connection.pool.query(query, (error, results) => {
          if (error) {
            resp,isSuccess = false
            reject(resp)
          }else{

            resolve(resp)
          }
        })
    }
    else{
        reject('Error in submitting details')
    }
         
})
}


const    UpdateSpecifiedEntityData= (tableName, identifier, data) => {
  return new Promise((resolve, reject) => {
  
   let query = `SET `
    
      query = query + `username = '${data.userId}', fullname = '${data.fullName}', isactive = '${data.status}'` 
    
    if(data.profilepicurl && data.profilepicurl.length > 0){
      
    query = query + `, profilepicurl = '${data.profilepicurl}'` 
    }
    if(data.passWord && data.passWord.length > 0){
      
    query = query + `, password = '${data.passWord}'` 
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
        reject('Error in Updating  User Data')
    }
         
})
}


module.exports = {
  getSpecificUserInfo,
  addUserToDataBase,
  getStatusData,
  getRoleData,
  getUserForMobile,
  addUserMobileInfo,
  saveUserProfileToDb,
  addUserOnLoginForMobile,
  getDealerRoleId,
  getUsers,
  UpdateSpecifiedEntityData
}