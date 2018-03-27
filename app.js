import React, {Component} from 'react'
import ReactDOM from "react-dom"
import Masonry from "masonry-layout"
import imagesLoaded from 'imagesloaded'
import Container from "./components/Container"
import { createStore } from 'redux'
import {pinReducer} from "./components/pinReducer"
import { Provider } from 'react-redux'

var msnry=null;
var grid;

var newpin={};
const store = createStore(pinReducer)

  ReactDOM.render(<Provider store={store}><Container callback={callback}/></Provider>, document.getElementById('cont'));

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

      msnry.layout();

      imagesLoaded( grid ).on( 'progress', function() {
        // layout Masonry after each image loads
        console.log("lay")
        msnry.layout();
      });
    }

