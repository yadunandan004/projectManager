'use strict';
var express = require('express');
var router = express.Router();
var aclSetup= require('./../config/acl');
var passport=require('./../auth/passport');
const User= require('./../db/dbSetup');
var multer  = require('multer');
const fs=require('fs');
var path=require('path');
var aclSetup= require('./../config/acl');
var acl;

aclSetup.then((module)=>{
	acl=module;
});
var storage=multer.diskStorage({ 
	destination:function(req,file,cb){
		var fpath=path.join('./uploads/', req.user.username);
		if (!fs.existsSync(fpath)) {
			fs.mkdirSync(fpath);
		}
		cb(null,fpath);
	},
	filename:function(req,file,cb){
		cb(null,file.originalname);
	}
});
var upload = multer({storage:storage}); 
var acl;
aclSetup.then((module)=>{
	acl=module;
});
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// router.post('/getUser',passport.authenticate('local',
// 	{successRedirect:'/user',failureRedirect:'/'}));
router.get('/dashboard', function(req, res) {
	res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
	if(req.isAuthenticated())
	res.render('dashboard',{users: req.user} );
	else res.redirect('/users/login');
});
router.post('/signUp',function(req,res,next){
	var profile=req.body;
	User.findOne({username:profile.username})
	.then(function(user){
		if(user)
		{
			console.log(profile);
			res.send('User already present');
		}
		else{
			var newUser= new User();
			newUser.username=profile.username;
			newUser.password=newUser.generateHash(profile.password);
			newUser.email=profile.email;
			newUser.name=profile.name;
			newUser.save((err)=>{
				if(err)
					throw err;
				res.send('new user created');
			})
		}
	})
	.catch(next);
});
router.get('/createRole',function(req,res,next){
	acl.allow('Manager',['wiki'],'*');
	acl.addUserRoles('yadu',"Manager");
	acl.isAllowed('yadu', 'wiki', 'view', function(err, result){
	    if(result){
	    	res.end('done');
	        console.log("User joed is allowed to view wiki");
	    }
	});
	
});
router.post('/addUsertoRole',function(req,res){

})
router.post('/fileUpload',upload.array('wiki-pages',12),function(req,res,next){
	res.send(req.user);
});
router.post('/login',
	//passport.authenticate('local-login',{successRedirect:'/dashboard',failureRedirect:'/users/local-login',failureFlash:true}));
	passport.authenticate('local-login'), 
	function(req, res, next){
		// console.log("user is: " + req.user);
		// req.session.user=req.user;
		if(req.user){
			res.send("logged in"+req.user);
			// res.redirect('/users/dashboard');
		} else {
			res.send("not logged in");
			// res.redirect('/users/login');
		}		
	});
router.get('/getwiki',function(req,res){
	if(req.isAuthenticated())
	{

	}
	else
	{
		res.send('Authentication issue, Login again');
	}
})
router.post('/createWiki',function(req,res){
	var post=req.body;

	if(req.isAuthenticated()){
		var fpath=path.join('./uploads/', req.user.username);
		if(!fs.existsSync(fpath))
		{	
			fs.mkdirSync(fpath);
		}
		// console.log(/\.\w+/i.test(post.name));
		if(!/\.\w+/i.test(post.name))
		{
			post.name+='.txt';
		}
		fpath=path.resolve(fpath+'/'+post.name);
		fs.writeFile(fpath,post.content,function(err){
			if(err)
			{
				res.send('error creating file');
			}
			// acl.allow('creator',post.name,*);
			res.send('file created');
		});
	}
	else
	{
		res.send('Authentication issue Login again');
	}
});
router.post('/getUser', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    // console.log(user);
    if(user)
    {
    	return res.send('logged in');
    }
  })(req, res, next);
});
module.exports = router;
