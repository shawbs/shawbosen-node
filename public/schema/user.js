
const Mongoose = require('mongoose')

const UserSchema = new Mongoose.Schema({
    username: String,
    password: String,
    nickname: String,
    startWorkDate: Date,
    desc: String,
    avatar: String,
    meta: {
        createAt: {
            type: Date,
            default: Date.now()
        },
        updateAt: {
            type: Date,
            default: Date.now()
        }
    }
})

//pre是每次调用save方法都执行这个方法体
UserSchema.pre('save', function(next){
    if(this.isNew){
        this.meta.createAt = this.meta.updateAt = Date.now()
    }else{
        this.meta.updateAt = Date.now()
    }
    next()
})

UserSchema.statics = {
    fetch: function(cb){
        return this.find({}).sort('meta.updateAt').exec(cb)
    },
    fetchById: function(id,cb){
        return this.findOne({
            _id: id
        })
        .exec(cb)
    }
}

module.exports = UserSchema