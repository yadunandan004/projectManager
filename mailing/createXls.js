var fs = require('fs');
var path=require('path');
module.exports=function(jsonArr)
{	
	var ws= fs.createWriteStream(path.resolve(__dirname+"./../uploads/report.xlsx"));
	var cols=Object.keys(jsonArr[0]);
	var header=cols.join("\t")+"\n";
	var line="";
	for(let i=0;i<jsonArr.length;i++)
	{
		for(let j=0;j<cols.length;j++)
		{
			line+=jsonArr[i].toString()+"\t";
		}
		line+="\n";
	}
	ws.write(header);
	ws.write(line);
	ws.close();
}