import React, { Component, PureComponent } from 'react';
import VirtualizedSelect from 'react-virtualized-select';

//Used in lieu of a database
//Normally the timesheet would use
//AJAX calls instead of local variables
let timeEntries = [];
let projectList = [];


//Generate dummy company data
companyGenerator();
function companyGenerator(){
	
	//Use Lorem Ipsum instead of real project names
	const LoremIpsum = [	
		'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur',	
		'adipiscing', 'elit', 'curabitur', 'vel', 'hendrerit', 'libero',	
		'eleifend', 'blandit', 'nunc', 'ornare', 'odio', 'uterin',	
		'orci', 'gravida', 'imperdiet', 'nullam', 'purus', 'lacinia',	
		'aisq', 'pretium', 'quis', 'congue', 'praesent', 'sagittis', 	
		'laoreet', 'auctor', 'mauris', 'non', 'velit', 'eros',	
		'dictum', 'proin', 'accumsan', 'sapien', 'nec', 'massa',
		'volutpat', 'venenatis', 'sed', 'eurq', 'molestie', 'lacus',	
		'quisque', 'porttitor', 'ligula', 'dui', 'mollis', 'tempus',	
		'atilf', 'magna', 'vestibulum', 'turpis', 'acai', 'diam',	
		'tincidunt', 'idep', 'condimentum', 'enim', 'sodales', 'inerin',	
		'hac', 'habitasse', 'platea', 'dictumst', 'aenean', 'neque',	
		'fusce', 'augue', 'leo', 'eget', 'semper', 'mattis',	
		'tortor', 'scelerisque', 'nulla', 'interdum', 'tellus', 'malesuada',	
		'rhoncus', 'porta', 'sem', 'aliquet', 'etais', 'nam',	
		'suspendisse', 'potenti', 'vivamus', 'luctus', 'fringilla', 'erat',	
		'donec', 'justo', 'vehicula', 'ultricies', 'varius', 'ante',	
		'primis', 'faucibus', 'ultrices', 'posuere', 'cubilia', 'curae',	
		'etiam', 'cursus', 'aliquam', 'quam', 'dapibus', 'nisl',	
		'feugiat', 'egestas', 'class', 'aptent', 'taciti', 'sociosqu',	
		'adorln', 'litora', 'torquent', 'per', 'conubia', 'nostra',	
		'inceptos', 'himenaeos', 'phasellus', 'nibh', 'pulvinar', 'vitae',	
		'urna', 'iaculis', 'lobortis', 'nisi', 'viverra', 'arcu',	
		'morbi', 'pellentesque', 'metus', 'commodo', 'uti', 'facilisis',	
		'felis', 'tristique', 'ullamcorper', 'placerat', 'aenean', 'convallis',	
		'sollicitudin', 'integer', 'rutrum', 'duis', 'est', 'etiam',	
		'bibendum', 'donec', 'pharetra', 'vulputate', 'maecenas', 'miais',	
		'fermentum', 'consequat', 'suscipit', 'aliquam', 'habitant', 'senectus',	
		'netus', 'fames', 'quisque', 'euismod', 'curabitur', 'lectus',	
		'elementum', 'tempor', 'risus', 'cras'	
	];

	//Create random start / finish numbers
	const rand = Math.random();
	const lowerLimit = Math.floor(rand * 100);
	const upperLimit = Math.ceil(rand * 1000) + 4000;

	for(var i = lowerLimit; i < upperLimit; i++){
		
		//Pick 2 Lorem Ipsum words
		const position1 = Math.floor(Math.random() * LoremIpsum.length);		
		const position2 = Math.floor(Math.random() * LoremIpsum.length);

		//Generate Sequential Project Number
		const padNumber = "2" + Control.Lpad(i, 4).toString();

		//Push Project
		projectList.push({
			idProject: i,
			ProjectNumber: padNumber,
			Description: LoremIpsum[position1] + " " + LoremIpsum[position2],
			Status: "Ordered"
		})
	}
}

