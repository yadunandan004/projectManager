'use strict';
const passport = require('passport');
const  bcrypt=require('bcrypt');
const localStrategy= require('passport-local').Strategy;
const User= require('./../models/user');
passport.serializeUser((user,done)=>{
	done(null,user.id);
});
passport.deserializeUser((id,done)=>{
	User.findById(id,(err,user)=>{
		done(err,user);
	});
});
passport.use('local-login',new localStrategy(
function(username,password,done){
		// console.log(username+":"+password);
		User.findOne({username:username},function(err,user){
			if(err) return done(err);
		if(!user) return done(null, false);
		if(!bcrypt.compareSync(password,user.password)) {
			console.log("User authentication failed!");
			console.log(password+"User authentication failed!"+user.password+" status: "+bcrypt.compareSync(password,user.password));
			return done(null, false);
		}
		return done(null, user);
		});
	}
	));
module.exports=passport;

