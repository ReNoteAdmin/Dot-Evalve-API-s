 const mysql = require('mysql2')
 const path = require("path");
 require('dotenv').config({ path: path.resolve(__dirname + '/.env') });
 var host =  process.env.DB_HOST;
 var user = process.env.DB_USER;
 var password = process.env.DB_PASSWORD;
 // create the connection to database
 var db="justevalve_master";
const pool = mysql.createPool({
    host: host,
    user: user,
    database: db,

    timezone: '+05:30',
    password : password,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });


module.exports = pool; 