//Returns first day of the week as Date()
function  returnFirstDay(newDate){
	return new Date(newDate.getFullYear(), newDate.getMonth(), newDate.getDate() - newDate.getDay() + 1, 
		0, 0, 0, 0);
}

//Check if day falls in a week
function fallsInWeek(date, weekStart){
	const selectedDayMS = date.getTime();
	const dateRangeStart = weekStart.getTime();
	const dateRangeEnd = dateRangeStart + (7 * Control.msDay);

	if(selectedDayMS >= dateRangeStart && selectedDayMS < dateRangeEnd) return true;

	return false;
}

export default class Timesheet extends Component {

	constructor(props) {

		super(props);

		this.state = {
			openEdit: 0,
			totalTime: 0,
			entries: [],
			transition: false,
			weekStarting: returnFirstDay(new Date),
			selectedDay: new Date(new Date().setHours(12,0,0,0))
		};
	}

	componentDidMount(){
		this.getEntries();
	}

	startTransition(){
		this.setState({ transition: true });
	}

	endTransition(){
		const timeout = 100;

		return new WinJS.Promise((complete) => {			
			setTimeout(() => {
				this.setState({ transition: false });
				complete();
			}, timeout)
		});
	}

	setWeek(newDate){
		const weekStarting = returnFirstDay(newDate);
		let interalPromise = WinJS.Promise.as();
		let newState = {
			selectedDay: newDate
		};

		if(weekStarting.getTime() != this.state.weekStarting.getTime()){

			newState.weekStarting = weekStarting;

			this.startTransition();
			interalPromise = this.getEntries(weekStarting).then(() => {			
				this.endTransition();
			});
		};

		interalPromise.done(() => {
			this.focus();
			this.setState(newState);
		});
	}

	setDay(selectedDay, callback){
		
		selectedDay = new Date(selectedDay.setHours(12,0,0,0));

		if(selectedDay == this.state.selectedDay) return false;

		const thisWeek = fallsInWeek(selectedDay, this.state.weekStarting);

		const finishSet = () => {
			if(callback) callback(true);
			this.focus();
		};

		if(thisWeek){
			this.setState({ selectedDay }, finishSet);
		} else {
			const title = "Date On Different Timesheet";
			const msg = `Continue to timesheet starting ${Control.formatDate(returnFirstDay(selectedDay),"d./.m./.Y")}?`;

			//Provisionally Set Day
			const cachedDay = this.state.selectedDay;
			this.setState({ selectedDay })

			Control.asyncAlert.confirmation(title, msg).done(() => {
				//Set week handles setting day and focus
				this.setWeek(selectedDay, finishSet);
			}, () => {
				this.setState({ selectedDay: cachedDay },() =>{ if(callback) callback(false) });
			});
		};
	}

	newEntry(values, callback){
		//Simply pushes new entry into array
		//this replaces AJAX call to database
		values.idTime = timeEntries.length + 1;
		timeEntries.push(values);
		this.getEntries();
		callback();
	}

	getEntries(weekStarting) {

		const firstday = weekStarting || this.state.weekStarting;

		let entries = [];
		let totalTime = 0;

		for (var i = 0; i < 7; i++) {
			let subHeadDate = new Date(firstday.getFullYear(), firstday.getMonth(), firstday.getDate() + i, 0, 0, 0, 0);
			entries.push({
				date: subHeadDate,
				subTotal: 0,
				entries: []
			});
		};

		timeEntries.forEach(entry => {

			const entryDate = entry.date;

			entries.forEach((weekEntry, index) => {
				const today = weekEntry.date.getTime();
				const tomorrow = today + Control.msDay;

				if (entryDate >= today && entryDate < tomorrow) {
					weekEntry.entries.push(entry);
					weekEntry.subTotal += entry.duration;
					totalTime += entry.duration;
				};
			});
		})

		return new WinJS.Promise((complete, err) => {		
			this.toggleEdit(null);
			this.setState({ entries, totalTime }, complete);
		}, Control.acceptError);
	}

	toggleEdit(entryId){
		var openEdit = this.state.openEdit;

		if(entryId != openEdit){
			openEdit = entryId;
		} else {
			openEdit = 0;
		};

		this.setState({ openEdit });
	}

