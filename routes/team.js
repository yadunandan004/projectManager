/* team.js
 * /team/projectStatus – GET 
 * /team/wiki
 * /team/reports
 * /team/manageUsers
 */
var express = require('express');
var router = express.Router();
const Teams =require('./../models/team');
var acl;
var mailer=require('./../mailing/mailer');
aclSetup.then((module)=>{
	acl=module;
});
router.post('/',function (req, res, next) {
	acl.hasRole(req.user.username,req.body.teamName,function(err,hasRole){
		if(err)
			throw err;
		else
		{
			if(hasRole)
			{
				res.send({status:1,msg:"Great Success!!",data:["Project Status","Wikis","Issue Tickets","Manage Users","Reports"]});
			}
			else
			{
				res.send({status:1,msg:"Great Success!!",data:["Project Status","Wikis","Issue Tickets"]})
			}
		}
	});
});
router.post('/newTeam',function (req, res, next) {
	var post=req.body;
	Teams.findOne({teamName:post.teamName}).then(function(err,team){
		if(err)
		{
			res.send({status:-1,msg:"error creating a new team"})
			console.log(err);
		}
		else
		{
			if(team)
			{
				res.send({status:0,msg:"Team with the given name already present"});
			}
			else
			{
				var newteam= new Teams();
				newteam.teamName=post.teamName;
				newteam.createdBy=req.user.username;
				newteam.roles=['Manager'];
				newteam.save((err,obj)=>{
					if(err)
					{
						res.send({status:-1,msg:"error creating a new team"})
						console.log(err);
					}
					else
					{
						acl.addUserRoles(req.user.username,obj.teamName+'_Manager');
						res.send({status:1,msg:"Great Success!!",data:obj});
					}
				});
				
			}
		}
	});
});

module.exports = router;