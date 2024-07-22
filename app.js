function fillArray(array, size, max, min) {
  for (let i = 0; i < size; i++) {
    let randNum = Math.floor((Math.random() * (max - min)) + (min)) ;
    array[i] = randNum
  }
  //printArray(array, "unsorted")
}

function printArray(array, txt) {
  console.log(txt)
  for (let i = 0; i < array.length; i++) {
    console.log(array[i])
  }
}

function printArrayString(array, txt) {
  console.log(txt)
  let string = "";
  for (let i = 0; i < array.length; i++) {
    string += array[i] + " "
  }
  console.log(string)
}

function slideSwapAnimation(div1, div2, velocity, speed, visualizer) {
  return new Promise((resolve) => {
    setTimeout((e) => {
      let rect1 = div1.getBoundingClientRect(); 
      let rect2 = div2.getBoundingClientRect(); 
      let start1 = rect1.x;
      let end1 = rect2.x;
      let start2 = rect2.x;
      let end2 = rect1.x;
      let clone1 = div1.cloneNode();
      let clone2 = div2.cloneNode();
      clone1.style.position = "absolute";
      clone1.style.zIndex = 999;
      clone2.style.position = "absolute";
      clone1.style.left = start1 + "px";
      clone2.style.left = start2 + "px";
      visualizer.appendChild(clone1)
      visualizer.appendChild(clone2)
      div1.style.opacity = 0;
      div2.style.opacity = 0;
      let directionBool = true
      if (start1 > start2) {
        directionBool = false
      }

      let interval = setInterval(() => {
        if (directionBool) {
          if (start1 <= end1) {
            start1 += velocity;
            clone1.style.left = start1 + "px"
            start2 -= velocity;
            clone2.style.left = start2 + "px"
          }
          else {
            clone1.remove()
            clone2.remove()
            clearInterval(interval)
            resolve('resolved');
          }
        }
        else {
          if (start1 >= end1) {
            start1 -= velocity;
            clone1.style.left = start1 + "px"
            start2 += velocity;
            clone2.style.left = start2 + "px"
          }
          else {
            clone1.remove()
            clone2.remove()
            clearInterval(interval)
            resolve('resolved');
          }
        }  
      }, speed)
    }, 100) //400
  })
}

function swapLocations(div1, div2, index1, index2) {
  div1.style.opacity = 1
  div2.style.opacity = 1
  let tempItem = div2.cloneNode();
  div1.dataset.index = index2
  div2.dataset.index = index1
  div2.insertAdjacentElement("beforebegin", tempItem)
  div1.insertAdjacentElement("beforebegin", div2)
  tempItem.insertAdjacentElement("beforebegin", div1)
  tempItem.remove()
}

