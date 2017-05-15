'use strict';
const mongoose=require('./../db/dbSetup');
const bcrypt=require('bcrypt');
var Schema=mongoose.Schema;
var userSchema=new Schema({
	name:{type:String,required:true},
	username:{type:String,required:true,unique:true},
	password:{type:String,required:true},
	email:{type:String,required:true},
	teams:{type:[String]}
},{timestamps: true});
userSchema.methods.generateHash=(password)=>{
	return bcrypt.hashSync(password,bcrypt.genSaltSync(8),null);
}

var users=mongoose.model('proj_members',userSchema);
module.exports=users;