	focus() {
		this.timeForm.focus();
	}

	render() {
		return (
			<div className="timesheetWrapper">
				<div className="mainCol">
					<div className="timesheetTopper flexRow">
						<WeekSelect 
							selectedDate={ this.state.weekStarting } 
							onDateSelect={ newDate => this.setWeek(newDate) } />
						<p>Week Total: { this.state.totalTime }hrs</p>
					</div>
					<TimeForm
						selectedDay={this.state.selectedDay}
						setDay={ (selectedDay, callback) => this.setDay(selectedDay, callback) }
						ref={(input) => { this.timeForm = input; }}
						onSubmit={(values, callback) => {this.newEntry(values, callback)}} />
					<TimeReport
						transition={ this.state.transition }
						setDay={ selectedDay => this.setDay(selectedDay) }
						entries={ this.state.entries } 
						weekStarting={ this.state.weekStarting }
						mutate={ () => this.getEntries() } 
						openEdit={ this.state.openEdit }
						toggleEdit={ entryId => this.toggleEdit(entryId) }/>
				</div>
				<div className="summaryCol">
					<WeekSummary 
						weekStarting={ this.state.weekStarting }
						totalTime={ this.state.totalTime }
						setWeek={ newDate => this.setWeek(newDate) } />
				</div>
			</div>
		);
	}
}

class WeekSelect extends Component {

	render() {

		let selectedDate = this.props.selectedDate;
		let weekEnd = selectedDate.getTime() + (6 * Control.msDay);
		const weekNumber = selectedDate.getWeek();
		selectedDate = selectedDate ? Control.formatDate(selectedDate, "d./.MM./.Y") : "";
		weekEnd = weekEnd ? Control.formatDate(weekEnd, "d./.MM./.Y") : "";

		return (
			<div onClick={event => this.pickDate(event.target)} className="colDate weekPicker flexRow">
				<p>Week {weekNumber}</p>
				<p className="weekBreak">|</p>
				<p><span>{selectedDate}</span> - <span>{weekEnd}</span></p>
			</div>
		);
	}

	pickDate(target) {
		Control.pickDate(target, this.props.selectedDate, false).done((newDate) => {
			this.props.onDateSelect(newDate);
		}, Control.acceptError);
	}
}

class TimesheetHead extends Component {

	user = User.getUser();

	render() {
		return (
			<h1 className="win-h1 win-type-ellipsis">Timesheet: {this.user.Name}</h1>
		);
	}
}

class TimeForm extends Component {

	selectDefaultJSX = {
		clearable: false,
		autosize: false,
		inputProps: {"autoComplete": "off"},
		onBlur: () => this.clearValidation(),
		onFocus: () => this.clearValidation(),
	}

	inputDefaultJSX = {
		autoComplete: "off",
		onBlur: () => this.clearValidation(),
		onFocus: () => this.clearValidation(),
	}

	constructor(props) {
		super(props);

		//Provided When Editing Entries
		const defaultProj = props.defaultProj;

		this.state = {
			projectId: "",
			projectNumber: "",
			nominals: defaultProj ? [{ value: 0, label: defaultProj.Nominal }] : null,
			selectedNominal: 0,
			date: new Date(),
			workDescription: defaultProj ? defaultProj.workDescription : "",
			duration: defaultProj ? defaultProj.duration : "",

			dateValidation: 0,
			projectValidation: 0,
			nominalValidation: 0,
			descriptionValidation: 0,
			durationValidation: 0
		};
	}

	componentDidMount(){
		this.onProjectSelect(this.props.defaultProj);
	}

	cleanValidation(){
		return {
			validationSet: 0,
			dateValidation: 0,
			projectValidation: 0,
			nominalValidation: 0,
			descriptionValidation: 0,
			durationValidation: 0,
		};
	}

