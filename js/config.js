/*======================================================================
 JS LIBRARY FOR MANAGING DATA
======================================================================*/
(function(){
	
	"use strict"
    
    /* Reference Only:
     * 
     * orange: "#db8f23"
     * purple: "#3e3c75"
     * 
     */
    
    // Default password of all new users
    var defaultPassword = "changeMe";

    // Project Status
    // Controlls the options for selecting the 
    // projects status. (Also Change Status Priority)
    var statusOptions = [
        { id: "Enquiry", Name: "Enquiry" },
        { id: "Quoted", Name: "Quoted" },
        { id: "Ordered", Name: "Ordered" },
        { id: "Completed", Name: "Completed" },
        { id: "Closed", Name: "Closed" },
        { id: "Cancelled", Name: "Cancelled" },
        { id: "Lost", Name: "Lost" },
    ];
    
    // Quote Status
    // Controlls the options for selecting the 
    // projects status. (Also Change Status Priority)
    var quoteStatus = [
        { id: "Pending", Name: "Pending" },
        { id: "Waiting", Name: "Waiting" },
        { id: "Rejected", Name: "Rejected" },
        { id: "Accepted", Name: "Accepted" },
    ];
    
    // Status Priority Must be kept
    // in line with statusOptions' IDs
    var statusPriority = [
		"Enquiry",
		"ReQuoted",		
		"Quoted",	
		"Ordered",		
		"WIP",	
		"Lost",		
		"Cancelled",		
		"Completed",		
		"Completed / Cost Tracker",		
		"Closed"   
    ];
	
    // Project Markets
    // Used to generate market options
    var marketOptions = [
        { id: "Automotive", Name: "Automotive" },
        { id: "Aerospace", Name: "Aerospace" },
        { id: "Rail", Name: "Rail" },
        { id: "Aviation", Name: "Aviation" },
        { id: "Industrial", Name: "Industrial" },
        { id: "Food", Name: "Food" },
        { id: "Pharmaceutical", Name: "Pharmaceutical" },
        { id: "Other", Name: "Other" },
    ];

    // Project Categories
    // Used to generate project categories
    var categoryOptions = [

        //Cat 1
        { id: "Assistors", Name: "Assistors", Category: "Category 1" },
        { id: "Feasibility", Name: "Feasibility", Category: "Category 1" },

        //Cat 2
        { id: "Stillages", Name: "Stillages", Category: "Category 2" },
        { id: "Fixtures", Name: "Fixtures", Category: "Category 2" },
        { id: "Conveyors", Name: "Conveyors", Category: "Category 2" },

        //Cat 3
        { id: "DC Tooling", Name: "DC Tooling", Category: "Category 3" },

        //Cat 4
        { id: "Build to Plan", Name: "Build to Plan", Category: "Category 4" },

        //Cat 5
        { id: "Cranes", Name: "Cranes", Category: "Category 5" },
        { id: "Gantry", Name: "Gantry", Category: "Category 5" },
        { id: "Jib", Name: "Jib", Category: "Category 5" },
        { id: "Binar", Name: "Binar (W/O Tooling)", Category: "Category 5" },

        //Cat 6
        { id: "Spares", Name: "Spares", Category: "Category 6" },
        { id: "Service", Name: "Service", Category: "Category 6" },
        { id: "Support", Name: "Support", Category: "Category 6" },
        { id: "Standby", Name: "Standby", Category: "Category 6" },

        //Cat 7
        { id: "R&D", Name: "R&D", Category: "Category 7" },
        { id: "Improvements", Name: "Improvements", Category: "Category 7" },
    ];

    // Project Markets
    // Used to generate market options
    var departmentOptions = [
        { id: "Other", Name: "Other" },
        { id: "Design", Name: "Design" },
        { id: "Projects", Name: "Projects" },
        { id: "Workshop", Name: "Workshop" },
    ];
    
    // Server Department Id's
    // Never reassign a number, 
    // always increment when adding 
    var departmentId = {
        Projects: 1,
        Design: 2,
        Manufacture: 3,
        Assembly: 4,
        preDelivery: 9,
        Install: 5,
        Procurement: 6,
        FAT: 7,
        Closeout: 8,
        Misc: 10,
        Service: 11,
    };
    
    // Server Milestones Id's
    // Ids' are handled by the server and populated automatically
    // Every milestone must have a reference added here
    var milestoneTypes = {
        
        //Launch
        salesHandover: null,
        projectLaunch: null,
        projectPlan: null,
        siteSurvey: null,
        designDataPackPrep: null,
        designDataPack: null,
        
        //Design
        designKickOff: null,
        designOutline: null,
        outlineReview: null,
        custOutlineReview: null,
        designDetailing: null,
        buyoffPack: null,
        custDesignApproval: null,
        detailModelling: null,
        designManagerApproval: null,
        detailDrawrings: null,
        drawingPrep: null, //Old
        drawingApproval: null,
        projDrawingRelease: null,
        drawingRelease: null,
        
        //Manufacture
        manufactureStart: null,
        laserDue: null,
        boughtOuts: null,
        fabrication: null,
        machining: null,
        subContracting: null,
        hardening: null,
        plating: null,
        paint: null,
        returnFromManufacture: null,
        
        //Assembly
        assyStart: null,
        travelDrive: null,
        assyReady: null,
        assyTopEnd: null,
        assy2ndArm: null,
        assyEndEffector: null,
        assyComplete: null,
        piping: null,
        PDC: null,
        
        //FAT
        FAT: null,
        FATsnags: null,
        snagsComplete: null,
        siteBriefing: null,
        
        //Pre-Delivery
        kitForInstall: null,
        PDC2: null,

        //Installation
        installation: null,
        commisioning: null,
        SAT: null,
        debrief: null,
        standby: null,
        
        //Completion
        documentation: null,
        checkInvoicing: null,
        projectCloseOut: null,

        //Other
        service: null,
        invoiceOnly: null,
    };
    
    // Timeline Filter Select
    // Defines the different views for the timelineViews
    // and what milestones will appear in each view
    function timelineViews() {
        return Config.databaseMilestones.setMilestones().then(function () {
            var trackedMS = [
                {
                    id: "all",
                    Name: "All",
                    filter: [
                        milestoneTypes.projectLaunch,
                        milestoneTypes.drawingRelease,
                        milestoneTypes.returnFromManufacture,
                        milestoneTypes.FAT,
                        milestoneTypes.installation,
                    ],
                },{
                    id: "dwg",
                    Name: "Design",
                    filter: [
                        milestoneTypes.drawingRelease,
                    ],
                },{
                    id: "fat",
                    Name: "FAT",
                    filter: [
                        milestoneTypes.FAT,
                    ],
                },{
                    id: "install",
                    Name: "Install",
                    filter: [
                        milestoneTypes.installation,
                    ],
                },
            ];

            return trackedMS;
        });
    };
    
    // Milestone Collections
    // Returns an array of milestones to the stage object
    // Every milestone must have an idType
    var milestoneCollections = {
        launch: function () {
            var msArr = [
                { Title: "Sales Handover", idType: milestoneTypes.salesHandover, isPlanned: true },
                { Title: "Project Launch", idType: milestoneTypes.projectLaunch },
                { Title: "Site Survey", idType: milestoneTypes.siteSurvey },
                { Title: "Data Pack Preparation", idType: milestoneTypes.designDataPackPrep },
                { Title: "Data Pack Release", idType: milestoneTypes.designDataPack, isPlanned: true },
            ];

            return ensureOrder(msArr);
        },
        design: function () {
            var msArr = [
                { Title: "Kick Off", idType: milestoneTypes.designKickOff, isPlanned: true },
                { Title: "Outline", idType: milestoneTypes.designOutline },
                { Title: "Outline Approval", idType: milestoneTypes.outlineReview },
                { Title: "Customer Outline Approval", idType: milestoneTypes.custOutlineReview, isPlanned: true },
                { Title: "Design", idType: milestoneTypes.designDetailing },
                { Title: "Buyoff Pack", idType: milestoneTypes.buyoffPack },
                { Title: "Customer Buyoff", idType: milestoneTypes.custDesignApproval, isPlanned: true },
                { Title: "Detail Design", idType: milestoneTypes.detailModelling },
                { Title: "Design Approval", idType: milestoneTypes.designManagerApproval },
                { Title: "Drawings", idType: milestoneTypes.detailDrawrings },
                { Title: "Projects Drawing Release", idType: milestoneTypes.projDrawingRelease },
                { Title: "Production Drawing Release", idType: milestoneTypes.drawingRelease, isPlanned: true}
            ];

            return ensureOrder(msArr);
        },
        manufacture: function () {
            var msArr = [
                { Title: "M/F Start", idType: milestoneTypes.manufactureStart, isPlanned: true },
                { Title: "Profile Cuts", idType: milestoneTypes.laserDue },
                { Title: "Bought Outs", idType: milestoneTypes.boughtOuts },
                { Title: "Fabrication", idType: milestoneTypes.fabrication },
                { Title: "Machining", idType: milestoneTypes.machining },
                { Title: "Sub Contracting", idType: milestoneTypes.subContracting },
                { Title: "Hardening", idType: milestoneTypes.hardening },
                { Title: "Plating", idType: milestoneTypes.plating },
                { Title: "Paint", idType: milestoneTypes.paint }, //Paint Return
                { Title: "Ready for Assy", idType: milestoneTypes.returnFromManufacture, isPlanned: true },
            ];

            return ensureOrder(msArr);
        },
        assembly: function () {
            var msArr = [
                { Title: "Assy Start", idType: milestoneTypes.assyStart, isPlanned: true },
                { Title: "Circuit/Travel Drive", idType: milestoneTypes.travelDrive },
                { Title: "Assy Scope 1", idType: milestoneTypes.assyTopEnd },
                { Title: "Assy Scope 2", idType: milestoneTypes.assy2ndArm },
                { Title: "Piping", idType: milestoneTypes.piping },
                { Title: "PDC", idType: milestoneTypes.PDC },
                { Title: "Assy Complete", idType: milestoneTypes.assyComplete, isPlanned: true }, //Pre Delivery Checklist
            ];

            return ensureOrder(msArr);
        },
        fat: function () {
            var msArr = [
                { Title: "FAT", idType: milestoneTypes.FAT, isPlanned: true },
                { Title: "FAT Snags", idType: milestoneTypes.FATsnags },
                { Title: "Snags Complete", idType: milestoneTypes.snagsComplete, isPlanned: true },
            ];

            return ensureOrder(msArr);
        },
        installation: function () {
            var msArr = [
                { Title: "Site Briefing", idType: milestoneTypes.siteBriefing, isPlanned: true },
                { Title: "Installation Kitting", idType: milestoneTypes.kitForInstall },
                { Title: "PDC", idType: milestoneTypes.PDC2 },
                { Title: "Installation", idType: milestoneTypes.installation, isPlanned: true },
                { Title: "Commissioning", idType: milestoneTypes.commisioning, isPlanned: true },
                { Title: "SAT", idType: milestoneTypes.SAT, isPlanned: true },
            ];

            return ensureOrder(msArr);
        },
        closeout: function () {
            var msArr = [
                { Title: "Debrief", idType: milestoneTypes.debrief, isPlanned: true },
                { Title: "Documentation", idType: milestoneTypes.documentation },
                { Title: "Check Invoicing", idType: milestoneTypes.checkInvoicing },
                { Title: "Project Close Out", idType: milestoneTypes.projectCloseOut, isPlanned: true }
            ];

            return ensureOrder(msArr);
        },
        service: function () {
            var msArr = [
                { Title: "Service", idType: milestoneTypes.service, isPlanned: true }
            ];

            return ensureOrder(msArr);
        },
        invoice: function () {
            var msArr = [
                { Title: "Misc Invoice", idType: milestoneTypes.invoiceOnly, isPlanned: true }
            ];

            return ensureOrder(msArr);
        },
    };

    // Stage Choices
    // Contains the available stage templates
    // Stage milestones are picked from milestoneCollections var
    var stageChoices = {
        standardLaunch: function (dependencyArr, stageTitle) {
            return {
                Title: stageTitle || "Launch",
                dayDuration: 10,
                milestones: milestoneCollections.launch(),
                link: true,
                idDepartment: departmentId.Projects,
                Dependency: dependencyArr || [],
            };
        },
        standardDesign: function (dependencyArr, stageTitle) {
            return {
                Title: stageTitle || "Design",
                dayDuration: 17,
                milestones: milestoneCollections.design(),
                link: true,
                idDepartment: departmentId.Design,
                Dependency: dependencyArr || [],
            };
        },
        standardMf: function (dependencyArr, stageTitle) {
            return {
                Title: stageTitle || "Manufacture",
                dayDuration: 12,
                milestones: milestoneCollections.manufacture(),
                idDepartment: departmentId.Manufacture,
                Dependency: dependencyArr || [],
            };
        },
        standardAssy: function (dependencyArr, stageTitle) {
            return {
                Title: stageTitle || "Assembly",
                dayDuration: 6,
                milestones: milestoneCollections.assembly(),
                idDepartment: departmentId.Assembly,
                Dependency: dependencyArr || [],
            };
        },
        standardFAT: function (dependencyArr, stageTitle) {
            return {
                Title: stageTitle || "FAT",
                dayDuration: 7,
                milestones: milestoneCollections.fat(),
                idDepartment: departmentId.FAT,
                Dependency: dependencyArr || [],
            };
        },
        standardInstall: function (dependencyArr, stageTitle) {
            return {
                Title: stageTitle || "Installation",
                dayDuration: 5,
                milestones: milestoneCollections.installation(),
                idDepartment: departmentId.Install,
                Dependency: dependencyArr || [],
            };
        },
        standardComp: function (dependencyArr, stageTitle) {
            return {
                Title: stageTitle || "Completion",
                dayDuration: 14,
                milestones: milestoneCollections.closeout(),
                link: true,
                idDepartment: departmentId.Closeout,
                Dependency: dependencyArr || [],
            };
        },
        service: function (dependencyArr, stageTitle) {
            return {
                Title: stageTitle || "Service",
                dayDuration: 2,
                milestones: milestoneCollections.service(),
                idDepartment: departmentId.Service,
                Dependency: dependencyArr || [],
            };
        },
        invoice: function (dependencyArr, stageTitle) {
            return {
                Title: stageTitle || "Invoice",
                dayDuration: 2,
                milestones: milestoneCollections.invoice(),
                idDepartment: departmentId.Misc,
                Dependency: dependencyArr || [],
            };
        },
    };

    // Plan Templates
    // Highest level of customisation, contains collections of stages
    // Stages must reffer to a valid propery in the stageChoices object

    // NOTE: Dependencies must be correctly worked out,
    // Use the stage title to set it as a dependency, as a result each Title *MUST* be unique
    var planTemplates = {
        basic: function(duration, projectStart){
            var scaffolding = [
                { 
                    stage: stageChoices.standardLaunch, 
                    title: "Launch", 
                    dependencies: [],
                },{ 
                    stage: stageChoices.standardDesign, 
                    title: "Design", 
                    dependencies: ["Launch"], 
                },{ 
                    stage: stageChoices.standardMf, 
                    title: "Manufacture", 
                    dependencies: ["Design"],
                },{ 
                    stage: stageChoices.standardAssy, 
                    title: "Assembly", 
                    dependencies: ["Manufacture"], 
                },{ 
                    stage: stageChoices.standardFAT, 
                    title: "FAT", 
                    dependencies: ["Assembly"], 
                },{ 
                    stage: stageChoices.standardInstall, 
                    title: "Installation", 
                    dependencies: ["FAT"],
                },{ 
                    stage: stageChoices.standardComp, 
                    title: "Completion", 
                    dependencies: ["Installation"], 
                },
            ];

            return buildStages(scaffolding, duration, projectStart);
        },
        splitDesign: function(duration, projectStart){
            var scaffolding = [
                { 
                    stage: stageChoices.standardLaunch, 
                    title: "Launch", 
                    dependencies: [],
                },{ 
                    stage: stageChoices.standardDesign, 
                    title: "Design 1", 
                    dependencies: ["Launch"],
                },{ 
                    stage: stageChoices.standardDesign, 
                    title: "Design 2", 
                    dependencies: ["Launch"],
                },{ 
                    stage: stageChoices.standardMf, 
                    title: "Manufacture", 
                    dependencies: ["Design 1","Design 2"],
                },{ 
                    stage: stageChoices.standardAssy, 
                    title: "Assembly", 
                    dependencies: ["Manufacture"],
                },{ 
                    stage: stageChoices.standardFAT, 
                    title: "FAT", 
                    dependencies: ["Assembly"], 
                },{ 
                    stage: stageChoices.standardInstall, 
                    title: "Installation", 
                    dependencies: ["FAT"],
                },{ 
                    stage: stageChoices.standardComp, 
                    title: "Completion", 
                    dependencies: ["Installation"], 
                },
            ];

            return buildStages(scaffolding, duration, projectStart);
        },     
        service: function(duration, projectStart){
            var scaffolding = [
                { 
                    stage: stageChoices.service, 
                    title: "Service", 
                    dependencies: [],
                },
            ];
            
            return buildStages(scaffolding, duration, projectStart);
        },        
        invoice: function(duration, projectStart){
            var scaffolding = [
                { 
                    stage: stageChoices.invoice, 
                    title: "Invoice", 
                    dependencies: [],
                },
            ];
            
            return buildStages(scaffolding, duration, projectStart);
        },
        custom: function(duration, projectStart, title){

            var chosenStage = stageChoices[this];

            if(!chosenStage) return false;

            var scaffolding = [
                { stage: chosenStage, dependencies: [], title: title },
            ];

            return buildStages(scaffolding, duration, projectStart);
        },
    };

    /*     
     *  DO NOT EDIT ANYTHING BEYONG THIS POINT
     */

    // Standard Variables
    var monthName = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var shortMonthName = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var shortDayName = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
    var dayName = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    var icons = {
        tick: "\ue10B",
        delete: "\ue107",
        person: "\ue13d",
        edit: "\ue104",
        chevronUp: "\ue0A0",
        chevronDown: "\ue0A1",
        plus: "\ue109",
        minus: "\ue108",
    };
	
    // Page Namespace
	WinJS.Namespace.define("Config", {
		// Static Variables
        icons: icons,
		andronId: 240,
		blankProp: "-",
        defaultPassword: defaultPassword,
        
		// Option Lists
		marketOptions: marketOptions,
		categoryOptions: categoryOptions,
		statusOptions: statusOptions,
        quoteStatus: quoteStatus,
        statusPriority: statusPriority,
        
        // Data
        stageTemplates: planTemplates,
        returnStageChoices: returnStageChoices,
        returnMilestoneTypes: returnMilestoneTypes,
        departmentId: departmentId,
        timelineViews: timelineViews,
        
		// Misc
		monthName: monthName,
        shortMonthName: shortMonthName,
        shortDayName: shortDayName,
        dayName: dayName, 
        databaseMilestones: databaseMilestones(),
	});
    
    /* Page Methods */
    
    function returnStageChoices(){
        return stageChoices;
    };

    function returnMilestoneTypes(){
        return milestoneTypes;
    };
    
    function buildStages(scaffolding, duration, projectStart){
        var indexLog = {};
        var finalBuild = [];
        
        return new WinJS.Promise(function(complete, error){
            Config.databaseMilestones.setMilestones().done(function(){
                for(var i = 0; i < scaffolding.length; i++){
                    var item = scaffolding[i];
                    var thisTitle = item.title;
                    var dependencyIndex = [];
                    var compiledStage;
                    
                    // Change dependency array from strings to relevant index
                    item.dependencies.forEach(function(dependency){
                        if(dependencyIndex && indexLog[dependency] >= 0){
                            dependencyIndex.push(indexLog[dependency]);
                        } else {
                            dependencyIndex = null;
                        };
                    });
                    
                    // Build Stage
                    compiledStage = item.stage(dependencyIndex, thisTitle);

                    //Adjust the duration based off
                    //of the difficulty multiplier
                    compiledStage.dayDuration = Math.ceil(compiledStage.dayDuration * (duration || 1));

                    //If the stage has no dependencies
                    //set the start date to project start
                    if(!item.dependencies.length) compiledStage.startDate = Control.setDate(projectStart || new Date());
                    
                    // Check MS and Stage Exists
                    if(dependencyIndex && compiledStage && compiledStage.milestones 
                        && typeof compiledStage.milestones == "object" 
                        && typeof compiledStage.dayDuration == "number"){   

                        indexLog[thisTitle] = i;
                        finalBuild.push(compiledStage);
                    } else {
                        finalBuild = [];
                        error({
                            dependencyIndex: dependencyIndex,
                            compiledStage: compiledStage,
                            milestones: compiledStage.milestones
                        });
                        break;
                    };
                };
                
                // Complete Promise
                complete(finalBuild);
                                
            }, error);          
        });
    };
    
    function databaseMilestones(){
        
        var milestoneSet = false;
        
        // Finds the ID for Andron Company
        function setAndron(){
            var ajaxSQL = { 
                table: "tblCompany",
                fields: null,
                matching: {
                    Name: "Andron Handling Limited"
                }
            };
                     
            DB.lookup(ajaxSQL).then(function(returned){
                Config.andronId = returned[0].idCompany;
            });
        };
        
        // Gets the idType for each milestone
        function setMilestones(refresh){
            var ajaxSQL = { table: "tblMilestoneTemplate" };
            
            return new WinJS.Promise(function(complete, error){
                if(milestoneSet && refresh !== true){
                    complete();
                } else {        
                    DB.lookup(ajaxSQL).then(function(arr){         
                        arr.forEach(function(thisIndex){
                            milestoneTypes[thisIndex.Name] = thisIndex.id;
                        });
                        milestoneSet = true;
                        complete();
                    }, error);
                };      
            });
        };
        
        // Syncs any newly defined milestones to the database to get them an id
        function syncNewMilestones(){            
            return new WinJS.Promise(function(complete, error){
                
                // Firstly set current milestone idType
                setMilestones().done(function runSync(){
                    var msTemplateArr = Object.keys(milestoneTypes);
                    var insertSQL = { 
                        table: "tblMilestoneTemplate", 
                        values: [] 
                    };
                    
                    // Find all milestones missing from the database
                    msTemplateArr.forEach(function(msTemplate){
                        if(!milestoneTypes[msTemplate]){
                            insertSQL.values.push({ Name: msTemplate });
                        };
                    });
                    
                    // Insert new milestones, therefore getting them an id
                    if(insertSQL.values.length > 0){
                        milestoneSet = false;
                        DB.multiInsert([insertSQL]).done(complete, error);
                    } else {
                        complete();                        
                    };
                    
                }, error);
            });
        };
        
        return {
            setAndron: setAndron,
            setMilestones: setMilestones,
            syncNewMilestones: syncNewMilestones,
        };
    };
    
    function ensureOrder(arr){
        var l = arr.length
        for (var i = 0; i < l; i++){
            var thisMs = arr[i];
            thisMs.msOrder = i;
            if(!thisMs.idType){
                return "No milestone.idType for " + thisMs.Title;
            };
        };
        return arr;
    };
})();