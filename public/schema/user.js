


const Mongoose = require('mongoose')

const UserSchema = new Mongoose.Schema({
    username: {
        type: String,
        required: [true, 'username field is required']
    },
    password: {
        type: String,
        required: [true, 'password field is required']
    },
    nickname: {
        type: String,
        default: ''
    },
    startWorkDate: {
        type: Number,
        default: 0
    },
    desc: {
        type: String,
        default: ''
    },
    avatar: {
        type: String,
        default: ''
    },
    createAt: {
        type: Date,
        default: Date.now()
    },
    updateAt: {
        type: Date,
        default: Date.now()
    }

})

//pre是每次调用save方法都执行这个方法体
UserSchema.pre('save', function(next){
    if(this.isNew){
        this.createAt = this.updateAt = Date.now()
    }else{
        this.updateAt = Date.now()
    }
    next()
})

UserSchema.statics = {
    fetch: function(cb){
        return this.find({}).sort('updateAt').exec(cb)
    },
    fetchById: function(id,cb){
        return this.findOne({
            _id: id
        })
        .exec(cb)
    },
    fetchByUsername: function(username,cb){
        return this.findOne({
            username: username
        })
        .exec(cb)
    }
}

module.exports = UserSchema