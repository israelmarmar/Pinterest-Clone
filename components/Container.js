import React, {Component} from 'react'
import Photos from "./Photos"
import $ from "jquery"
import axios from 'axios'
import {serialize, getCookie} from "./jsfunc"
import { createStore } from 'redux'
import {pinReducer} from "./pinReducer"
import { Provider } from 'react-redux'

if(document.cookie && getCookie("user")!=="undefined"){
  var user=JSON.parse(getCookie("user"));
  var username=user.name;
  console.log(user);

}

console.log(pinReducer)
const store = createStore(pinReducer);

export default class Container extends Component{

 submitform(ev){

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
  store.dispatch({
    type: 'USER_LIST_SUCCESS',
    data: result.data
  });

  console.log(store.getState());
  
})
}

mypics(){

  axios.get("/photos?user="+user.screen_name)

    .then(function(result) {    
      console.log(result.data);
      store.dispatch({
        type: 'USER_LIST_SUCCESS',
        data: result.data
      });

      console.log(store.getState());
      
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

      if(!user)
        return(<li className="btn btn-default navbar-btn btnnav" onClick={th.submit} id="signup">Sign up</li>)
          else
            return(<li className="btn btn-default navbar-btn btnnav" onClick={th.logout} id="signup"><Sign Out</li>)
        })()}

        {(function(){

          if(user)
            return(
          <li onClick={th.all} id="all" className="btnnav"><a href="#">All</a></li>
          )
        })()}

        {(function(){

          if(user)
            return(
          <li onClick={th.mypics} id="mypics" className="btnnav"><a href="#">My Pics</a></li>
          )
        })()}

        {(function(){
          if(user)
            return(
          <li id="addpic" onClick={th.drop} className="btnnav"><a href="#">Add Pic▾</a></li>
          )
        })()}


        </ul>

        </div>

        <div id="drop" className="dropdown-menu">
        <form className="add-form" action="/addpin" method="GET" onSubmit={this.submitform}>
        <input id="url" type="text" onClick={th.drop} name="url" placeholder="Pic url..." className="form-control" />
        <input id="desc" type="text" onClick={th.drop} name="desc" placeholder="Pic description..." className="form-control" />
        <button id="submit" onClick={th.drop} type="submit" className="btn btn-primary btn-block">Send</button>
        </form>
        </div>
        </div>
        <div id="page" className="container">


        <Provider store={store}>
        <Photos callback={this.props.callback}/>
        </Provider>

        
        </div>
        </div>)

    }
  }

