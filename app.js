var changepins=false;

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
  console.log(username);
  }

 var Blike= React.createClass({
	 
	 getInitialState: function () {
    return { 
            likes:this.props.likes

           };
  },
	 over: function(e){
    var div=lik=e.target.parentElement.childNodes;
    var lik=div[1];
    var usr=div[0];
    lik.classList.remove("hid");
    usr.classList.remove("hid");
	},

	like: function(e){
		e.target.classList.add("disabled");
    var th = this;
    this.serverRequest = 
      axios.get("/like?id="+e.target.id)
     
        .then(function(result) {    
	
	
	if(result){
		console.log("c");
    e.target.classList.remove("disabled");
	
          th.setState({
            likes: result.data.likes,
          });
		  
		  if(parseInt(result.data.likes)>e.target.value)
		  e.target.setAttribute("style", "color: "+"#337ab7");
		  else
	      e.target.setAttribute("style", "color: "+"black");
	}
      
        })
		},
  
	 render: function () {
		return (
          <button onMouseOver={this.over} style={this.props.style} id={this.props.id} onClick={this.like} className={this.props.className}>{this.state.likes}</button>)
         }
 });
  
var Photos= React.createClass({

  getInitialState: function () {
    return { 
            data:[]

           };
  },
  
   componentDidMount: function() {
   
  var th = this;
    this.serverRequest = 
      axios.get("/photos")
     
        .then(function(result) {    
      
          th.setState({
            data: result.data,
 
          });
      
        })
     
     
  },

  over: function(e){
    var div=lik=e.target.parentElement.childNodes;
    var lik=div[1];
    var usr=div[0];
    lik.classList.remove("hid");
    usr.classList.remove("hid");
  },

  out: function(e){
    var div=lik=e.target.parentElement.childNodes;
    var lik=div[1];
    var usr=div[0];
    lik.classList.add("hid");
    usr.classList.add("hid");
  },

  render: function () {
    var th=this;
    return (<div className='grid'>
      {this.state.data.map(function(item) {
        var w=parseInt(item.size.split("x")[0]);
        var h=parseInt(item.size.split("x")[1]);
		var mypin=item.likes.map(x => x.user).indexOf(user.screen_name)!==-1;
          return (
          <div className="grid-item" style={{"height": h/4, "width": w/4}}>
          <button onMouseOver={th.over} id="user" title={item.user} className={"user hid btn btn-default btn-sm glyphicon glyphicon glyphicon-user"}/>
        <Blike id={item._id} likes={item.likes.length} style={{"color": mypin?"#337ab7":"black"}} className={"lk hid btn btn-default btn-sm glyphicon glyphicon-star "+(user?"":"disabled")}/>
		 <img onMouseOver={th.over} onMouseOut={th.out} className="imgpin grid-item" src={item.img} style={{"height": h/4, "width": w/4}}/>
          </div>)
      })}
      </div>)
  }

});

var Container = React.createClass({
	
	 submitform: function(ev){

    ev.preventDefault();
	var btn=ev.target.submit;
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

  render: function () {
	var th=this;
  return(<div className="cont">
             <div className="navbar">
			 
             <img className="icoheader" src="picasa_21755.png" width="50" height="50" />
             {() => {
                
              }()}

                <div id="btnsnav">
                {() => {

                  if(!user)
                return(<div className="btn btn-default navbar-btn btnnav" onClick={this.submit} id="signup">Sign up</div>)
                  else
                    return(<div className="btn btn-default navbar-btn btnnav" onClick={this.logout} id="signup">Sign Out</div>)
                }()}

                {() => {

                if(user)
                  return(
                    <div id="all" className="btnnav">All</div>
                    )
                }()}

                {() => {

                if(user)
                  return(
                    <div id="mypics" className="btnnav">My Pics</div>
                    )
                }()}

                {() => {
                if(user)
                  return(
                    <div id="addpic" onClick={th.drop} className="btnnav">Add Pic▾</div>
                    )
                }()}


                </div>

             </div>
             <div className="page">
			 
			 <div id="drop" className="dropdown-menu">
			 <form className="add-form" action="/addpin" method="post" onSubmit={this.submitform}>
			 <input type="text" name="url" placeholder="Pic url..." className="form-control" />
			 <input type="text" name="desc" placeholder="Pic description..." className="form-control" />
			 <button id="submit" type="submit" className="btn btn-primary btn-block">Send</button>
			 </form>
			 </div>
			 
             <Photos />
             </div>
        </div>)

}
});


ReactDOM.render(<Container />, document.getElementById('cont'));

function hiddrop(){
document.getElementById('drop').classList.remove("showdrop"); 	
}

document.body.addEventListener('click', hiddrop, true); 