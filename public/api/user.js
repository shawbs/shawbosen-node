
/**
*	user api
*/
const result = require('../script/result');

const  util = require('../script/common');

const User = require('../model/user');

/**
 * 用户注册接口
 * @param {*} req 
 * @param {*} res 
 */
const register = function(req,res){
    let {username,password,nickname,startWorkDate,desc,avatar,code} = req.body;
    if(code != '@shaw1991.'){
        res.json(result.failed({msg:'不开放注册'}))
    }
    let user = new User({
        username: username,
        password: password,
        nickname: nickname,
        startWorkDate: startWorkDate,
        desc: desc,
        avatar: avatar,
    })

    //查看用户是否存在
    User.fetchByUsername(username,(err,res_user)=>{
        if(err) return console.error(err)
        if( !res_user ){
            user.save((err,_user)=>{
                if(err) return console.error(err)
                let data = {
                    code: 200,
                    data:{user:user}
                }
                res.json(result.sucess(data))
            })
        }else{
            res.json(result.failed({msg:'用户已存在'}))
        }
    })
    
}

const login = function(req,res){
    let {username,password} = req.body;

    User.fetchByUsername(username,(err,res_user)=>{
        if(err) return console.error(err)
        if( !res_user ){
            res.json(result.failed({msg:'用户不存在'}))
        }else{
            if(password == res_user.password){
                res.json(result.sucess({
                    data:{user:res_user},
                    token: util.getJwt()
                }))
            }else{
                res.json(result.failed({msg:'密码错误'}))
            }
            
        }
    })
}

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
        res.json(result.failed({message:'invalid token'}))
    }else{
        res.next();
    }
}


module.exports = {
    'POST /shawbosen/register': register,
    'POST /shawbosen/login': login,
	'POST /shawbosen/refreshAccessToken': refreshAccessToken,
}