// ---------------------------------
// Notes:
// Lines of code with a number next to them indicate the reference. Notes will be added if the code was modified.
// See the reference.js file for references
// The difference in the music's rhythm and sound starts becoming less noticable at order 3
// ---------------------------------

let songLength = 10; // 3 // modified for shorter song to play in draw
let musicData; // original midi music data
let musicArr = []; // original midi music notes
let newMusicArr = []; // original midi music notes, with added data for timing (delay after each note)

let ngrams = {}; // 3 // empty object to store ngrams in
let resultData = []; // resultData from Markov // modified from reference 3 'result'
let resultArr = []; // resultData from Markov changed into cleaned array // modified from reference 3 'result'

let play = false; // if play has been pressed
let now; // 7 // variable for tone.js time

// Manual time delay - for note delays
// based on after looking at reference 15, and combining with previous experience using manual delays in Arduino
let currentTime; // for note delay
let previousTime = 0; // last time changed // for note delay
let interval = 0.66; // Time between changes // will update with specific note delays

// Manual time delay - for markov generation:
let previousMarkovTime = 0; // last time changed
let markovInterval = 0.5; // Time between changes

// Delay for order change
let previousOrderTime = 0; // last time changed
let orderInterval = 2; // Time delay for when order changes // allows for markov to generate before playing

let orderChanged = false; // if order has recently changed

let start = false; // if the program is ready to start

let noteIdx = 0;

function preload() {
  musicData = loadJSON("./debussy.json"); // load the song's midi json file

  myFFT = new Tone.FFT(16); // 18: creates a Tone.FFT to look at sound frequency // breaks up into sections (bins) //18: min: 16, max: 16384, needs to be even number // levels used to animate circles, see in visualization.js
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  musicArray(); // Get relevant music data from midi in musicArr
  visualFFTsetup(); // Setup function for FFT Visualisation. See in functions.js
}

function draw() {
  background(200);

  // place FFT Circle visuals in canvas:
  for (let i = 0; i < circles.length; i++) {
    fill(0);
    let xPos = map(circles[i].xPos, 0, 100, 0, width); // remap for responsive position on screen change // based on previous experience with responsive web development
    let yPos = map(circles[i].yPos, 0, 100, 0, height); // remap for responsive position on screen change // based on previous experience with responsive web development
    circle(xPos, yPos, circles[i].size); // size will be updated according to fft levels
  }

  // If the program has started, only start functions of generating markovs and playing notes:
  if (start == true) {
    generatePlayMarkov(); // generate markov notes & play // in main.js
    visualFFT(); // update circles with FFT Levels to change size // see in visualisation.js
  }

  updateSynth(); // Get radio button values & change synth if changed // see in functions.js
}

///////////////////////////////////////////////
// Play One Note
///////////////////////////////////////////////
// Manual loop based on idx++:
function playNote() {
  let note = resultData[noteIdx]; // select note from markov generated notes, according to noteIdx (for loop that works with constantly updating resultData, technique based on trial and error with a for loop)
  // console.log(note);

  // if a note delay is longer than 5, reduce it to 1. This is for other json files I tested such as plantasia
  if (note.delay > 5) {
    note.delay = 1;
  }

  ///////////////////////////
  // Slider Changes:
  ///////////////////////////
  // random delay variation:
  //   let randomVal = random(0, 10);
  //   if (randomVal < randomRSliderNum) {
  //     delaySliderNum *= delayRSliderNum; //. delay of that note
  //   }

  let noteDuration = note.duration; // duration of current note
  noteDuration *= durationSliderNum; // duration of current note, get longer if the delay slider value goes up, and shorter if below 0
  console.log(noteDuration);

  noteDelay = note.delay; // delay of current note
  noteDelay *= delaySliderNum; // delay multiplied the delay slider value
  console.log("note delay: " + noteDelay);
  console.log("---------------------------");

  ///////////////////////////
  // For manual delay:
  ///////////////////////////
  interval = noteDelay; // interval updated with specific note delay for the manual note delay in draw()

  ///////////////////////////
  // Play:
  ///////////////////////////
  synth.triggerAttackRelease(note.name, noteDuration, now, note.velocity); // 7 & & 13 tone.js // play the notes according to their data, with selected synth // this function triggers the note, and releases it

  ///////////////////////////
  noteIdx++; // note index, resets to 0 if ngram order value changes, see functions.js
}

///////////////////////////////////////////////
// Generating markovs and playing notes:
// Functionality to generate short markovs, and then play them
// This allows for quicker ability to change the ngram value and play it back
///////////////////////////////////////////////
function generatePlayMarkov() {
  // console.log(resultArr);
  now = Tone.now(); // 8. Tone.js clock
  let currentTime = now; // time at start // for manual note delay

  // pause markov on order change:
  // if the markov data has at least 1 value & if ngram order value is not a NaN (reference 16) & if the order change was completed
  if (resultData.length > 0 && orderChanged == false && !isNaN(order)) {
    if (currentTime - previousMarkovTime > markovInterval) {
      // delay 0.5 seconds before generting new markov notes after ngram order change with updated ngram order value :
      previousMarkovTime = currentTime; // for manual delay
      previousOrderTime = currentTime; // for manual delay // change for order time, so it has previoustime for delay
      markovIt(); // generate markov notes, if there is a value in the resultData
    }
  }

  // if play has been pressed, and the order value isn't being changed:
  if (play == true && orderChanged == false) {
    // if time of delay has passed, play next note:
    // interval is specific note delay
    if (currentTime - previousTime > interval) {
      previousTime = currentTime; // update for manual delay technique
      //   console.log("note played at: " + previousTime);
      playNote();
    }
  }

  // Generate markov when order is in process of being changed:
  if (orderChanged == true) {
    // add delay
    if (currentTime - previousOrderTime > orderInterval) {
      previousOrderTime = currentTime; // for manual delay
      orderChanged = false; // if order is not in process of change
      markovIt(); // generate markov notes
      console.log(resultData);
    }
  }
}
