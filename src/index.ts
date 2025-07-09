import { initJsPsych } from "jspsych";
import htmlKeyboardResp from "@jspsych/plugin-html-keyboard-response";
import VisualSearchGridPlugin from "./grid_plugin";
import { generateGridLocs, generateStimuli, shuffleArray } from "./utilities";

const jsPsych = initJsPsych({
  on_finish: () => {
    jsPsych.data.displayData();
  },
});

const gridLocs = generateGridLocs();
const repeatStimuli = generateStimuli(gridLocs, "repeat");
const randStimuli = generateStimuli(gridLocs, "rand");
const blockStimuli = shuffleArray([...repeatStimuli, ...randStimuli]);

const timeline = new Array();

const welcome = {
  type: htmlKeyboardResp,
  stimulus: "Task. Press any key.",
};

timeline.push(welcome);

const instructions = {
  type: htmlKeyboardResp,
  stimulus: "<p>In this experiment, you will...</p>",
  post_trial_gap: 2000,
};

timeline.push(instructions);

const block = {
  type: VisualSearchGridPlugin,
};

timeline.push(block);

jsPsych.run(timeline);
