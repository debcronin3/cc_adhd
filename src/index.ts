import { initJsPsych } from "jspsych";
import SurveyLikert from "@jspsych/plugin-survey-likert";
import HTMLButtonResp from "@jspsych/plugin-html-button-response";
import HTMLKeyboardResp from "@jspsych/plugin-html-keyboard-response";
import CallFunction from "@jspsych/plugin-call-function";
import VisualSearchGridPlugin from "./grid_plugin";
import { generateGridLocs, generateStimuli, shuffleArray } from "./utilities";
import { gridSize, targetSize } from "./globals";
import { BlockSet, TimelineVarBlockStimuli } from "./types";
import { blockSets } from "./globals";
import { sendLikertData, sendSearchData, sendParticipantData } from "./api";
import { questions } from "./survey";
import { consent as consentText } from "./consent";
import {
  taskInstructions as taskInst,
  surveyInstructions as surveyInst,
  welcomeScreen,
  resizeInstructions,
  completionInstructions,
} from "./instructions";

const jsPsych = initJsPsych({
  on_finish: () => {},
});

const prolificID = jsPsych.data.getURLVariable("PROLIFIC_PID");
const studyID = jsPsych.data.getURLVariable("STUDY_ID");
const sessionID = jsPsych.data.getURLVariable("SESSION_ID");

if (!prolificID || !studyID || !sessionID) {
  // [WARNING] Replace for production
  // window.alert(
  //   "You must sign up for this study at https://www.prolific.com and gain access using a link provided through Prolific. You will be redirected there now.",
  // );
  // window.location.replace("https://www.prolific.com");
}

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
  },
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

// [WARNING]: uncomment Can we make the Cancel button take 
// them back to the consent page somehow? Or just automatically 
// redirect to prolific if they press No?
timeline.push(welcome);

const consent = {
  type: HTMLButtonResp,
  stimulus: consentText,
  prompt: "<p>I consent to participate in this study.</p>",
  choices: ["Yes", "No, take me back to Prolific."],
  button_html: (choice: string) => {
    if (choice === "No, take me back to Prolific.") {
      return `<button class="jspsych-btn"
  				onclick="if (confirm('You have indicated you do not wish to participate in this study. You will be redirected back to Prolific.')) {
  					window.location.replace('https://www.prolific.com');
};
"
  			>${choice}</button>`;
    } else {
      return `<button class="jspsych-btn">${choice}</button>`;
    }
  },
  record_data: true,
};

// [WARNING]: uncomment
timeline.push(consent);

const instructions = {
  type: HTMLKeyboardResp,
  stimulus: surveyInst,
  record_data: false,
};

// [WARNING]: uncomment
timeline.push(instructions);

const likert = {
  type: SurveyLikert,
  questions: questions,
  preamble: "<p>Please answer the following questions:</p>",
  scale_width: 800,
  randomize_question_order: false,
};

// [WARNING]: uncomment
timeline.push(likert);

const screenResize = {
  type: HTMLButtonResp,
  stimulus: resizeInstructions,
  record_data: false,
  choices: ["Continue"], // spacebar to continue
};

// [WARNING]: uncomment
timeline.push(screenResize);

const taskInstructions = {
  type: HTMLKeyboardResp,
  stimulus: taskInst,
  post_trial_gap: 2000,
  record_data: false,
  choices: [" "], // spacebar to continue
};

// [WARNING]: uncomment
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
      targetSize: targetSize,
      gridSize: gridSize,
    },
  ],
  // [WARNING] Use full array in production
  timeline_variables: timelineVarBlockStimuli.slice(0, 10),
  on_timeline_finish: async () => {
    const expData = jsPsych.data
      .get()
      .values()
      .map((data) => {
        delete data.time_elapsed;
        delete data.plugin_version;
        return data;
      });

    const [likertData] = expData
      .filter((d) => d.trial_type === "survey-likert")
      .map((d) => {
        const answers = Object.fromEntries(
          Object.entries(d.response).map(([k, v]) => [
            k.toLowerCase(),
            v === "" ? -999 : v,
          ]),
        );
        return {
          prolific_id: d.prolific_id,
          ...answers,
        };
      });

    const searchData = expData
      .filter((d) => d.trial_type === "visual-search-grid")
      .map((d) => {
        d.trial_index = d.trial_index / 2 - 2;
        return d;
      });

    // [WARNING]: uncomment
    // await sendParticipantData({
    //   id: prolificID,
    //   study_id: studyID,
    //   session_id: sessionID,
    // });

    // [WARNING]: uncomment
    // await sendLikertData(likertData);

    // [WARNING]: uncomment
    // await sendSearchData(searchData);
  },
};

// [WARNING]: uncomment
timeline.push(blockSetProcedure);

const redirect = {
  type: CallFunction,
  async: true,
  func: async (callback: () => {}) => {
    callback();
    const test = () =>
      new Promise(() =>
        setTimeout(() => {
          console.log("redirecting from promise");
          window.location.replace("https://www.prolific.com");
        }, 10000),
      );
    await test();
  },
};

// [WARNING]: uncomment
timeline.push(redirect);

const completion = {
  type: HTMLButtonResp,
  stimulus: completionInstructions,
  record_data: false,
  choices: ["Continue"],
  button_html: (choice: string) =>
    `<button class="jspsych-btn"
  				onclick="window.location.replace('https://www.prolific.com')">${choice}</button>`,
};

// [WARNING]: uncomment
timeline.push(completion);

jsPsych.run(timeline);
