"use strict";

// **** INSTRUCTIONS

// With this quiz, you can use either hard coded quiz questions ("local") or a Google Sheet ("sheet").
// **** Steps marked with stars require you to make some changes. Follow the instructions below.

// **** CONFIGURATION

// **** Change to "local" or "sheet". Do NOT delete.
const QUIZ_SOURCE = "local";

// **** Google Sheets CSV URL - Use only if QUIZ_SOURCE === "sheet"
// 1. Create a Google Sheets. Use these column names: Question, A, B, C, D, Correct, Correct Feedback, Incorrect Feedback
// 2. Copy the URL.
// 3. Replace the URL below with your new URL.
// 4. Change the end of the URL to match this pattern: https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/gviz/tq?tqx=out:csv
const SHEET_CSV_URL =
  "https://docs.google.com/spreadsheets/d/1N9abPlpOZQ3G5SJDb7tKPfnBOGAqnivMXe2uHQipUUw/gviz/tq?tqx=out:csv";

// *** Local (hard coded) quiz data - use only if QUIZ_SOURCE === "local"
// Change the text below. Make sure you don't delete any "" or [].
const LOCAL_QUIZ_DATA = [
  {
    question:
      "Which sequence best matches the typical steps HR teams follow after they receive a harassment or retaliation complaint?",
    answerChoices: [
      "Take action → analyze details → investigate → follow up (if necessary) → gather information",
      "Gather information → investigate → analyze details → take action (if necessary) → follow up",
      "Investigate → take action → gather information → follow up → analyze details",
      "Follow up → gather information → take action → investigate → analyze details",
    ],
    correct:
      "Gather information → investigate → analyze details → take action (if necessary) → follow up",
    correctFeedback:
      "Nice job! HR first gathers information, then investigates, analyzes details, takes action when needed, and follows up with the complainant.",
    incorrectFeedback:
      "Not quite. HR first gathers information, then investigates, analyzes details, takes action if needed, and follows up with the complainant.",
  },
  {
    question: "Which statement best describes retaliation?",
    answerChoices: [
      "Taking negative action against someone because they reported a concern",
      "Treating employees differently based on their role, seniority, or job responsibilities",
      "Responding to a conflict by addressing performance or behavior issues",
      "Experiencing conflict or disagreement with a coworker over work-related decisions",
    ],
    correct:
      "Punishing a person's employment conditions because they file a complaint.",
    correctFeedback:
      "Great! Retaliation occurs when someone takes a negative action against an individual because they reported a concern, participated in an investigation, or exercised a protected right. Retaliation is prohibited, even if the original concern turns out to be unsubstantiated.",
    incorrectFeedback:
      "That's not right. Retaliation is not about general conflict, fair discipline, or routine workplace decisions. It specifically involves punishing or disadvantaging someone because they raised a concern, cooperated in an investigation, or exercised a protected right.",
  },
  {
    question: "When can bullying become harassment?",
    answerChoices: [
      "When the bullying happens several times over the period of a week",
      "When the bully claims they are “just joking”",
      "When the bullying targets a protected characteristic",
      "When the bully continues even after the target asks them to stop",
    ],
    correct: "When the bullying targets a protected characteristic",
    correctFeedback:
      "Nice work! Bullying can rise to the level of harassment when it targets a protected characteristic, such as race, gender, age, disability, religion, or other legally protected traits. At that point, the behavior goes beyond general mistreatment and may violate anti‑harassment laws and company policy.",
    incorrectFeedback:
      "Not quite. Bullying does not become harassment based on how often it occurs, whether the person claims to be joking, or whether it causes general workplace conflict. The key factor is whether the conduct is directed at a protected characteristic.",
  },
  {
    question:
      "Howard tells Amy to take off her hijab because this is America. How would HR likely classify this incident?",
    answerChoices: [
      "Harassment",
      "Retaliation",
      "Bullying",
      "Normal workplace behavior",
    ],
    correct: "Harassment",
    correctFeedback:
      "Great job! Telling someone to remove a hijab targets a protected characteristic - religion. This type of comment is discriminatory and constitutes harassment, as it is unwelcome conduct based on a protected characteristic and can contribute to a hostile work environment.",
    incorrectFeedback:
      "Not quite. Telling someone to remove a hijab targets a protected characteristic - religion. This type of comment is discriminatory and constitutes harassment, as it is unwelcome conduct based on a protected characteristic and can contribute to a hostile work environment.",
  },
  {
    question: "Which of the following is a protected characteristic?",
    answerChoices: [
      "Job title",
      "Work performance rating",
      "National origin",
      "Political affiliation",
    ],
    correct: "National origin",
    correctFeedback:
      "Correct! National origin is a protected characteristic under employment and anti‑discrimination laws. It refers to a person’s country of origin, ancestry, ethnicity, or accent, and individuals are legally protected from discrimination or harassment based on this characteristic.",
    incorrectFeedback:
      "That's not right. Protected characteristics are specific traits defined by law, such as national origin, race, religion, sex, age, and disability. National origin is a protected characteristic under employment and anti‑discrimination laws. It refers to a person’s country of origin, ancestry, ethnicity, or accent, and individuals are legally protected from discrimination or harassment based on this characteristic.",
  },
];

