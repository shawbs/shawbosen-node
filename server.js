const express = require('express');
const path = require('path');
const app = express();

const bodyParser = require('body-parser');

const _ = require('underscore');

const conf = require(path.resolve(__dirname, 'config.js'));
const url = conf.path;
const port = process.env.PORT || conf[conf.env].port;

app.locals.moment = require('moment')

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/shawbosen');
const db = mongoose.connection;
db.on('error', function(err){
    console.error(err)
})




// 添加json解析中间件
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));


app.all('*', function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "x-requested-with,content-type");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    // res.header("X-Powered-By",' 3.2.1')
    // res.header("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");
	next();
});


 
app.listen(port,()=>{
	console.log(`server runing on http://127.0.0.1:${port}`);
});
	
require('./public/api')(app);



