function reply(msg,replycontent) {
	var tmpl = require('tmpl');
	var replytmpl = '<xml>'+
			'<ToUserName><![CDATA[{toUser}]]></ToUserName>'+
			'<FromUserName><![CDATA[{fromUser}]]></FromUserName>'+
			'<CreateTime><![CDATA[{time}]]></CreateTime>'+
			'<MsgType><![CDATA[{type}]]></MsgType>'+
			'<Content><![CDATA[{content}]]></Content>'+
			'</xml>';
	return tmpl(replytmpl, {
		toUser:msg.xml.FromUserName[0],
		fromUser:msg.xml.ToUserName[0],
		time:Date.now(),
		type:'text',
		content:replycontent
	});
}

module.exports = {
  	reply: reply
};
