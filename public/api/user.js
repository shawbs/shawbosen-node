
/**
*	user api
*/


const  util = require('../script/common');

const User = require('../model/user');




/**
 * 刷新令牌
 * @param {any} req {token}
 * @param {any} res 
 */
const refreshAccessToken = function(req,res){
	let {accessToken} = req.body;
	let {decoded,exType} = util.verifyToken(accessToken);
	let _token = util.getJwt();
	if(exType.exType == 1 || exType.exType == 2){
        res.json({state:true,token: _token, message:''})
    }else{
        res.json({state:false,message:'入参错误'});
    }	
}

/**
 * 添加token验证路由,添加到需要验证的路由中间件中
 * @param {*} req 
 * @param {*} res 
 */
const httpVerifyToken = function(req,res){
	let {accessToken} = req.body;
	let {decoded,exType} = util.verifyToken(accessToken);
    if(exType != 1){
        res.json({state:false,message:'invalid token'})
    }else{
        res.next();
    }
}


module.exports = {
	'POST /shawbosen/user/login': fn_login,
	'POST /shawbosen/user/register': fn_register,
	'POST /shawbosen/refreshAccessToken': refreshAccessToken,
}