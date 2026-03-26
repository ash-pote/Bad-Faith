// 19: addingLFO Effects: https://tonejs.github.io/examples/lfoEffects

///////////////////////////////////////////////
// Update order number value from slider
///////////////////////////////////////////////
const orderInput = document.querySelector("#order"); // 1 // querySelector from previous experience
let order = 1; // length of ngram // default 1
let prevOrder; // previous order value
let orderInChange = false; // whether order is in process of being changed
const ngramNumOutput = document.querySelector("#ngramValue"); // 14.4 Slider // use of querySelector from previous experience

// 1: Get input value:
orderInput.addEventListener("input", function () {
  console.log("changed");
  order = parseFloat(orderInput.value); // 1: Parse as a number
  ngramNumOutput.textContent = " " + order; // 14.4 Slider // updates html

  // 16: isNaN: order is not a NaN:
  if (order != prevOrder && !isNaN(order)) {
    orderChanged = true; // ngram order value has changed
    orderInChange = true; // ngram order is in process of being changed
    prevOrder = order; // the previous order value is updated
  }

  // if the ord is in process of being changed: rset all markov and ngram values, and generate new ngrams based on updated ngram order value:
  if (orderInChange == true) {
    noteIdx = 0; // reset noteIdx to 0
    ngrams = {}; // reset
    resultData = []; // reset
    resultArr = []; // reset
    previousMarkovTime = 0; // reset
    ngramGenerate(); // 3: Coding Train Markov Chains Tutorial // places ngrams in ngrams array // see in markov.js
  }

  orderInChange = false; // order in change back to false when completed
  console.log("order: " + order); // current order
});

///////////////////////////////////////////////
// Update delay number value from slider
///////////////////////////////////////////////
const delayInput = document.querySelector("#delay"); // 1 // use of querySelector from previous experience
let delaySliderNum = 1; // delay value // default 1
const delayOutput = document.querySelector("#delayValue"); // 14.4 Slider // use of querySelector from previous experience
// 1: Get input value:
delayInput.addEventListener("input", function () {
  delaySliderNum = parseFloat(delayInput.value); // 1: Parse as a number
  delayOutput.textContent = " " + delaySliderNum; // 14.4 Slider // updates html
});

///////////////////////////////////////////////
// Update duration number value from slider
///////////////////////////////////////////////
const durationInput = document.querySelector("#duration"); // 1 // querySelector from previous experience
let durationSliderNum = 1; // duration value // default 1
const durationOutput = document.querySelector("#durationValue"); // 14.4 Slider // use of querySelector from previous experience
// 1: Get input value
durationInput.addEventListener("input", function () {
  durationSliderNum = parseFloat(durationInput.value); // 1: Parse as a number
  durationOutput.textContent = " " + durationSliderNum; // 14.4 Slider // update html
});

///////////////////////////////////////////////
// Update delayR & random number value from slider
///////////////////////////////////////////////
const delayRInput = document.querySelector("#delayR"); // 1 // use of querySelector from previous experience
let delayRSliderNum = 1; // delayR value // default 1
const delayROutput = document.querySelector("#delayRValue"); // 14.4 Slider // use of querySelector from previous experience
// 1: Get input value
delayRInput.addEventListener("input", function () {
  delayRSliderNum = parseFloat(delayRInput.value); // 1: Parse as a number
  delayROutput.textContent = " " + delayRSliderNum; // 14.4 Slider // updates html
});

const randomRInput = document.querySelector("#randomR"); // 1 // use of  querySelector from previous experience
let randomRSliderNum = 1; // random chance value // default 1
const randomROutput = document.querySelector("#randomRValue"); // 14.4 Slider // use of querySelector from previous experience
// 1: Get input value
randomRInput.addEventListener("input", function () {
  randomRSliderNum = parseFloat(randomRInput.value); // 1: Parse as a number
  randomROutput.textContent = " " + randomRSliderNum; // 14.4 Slider // updates html
});

///////////////////////////////////////////////
// Tone.js Starting Audio
///////////////////////////////////////////////
// 10: Tone.js Starting Audio: using an event listner to start play
// attach a click listener to a play button
document.querySelector("#play").addEventListener("click", async () => {
  play = true; // change play to true, so other code only works when true
});

// 10: Tone.js Starting Audio:
document.querySelector("#generate").addEventListener("click", async () => {
  await Tone.start(); // 10: Tone.js Starting Audio // waits for tone.js to start before anything else, because browsers need a click function before sound can work
  console.log("audio is ready"); // 10: Tone.js Starting Audio
  ngramGenerate(); // 3: Coding Train Markov Chains Tutorial // places ngrams in ngrams array // see in markov.js
  markovIt(); // Start markov generation
  start = true; // main.js draw functionality waits for start to be true before starting
});

document.querySelector("#restart").addEventListener("click", async () => {
  window.location.reload(); // 11: Reload // reload entire window when button pressed
});

///////////////////////////////////////////////
// Tone.js Instruments:
///////////////////////////////////////////////
// 12: Tone.js instruments: // 13: Tone.js Docs:
const sampler = new Tone.Sampler({
  urls: {
    C4: "C4.mp3",
    "D#4": "Ds4.mp3",
    "F#4": "Fs4.mp3",
    A4: "A4.mp3",
  },
  release: 1,
  baseUrl: "https://tonejs.github.io/audio/salamander/",
}).toDestination(); // 22 // Entire sampler from reference // used as Piano synth

let basic = new Tone.PolySynth(Tone.Synth).toDestination(); // 12: Tone.js instruments // 13: Tone.js Docs // sends specific synth to player
let AMSynth = new Tone.PolySynth(Tone.AMSynth).toDestination(); // 12: Tone.js instruments // 13: Tone.js Docs // sends specific synth to player
let fmSynth = new Tone.PolySynth(Tone.FMSynth).toDestination(); // 12: Tone.js instruments // 13: Tone.js Docs // sends specific synth to player
let monoSynth = new Tone.MembraneSynth({
  envelope: {
    attack: 0.1,
  },
}).toDestination(); // 12: Tone.js instruments // 13: Tone.js Docs // sends specific synth to player
let MembraneSynth = new Tone.PolySynth(Tone.MembraneSynth).toDestination(); // 12: Tone.js instruments // 13: Tone.js Docs // sends specific synth to player

// Create array for easier selection:
let instruments = [sampler, basic, AMSynth, fmSynth, monoSynth, MembraneSynth];

// ---------------------------------------------------------------------
// Update Synth:
const synthInput = document.querySelector("#order"); // use of querySelector from previous experience
let synth = instruments[0]; // choose synth // defualt = 0

const radioButtons = document.querySelectorAll('input[name="synth"]'); // 2: Get radio button values
let selectedSize = 0; // 2: Get radio button values

// Most below code from reference 2: Get radio button values:
function updateSynth() {
  for (const radioButton of radioButtons) {
    if (radioButton.checked) {
      // 2
      selectedSize = parseFloat(radioButton.value); // 2
      break;
    }
  }

  synth = instruments[selectedSize]; // choose synth // modified
}

///////////////////////////////////////////////
// Full Screen
// https://p5js.org/reference/p5/fullscreen/
///////////////////////////////////////////////
// function mousePressed() {
//   // conditions to check if mouse click is within canvas
//   if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
//     let fs = fullscreen();
//     // toggle
//     fullscreen(!fs);
//   }
// }

///////////////////////
// Window Resize
// https://p5js.org/reference/p5/windowResized/
///////////////////////

// resizes canvas when window is resize
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
