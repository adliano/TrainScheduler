// https://github.com/weareoutman/clockpicker
// file:///Users/adliano/Downloads/clockpicker-gh-pages/index.html

/********* Global Variables ********/
// Database Data Snapshot
let dbDataSnapshot;
// Key used to store data at sessionStorageKey
let sessionStorageKey = 0;
// JSON to hold data that will be sent to Firebase
let trainInfo = {
    // get get-train-time
    time: {},
};
// JSON with text inputs elements 
let inputElements = {
    name: document.querySelector("#get-train-name"),
    destination: document.querySelector("#get-destination"),
    time: document.querySelector("#get-train-time"),
    frequency: document.querySelector("#get-frequency"),
}
// Initialize Firebase
firebase.initializeApp(config);
// 
let database = firebase.database();

/*****************************************************/
/***************** isDataMissing() *******************/
/*****************************************************/
// Function to check if any field its missing
function isDataMissing() {
    // Loop through each key in JSON
    for (let _key in trainInfo) {
        // get the value for the current key
        let _data = trainInfo[_key];
        // check if data is available
        if (_data.length < 1) {
            // if no data return true
            return true;
        }
    }
    // if all data is populated return false
    return false;
}
/*****************************************************/
/********************* getTimes() ********************/
/*****************************************************/
// Function to get train time arrivel and minutes away
function getTimes(timeObj, frequency){
    // get moment time of first train
    let _firstTrainTime = moment(timeObj);
    // get current time
    let _now = moment();
    // get difference time in minutes
    let _diff = _now.diff(_firstTrainTime, 'minutes');
    // get how minutes away its next train
    let _minutesAway = frequency - ( _diff % frequency );
    // get next train hour in 24h format
    let _nextTrain = moment().add(_minutesAway, 'minutes').format('HH:mm');
    // retutrn object with 
    return { nextTrain: _nextTrain,minutesAway: _minutesAway};
}
/*****************************************************/
/******************* mkTableRow() ********************/
/*****************************************************/
// get data from firebase and update info on set-train-info
function mkTableRow(firebaseObj) {
    // Get Parrent table body (Parent)
    let _tableBody = document.querySelector("#set-train-info");
    // Create the table row element
    let _tableRow = document.createElement("tr");
    // get next train time and minutes away
    let timesObj = getTimes(firebaseObj.time, firebaseObj.frequency);
    // create a array withh all data
    let dataCollection = [firebaseObj.name, firebaseObj.destination, firebaseObj.frequency, timesObj.nextTrain, timesObj.minutesAway];
    // loop through data and add to table row
    for(let _data of dataCollection){
        let tableData = document.createElement("td");
        tableData.textContent = _data;
        _tableRow.appendChild(tableData);
    }
    // add row to table body
    _tableBody.appendChild(_tableRow);
}
/*****************************************************/
/******************* updateTimes() *******************/
/*****************************************************/
// Function used to update screnn avery minute
function updateTimes() {
    // Get Parrent element
    let _tableBody = document.querySelector("#set-train-info");
    // Clean children from parent
    _tableBody.innerHTML = "";
    // Get data from sessionStorage and update screen
    for (let i = 0; i < sessionStorage.length; i++) {
        mkTableRow(JSON.parse(sessionStorage[i]));
    }
}
/*****************************************************/
/******************* updateClock() *******************/
/*****************************************************/
// function used to update clock on screnn
function updateClock() {
    // get element to update time
    let datetime = document.querySelector("#datetime");
    // get time now
    let _now = moment(new Date());
    // set current time on screen
    datetime.textContent = _now.format('dddd, MMMM Do YYYY, HH:mm:ss');
    // update train times every minute
    if (_now.format('ss') == '00') {
        updateTimes();
    }
};
//
///////////////////// Event Listeners /////////////////////////////
//
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
/*~~~~~~~~~~~~~~~~~~ onSubmitClick() ~~~~~~~~~~~~~~~~~~*/
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
// callback used on submit button click
function onSubmitClick() {
    // get get-train-name
    trainInfo.name = inputElements.name.value;
    // get get-destination
    trainInfo.destination = inputElements.destination.value;
    // Check if all required fields are populated
    if (!isDataMissing()) {
        // Push data to firebase
        database.ref().push(trainInfo);
        // clean the inputs
        for (let _key in inputElements) {
            inputElements[_key].value = "";
        }
    }
    // if any missing data display error
    else {
        // TODO display error if missing data
        alert("Missing data");
    }
}
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
/*~~~~~~~~~~~~~~~~~~~ onTimeEnter() ~~~~~~~~~~~~~~~~~~~*/
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
function onTimeEnter() {
    // get get-train-time
    let _strTime = inputElements.time.value;
    trainInfo.time.hour = parseInt(_strTime.split(':')[0]);
    trainInfo.time.minute = parseInt(_strTime.split(':')[1]);
    //console.dir(trainInfo);
}
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
/*~~~~~~~~~~~~~~~~~~ onFrequencySet() ~~~~~~~~~~~~~~~~~*/
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
function onFrequencySet() {
    inputElements.frequency.value = inputElements.frequency.value.split(':')[1];
    trainInfo.frequency = parseInt(inputElements.frequency.value);
}
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
/*~~~~~~~~~~~~~~~~~~~ child_added ~~~~~~~~~~~~~~~~~~~~~*/
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

database.ref().on('child_added', function (snapshot) {
    dbDataSnapshot = snapshot.val();
    sessionStorage.setItem(sessionStorageKey++, JSON.stringify(dbDataSnapshot));
    mkTableRow(dbDataSnapshot);
});
/*****************************************************/
/******************* Timepicker **********************/
/*****************************************************/
// This lib uses JQuery
$(document).ready(function () {
    $('#get-train-time').clockpicker({
        placement: 'top',
        align: 'left',
        // auto close when minute is selected
        autoclose: true,
        // callback function triggered after time is written to input
        afterDone: onTimeEnter,
    });
    // Settings for Minute Picker
    let minutePicker = $('#get-frequency').clockpicker({
        // auto close when minute is selected
        autoclose: true,
        placement: 'top',
        align: 'left',
        // callback function triggered after time is written to input
        afterDone: onFrequencySet,
    });
    // Call Minute picker when input have the focus
    // $('#get-frequency').focusin(function () {
    minutePicker.focusin(function () {
        minutePicker.clockpicker('show')
            .clockpicker('toggleView', 'minutes');
    });
});
/* ======================================================= */
setInterval(updateClock, 1000);

inputElements.time.addEventListener(`input`, onTimeEnter);
document.querySelector("#btn-submit").addEventListener("click", onSubmitClick);

//EOF