import { JsPsych, JsPsychPlugin, ParameterType, TrialType } from "jspsych";

const info = <const>{
  name: "visual-search-grid",
  version: "0.0.1",
  parameters: {
    /**
     * Path to image files of the search target as well as the correct response associated with that target.
     */
    blockStimuli: {
      type: ParameterType.COMPLEX,
      default: null
    },
    /**
     * Path to image files of the search target as well as the correct response associated with that target.
     */
    target_ims: {
      type: ParameterType.IMAGE,
      default: null,
    },
    choices: {
      type: ParameterType.KEYS,
      default: ['f','j']
    },
    /**
     * Path to image files for foil/distractor. This image will be repeated for all distractors up to
     * the `set_size` value. This parameter must specified when the stimuli set is defined using the `target`,
     * `foil` and `set_size` parameters, but should NOT be specified when using the `stimuli` parameter.
     */
    foils: {
      type: ParameterType.IMAGE,
      default: null,
    },
    /**
     * Path to image file that is a fixation target. This parameter must always be specified.
     */
    fixation_image: {
      type: ParameterType.IMAGE,
      default: undefined,
    },
    /** Two element array indicating the height and width of the fixation image. */
    fixation_size: {
      type: ParameterType.INT,
      array: true,
      default: [16, 16],
    },
    /** Add a random 10% jitter to the presentation location of each item */
    jitter: {
      type: ParameterType.BOOL,
      default: false,
    },
    /** The maximum amount of time the participant is allowed to search before the trial will continue. A value
     * of null will allow the participant to search indefinitely.
     */
    trial_duration: {
      type: ParameterType.INT,
      default: null,
    },
    /** How long to show the fixation image for before the search array (in milliseconds). */
    fixation_duration: {
      type: ParameterType.INT,
      default: 500,
    },
    /** If true, the trial will end when the participant makes a response. */
    response_ends_trial: {
      type: ParameterType.BOOL,
      default: true,
    },
  },
  data: {
    /** True if the participant gave the correct response. */
    correct: {
      type: ParameterType.BOOL,
    },
    /** Indicates which key the participant pressed. */
    response: {
      type: ParameterType.STRING,
    },
    /** The response time in milliseconds for the participant to make a response. The time is measured from when the stimulus first appears on the screen until the participant's response. */
    rt: {
      type: ParameterType.INT,
    },
    /** The number of items in the search array. */
    set_size: {
      type: ParameterType.INT,
    },
    /** True if the target is present in the search array. */
    target_orientation: {
      type: ParameterType.STRING,
    },
    /** Array where each element is the pixel value of the center of an image in the search array. If the target is present, then the first element will represent the location of the target. This will be encoded as a JSON string when data is saved using the `.json()` or `.csv()` functions. */
    locations: {
      type: ParameterType.INT,
      array: true,
    },
  },
  // prettier-ignore
  citations: '__CITATIONS__',
};

type Info = typeof info;

/**
 * This plugin presents a customizable visual-search task modelled after [Wang, Cavanagh, & Green (1994)](http://dx.doi.org/10.3758/BF03206946).
 * The participant indicates whether or not a target is present among a set of distractors. The stimuli are displayed in a circle, evenly-spaced,
 * equidistant from a fixation point.
 *
 * @author Deb Cronin
 **/
class VisualSearchGridPlugin implements JsPsychPlugin<Info> {
  static info = info;

  constructor(private jsPsych: JsPsych) {}

  trial(display_element: HTMLElement, trial: TrialType<Info>) {
    var paper_size = this.gridsize[0];

    // fixation location
    var fix_loc = this.generateFixationLoc(trial);

    // create stimuli set
    var to_present = trial.blockStimuli;

    // stimulus locations on the grid
    var grid_locs = this.generateGridLocs(trial);
    var display_locs = this.generateDisplayLocs(to_present.length, trial, grid_locs);

    // get target to draw on
    display_element.innerHTML +=
      '<div id="jspsych-visual-search-circle-container" style="position: relative; width:' +
      paper_size +
      "px; height:" +
      paper_size +
      'px"></div>';
    var paper = display_element.querySelector(
      "#jspsych-visual-search-circle-container"
    );

    const show_fixation = () => {
      // show fixation
      //var fixation = paper.image(trial.fixation_image, fix_loc[0], fix_loc[1], trial.fixation_size[0], trial.fixation_size[1]);
      paper.innerHTML +=
        "<img src='" +
        trial.fixation_image +
        "' style='position: absolute; top:" +
        fix_loc[0] +
        "px; left:" +
        fix_loc[1] +
        "px; width:" +
        trial.fixation_size[0] +
        "px; height:" +
        trial.fixation_size[1] +
        "px;'></img>";

      // wait
      this.jsPsych.pluginAPI.setTimeout(() => {
        // after wait is over
        show_search_array();
      }, trial.fixation_duration);
    };

    const response = {
      rt: null,
      key: null,
      correct: false,
    };

    const end_trial = () => {
      this.jsPsych.pluginAPI.cancelAllKeyboardResponses();

      // data saving
      const trial_data = {
        correct: response.correct,
        rt: response.rt,
        response: response.key,
        locations: display_locs,
        target_present: trial.target_present,
        set_size: trial.set_size,
      };

      // go to next trial
      this.jsPsych.finishTrial(trial_data);
    };

    show_fixation();

    const show_search_array = () => {
      for (var i = 0; i < display_locs.length; i++) {
        paper.innerHTML +=
          "<img src='" +
          to_present[i] +
          "' style='position: absolute; top:" +
          display_locs[i][0] +
          "px; left:" +
          display_locs[i][1] +
          "px; width:" +
          trial.target_size[0] +
          "px; height:" +
          trial.target_size[1] +
          "px;'></img>";
      }

      const after_response = (info: { key: string; rt: number }) => {
        var correct = false;

        if (
          (this.jsPsych.pluginAPI.compareKeys(
            info.key,
            trial.target_present_key
          ) &&
            trial.target_present) ||
          (this.jsPsych.pluginAPI.compareKeys(
            info.key,
            trial.target_absent_key
          ) &&
            !trial.target_present)
        ) {
          correct = true;
        }

        response.rt = info.rt;
        response.key = info.key;
        response.correct = correct;

        if (trial.response_ends_trial) {
          end_trial();
        }
      };

      const valid_keys = [trial.target_present_key, trial.target_absent_key];

      const key_listener = this.jsPsych.pluginAPI.getKeyboardResponse({
        callback_function: after_response,
        valid_responses: valid_keys,
        rt_method: "performance",
        persist: false,
        allow_held_key: false,
      });

      if (trial.trial_duration !== null) {
        this.jsPsych.pluginAPI.setTimeout(() => {
          if (!response.rt) {
            this.jsPsych.pluginAPI.cancelKeyboardResponse(key_listener);
          }

          end_trial();
        }, trial.trial_duration);
      }
    };
  }

