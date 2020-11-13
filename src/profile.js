const mongoose = require('mongoose');
const userSchema = require('./userSchema');
const userProfileSchema=require('./userProfileSchema');
const userArticleSchema=require('./userArticleSchema');
const User = mongoose.model('user', userSchema);
const Profile=mongoose.model('profile', userProfileSchema);
const Article=mongoose.model('article', userArticleSchema);
const {connectionString} =require('./main')


async function getHeadline(req,res){
	var user=req.params.user;
	await mongoose.connect(connectionString, {useNewUrlParser: true, useUnifiedTopology: true});
	if(!user){
		var dbProfile=await Profile.findOne({username: req.username})
		let msg={username: req.username, headline: dbProfile.headline};
		res.send(msg);
	}
	else{
		var dbProfile=await Profile.findOne({username: user})
		if(!dbProfile){
			res.send("User not found");
			return;
		}

		let msg={username: user, headline: dbProfile.headline};
		res.send(msg);
	}
}
async function updateHeadline(req,res){
	var newHeadline=req.body.headline;
	if(!newHeadline){
		res.send("headline not found");
		return;
	}

	await mongoose.connect(connectionString, {useNewUrlParser: true, useUnifiedTopology: true});
	await Profile.updateOne({username:req.username},{$set: {headline: newHeadline}});
	let msg={username: req.username, headline: newHeadline};
	res.send(msg);
}
async function getEmail(req,res){
	let user=req.params.user;
	await mongoose.connect(connectionString, {useNewUrlParser: true, useUnifiedTopology: true});
	if(!user){
		let dbProfile=await Profile.findOne({username: req.username});
		let msg={username: req.username, email: dbProfile.email};
		res.send(msg);
	}
	else{
		let dbProfile=await Profile.findOne({username: user});
		if(!dbProfile){
			res.send("User not found");
		}
		else{
			let msg={username: user, email: dbProfile.email};
			res.send(msg);
		}
	}
}
async function updateEmail(req,res){
	var newEmail=req.body.email;
	if(!newEmail){
		res.send("Email not found");
		return;
	}
	await mongoose.connect(connectionString, {useNewUrlParser: true, useUnifiedTopology: true});
	await Profile.updateOne({username: req.username},{$set:{email: newEmail}});
	let msg={username: req.username, email: newEmail};
	res.send(msg);
}
async function getZipCode(req,res){
	let user=req.params.user;
	await mongoose.connect(connectionString, {useNewUrlParser: true, useUnifiedTopology: true});
	if(!user){
		let dbProfile=await Profile.findOne({username: req.username});
		let msg={username: req.username, zipcode: dbProfile.zipcode};
		res.send(msg);
	}
	else{
		let dbProfile=await Profile.findOne({username: user});
		if(!dbProfile){
			res.send("User not found");
		}
		else{
			let msg={username: user, zipcode: dbProfile.zipcode};
			res.send(msg);
		}
	}
}
async function updateZipCode(req,res){
	var zipcode=req.body.zipcode;
	if(!zipcode){
		res.send("zipcode not found");
		return;
	}
	await mongoose.connect(connectionString, {useNewUrlParser: true, useUnifiedTopology: true});
	await Profile.updateOne({username: req.username},{$set:{zipcode: zipcode}});
	let msg={username: req.username, zipcode: zipcode};
	res.send(msg);
}

async function getAvatar(req,res){
	let user=req.params.user;
	await mongoose.connect(connectionString, {useNewUrlParser: true, useUnifiedTopology: true});
	if(!user){
		let dbProfile=await Profile.findOne({username: req.username});
		let msg={username: req.username, avatar: dbProfile.avatar};
		res.send(msg);
	}
	else{
		let dbProfile=await Profile.findOne({username: user});
		if(!dbProfile){
			res.send("User not found");
		}
		else{
			let msg={username: user, avatar: dbProfile.avatar};
			res.send(msg);
		}
	}
}
async function updateAvatar(req,res){
	var avatar=req.body.avatar;
	if(!avatar){
		res.send("avatar not found");
		return;
	}
	await mongoose.connect(connectionString, {useNewUrlParser: true, useUnifiedTopology: true});
	await Profile.updateOne({username: req.username},{$set:{avatar: avatar}});
	let msg={username: req.username, avatar: avatar};
	res.send(msg);
}
async function getDOB(req,res){
	let user=req.params.user;
	await mongoose.connect(connectionString, {useNewUrlParser: true, useUnifiedTopology: true});
	if(!user){
		let dbProfile=await Profile.findOne({username: req.username});
		let msg={username: req.username, dob: dbProfile.dob};
		res.send(msg);
	}
	else{
		let dbProfile=await Profile.findOne({username: user});
		if(!dbProfile){
			res.send("User not found");
		}
		else{
			let msg={username: user, dob: dbProfile.dob};
			res.send(msg);
		}
	}
}
module.exports = (app,isLoggedIn) => {
    app.get('/headline/:user?',isLoggedIn, getHeadline);
    app.put('/headline',isLoggedIn, updateHeadline);
	app.get('/email/:user?',isLoggedIn,getEmail);
	app.put('/email',isLoggedIn,updateEmail);
	app.get('/zipcode/:user?',isLoggedIn,getZipCode);
	app.put('/zipcode',isLoggedIn,updateZipCode);
	app.get('/avatar/:user?',isLoggedIn,getAvatar);
	app.put('/avatar',isLoggedIn,updateAvatar);
	app.get('/dob/:user?',isLoggedIn,getDOB);
}
