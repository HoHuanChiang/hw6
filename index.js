const {isLoggedIn,initializeAuth} = require('./src/auth');
const articles = require('./src/article');
const profile = require('./src/profile');
const follow = require('./src/follower');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const cors=require('cors');
const connectionString = 'mongodb+srv://LarsChiang:c1LKbgzrbPXWcvQU@cluster0.vfpzw.mongodb.net/HW6?retryWrites=true&w=majority';




/*
let articles = [{ id: 0, author: 'Mack', body: 'Post 1' },
    { id: 1, author: 'Jack', body: 'Post 2' },
    { id: 2, author: 'Zack', body: 'Post 3' }];

/*
const hello = (req, res) => res.send({ hello: 'world' });

const getUser = (req, res) => {
    (async () => {
        const connector =   mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
       
        await (connector.then(()=> {
        	return new User({
				username: req.params.uname,
				created: Date.now()
			}).save();
        }));
        res.send({name: req.params.uname});
    })();

};
const getArticles = (req, res) => res.send(articles);

const getArticle = (req, res) => res.send(articles[req.params.id]);

const addArticle = (req, res) => {
    let post = req.body;
    let article = {id: articles.length, author: post.author, body: post.body}
    articles.push(article);
    res.send(articles);
}*/
const app = express();
app.use(cors({
    origin:　true,
    credentials: true,
}));
app.use(bodyParser.json());
app.use(cookieParser());
initializeAuth(app);
articles(app,isLoggedIn);
profile(app,isLoggedIn);
follow(app,isLoggedIn);

// Get the port from the environment, i.e., Heroku sets it
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
     const addr = server.address();
     console.log(`Server listening at http://${addr.address}:${addr.port}`)
});

