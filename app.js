var React = require('react');
var ReactDOM = require("react-dom");
var Redux = require("redux");
var connect= require("react-redux").connect;
var Provider=require("react-redux").Provider;
var createReactClass = require('create-react-class');
var Masonry = require("masonry-layout");
global.jQuery = require("jquery");
var $=require("jquery");
var axios = require('axios');
var bootstrap = require("bootstrap");
var jQueryBridget = require('jquery-bridget');
var PropTypes = require('prop-types');
var msnry=null;
var grid;

var newpin={};

function reload(){
	ReactDOM.unmountComponentAtNode(document.getElementById('page'));
	ReactDOM.render(<Photos />,document.getElementById('page'));
}

function serialize(form) {
    var result = [];
    if (typeof form === 'object' && form.nodeName === 'FORM')
        Array.prototype.slice.call(form.elements).forEach(function(control) {
            if (
                control.name && 
                !control.disabled && 
                ['file', 'reset', 'submit', 'button'].indexOf(control.type) === -1
            )
                if (control.type === 'select-multiple')
                    Array.prototype.slice.call(control.options).forEach(function(option) {
                        if (option.selected) 
                            result.push(encodeURIComponent(control.name) + '=' + encodeURIComponent(option.value));
                    });
                else if (
                    ['checkbox', 'radio'].indexOf(control.type) === -1 || 
                    control.checked
                ) result.push(encodeURIComponent(control.name) + '=' + encodeURIComponent(control.value));
        });
        return result.join('&').replace(/%20/g, '+');
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

if(document.cookie && getCookie("user")!=="undefined"){
  var user=JSON.parse(getCookie("user"));
  var username=user.name;
  console.log(user);

  }


 var Blike= createReactClass({
   
   getInitialState: function () {
    return { 
            likes:this.props.likes

           };
  },
   over: function(e){
    var div=lik=e.target.parentElement.childNodes;

    if(div.length==2){
    var lik=div[1];
    var usr=div[0];
  }else{
    var lik=div[2];
    var rem=div[1];
    var usr=div[0];
  }

    if(lik)
    lik.classList.remove("hid");

    if(usr)
    usr.classList.remove("hid");

    if(rem)
    rem.classList.remove("hid");  
  },

  like: function(e){
    console.log(e.target.id);
    var blik=e.target;
    blik.classList.add("disabled");
    var th = this;
    this.serverRequest = 
      axios.get("/like?id="+e.target.id)
     
        .then(function(result) {    
  
  
  if(result){
    console.log("c");
    blik.classList.remove("disabled");
  
          th.setState({
            likes: result.data.likes,
          });
      
      if(parseInt(result.data.likes)>blik.value)
      blik.setAttribute("style", "color: "+"#337ab7");
      else
        blik.setAttribute("style", "color: "+"black");
  }
      
        })
    },
  
   render: function () {
    return (
          <button onMouseOver={this.over} style={this.props.style} id={this.props.id} onClick={this.like} className={this.props.className}>{this.state.likes}</button>)
         }
 });



 var pinReducer = function(state, action) {
  if (state === undefined) {
    state = [];
  }
  if (action.type === 'ADD_USER') {

    return [action.data].concat(state);
  }
  if (action.type === 'USER_LIST_SUCCESS') {
    state= (action.data);
  }
  return state;
  }

  const store = Redux.createStore(pinReducer);

  const mapStateToProps = function(store) {
    console.log(store);
  return {
    data: store
  };
  }


var Photos= createReactClass({

  getDefaultProps() {
    return{
      data:[]
    };
  },

   componentDidMount: function() {
   
  var th = this;
    this.serverRequest = 
      axios.get(this.props.user?("/photos?user="+this.props.user):"/photos")
     
        .then(function(result) {    
          console.log(result.data);
          store.dispatch({
          type: 'USER_LIST_SUCCESS',
          data: result.data
          });

          console.log(store.getState());

init();
        })
     
     
  },

  over: function(e){

    var div=e.target.childNodes;

    if(div.length==2){
    var lik=div[1];
    var usr=div[0];
  }else{
    var lik=div[2];
    var rem=div[1];
    var usr=div[0];
  }

    if(lik && lik.classList)
    lik.classList.remove("hid");

    if(usr && usr.classList)
    usr.classList.remove("hid");

    if(rem)
    rem.classList.remove("hid");  
  },

  overb: function(e){
    var div=lik=e.target.parentElement.childNodes;
    
    if(div.length==2){
    var lik=div[1];
    var usr=div[0];
  }else{
    var lik=div[2];
    var rem=div[1];
    var usr=div[0];
  }

    if(lik)
    lik.classList.remove("hid");

    if(usr)
    usr.classList.remove("hid");

    if(rem)
    rem.classList.remove("hid");  
  },

  outb: function(e){
    var div=lik=e.target.parentElement.childNodes;

    if(div.length==2){
    var lik=div[1];
    var usr=div[0];
  }else{
    var lik=div[2];
    var rem=div[1];
    var usr=div[0];
  }

    if(lik)
    lik.classList.add("hid");

    if(usr)
    usr.classList.add("hid");

    if(rem)
    rem.classList.add("hid");  
  },

  out: function(e){

    var div=e.target.childNodes;

    if(div.length==2){
    var lik=div[1];
    var usr=div[0];
  }else{
    var lik=div[2];
    var rem=div[1];
    var usr=div[0];
  }

    if(lik)
    lik.classList.add("hid");

    if(usr && usr.classList)
    usr.classList.add("hid");

    if(rem)
    rem.classList.add("hid");
  },

  userpins: function(e){
    var th = this;
    console.log("Oi");
    console.log(e.target);

    this.serverRequest = 
      axios.get("/photos?user="+e.target.title)
     
        .then(function(result) {    
        store.dispatch({
          type: 'USER_LIST_SUCCESS',
          data: result.data
          });
          console.log(result.data);
      
        })
  },

  delete: function(e){
    console.log(e.target.parentElement);
    var pin=e.target.parentElement;
    var th = this;
    this.serverRequest = 
      axios.get("/delete?id="+e.target.id)
     
        .then(function(result) {
          if(result.data)
          {
           console.log(msnry);
            
          store.dispatch({
          type: 'USER_LIST_SUCCESS',
          data: result.data
          });

          msnry.layout();
          }
 
          });
      
        
  },

  render: function () {
    var th=this;

    if(this.props.data.length==0){
      return(<img src="/load-gif-12.gif" height="80" width="80" />)
	}
    else
    return (<div id="grid" className='grid'>
      {this.props.data.map(function(item) {
        var w=parseInt(item.size.split("x")[0]);
        var h=parseInt(item.size.split("x")[1]);
    var mypin=item.likes.map(x => x.user).indexOf(user?user.screen_name:"")!==-1;
          return (
          <div id={item._id} className="grid-item" onMouseOver={th.over} onMouseOut={th.out} style={{"height": h/4, "width": ((w/4)/1200)*100+"%", "backgroundImage": "url("+item.img+")", "backgroundSize": "100% 100%"}}>
          <button style={{"height": "25px", width:"25px", "backgroundImage": "url("+item.imguser+")", "backgroundSize": "contain"}} onMouseOver={th.overb} onClick={th.userpins} id="user" title={item.user} className={"user hid btn btn-default btn-sm glyphicon"+(item.imguser?"":" glyphicon-user")} />
        

          { (function(){
            if(user && user.screen_name==item.user)
              return<button id={item._id} onClick={th.delete} onMouseOver={th.overb} className="btn hid lk btn-default btn-sm glyphicon glyphicon-remove"/>
          })()}

        <Blike id={item._id} likes={item.likes.length} style={{"color": mypin?"#337ab7":"black"}} className={"lk hid btn btn-default btn-sm glyphicon glyphicon-star "+(user?"":"disabled")}/>
        
          </div>)
      })}
      </div>)
  }

});

var Photos=connect(mapStateToProps)(Photos);


var Container = createReactClass({
  
   submitform: function(ev){

    ev.preventDefault();
  var btn=ev.target.submit;
  var inurl=ev.target.url;
  var indesc=ev.target.desc;
  btn.classList.add("disabled");
  var value=btn.innerHTML;
    btn.innerHTML="<i class='fa fa-circle-o-notch fa-spin'></i>"+btn.innerHTML;
  
  $.ajax({
            type: ev.target.method,
            url: ev.target.action,
            data: serialize(ev.target),
            success: function (data) {
      
      if(data.msg=="ok"){
      btn.innerHTML=value;
      btn.classList.remove('disabled');
      inurl.value="";
      indesc.value="";
      document.getElementById('drop').classList.remove("showdrop");
      
      store.dispatch({
          type: 'ADD_USER',
          data: data
      });
      
      init();
      }
      
      }
     });
  
    },

  submit: function(){

    window.location.href="/request-token";
  },
  
  drop: function(e){
  document.getElementById('drop').classList.add("showdrop");  
  },

  all: function(){
     var th = this;
    this.serverRequest = 
      axios.get("/photos")
     
        .then(function(result) {    
          console.log(result.data);
          store.dispatch({
          type: 'USER_LIST_SUCCESS',
          data: result.data
          });

          console.log(store.getState());
         init();
        })
  },

  mypics: function(){

      axios.get("/photos?user="+user.screen_name)
     
        .then(function(result) {    
          console.log(result.data);
          store.dispatch({
          type: 'USER_LIST_SUCCESS',
          data: result.data
          });

          console.log(store.getState());
         init();
        })
     
  },

  logout: function(){
    window.location.href="/logout";
  },

  render: function () {
  var th=this;
  return(<div className="cont">
             <div className="navbar">
       
             <img className="icoheader" src="picasa_21755.png" width="50" height="50" />

                <div id="btnsnav">
                {(function(){

                  if(!user)
                return(<div className="btn btn-default navbar-btn btnnav" onClick={th.submit} id="signup">Sign up</div>)
                  else
                    return(<div className="btn btn-default navbar-btn btnnav" onClick={th.logout} id="signup">Sign Out</div>)
                })()}

                {(function(){

                if(user)
                  return(
                    <div onClick={th.all} id="all" className="btnnav">All</div>
                    )
                })()}

                {(function(){

                if(user)
                  return(
                    <div onClick={th.mypics} id="mypics" className="btnnav">My Pics</div>
                    )
                })()}

                {(function(){
                if(user)
                  return(
                    <div id="addpic" onClick={th.drop} className="btnnav">Add Pic▾</div>
                    )
                })()}


                </div>

             </div>
			 
			 <div id="drop" className="dropdown-menu">
       <form className="add-form" action="/addpin" method="GET" onSubmit={this.submitform}>
       <input id="url" type="text" onClick={th.drop} name="url" placeholder="Pic url..." className="form-control" />
       <input id="desc" type="text" onClick={th.drop} name="desc" placeholder="Pic description..." className="form-control" />
       <button id="submit" onClick={th.drop} type="submit" className="btn btn-primary btn-block">Send</button>
       </form>
       </div>
             <div id="page" className="page">
       
       
       
             <Photos />
             </div>
        </div>)

}
});


ReactDOM.render(<Provider store={store}><Container /></Provider>, document.getElementById('cont'));

function hiddrop(){
document.getElementById('drop').classList.remove("showdrop");

}

document.body.addEventListener('click', hiddrop, true); 


function init(){
	
  if(msnry){
    console.log("oi");
    msnry.layout();
  }
 
  grid = document.querySelector('.grid');
  msnry = new Masonry( grid, {
  // options... 
  itemSelector: '.grid-item',
  columnWidth: 160
  });



}

