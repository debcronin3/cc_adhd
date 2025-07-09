import { JsPsych, JsPsychPlugin, ParameterType, TrialType } from "jspsych";
import {
  GridLoc,
  TargetSet,
  ResponseKey,
  TargetImage,
  DistractorImage,
  BlockStimuli,
  TrialData,
} from "./types";

const info = <const>{
  name: "visual-search-grid",
  version: "0.0.1",
  parameters: {
    gridSize: {
      type: ParameterType.INT,
      default: [600, 800] as [number, number],
      array: true,
    },

    targetSize: {
      type: ParameterType.INT,
      default: [50, 50] as [number, number],
      array: true,
    },

    gridRows: {
      type: ParameterType.INT,
      default: 5,
    },

    gridCols: {
      type: ParameterType.INT,
      default: 6,
    },

    setSize: {
      type: ParameterType.INT,
      default: 12,
    },

    blockLength: {
      type: ParameterType.INT,
      default: 16,
    },

    distractorImages: {
      type: ParameterType.IMAGE,
      default: [
        DistractorImage.Up,
        DistractorImage.Down,
        DistractorImage.Left,
        DistractorImage.Right,
      ] as Array<DistractorImage>,
      array: true,
    },

    targetImages: {
      type: ParameterType.OBJECT,
      default: [
        { stimulus: TargetImage.Left, correctResponse: ResponseKey.Left },
        { stimulus: TargetImage.Right, correctResponse: ResponseKey.Right },
      ] as Array<TargetSet>,
      array: true,
    },
    /** The maximum amount of time the participant is allowed to search before the trial will continue. A value
     * of null will allow the participant to search indefinitely.
     */
    trialDuration: {
      type: ParameterType.INT,
      default: null,
    },
    /** How long to show the fixation image for before the search array (in milliseconds). */
    fixationDuration: {
      type: ParameterType.INT,
      default: 500,
    },
    /** If true, the trial will end when the participant makes a response. */
    responseEndsTrial: {
      type: ParameterType.BOOL,
      default: true,
    },
  },
  data: {
    /** True if the participant gave the correct response. */
    correct: {
      type: ParameterType.BOOL,
    },
    /** Indicates which key the participant pressed. */
    response: {
      type: ParameterType.STRING,
    },
    /** The response time in milliseconds for the participant to make a response. The time is measured from when the stimulus first appears on the screen until the participant's response. */
    rt: {
      type: ParameterType.INT,
    },
    /** The number of items in the search array. */
    setSize: {
      type: ParameterType.INT,
    },
    /** True if the target is present in the search array. */
    targetOrientation: {
      type: ParameterType.STRING,
    },
    /** Array where each element is the pixel value of the center of an image in the search array. If the target is present, then the first element will represent the location of the target. This will be encoded as a JSON string when data is saved using the `.json()` or `.csv()` functions. */
    locations: {
      type: ParameterType.INT,
      array: true,
    },
  },
  // prettier-ignore
  citations: '__CITATIONS__',
};

type Info = typeof info;

/**
 * This plugin presents a customizable visual-search task modelled after [Wang, Cavanagh, & Green (1994)](http://dx.doi.org/10.3758/BF03206946).
 * The participant indicates whether or not a target is present among a set of distractors. The stimuli are displayed in a circle, evenly-spaced,
 * equidistant from a fixation point.
 *
 * @author Deb Cronin
 **/
class VisualSearchGridPlugin implements JsPsychPlugin<Info> {
  static info = info;

  constructor(private jsPsych: JsPsych) {}

  trial(display_element: HTMLElement, trial: TrialType<Info>) {
    const gridLocs = this.generateGridLocs(trial);
    const repeatStimuli = this.generateStimuli(trial, gridLocs, "repeat");
    const randStimuli = this.generateStimuli(trial, gridLocs, "rand");
    const blockStimuli = this.shuffleArray([...repeatStimuli, ...randStimuli]);

    display_element.innerHTML = `<div id="visual-search-grid" style="position: relative; width: ${trial.gridSize[1]}px; height: ${trial.gridSize[0]}px"></div>`;

    const trialCountdown = this.shuffleArray(
      Array.from({ length: trial.blockLength }, (_, i) => i),
    );

    this.showFixation(display_element, blockStimuli, trialCountdown);
  }

