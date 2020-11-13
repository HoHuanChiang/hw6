const mongoose = require('mongoose');
const userSchema = require('./userSchema');
const userProfileSchema=require('./userProfileSchema');
const userArticleSchema=require('./userArticleSchema');
const User = mongoose.model('user', userSchema);
const Article=mongoose.model('article', userArticleSchema);
const Profile=mongoose.model('profile', userProfileSchema);
const {connectionString} =require('./main')

async function getFollowers(req,res){
    let user=req.params.user;
    await mongoose.connect(connectionString, {useNewUrlParser: true, useUnifiedTopology: true});
    var dbFollow=null;
    if(!user){
        dbFollow=await Profile.findOne({username: req.username});
        let msg={"username":req.username,"following":dbFollow.following};
        res.send(msg);
    }
    else{
        var dbUser=await User.findOne({username: user});
        if(!dbUser){
            res.send("user not found");
            return;
        }
        dbFollow=await Profile.findOne({username: user});
        let msg={"username":user,"following":dbFollow.following};
        res.send(msg);
    }

}
async function addFollower(req,res){
    let user=req.params.user;
    await mongoose.connect(connectionString, {useNewUrlParser: true, useUnifiedTopology: true});
    var dbUser=await User.findOne({username:user});
    if(!dbUser){
        res.send("user not found");
        return;
    }
    await Profile.update({username:req.username},{$addToSet:{following: user}})
    var dbProfile=await Profile.findOne({username:req.username});
    let msg={"username":user,"following":dbProfile.following};
    res.send(msg);
}
async function deleteFollower(req,res){
    let user=req.params.user;
    await mongoose.connect(connectionString, {useNewUrlParser: true, useUnifiedTopology: true});
    await Profile.update({username:req.username},{$pull:{following:user}})
    let dbProfile=await Profile.findOne({username: req.username});
    let msg={"username":user,"following":dbProfile.following};
    res.send(msg);
}

module.exports = (app,isLoggedIn) => {
    //app.get('/articles/:id?',isLoggedIn, getArticles);

    app.get('/following/:user?',isLoggedIn, getFollowers);
    app.put('/following/:user',isLoggedIn, addFollower);
    app.delete('/following/:user',isLoggedIn, deleteFollower);
}
