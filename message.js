var PORT = 9529;
var TOKEN = 'hkksspku'
var qs = require('qs');
var http = require('http');

function checkSignature(params, token) {
	var key = [token, params.timestamp, params.nonce].sort().join('');
	var sha1 = require('crypto').createHash('sha1');
	sha1.update(key);
	
	return sha1.digest('hex') == params.signature;
}

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

var server = http.createServer(function(req,res) {
	var query = require('url').parse(req.url).query;
	var params = qs.parse(query);
	
	console.log(params);
	console.log("token->",TOKEN);
	
	if (!checkSignature(params,TOKEN)) {
		res.end('Signature fail');
		return;
	}
	
	if (req.method == 'GET') {
		res.end(params.echostr);
	}else {
		var postdata = '';
		
		req.addListener('data',function(postchunk) {
			postdata += postchunk;
		});
		
		req.addListener('end',function() {
			var parseString = require('xml2js').parseString;
			
			parseString(postdata,function(err,result) {
				if (!err) {
					console.log(result);
					if (result.xml.MsgType[0] == 'text') res.end(reply(result,"消息发送成功"));
					else if (result.xml.MsgType[0] == 'image') res.end(reply(result,"图片发送成功"));
					else if (result.xml.MsgType[0] == 'voice') res.end(reply(result,"语音发送成功"));
					else if (result.xml.MsgType[0] == 'location') res.end(reply(result,"位置发送成功"));
					else if (result.xml.MsgType[0] == 'link') res.end(reply(result,"链接发送成功"));
					else if (result.xml.MsgType[0] == 'shortvideo') res.end(reply(result,"小视频发送成功"));
				}
			});
			//console.log(postdata);
			//res.end('success');
		});
	}
});

server.listen(PORT);
console.log('Sever running at port : '+PORT);

