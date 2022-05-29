'use strict';



module.exports.logLevel = {
    error: 0,
    warn: 1,
    info: 2,
    trace: 3
};

module.exports.statusCode = {
    'Ok': 200,
    'BadRequest': 400,
    'DBError': 503,
    'ApplicationError': 500
};

module.exports.post = {
    successResponse: {
        message : '',
        statusCode : 200
    },
    errorResponse: {
        message : '',
        statusCode : 500
    }
};

module.exports.get = {
    successResponse: {
        data : '',
        statusCode : 200
    },
    errorResponse: {
        message : '',
        statusCode : 500
    }
};

module.exports.imagePathMap = {
    '/lripl/api/addCategory' : 'category',
    '/lripl/api/addSubCategory': 'subCategory',
    '/lripl/api/addProduct': 'product',
    '/lripl/api/putProduct': 'product',
    '/lripl/api/addUser':'users',
    '/lripl/api/putUserData': 'users'
};

module.exports.imagePathMapforEdit = {
    'Category' : 'category',
    'subCategory': 'subCategory',
    'Product': 'product'
};

module.exports.imageUpoadPath  = 'public/images'


module.exports.tableNameMapping  = {
products : 'Product',
types: 'Category',
items: 'SubCategory'   
}

module.exports.nonAuthPAth  = [
    '/lripl/api/mlogin',
    '/lripl/api/sendOtp',
    '/lripl/api/sendOtpNew',
    '/lripl/api/verifyOtp',
    '/lripl/api/resendOtp',
    '/lripl/api/login',
    '/images'
]
    
