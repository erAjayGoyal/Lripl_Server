'use strict';

var SwaggerExpress = require('swagger-express-mw');
//var app = require('express')();
var express = require('express');

var app = express();

const swaggerUi = require('swaggerize-ui');

const bodyParser = require('body-parser');
var multer = require('multer');
var upload = multer();
var cors = require('cors');
const global = require('./api/helpers/constants/constant')
var jwt = require('jsonwebtoken');
const configForApp = require('./api/helpers/config')
module.exports = app; // for 
app.use(cors())


var config = {
  appRoot: __dirname // required config
};
//var bodyParser = require('body-parser');

//  app.use(bodyParser.urlencoded({
//     parameterLimit: 100000,
//     limit: '50mb',
//     extended: true
//   }));

app.use(bodyParser.json({
  limit: '50mb'}
));

// for parsing multipart/form-data
//app.use(upload.array()); 
//app.use(express.static('public'));




//app.use(bodyParser({limit: '50mb'}));
// app.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "localhost:3000"); // update to match the domain you will make the request from
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });
// app.use('/swagger', function(req, res) {
//   res.json(require('./config/swagger.json'));
// });
app.use('/TotalFlow/v1/docs', swaggerUi({
  docs: '/swagger'
}));


function authVerification(req, res, next) {

  let path = req.path

  if(path.includes('/images')){
    next();
  }

  else if(!global.nonAuthPAth.includes(path)){
    if (req && req.headers && req.headers.authorization) {
      let token = req.headers.authorization

      if (token.startsWith('Bearer ')) {
        // Remove Bearer from string
        token = token.slice(7, token.length);
      }
    
      if (token) {
        jwt.verify(token, configForApp.secret, (err, decoded) => {
          if (err) {
            return res.status(401).json({
              success: false,
              message: 'Token is not valid'
            });
          } else {
            req.decoded = decoded;
            next();
          }
        });
      } 
    }else {
      return  res.status(401).json({
        success: false,
        message: 'Auth token is not supplied'
      });
    }
    
   

  }


   else {
    next();
  }
}

app.use(express.static('public'))
SwaggerExpress.create(config, function(err, swaggerExpress) {
  if (err) { throw err; }

  app.use(authVerification);
  app.use(function (req, res, next) {
    console.log('this is req', {...req});
    if(req.file){
      req.files = req.file  
    }
    else{
      req.files = {}
    }
    next();
  });

  // install middleware
  swaggerExpress.register(app);


  var port = process.env.PORT || 10010;
  app.listen(port);

});
