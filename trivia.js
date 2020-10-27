const randCategory = Math.floor(Math.random() * 24);
var cat = document.getElementById('category');
var diff = document.getElementById('difficulty');
let interval;
const categories = [
  {
    category: 'General Knowledge',
    id: 9,
  },
  {
    category: 'Music',
    id: 12,
  },
  {
    category: 'Video Games',
    id: 15,
  },
  {
    category: 'Geography',
    id: 22,
  },
  {
    category: 'History',
    id: 23,
  },
];
const configAudio = {
  vol: 0.5,
};
const difficulties = ['easy', 'medium', 'hard'];
const question = document.getElementById('question');
const answers = document.getElementById('answers');
const btn = document.getElementById('btn');
const x1 = document.getElementById('x1');
const x2 = document.getElementById('x2');
const x3 = document.getElementById('x3');
const a1 = document.getElementById('a1');
const a2 = document.getElementById('a2');
const a3 = document.getElementById('a3');
const a4 = document.getElementById('a4');
const dots = document.getElementById('dots');
const score_el = document.getElementById('score');
const timer_el = document.getElementById('timer');
const gameOver = document.getElementById('dumb');
let score = 0;
let strikes = 0;
let timer;
const wrongSound = new Audio('./mgsalert.mp3');
const rightSound = new Audio('./ding.mp3');
const dumb = new Audio('./mgsgameover.mp3');
const mgs = new Audio('./mgstheme.mp3');
const victory = new Audio('./victory.mp3');

function playAudio(audio) {
  audio.play();
  audio.volume = 0.2;
}

function playSfx(audio) {
  audio.play();
  audio.volume = 0.6;
}

function displayQuestions() {
  a1.innerHTML = `${answerArray[0]}`;
  a2.innerHTML = `${answerArray[1]}`;
  a3.innerHTML = `${answerArray[2]}`;
  a4.innerHTML = `${answerArray[3]}`;
}

function shuffle(array) {
  array.sort(() => Math.random() - 0.5);
}

