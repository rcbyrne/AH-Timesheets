(function () {
	
    "use strict";

    function showDrawer(element){
		var thisFragment = element.querySelector(".drawerFragment");
        thisFragment.focus();
		setImmediate(function(){
			thisFragment.style.opacity = "1";	
			thisFragment.style.left = "0";		
		});
    };
	
	function showForm(element){
		var thisFragment = element.querySelector(".fragmentBody");
        thisFragment.focus();
		setImmediate(function(){
			thisFragment.style.opacity = "1";			
		});
    };
    
    //Shows flyout for actioned company
    //Required company id bound as this
    function showCompany(args){
		var flyoutEl = Control.getEl("flyoutHost", GlobalFragment.fragmentEls);
		var anchor = args.currentTarget;
		DB.pick_singleCompany(parseInt(this)).done(function(returned){
			var options = {
				anchor: anchor,
				company: returned,
			};
            
			WinJS.Navigation.loadFragment("pages/globalFragments/showCompanyFragment/fragment_showCompany.html", flyoutEl, options);			
		});	
	};
    
    //Shows flyout for actioned contact
    //Required company id bound as this
    function showContact(args){
		var flyoutEl = Control.getEl("flyoutHost", GlobalFragment.fragmentEls);
		var anchor = args.currentTarget;
		DB.pick_singleContact(parseInt(this)).done(function(returned){
			var options = {
				anchor: anchor,
				contact: returned,
			};
            
			WinJS.Navigation.loadFragment("pages/globalFragments/showContactFragment/fragment_showContact.html", flyoutEl, options);
		});
	};

	WinJS.Namespace.define("GlobalFragment", {
        //Global Fragment Cache
		fragmentEls: {},
        //Global Fragment Methods
		showDrawer: showDrawer,
		showForm: showForm,
        //Global Fragment Loaders
        showCompany: showCompany,
		showContact: showContact
	});
})();