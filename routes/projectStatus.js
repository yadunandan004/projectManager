/*
 * /team/projectStatus/InProgress – GET 
 * /team/projectStatus/InProgress/:taskID – GET 
 * /team/projectStatus/InProgress/:taskID – PUT 
 * /team/projectStatus/Completed – GET 
 * /team/projectStatus/Completed/:taskID – GET 
 * /team/projectStatus/futureWork – GET 
 * /team/projectStatus/futureWork/:taskID – GET 
 * /team/projectStatus/futureWork/:taskID – PUT 
 * /team/projectStatus/newTask – GET 
 * /team/projectStatus/newTask – POST 
 */

var express = require('express');
var router = express.Router();
const Users= require('./../models/user');
const Teams =require('./../models/team');
const Tasks =require('./../models/tasks');
var aclSetup= require('./../config/acl');
var acl;
aclSetup.then((module)=>{
	acl=module;
});

router.post('/inProgress',function (req, res, next) {
	reporter(req.body,0);
});

router.post('/completed',function (req, res, next) {
	reporter(req.body,1);
});
router.post('/futureWork',function (req, res, next) {
	reporter(req.body,2);
});

router.post('/newTask',function (req, res,next) {
	var content = req.body;
	acl.hasRole(req.user.username,'Manager',function(err,val){
		if(err)
		{
			res.end('Role access error');
		}
		else
		{
			if(val)
			{
				acl.allow(content.team+'_Manager',content.taskname,'*');//allow manager to do anything on the task
				
				var userlist=content.users;
				for(let i=0;i<userlist;i++)
				{
					acl.allow(content.team+'_Member',content.taskname,['view','edit']);
				}
				var newtask= new Tasks();
				newtask.taskname=content.taskname;
				newtask.user= content.users;
				newtask.status=[];
				newtask.completed=false;
				if(typeof content.startDate==="undefined")
				{
					content.startDate=Date.now();
				}
				newtask.startedOn= content.startDate;
				newtask.save((err)=>{
					if(err)
					{
						res.send({status:-1,msg:"error creating new task"});
					}
					res.send({status:1,msg:"created new task"});
				})
			}
			else
			{
				res.send({status:0,msg:'You do not have permission'});
			}
		}
	});
});
function reporter(post,type)
{
	if(typeof post.taskID==="undefined")
	{
		Teams.findOne({teamName:post.team}).then(function(obj){
			if(obj){
				var tasks=obj.tasks;
					looper(tasks, type, function(data){
						return(data);
					});
			}else{
				return({status:0,msg:'could not find any team'});
			}
		});
	}
	else
	{
		Tasks.findOne({taskname:post.taskID,completed:false}).then(function(obj){
			if(obj){
				return(obj);
			}else{
				return({status:0,msg:'could not find any task'});
			}
		});
	}
}
function looper(tasks,type,done)
{	
	temp={};
	temp["taskname"]=tasks[i];
	if(type == 0) //in progress tasks
	{
		temp["completed"]=false;
		temp["startedOn"]={"$lte":Date.now()};
	}
	if(type==1)	//completed tasks
	{
		temp["completed"]=true;
	}
	if(type==2)
	{
		temp["completed"]=false;
		temp["startedOn"]={"$gt":Date.now()};
	}
	var res=[];
	(function next(i){
		if(i==tasks.length)
		{
				done(res);
		}
		Tasks.findOne().then((data)=>{
			if(data)
			{
				res.push(data);
				next(i+1);
			}
		});
	})(0);
}

module.exports = router;
