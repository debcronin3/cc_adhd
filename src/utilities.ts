import { initJsPsych } from "jspsych"
const jsPsych = initJsPsych();

function generateGridLocs(gridrows: number, gridcols: number, gridSize: [600,800], target_size: [50,50]) {

    var numlocs = gridrows*gridcols;

    var gridw = gridSize[1];
    var gridh = gridSize[0];

    var loch = gridh/gridrows;
    var locw = gridw/gridcols;

    var hstimh = target_size[0]/2;
    var hstimw = target_size[1]/2;

    var grid_locs = [];

    for (var r = 0, r < gridrows; r++) {
      for(var c = 0, c < gridcols; c++) {
        grid_locs.push([
          Math.floor((0.5*loch)+(r*loch)-hstimh),
          Math.floor((0.5*locw)+(c*locw)-hstimw)]
        );
      }
    }
    return grid_locs;
};

function shuffleArray(array) {
    for (var i = array.length - 1; i >0; i--) {
      var j = Math.floor(Math.random()*(i+1));
      var temp = array[i];
      array[i]=array[j];
      array[j] = temp;
    }
    return array;
  };

function generateDisplayLocs(setSize: number, gridLocs, iterations: number) {
    var displayLocs = [];   
    for (var i = 0; i < iterations; i++) {
        var randGridLocs = this.shuffleArray(gridLocs);
        var trialLocs = randGridLocs.slice(0,setSize);
        displayLocs.push(trialLocs)
    }
    return displayLocs;
  };

function generatePresentationSet(setSize: number, iterations: number, foilImages, targetImages) {
    var to_present = [];
        for (var i = 0; i < setSize - 1; i++) {
          to_present.push(jsPsych.randomization.sampleWithReplacement(foilImages));
        }
        to_present.push("target");
    var randPresent = shuffleArray(to_present);
    return randPresent;
  }

export {generateGridLocs, shuffleArray, generateDisplayLocs, generatePresentationSet};