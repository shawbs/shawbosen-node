 class User{
    
    constructor(user){
        this.username = user.username;
        this.nickname = user.nickname;
        this.desc = user.desc;
        this.avatar = user.avatar;
        this.meta = user.meta;
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
        this.meta = article.meta;
    }
}



module.exports = {
    User,
    Article
}