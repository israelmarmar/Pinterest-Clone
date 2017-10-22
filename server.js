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
    if(req.session.user)
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
console.log(req.query.user);

  db.collection("pinterest").find((req.query.user)?{user: req.query.user}:{}).sort({date: -1}).toArray(function(err, result) {
    if (err) throw err;
    //result.likes=result.likes.length;
    res.json(result);
  });

});

app.get("/addpin",function(req,res){
var resp=res;

	if(req.session.user){
		
    console.log(new Date(Date.now()).toLocaleString());
		requestImageSize({ url: req.query.url, "rejectUnauthorized": false, headers: { 'User-Agent': 'request-image-size' } })
		.then(size => db.collection("pinterest").insertOne({user: req.session.user.screen_name, 
		img: req.query.url,
			likes: [],
			size: ""+size.width+"x"+size.height, 
      imguser: req.session.user.profile_image_url,
      date: new Date(Date.now()).toLocaleString()}, function(err, res) {
				if (err) throw err;
        res.ops[0].msg="ok";
				resp.json(res.ops[0]);
        console.log(size);
        console.log(res.ops[0]);
		})	

    )
		.catch(err => db.collection("pinterest").insertOne({user: req.session.user.screen_name, 
		img: "placeholder.png",
			likes: [],
			size: "1000x1000", 
      imguser: req.session.user.profile_image_url,
      date: new Date(Date.now()).toLocaleString()}, function(err, res) {
				if (err) throw err;
        res.ops[0].msg="ok";
				resp.json(res.ops[0]);
        console.log(res.ops[0]);
		})	);

		
		
	}else{
    resp.json({msg:"permission denied"});
	
	}
});

app.get("/delete",function(req,res){
var id=new ObjectId(req.query.id) || req.query.id;
var resp=res;

  if(req.session.user){
  
  db.collection("pinterest").findOne({_id: id}, function(err, doc) { 
 console.log(doc);
    if(doc.user===req.session.user.screen_name){
    db.collection("pinterest").deleteOne({_id:id}, function(err, obj) {
    if (err) throw err;
    console.log("1 document deleted");
    resp.json({msg: "ok"});
    });
  }else
  resp.json({msg:"permission denied"});

  });
    
    
  }else{
    resp.json({msg:"permission denied"});
  
  }

});

app.get("/like",function(req,res){
var resp=res;
var id=new ObjectId(req.query.id) || req.query.id;

  if(req.session.user){
  db.collection("pinterest").findOne({_id: id}, function(err, doc) {
    if (err) throw err;
    console.log(doc);
	
  if(doc){
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

  }
  });

  }else{
    resp.json({msg:"permission denied"});
  }

});