async function swap(array, index1, index2, velocity, speed, visualizer, scale) {
  let temp = array[index1];
  array[index1] = array[index2]
  array[index2] = temp;
  let item1 = visualizer.querySelector(`[data-index="${index1}"]`);
  let item2 = visualizer.querySelector(`[data-index="${index2}"]`);
  item1.classList.add("flash")
  //playOsc(osc1, "triangle", getFrequency(array[index1]), .25)
  let freqArray;
  switch(scale) {
    case "Major":
      freqArray = [getFrequencyMajorHectatonic(array[index1]), getFrequencyMajorHectatonic(array[index2])]
      break;
    case "Dorian":
      freqArray = [getFrequencyDorianHectatonic(array[index1]), getFrequencyDorianHectatonic(array[index2])]
      break;
    case "Minor":
      freqArray = [getFrequencyNaturalMinorHectatonic(array[index1]), getFrequencyNaturalMinorHectatonic(array[index2])]
      break;

    case "Harmonic Minor":
      freqArray = [getFrequencyHarmonicMinorHectatonic(array[index1]), getFrequencyHarmonicMinorHectatonic(array[index2])]
      break;
    case "Melodic Minor":
      freqArray = [getFrequencyMelodicMinorHectatonic(array[index1]), getFrequencyMelodicMinorHectatonic(array[index2])]
      break;

    case "Minor Pentatonic":
      freqArray = [getFrequencyMinorPentatonic(array[index1]), getFrequencyMinorPentatonic(array[index2])]
      break;
    case "Major Pentatonic":
      freqArray = [getFrequencyMajorPentatonic(array[index1]), getFrequencyMajorPentatonic(array[index2])]
      break;
    case "Chromatic":
      freqArray = [getFrequencyChromatic(array[index1]), getFrequencyChromatic(array[index2])]
      break;
  }




  await slideSwapAnimation(item1, item2, velocity, speed, visualizer)
  .then((r) => swapLocations(item1, item2, index1, index2))
  .then((data) => {
    noteDisplay1.innerHTML = freqArray[1][1]
    noteDisplay2.innerHTML = freqArray[0][1]
    playOsc(osc1, osc1Type.value, gain1, sustain1, freqArray[0][0], .3)
    playOsc(osc2, osc2Type.value, gain2, sustain2, freqArray[1][0], .3)
    
    //setTimeout(() => {
      //playOsc(osc1, "triangle", freqArray[1], .3)
    //}, 200)
  })
}

//const wait = delay => new Promise(resolve => setTimeout((resolve, 20))).then((data) => swap(array, i, h))

async function selectionSortAscending(array, velocity, speed, visualizer, scale) {
  len = array.length;
  for (let i = 0; i < len; i++) {
    for (let h = i+1; h < len; h++) {
      if (array[i] > array[h]) {
        await swap(array, i, h, velocity, speed, visualizer, scale)
      }
      if (reset) {
        return 0;
      }
    }
  }

  playSortedNotes(array, scale, visualizer)
  //printArray(array, "Selection Sort - ascending")
}


async function selectionSortDescending(array, velocity, speed, visualizer, scale) {
  len = array.length;
  for (let i = 0; i < len; i++) {
    for (let h = i+1; h < len; h++) {
      if (array[i] < array[h]) {
        await swap(array, i, h, velocity, speed, visualizer, scale)
      }
      if (reset) {
        return 0;
      }
    }
  }
  playSortedNotes(array, scale, visualizer)
  //printArray(array, "Selection Sort - descending")
}


async function bubbleSortAscending(array, velocity, speed, visualizer, scale) {
  len = array.length;
  for (let i = len; i > 0; i--) {
    for (let h = 1; h < i; h++) {
      if (array[h-1] > array[h]) {
        await swap(array, h-1, h, velocity, speed, visualizer, scale);
      }
      if (reset) {
        return 0;
      }
    }
  }
  playSortedNotes(array, scale, visualizer)
  //printArray(array, "Bubble Sort - ascending")
}

async function bubbleSortDescending(array, velocity, speed, visualizer, scale) {
  len = array.length;
  for (let i = len; i > 0; i--) {
    for (let h = 1; h < i; h++) {
      if (array[h-1] < array[h]) {
        await swap(array, h-1, h, velocity, speed, visualizer, scale);
      }
      if (reset) {
        return 0;
      }
    }
  }
  playSortedNotes(array, scale, visualizer)
  //printArray(array, "Bubble Sort - descending")
}

async function insertionSortAscending(array, velocity, speed, visualizer, scale) {
  len = array.length;
  for (let i = 0; i < len; i++) {
    for (let h = i; h > 0; h--) {
      if (array[h] < array[h-1]) {
        await swap(array, h, h-1, velocity, speed, visualizer, scale)
      }
      else {
        break
      }
      if (reset) {
        return 0;
      }
    }
  }
  playSortedNotes(array, scale, visualizer)

  //printArray(array, "Insertion Sort - Ascending")
}

