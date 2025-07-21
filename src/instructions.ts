export const welcomeScreen = `<html>
  <body>
    <h1>Welcome to the Study</h1>
    <p>Thank you for your interest in participating in this study.</p>
    <p>Press any key to continue.</p>
  </body>
</html>`;

export const surveyInstructions = `<html>
  <body>
    <h1>Instructions</h1>
    <p>This experiment consists of two parts. First, you will 
    complete an 18-item questionnaire. This questionnaire will ask you questions about
    your typical behaviors. When you complete the questionnaire, you will begin the experimental task.</p>

    <p> When you are ready to begin the survey, press any key.</p>
</html>`;

export const taskInstructions = `<html>
    <body>
    <h1>Task Instructions</h1>
    <p>In this experiment, you will see a series of images displayed in a grid.
    Your task is to identify a target letter among several distractor letters as quickly and accurately as possible.
    The target image will be either a T tilted to the left (left image) or a T tilted to the right (right image). </p>

    <div class="row">
        <div class="column">
            <img src="../images/left_t.png" alt="T tilted to the left" style="width: 100px; height: 100px;">
    </div>
    <div class="column">
        <img src="../images/right_t.png" alt="T tilted to the right" style="width: 100px; height: 100px;">
    </div>
    </div>

    <p>You will respond by pressing the 'f' key if the target is tilted to the left
    or the 'j' key if it is tilted to the right.</p>

    <p>When you are ready to begin the task, press the spacebar.</p>
    </body>
</html>`;
