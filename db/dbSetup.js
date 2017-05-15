'use strict';
var mongoose= require('mongoose');
var config=require('./../config/config');
var bcrypt =require('bcrypt');
mongoose.connect(config.dburl);
module.exports=mongoose;