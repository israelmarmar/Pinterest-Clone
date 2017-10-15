var express = require('express');
var app = express();
var port = process.env.PORT || 3000;  
var urldb =process.env.MONGOLAB_URI2;
var mongodb= require("mongodb");
var MongoClient = mongodb.MongoClient;
var ObjectId = mongodb.ObjectID;
var cookieParser = require('cookie-parser');
var session=require('express-session');
const requestImageSize = require('request-image-size');

var Twitter = require("node-twitter-api");
var _requestSecret;

    var twitter = new Twitter({
        consumerKey: "l0Q11C3VqtdLze9jQCHhQiX4V",
      consumerSecret:"sdPtwLeAdlr3cR9WuPki6gCagFtBCuqx97fZn62dSktMf3yI7Z",
      callback: "https://pinterest-clone-imm.herokuapp.com/access-token"
    });

var db;

MongoClient.connect(urldb, function(err, database) {
  if(err) throw err;

  db = database;


});

var Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9+/=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/rn/g,"n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}};

app.use(express.static(__dirname + '/'));
app.use(cookieParser());
app.use(session({
  cookieName: 'session',
  secret: 'random_string_goes_here',
  duration: 30 * 60 * 1000,
  activeDuration: 5 * 60 * 1000,
}));

function clone(obj) {
var copy={};
  console.log(obj._doc)
    Object.keys(obj._doc).forEach(function (key) {
    copy[key]=obj[key];
    }   );
    console.log(copy);
    return copy;
}

app.get('/', function (req, res) {
	req.session.user={"id":2987460604,"id_str":"2987460604","name":"Israel Martins","screen_name":"israelmarqmart","location":"","description":"","url":null,"entities":{"description":{"urls":[]}},"protected":false,"followers_count":0,"friends_count":0,"listed_count":0,"created_at":"Tue Jan 20 15:24:27 +0000 2015","favourites_count":0,"utc_offset":null,"time_zone":null,"geo_enabled":false,"verified":false,"statuses_count":1,"lang":"pt","status":{"created_at":"Thu Oct 05 15:42:48 +0000 2017","id":915965503289602000,"id_str":"915965503289602048","text":"@EbanxBR Quando Ã© vocÃªs vÃ£o aceitar recarga do ebanx por bitcoins?","truncated":false,"entities":{"hashtags":[],"symbols":[],"user_mentions":[{"screen_name":"EbanxBR","name":"EBANX","id":516722733,"id_str":"516722733","indices":[0,8]}],"urls":[]},"source":"<a href=\"http://twitter.com\" rel=\"nofollow\">Twitter Web Client</a>","in_reply_to_status_id":null,"in_reply_to_status_id_str":null,"in_reply_to_user_id":516722733,"in_reply_to_user_id_str":"516722733","in_reply_to_screen_name":"EbanxBR","geo":null,"coordinates":null,"place":null,"contributors":null,"is_quote_status":false,"retweet_count":0,"favorite_count":0,"favorited":false,"retweeted":false,"lang":"pt"},"contributors_enabled":false,"is_translator":false,"is_translation_enabled":false,"profile_background_color":"C0DEED","profile_background_image_url":"http://abs.twimg.com/images/themes/theme1/bg.png","profile_background_image_url_https":"https://abs.twimg.com/images/themes/theme1/bg.png","profile_background_tile":false,"profile_image_url":"http://abs.twimg.com/sticky/default_profile_images/default_profile_normal.png","profile_image_url_https":"https://abs.twimg.com/sticky/default_profile_images/default_profile_normal.png","profile_link_color":"1DA1F2","profile_sidebar_border_color":"C0DEED","profile_sidebar_fill_color":"DDEEF6","profile_text_color":"333333","profile_use_background_image":true,"has_extended_profile":false,"default_profile":true,"default_profile_image":true,"following":false,"follow_request_sent":false,"notifications":false,"translator_type":"none"};

  	res.cookie("user",JSON.stringify(req.session.user));
    res.sendFile("/main.html",{root: __dirname});
});

app.get('/logout', function (req, res) {
	req.session.destroy();
	res.clearCookie('user');
    res.redirect("/");
});

app.listen(port, function () {
 console.log("ligado");
});


app.post('/signin', function(req, res) {
	
});


app.get("/request-token", function(req, res) {
        twitter.getRequestToken(function(err, requestToken, requestSecret) {
            if (err)
                res.status(500).send(err);
            else {
                _requestSecret = requestSecret;         
                res.redirect("https://api.twitter.com/oauth/authenticate?oauth_token=" + requestToken);
            }
        });
    });
  
  
 app.get("/access-token", function(req, res) {
        var requestToken = req.query.oauth_token,
      verifier = req.query.oauth_verifier;

        twitter.getAccessToken(requestToken, _requestSecret, verifier, function(err, accessToken, accessSecret) {
            if (err)
                res.status(500).send(err);
            else
                twitter.verifyCredentials(accessToken, accessSecret, function(err, user) {
                    if (err)
                        res.status(500).send(err);
                    else{
                        req.session.user = user; 
                        res.redirect("https://pinterest-clone-imm.herokuapp.com/");
                    }
                });
        });
    });


app.get("/photos",function(req,res){


  db.collection("pinterest").find().toArray(function(err, result) {
    if (err) throw err;
    //result.likes=result.likes.length;
    res.json(result);
  });

});

app.get("/addpin",function(req,res){
var resp=res;

	if(req.session.user){
		
		requestImageSize(req.query.url)
		.then(size => db.collection("pinterest").insertOne({user: req.session.user.screen_name, 
		img: req.query.url,
			likes: [],
			size: ""+size.width+"x"+size.height}, function(err, res) {
				if (err) throw err;
				resp.json({msg: "ok"});
		})	)
		.catch(err => console.error(err));

		
		
	}else{
    resp.json({msg:"permission denied"});
	
	}
});

app.get("/like",function(req,res){
var resp=res;
var id=new ObjectId(req.query.id);

  if(req.session.user){
  db.collection("pinterest").findOne({_id: id}, function(err, doc) {
    if (err) throw err;
    console.log(doc);
	
	if(doc.likes.length==0){
        console.log("adicionado");
        doc.likes.push({user: req.session.user.screen_name});
        }else{

    for(var i=0;i<doc.likes.length;i++){
      console.log(doc.likes[i]);
	  
	  
      if(doc.likes[i].user==req.session.user.screen_name){
		doc.likes.splice(i,1);
		  
        console.log("tchau "+doc.likes.length);
		
        break;
        }

        if(i==doc.likes.length-1 || doc.likes.length==1){
          console.log("oi");
        doc.likes.push({user: req.session.user.screen_name});
        }
      }

		}
		
		console.log(id);
		
		delete doc._id;
		console.log(doc);
		
		db.collection("pinterest").updateOne({_id:id}, {$set: {likes:doc.likes}}, function(err, res) {
			if (err) throw err;
			console.log(res.result);
			resp.json({likes: doc.likes.length});
		});


  });

  }else{
    resp.json({msg:"permission denied"});
  }

});
