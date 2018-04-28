const jwt = require('jsonwebtoken');
const md5 = require('md5');
const secret = md5('sgdy$');

/**
 * 生成token
 * @param {number} hours 
 */
const getToken = function(hours){
    hours = hours || 1;
    let token = jwt.sign(
        {
            content:'shawbosen',
            iat:Math.floor(Date.now() / 1000) + (60 * 60),
        }, md5(secret),
        {
            // expiresIn:hours*60*60 //1小时到期
            expiresIn: 1000 //10分钟到期
        }
    )
    return token;
}

/**
 * 解码token
 * @param {string} token
 * @return {object} 
 */
const decodeToken = function(token){
    var 
    decoded, // 解码后的信息
    exType; // exType 1-有效 2-过期 3-token错误
   
    try {
        decoded = jwt.verify(token, md5(secret));
        exType = 1;
    } catch(err) {
        // err
        console.dir(err)
        if(err.name == 'TokenExpiredError'){
            exType = 2;
        }else{
            exType = 3;
        }
        decoded = null;
    }
    return {decoded,exType};
}

/**
 * 加密
 * @param {*} key 要加密的KEY
 */
const encryptToken = function(key){
    return jwt.sign(
        {
            content: key,
            iat:Math.floor(Date.now() / 1000) + (60 * 60),
        }, md5(secret)
    )
}



module.exports = {
    decodeToken,
    getToken,
    encryptToken
}