	setNominals(data) {

		const defaultProj = this.props.defaultProj;
		const user = User.getUser();

		let nominals = [];
		let codeArray = [];
		let idArr = [];
		let selectedNominal;

		if (!data || data.length == 0) {
			nominals = null;
		} else {
			nominals = data.map(item => {
				idArr.push(item.idBudget);
				codeArray.push(item.NominalCode);
				return { value: item.idBudget, label: item.Name }
			});
		};

		if(defaultProj && idArr.indexOf(defaultProj.idBudget) > -1){
			selectedNominal = defaultProj.idBudget;
		} else if (user && codeArray.indexOf(user.defaultNominal) > -1){
			const idIndex = codeArray.indexOf(user.defaultNominal);
			selectedNominal = idArr[idIndex];
		} else {
			selectedNominal = nominals && nominals[0].value;
		};

		this.setState({ nominals, selectedNominal });
	}

	onProjectSelect(selectedObj) {

		const projectId = selectedObj && selectedObj.idProject;
		const projectNumber = selectedObj && selectedObj.ProjectNumber;
		const status = selectedObj && selectedObj.Status;
		const validStatus = isStatusValid(status);

		this.setState({ projectId, projectNumber });
		this.clearValidation();

		if (!projectId) {
			this.setNominals(null);
		} else if(!validStatus) {
			const title = "Project Closed";
			const msg = "You cannot book time against a project which is Completed, Closed, Lost or Cancelled.";

			Control.asyncAlert.alert(title, msg).done(() => {
				this.onProjectSelect(null);
				this.focus();
			});
		} else {
			const nominalData = [
				{ idBudget: "Projects", NominalCode: "Projects", Name: "Projects"},
				{ idBudget: "Design", NominalCode: "Design", Name: "Design"},
				{ idBudget: "Production", NominalCode: "Production", Name: "Production"},
				{ idBudget: "General", NominalCode: "General", Name: "General"},
			];
			this.setNominals(nominalData);
		};

		function isStatusValid(status){
			if(status == "Enquiry") return true;
			if(status == "Quoted") return true;
			if(status == "Ordered") return true; 

			return false;
		};
	}

	submitForm(event) {

		//Handle Submit Reload
		if(event && event.preventDefault) event.preventDefault();

		const props = this.props;
		const state = this.state;

		let validationState = this.cleanValidation();

		//Validation Fail
		if (!props.selectedDay || !props.selectedDay.getTime || !state.workDescription || !state.duration || !state.selectedNominal){
			
			if(!props.selectedDay || !props.selectedDay.getTime) validationState.dateValidation = 1;
			if(!state.workDescription) validationState.descriptionValidation = 1;
			if(!state.duration) validationState.durationValidation = 1;
			if(!state.projectId) validationState.projectValidation = 1;
			if(!state.selectedNominal) validationState.nominalValidation = 1;

			validationState.validationSet = 1;

			this.setState(validationState);

			return false;
		};	

		const values = {
			idContact: User.getUser().idContact,
			idBudget: state.selectedNominal,
			date: props.selectedDay.getTime(),
			workDescription: state.workDescription,
			duration: parseInt(state.duration),
			week: props.selectedDay.getWeek(),
			year: props.selectedDay.getFullYear(),
			idProject: state.projectId,
			ProjectNumber: state.projectNumber,
			Nominal: state.selectedNominal,
			Status: "Ordered"
		};

		this.props.onSubmit(values, this.reset.bind(this));
	}

	onPropChange(prop, value) {

		if(!prop) return false;

		this.setState({ [prop]: value });
		this.clearValidation();
	}

	reset(){
		//Reset Form
		this.setState({
			projectId: "",
			workDescription: "",
			duration: 0
		});

		this.setNominals(null);
	}

	focus(){
		this.projectInput.focus();
		this.clearValidation();
	}

	clearValidation(){
		if(this.state.validationSet) this.setState(this.cleanValidation());
	}

