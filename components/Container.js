import React, {Component} from 'react'
import Photos from "./Photos"
import $ from "jquery"
import axios from 'axios'
import {serialize, getCookie} from "./jsfunc"

import { connect } from 'react-redux'

if(document.cookie && getCookie("user")!=="undefined"){
  var user=JSON.parse(getCookie("user"));
  var username=user.name;
  console.log(user);

}


const mapStateToProps = function(store) {
  console.log(store);
  return {
    data: store
  };
}


class Container extends Component{

 submitform(ev){

  ev.preventDefault();
  var th=this;
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

        console.log(th)

        th.props.dispatch({
          type: 'ADD_USER',
          data: data
        });
        th.props.callback()
        
      }
      
    }
  });
  
}


submit(){

  window.location.href="/request-token";
}

drop(e){
  document.getElementById('drop').classList.add("showdrop");  
}

all(){
 var th = this;
 axios.get("/photos")

 .then(function(result) {    
  console.log(result.data);
  th.props.dispatch({
    type: 'USER_LIST_SUCCESS',
    data: result.data
  });

  th.props.callback()
  
})
}

mypics(){
  var th = this;
  axios.get("/photos?user="+user.screen_name)

    .then(function(result) {    
      console.log(result.data);
      th.props.dispatch({
        type: 'USER_LIST_SUCCESS',
        data: result.data
      });
      
    })

  }

  logout(){
    window.location.href="/logout";
  }

  render() {
    var th=this;
    return(<div className="cont">
     <div className="navbar navbar-static-top">

      <div className="container">
     <img className="navbar-header" src="picasa_21755.png" width="50" height="50" />

     <ul className="nav navbar-nav navbar-right">

     

        {(function(){

          if(user)
            return(
          <li onClick={(event) =>th.all(event)} id="all" className="btnnav"><a href="#">All</a></li>
          )
        })()}

        {(function(){

          if(user)
            return(
          <li onClick={(event) =>th.mypics(event)} id="mypics" className="btnnav"><a href="#">My Pics</a></li>
          )
        })()}

        {(function(){
          if(user)
            return(
          <li id="addpic" onClick={th.drop} className="btnnav"><a href="#">Add Pic▾</a></li>
          )
        })()}

        {(function(){

      if(!user)
        return(<li className="btn btn-default navbar-btn btnnav" onClick={th.submit} id="signup">Sign up</li>)
          else
            return(<li className="btn btn-default navbar-btn btnnav" onClick={th.logout} id="signup">Sign Out</li>)
        })()}


        </ul>

        </div>

        <div id="drop" className="dropdown-menu">
        <form className="add-form" action="/addpin" method="GET" onSubmit={(event) =>this.submitform(event)}>
        <input id="url" type="text" onClick={(event) =>th.drop(event)} name="url" placeholder="Pic url..." className="form-control" />
        <input id="desc" type="text" onClick={(event) =>th.drop(event)} name="desc" placeholder="Pic description..." className="form-control" />
        <button id="submit" onClick={(event) =>th.drop(event)} type="submit" className="btn btn-primary btn-block">Send</button>
        </form>
        </div>
        </div>
        <div id="page" className="container">


        <Photos callback={this.props.callback}/>

        
        </div>
        </div>)

    }
  }

export default connect(mapStateToProps)(Container);
