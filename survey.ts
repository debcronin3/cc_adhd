import jsPsychSurveyLikert from "@jspsych/plugin-survey-likert";

var likert_scale = ["Never", "Rarely", "Sometimes", "Often", "Very Often"];

var trial = {
  type: jsPsychSurveyLikert,
  questions: [
    {
      prompt: `How often do you have trouble wrapping up the final details of a project, \
        once the challenging parts have been done?`,
      name: "Q1",
      labels: likert_scale,
    },
    {
      prompt: `How often do you have difficulty getting things in order when \
        you have to do a task that requires organization?`,
      name: "Q2",
      labels: likert_scale,
    },
    {
      prompt:
        "How often do you have problems remembering appointments or obligations?",
      name: "Q3",
      labels: likert_scale,
    },
    {
      prompt:
        "When you have a task that requires a lot of thought, how often do you avoid or delay getting started?",
      name: "Q4",
      labels: likert_scale,
    },
    {
      prompt:
        "How often do you fidget or squirm with your hands or feet when you have to sit down for a long time?",
      name: "Q5",
      labels: likert_scale,
    },
    {
      prompt:
        "How often do you feel overly active and compelled to do things, like you were driven by a motor?",
      name: "Q6",
      labels: likert_scale,
    },
    {
      prompt:
        "How often do you make careless mistakes when you have to work on a boring or difficult project?",
      name: "Q7",
      labels: likert_scale,
    },
    {
      prompt:
        "How often do you have difficulty keeping your attention when you are doing boring or repetitive work?",
      name: "Q8",
      labels: likert_scale,
    },
    {
      prompt:
        "How often do you have difficulty concentrating on what people say to you, even when they are speaking to you directly?",
      name: "Q9",
      labels: likert_scale,
    },
    {
      prompt:
        "How often do you misplace or have difficulty finding things at home or at work?",
      name: "Q10",
      labels: likert_scale,
    },
    {
      prompt: "How often are you distracted by activity or noise around you?",
      name: "Q11",
      labels: likert_scale,
    },
    {
      prompt:
        "How often do you leave your seat in meetings or other situations in which you are expected to remain seated?",
      name: "Q12",
      labels: likert_scale,
    },
    {
      prompt: "How often do you feel restless or fidgety?",
      name: "Q13",
      labels: likert_scale,
    },
    {
      prompt:
        "How often do you have difficulty unwinding and relaxing when you have time to yourself?",
      name: "Q14",
      labels: likert_scale,
    },
    {
      prompt:
        "How often do you find yourself talking too much when you are in social situations?",
      name: "Q15",
      labels: likert_scale,
    },
    {
      prompt:
        "When you are in a conversation, how often do you find yourself finishing \
        the sentences of the people you are talking to, before they can finish them themselves?",
      name: "Q16",
      labels: likert_scale,
    },
    {
      prompt:
        "How often do you have difficulty waiting your turn in situations when turn taking is required?",
      name: "Q17",
      labels: likert_scale,
    },
    {
      prompt: "How often do you interrupt others when they are busy?",
      name: "Q18",
      labels: likert_scale,
    },
  ],
  randomize_question_order: false,
};