async function insertionSortDescending(array, velocity, speed, visualizer, scale) {
  len = array.length;
  for (let i = 0; i < len; i++) {
    for (let h = i; h > 0; h--) {
      if (array[h] > array[h-1]) {
        await swap(array, h, h-1, velocity, speed, visualizer, scale)
      }
      else {
        break;
      }
      if (reset) {
        return 0;
      }
    }
  }
  playSortedNotes(array, scale, visualizer)
  //printArray(array, "Insertion Sort - descending")
}


function getFrequencyChromatic(num) {
  let noteNum;
  let note;
  let freq;
  if (num <= 11) {
    noteNum = num;
  }
  else {
    console.log("note original: " + num)
    noteNum = (num % 12);
    console.log("note modulus: " + noteNum)
  }

  switch(noteNum) {
    /** 
    case -2:
      freq = 27.5;
      note = "A0";
      break;
    case -1:
      freq = 29.135;
      note = "A#0";
      break;
    case 0:
      freq = 30.867;
      note = "B0";
      break;
    */
    case 0:
      freq = 32.70320// 261.63;
      note = "C";
      break;
    case 1:
      freq = 34.64783 // 277.18;
      note = "C#/Db"
      break;
    case 2:
      freq = 36.70810 //293.66;
      note = "D"
      break;
    case 3:
      freq = 38.89087 //311.13;
      note = "D#/Eb"
      break;
    case 4:
      freq = 41.20344 //329.62;
      note = "E"
      break;
    case 5:
      freq = 43.65353 // 349.23;
      note = "F"
      break;
    case 6:
      freq = 46.24930 //69.99;
      note = "F#/Gb"
      break;
    case 7:
      freq = 48.99943		//392;
      note = "G"
      break;
    case 8:
      freq = 51.91309 //415.30;
      note = "G#/Ab"
      break;
    case 9:
      freq = 55.00000;
      note = "A"
      break;
    case 10:
      freq = 58.27047;
      note = "A#/Bb"
      break;
    case 11:
      freq = 61.73541;
      note = "B"
      break;
  }

  let multiplier = 1
  if (num > 11) {

    multiplier = Math.floor(num /12);

    if (multiplier < 2) {
      note = note + (multiplier + 1)  
      freq *= 2   
    }
    else {
      for (let i = 0; i < multiplier; i++) {
        freq *= 2

      }
      note = note + (multiplier + 1)
    }
  }
  else {
    note = note + (multiplier)
  }
 
  //console.log("final freq: " + freq)
  //console.log("note name: " + note)
  return [freq, note];
}


function getFrequencyMajorHectatonic(num) {
  let noteNum;
  let note;
  let freq;
  if (num <= 6) {
    noteNum = num;
  }
  else {
    noteNum = (num % 7);
  }

  switch(noteNum) {
    case 0:
      freq = 32.70320// 261.63;
      note = "C";
      break;
    case 1:
      freq = 36.70810 //293.66;
      note = "D"
      break;
    case 2:
      freq = 41.20344 //329.62;
      note = "E"
      break;
    case 3:
      freq = 43.65353 // 349.23;
      note = "F"
      break;
    case 4:
      freq = 48.99943		//392;
      note = "G"
      break;
    case 5:
      freq = 55.00000;
      note = "A"
      break;
    case 6:
      freq = 61.73541;
      note = "B"
      break;
  }

  let multiplier = 1
  if (num > 7) {
    multiplier = Math.floor(num /7);

    if (multiplier < 2) {
      note = note + (multiplier + 1)  
      freq *= 2   
    }
    else {
      for (let i = 0; i < multiplier; i++) {
        freq *= 2
      }
      note = note + (multiplier + 1)
    }
  }
  else {
    note = note + (multiplier)
  }
 
  
  //console.log("final freq: " + freq)
  //console.log("note name: " + note)
  return [freq, note];
}

