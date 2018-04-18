
const result_failed = {
    code: 100,
    data: null,
    msg: '未知错误'
}

const result_sucess = {
    code: 200,
    data: {},
    msg: ''
}

module.exports = {
    failed: function(...source){
        return Object.assign({},result_failed , ...source)
    },

    sucess: function(...source){
        return Object.assign({},result_sucess , ...source)
    }

}