  private generateFixationLoc(trial) {
    var paper_size = trial.circle_diameter + trial.target_size[0];
    return [
      Math.floor(paper_size / 2 - trial.fixation_size[0] / 2),
      Math.floor(paper_size / 2 - trial.fixation_size[1] / 2),
    ];
  }

  generateGridLocs(trial: TrialType<info>) {
    var numlocs = gridrows*gridcols;

    var gridrows = trial.rows[0];
    var gridcols = trial.cols[1];

    var gridw = trial.gridsize[1];
    var gridh = trial.gridsize[0];

    var loch = gridh/gridrows;
    var locw = gridw/gridcols;

    var hstimh = trial.target_size[0]/2;
    var hstimw = trial.target_size[1]/2;

    var grid_locs = [];

    for (var r = 0, r < gridrows; r++) {
      for(var c = 0, c < gridcols; c++) {
        grid_locs.push([
          Math.floor((0.5*loch)+(r*loch)-stimh),
          Math.floor((0.5*locw)+(c*locw)-stimw)]
        );
      }
    }
    return grid_locs;
  }

  private shuffleArray(array) {
    for (var i = array.length - 1; i >0; i--) {
      var j = Math.floor(Math.random()*(i+1));
      var temp = array[i];
      array[i]=array[j];
      array[j] = temp;
    }
    return randLocs;
  }

  generateDisplayLocs(set_size: number, trial: TrialType<Info>, gridlocations: ??) {

    var display_locs = [];

    var randGridLocs = this.shuffleArray(gridlocations);

    display_locs = randGridLocs.slice(0,set_size)

    return display_locs;
  }

  private generatePresentationSet(trial: TrialType<Info>) {
    var to_present = [];
    if (
      trial.target !== null &&
      trial.foil !== null &&
      trial.set_size !== null
    ) {
        for (var i = 0; i < trial.set_size - 1; i++) {
          to_present.push(trial.foil);
        }
        to_present.push(trial.target_image);
    }
    return to_present;
  }

  private cosd(num: number) {
    return Math.cos((num / 180) * Math.PI);
  }

  private sind(num: number) {
    return Math.sin((num / 180) * Math.PI);
  }

  simulate(
    trial: TrialType<Info>,
    simulation_mode,
    simulation_options: any,
    load_callback: () => void
  ) {
    if (simulation_mode == "data-only") {
      load_callback();
      this.simulate_data_only(trial, simulation_options);
    }
    if (simulation_mode == "visual") {
      this.simulate_visual(trial, simulation_options, load_callback);
    }
  }

  private create_simulation_data(trial: TrialType<Info>, simulation_options) {
    const key = this.jsPsych.pluginAPI.getValidKey([
      trial.target_present_key,
      trial.target_absent_key,
    ]);
    const set = this.generatePresentationSet(trial);

    const default_data = {
      correct: trial.target_present
        ? key == trial.target_present_key
        : key == trial.target_absent_key,
      response: key,
      rt: this.jsPsych.randomization.sampleExGaussian(500, 50, 1 / 150, true),
      set_size: set.length,
      target_present: trial.target_present,
      locations: this.generateDisplayLocs(set.length, trial),
    };

    const data = this.jsPsych.pluginAPI.mergeSimulationData(
      default_data,
      simulation_options
    );

    this.jsPsych.pluginAPI.ensureSimulationDataConsistency(trial, data);

    return data;
  }

  private simulate_data_only(trial: TrialType<Info>, simulation_options) {
    const data = this.create_simulation_data(trial, simulation_options);

    this.jsPsych.finishTrial(data);
  }

  private simulate_visual(
    trial: TrialType<Info>,
    simulation_options,
    load_callback: () => void
  ) {
    const data = this.create_simulation_data(trial, simulation_options);

    const display_element = this.jsPsych.getDisplayElement();

    this.trial(display_element, trial);
    load_callback();

    if (data.rt !== null) {
      this.jsPsych.pluginAPI.pressKey(
        data.response,
        trial.fixation_duration + data.rt
      );
    }
  }
}

export default VisualSearchGridPlugin;