function getFrequencyNaturalMinorHectatonic(num) {
  let noteNum;
  let note;
  let freq;
  if (num <= 6) {
    noteNum = num;
  }
  else {
    noteNum = (num % 7);
  }

  switch(noteNum) {
    case 0:
      freq = 32.70320// 261.63;
      note = "C";
      break;
    case 1:
      freq = 36.70810 //293.66;
      note = "D"
      break;
    case 2:
      freq = 38.89087 //311.13;
      note = "D#/Eb"
      break;
    case 3:
      freq = 43.65353 // 349.23;
      note = "F"
      break;
    case 4:
      freq = 48.99943		//392;
      note = "G"
      break;
    case 5:
      freq = 51.91309 //415.30;
      note = "G#/Ab"
      break;
    case 6:
      freq = 58.27047;
      note = "A#/Bb"
      break;
  }


  let multiplier = 1
  if (num > 7) {
    multiplier = Math.floor(num /7);

    if (multiplier < 2) {
      note = note + (multiplier + 1)  
      freq *= 2   
    }
    else {
      for (let i = 0; i < multiplier; i++) {
        freq *= 2
      }
      note = note + (multiplier + 1)
    }
  }
  else {
    note = note + (multiplier)
  }
 
  
  //console.log("final freq: " + freq)
  //console.log("note name: " + note)
  return [freq, note];
}


function getFrequencyDorianHectatonic(num) {
  let noteNum;
  let note;
  let freq;
  if (num <= 6) {
    noteNum = num;
  }
  else {
    noteNum = (num % 7);
  }

  switch(noteNum) {
    case 0:
      freq = 32.70320// 261.63;
      note = "C";
      break;
    case 1:
      freq = 36.70810 //293.66;
      note = "D"
      break;
    case 2:
      freq = 38.89087 //311.13;
      note = "D#/Eb"
      break;
    case 3:
      freq = 43.65353 // 349.23;
      note = "F"
      break;
    case 4:
      freq = 48.99943		//392;
      note = "G"
      break;
    case 5:
      freq = 55.00000;
      note = "A"
      break;
    case 6:
      freq = 58.27047;
      note = "A#/Bb"
      break;
  }

  let multiplier = 1
  if (num > 7) {
    multiplier = Math.floor(num /7);

    if (multiplier < 2) {
      note = note + (multiplier + 1)  
      freq *= 2   
    }
    else {
      for (let i = 0; i < multiplier; i++) {
        freq *= 2
      }
      note = note + (multiplier + 1)
    }
  }
  else {
    note = note + (multiplier)
  }
 
  
  //console.log("final freq: " + freq)
  //console.log("note name: " + note)
  return [freq, note];
}

function getFrequencyMelodicMinorHectatonic(num) {
  let noteNum;
  let note;
  let freq;
  if (num <= 6) {
    noteNum = num;
  }
  else {
    noteNum = (num % 7);
  }


  switch(noteNum) {
    case 0:
      freq = 32.70320// 261.63;
      note = "C";
      break;
    case 1:
      freq = 36.70810 //293.66;
      note = "D"
      break;
    case 2:
      freq = 38.89087 //311.13;
      note = "D#/Eb"
      break;
    case 3:
      freq = 43.65353 // 349.23;
      note = "F"
      break;
    case 4:
      freq = 48.99943		//392;
      note = "G"
      break;
    case 5:
      freq = 55.00000;
      note = "A"
      break;
    case 6:
      freq = 61.73541;
      note = "B"
      break;
  }
  
  let multiplier = 1
  if (num > 7) {
    multiplier = Math.floor(num /7);

    if (multiplier < 2) {
      note = note + (multiplier + 1)  
      freq *= 2   
    }
    else {
      for (let i = 0; i < multiplier; i++) {
        freq *= 2

      }
      note = note + (multiplier + 1)
    }
  }
  else {
    note = note + (multiplier)
  }
 
  
  //console.log("final freq: " + freq)
  //console.log("note name: " + note)
  return [freq, note];
}

