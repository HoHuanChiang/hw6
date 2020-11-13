const mongoose = require('mongoose');
const userSchema = require('../src/userSchema');
const userProfileSchema=require('../src/userProfileSchema');
const userArticleSchema=require('../src/userArticleSchema');
const User = mongoose.model('user', userSchema);
const Profile=mongoose.model('profile', userProfileSchema);
const Article=mongoose.model('article', userArticleSchema);
const {connectionString} =require('../src/main')
const fetch=require('node-fetch')
let cookie;

describe("Article test", function() {
    it('Create a new article and verify that the article was added',async function (done){

        await mongoose.connect(connectionString, {useNewUrlParser: true, useUnifiedTopology: true});
        await Article.deleteMany({author: "testUser"});

        //login testUser - POST /login
        let data={
            username:"testUser",
            password:"123"
        }
        await fetch("http://localhost:3000/login",{
            method: 'POST',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify(data)
        }).then(res=>{
            cookie=res.headers.get('set-cookie').split(";")[0].split("=")[1];
            return res.json()
        }).then(function(res){
            expect(res["username"]).toBe("testUser");
            expect(res["result"]).toBe("success");
        });


        //Fetch the testUser articles, the number of the articles should be 0 - GET/articles(loggedInUser)
        await fetch("http://localhost:3000/articles",{
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type':'application/json',
                cookie: `sid=${cookie}`
            }
        }).then(res=>res.json()).then(function(res){
            expect(res["articles"].length).toBe(0);
        });

        //testUser add a new article - POST /article (loggedInUser)
        data={
            text:"This is a new article content"
        }
        await fetch("http://localhost:3000/article",{
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type':'application/json',
                cookie: `sid=${cookie}`
            },
            body: JSON.stringify(data)
        }).then(res=>res.json()).then(function(res){
            expect(res["articles"].length).toBe(1);
            expect(res["articles"][0].text).toBe("This is a new article content");
            expect(res["articles"][0].author).toBe("testUser");
        });
        var newPostID=0;
        //Fetch the testUser's articles again, the count of the articles should be 1 - GET /articles(loggedInUser)
        await fetch("http://localhost:3000/articles",{
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type':'application/json',
                cookie: `sid=${cookie}`
            }
        }).then(res=>res.json()).then(function(res){
            newPostID=res["articles"][0].pid;
            expect(res["articles"].length).toBe(1);
            expect(res["articles"][0].text).toBe("This is a new article content");
            expect(res["articles"][0].author).toBe("testUser");
        });

        //Fetch an article by its pid - GET /articles/id (ArticleID)
        await fetch("http://localhost:3000/articles/"+newPostID,{
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type':'application/json',
                cookie: `sid=${cookie}`
            }
        }).then(res=>res.json()).then(function(res){
            expect(res["articles"][0].pid).toBe(newPostID);
            expect(res["articles"].length).toBe(1);
            expect(res["articles"][0].text).toBe("This is a new article content");
            expect(res["articles"][0].author).toBe("testUser");
            done();
        });

    })
    it('Fetch an article with invalid post id',async function (done){
        await mongoose.connect(connectionString, {useNewUrlParser: true, useUnifiedTopology: true});
        //Fetch an article with its pid which is not a valid pid, the response article should be an empty array - GET /articles/id (ArticleID)
        await fetch("http://localhost:3000/articles/-1",{
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type':'application/json',
                cookie: `sid=${cookie}`
            }
        }).then(res=>res.json()).then(function(res){
            expect(res["articles"].length).toBe(0);
            done();
        });
    })

});