	render() {
		return (
			<form className="newEntry flexRow" onSubmit={event => this.submitForm(event)}>
				<DateSelect
					selectedDate={this.props.selectedDay}
					setDay={(selectedDay, callback) => this.props.setDay(selectedDay, callback)}
					collectForm={() => this.submitForm()}
					clearValidation={() => this.clearValidation() }
					validationActive={this.state.dateValidation} />
				<ProjectSelect
					defaultProj={this.props.defaultProj}
					projectId={this.state.projectId}
					onProjectSelect={projectId => { this.onProjectSelect(projectId) }}
					ref={(input) => { this.projectInput = input; }}
					validationActive={this.state.projectValidation} 
					selectDefaultJSX={this.selectDefaultJSX} />
				<VirtualizedSelect
					placeholder="Nominal..."
					name="Nominal"				
					options={this.state.nominals}
					value={this.state.selectedNominal}
					className={this.state.nominalValidation ? "colNominal valErr" : "colNominal"}	
					onChange={event => this.onPropChange("selectedNominal", event.value) }
					{...this.selectDefaultJSX} />					
				<input
					placeholder="Description..."
					type="text"
					value={this.state.workDescription}
					className={this.state.descriptionValidation ? "win-textbox colDescription valErr" : "win-textbox colDescription"}
					onChange={event => this.onPropChange("workDescription", event.target.value)}
					{...this.inputDefaultJSX} />
				<input
					placeholder="Hours..."
					type="number"
					value={this.state.duration}
					min="0" max="24" step="0.25"
					className={this.state.durationValidation ? "win-textbox colDuration valErr" : "win-textbox colDuration"} 
					onChange={event => this.onPropChange("duration", event.target.value)}
					{...this.inputDefaultJSX} />							
				<button className="win-button win-button-primary" type="submit">{this.props.submitTxt || "Add"}</button>
				{ this.props.onDelete && <button className="win-button button-delete" onClick={this.props.onDelete} type="button">Delete</button>}
				{ this.props.onCancel && <button className="win-button button-cancel" onClick={this.props.onCancel} type="button">Cancel</button>}
			</form>
		);
	}
}

class ProjectSelect extends Component {

	constructor(props) {

		super(props);

		const options = projectList.map(item => {

			//Keep Obj Schema Consistent With Database
			return { 
				value: item.idProject, 
				label: returnTitleString(item),
				idProject: item.idProject,
				ProjectNumber: item.ProjectNumber,
				Status: item.Status
			};
		});

		this.state = {
			options
		};

		function returnTitleString(item){
			return `${item.ProjectNumber}\xa0\xa0\xa0${item.Description}`;
		};
	}

	componentDidMount(){

	}

	focus(){
		if(this.projectInput) this.projectInput.focus();
	}

	render() {
		return (<VirtualizedSelect
			autofocus={true}
			placeholder="Project..."
			name="Project"
			className={ this.props.validationActive ? "colProject valErr" : "colProject" }
			value={this.props.projectId}
			options={this.state.options}
			onChange={selectedObj => this.props.onProjectSelect(selectedObj)}
			ref={(input) => { this.projectInput = input; }}
			{...this.props.selectDefaultJSX}
		/>);
	}
}

class DateSelect extends Component {

	constructor(props) {
		super(props);

		this.state = {
			focused: false,
			localDate: "testing"
		}
	}

	onFocus(callback){
		this.setState({ localDate: Control.formatDate(this.props.selectedDate, "d./.MM./.Y"), focused: true },() => {
			callback && callback();
		});
	}

	setDateObj(value, callback){
		const splitValue = value.split("/");
		const tryDate = splitValue.length && new Date(parseInt(splitValue[2]), parseInt(splitValue[1]) - 1, parseInt(splitValue[0]));

		if(!isNaN(tryDate)){
			this.props.setDay(tryDate, callback);
		} else {
			const title = "Unknown Date";
			const msg = "Please enter the date in the format dd/mm/yyy.";

			Control.asyncAlert.alert(title, msg).done(() => {
				this.el.focus();
			}, Control.acceptError);
		};
	}

	onBlur(value){
		this.setState({ focused: false });
		this.setDateObj(value, (success) => {
			if(!success) this.el.focus();
		});
	};

	doMutate(value){
		this.setState({ localDate: value });
	}

