
module.exports = {
    env: 'dev',
    dev: {
        port:8090,
        //服务器上传目录
        book_upload_path:process.cwd() + '/uploads',
    },
    prod: {
        port:8090,
        //服务器上传目录
        book_upload_path:process.cwd() + '/uploads',
    },
    db: {
        url: 'mongodb://sgdy:sgdy@localhost:27017/shawbosen',
        dbName: 'shawbosen',
        username: 'sgdy',
        password: 'sgdy'
    },
    secret: 'shawbosen$%^'
}