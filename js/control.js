/*======================================================================
JS LIBRARY FOR MANAGING PROPERTIES
======================================================================*/
(function(){
	
	"use strict"
    
    function back(){ WinJS.Navigation.back(); };
	
	//Function to addEventListeners.
	//Accepts an array of objects to easily
	//add event listeners and prevent memory leaks
	function addListeners (array){
        
        var success = [];
        
		array.forEach(function(item){
            
            //String Representation of Query
            var targetString = "";
            
			if(item.id){
                
                //Find Element by Id
                targetString = item.id;
				var el = document.getElementById(item.id);
                commitListener(el, item.event, item.attach);
			} else if(item.el) {
                
                //Use Element Object
                targetString = item.el.id;
                commitListener(item.el, item.event, item.attach);
			} else if(item.parentId){
                
                //Use Element Children
                targetString = item.parentId;
				var parentEl = document.getElementById(item.parentId);
				var elArray = parentEl && parentEl.childNodes;
                
                if(!elArray){ return fail(); };
                
                for(var i = 0; i < elArray.length; i++){
                    commitListener(elArray[i], item.event, item.attach);                    
                };
            } else {
                targetString = "undefined element";
                fail();
            };
			
            function commitListener(el, event, attach){
                if(!el || !event || !attach){ return fail(); };
                
                if(el.dataset && el.dataset.bind){
                    //attach = attach.bind(el.dataset.bind);
                };
                
                //Attach Event
                el.addEventListener(event, attach);
                
                //Register Event
                if(!item.preventRegister){
                    success.push({ el: el, event: event, attach: attach });
                };
            };
            
            function fail(){
                console.log("Cannot find " + targetString + " to add listener.");
            };
		});
        
        return success;
	};
	
	//Function to removeEventListeners.
	//Accepts an array of objects to easily
	//remove event listeners and prevent memory leaks
	function removeListeners(array){        
		array.forEach(function(item){
            
            var targetString = "";
            
			if(item.id){
                targetString = item.id;
				var el = document.getElementById(item.id);
                commitListener(el, item.event, item.attach);
			} else if(item.el) {
                targetString = item.el.id;
                commitListener(item.el, item.event, item.attach);
			} else if(item.parentId){
                targetString = item.parentId;
				var parentEl = document.getElementById(item.parentId);
				var elArray = parentEl && parentEl.childNodes;
                
                if(!elArray){ return fail(); };
                
                for(var i = 0; i < elArray.length; i++){
                    commitListener(elArray[i], item.event, item.attach);                    
                };
            };
			
            function commitListener(el, event, attach){
                if(!el || !event || !attach){ return fail(); };                
                
                //Attach Event
                el.removeEventListener(event, attach);
            };
            
            function fail(){
                console.log("Cannot find " + targetString + " to remove listener.");
            };
		});
	};
    
    //Function for adding focus/blur listners
    //This is to create continuity between table cells
    //throughout the app so they listen for the same events
    function addCellListeners(listenArr){
        setImmediate(function(){
            listenArr.loopItems(function(listenObj){

                //Focus Listeners
                if(listenObj.focus) addCellListener(listenObj.el, listenObj.focus, "focus");

                //Click Listeners
                if(listenObj.click) addCellListener(listenObj.el, listenObj.click, "click");

                //Blur Listeners
                if(listenObj.blur){
                    listenObj.el.addEventListener("blur", listenObj.blur);
                    listenObj.el.addEventListener("keyup", checkKeyEvent);                
                };

                function checkKeyEvent(args){                    
                    if (args.type == "keyup" && args.keyCode == 13) listenObj.blur.call(this, args);
                };       
            });
        });

        function addCellListener(el, funcObj, event){
            if(funcObj.constructor === Array){
                funcObj.forEach(commitListener);
            } else {
                commitListener(funcObj);
            };

            function commitListener(func){ el.addEventListener(event, func); };
        };
    };
    
	//Function to display object
    function vardump(obj, indent) {
        
        indent = indent || 1;
        var out = '';
    
        switch (typeof obj) {
            case "object":
                out += "\n";
                
                if(obj.length !== undefined && obj.length == 0) return "[]";
                
                for (var i in obj) {
                    out += Array(indent).join(" ") + i + ": ";
                    out += vardump(obj[i], indent+3);
                };
                
                break;
            default: //number, string, boolean, null, undefined
                if(typeof obj == "string") obj = '"' + obj + '"';
                out += obj + " (" + typeof obj + ")\n";
                break;
        };
        
        return out;
    };
	
		
	//Function for reducing DOM chattiness.
	//Use this instead of getElementById for 
	//common elements which are often accessed
	function getEl(id, elCache){
		if(elCache[id]){ return elCache[id]; };
		
		var el = document.getElementById(id);	
		if(el){
			elCache[id] = el;
			return el;
		};
		
		return false;
	};

    function newCache(){
        var elCache = {};

        return {
            getEl: function(id){

                if(elCache[id]){ return elCache[id]; };
                
                var el = document.getElementById(id);	
                if(el){
                    elCache[id] = el;
                    return el;
                };
                
                return false;
            },
        };
    };
	
	//Function to safely get properties.
	//This function safely transverses down
	//property trees avoiding JavaScript execptions
	function getProperty(nextProp, propertyTree, newValue){
		
		var finalProperty;
		
		while(propertyTree.length > 1){	
			nextProp = nextProp[propertyTree.shift()];			
			if(nextProp === undefined){ return undefined };
		};
		
		finalProperty = propertyTree[0];
		
		if(newValue !== undefined){
			nextProp[finalProperty] = newValue;
		};
		
		return nextProp[finalProperty];
	};
    
    function startTimers(arr){
        arr.forEach(function(timeTitle){            
		  console.time(timeTitle);	
        });
    };
    
    function stopTimers(arr){
        arr.forEach(function(timeTitle){   
			console.timeEnd(timeTitle);
        });
    };
	
	function delayWork(args, func){
		setImmediate(function(){
			func(args);						
		});
	};
    
    //Accepts an array of functions and calls them
    function callFunctions(arr, args){
        if(arr && typeof arr == "object" && arr.length > 0){
            arr.forEach(function(func){
                if (func && typeof func == "function") func(args);
            });
        };
    };
	
    //Check if browser is IE
	function isIE(){
		return false || !!document.documentMode;
	};
	
    //Formats Currency with Commas
	function displayNumber(nStr, dp){

        nStr = floatTwo(nStr);
        if(isNaN(nStr)) nStr = 0;
        if(dp && typeof dp == "number") nStr = nStr.toFixed(dp);
        
        nStr += '';
        
		var x = nStr.split('.');
		var x1 = x[0];
		var x2 = x.length > 1 ? '.' + Rpad(x[1],2) : '';
        var rgx = /(\d+)(\d{3})/;
        
		while (rgx.test(x1)) {
			x1 = x1.replace(rgx, '$1' + ',' + '$2');
        };
        
		return x1 + x2	
    };

    //Used to overcome floating point addition errors
    function sumfloats(x,y){
        var rawSum = x + y;
        var fixedSum = rawSum.toFixed(6);
        var asNumber = parseFloat(fixedSum);

        return asNumber;
    };
    
    //Formats Number As Float with Max 2DP
    function floatTwo(val){
        var float = parseFloat(val);
        var rounded = Math.round(float * 100) / 100;
        var asNumber = parseFloat(rounded);
    
        return asNumber;
    }
    
    function shuffleArray(array) {
        var currentIndex = array.length, temporaryValue, randomIndex;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {

            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        };

        return array;
    };
        
    function ensurePcnt(num){
        if(num < 0){
            return 0;
        } else if (num > 100){
            return 100;
        } else {
            return num;
        };
    };    
    
    function inv(v, num1, num2){
        //Default num1 to 0
        if(num1 === undefined) num1 = 0;
        
        //Default num2 to 1
        if(num2 === undefined) num2 = 1;
        
        //Toggle
        if(v == num1){
            return num2;
        } else {
            return num1;
        };
    };
    
    function navActive(){
        var thisElCache = {};
        var activeEl;
        
        function set(id){
            //Remove Old Active 
            clear();
            //Set New Active
            if(id){
                activeEl = Control.getEl(id, thisElCache);
                activeEl.classList.add("navActive");
            };
        };
        
        function clear(){
            if(activeEl){ 
                activeEl.classList.remove("navActive"); 
            };
        };
        
        return set;
    };
    
    function mutateItem(changes){
        var that = this;
        changes.forEach(function(change){
            that[change.prop] = change.value;
        });
        return that;
    };
    
    Array.prototype.unloop = function unloop(func){
        var i = this.length;
        
        while(i--){
            func(this[i]);
        };
        
        return false;        
    };
    
    Array.prototype.contains = function(id){
        var i = this.length;
        
        while(i--){
            if (this[i] == id) { 
                return true; 
            };      
        };
        
        return false;
    };
    
    Array.prototype.loopItems = function loopItems(func){
        var arrayLength = this.length
        
        for (var i = 0; i < arrayLength; i++){
            func(this[i]);
        };
        
        return false;        
    };

    Date.prototype.getWeek = function(){
        var d = new Date(+this);
        d.setHours(0,0,0,0);
        d.setDate(d.getDate()+4-(d.getDay()||7));
        return Math.ceil((((d-new Date(d.getFullYear(),0,1))/8.64e7)+1)/7);
    };
    
    //Open Project Folder
	function fileNav(projectNum, btnEl){
		if(projectNum){
			var split = projectNum.split("-");
			if(split.length == "2"){
				var rootPath = 'file://ANDDC01/projects/';
				var baseNum = split[0];
				//Navigate
				if(isIE()){
					try {
						document.location = (rootPath + baseNum + "/" + projectNum + "/");
					} catch (err) {
						document.getElementById("accessDeniedFlyout").winControl.show(btnEl);
					};
				} else {
					document.getElementById("accessDeniedFlyout").winControl.show(btnEl);					
				};
				//system("cmd /c C:[path to file]");	
			};
		};
	};
	
    //Open Project Photos Folder
	function photoNav(projectNum, btnEl){
		if(projectNum){
			var split = projectNum.split("-");
			if(split.length == "2"){
				var rootPath = 'file://ANDDC01/projects/PHOTOS/';
				var baseNum = split[0];
				//Navigate
				if(isIE()){
					try {
						document.location = (rootPath + baseNum + "/" + projectNum + "/");
					} catch (err) {
						document.getElementById("accessDeniedFlyout").winControl.show(btnEl);
					};
				} else {
					document.getElementById("accessDeniedFlyout").winControl.show(btnEl);					
				};
				//system("cmd /c C:[path to file]");	
			};
		};
	};
    
	//Function to catch accepted errors.
	function acceptError(err){
		return false;
	};
	
	//Returns a promise with error callback
	function promiseError(args){
		return new WinJS.Promise(function(complete, error, progress){
			error(args);
		});
	};
	
    //Throws Alert
	function dbError(){
		alert("Database Error");	
	};

	//Show Help Flyout
	function showSearchHelp(args){
		document.getElementById("searchHelpFlyout").winControl.show(args.currentTarget);
	};
	
    //Stops load animation in smooth manner 
	function smoothStop(startTime, targetEl){
		var elapsed; var smoothStop; var smoothDivisions;
		
		//Calculate remaining time for animation
		elapsed = new Date() - startTime;
		smoothDivisions = Math.floor(elapsed/500);
		smoothStop = 500 - (elapsed - (500 * smoothDivisions));
		
		//Stop timer and animation
		setTimeout(function(){
			if(targetEl){ targetEl.classList.remove("saveInProgress"); };
		}, smoothStop);		
	};
    
    function pickDate(anchor, startDate, showClear){
        return new WinJS.Promise(function(complete, error, progress){
            var flyoutEl = Control.getEl("flyoutHost", GlobalFragment.fragmentEls);
            var options = {
                anchor: anchor,
                startDate: startDate,
                showClear: showClear,
                reload: [complete],
                cancel: [error]
            };

            //Remove focus from element or
            //flyout will return focus when it closes
            anchor.blur();
            WinJS.Navigation.loadFragment("pages/globalFragments/globalDatePicker/fragment_datePicker.html", flyoutEl, options);
        });
	};
    
    function dateCF(datenum){
        if(!isNaN(datenum)){
            return Control.formatDate(new Date(datenum),"d. .m");
        };
    };
    
    function setDate(date){
        
        if(!date) return false;
        
        if(date == "now") date = new Date();
        
        return date.setHours(12,0,0,0);
    };
    
    function formatDate(newDate, formatString){

        if(!newDate) return ""; 
        
        var dateFormats = {
            M: function(thisDate){ return Config.monthName[thisDate.getMonth()]; },
            m: function(thisDate){ return Config.shortMonthName[newDate.getMonth()]; },
            MM: function(thisDate){ return Lpad(newDate.getMonth() + 1, 2); },
            D: function(thisDate){ return Config.shortDayName[thisDate.getDay()] },
            d: function(thisDate){ return Lpad(newDate.getDate(), 2); },
            DD: function(thisDate){ return Config.dayName[thisDate.getDay()] },
            Y: function(thisDate){ return newDate.getFullYear(); },
            y: function(thisDate){ return toString(newDate.getFullYear()).slice(-2); },
            W: function(thisDate){
                var onejan = new Date(thisDate.getFullYear(),0,1);
                var millisecsInDay = 86400000;
                return Math.ceil((((thisDate - onejan) /millisecsInDay) + onejan.getDay()+1)/7);
            },
        };
        
        formatString = formatString || "d. .m";
        var out = "";
        var formatArray = formatString.split(".");
        
        if(typeof newDate.getMonth != "function") newDate = new Date(parseInt(newDate));
        
        formatArray.forEach(function(dateFormat){
            var formatted = dateFormats[dateFormat];
            if(formatted){
                out += formatted(newDate);
            } else {
                out += dateFormat;
            };
        });
        
        return out;
    };
    
    function daysBetween(startDate, endDate) {            
        var millisecondsPerDay = 86400000;
        var dayDifference = (endDate - startDate) / millisecondsPerDay;
        return Math.round(dayDifference);
    };
    
    function localDate(newDate){
        return newDate.toLocaleDateString();      
    };
    
    function Lpad(num, size) {
        var s = num+"";
        while (s.length < size) s = "0" + s;
        return s;
    };

    function Rpad(num, size) {
        var s = num+"";
        while (s.length < size) s = s + "0";
        return s;
    };

    function asyncAlert(){

        var cover = document.getElementById("genericCover");
        var elTree = {
            confirmation: {
                container: document.getElementById("confirmationForm"),
                titleEl: document.getElementById("confirmationTitle"),
                msgEl: document.getElementById("confirmationMsg"),
                submit: document.getElementById("confirmationSubmit"), 
                cancel: document.getElementById("confirmationCancel"), 
            },
            alert: {
                container: document.getElementById("alertCover"),
                titleEl: document.getElementById("alertTitle"),
                msgEl: document.getElementById("alertMsg"),
                submit: document.getElementById("alertCancel"), 
            },
            input: {
                container: document.getElementById("newPassword"),
                titleEl: document.getElementById("newPasswordTitle"),
                return: [
                    document.getElementById("newPasswordInput"),
                    document.getElementById("newPasswordInput_new"),
                    document.getElementById("newPasswordInput_confirm"),
                ],
                submit: document.getElementById("newPasswordSubmit"), 
                cancel: document.getElementById("newPasswordCancel"), 
            }
        }

        //Public Functions

        function alert(title, msg){
            var els = elTree.alert;
            return alertPromise.call(els, title, msg, "alert", els.submit);
        };

        function confirmationAlert(title, msg){
            var els = elTree.confirmation;
            return alertPromise.call(els, title, msg, "confirm", els.submit);
        };

        function inputConfirm(title, msg){
            var els = elTree.input;
            return alertPromise.call(els, title, null, "confirm", els.return[0]);
        };

        //Private Functions

        function alertPromise(title, msg, alertType, focusMe){

            var container = this.container
            var titleEl = this.titleEl;
            var msgEl = this.msgEl;
            var submit = this.submit; 
            var cancel = this.cancel; 
            var returnEls = this.return; 

            return new WinJS.Promise(function(complete, err){

                var listeners;

                if (alertType == "confirm") {
                    listeners = [
                        { el: container, event: "submit", attach: submitForm },
                        { el: cancel, event: "click", attach: cancelForm },
                    ];
                } else if (alertType == "alert") {
                    listeners = [
                        { el: container, event: "submit", attach: okForm },
                    ];
                } else {
                    err();
                };

                addListeners(listeners);

                titleEl && (titleEl.textContent = title || "Undefined");
                msgEl && (msgEl.textContent = (msg || ""));

                cover.classList.remove("displayNone");
                container.classList.remove("displayNone");

                focusMe && focusMe.focus && focusMe.focus();

                //Private Functions
                function submitForm(){
                    var returnValues = [];

                    returnEls && returnEls.forEach(function(el){
                        returnValues.push(el.value);
                        el.blur();
                    });

                    cleanForm();
                    complete(returnValues);
                };

                function cancelForm(){
                    cleanForm();
                    err();
                };

                function okForm(){
                    cleanForm();
                    complete();
                };

                function cleanForm(){

                    cover.classList.add("displayNone");
                    container.classList.add("displayNone");

                    removeListeners(listeners);
                    container.reset();

                    titleEl && (titleEl.textContent = "");
                    msgEl && (msgEl.textContent = "");
                };
            });
        };

        return {
            alert: alert,
            confirmation: confirmationAlert,
            inputConfirm: inputConfirm
        };
    };
    
	//Namespace for Control functions.
	WinJS.Namespace.define("Control", {
		//Listeners
        back: back,
		addListeners: addListeners,
		removeListeners: removeListeners,
        addCellListeners: addCellListeners,

		//JS Manipulation
        vardump: vardump,
		getEl: getEl,
        newCache: newCache,
		getProperty: getProperty,
		delayWork: delayWork,
        callFunctions: callFunctions,
        startTimers: startTimers,
        stopTimers: stopTimers,
        shuffleArray: shuffleArray,
        ensurePcnt: ensurePcnt,
        inv: inv,
        mutateItem: mutateItem,
        navActive: navActive(),
        Lpad: Lpad,

        //Date
        formatDate: formatDate,
        localDate: localDate,
        pickDate: pickDate,
        dateCF: dateCF,
        setDate: setDate,
        daysBetween: daysBetween,
        msDay: 86400000,

		//Misc
        displayNumber: displayNumber,
        floatTwo: floatTwo,
        sumfloats: sumfloats,
		fileNav: fileNav,
		photoNav: photoNav,
		smoothStop: smoothStop,
        asyncAlert: asyncAlert(),
        showSearchHelp: showSearchHelp,

		//Error
		acceptError: acceptError,
		promiseError: promiseError,
		dbError: dbError,
	});

})();