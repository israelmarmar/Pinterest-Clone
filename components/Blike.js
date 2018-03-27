import React, {Component} from 'react'
import axios from 'axios'

export default class Blike extends Component{

 constructor(props){ 
  super(props);
  this.state={likes:this.props.likes}
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


  if(lik)
    lik.classList.remove("hid");

  if(usr)
    usr.classList.remove("hid");

  if(rem)
    rem.classList.remove("hid");  
}

like(e){
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
}

render(){
  return (
    <button onMouseOver={(event)=> this.over(event)} style={this.props.style} id={this.props.id} onClick={(event)=> this.like(event)} className={this.props.className}>{this.state.likes}</button>)
  }
}