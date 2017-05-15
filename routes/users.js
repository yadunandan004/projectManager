'use strict';
var express = require('express');
var router = express.Router();
var aclSetup= require('./../config/acl');
const passport=require('./../auth/passport');
const User= require('./../models/user');
var multer  = require('multer');
const fs=require('fs');
var path=require('path');
var aclSetup= require('./../config/acl');
var acl;
var mailer=require('./../mailing/mailer');
var xls=require('./../mailing/createXls');
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

router.get('/dashboard', function(req, res) {
	res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
	if(req.isAuthenticated())
	{
		User.findOne({username:req.user.username}).then((user)=>{
			if(user)
			{
				res.send({status:1,msg:"great Success!!",data:user.teams});
			}
			else
			{
				res.send({status:0,msg:"authentication issue, please login again"});
			}	
		});
	};
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

router.post('/fileUpload',upload.array('wiki-pages',12),function(req,res,next){
	res.send(req.user);
});

router.get('/getwiki',function(req,res){
	res.send("blah blah");
})

module.exports = router;
