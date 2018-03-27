import React, {Component} from 'react'
import ReactDOM from "react-dom"
import Masonry from "masonry-layout"
import imagesLoaded from 'imagesloaded'
import Container from "./components/Container"


var msnry=null;
var grid;

var newpin={};


  ReactDOM.render(<Container callback={callback}/>, document.getElementById('cont'));

    function hiddrop(){
      document.getElementById('drop').classList.remove("showdrop");

    }

    document.body.addEventListener('click', hiddrop, true); 


    function callback(){
      console.log("call")
      var grid = document.querySelector('.grid');

      var msnry = new Masonry( grid, {
        itemSelector: '.grid-item',
        columnWidth: '.grid-sizer',
        percentPosition: true
      });

      imagesLoaded( grid ).on( 'progress', function() {
        // layout Masonry after each image loads
        console.log("lay")
        msnry.layout();
      });
    }

