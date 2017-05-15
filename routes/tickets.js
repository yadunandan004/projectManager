/* tickets.js
 * /team/tickets/newTicket – POST 
 * /team/tickets/newTicket/:ticketID – POST 
 * /team/tickets/unresolved – GET 
 * /team/tickets/unresolved/:ticketID – GET 
 * /team/tickets/unresolved/:ticketID – GET 
 * /team/tickets/resolved – GET
 */

var express = require('express');
var router = express.Router();
const Teams =require('./../models/team');
const Tickets =require('./../models/ticket');
const mailer=require('./../mailing/mailer');

router.post('/newTicket',function (req, res, next) {
	var post=req.body;
	var newticket= new Tickets();
	newticket.createdBy=req.user.username;
	newticket.ticketId=post.ticketId;				
	newticket.description=post.description;
	newticket.severity=post.severity;
	newticket.status=false;
	newticket.save((err)=>{
		if(err)
		{
			console.log(err);
		}
		else
		{
			res.send({status:1,msg:"Great Success!!"});
		}
	});
});

router.post('/unresolved',function (req, res, next) {
	var content={
		senderlist:[req.user.username],
		subject:'Report',
		body:'In progress Report',
		attachments:{filename:'report.txt',content:JSON.stringify(reporter(req.body,false))}
	};
	mailer(content,function(err,obj){
		if(err)
		{
			res.send('error while sending mail');
			console.log(err);
		}
		else
		{
			res.send({status:1,msg:'report sent'});
		}
	});
});

router.post('/getResolved',function (req, res, next) {
	var content={
		senderlist:[req.user.username],
		subject:'Report',
		body:'In progress Report',
		attachments:{filename:'report.txt',content:JSON.stringify(reporter(req.body,true))}
	};
	mailer(content,function(err,obj){
		if(err)
		{
			res.send('error while sending mail');
			console.log(err);
		}
		else
		{
			res.send({status:1,msg:'report sent'});
		}
	});
});
router.post('/setResolved',function (req, res, next) {
	res.send(setter(req.body));
});

function setter(post)
{
	Teams.findOne({teamName:post.teamName}).then(function(err,obj){
			if(obj){
					Tickets.findOne({ticketId:post.ticketId,completed:false}).then((err,ticket)=>{
						if(ticket)
						{
							ticket.status=true;
						
							ticket.save(function(err){
								return({status:1,msg:'Great Success!!'});
							});	
						}
						else
						{
							return({status:0,msg:'Task could not be found or was already finished'});
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
			if(typeof post.ticketId==="undefined")
				{
				var tickets=obj.tickets;
					looper(tickets, type, function(data){
						return(data);
					});
				}
				else
				{
					Tickets.findOne({ticketId:post.ticketId,completed:false}).then(function(err,obj){
						if(obj){
							return(obj);
						}else{
							return({status:0,msg:'could not find any ticket'});
						}
					});
				}
		}else{
			return({status:0,msg:'could not find any team'});
		}
	});
}
function looper(tickets,type,done)
{	
	var res=[];
	(function next(i){

		if(i==tickets.length)
		{
			done(res);
		}
		Tickets.findOne({ticketId:tickets[i],status:type},(data)=>{
			if(data)
			{
				res.push(data);	
			}
			next(i+1);
		});
	})(0);
}
module.exports = router;
