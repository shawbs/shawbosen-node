const  JWT = require('../script/mJWT');
const result = require('../script/result');
/**
 * 添加token验证路由,添加到需要验证的路由中间件中
 * @param {*} req 
 * @param {*} res 
 */
const MiddleVerifyToken = function(req,res,next){
    let accessToken = req.body.accessToken || req.query.accessToken ||req.headers['x-access-token'];
    if(accessToken){
        let {decoded,exType} = JWT.decodeToken(accessToken);
        if(exType == 1){
            next();
        }else if(exType == 2){
            res.json(result.failed({msg:'token已过期',refreshAccess: 1}))
        }else{
            res.json(result.failed({msg:'无效token'}))
        }
    }else{
        res.json(result.failed({msg:'没有提供token'}))
    }
	
}


module.exports = {
    MiddleVerifyToken
}