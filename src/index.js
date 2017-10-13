/*======================================================================
JS TO PREPARE AND START APP

ensure this JS file is the last to be loaded in index.html 
This allows all other resources to be prepared aheaed of 
time so the app can launch smoothly.
======================================================================*/

import React, { Component, PureComponent } from 'react';
import ReactDOM from 'react-dom';
import Timesheet from './components/timesheet';

var winNav = WinJS.Navigation;
winNav.loadFragment = loadFragment;	
winNav.unloadFragment = unloadFragment;

function loadFragment(url, host, options){
    WinJS.Utilities.empty(host);
    WinJS.UI.Pages.render(url, host, options);
};

function unloadFragment(host){
    WinJS.Utilities.empty(host);		
};

ReactDOM.render(<Timesheet />, document.getElementById("applicationWrapper"));