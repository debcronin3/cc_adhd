import { ResponseKey, TargetSet } from "./types";
import leftT from "../assets/left_t.png";
import rightT from "../assets/right_t.png";
import leftL from "../assets/left_l.png";
import rightL from "../assets/right_l.png";
import upL from "../assets/up_l.png";
import downL from "../assets/down_l.png";

export const gridSize: [number, number] = [600, 800];
export const targetSize: [number, number] = [50, 50];
export const gridRows = 5; //define for given experiment
export const gridCols = 6; //define for given experiment
export const setSize = 12; //define for given experiment
export const blockLength = 16; //define for given experiment; half will be repeated stim, half random
export const blockSets = 15;
export const iterations = blockLength / 2;

export const images = {
	target: {
		leftT,
		rightT,
	},
	distractor: {
		leftL,
		rightL,
		upL,
		downL,
	},
};

export const targetImages: Array<TargetSet> = [
	{ stimulus: images.target.leftT, correctResponse: ResponseKey.Left },
	{ stimulus: images.target.rightT, correctResponse: ResponseKey.Right },
];

export const distractorImages: Array<string> = [
	images.distractor.leftL,
	images.distractor.rightL,
	images.distractor.downL,
	images.distractor.upL,
];
