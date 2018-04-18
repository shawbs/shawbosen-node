
const assert = require('assert');
const Actricle = require('../model/actricle');
const result = require('../script/result');

/**
 * 新建文章
 * @param {*} req 
 * @param {*} res 
 */
const addActricle = function(req,res){
    let {title,tag,content,author} = req.body;
    let actricleObj = {
        title: title,
        tag: tag,
        content: content,
        author: author
    }

    for(let item in actricleObj){
        if(actricleObj.hasOwnProperty(item) && typeof actricleObj[item] == 'undefined'){
            res.json(result.failed({msg:`${item}不能为空`}))
            return
        }
    }
    let actricle = new Actricle(actricleObj)

    actricle.save((err,actricle)=>{
        assert.ifError(err);
        res.json(result.sucess({msg:'添加成功'}))
    })
}

/**
 * 更新文章
 * @param {*} req 
 * @param {*} res 
 */
const updateActricle = function(req,res){
    let {title,tag,content,author,actricleId} = req.body;
    let actricleObj = {
        _id: actricleId,
        title: title,
        tag: tag,
        content: content,
        author: author
    }
    for(let item of actricleObj){
        if(actricleObj.hasOwnProperty(item) && typeof actricleObj[item] == 'undefined'){
            res.json(result.failed({msg:`${item}不能为空`}))
        }
    }

    Actricle.fetchById(actricleId,(err,actricle)=>{
        assert.ifError(err);
        let _actricle = Object.assign(actricle,actricleObj)
        _actricle.save((err,actricle)=>{
            assert.ifError(err);
            res.json(result.sucess({msg:'添加成功'}))
        })
    })

    
}

/**
 * 获取所有文章，以时间排序
 * @param {*} req 
 * @param {*} res 
 */
const getActricleAll = function(req,res){
    Actricle.fetch((err,actricle)=>{
        assert.ifError(err);
        res.json(result.sucess({ data: { actricle: actricle } }))
    })
}

/**
 * 根据ID获取文章
 * 入参 actricleId 文章ID
 * @param {*} req 
 * @param {*} res 
 */
const getActricleById = function(req, res){
    let {actricleId} = req.query;
    Actricle.fetchById(actricleId, (err, actricle)=>{
        assert.ifError(err);
        res.json(result.sucess({data:{actricle:actricle}}))
    })
}

/**
 * 根据ID删除文章
 * 入参 actricleId 文章ID
 * @param {*} req 
 * @param {*} res 
 */
const removeActricleById = function(req,res){
    let {actricleId} = req.body;
    Actricle.removeById(actricleId,(err,data)=>{
        assert.ifError(err);
        res.json(result.sucess({msg:'删除成功'}))
    })
}

module.exports = {
    'GET /shawbosen/actricle/getall': getActricleAll,
    'GET /shawbosen/actricle/getbyid': getActricleById,
    'POST /shawbosen/actricle/removebyid': removeActricleById,
    'POST /shawbosen/actricle/add': addActricle,
    'POST /shawbosen/actricle/update': updateActricle
}