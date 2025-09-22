export type GridLoc = [number, number];

export enum ResponseKey {
  Left = "f",
  Right = "j",
}

export interface TargetSet {
  stimulus: string;
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
  image: string;
}

export interface TrialData {
  block_num: number;
  trial_type: "repeat" | "rand";
  response: ResponseKey;
  orientation: "left" | "right";
  rt: number;
  repeat_index: number | null;
}
