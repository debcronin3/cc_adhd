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

export interface TimelineVarBlockStimuli {
  tVar: {
    blockNum: number;
    type: "rand" | "repeat";
    stim: Array<StimuliInfo>;
    repeatIndex: number;
  };
}

export interface BlockStimuli {
  trialStim: Array<StimuliInfo>;
  type: "rand" | "repeat";
  repeatIndex: number | null;
}

export interface BlockSet {
  blockNum: number;
  blocks: Array<BlockStimuli>;
}

export interface StimuliInfo {
  x: number;
  y: number;
  image: DistractorImage | TargetImage;
}

export interface TrialData {
  blockNum: number;
  trialType: "repeat" | "rand";
  response: ResponseKey;
  orientation: "left" | "right";
  rt: number;
  repeatIndex: number | null;
}
