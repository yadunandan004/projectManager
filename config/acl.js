'use strict';
var acl=require('acl');
var mongodb=require('mongodb');
var config=require('./config');
var setUp=new Promise((resolve,reject)=>{
	mongodb.connect(config.dburl,function(error,db){
	
		acl=new acl(new acl.mongodbBackend(db,'acl_'));
		resolve(acl);
	});
});

module.exports=setUp;

