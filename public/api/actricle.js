
const http = require('http');
const assert = require('assert');
const Actricle = require('../model/actricle');
const result = require('../script/result');
const middle = require('../script/middle');
const conf = require('../../config');
const util = require('../script/util');
const _ = require('lodash');
const Mode = require('../serve/result')


/**
 * 新建文章
 * @param {*} req 
 * @param {*} res 
 */
const addActricle = function(req,res){
    let {title,tag,content,tagColor,private} = req.body;
    let actricleObj = {
        title: title,
        tag: tag,
        tagColor: tagColor,
        content: content,
        private: private
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
    let {title,tag,content,tagColor,id,private} = req.body;
    let actricleObj = {
        _id: id,
        title: title,
        tag: tag,
        tagColor: tagColor,
        content: content,
        private: private
    }
    for(let item in actricleObj){
        if(actricleObj.hasOwnProperty(item) && typeof actricleObj[item] == 'undefined'){
            res.json(result.failed({msg:`${item}不能为空`}))
        }
    }

    Actricle.fetchById(id,(err,actricle)=>{
        assert.ifError(err);
        let _actricle = Object.assign(actricle,actricleObj)
        _actricle.save((err,actricle)=>{
            assert.ifError(err);
            res.json(result.sucess({msg:'更新成功'}))
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
        let actricleList = [];
        for(let item of actricle){
            let _actricle = new Mode.Article(item);
            delete _actricle.content;
            actricleList.push(_actricle) 
        }
        res.json(result.sucess({ data: { actricle: actricleList } }))
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
        if(actricle){
            res.json(result.sucess({data:{actricle: new Mode.Article(actricle)}}))
        }else{
            res.json(result.failed({msg:'查无此id'}))
        }
    })
}


/**
 * 获取所有标签
 */
const getTags = function(req,res){
    Actricle.fetchColumn({_id:0,tag:1,tagColor: 1},(err,data)=>{
        assert.ifError(err);
        let arr = [];
        // console.log(data)
        for(let item of data){
            if(!!item){
                arr.push(item)
            }
        }
        arr = _.uniqBy(arr,'tag')
        res.json(result.sucess({
            data: {
                tags: [...arr]
            }
        }))
    })
}

/**
 * 获取标签所有文章
 * @param {*} req 
 * @param {*} res 
 */
const getActricleByTag = function(req, res){
    let {tag} = req.body;
    if(tag){
        Actricle.fetchBy({tag: tag}, (err,data)=>{
            assert.ifError(err)
            let actricleList = [];
            for(let item of data){
                let _actricle = new Mode.Article(item);
                delete _actricle.content;
                actricleList.push(_actricle) 
            }
            res.json(result.sucess({
                data:{
                    actricle: actricleList
                }
            }))
        })
    }else{
        Actricle.fetch((err,actricle)=>{
            assert.ifError(err);
            let actricleList = [];
            for(let item of actricle){
                let _actricle = new Mode.Article(item);
                delete _actricle.content;
                actricleList.push(_actricle) 
            }
            res.json(result.sucess({ data: { actricle: actricleList } }))
        })
    }
}

/**
 * 按标签分类获取所有文章
 * @param {*} req 
 * @param {*} res 
 */
const getActricleGroupByTag = function(req, res){
    //获取标签数组，并过滤重复项
    Actricle.fetchColumn({_id:0,tag:1},(err,data)=>{
        assert.ifError(err);
        let set = new Set();
        for(let item of data){
            if(!!item.tag){
                set.add(item.tag)
            }
        }
        let tags = [...set];


        Actricle.fetch((err,articleList)=>{
            assert.ifError(err);
            let o = {};
             
            for(let tag of tags){
                let _arr = [];
                for(let i=0;i<articleList.length;i++){
                    if(articleList[i].tag == tag){
                        let o =new Mode.Article(articleList[i]);
                        delete o.content;
                        _arr.push(o);
                    }
                    if(i == articleList.length-1){
                        o[tag] = _arr;
                    }
                }
            }
            res.json(result.sucess({ data:{ articleList: o} }))
        })
    })


    


}

/**
 * 删除文章
 * @param {*} req 
 * @param {*} res 
 */
const deleteArticle = function(req,res){
    let {actricleId} =  req.body;
    if(actricleId){
        Actricle.removeById(actricleId,(err,data)=>{
            assert.ifError(err)
            res.json(result.sucess({
                data:{
                    isSuccess: true
                }
            }))
        })
    }else{
        res.json(result.failed({
            data:{
                isSuccess: false
            },
            msg: '未提供ID'
        }))
    }
}

module.exports = {
    'GET /shawbosen/actricle/getall': getActricleAll,
    'GET /shawbosen/actricle/getbyid': getActricleById,
    'POST /shawbosen/actricle/add': [middle.MiddleVerifyToken, addActricle],
    'POST /shawbosen/actricle/update': [middle.MiddleVerifyToken, updateActricle],
    'GET /shawbosen/actricle/getTags': getTags,
    'POST /shawbosen/actricle/getActricle/tag': getActricleByTag,
    'GET /shawbosen/actricle/getActricleGroup/tag': getActricleGroupByTag,
    'POST /shawbosen/actricle/delete':  [middle.MiddleVerifyToken, deleteArticle]
}