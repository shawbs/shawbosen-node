 class User{
    
    constructor(user){
        this.id = user._id;
        this.username = user.username;
        this.nickname = user.nickname;
        this.desc = user.desc;
        this.avatar = user.avatar;
        this.startWorkDate = user.startWorkDate;
        this.createAt = user.createAt;
        this.updateAt = user.updateAt;
    }
}

 class Article{
    
    constructor(article){
        this.id = article._id;
        this.title = article.title;
        this.tag = article.tag;
        this.tagColor = article.tagColor;
        this.private = article.private;
        this.author = article.author;
        this.content = article.content;
        this.createAt = article.createAt;
        this.updateAt = article.updateAt;
    }
}



module.exports = {
    User,
    Article
}