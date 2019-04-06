/********* Global Variables ********/
let trainInfo = {
    // get get-train-name
    name: "",
    // get get-destination
    destination: "",
    // get get-train-time
    time: "",
    // get get-frequncy
    fequency: "",
};

let inputElements = {
    name : document.querySelector("#get-train-name"),
    destination : document.querySelector("#get-destination"),
    time : document.querySelector("#get-train-time"),
    fequency : document.querySelector("#get-frequency"),
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
    // get get-train-time
    trainInfo.time = inputElements.time.value;
    // get get-frequncy
    trainInfo.fequency = inputElements.fequency.value;
    // clean the inputs
    for(let _key in inputElements) {
        inputElements[_key].value = "";
    }

    console.dir(trainInfo);
}

function onTimeEnter(){
    console.log(inputElements.time.value);
}







inputElements.time.addEventListener(`input`, onTimeEnter);
document.querySelector("#btn-submit").addEventListener("click", onSubmitClick);