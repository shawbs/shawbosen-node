
const Mongoose = require('mongoose')
//获取模式
const ActricleSchema = require('../schema/actricle')
//编译成模型
const Actricle = Mongoose.model('Actricle', ActricleSchema)

module.exports = Actricle