import { initJsPsych } from "jspsych"
import htmlKeyboardResp from "@jspsych/plugin-html-keyboard-response"
import VisualSearchGridPlugin from "./grid_index"
import {generateGridLocs, generateDisplayLocs, shuffleArray, generatePresentationSet} from "./utilities"

const jsPsych = initJsPsych();

var gridRows = 5; //define for given experiment
var gridCols = 6; //define for given experiment
var setSize = 12; //define for given experiment
var blockLength = 16; //define for given experiment; half will be repeated stim, half random

var target_ims = [
    {stimulus: "img/left_t.png", correct_response: 'f'},
    {stimulus: "img/right_t.png", correct_response: 'j'}
];

var dist_ims = [
    "img/left_l.png",
    "img/right_l.png",
    "img/up_l.png",
    "img/down_l.png"
];

var grid_locs = generateGridLocs(gridRows,gridCols);

var repeatDisplayLocs = generateDisplayLocs(setSize, grid_locs,blockLength/2);
var repeatDisplayStim = generatePresentationSet(setSize,blockLength/2,dist_ims,target_ims);
var repeatStimuli = repeatDisplayLocs.map((trialArr, i) => {
    return { 
        trialStim: trialArr.map((locArr, idx) => {
            return {
                x: locArr[1],
                y: locArr[0],
                image: repeatDisplayStim[i][idx],
            }
        }),
        type: "repeat"
    }
})

var randDisplayLocs = generateDisplayLocs(setSize, grid_locs,blockLength/2);
var randDisplayStim = generatePresentationSet(setSize,blockLength/2,dist_ims,target_ims)

var randStimuli = randDisplayLocs.map((trialArr, i) => {
    return {
        trialStim: trialArr.map((locArr, idx) => {
            return {
                x: locArr[1],
                y: locArr[0],
                image: randDisplayStim[i][idx],
                type: "rand"
            }  
        }),
        type: "rand"
    }
});

var blockStimuli = [...repeatStimuli, ...randStimuli];

const timeline = [];

const welcome = {
    type: htmlKeyboardResp,
    stimulus: "Task. Press any key."
};

timeline.push(welcome);

const instructions = {htmlKeyboardResp,
    stimulus:
    "<p>In this experiment, you will...</p>",
    post_trial_gap: 2000
}

timeline.push(instructions);

const Block = {
    type: VisualSearchGridPlugin,
    blockStimuli: blockStimuli,
    target_ims: target_ims,
    foils: dist_ims,


}

//jsPsych.run([hello_trial])