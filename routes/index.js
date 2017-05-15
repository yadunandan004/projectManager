const express = require('express');
const router = express.Router();
const passport=require('./../auth/passport');
const User= require('./../models/user');

// console.log(acl);
// user add with default roles
// Access pivileges for roles
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.post('/login',
	passport.authenticate('local-login'), 
	function(req, res, next){
		if(req.user){
			res.send({status:1,msg:"logged in",data:{email:req.user.email,username:req.user.username,name:req.user.name}});
		} else {
			res.send({status:0,msg:"not logged in"});
		}		
	});
router.post('/signup',function(req,res,next){
	var profile=req.body;
	User.findOne({username:profile.username})
	.then(function(user){
		if(user)
		{
			console.log(profile);
			res.send({status:0,msg:'User already present'});
		}
		else{
			var newUser= new User();
			newUser.username=profile.username;
			newUser.password=newUser.generateHash(profile.password);
			newUser.email=profile.email;
			newUser.name=profile.name;
			newUser.save((err,obj)=>{
				if(err)
					throw err;
				res.send({status:1,msg:'new user created',data:obj});
			})
		}
	})
	.catch(next);
});
router.get('/logout', function(req, res){
	req.logout();
	req.session.reset();
	res.send({status:1,msg:"User has been successfully logged out",data:1});
});
// router.get('/filer',function(req,res){
// 	res.render('index');
// })
// router.get('/sample',function(req,res){
// 	res.send(req.user);
// })

module.exports = router;
