/* reports.js
 * /team/reports/status – GET 
 * /team/reports/access – GET 
 * /team/reports/userActivity
 * /team/reports/userActivity/dateRange – POST
 * /team/reports/userActivity/selectUser – GET 
 */
var express = require('express');
var router = express.Router();
const Teams =require('./../models/team');
const Tasks =require('./../models/tasks'); 

router.post('/status',function (req, res, next) { // get all statuses from a team
	var team=req.body.teamName;
	acl.hasRole(req.user.username,team+'_Manager',function(err,val){
		if(val)
		{
			Teams.findOne({teamName:team}).then((err,obj)=>{
				var tasks=obj.tasks;
				looper(tasks,function(data){
					if(data.length!==0)
					{
						res.send({status:1,msg:'report generated check your mail'});			//send email 
					}
				});
			})
		}
		else
		{
			res.send({status:0,msg:'you do not have permission to do so'});
		}
	});
});

router.post('/access',function (req, res, next) { 	// get all user access roles from team
	var team=req.body.teamName;
	acl.hasRole(req.user.username,team+'_Manager',function(err,val){
		if(val)
		{
			Teams.findOne({teamName:team}).then((err,obj)=>{
				var roles=obj.roles;
				looper1(roles,function(data){
					if(data.length!==0)
					{
						res.send({status:1,msg:'report generated check your mail'});			//send email 
					}
				});
			});
		}
		else
		{
			res.send({status:0,msg:'you do not have permission to do so'});
		}
	});
});
// router.route('/userActivity')
// .get(function (req, res, next) {
	
// })
// .post(function (req, res, next) {
	
// });

// router.route('/userActivity/selectUser')
// .get(function (req, res, next) {
	
// })
// .post(function (req, res, next) {
	
// });
function looper1(roles,done)
{	
	
	var res=[];
	(function next(i){

		if(i==roles.length)
		{
			done(res);
		}
		acl.roleUsers(roles[i],(err,users)=>{
			if(users)
			{
				res.push({role:roles[i],users:users});
			}
			next(i+1);
		});
	})(0);
}
function looper(tasks,done)
{	
	
	var res=[];
	(function next(i){

		if(i==tasks.length)
		{
			done(res);
		}
		Tasks.findOne(tasks[i],(data)=>{
			if(data)
			{
				res.push({taskname:data.taskname,status:data.status});
			}
			next(i+1);
		});
	})(0);
}
module.exports = router;