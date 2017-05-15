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
var mailer=require('./../mailing/mailer');
var acl;
aclSetup.then((module)=>{
	acl=module;
});

router.post('/getinProgress',function (req, res, next) {
	var content={
		senderlist:[req.user.username],
		subject:'Report',
		body:'In progress Report',
		attachments:{filename:'report.txt',content:JSON.stringify(reporter(req.body,0))}
	};
	mailer(content,function(err,obj){
		if(err)
		{
			res.send('error while sending mail');
		}
		else
		{
			res.send({status:1,msg:'mail sent'});
		}
	});
});
router.post('/setStatus',function (req, res, next) {
	res.send(setter(req.body,0));
});

router.post('/getCompleted',function (req, res, next) {
	var content={
		senderlist:[req.user.username],
		subject:'Report',
		body:'Completed Report',
		attachments:{filename:'report.txt',content:JSON.stringify(reporter(req.body,1))}
	};
	mailer(content,function(err,obj){
		if(err)
		{
			res.send('error while sending mail');
		}
		else
		{
			res.send({status:1,msg:'mail sent'});
		}
	});
});
router.post('/setCompleted',function (req, res, next) {
	res.send(setter(req.body,1));
});
router.post('/getFutureWork',function (req, res, next) {
	var content={
		senderlist:[req.user.username],
		subject:'Report',
		body:'Completed Report',
		attachments:{filename:'report.txt',content:JSON.stringify(reporter(req.body,2))}
	};
	mailer(content,function(err,obj){
		if(err)
		{
			res.send('error while sending mail');
		}
		else
		{
			res.send({status:1,msg:'mail sent'});
		}
	});
});

router.post('/newTask',function (req, res,next) {
	var content = req.body;
	acl.hasRole(req.user.username,content.teamName+'_Manager',function(err,val){
		if(err)
		{
			res.end('Role access error');
		}
		else
		{
			if(val)
			{
				acl.allow(content.team+'_Manager',content.taskname,'*');//allow manager to do anything on the task
				acl.allow(content.team+'_Member',content.taskname,['view','edit']);
				var userlist=content.users;
				for(let i=0;i<userlist;i++)
				{
					acl.addUserRoles(userlist[i],content.team+'_Member');
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
				});
			}
			else
			{
				res.send({status:0,msg:'You do not have permission'});
			}
		}
	});
});
function setter(post,type)
{
	Teams.findOne({teamName:post.teamName}).then(function(err,obj){
			if(obj){
				acl.isAllowed(req.user.username,post.taskname,['view','edit'],function(err,allowed){
					if(allowed)
					{
						if(type==0)	//add status to task
						{
							Tasks.findOne({taskname:post.taskname,completed:false}).then((err,task)=>{
								if(task)
								{
									var arr=task.status;
									arr.push(post.status);
									task.status=arr;
									task.save(function(err){
										return({status:1,msg:'Great Success!!'});
									})
								}
								else
								{
									return({status:0,msg:'Task could not be found or was already finished'});
								}
							});
						}
						else 		//mark task as completed
						{
							Tasks.findOne({taskname:post.taskname,completed:false}).then((err,task)=>{
								if(task)
								{
									task.completed=true;
								
									task.save(function(err){
										return({status:1,msg:'Great Success!!'});
									});	
								}
								else
								{
									return({status:0,msg:'Task could not be found or was already finished'});
								}
							});
						}
					}
					else
					{
						return({status:0,msg:'No permission to perform the operation'});
					}
					
				});
			}
			else{
				return({status:0,msg:'could not find any team'});
			}
	})
}
function reporter(post,type)
{
	Teams.findOne({teamName:post.teamName}).then(function(err,obj){
		if(obj){
			if(typeof post.taskname==="undefined")
				{
				var tasks=obj.tasks;
					looper(tasks, type, function(data){
						return(data);
					});
				}
				else
				{
					Tasks.findOne({taskname:post.taskname,completed:false}).then(function(err,obj){
						if(obj){
							return(obj);
						}else{
							return({status:0,msg:'could not find any task'});
						}
					});
				}
		}else{
			return({status:0,msg:'could not find any team'});
		}
	});
}
function looper(tasks,type,done)
{	
	temp={};
	
	var res=[];
	(function next(i){

		if(i==tasks.length)
		{
			done(res);
		}
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
		Tasks.findOne(temp,(data)=>{
			if(data)
			{
				res.push(data);	
			}
			next(i+1);
		});
	})(0);
}

module.exports = router;
