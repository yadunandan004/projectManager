var express = require('express');
var router = express.Router();
var aclSetup= require('./../config/acl');
var acl;
aclSetup.then((module)=>{
	acl=module;
});
// console.log(acl);
// user add with default roles
// Access pivileges for roles
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/createRole',function(req,res,next){
	// console.log(req.body.role);
	acl.allow('Manager',['wiki'],'*');
	acl.addUserRoles('yadu',"Manager");
	acl.isAllowed('yadu', 'wiki', 'view', function(err, res){
	    if(res){
	        console.log("User joed is allowed to view wiki");
	    }
	})
	res.end();
});
module.exports = router;
