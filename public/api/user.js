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
                    data:{isSuccess:true}
                }
                res.json(result.sucess(data))
            })
        }else{
            res.json(result.failed({msg:'用户已存在'}))
        }
    })
    
}

/**
 * 登录
 * @param {*} req 
 * @param {*} res 
 */
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
                    refresh_token: JWT.getRefreshtoken()
                }))
            }else{
                res.json(result.failed({msg:'密码错误'}))
            }
            
        }
    })
}

/**
 * 获取用户资料
 * @param {*} req 
 * @param {*} res 
 */
const getUserInfo = function(req,res){
    let {username} = req.body || req.query;
    
    User.fetchByUsername(username,(err,res_user)=>{
        if(err) return console.error(err)
        if( !res_user ){
            res.json(result.failed({msg:'用户不存在'}))
        }else{

            res.json(result.sucess({
                data:{user:new Mode.User(res_user)}
            }))

            
        }
    })
}

/**
 * 用户资料修改
 * @param {*} req 
 * @param {*} res 
 */
const UserInfoUpdata = function(req,res){
    let {id,nickname,startWorkDate,desc} = req.body;

    let user = new User({
        nickname: nickname,
        startWorkDate: startWorkDate,
        desc: desc
    })

    if(id){
        User.fetchById(id,(err,res_user)=>{
            assert.ifError(err);
            if( !res_user ){
                res.json(result.failed({msg:'用户不存在'}))
            }else{
                let _user = Object(res_user, user);
                _user.save((err,user)=>{
                    assert.ifError(err);
                    res.json(result.sucess({data:{isSuccess:true},msg:'更新成功'}))
                })
                
            }
        })
    }else{
        res.json(result.failed({msg:'无效的用户名ID'}))
    }
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
        
        if(exType != 3){
            let _token = JWT.getToken();
            res.json(result.sucess({
                    data:{
                        token: _token,
                        refresh_token:JWT.getRefreshtoken()
                    }
                })
            )
        }else{
            res.json(result.failed({msg:'token错误'}));
        }

    }else{
        res.json(result.failed({msg:'没有提供token'}))
    }
	
}

const verifyToken = function(req,res,next){
    let accesstoken = req.body.accesstoken ||req.headers['accesstoken'];
    if(accesstoken){
        let {decoded,exType} = JWT.decodeToken(accesstoken);
        if(exType == 1){
            res.json(result.sucess({msg:'token有效'}))
        }else if(exType == 2){
            res.json(result.failed({code:401,msg:'token已过期'}))
        }else{
            res.json(result.failed({msg:'无效token'}))
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