/*======================================================================
JS LIBRARY FOR USER INTERACTIONS
======================================================================*/
(function(){
	
	"use strict"
    
    var userObj;

    function createUser(userObj) {

        var permissionArr = userObj.permissions || [];

        /*
         * Can be used to show user permissions.
         * 
         * NOT SECURE: can not guarentee results.
         * Do not use for authentication purposes.
         */

        userObj.softPermissionsCheck = function(department){
            
            var out = false;
            
            permissionArr.forEach(function(permission){
                if (permission == department){
                    out = true;
                };
            });

            return out;

        };

        return userObj;
    };
	
    function setUser(obj){
        userObj = createUser(obj);

        userObj.setNominal = function(newNominal){
            this.defaultNominal = newNominal;
        };
    };
    
    function getUser(){
        return userObj || createUser({});  
    };
    
	WinJS.Namespace.define("User", {
        setUser: setUser,
        getUser: getUser,
	});
    
})();