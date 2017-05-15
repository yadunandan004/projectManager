'use strict';
/*
 * /team/wiki/:wikiID
 * /team/ wiki/newWiki – POST 
 * /team/ wiki/newWiki/:wikiID – POST 
 */

var express = require('express');
var router = express.Router();
const Teams =require('./../models/team');
const Wikis =require('./../models/wiki');
 
router.post('/',function (req, res, next) {
	var team=req.body.teamName;
	reporter(team);
});

router.post('/newWiki',function(req,res){
	var post=req.body;

	if(req.isAuthenticated()){
		Teams.findOne({teamName:post.teamName}).then(function(err,obj){
			if(obj)
			{
				var fpath=path.join('./uploads/', post.teamName);

				if(!fs.existsSync(fpath))
				{	
					fs.mkdirSync(fpath);
				}
				if(!/\.\w+/i.test(post.wikiId))
				{
					post.wikiId+='.txt';
				}
				fpath=path.resolve(fpath+'/'+post.wikiId);
				fs.writeFile(fpath,post.content,function(err){
					if(err)
					{
						res.send({status:0,msg:'error creating file'});
					}
					acl.allow(post.teamName+'_WikiAuthor',post.wikiId,['view','edit']);
					acl.addUserRoles(req.user.username,post.teamName+'_WikiAuthor');
					acl.allow(post.teamName+'_Manager',post.wikiId,'*');
					acl.allow({roles:obj.roles,allows:[{resources:post.wikiId,permissions:['view']}]});
					res.send({status:1,msg:'Great Success!!'});
				});
			}
			else
			{
				res.send({status:0,msg:'could not find a team'});
			}
		});
	}
	else
	{
		res.send('Authentication issue Login again');
	}
});
function reporter(team)
{
	Teams.findOne({teamName:team}).then(function(err,obj){
		if(obj){
				if(typeof post.wikiId==="undefined")
				{
				var wikis=obj.wikis;
					looper(wikis, function(data){
						return(data);
					});
				}
				else
				{
					Wikis.findOne({wikiId:post.wikiId}).then(function(err,obj){
						if(obj){
							return(obj);
						}else{
							return({status:0,msg:'could not find any wiki'});
						}
					});
				}
		}else{
			return({status:0,msg:'could not find any team'});
		}
	});	
}
function looper(wikis,done)
{	
	var res=[];
	(function next(i){

		if(i==wikis.length)
		{
			done(res);
		}
		Wikis.findOne({wikiId:wikis[i]},(data)=>{
			if(data)
			{
				res.push(data);
				
			}
			next(i+1);
		});
	})(0);
}
module.exports = router;