  private generateStimuli(
    trial: TrialType<Info>,
    gridLocs: Array<GridLoc>,
    type: "rand" | "repeat",
  ): Array<BlockStimuli> {
    const displayLocs = this.generateDisplayLocs(trial, gridLocs);
    const displayStim = this.generatePresentationSet(trial);
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
      };
    });

    return this.shuffleArray(blockStimuli);
  }

  private generateGridLocs(trial: TrialType<Info>): Array<GridLoc> {
    const gridw = trial.gridSize[1] as number;
    const gridh = trial.gridSize[0] as number;

    const loch = gridh / trial.gridRows;
    const locw = gridw / trial.gridCols;

    const hstimh = trial.targetSize[0] / 2;
    const hstimw = trial.targetSize[1] / 2;

    const gridLocs = new Array<GridLoc>();

    for (let r = 0; r < trial.gridRows; r++) {
      for (let c = 0; c < trial.gridCols; c++) {
        gridLocs.push([
          Math.floor(0.5 * loch + r * loch - hstimh),
          Math.floor(0.5 * locw + c * locw - hstimw),
        ]);
      }
    }

    return gridLocs;
  }

  private shuffleArray<T>(arr: Array<T>): Array<T> {
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

  private generateDisplayLocs(
    trial: TrialType<Info>,
    gridLocs: Array<GridLoc>,
  ): Array<Array<GridLoc>> {
    const iterations = trial.blockLength / 2;
    let displayLocs = Array.from({ length: iterations }, () =>
      this.shuffleArray(gridLocs).slice(0, trial.setSize),
    );

    return displayLocs;
  }

  private generatePresentationSet(
    trial: TrialType<Info>,
  ): Array<Array<DistractorImage | "target">> {
    const iterations = trial.blockLength / 2;
    const foilImages = trial.distractorImages as Array<DistractorImage>;
    const toPresent = Array.from({ length: iterations }, () => {
      let arr = new Array<DistractorImage | "target">(trial.setSize - 1);
      arr = [
        ...this.jsPsych.randomization.sampleWithReplacement(
          foilImages,
          trial.setSize - 1,
        ),
      ];
      arr.push("target");
      return this.shuffleArray(arr);
    });

    return this.shuffleArray(toPresent);
  }

  private async showFixation(
    displayElement: HTMLElement,
    blockStimuli: Array<BlockStimuli>,
    trialCountdown: Array<number>,
  ): Promise<void> {
    displayElement.querySelector("#visual-search-grid").innerHTML =
      `<p style="font-size: 20; font-weight: bold">+</p>`;
    this.jsPsych.pluginAPI.setTimeout(() => {
      this.showSearch(displayElement, blockStimuli, trialCountdown);
    }, 2000);
  }

  private showSearch(
    displayElement: HTMLElement,
    blockStimuli: Array<BlockStimuli>,
    trialCountdown: Array<number>,
  ): void {
    const gridContainer = displayElement.querySelector("#visual-search-grid");
    const blockIdx = trialCountdown.pop();

    const keyLogger = this.jsPsych.pluginAPI.getKeyboardResponse({
      callback_function: (keyData: { key: string; rt: number }) => {
        this.showFixation(displayElement, blockStimuli, trialCountdown);
      },
    });

    gridContainer.innerHTML = ``;

    for (const stim of blockStimuli[blockIdx].trialStim) {
      gridContainer.innerHTML += `<p style="color: ${stim.image === "target" ? "red" : "black"}; font-size: ${stim.image === "target" ? "14px" : "9px"}; position: absolute; top: ${stim.y}px; left: ${stim.x}px">${stim.image}</p>`;
    }
  }
}

export default VisualSearchGridPlugin;