function getFrequencyHarmonicMinorHectatonic(num) {
  let noteNum;
  let note;
  let freq;
  if (num <= 6) {
    noteNum = num;
  }
  else {
    //console.log("note original: " + num)
    noteNum = (num % 7);
    //console.log("note modulus: " + noteNum)
  }

  switch(noteNum) {
    case 0:
      freq = 32.70320// 261.63;
      note = "C";
      break;
    case 1:
      freq = 36.70810 //293.66;
      note = "D"
      break;
    case 2:
      freq = 38.89087 //311.13;
      note = "D#/Eb"
      break;
    case 3:
      freq = 43.65353 // 349.23;
      note = "F"
      break;
    case 4:
      freq = 48.99943		//392;
      note = "G"
      break;
    case 5:
      freq = 51.91309 //415.30;
      note = "G#/Ab"
      break;
    case 6:
      freq = 61.73541;
      note = "B"
      break;
  }

  let multiplier = 1
  if (num > 7) {
    //console.log("freq: " + freq)
    //console.log("multiplier: " + (Math.floor(num /6)))
    multiplier = Math.floor(num /7);

    if (multiplier < 2) {
      note = note + (multiplier + 1)  
      freq *= 2   
    }
    else {
      for (let i = 0; i < multiplier; i++) {
        freq *= 2
        //console.log(freq)
      }
      note = note + (multiplier + 1)
    }
  }
  else {
    note = note + (multiplier)
  }
 
  
  //console.log("final freq: " + freq)
  //console.log("note name: " + note)
  return [freq, note];
}

function getFrequencyMinorPentatonic(num) {
  let noteNum;
  let note;
  let freq;
  if (num <= 4) {
    noteNum = num;
  }
  else {
    //console.log("note original: " + num)
    noteNum = (num % 5);
    //console.log("note modulus: " + noteNum)
  }

  switch(noteNum) {
    case 0:
      freq = 32.70320// 261.63;
      note = "C";
      break;
    case 1:
      freq = 38.89087 //311.13;
      note = "D#/Eb"
      break;
    case 2:
      freq = 43.65353 // 349.23;
      note = "F"
      break;
    case 3:
      freq = 48.99943		//392;
      note = "G"
      break;
    case 4:
      freq = 58.27047;
      note = "A#/Bb"
      break;
  }


  let multiplier = 1
  if (num > 5) {
    //console.log("freq: " + freq)
    //console.log("multiplier: " + (Math.floor(num /4)))
    multiplier = Math.floor(num /5);

    if (multiplier < 2) {
      note = note + (multiplier + 1)  
      freq *= 2   
    }
    else {
      for (let i = 0; i < multiplier; i++) {
        freq *= 2
        //console.log(freq)
      }
      note = note + (multiplier + 1)
    }
  }
  else {
    note = note + (multiplier)
  }
 
  
  //console.log("final freq: " + freq)
  //console.log("note name: " + note)
  return [freq, note];
}

function getFrequencyMajorPentatonic(num) {
  let noteNum;
  let note;
  let freq;
  if (num <= 4) {
    noteNum = num;
  }
  else {
    //console.log("note original: " + num)
    noteNum = (num % 5);
    //console.log("note modulus: " + noteNum)
  }

  switch(noteNum) {
    case 0:
      freq = 55.00// 261.63;
      note = "A";
      break;
    case 1:
      freq = 65.40639 //311.13;
      note = "C"
      break;
    case 2:
      freq = 73.41619 // 349.23;
      note = "D"
      break;
    case 3:
      freq = 82.40689		//392;
      note = "E"
      break;
    case 4:
      freq = 97.99886;
      note = "G"
      break;
  }


  let multiplier = 1
  if (num > 5) {
    //console.log("freq: " + freq)
    //console.log("multiplier: " + (Math.floor(num /4)))
    multiplier = Math.floor(num /5);

    if (multiplier < 2) {
      note = note + (multiplier + 1)  
      freq *= 2   
    }
    else {
      for (let i = 0; i < multiplier; i++) {
        freq *= 2
        //console.log(freq)
      }
      note = note + (multiplier + 1)
    }
  }
  else {
    note = note + (multiplier)
  }
 
  
  //console.log("final freq: " + freq)
  //console.log("note name: " + note)
  return [freq, note];
}



