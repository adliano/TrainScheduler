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
    // get get-frequncy
    fequency: "",
};

let inputElements = {
    name: document.querySelector("#get-train-name"),
    destination: document.querySelector("#get-destination"),
    time: document.querySelector("#get-train-time"),
    fequency: document.querySelector("#get-frequency"),
}
// Firebase configurations

// init firebase database

// get data from firebase and update info on set-train-info

// ------ get user data using JSON -------


function onSubmitClick() {
    // get get-train-name
    trainInfo.name = inputElements.name.value;
    // get get-destination
    trainInfo.destination = inputElements.destination.value;

    // clean the inputs
    for (let _key in inputElements) {
        inputElements[_key].value = "";
    }

    console.dir(trainInfo);
}

function onTimeEnter() {
    // get get-train-time
    let _strTime = inputElements.time.value;
    trainInfo.time.hour = parseInt(_strTime.split(':')[0]);
    trainInfo.time.minutes = parseInt(_strTime.split(':')[1]);

    console.dir(trainInfo);

}

function onFrequencySet() {
    inputElements.fequency.value = inputElements.fequency.value.split(':')[1];
    trainInfo.fequency = parseInt(inputElements.fequency.value);
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


inputElements.time.addEventListener(`input`, onTimeEnter);
document.querySelector("#btn-submit").addEventListener("click", onSubmitClick);