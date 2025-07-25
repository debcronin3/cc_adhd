import { initJsPsych } from "jspsych";
import { BlockStimuli, DistractorImage, GridLoc, TargetImage } from "./types";
import {
  gridCols,
  gridRows,
  iterations,
  setSize,
  distractorImages,
  // targetImages,
  // blockLength,
  gridSize,
  targetSize,
} from "./globals";

const jsPsych = initJsPsych();

function generateStimuli(
  gridLocs: Array<GridLoc>,
  type: "rand" | "repeat",
): Array<BlockStimuli> {
  const displayLocs = generateDisplayLocs(gridLocs);
  const displayStim = generatePresentationSet();
  const blockStimuli = displayLocs.map((trialArr, i) => {
    return {
      trialStim: trialArr.map((locArr, idx) => {
        return {
          x: locArr[1],
          y: locArr[0],
          image: displayStim[i][idx],
        };
      }),
      type: type,
      repeatIndex: type === "repeat" ? i : -999,
    };
  });

  return shuffleArray(blockStimuli);
}

function generateGridLocs(): Array<GridLoc> {
  const gridw = gridSize[1];
  const gridh = gridSize[0];

  const loch = gridh / gridRows;
  const locw = gridw / gridCols;

  const hstimh = targetSize[0] / 2;
  const hstimw = targetSize[1] / 2;

  const gridLocs = new Array<GridLoc>();

  for (let r = 0; r < gridRows; r++) {
    for (let c = 0; c < gridCols; c++) {
      gridLocs.push([
        Math.floor(0.5 * loch + r * loch - hstimh),
        Math.floor(0.5 * locw + c * locw - hstimw),
      ]);
    }
  }

  return gridLocs;
}

function shuffleArray<T>(arr: Array<T>): Array<T> {
  let currentIndex = arr.length;
  let randomIndex: number;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [arr[currentIndex], arr[randomIndex]] = [
      arr[randomIndex],
      arr[currentIndex],
    ];
  }

  return arr;
}

function generateDisplayLocs(gridLocs: Array<GridLoc>): Array<Array<GridLoc>> {
  let displayLocs = Array.from({ length: iterations }, () =>
    shuffleArray(gridLocs).slice(0, setSize),
  );

  return displayLocs;
}

function generatePresentationSet(): Array<
  Array<DistractorImage | TargetImage>
> {
  const foilImages = distractorImages as Array<DistractorImage>;
  const toPresent = Array.from({ length: iterations }, () => {
    let arr = new Array<DistractorImage | TargetImage>(setSize - 1);
    arr = [
      ...jsPsych.randomization.sampleWithReplacement(foilImages, setSize - 1),
    ];
    arr.push([TargetImage.Left, TargetImage.Right][Math.round(Math.random())]);
    return shuffleArray(arr);
  });

  return shuffleArray(toPresent);
}

export {
  generateStimuli,
  generateGridLocs,
  generateDisplayLocs,
  generatePresentationSet,
  shuffleArray,
};