function singleBlock(num, array, visualizer) {
  compStyles = window.getComputedStyle(visualizer) 
  let width = compStyles.getPropertyValue("width").slice(0,-2)
  let height = compStyles.getPropertyValue("height").slice(0,-2)
  let block = document.createElement('div');
  block.dataset.index = num;
  block.style.width = (width / array.length) + "px"
  block.style.height = ((array[num] / (max) ) * (height - 5)) + 5 + "px"
  block.classList.add("block")
  block.style.backgroundColor = `rgb(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)},${Math.floor(Math.random() * 255)})`
  return block;
}


function createBlocks(array, visualizer) {
  while (visualizer.firstChild) {
    visualizer.firstChild.remove();
  }

  /** 
  noteDisplay1 = document.createElement("div");
  noteDisplay1.classList.add("noteDisplay")
  noteDisplay1.setAttribute("id", "note1");

  noteDisplay2 = document.createElement("div");
  noteDisplay2.classList.add("noteDisplay")
  noteDisplay2.setAttribute("id", "note2");

  visualizer.appendChild(noteDisplay1);
  visualizer.appendChild(noteDisplay2)
  */



  for (let i = 0; i < array.length; i++) {
    let block = singleBlock(i, array, visualizer)
    visualizer.appendChild(block)
  }
}

//playOsc(osc1, "triangle", freqArray[i][1], .25)

function playSortedNotes(array, scale, visualizer) {
  for (let n = 1; n <= array.length; n++) {
    visualizer.querySelector(`[data-index="${n-1}"]`).classList.remove("flash")
    visualizer.querySelector(`[data-index="${n-1}"]`).classList.remove("wiggle")
    setTimeout(() => {
      visualizer.querySelector(`[data-index="${n-1}"]`).classList.add("wiggle")
      let noteData;
      let note;
      switch(scale) {
        case "Major":        
          noteData = getFrequencyMajorHectatonic(array[n-1])
          freq = noteData[0]
          note = noteData[1]
          break;
        case "Dorian":
          noteData = getFrequencyDorianHectatonic(array[n-1])
          freq = noteData[0]
          note = noteData[1]
          break;
        case "Minor":
          noteData = getFrequencyNaturalMinorHectatonic(array[n-1])
          freq = noteData[0]
          note = noteData[1]
          break;
        case "Harmonic Minor":
          noteData = getFrequencyHarmonicMinorHectatonic(array[n-1])
          freq = noteData[0]
          note = noteData[1]
          break;
        case "Melodic Minor":
          noteData = getFrequencyMelodicMinorHectatonic(array[n-1])
          freq = noteData[0]
          note = noteData[1]
          break;
        case "Minor Pentatonic":
          noteData = getFrequencyMinorPentatonic(array[n-1])
          freq = noteData[0]
          note = noteData[1]
          break;
        case "Major Pentatonic":
          noteData = getFrequencyMajorPentatonic(array[n-1])
          freq = noteData[0]
          note = noteData[1]
          break;
        case "Chromatic":
          noteData = getFrequencyChromatic(array[n-1])
          freq = noteData[0]
          note = noteData[1]
          break;
      }
      if (n == 1)
      {
        noteDisplay1.innerHTML = note;
      }
      noteDisplay2.innerHTML = note;

      playOsc(osc1, osc1Type.value, gain1, sustain1, freq, .3)
      playOsc(osc2, osc2Type.value, gain2, sustain2, freq, .3)
    }, 300 * n)
  }
}

