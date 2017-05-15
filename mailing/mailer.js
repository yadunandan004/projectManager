'user strict';
const nodemailer=require('nodemailer');
const transport = nodemailer.createTransport({
	service:'Gmail',
	auth:{
		user: 'yaduanna@gmail.com',
        pass: 'sinisterbughuul'
	}
});
module.exports= function(content,done){
	var mailOptions = {
	    from: 'team@mccproj.com',
	    to: content.senderlist,
	    subject: content.subject,
	    html: content.body,
	    attachments:content.attachments
	};

	transport.sendMail(mailOptions,(error,info)=>{
		if(error){
			done(error);
		}
		done(null,info);
	});	
}
