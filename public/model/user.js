
const Mongoose = require('mongoose')
//获取模式
const UserSchema = require('../schema/user')
//编译成模型
const User = Mongoose.model('User', UserSchema)

module.exports = User