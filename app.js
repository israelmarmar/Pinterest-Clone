var changebook=false;

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

  render: function () {
    return (<div className='grid'>
      {this.state.data.map(function(item) {

          return (
          <a href="#"><img src={item.img} className="grid-item"/></a>)
      })}
      </div>)
  }

});

var Container = React.createClass({

  submit: function(){

    window.location.href="/request-token";
  },


  render: function () {

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
                    <div className="btnnav">All</div>
                    )
                }()}

                {() => {

                if(user)
                  return(
                    <div className="btnnav">My Pics</div>
                    )
                }()}

                {() => {
                if(user)
                  return(
                    <div className="btnnav">Add Pic▾</div>
                    )
                }()}


                </div>

             </div>
             <div className="page">
             <Photos />
             </div>
        </div>)

}
});

$(function() {
$('.grid').masonry({
  itemSelector: '.grid-item',
  columnWidth: 160
});
});


ReactDOM.render(<Container />, document.getElementById('cont'));