	onKeyDown(e){

		let currDate = this.state.localDate;
		const splitValue = currDate.split("/");

		const setLocalDate = (localDate) => {
			this.setState({ localDate });
		};

		if(e.keyCode == 13) {

			const callback = (success) => {
				success ? this.props.collectForm() : this.el.focus();
			};

			//Block until date has been set
			e.preventDefault();
			this.setDateObj(currDate, callback).done((succ) => {
				this.props.collectForm();
			},(err) => { this.el.focus(); });

			//Return Fuction
			return false;
		};

		if(e.keyCode == 27){
			this.onFocus(() => {
				this.el.blur();
			});

			return false;
		};

		//Only Continue in format x/x/x
		if(splitValue.length != 3) return false;

		if (e.keyCode == 40) {
			setLocalDate(`${parseInt(splitValue[0]) - 1}/${splitValue[1]}/${splitValue[2]}`);				
		} else if (e.keyCode == 38){
			setLocalDate(`${parseInt(splitValue[0]) + 1}/${splitValue[1]}/${splitValue[2]}`);
		};		
	}

	pickDate(event) {

		event.preventDefault();
		event.stopPropagation();

		Control.pickDate(event.target, this.props.selectedDate, false).done((newDate) => {
			this.props.setDay(newDate);
		}, Control.acceptError);
	}

	render() {

		let selectedDate = this.state.focused ? this.state.localDate : Control.formatDate(this.props.selectedDate, "D. .d./.MM./.Y");

		return (
			<input 
				onMouseDown={event => this.pickDate(event)}
				onChange={event => this.doMutate(event.target.value)}
				onFocus={event => this.onFocus()}
				onBlur={event => this.onBlur(event.target.value)}
				onKeyDown={event => this.onKeyDown(event)}
				className={this.props.validationActive ? "colDate win-textbox valErr" : "colDate win-textbox"}
				ref={(input) => { this.el = input; }}
				autoComplete="off"
				type="text"
				value={ selectedDate } />
		);
	}
}

class TimeReport extends Component {

	subRows(entry){

		const entries = entry.entries;

		//Empty Day
		if(entry.entries.length == 0){
			return (
				<div className="dayEntry flexRow placeholder">
					<p>No Work Here</p>
				</div>
			);
		};

		//Map Arr to JSX
		return entry.entries.map(subEntry => {

			if(this.props.openEdit == subEntry.idTime){

				//Assign New Key to Ensure Edit is Always Rebuilt
				const editProps = {
					key: new Date().getTime(),
					subEntry: subEntry,
					mutate: this.props.mutate,
					openEdit: this.props.openEdit,
					weekStarting: this.props.weekStarting,
					toggleEdit: entryId => this.props.toggleEdit(entryId),
				};

				return <DayEdit {...editProps} />;
			} else {
				const entryProps = {
					key: subEntry.idTime,
					subEntry: subEntry,
					toggleEdit: entryId => this.props.toggleEdit(entryId),
				};

				return <DayEntry {...entryProps} />;
			};
		});
	}

	render() {
		return (
			<div className="reportWrapper">
				{this.props.entries.map(entry => (
					<div key={ entry.date.getTime() }className="daySummary">
						<div onClick={ () => this.props.setDay(entry.date) } className="dayHead flexRow">
							<h3 className="win-h3 colMain">{Control.formatDate(entry.date, "DD. .d. .M., .Y")}</h3>
							<h3 className="win-h3 colDuration">{entry.subTotal}hrs</h3>
						</div>
						{ this.subRows(entry) }
					</div>
				))}
				{ this.props.transition && <div className="loadingCover" /> }
			</div>
		);
	}
}

class DayEntry extends Component {

	render() {

		const subEntry = this.props.subEntry;

		return (<div className="dayEntry flexRow" onClick={ event => this.props.toggleEdit(subEntry.idTime) }>
			<p className="colProject">{subEntry.ProjectNumber}</p>
			<p className="colNominal">{subEntry.Nominal}</p>
			<p className="colMain">{subEntry.workDescription}</p>
			<p className="colDuration">{subEntry.duration}hrs</p>
		</div>)
	}
}

class DayEdit extends Component {

	constructor(props){
		super(props);

		const subEntry = props.subEntry;

		this.state = {
			selectedDay: new Date(parseInt(subEntry.date)),
			frozen: false
		};
	}

