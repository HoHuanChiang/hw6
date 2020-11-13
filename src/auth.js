const md5 = require('md5');
const mongoose = require('mongoose');
const userSchema = require('./userSchema');
const userProfileSchema=require('./userProfileSchema');
const User = mongoose.model('user', userSchema);
const Profile=mongoose.model('profile', userProfileSchema);
const {connectionString} =require('./main')
let cookieKey = "sid";



const redis=require('redis').createClient(process.env.REDIS_URL);


function isLoggedIn(req, res, next) {
    // likely didn't install cookie parser

    if (!req.cookies) {
       return res.sendStatus(401);
    }
    let sid = req.cookies[cookieKey];
    // no sid for cookie key
    if (!sid) {
        return res.sendStatus(401);
    }

    redis.hget("sessions",sid,function (error,obj){
        if(obj){
            req.username=obj;
            next();
        }
        else{
            return res.sendStatus(401);
        }
    })
}

async function login(req, res) {
    let username = req.body.username;
    let password = req.body.password;
    // supply username and password
    if (!username || !password) {
        return res.sendStatus(400);
    }
    await mongoose.connect(connectionString, {useNewUrlParser: true, useUnifiedTopology: true});
    //find user profile from database

    var dbUsers=await User.findOne({username: username});
    if(!dbUsers){
        let msg = {username: username, result: 'Username not found'};
        res.send(msg);
        return;
    }
    let hash = md5(dbUsers.salt + password);

    if (hash === dbUsers.hashPassword) {
        let sid = md5(new Date().getTime());
        redis.hset("sessions",sid,username);
        res.cookie(cookieKey, sid, { maxAge: 3600 * 1000, httpOnly: true });
        let msg = {username: username, result: 'success'};
        res.send(msg);
    }
    else{
        let msg = {username: username, result: 'Wrong Username or Password'};
        res.send(msg);
    }


}

async function register(req, res) {
    let username = req.body.username;
    let email=req.body.email;
    let password = req.body.password;
    let dob=req.body.dob;
    let zipcode=req.body.zipcode;



    // supply username and password
    if (!username || !password) {
        return res.sendStatus(400);
    }

    let salt = username + new Date().getTime();
    let hash = md5(salt+password);
    //userObjs[username] =  {username:username, salt: salt, hash: hash}
    await mongoose.connect(connectionString, {useNewUrlParser: true, useUnifiedTopology: true});


    var dbUsers=await User.find({username: username});

    if(dbUsers.length>0){
        let msg = {username: username, result: 'Username already exists'};
        res.send(msg);
        return;
    }


    await User.create({
        username:username,
        salt: salt,
        hashPassword: hash,
        created: Date.now()
    });
    await Profile.create({
        username: username,
        headline: "No headline now",
        email: email,
        zipcode: zipcode,
        dob: dob,
        avatar: "",
        following: [],
        created: Date.now()
    });

    let msg = {username: username, result: 'success'};
    res.send(msg);
}
function logout(req,res){
    let sid = req.cookies[cookieKey];
    res.clearCookie(cookieKey);
    redis.del("sessions",sid);
    res.send("OK");
}
async function updatePassword(req,res){
    let password=req.body.password;
    if(!password){
        res.send("new password not found");
        return;
    }
    await mongoose.connect(connectionString, {useNewUrlParser: true, useUnifiedTopology: true});
    let salt = req.username + new Date().getTime();
    let hash = md5(salt+password);
    await User.updateOne({username:req.username},{$set: {salt: salt,hashPassword: hash}});

    let msg = {username: req.username, result: 'success'};
    res.send(msg);

}
function initializeAuth(app){
    app.post('/login', login);
    app.post('/register', register);
    app.put('/password',isLoggedIn, updatePassword);
    app.put('/logout', logout);
}

module.exports = {initializeAuth,isLoggedIn}
