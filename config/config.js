'use strict';
if(app.get('env')=='production')
{
	module.exports=require('./production.json');
}
else
{
	module.exports=require('./development.json');
}
module.exports={dburl:url}