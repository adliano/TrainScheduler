// https://github.com/weareoutman/clockpicker
// file:///Users/adliano/Downloads/clockpicker-gh-pages/index.html



/********* Global Variables ********/
let trainInfo = {
    // get get-train-name
    name: "",
    // get get-destination
    destination: "",
    // get get-train-time
    time: {
        hour: 0,
        minutes: 0,
    },
    // get get-frequency
    frequency: "",
};

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


let database = firebase.database();

// get data from firebase and update info on set-train-info

// ------ get user data using JSON -------

function isDataMissing(){
    // Loop through each key in JSON
    for(let _key in trainInfo){
        // get the value for the current key
        let _data = trainInfo[_key];
        // check if data is available
        if(_data.length < 1){
            // if no data return true
            return true;
        }
    }
    // if all data is populated return false
    return false;
}

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
/*~~~~~~~~~~~~~~~~~~ onSubmitClick() ~~~~~~~~~~~~~~~~~~*/
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
function onSubmitClick() {
    // get get-train-name
    trainInfo.name = inputElements.name.value;
    // get get-destination
    trainInfo.destination = inputElements.destination.value;
    // Check if all required fields are populated
    if (!isDataMissing()){
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


    console.dir(trainInfo);
}
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
/*~~~~~~~~~~~~~~~~~~~ onTimeEnter() ~~~~~~~~~~~~~~~~~~~*/
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
function onTimeEnter() {
    // get get-train-time
    let _strTime = inputElements.time.value;
    trainInfo.time.hour = parseInt(_strTime.split(':')[0]);
    trainInfo.time.minutes = parseInt(_strTime.split(':')[1]);

    console.dir(trainInfo);

}

function onFrequencySet() {
    inputElements.frequency.value = inputElements.frequency.value.split(':')[1];
    trainInfo.frequency = parseInt(inputElements.frequency.value);
}

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
    $('#get-frequency').focusin(function () {
        minutePicker.clockpicker('show')
            .clockpicker('toggleView', 'minutes');
    });
});

///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////
inputElements.time.addEventListener(`input`, onTimeEnter);
document.querySelector("#btn-submit").addEventListener("click", onSubmitClick);