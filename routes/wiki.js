'use strict';
/*
 * /team/wiki/:wikiID
 * /team/ wiki/newWiki – POST 
 * /team/ wiki/newWiki/:wikiID – POST 
 */

var express = require('express');
var router = express.Router();
const Teams =require('./../models/team');
 
router.post('/',function (req, res, next) {
	var team=req.body.teamName;
	Teams.findOne({teamName:team}).then((err,obj)=>{
		if(err)
		{
			console.log(err);
		}
		else
		{
			if(obj)
			{
				res.send({status:1,msg:"Great Success!!",data:obj.wikis});
			}
			res.send({status:0,msg:"Sorry could not find team"});
		}
	});
});

router.route('/:wikiID')
.get(function (req, res, next) {
	res.send('get team/wiki/:wikiID');
})
.post(function (req, res, next) {
	
});

router.route('/newWiki')
.get(function (req, res, next) {
	res.send('get team/newWiki');
})
.post(function (req, res, next) {
	
});

router.route('/newWiki/:wikiID')
.get(function (req, res, next) {
	res.send('get team/newWiki/:wikiID');
})
.post(function (req, res, next) {
	
});

module.exports = router;