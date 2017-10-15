(function () {
	
    "use strict";

	//Define Page
    WinJS.UI.Pages.define("src/es5Fragments/datePicker/datePicker.html", {
		
        ready: function (element, options) {
			
			var flyout = document.getElementById("globalDatePickerFlyout");            
			var flyoutEl = document.getElementById("flyoutHost");
			var drawerEl = document.getElementById("drawerHost");
            var pickedDate = document.getElementById("pickedDate");
			var fragmentMemory = {};
            
            if (options.startDate){
                var dateVal = Control.formatDate(options.startDate,"Y.-.MM.-.d");
                pickedDate.value = dateVal;
            };

			flyout.winControl.onbeforehide = cancelFlyout;
			flyout.winControl.show(options.anchor);
            
            $(pickedDate).Zebra_DatePicker({
                always_visible: $('#globalDatePicker'),
                onSelect: returnDate,
                onClear: returnDate,
                show_week_number: 'Wk',
                show_clear_date: !!options.showClear
            });
			
			function cancelFlyout(){

                //Call Cancel Functions            
                if(options.cancel) Control.callFunctions(options.cancel);
    
                //Close flyout
                closeFragment();
			};
            
            function returnDate(date1, date2, jsDate, el){
                
                //Call Reload Functions
                if(options.reload) Control.callFunctions(options.reload, jsDate);
                
                //Close flyout
                closeFragment();
            };

			function closeFragment(){

                flyout.winControl.onbeforehide = null;              
                flyout.winControl.hide();

				setImmediate(function(){ 
					WinJS.Navigation.unloadFragment(flyoutEl);					
				});
            };            
        },
    });	
})();