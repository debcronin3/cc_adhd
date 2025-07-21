import { JsPsych, JsPsychPlugin, ParameterType, TrialType } from "jspsych";
import {
  ResponseKey,
  TargetImage,
  TrialData,
  TimelineVarBlockStimuli,
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
  },
  data: {},
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
    display_element.innerHTML = `
			<div id="visual-search-grid"
				style="position: relative;
					width: ${trial.gridSize[1]}px;
					height: ${trial.gridSize[0]}px"
			></div>`;

    this.showSearch(display_element);
  }

  private showSearch(displayElement: HTMLElement): void {
    const gridContainer = displayElement.querySelector("#visual-search-grid");
    const trialInfo = this.jsPsych.evaluateTimelineVariable(
      "tVar",
    ) as TimelineVarBlockStimuli["tVar"];

    this.jsPsych.pluginAPI.getKeyboardResponse({
      valid_responses: ["f", "j"],
      callback_function: ({ key, rt }: { key: ResponseKey; rt: number }) => {
        const target = trialInfo.stim.find(
          (target) =>
            target.image === TargetImage.Right ||
            target.image === TargetImage.Left,
        );
        const orientation =
          target.image === TargetImage.Left ? "left" : "right";
        const data: TrialData = {
          block_num: trialInfo.blockNum,
          trial_type: trialInfo.type,
          response: key,
          rt: rt,
          orientation: orientation,
          repeat_index: trialInfo.repeatIndex,
        };
        this.jsPsych.finishTrial(data);
      },
    });

    for (const stim of trialInfo.stim) {
      const stimColor =
        stim.image === TargetImage.Left || stim.image === TargetImage.Right
          ? "red"
          : "black";
      const stimFontSize =
        stim.image === TargetImage.Left || stim.image === TargetImage.Right
          ? "14px"
          : "9px";
      gridContainer.innerHTML += `
				<p style="color: ${stimColor}; font-size: ${stimFontSize};
					position: absolute; top: ${stim.y}px; left: ${stim.x}px">
					${stim.image}
				</p>`;
    }
  }

  // private endTrial();
}

export default VisualSearchGridPlugin;
