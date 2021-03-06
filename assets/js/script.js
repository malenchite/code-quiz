var questionList = [
  {
    question: "All statements should be terminated with a ________",
    answers: ["semicolon", "period", "ampersand", "backslash"],
    correctAnswer: 1
  },
  {
    question: "Which of these variable types can be stored in arrays?",
    answers: ["numbers", "strings", "booleans", "all of the above"],
    correctAnswer: 4
  },
  {
    question: "What character is used to bracket the contents of an array?",
    answers: ["quotation mark", "square bracket", "curly bracket", "angle bracket"],
    correctAnswer: 2
  },
  {
    question: "Which of these functions displays a message to the user with only an 'OK' button?",
    answers: ["prompt()", "confirm()", "check()", "alert()"],
    correctAnswer: 4
  },
  {
    question: "What function do you call to print something to the console?",
    answers: ["console.log()", "console()", "log()", "print()"],
    correctAnswer: 1
  },
  {
    question: "Which of the following will check if the variable 'x' is equal in both value and type to the variable 'y'?",
    answers: ["x = y", "x == y", "x === y", "x != y"],
    correctAnswer: 3
  },
  {
    question: "Which of these keywords is used to create a loop with an initialization, a condition, and an iterator?",
    answers: ["while", "do", "for", "loop"],
    correctAnswer: 3
  },
  {
    question: "What logical operator is used when you want to check if one statement OR another is true?",
    answers: ["||", "&&", "!!", "OR"],
    correctAnswer: 1
  },
  {
    question: "Which HTML element is used for including Javascript in a page?",
    answers: ["<java>", "<javascript>", "<script>", "<code>"],
    correctAnswer: 3
  },
  {
    question: "What statement is used to terminate a loop early?",
    answers: ["continue", "break", "stop", "terminate"],
    correctAnswer: 2
  }
];

var viewScoresDiv = document.getElementById("view-high-scores");
var resultDiv = document.getElementById("result-block");
var resultText = document.getElementById("result-text");
var timerDiv = document.getElementById("timer-div");
var timeCounter = document.getElementById("timer");
var scoreTableBody = document.getElementById("score-table-body");

var startBtn = document.getElementById("start-btn");
var answerBtnDiv = document.getElementById("answer-btns");
var returnBtn = document.getElementById("return-btn");
var submitScoreBtn = document.getElementById("submit-score-btn");
var clearScoresBtn = document.getElementById("clear-score-btn");

var submitScoreForm = document.getElementById("submit-score-form");
var initialInput = document.getElementById("init-enter");

var currentQuestion;
var currentTime;
var timerInterval;
var resultTimeout;
var scoreList;

/* Removes a component by ID by adding the hide class*/
function hideID(id) {
  var element = document.getElementById(id);

  element.classList.add("hide");
}

/* Removes a component by ID by removing the hide class */
function showID(id) {
  var element = document.getElementById(id);

  element.classList.remove("hide");
}

/* Set initial state */
function initializePage() {
  showID("start-page");
  hideID("question-page");
  hideID("result-block");
  hideID("complete-page");
  hideID("high-score-page");
  viewScoresDiv.classList.remove("invisible");
  timerDiv.classList.add("invisible");
}

/* Updates the question and answers to the specified question index */
function updateQuestion(qIdx) {
  var questionText = document.getElementById("question-text");

  if (qIdx < questionList.length) {
    questionText.textContent = questionList[qIdx].question;

    /* Clear answer buttons */
    answerBtnDiv.innerHTML = "";

    /* Add a new button for each answer in the answer list */
    for (var i = 0; i < questionList[qIdx].answers.length; i++) {
      var newBtnRow = document.createElement("div");
      var newBtnCol = document.createElement("div");
      var newBtn = document.createElement("button");

      newBtnRow.classList.add("row", "mb-1", "justify-content-center");
      newBtnCol.classList.add("col-xs-8", "col-sm-6", "col-lg-4");
      newBtn.classList.add("btn", "quiz-btn");
      newBtn.textContent = (i + 1) + ". " + questionList[qIdx].answers[i];
      newBtn.setAttribute("data-value", i + 1);

      newBtnCol.appendChild(newBtn);
      newBtnRow.appendChild(newBtnCol);
      answerBtnDiv.appendChild(newBtnRow);
    }
  }
}

