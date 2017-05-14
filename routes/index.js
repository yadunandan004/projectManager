var express = require('express');
var router = express.Router();
var aclSetup= require('./../config/acl');

// console.log(acl);
// user add with default roles
// Access pivileges for roles
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/logout', function(req, res){
	req.logout();
	req.session.reset();
	res.render('./../views/homepage',{result:"User has been successfully logged out"});
});
router.get('/filer',function(req,res){
	res.render('index');
})
router.get('/sample',function(req,res){
	res.send(req.user);
})

module.exports = router;
