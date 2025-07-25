import { initJsPsych } from "jspsych";
import SurveyLikert from "@jspsych/plugin-survey-likert";
import HTMLButtonResp from "@jspsych/plugin-html-button-response";
import HTMLKeyboardResp from "@jspsych/plugin-html-keyboard-response";
import VisualSearchGridPlugin from "./grid_plugin";
import { generateGridLocs, generateStimuli, shuffleArray } from "./utilities";
import { BlockSet, TimelineVarBlockStimuli } from "./types";
import { blockSets } from "./globals";
import { sendTrialData, sendParticipantData } from "./api";
import { questions } from "./survey";
import { consent as consentText } from "./consent";
import {
  taskInstructions as taskInst,
  surveyInstructions as surveyInst,
  welcomeScreen,
} from "./instructions";

const jsPsych = initJsPsych({
  on_finish: () => {},
});

const prolificID = jsPsych.data.getURLVariable("PROLIFIC_ID");
const studyID = jsPsych.data.getURLVariable("STUDY_ID");
const sessionID = jsPsych.data.getURLVariable("SESSION_ID");

jsPsych.data.addProperties({
  prolific_id: prolificID,
});

const gridLocs = generateGridLocs();
const repeatStimuli = generateStimuli(gridLocs, "repeat");
const blockStimuli: Array<BlockSet> = Array.from(
  { length: blockSets },
  (_, i) => {
    const randStimuli = generateStimuli(gridLocs, "rand");
    return {
      blockNum: i + 1,
      blocks: shuffleArray([...randStimuli, ...repeatStimuli]),
    };
  }
);

const timelineVarBlockStimuli: Array<TimelineVarBlockStimuli> = [];

blockStimuli.forEach((blockSet) => {
  blockSet.blocks.forEach((block) => {
    timelineVarBlockStimuli.push({
      tVar: {
        blockNum: blockSet.blockNum,
        type: block.type,
        stim: block.trialStim,
        repeatIndex: block.repeatIndex,
      },
    });
  });
});

const timeline = new Array();

const welcome = {
  type: HTMLKeyboardResp,
  stimulus: welcomeScreen,
  record_data: false,
};

timeline.push(welcome);

const consent = {
  type: HTMLButtonResp,
  stimulus: consentText,
  prompt: "<p>I consent to participate in this study.</p>",
  choices: ["Yes."],
  post_trial_gap: 2000,
  record_data: true,
};

timeline.push(consent);

const instructions = {
  type: HTMLKeyboardResp,
  stimulus: surveyInst,
  post_trial_gap: 2000,
  record_data: false,
};

timeline.push(instructions);

const likert = {
  type: SurveyLikert,
  questions: questions,
  preamble: "<p>Please answer the following questions:</p>",
  randomize_question_order: false,
};

timeline.push(likert);

const taskInstructions = {
  type: HTMLKeyboardResp,
  stimulus: taskInst,
  post_trial_gap: 2000,
  record_data: false,
  choices: [" "], // spacebar to continue
};

timeline.push(taskInstructions);

const blockSetProcedure = {
  timeline: [
    {
      type: HTMLKeyboardResp,
      stimulus: "+",
      choices: "NO_KEYS",
      trial_duration: 500,
      record_data: false,
    },
    {
      type: VisualSearchGridPlugin,
      stimulus: jsPsych.timelineVariable("tVar"),
    },
  ],
  timeline_variables: timelineVarBlockStimuli.slice(0, 3),
  on_timeline_finish: async () => {
    const expData = jsPsych.data
      .get()
      .values()
      .map((data) => {
        delete data.time_elapsed;
        delete data.trial_type;
        delete data.plugin_version;
        return data;
      });

    await sendParticipantData({
      prolific_id: prolificID,
      study_id: studyID,
      session_id: sessionID,
    });

    await sendTrialData(expData);
  },
};

timeline.push(blockSetProcedure);

jsPsych.run(timeline);
