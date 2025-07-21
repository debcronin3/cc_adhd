export type GridLoc = [number, number];

export enum TargetImage {
  Left = "assets/left_t.png",
  Right = "assets/right_t.png",
}

export enum ResponseKey {
  Left = "f",
  Right = "j",
}

export enum DistractorImage {
  Left = "assets/left_l.png",
  Right = "assets/right_l.png",
  Up = "assets/up_l.png",
  Down = "assets/down_l.png",
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
  repeatIndex: number;
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
  block_num: number;
  trial_type: "repeat" | "rand";
  response: ResponseKey;
  orientation: "left" | "right";
  rt: number;
  repeat_index: number | null;
}
