import { gridSize, images } from "./globals";

export const welcomeScreen = `
<div style="width: 800px">
    <h1>Welcome to the Study</h1>
    <p>Thank you for your interest in participating in this study.</p>
    <p>Press any key to continue.</p>
</div>`;

export const surveyInstructions = `
<div style="width: 800px">
    <h1>Instructions</h1>
    <p>This experiment consists of two parts. First, you will 
    complete an 18-item questionnaire. This questionnaire will ask you questions about
    your typical behaviors. When you complete the questionnaire, you will begin the experimental task.</p>

    <p> When you are ready to begin the survey, press any key.</p>
  </div>`;

export const taskInstructions = `
<div style="width: 1200px">
    <h1>Task Instructions</h1>
    <p>In this experiment, you will see a series of images displayed in a grid.
    Your task is to identify a target letter among several distractor letters as quickly and accurately as possible.
    The target image will be either a T tilted to the left (left image) or a T tilted to the right (right image). </p>

    <div class="row">
            <img src="${images.target.leftT}" alt="T tilted to the left" style="width: 100px; height: 100px;">
						<img src="${images.target.rightT}" alt="T tilted to the right" style="width: 100px; height: 100px;">
    </div>

    <p>You will respond by pressing the 'f' key if the target is tilted to the left
    or the 'j' key if it is tilted to the right.</p>

    <p>When you are ready to begin the task, press the spacebar.</p>
</div>
`;

export const resizeInstructions = `
			<div
				style="position: relative;
					width: ${gridSize[1]}px;
					height: ${gridSize[0]}px;
					border: 2px solid black;
					display: flex;
					justify-content: center;
					align-items: center;"
			>
				<p style="padding: 150px;">
					 Please resize your screen until you can see the full outline of the
					 box encompassing this text. When the box in fully visible, please 
					 hit the continue button below.
				</p>
		</div>`;

export const completionInstructions = `
			<div style="width: 800px;">
				<p style="padding: 150px">
					 You have now completed the study. Click the continue button below
					 to be redirected back to Prolific to get credit for the survey. You
					 will be automatically redirected after 10 seconds.
				</p>
		</div>`;
