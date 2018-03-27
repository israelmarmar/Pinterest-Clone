import React, {Component} from 'react'
import axios from 'axios'
import Blike from './Blike'
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


class Photos extends Component{

  static get defaultProps() {
    return{
      data:[]
    };
  }

  componentDidMount() {

    const th=this;

    axios.get(this.props.user?("/photos?user="+this.props.user):"/photos")

    .then(function(result) {    
      console.log(result.data);
      th.props.dispatch({
        type: 'USER_LIST_SUCCESS',
        data: result.data
      });
      th.props.callback();
    })


  }

  over(e){
    var div=e.target.parentElement.childNodes;
    var img=div[0]

    if(div.length==3){
      var lik=div[2];
      var usr=div[1];
    }else{
      var lik=div[3];
      var rem=div[2];
      var usr=div[1];
    }

    if(lik && lik.classList){
      //lik.setAttribute("style", "top: 40px;left: 50px;")
      lik.style.top=img.style.top
      lik.style.left=img.style.left
      lik.classList.remove("hid")
    }

    if(usr && usr.classList){
      usr.classList.remove("hid");
      //usr.setAttribute("style", "top: 40px;left: 50px;")

      usr.style.top=img.style.top
      usr.style.left=img.style.left

    }

    if(rem){
      rem.classList.remove("hid");  
      rem.setAttribute("style", "top: 40px;left: 50px;")
    }

  }

  overb(e){
    var div=e.target.parentElement.childNodes;
    var img=div[0]

    if(div.length==3){
      var lik=div[2];
      var usr=div[1];
    }else{
      var lik=div[3];
      var rem=div[2];
      var usr=div[1];
    }


    if(lik)
      lik.classList.remove("hid");

    if(usr)
      usr.classList.remove("hid");

    if(rem)
      rem.classList.remove("hid");  
  }

  outb(e){
    var div=e.target.parentElement.childNodes;
    var img=div[0]

    if(div.length==3){
      var lik=div[2];
      var usr=div[1];
    }else{
      var lik=div[3];
      var rem=div[2];
      var usr=div[1];
    }


    if(lik)
      lik.classList.add("hid");

    if(usr)
      usr.classList.add("hid");

    if(rem)
      rem.classList.add("hid");  
  }

  out(e){

    var div=e.target.parentElement.childNodes;
    var img=div[0]

    if(div.length==3){
      var lik=div[2];
      var usr=div[1];
    }else{
      var lik=div[3];
      var rem=div[2];
      var usr=div[1];
    }


    if(lik)
      lik.classList.add("hid");

    if(usr && usr.classList)
      usr.classList.add("hid");

    if(rem)
      rem.classList.add("hid");
  }

  userpins(e){
    var th = this;
    console.log("Oi");
    console.log(e.target);

    axios.get("/photos?user="+e.target.title)

    .then(function(result) {    
      th.props.dispatch({
        type: 'USER_LIST_SUCCESS',
        data: result.data
      });
      console.log(result.data);
      
    })
  }

  delete(e){
    console.log(e.target.parentElement);
    var pin=e.target.parentElement;
    var th = this;
    this.serverRequest = 
    axios.get("/delete?id="+e.target.id)

    .then(function(result) {
      if(result.data)
      {
       th.props.dispatch({
        type: 'USER_LIST_SUCCESS',
        data: result.data
      });

      msnry.layout();
    }

  });


}

render() {
  var th=this;

  if(this.props.data.length==0){
    return(<img src="/load-gif-12.gif" height="80" width="80" />)
  }
  else
    return (<div id="grid" className='grid'>
      <div className="grid-sizer"></div>
  {this.props.data.map(function(item) {
    var w=parseInt(item.size.split("x")[0]);
    var h=parseInt(item.size.split("x")[1]);
    var mypin=item.likes.map(x => x.user).indexOf(user?user.screen_name:"")!==-1;
    return (
    <div className="divimg">
    <img id={item._id} className="grid-item" src={item.img} onMouseOver={(event) =>th.over(event)} onMouseOut={(event) =>th.out(event)}/>


    <button style={{"height": "25px", width:"25px", "backgroundImage": "url("+item.imguser+")", "backgroundSize": "contain"}} onMouseOver={th.overb} onClick={th.userpins} id="user" title={item.user} className={"user fixbtn hid btn btn-default btn-sm glyphicon"+(item.imguser?"":" glyphicon-user")} />


    { (function(){
      if(user && user.screen_name==item.user)
        return<button id={item._id} onClick={(event) =>th.delete(event)} onMouseOver={(event) =>th.overb(event)} className="btn fixbtn hid lk btn-default btn-sm glyphicon glyphicon-remove"/>
    })()}

    <Blike id={item._id} likes={item.likes.length} style={{"color": mypin?"#337ab7":"black"}} className={"lk hid btn btn-default btn-sm glyphicon glyphicon-star fixbtn "+(user?"":"disabled")}/>

    </div>
    
    )
  })}
  </div>)
}

}

export default connect(mapStateToProps)(Photos);