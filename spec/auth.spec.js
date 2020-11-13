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
describe("Auth test", function() {

    it('Register a new user named "testUser" with password "123"',async function (done){

        await mongoose.connect(connectionString, {useNewUrlParser: true, useUnifiedTopology: true});
        await User.deleteOne({username: "testUser"});
        await Profile.deleteOne({username: "testUser"});

        //register a new user - POST /register
        var newUser={
            username: "testUser",
            email: "test@rice.edu",
            dob: "128999122000",
            zipcode: 12345,
            password: "123"
        }
        await fetch("http://localhost:3000/register",{
            method:'POST',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify(newUser)
        }).then(res=>res.json()).then(function(res){
            expect(res["username"]).toBe("testUser");
            expect(res["result"]).toBe("success");
            mongoose.connection.close();
            done();
        });

    });
    it('Log in as "testUser"',async function (done){

        //login a user as testUser - POST /login
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
            done();
        });
    });

    it('Log out "testUser"',async function (done){

        //User following endpoint to check the "testUser" is currently logged in - GET /following(loggedInUser)
        await fetch("http://localhost:3000/following",{
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type':'application/json',
                cookie: `sid=${cookie}`
            }
        }).then(res=>res.json()).then(function(res){
            expect(res.username).toBe("testUser");
        });

        //logout the testUser - PUT /logout
        await fetch("http://localhost:3000/logout",{
            method: 'PUT',
            headers: {
                Accept: 'application/json',
                'Content-Type':'application/json'
            }
        }).then(res=>{
            expect(res.statusText).toBe("OK");
        })

        //Use the following endpoint to check if the user is still login, Unauthorized means the testUser is currently logged out - Get /following(loggedInUser)
        await fetch("http://localhost:3000/following",{
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type':'application/json',
                cookie: `sid=${cookie}`
            }
        }).then(res=>{
            expect(res.statusText).toBe("Unauthorized");
            done();
        })




    })
});
