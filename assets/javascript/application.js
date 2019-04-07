// https://github.com/weareoutman/clockpicker
// file:///Users/adliano/Downloads/clockpicker-gh-pages/index.html

//console.log(`%c trainInfo keys : [${Object.keys(trainInfo)}]`, `background-color:blue; color:white;`);


// TODO: create setfrequency toUpdate times each minute

/********* Global Variables ********/
let trainInfo = {
    // get get-train-name
    name: "",
    // get get-destination
    destination: "",
    // get get-train-time
    time: {
        hour: 0,
        minute: 0,
    },
    // get get-frequency
    frequency: 0,
};
// JSON with inputs elements 
let inputElements = {
    name: document.querySelector("#get-train-name"),
    destination: document.querySelector("#get-destination"),
    time: document.querySelector("#get-train-time"),
    frequency: document.querySelector("#get-frequency"),
}
// Firebase configurations
let config = {
    apiKey: "AIzaSyDwsaSFbMU9Iy7mLVkEB_EMXh2O5PGoGf8",
    authDomain: "demoprojectfb-d2812.firebaseapp.com",
    databaseURL: "https://demoprojectfb-d2812.firebaseio.com",
    projectId: "demoprojectfb-d2812",
    storageBucket: "demoprojectfb-d2812.appspot.com",
    messagingSenderId: "594142064753"
};
// Initialize Firebase
firebase.initializeApp(config);
// 
let database = firebase.database();

/*****************************************************/
/***************** isDataMissing() *******************/
/*****************************************************/
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
/********************* setTimes() ********************/
/*****************************************************/
function setTimes(timeObj, frequency){
    // get moment time of first train
    let _firstTrainTime = moment(timeObj);
    // get current time
    let _now = moment();
    // get difference time in minutes
    let _diff = _now.diff(_firstTrainTime, 'minutes');

    let _minutesAway = frequency - ( _diff % frequency );

    let _nextTrain = moment().add(_minutesAway, 'minutes').format('HH:mm');


    console.log(timeObj);
    console.log(`_firstTrainTime : ${_firstTrainTime}`);

    console.log(`_diff : ${_diff}`);
    
    console.log(`_minutesAway : ${_minutesAway}`);
    
    console.log(`next train : ${_nextTrain} in : ${_minutesAway} minutes`);

    return {minutesAway:_minutesAway,nextTrain:_nextTrain};
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
    // Using loop to create echa td (table data) elemet, we will use the trainInfo key as referenc
    // to make sure that data will be load on right order
    // Firebase change the order of the keys to Aphsbetic order

    let timesObj = setTimes(firebaseObj.time, firebaseObj.frequency);



    let tdName = document.createElement("td");
    tdName.textContent = firebaseObj.name;
    _tableRow.appendChild(tdName);

    let tdDestination = document.createElement("td");
    tdDestination.textContent = firebaseObj.destination;
    _tableRow.appendChild(tdDestination);

    let tdFrequency = document.createElement("td");
    tdFrequency.textContent = firebaseObj.frequency;
    _tableRow.appendChild(tdFrequency);

    let tdNextTrain = document.createElement("td");
    tdNextTrain.textContent = timesObj.nextTrain;
    _tableRow.appendChild(tdNextTrain);

    let tdMinutesAway = document.createElement("td");
    tdMinutesAway.textContent = timesObj.minutesAway;
    _tableRow.appendChild(tdMinutesAway);




    _tableBody.appendChild(_tableRow);




















    // for (let _key in trainInfo) {
    //     let _tableData = document.createElement("td");
    //     if (_key !== 'time') {

    //         console.log(firebaseObj[_key]);
            
    //         _tableData.textContent = firebaseObj[_key];
    //         _tableRow.appendChild(_tableData);
    //     }
    //     else{
    //         // set times
    //         setTimes(firebaseObj.time,firebaseObj.frequency);
    //         // get moment time of first train
    //         let _firstTrainTime = moment(firebaseObj.time);
    //         // get current time
    //         let _now = moment();
    //         // get difference time in minutes
    //         let _diff = _now.diff(_firstTrainTime, 'minutes');

    //         let _minutesAway = firebaseObj.frequency - (_diff % firebaseObj.frequency);

    //         let _nextTrain = moment().add(_minutesAway, 'minutes').format('HH:mm');

    //         _tableData.textContent = _nextTrain;
    //         _tableRow.appendChild(_tableData);

    //        // _tableData.textContent = _minutesAway;
    //        // _tableRow.appendChild(_tableData);
    //     }
    // }
    // _tableBody.appendChild(_tableRow);
}
//
///////////////////// Event Listeners /////////////////////////////
//
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
/*~~~~~~~~~~~~~~~~~~ onSubmitClick() ~~~~~~~~~~~~~~~~~~*/
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
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

    console.dir(trainInfo);
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
    let dataObj = snapshot.val();
    mkTableRow(dataObj);
});
/*****************************************************/
/******************* Timepicker **********************/
/*****************************************************/
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
///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////
inputElements.time.addEventListener(`input`, onTimeEnter);
document.querySelector("#btn-submit").addEventListener("click", onSubmitClick);