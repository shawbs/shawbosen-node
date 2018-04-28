const Mode = require('../serve/result')


/**
*	user api
*/
const result = require('../script/result');

const  JWT = require('../script/mJWT');

const User = require('../model/user');

const conf = require('../../config');

const util = require('../script/util');

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
                    data:{isSuccess:true}
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
                    data:{user:new Mode.User(res_user)},
                    token: JWT.getToken(),
                    refresh_token: JWT.encryptToken(conf.secret)
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
    let refreshToken = req.body.refreshToken;
    if(refreshToken){
        let {decoded,exType} = JWT.decodeToken(refreshToken);
        
        if(decoded.content == conf.secret){
            let _token = JWT.getToken();
            res.json(result.sucess({data:{token: _token}}))
        }else{
            res.json(result.failed({msg:'token错误'}));
        }

    }else{
        res.json(result.failed({msg:'没有提供token'}))
    }
	
}

const verifyToken = function(req,res,next){
    let accessToken = req.body.accessToken || req.query.accessToken ||req.headers['x-access-token'];
    if(accessToken){
        let {decoded,exType} = JWT.decodeToken(accessToken);
        if(exType == 1){
            res.json(result.sucess({data:{token: JWT.getToken() }, token_status: 1}))
        }else if(exType == 2){
            res.json(result.failed({msg:'token已过期',token_status: 2}))
        }else{
            res.json(result.failed({msg:'无效token',token_status: 3}))
        }
    }else{
        res.json(result.failed({msg:'没有提供token'}))
    }
	
}

module.exports = {
    'POST /shawbosen/user/register': register,
    'POST /shawbosen/user/login': login,
    'POST /shawbosen/refreshAccessToken': refreshAccessToken,
    'POST /shawbosen/verifyToken': verifyToken
}