async function ask() {
  var selectCat = cat.options[cat.selectedIndex].value;
  var selectDiff = diff.options[diff.selectedIndex].value;

  async function fetchData() {
    let response = await fetch(
      `https://opentdb.com/api.php?amount=50&category=${categories[selectCat].id}&difficulty=${difficulties[selectDiff]}&type=multiple`
    );
    let data = await response.json();
    data = JSON.stringify(data);
    data = JSON.parse(data);
    return data;
  }

  playAudio(mgs);

  let rand = Math.floor(Math.random() * 50);
  let abc = await fetchData();

  // Sets up the UI
  function generate() {
    timer = 10;
    timer_el.innerHTML = `<h2>${timer}</h2>`;
    question.innerHTML = `${abc.results[rand].question}`;
    answerArray = [
      abc.results[rand].incorrect_answers[0],
      abc.results[rand].incorrect_answers[1],
      abc.results[rand].incorrect_answers[2],
      abc.results[rand].correct_answer,
    ];
    shuffle(answerArray);
    displayQuestions();
    score_el.innerHTML = `<h4>Score: ${score}</h4>`;
    timer_el.innerHTML = `<h2>10</h2>`;
  }
  generate();

  // Event Listeners
  a1.addEventListener('click', function () {
    correctGuess(a1, 0, a2, a3, a4, abc);
  });

  a2.addEventListener('click', function () {
    correctGuess(a2, 1, a1, a3, a4, abc);
  });

  a3.addEventListener('click', function () {
    correctGuess(a3, 2, a2, a1, a4, abc);
  });

  a4.addEventListener('click', function () {
    correctGuess(a4, 3, a2, a3, a1, abc);
  });

  function timeFunction() {
    interval = setInterval(function () {
      timer--;
      timer_el.innerHTML = `<h2>${timer}</h2>`;
      if (timer === -1) {
        strikes++;
        console.log(timer);
        console.log(strikes);

        if (strikes === 1) {
          x1.style.display = 'inline';
        }
        if (strikes === 2) {
          x2.style.display = 'inline';
        } else if (strikes === 3) {
          x3.style.display = 'inline';
          setTimeout(function () {
            gameEnd();
            playAudio(dumb);
            gameOver.innerHTML = `<h1>GAME OVER.<br>YOU ARE DUMB.</h1>
            <br>
            <button id="btn2">Play Again</button>
            <br>
            `;
          }, 500);
        }
        generate();
      }
    }, 1000);
  }
  timeFunction();
  function correctGuess(right, rightArray, wrong1, wrong2, wrong3, fetchVar) {
    console.log(strikes);
    if (answerArray[rightArray] === fetchVar.results[rand].correct_answer) {
      score++;
      playSfx(rightSound);
      right.style.backgroundColor = 'LawnGreen';
      score_el.innerHTML = `<h4>Score: ${score}</h4>`;
      right.classList.add('rightAnswer');
      question.classList.remove('slideDown');
      question.classList.add('slideUp');
      wrong1.classList.remove('shake');
      wrong2.classList.remove('shake');
      wrong3.classList.remove('shake');
      timer += 1;
      setTimeout(function () {
        rand = Math.floor(Math.random() * 50);
        generate();
      }, 1500);
      setTimeout(function () {
        a1.classList.add('slideInLeft');
        a2.classList.add('slideInLeft');
        a3.classList.add('slideInLeft');
        a4.classList.add('slideInLeft');
        right.classList.remove('rightAnswer');
        question.classList.remove('slideUp');
        question.classList.add('slideDown');
        right.style.backgroundColor = '';
        wrong1.classList.remove('wrongAnswers');
        wrong1.style.backgroundColor = '';
        wrong2.classList.remove('wrongAnswers');
        wrong2.style.backgroundColor = '';
        wrong3.classList.remove('wrongAnswers');
        wrong3.style.backgroundColor = '';
      }, 1500);

      wrong1.classList.add('wrongAnswers');

      setTimeout(function () {
        wrong2.classList.add('wrongAnswers');
      }, 200);

      setTimeout(function () {
        wrong3.classList.add('wrongAnswers');
      }, 400);

      if (score === 10) {
        setTimeout(function () {
          mgs.pause();
          playAudio(victory);
          gameOver.innerHTML = `<h1>CONGRATULATIONS!<br>YOU WIN!</h1>
        <br>
        <button id="btn2">Play Again</button>
        <br>
        `;
          gameEnd();
        }, 1500);
      }
    } else if (
      answerArray[rightArray] !== fetchVar.results[rand].correct_answer
    ) {
      playSfx(wrongSound);
      strikes += 1;
      right.classList.add('shake');
      right.style.backgroundColor = 'DarkRed';
      setTimeout(function () {
        right.classList.remove('shake');
        right.classList.remove('slideInLeft');
      }, 500);
    }

    if (strikes === 1) {
      x1.style.display = 'inline';
    }
    if (strikes === 2) {
      x2.style.display = 'inline';
    } else if (strikes === 3) {
      x3.style.display = 'inline';
      setTimeout(function () {
        clearInterval(interval);
        mgs.pause();
        playAudio(dumb);
        gameEnd();
        gameOver.innerHTML = `
        <h1>GAME OVER.<br>YOU ARE DUMB.</h1>
        <br>
        <button id="btn2">Play Again</button>
        <br>
        `;
        const btn2 = document.getElementById('btn2');
        btn2.addEventListener('click', function () {
          x1.style.display = 'none';
          x2.style.display = 'none';
          x3.style.display = 'none';
          a1.classList.add('slideInLeft');
          a2.classList.add('slideInLeft');
          a3.classList.add('slideInLeft');
          a4.classList.add('slideInLeft');
          btn2.style.display = 'none';
          gameOver.style.display = 'none';
          timer_el.style.display = 'block';
          questions.style.display = 'block';
          answers.style.display = 'block';
          dumb.pause();
          score = 0;
          strikes = 0;
          fetchData();
          generate();
          timeFunction();
          playAudio(mgs);
        });
      }, 500);
    }
  }
}

function gameEnd() {
  clearInterval(interval);
  mgs.pause();

  a1.style.backgroundColor = '';
  a2.style.backgroundColor = '';
  a3.style.backgroundColor = '';
  a4.style.backgroundColor = '';
  timer_el.style.display = 'none';
  timer = 0;
  questions.style.display = 'none';
  answers.style.display = 'none';
  gameOver.style.display = 'block';
}
btn.addEventListener('click', function () {
  dots.style.display = 'none';
  ask();
});
