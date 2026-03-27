// 17 // Visualization
let analyser; // 17
const analyserSize = 128; // 17 // Amount of levels

// 18, fft
let myFFT; // 18 // variable for fast fourier transform
let levels = []; // 18 // stores fft values
const analyserSizeFFT = 128; // 17 // Amount of levels

let circles = []; // array for circle objects and their data

function visualFFTsetup() {
  Tone.start(); // 17
  const audSrc = new Tone.UserMedia(); // 17 // uses media from the users computer as input for the analyser
  analyser = new Tone.Analyser({
    type: "fft", // 17 // modified to use FFT after looking at references 23 & 24
    size: analyserSizeFFT, // 17
  });

  // set circles position radomly:
  for (let i = 0; i < analyserSizeFFT; i++) {
    fill(0);
    let randomX = random(0, width);
    let randomY = random(0, height);

    let xPercentage = map(randomX, 0, width, 5, 95); // for screen responsive circles // updates & remaps in draw function // constrains shapes between 5% and 95% of the screen // use of responsive web design from previous experience
    let yPercentage = map(randomY, 0, height, 7, 93); // for screen responsive circles // updates & remaps in draw function // constrains shapes between 5% and 95% of the screen // use of responsive web design from previous experience

    // push circles and their data to an array:
    circles.push({
      idx: i,
      xPos: xPercentage,
      yPos: yPercentage,
      size: 1,
    });
  }
}

// Get the FFT Values and visualize them
function visualFFT() {
  synth.connect(analyser); // 17 // modified to connect the synth to the analyser // tried synth and it worked
  levels = analyser.getValue(); // 18: get fft values and store in levels

  // 18 // do something for every level we get
  for (let i = 0; i < levels.length; i++) {
    push(); // 18 // to keep values contained & make sure they don't interfer with each other
    let binMapped = map(levels[i], -100, 0, 0, 50); // 18 // decibal sound levels for each frequency, can change input numbers
    levels[i] += 2;

    // struggled to figure out how to work with fft values, only adjusted circle size if the fft value was positive. When the value was negative it would increase the circle size.
    if (binMapped > 0) {
      let remap = map(binMapped, 0, 20, 0, 70);
      circles[i].size = remap;
    } else {
      circles[i].size = 0;
    }
    pop();
  }
}
