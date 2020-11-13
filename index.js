const {isLoggedIn,initializeAuth} = require('./src/auth');
const articles = require('./src/article');
const profile = require('./src/profile');
const follow = require('./src/follower');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors=require('cors');

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

