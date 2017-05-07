'use strict';
const passport = require('passport');
const localStrategy= require('passport-local').Strategy;
const User= require('./../db/dbSetup');
passport.serializeUser((user,done)=>{
	done(null,user.id);
})
passport.deserializeUser((id,done)=>{
	User.findById(id,(err,user)=>{
		done(err,user);
	})
})
passport.use('local-signup',new localStrategy((username,password,email,name,done)=>{
	User.findOne({username:username},(err,user)=>{
		if(err)
		{
			return done(err);
		}
		if(user)
		{
			return done(null,false,{message:'User with this email is already present'});
		}
		else{
			var newUser= new User();
			newUser.username=username;
			newUser.password=newUser.generateHash(password);
			newUser.email=email;
			newUser.name=name;
			newUser.save((err)=>{
				if(err)
					throw err;
				return done(null,newUser);
			})
		}
			
		});
	}));
module.exports=passport;