// QUIZ DATA

// Creates array with data from configuration step.
let quizData = [];
// Randomizes the order of questions.
let shuffledQuestions = [];

// INITIALIZE QUIZ DATA

function initQuizData() {
  // local mode
  if (QUIZ_SOURCE === "local") {
    quizData = LOCAL_QUIZ_DATA;
    shuffledQuestions = shuffleArray(quizData);
    // for testing purposes
    console.log("✅ Using local quiz data");
    return;
  }

  // Spreadsheet mode
  fetch(SHEET_CSV_URL)
    .then((res) => res.text())

    .then((csv) => {
      const parsed = Papa.parse(csv, {
        header: true,
        skipEmptyLines: true,
      });

      quizData = parsed.data.map((row) => ({
        question: row.Question,
        answerChoices: [row.A, row.B, row.C, row.D],
        correct: row.Correct,
        correctFeedback: row["Correct Feedback"],
        incorrectFeedback: row["Incorrect Feedback"],
      }));

      shuffledQuestions = shuffleArray(quizData);
      // for testing purposes
      console.log("✅ Loaded quiz from spreadsheet");
    })
    // for testing purposes
    .catch((err) => console.error("❌ Failed to load spreadsheet data", err));
}

// DOM ELEMENTS

const startBtnContainer = document.querySelector(".start-btn-container");
const startBtn = document.querySelector(".start-btn");
const quizContainer = document.querySelector(".quiz-container");
const questionNumber = document.querySelector(".question-number");
const questionText = document.querySelector(".question-text");
const answerChoicesContainer = document.querySelector(
  ".quiz-container .answer-choices",
);
const nextBtn = document.querySelector(".quiz-container .next-btn");
const retakeBtn = document.querySelector(".retake-btn");
const questionFeedbackCorrect = document.querySelector(
  ".question-feedback-correct",
);
const questionFeedbackIncorrect = document.querySelector(
  ".question-feedback-incorrect",
);
const resultsContainer = document.querySelector(".quiz-results-container");

// QUIZ STATE

let questionIndex = 0;
let score = 0;
let answerSelected = false;
let currentQuestion;
let storeUserAnswers = [];
let timerInterval;

// START SCREEN

startBtn.addEventListener("click", () => {
  // Prevents quiz from starting if questions are not loaded.
  if (!quizData.length) {
    alert("Quiz data is still loading. Please try again.");
    return;
  }

  startBtnContainer.classList.add("hidden");
  quizContainer.classList.remove("hidden");
  createQuestion();
});

// UTILITIES AND RENDER

// Randomize the order of questions and answer choices
function shuffleArray(array) {
  // create a copy of the quiz data first to cut down on confusion later
  const quizDataCopy = [...array];
  for (let i = quizDataCopy.length - 1; i > 0; i--) {
    // Pick a random index from 0 to i
    const j = Math.floor(Math.random() * (i + 1));
    // Swap elements
    [quizDataCopy[i], quizDataCopy[j]] = [quizDataCopy[j], quizDataCopy[i]];
  }
  return quizDataCopy;
}