let array1 = [];
let array2 = [];
const vis = document.querySelector("#visualizer")
//const vis2 = document.querySelector("#visualizer2")
const resetBtn = document.querySelector("#reset")
const sortBtn = document.querySelector("#sort")
const sortType = document.querySelector("#sortType")
const osc1Type = document.querySelector("#oscillator1Type")
const osc2Type = document.querySelector("#oscillator2Type")
const direction = document.querySelector("#direction")
const scaleType = document.querySelector("#scale")
const sizeSlider = document.querySelector("#sizeSlider")
const maxPitchSlider = document.querySelector("#maxPitchSlider")
const minPitchSlider = document.querySelector("#minPitchSlider")
const speedSlider = document.querySelector("#speedSlider")
const sustainSlider1 = document.querySelector("#sustainSlider1")
const gainSlider1 = document.querySelector("#gainSlider1")
const sustainSlider2 = document.querySelector("#sustainSlider2")
const gainSlider2 = document.querySelector("#gainSlider2")
const noteDisplay1 = document.querySelector("#note1")
const noteDisplay2 = document.querySelector("#note2")


let unsorted = true;
let reset = false;

    

let size = Number(sizeSlider.value) //20;
let max = Number(maxPitchSlider.value) //21//20//28; //84
let min = Number(minPitchSlider.value) //5//10 //14;
let velocity = 2;
let speed = 52 - Number(speedSlider.value);
let sustain1 = Number(sustainSlider1.value) / 100
let gain1 = 0.1 + (Number(gainSlider1.value) / 100)
let sustain2 = Number(sustainSlider2.value) / 100
let gain2 = 0.1 + (Number(gainSlider2.value) / 100)
let osc1
let osc2
const audioCtx = new (window.AudioContext || window.webkit.AudioContext)();



array1 = []
fillArray(array1, size, max, min)
createBlocks(array1, vis)


function playOsc(osc, type, gain, sustain, freq) {
  stopTime = Number(sustain)
  let gain1 = audioCtx.createGain();
  gain1.gain.value = gain;
  osc = audioCtx.createOscillator();
  osc.type =  type// type//"sawtooth" //"square";
  osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
  osc.connect(gain1).connect(audioCtx.destination);
  osc.start(audioCtx.currentTime)
  stopTime += .25
  gain1.gain.setTargetAtTime(0, audioCtx.currentTime + stopTime - 0.25, .025);
  osc.stop(audioCtx.currentTime + stopTime)
  //osc.disconnect(audioCtx.destination)
}

resetBtn.addEventListener("click", (e) => {
  array1 = []
  if (reset == false) {
    reset = true
  }
  while (vis.firstChild) {
    vis.firstChild.remove();
  }
  max = Number(maxPitchSlider.value)
  //console.log("max: " + max)
  min = Number(minPitchSlider.value)
  //console.log("min: " + min)
  size = Number(sizeSlider.value)
  //console.log("size: " + size)
  //while (vis2.firstChild) {
   //vis2.firstChild.remove();
  //}
  fillArray(array1, size, max, min)
  //printArray(array, "Unsorted")
  createBlocks(array1, vis)

  //fillArray(array2, size, max, min)
  //printArray(array, "Unsorted")
  //createBlocks(array2, vis2)
  unsorted = true
})

