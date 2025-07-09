import { DistractorImage, ResponseKey, TargetImage, TargetSet } from "./types";

export const gridSize: [number, number] = [600, 800];
export const targetSize: [number, number] = [50, 50];
export const gridRows = 5; //define for given experiment
export const gridCols = 6; //define for given experiment
export const setSize = 12; //define for given experiment
export const blockLength = 16; //define for given experiment; half will be repeated stim, half random
export const iterations = blockLength / 2;

export const targetImages: Array<TargetSet> = [
  { stimulus: TargetImage.Left, correctResponse: ResponseKey.Left },
  { stimulus: TargetImage.Right, correctResponse: ResponseKey.Right },
];

export const distractorImages: Array<DistractorImage> = [
  DistractorImage.Left,
  DistractorImage.Right,
  DistractorImage.Up,
  DistractorImage.Down,
];
