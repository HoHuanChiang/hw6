const md5 = require('md5');
const mongoose = require('mongoose');
const userSchema = require('./userSchema');
const userProfileSchema=require('./userProfileSchema');
const userArticleSchema=require('./userArticleSchema');
const User = mongoose.model('user', userSchema);
const Profile=mongoose.model('profile', userProfileSchema);
const Article=mongoose.model('article', userArticleSchema);
const {connectionString} =require('./main')


async function getArticles(req, res) {
    var id=req.params.id;
    await mongoose.connect(connectionString, {useNewUrlParser: true, useUnifiedTopology: true});
    var dbPosts;
    if(!id){
        dbPosts=await Article.find({author: req.username});
    }
    else{
        if(!isNaN(parseInt(id))){
            dbPosts=await Article.find({pid: id});
            if(dbPosts.length==0){
                dbPosts=await Article.find({author:id});
            }
        }
        else{
            dbPosts=await Article.find({author:id});
        }

    }
    let msg={"articles":dbPosts};
    res.send(msg);

}
async function addArticle(req,res){
    var text=req.body.text;
    await mongoose.connect(connectionString, {useNewUrlParser: true, useUnifiedTopology: true});
    var dbArticle=await Article.find();
    var count=0;
    dbArticle.forEach(function (x){
       count=Math.max(count,x.pid);
    })
    var newArticle={
        pid: count+1,
        author: req.username,
        text: text,
        date: Date.now(),
        comments:[]
    };
    await Article.create(newArticle);


    dbArticle=await Article.find({author: req.username});
    let msg={"articles":dbArticle};
    res.send(msg);
}
async function updateArticle(req,res){
    let pid=req.params.id;
    let text=req.body.text;
    let commentId=req.body.commentId;
    if(isNaN(parseInt(pid))){
        res.send("/id should be an post id(integer)");
        return;
    }
    if(!text){
        res.send("text field not found");
        return;
    }

    await mongoose.connect(connectionString, {useNewUrlParser: true, useUnifiedTopology: true});
    if(!commentId){
        var dbArticles=await Article.find({pid:pid,author:req.username});
        if(dbArticles.length==0){
            res.send("This article doesn't exist or this is not your article");
            return;
        }
        await Article.updateOne({pid:pid,author: req.username},{$set: {text: text}});
    }
    else if(commentId==-1){
        var dbArticles=await Article.findOne({pid:pid});
        if(dbArticles==null){
            res.send("This article doesn't exist");
            return;
        }
        var comment={};
        comment["commentID"]=dbArticles.comments.length+1;
        comment["username"]=req.username;
        comment["text"]=text;
        comment["date"]=Date.now();
        await Article.updateOne({pid:pid},{$push:{comments: comment}});

        if(dbArticles.author!=req.username){
            let myArticle=await Article.find({pid:pid});
            let msg={"articles":myArticle};
            res.send(msg);
            return;
        }
    }
    else{
        var dbArticles=await Article.findOne({pid:pid});
        if(dbArticles==null){
            res.send("This article doesn't exist");
            return;
        }
        var dbComments=await dbArticles.comments;
        var filterComment=dbComments.filter(x=>x.username==req.username&&x.commentID==commentId)
        if(filterComment.length==0){
            res.send("This comment doesn't exist or this is not your comment");
            return;
        }
        filterComment[0].text=text;
        await Article.updateOne({pid:pid},{$set:{comments: dbComments}});

        if(dbArticles.author!=req.username){
            let myArticle=await Article.find({pid:pid});
            let msg={"articles":myArticle};
            res.send(msg);
            return;
        }
    }


    let dbArticle=await Article.find({author: req.username});
    let msg={"articles":dbArticle};
    res.send(msg);
}
module.exports = (app,isLoggedIn) => {
    app.get('/articles/:id?',isLoggedIn, getArticles);
    app.put('/articles/:id',isLoggedIn, updateArticle);
    app.post('/article',isLoggedIn, addArticle);
}