	setDay(selectedDay){
		
		selectedDay = new Date(selectedDay.setHours(12,0,0,0));

		if(selectedDay == this.state.selectedDay) return false;
		
		const thisWeek = fallsInWeek(selectedDay, this.props.weekStarting);

		const finishSet = () => {
			this.focus();
		};
		
		if(thisWeek){
			this.setState({ selectedDay }, finishSet);
		} else {			
			const title = "Can't Select Date";
			const msg = "Entries cannot be moved between timesheets.";

			Control.asyncAlert.alert(title, msg);
		};
	}

	deleteSelf(subEntry){		
		const title = "Remove Entry?";
		const msg = `${subEntry.ProjectNumber} - ${subEntry.workDescription} - ${subEntry.duration}hrs`;

		Control.asyncAlert.confirmation(title, msg).done(succ => {
			timeEntries.splice(subEntry.idTime - 1, 1);
			this.props.mutate();
		}, err => Control.acceptError);
	}
	
	updateSelf(values, callback){

		const dateObj = new Date(values.date);

		const obj = timeEntries[this.props.subEntry.idTime - 1];
		obj.idBudget = values.idBudget;
		obj.date = values.date;
		obj.workDescription = values.workDescription;
		obj.duration = values.duration;
		obj.idBudget = dateObj.getWeek();
		obj.idBudget = dateObj.getFullYear();
		
		this.props.mutate().done(() => {
			callback && callback();
		});
	}

	focus(){
		this.timeForm.focus();
	}

	render() {

		const subEntry = this.props.subEntry;
			
		return (
			<div className="editEntry">
				<TimeForm
					defaultProj={this.props.subEntry}
					submitTxt="Save"
					ref={(input) => { this.timeForm = input; }}
					onSubmit={ (a,b) => this.updateSelf(a,b)}
					onDelete={ () => this.deleteSelf(subEntry)}
					onCancel={ () => this.props.toggleEdit(subEntry.idTime)}
					selectedDay={this.state.selectedDay}
					setDay={ selectedDay => this.setDay(selectedDay) }
					/>
			</div>
		);
	}
}

class WeekSummary extends PureComponent {

	constructor(props){
		super(props);

		this.state = {
			weekStarting: this.props.weekStarting
		};
	}

	render(){
		const msWeek = Control.msDay * 7;
		const iterations = 7;
		const calibration =  2;
		const originalWeek = this.props.weekStarting.getTime();
		const startingWeek = originalWeek + (msWeek * calibration);
		const rows = [];

		for(var i = 0; i < iterations; i++){
			const localWeekStart = startingWeek - (i * msWeek);
			const weekStartObj = new Date(localWeekStart);
			const selectedWeek = localWeekStart == originalWeek ? true : false;
			const suffix = selectedWeek ? this.props.totalTime : "0";
			const weekNumber = weekStartObj.getWeek();
			const yearNumber = weekStartObj.getFullYear();

			rows.push(
				<SummaryObject
					invoked={() => this.props.setWeek(weekStartObj)}
					key={`${weekNumber}_${yearNumber}_${suffix}`}
					selectedWeek={ selectedWeek }
					totalTime={ this.props.totalTime }
					week={weekNumber}
					year={yearNumber} />
			);
		};

		return (<div>{rows}</div>);
	}
}

class SummaryObject extends Component {
	
	constructor(props){

		super(props);
		let weekDuration = 0;

		timeEntries.forEach(entry => {
			if(entry.week == props.week){
				weekDuration += entry.duration;
			};
		});

		this.state = {
			weekDuration,
		};
	}

	render(){

		const classList = ["flexRow","summaryRow"]
		const weekToday = new Date().getWeek();
		
		if(this.props.week == weekToday) classList.push("activeWeek");
		if(this.props.selectedWeek) classList.push("selectedWeek");

		return (
			<div className={classList.join(" ")} onClick={() => !this.props.selectedWeek && this.props.invoked()}>
				<p>Week {this.props.week}:</p>
				<p>{this.state.weekDuration}hrs</p>
			</div>
		);

	}
}