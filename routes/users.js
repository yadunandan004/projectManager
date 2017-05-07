'use strict';
var express = require('express');
var router = express.Router();
var aclSetup= require('./../config/acl');
var passport=require('./../auth/passport');
var acl;
aclSetup.then((module)=>{
	acl=module;
});
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/addUser',passport.authenticate('local-signup',
	{successRedirect:'/user',failureRedirect:'/user/blah',failureFlash:true}));
router.get('/blah',(req,res)=>{
	res.end("muhahaha");
})
module.exports = router;
