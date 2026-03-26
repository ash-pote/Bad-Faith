///////////////////////////////////////////////
// Get Music Data from Midi file:
///////////////////////////////////////////////
///////////////////////////////
// Based off method from reference 7:
function musicArray() {
  // Put relevant original music data into musicArr array:
  // 7: Tone.js:
  // loop through musicData (from song json file) and for each track get the notes and their data:
  musicData.tracks.forEach((track) => {
    const notes = track.notes; // 7

    // 7: Tone.js // modified to push the data to ann array instead of play it:
    notes.forEach((note) => {
      // 7: Tone.js
      musicArr.push({
        duration: note.duration, // 7: Tone.js // modified to push the data to an object
        durationTicks: note.durationTicks,
        midi: note.midi,
        name: note.name, // 7: Tone.js // modified to push the data to an object
        ticks: note.ticks,
        time: note.time, // 7: Tone.js // modified to push the data to an object
        vel: note.velocity, // 7: Tone.js // modified to push the data to an object
      });
    });
  });

  ///////////////////////////////////
  // Get the delay data for each music note and put in newMusicArr:
  let prevNote = 0;

  for (let i = 0; i < musicArr.length; i++) {
    let currentNote = musicArr[i];

    if (i === 0) {
      // if first push time '0'
      currentNote = { ...currentNote, timeAfter: prevNote }; // 9 Spread operator
      newMusicArr.push(currentNote); // push previous note data plus new delay data
      prevNote = currentNote.time; // previous note is now current note time for next loop
    } else {
      // else if it's the second note in the music array
      // push currentnote time, minus the previous note time
      currentNote = { ...currentNote, timeAfter: currentNote.time - prevNote }; // 9 Spread operator
      prevNote = currentNote.time; // previous note is now current note time for next loop
      newMusicArr.push(currentNote); // push previous note data plus new delay data
    }
  }
}

///////////////////////////////////////////////
// Ngram Generate
///////////////////////////////////////////////
// 3: Coding Train Markov Chains:
function ngramGenerate() {
  // loop through music arr and get ngram
  // 3 // Modified to use musicArr
  for (let i = 0; i <= newMusicArr.length - order; i++) {
    // 3: Get 'substring' according to ngram length:
    let gram = newMusicArr.slice(i, i + order); // 3: Coding Train Markov Chains // modified to use array

    //////////////
    // get name of ngram // needed to add this because I was working with array values
    let gramNameSeq = "";
    for (let k = 0; k < gram.length; k++) {
      gramNameSeq += gram[k].name + " ";
    }
    //////////////

    // 3: If nothing found make an array
    // 3: Otherwise push the next 'character'
    if (!ngrams[gramNameSeq]) {
      ngrams[gramNameSeq] = []; // 3: if nothing found make an array
    }
    ngrams[gramNameSeq].push(newMusicArr[i + order]); // 3: otherwise push the next 'character' (music note) in
  }
  console.log("Ngrams: ");
  console.log(ngrams);
}

///////////////////////////////////////////////
// Markov Generate
///////////////////////////////////////////////
// Below markov function based on reference 3
// Modified to use midi song notes and array values compared to string values in original
// Modified to keep generating small markovs with a shorter 'song length' in draw function
function markovIt() {
  let startTime;
  let lastGram;

  ////////////////////////
  // Start with last markov ngram
  // if generated once already use first markov, use the last result of that for the next generation
  // else start with the first ngram from the original song
  if (resultArr.length > 0) {
    lastGram = resultArr; // last ngram in generated song if already generated once
    startTime = resultData[resultData.length - 1].time;
  } else {
    // start with first ngram in original song if not generated once yet
    lastGram = newMusicArr.slice(0, order); // 3 // Modified to use array // 4: Slice
    startTime = lastGram[lastGram.length - 1].time;
  }

  // start with last ngram
  let currentGram = lastGram; // 3: Coding Train Markov Chains Tutorial // modified for array and to use lastGram
  ////////////////////////

  ////////////////////////
  // change to string name (Easier for selecting ngrams):
  let currentGramName = "";
  if (resultArr.length > 0) {
    for (let k = 0; k < currentGram.length; k++) {
      currentGramName += currentGram[k] + " ";
    }
  } else {
    for (let k = 0; k < currentGram.length; k++) {
      currentGramName += currentGram[k].name + " ";
    }
  }
  ////////////////////////

  // result of generation
  let result = currentGramName; // 3: Coding Train Markov Chains Tutorial

  // generate according to chosen song length:
  // Modified to use a short 'song' length so each markov generated in the draw function isn't unnecessarily long. This allows for changing the the ngram order and playing quickly.
  for (let i = 0; i < songLength; i++) {
    // console.log("current result: " + result); // will change each loop

    // get possibilities of current ngram
    let possibilities = ngrams[currentGramName]; // 3: Coding Train Markov Chains Tutorial

    // 3 // if there are no ngram possibilities
    // Modified to use fallback instead of 'break'
    // Originally used when I was getting undefined values, but problem seems to be fixed now and fallbacks are hardly used
    if (!possibilities || possibilities[0] == undefined) {
      console.log("------------using fallback");
      currentGram = musicArr.slice(i + order, i + order * 2); // moves onto next ngram // 4: Slice:

      // change array into string
      currentGramName = "";
      for (let k = 0; k < currentGram.length; k++) {
        currentGramName += currentGram[k].name + " ";
      }

      // Next possible ngrams for fallback
      possibilities = ngrams[currentGramName]; // 3: Coding Train Markov Chains Tutorial
    } else {
      //   console.log("------------new possibility found");
    }

    // console.log("possibilities"); // list of possibilities
    // console.log(possibilities); // list of possibilities

    // remove undefined
    let filterPos = possibilities.filter(Boolean); // 5: Remove undefined

    // get random element from filtered possibilities array
    let randomNext = floor(random(0, filterPos.length)); // 3: Coding Train Markov Chains Tutorial // modified to use floor and filterPos
    let next = filterPos[randomNext]; // 3: Coding Train Markov Chains Tutorial // modified to use filterPos
    // console.log("Next");
    // console.log(next);

    /////////////////////////////////
    // Add next ngram data to resultArr
    let math = startTime + next.timeAfter; // + delay

    // if startTime exists:
    if (startTime)
      // choosing specific note data to play, learnt from reference 7
      resultData.push({
        name: next.name, // note name // learnt from 7
        duration: next.duration, // duration of note
        time: startTime + next.timeAfter, // Time for note based on timeAfter, if using in a sequence // learnt from 7
        delay: next.timeAfter, // delay of note // learnt from 7
        velocity: next.vel, // Velocity of note // learnt from 7
      });
    startTime = math; // startTime is now updated with new time

    // add note name to result
    result += next.name + " "; // 3: Coding Train Markov Chains Tutorial // modified to use the ngram name isntead of 'next'

    // convert result back into array
    // Clean -------------------------------
    // convert result back into array
    let resultClean = result.split(" "); // 6: Split, separate into array accordding to spacing between note names
    resultClean.pop(); // remove last array value
    // --------------------------------------

    // change currentGram to the last ngram in the result text
    // // 3: Coding Train Markov Chains Tutorial - modified to use array
    resultArr = resultClean.slice(
      resultClean.length - order,
      resultClean.length,
    );

    // convert back into ngram string name
    currentGramName = "";
    for (let k = 0; k < resultArr.length; k++) {
      currentGramName += resultArr[k] + " ";
    }
  }
}