// Display questions from questions and answer data
// Start timer
function createQuestion() {
  // timer
  clearInterval(timerInterval);

  // **** Can change timer legths as needed.
  let secondsTotal = 30;
  let secondsLeft = 29;
  const timerDisplay = document.querySelector(".quiz-container .timer");
  timerDisplay.classList.remove("danger");

  timerDisplay.textContent = `Time Left: ${secondsTotal} seconds`;

  timerInterval = setInterval(() => {
    timerDisplay.textContent = `Time Left: ${secondsLeft} seconds`;
    secondsLeft--;

    // **** Can change "danger" zone as needed.
    if (secondsLeft < 10) {
      timerDisplay.classList.add("danger");
    }

    if (secondsLeft < 0) {
      clearInterval(timerInterval);
      if (!answerSelected) {
        resolveAnswer({ isCorrect: false });
      }
    }
  }, 1000);

  // questions
  currentQuestion = shuffledQuestions[questionIndex];
  const shuffledAnswerChoices = shuffleArray(currentQuestion.answerChoices);
  // Clear old answer buttons
  answerSelected = false;
  answerChoicesContainer.innerHTML = "";
  // hide feedback from previous question
  questionFeedbackCorrect.classList.add("hidden");
  questionFeedbackIncorrect.classList.add("hidden");
  // hide the next button until an answer is selected
  nextBtn.classList.add("disabled");
  // Create next question
  questionNumber.textContent = `${questionIndex + 1}/${shuffledQuestions.length}`;
  questionText.textContent = currentQuestion.question;

  // Create answer choice buttons
  shuffledAnswerChoices.forEach((answer) => {
    const answerChoiceBtn = document.createElement("button");
    answerChoiceBtn.classList.add("answer-choice");
    // add the content of each answer choice
    answerChoiceBtn.textContent = answer;
    answerChoiceBtn.addEventListener("click", checkAnswer);
    answerChoicesContainer.appendChild(answerChoiceBtn);
  });
}

// If the timer runs out before clicking next button.
function resolveAnswer({ isCorrect, userAnswer = "No answer selected" }) {
  clearInterval(timerInterval);
  answerSelected = true;

  if (isCorrect) {
    score++;
    questionFeedbackCorrect.querySelector("p").textContent =
      currentQuestion.correctFeedback;
    questionFeedbackCorrect.classList.remove("hidden");
  } else {
    questionFeedbackIncorrect.querySelector("p").textContent =
      currentQuestion.incorrectFeedback;
    questionFeedbackIncorrect.classList.remove("hidden");
  }

  // store this data for results page.
  storeUserAnswers.push({
    question: currentQuestion.question,
    userAnswer,
    correctAnswer: currentQuestion.correct,
    isCorrect,
    feedback: isCorrect
      ? currentQuestion.correctFeedback
      : currentQuestion.incorrectFeedback,
  });

  // Disable all answer choices
  document.querySelectorAll(".answer-choice").forEach((button) => {
    button.disabled = true;
    button.classList.add("disabled");
  });

  // Show Next button
  nextBtn.classList.remove("disabled");
}

// Check if learner selects the correct answer
function checkAnswer(e) {
  if (answerSelected) return;

  const userAnswer = e.target.textContent;
  const isCorrect = userAnswer === currentQuestion.correct;

  e.target.classList.add(isCorrect ? "correct" : "incorrect");

  resolveAnswer({ isCorrect, userAnswer });
}

// NAVIGATION

// Display next question
const nextQuestion = () => {
  questionIndex++;

  if (questionIndex < shuffledQuestions.length) {
    createQuestion();
  } else {
    displayResults();
  }
};

// RESULTS

// Display the results
const displayResults = () => {
  // hide all quiz elements
  quizContainer.classList.add("hidden");
  questionFeedbackCorrect.classList.add("hidden");
  questionFeedbackIncorrect.classList.add("hidden");
  resultsContainer.classList.remove("hidden");

  // Clear previous results
  resultsContainer
    .querySelectorAll(".results-feedback-container")
    .forEach((el) => el.remove());

  // Show score
  resultsContainer.querySelector("h2").textContent =
    `Score: You got ${score} out of ${shuffledQuestions.length}.`;

  // Show each saved answer on the results page with correct answer and feedback
  storeUserAnswers.forEach((result) => {
    const resultDiv = document.createElement("div");
    resultDiv.className = `results-feedback-container ${result.isCorrect ? "correct" : "incorrect"}`;

    resultDiv.innerHTML = `
      <div class="result-question">
        ${result.isCorrect ? "✅" : "❌"} ${result.question}
      </div>

      <div class="result-answers">
        <div class="user-answer">
          <strong>Your answer:</strong> ${result.userAnswer}
        </div>
        <div class="correct-answer">
          <strong>Correct answer:</strong> ${result.correctAnswer}
        </div>
      </div>

      <div class="result-feedback">
        ${result.feedback}
      </div>
    `;

    resultsContainer.appendChild(resultDiv);
  });

  resultsContainer.appendChild(retakeBtn);
};

// RESET

// reset before a retake
function resetQuiz() {
  storeUserAnswers = [];
  score = 0;
  questionIndex = 0;
  answerSelected = false;
  shuffledQuestions = shuffleArray(quizData);
  resultsContainer.classList.add("hidden");
  quizContainer.classList.remove("hidden");
  createQuestion();
}

// INIT

initQuizData();
nextBtn.addEventListener("click", nextQuestion);
retakeBtn.addEventListener("click", resetQuiz);
