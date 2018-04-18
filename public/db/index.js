 
const path = require('path');
const MongoClient = require('mongodb').MongoClient;
const db_conf = require(path.resolve(__dirname, 'config.js')).db;

const connect = function(){
    return new Promise((resolve,reject)=>{
        MongoClient.connect(db_conf.url, function(err, client){
            if(err){  
                reject(err);  
            }else{
                console.log("Connected successfully to server");  
                const db = client.db(db_conf.dbName)
                resolve(db,client)
            }
        })
    })
}

module.exports = connect