sortBtn.addEventListener("click", (e) => {
  reset = false

  speed = 52 - Number(speedSlider.value);

  if (unsorted) {
    switch (sortType.value) {
      case "selection":
        if (direction.value == "ascend") {
          selectionSortAscending(array1, velocity, speed, vis, scaleType.value);
          //selectionSortAscending(array2, velocity, speed, getFrequencyMajorHectatonic, vis2)
        }
        else {
          selectionSortDescending(array1, velocity, speed, vis, scaleType.value)
          //selectionSortDescending(array2, velocity, speed, getFrequencyMajorHectatonic, vis2)
        }
        //createBlocks(array)
        break;
      case "insertion":
        if (direction.value == "ascend") {
          insertionSortAscending(array1, velocity, speed, vis, scaleType.value);
          //insertionSortAscending(array2, velocity, speed, getFrequencyMajorHectatonic, vis2)
        }
        else {
          insertionSortDescending(array1, velocity, speed, vis, scaleType.value)
          //insertionSortDescending(array2, velocity, speed, getFrequencyMajorHectatonic, vis2)

        }
        //createBlocks(array)
        break;
      case "bubble":
        if (direction.value == "ascend") {
          bubbleSortAscending(array1, velocity, speed, vis, scaleType.value)
          //bubbleSortAscending(array2, velocity, speed, getFrequencyNaturalMinorHectatonic, vis2)
        }
        else {
          bubbleSortDescending(array1, velocity, speed, vis, scaleType.value)
          //bubbleSortDescending(array2, velocity, speed, getFrequencyMajorHectatonic, vis2)
        }
        //createBlocks(array)
        break;
    }
    unsorted = false;
  }
  reset = false
})

direction.addEventListener("change", (e) => {
  unsorted = true
})

scaleType.addEventListener("change", (e) => {
  if (e.target.value == "Chromatic") {
    maxPitchSlider.max = 84;
    minPitchSlider.max = 82;
  }
  else if (e.target.value == "Major Pentatonic" || e.target.value == "Minor Pentatonic") {
    if (Number(maxPitchSlider.value) > 25) {
      maxPitchSlider.value = 25
      maxPitchSlider.min = 25;
      document.querySelector("#maxPitch").innerHTML = 25;
    }
    if (Number(minPitchSlider.value) >= 25) {
      minPitchSlider.value = 23   
      document.querySelector("#minPitch").innerHTML = 23;
    }
    maxPitchSlider.max = 25;
    minPitchSlider.max = 23;
    maxPitchSlider.min = minPitchSlider.value
  }
  else {
    if (Number(maxPitchSlider.value) > 42) {
      maxPitchSlider.value = 42  
      document.querySelector("#maxPitch").innerHTML = 42;
    }
    if (Number(minPitchSlider.value) >= 42) {
      maxPitchSlider.value = 40   
      document.querySelector("#minPitch").innerHTML = 40;
    }
    maxPitchSlider.max = 42;
    minPitchSlider.max = 40;
  }
})


maxPitchSlider.addEventListener("input", (e) => {
  document.querySelector("#maxPitch").innerHTML = e.target.value;
})

minPitchSlider.addEventListener("input", (e) => {
  document.querySelector("#minPitch").innerHTML = e.target.value; 
  maxPitchSlider.min = (Number(e.target.value) + 2);
  if (Number(maxPitchSlider.value) <= Number(e.target.value) + 2) { 
    document.querySelector("#maxPitch").innerHTML = Number(e.target.value) + 2;
    maxPitchSlider.value = Number(e.target.value) + 2;
  }
})

speedSlider.addEventListener("input", (e) => {
  document.querySelector("#speedValue").innerHTML = e.target.value;
})

sizeSlider.addEventListener("input", (e) => {
  document.querySelector("#sizeValue").innerHTML = e.target.value;
})

sustainSlider1.addEventListener("input", (e) => {
  document.querySelector("#sustain1Value").innerHTML = e.target.value;
  sustain1 = Number(e.target.value)/ 100
})

sustainSlider2.addEventListener("input", (e) => {
  document.querySelector("#sustain2Value").innerHTML = e.target.value;
  sustain2 = Number(e.target.value)/ 100
})

gainSlider1.addEventListener("input", (e) => {
  document.querySelector("#gain1Value").innerHTML = e.target.value;
  gain1 = 0.1 + (Number(e.target.value) / 100)
})

gainSlider2.addEventListener("input", (e) => {
  document.querySelector("#gain2Value").innerHTML = e.target.value;
  gain2 = 0.1 + (Number(e.target.value) / 100)
})






