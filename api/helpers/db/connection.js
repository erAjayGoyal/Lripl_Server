
const utility = require('../utils/utility')
const Pool = require('pg').Pool
const pool = new Pool({
  user: 'me',
  host: 'localhost',
  database: 'lripl',
  password: 'password',
  port: 5432,
})


const getUsers = () => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM itemData ORDER BY id ASC', (error, results) => {
            if (error) {
                console.log('hello', error)
              reject(error)
            }else{
                
            resolve(results.rows)
            }
          })     
    })
  }


  module.exports = {
    getUsers,
    pool
  }