/* Finishes the quiz by moving to the final score screen */
function finishQuiz() {
  var scoreDisplay = document.getElementById("final-score");
  clearInterval(timerInterval);

  hideID("question-page");
  timerDiv.classList.add("invisible");
  scoreDisplay.textContent = currentTime;
  initialInput.value = "";
  showID("complete-page");
}

/* Update timer and finishes quiz if timer is expired */
function updateTimer(adjust) {
  currentTime = currentTime + adjust > 0 ? currentTime + adjust : 0;
  timeCounter.textContent = currentTime;

  if (currentTime === 0) {
    finishQuiz();
  }
}

/* Loads high score from local storage */
function loadScores() {
  scoreList = JSON.parse(localStorage.getItem("highScores")) || [];
}

/* Shows high score page */
function showScores() {
  loadScores();

  /* Update score table with new data */
  scoreTableBody.innerHTML = "";
  for (var i = 0; i < scoreList.length; i++) {
    var tableRow = document.createElement("tr");
    var initialsData = document.createElement("td");
    var scoreData = document.createElement("td");

    initialsData.textContent = scoreList[i].initials;
    scoreData.textContent = scoreList[i].score;

    tableRow.append(initialsData);
    tableRow.append(scoreData);

    scoreTableBody.append(tableRow);
  }
  showID("high-score-page");
}

/* Add listener to start quiz when Start button is clicked */
startBtn.addEventListener("click", function () {
  /* Hide 'View High Scores' */
  viewScoresDiv.classList.add("invisible");

  /* Show Timer */
  timerDiv.classList.remove("invisible");

  /* Hide start page */
  hideID("start-page");

  /* Load first question */
  currentQuestion = 0;
  updateQuestion(0);

  /* Show question page */
  showID("question-page");

  /* Start timer countdown */
  currentTime = 75;
  timeCounter.textContent = currentTime;
  timerInterval = setInterval(function () {
    updateTimer(-1);
  }, 1000);
});

/* Add listener to question answer buttons */
answerBtnDiv.addEventListener("click", function (event) {
  if (event.target.matches("button")) {
    /* Check if answer is correct */
    if (parseInt(event.target.getAttribute("data-value")) === questionList[currentQuestion].correctAnswer) {
      resultText.textContent = "Correct!";
    } else {
      updateTimer(-10);
      resultText.textContent = "Wrong!";
    }
    showID("result-block");

    /* Hide result of previous question after 2 seconds */
    clearTimeout(resultTimeout);
    resultTimeout = setTimeout(function () {
      hideID("result-block");
    }, 2000);

    /* Remove focus from button */
    event.target.blur();

    /* Moves to next question or finishes quiz on last question */
    currentQuestion++;
    if (currentQuestion < questionList.length) {
      updateQuestion(currentQuestion);
    } else {
      finishQuiz();
    }
  }
});

/* Add listener to View High Scores div to move directly to high score page */
viewScoresDiv.addEventListener("click", function () {
  hideID("start-page");
  viewScoresDiv.classList.add("invisible");
  showScores();
});

/* Add listener to 'Return' button to reinitialize to start condition */
returnBtn.addEventListener("click", initializePage);

/* Add listener to 'Submit Score' form to add score to storage and open score page */
submitScoreForm.addEventListener("submit", function (event) {
  event.preventDefault();
  if (initialInput.value != "") {
    /* add initials & score to score array */
    var newScore = {
      initials: initialInput.value,
      score: currentTime
    }
    scoreList.push(newScore);

    /* Sort new array to keep scores in order */
    scoreList.sort(function (a, b) {
      if (a.score < b.score) {
        return 1
      } else if (a.score > b.score) {
        return -1;
      } else {
        return 0;
      }
    });

    /* Store new scores list in local storage */
    localStorage.setItem("highScores", JSON.stringify(scoreList));
    hideID("complete-page");
    showScores();
  }
});

/* Add listener to 'Clear Scores" button to delete score storage and reload score page */
clearScoresBtn.addEventListener("click", function (event) {
  event.target.blur();
  localStorage.removeItem("highScores");
  showScores();
});

/* Initialization */
loadScores();
