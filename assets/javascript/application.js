// ----- Lib used ----
// https://github.com/weareoutman/clockpicker

/********* Global Variables ********/
// Database Data Snapshot
let dbDataSnapshot;
// Key used to store data at sessionStorageKey
let sessionStorageKey = 0;
// JSON to hold data that will be sent to Firebase
let data = {
    // train key with name and destination
    train: {
        // name : get-train-name,
        // destination : get-destination
    },
    // time key with time of first train and frequency
    time: {
        // get get-train-times,
        firstTime: {
            // hour : hour,
            // minute : minute ,
        },
        // frequency : get-frequency
    },
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
    for (let _key in data) {
        // get the value for the current key
        let _data = data[_key];
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
function getTimes(timeObj) {
    // variable to hold net train time
    let _nextTrain;
    // variable to hold minutes away for next train
    let _minutesAway;
    // get moment time of first train
    let _firstTrainTime = moment(timeObj.firstTime);
    // get current time
    let _now = moment();
    // get difference time in minutes
    let _diff = Math.abs(_now.diff(_firstTrainTime, 'minutes'));
    // Check if First train is in future time
    if (_now.isBefore(_firstTrainTime)) {
        // if yes show first time of the day train
        _nextTrain = _firstTrainTime.format(`HH:mm`);
        // and how many minutes away from current time
        _minutesAway = _diff;
    }
    // else (train first time is pass)
    else {
        // get how minutes away its next train by using 
        // mod will give the reminder between current time and frequency
        // so we have frequency minus time alredy pass from last train.
        _minutesAway = timeObj.frequency - (_diff % timeObj.frequency);
        // get next train hour in 24h format
        _nextTrain = _now.add(_minutesAway, 'minutes').format('HH:mm');
    }
    // retutrn object with train times info frequency, hour of next train and minutes away
    return {
        frequency: timeObj.frequency,
        hour: _nextTrain,
        minutes: _minutesAway
    };
}
/*****************************************************/
/******************* mkTableRow() ********************/
/*****************************************************/
// get data from firebase and update info on set-train-info
function mkTableRow(firebaseObj) {
    // console.dir(firebaseObj);
    // Get Parrent table body (Parent)
    let _tableBody = document.querySelector("#set-train-info");
    // Create the table row element
    let _tableRow = document.createElement("tr");
    // get next train time and minutes away
    let timesObj = getTimes(firebaseObj.time);
    // combind json withh all data
    // bject.assign() will append the 2 json in a single
    let dataCollection = Object.assign(firebaseObj.train, timesObj);
    // loop through data and add to table row
    for (let _data in dataCollection) {
        // create table data
        let tableData = document.createElement("td");
        // add text to table data
        tableData.textContent = dataCollection[_data];
        // append table data to table row
        _tableRow.appendChild(tableData);
    }
    // add row to table body
    _tableBody.appendChild(_tableRow);
}
/*****************************************************/
/******************* updateTimes() *******************/
/*****************************************************/
// Function used to update screen every minute
// this will get data from sessionStorage to update screen
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
    //let _timeNow = moment(new Date());
    let _timeNow = moment();
    // set current time on screen
    datetime.textContent = _timeNow.format('dddd, MMMM Do YYYY, HH:mm:ss');
    // update train times every minute
    if (_timeNow.format('ss') == '00') {
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
// Times will be handle by another event listener
function onSubmitClick() {
    // get get-train-name
    data.train.code = inputElements.name.value;
    // get get-destination
    data.train.destination = inputElements.destination.value;
    // Check if all required fields are populated
    if (!isDataMissing()) {
        // Push data to firebase
        // database.ref().push(trainInfo);
        database.ref().push(data);
        // loop trough elements text input and
        for (let _key in inputElements) {
            // clean the text inputs
            inputElements[_key].value = "";
        }
    }
    // if any missing data display error
    else {
        // TODO: display error if missing data
        alert("Missing data");
    }
}
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
/*~~~~~~~~~~~~~~~~~~~ onTimeEnter() ~~~~~~~~~~~~~~~~~~~*/
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
function onTimeEnter() {
    // get get-train-time HH:mm
    let _strTime = inputElements.time.value;
    // split will return array index [0] will be hour
    data.time.firstTime.hour = parseInt(_strTime.split(':')[0]);
    // and index [1] will be minutes
    data.time.firstTime.minute = parseInt(_strTime.split(':')[1]);
    //console.dir(trainInfo);
}
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
/*~~~~~~~~~~~~~~~~~~ onFrequencySet() ~~~~~~~~~~~~~~~~~*/
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
function onFrequencySet() {
    // this function will return only minutes, the string format from text input 
    // is 00:mm so we will only get the mm
    inputElements.frequency.value = inputElements.frequency.value.split(':')[1];
    data.time.frequency = parseInt(inputElements.frequency.value);
}
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
/*~~~~~~~~~~~~~~~~~~~ child_added ~~~~~~~~~~~~~~~~~~~~~*/
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
// event listener called everytime an child is added to firebase
database.ref().on('child_added', function (snapshot) {
    // get the value from database's snapshot
    dbDataSnapshot = snapshot.val();
    // set new data to sessionStorageKey using sessionStorageKey and update the key
    sessionStorage.setItem(sessionStorageKey++, JSON.stringify(dbDataSnapshot));
    // add the new data to table on display
    mkTableRow(dbDataSnapshot);
});
/*****************************************************/
/******************* Timepicker **********************/
/*****************************************************/
// This lib uses JQuery used to set times like hours of 
// first train and minutes frequency
$(document).ready(function () {
    // selector get-train-time and add clockpicker to it
    // clockpicker will accept a json obj with configurations 
    // as argument 
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
    // Call Minute picker when text input have the focus
    minutePicker.focusin(function () {
        minutePicker.clockpicker('show')
            .clockpicker('toggleView', 'minutes');
    });
});


/* ======================================================= */
setInterval(updateClock, 1000);

inputElements.time.addEventListener(`input`, onTimeEnter);
document.querySelector("#btn-submit").addEventListener("click", onSubmitClick);