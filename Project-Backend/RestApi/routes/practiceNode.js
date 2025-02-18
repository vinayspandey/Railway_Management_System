const express= require('express');
const mysql = require('mysql2');
const app = express();
const config=require('config');
const cors = require('cors');
// it is used for when i send request in post form request should be changed from string 
//  json format when i send someting in body also it should be json format
app.use(express.json());
app.use(cors());
const connectionDetails={
   host:config.get('host'),
   user:config.get('user'),
   password:config.get('password'),
   database:config.get('database'),
   port:config.get('port'), 
}
app.get('/',(req,res)=>{
    // it will create a new connection
    const Connection=mysql.createConnection(connectionDetails);
    Connection.connect();
    const mysqlQuery=`select * from Saurabh where name= ${req.params.name}`
    Connection.query(mysqlQuery,(err,result)=>{
        // when quey excutes 
        res.setHeader('Content-Type', 'application/json');
        if(err==null){
            res.json(result)
            
        }
        else{
          console.log(err);
          res.status(500).json(err)
        }
        // here we disconnect the connection after query is excuteed 
        Connection.end();
    })
    
})