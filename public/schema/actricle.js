
const Mongoose = require('mongoose')

const ActricleSchema = new Mongoose.Schema({
    title: String,
    tag: String,
    content: String,
    author: {
        type: String,
        default: 'sgdy'
    },
    tagColor: String,
    private: {
        type: Boolean,
        default: false
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
ActricleSchema.pre('save', function(next){
    if(this.isNew){
        this.createAt = this.updateAt = Date.now()
    }else{
        this.updateAt = Date.now()
    }
    next()
})

ActricleSchema.statics = {
    fetch: function(cb){
        return this.find({}).sort({'updateAt':-1}).exec(cb)
    },
    fetchColumn: function(option,cb){
        return this.find({},option).exec(cb)
    },
    fetchById: function(id,cb){
        return this.findOne({
            _id: id
        })
        .exec(cb)
    },
    fetchBy: function(option, cb){
        return this.find(option).exec(cb)
    },
    removeById: function(id,cb){
        return this.remove({_id:id}).exec(cb)
    }
}

module.exports = ActricleSchema