export type GridLoc = [number, number];

export enum TargetImage {
  Left = "img/left_t.png",
  Right = "img/right_t.png",
}

export enum ResponseKey {
  Left = "f",
  Right = "j",
}

export enum DistractorImage {
  Left = "img/left_l.png",
  Right = "img/right_l.png",
  Up = "img/up_l.png",
  Down = "img/down_l.png",
}

export interface TargetSet {
  stimulus: TargetImage;
  correctResponse: ResponseKey;
}

export interface BlockStimuli {
  trialStim: Array<StimuliInfo>;
  type: "rand" | "repeat";
}

export interface StimuliInfo {
  x: number;
  y: number;
  image: DistractorImage | "target";
}

export interface TrialData {
  trialType: "repeat" | "random";
  correctResponse: ResponseKey;
  response: ResponseKey;
  rt: number;
}
