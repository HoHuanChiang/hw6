const mongoose = require('mongoose');
const userSchema = require('../src/userSchema');
const userProfileSchema=require('../src/userProfileSchema');
const userArticleSchema=require('../src/userArticleSchema');
const fetch=require('node-fetch')
let cookie;
describe("Profile test", function() {

    it('Update the status headline and verify the change',async function (done){
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

        //get the testUser's headline, it should be "No headline now" - GET /headline(loggedInUser)
        await fetch("http://localhost:3000/headline",{
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type':'application/json',
                cookie: `sid=${cookie}`
            }
        }).then(res=>res.json()).then(function(res){
            expect(res.headline).toBe("No headline now");
        });

        //update the testUser headline to Happy - PUT /headline
        data={
            headline: "Happy"
        }
        await fetch("http://localhost:3000/headline",{
            method: 'PUT',
            headers: {
                Accept: 'application/json',
                'Content-Type':'application/json',
                cookie: `sid=${cookie}`
            },
            body: JSON.stringify(data)
        }).then(res=>res.json()).then(function(res){
            expect(res.headline).toBe("Happy");
        });

        //update headline back to make sure next testing will pass - GET /headline(loggedInUser)
        data={
            headline: "No headline now"
        }
        await fetch("http://localhost:3000/headline",{
            method: 'PUT',
            headers: {
                Accept: 'application/json',
                'Content-Type':'application/json',
                cookie: `sid=${cookie}`
            },
            body: JSON.stringify(data)
        }).then(res=>res.json()).then(function(res){
            expect(res.headline).toBe("No headline now");
            done();
        });
    })
});
