const startButton = document.getElementById('startButton');
const restartButton = document.getElementById('restartButton');
const scoreSpan = document.querySelector('.KeepTrack h2 span');
const timerSpan = document.querySelector('.KeepTrack h2:nth-child(2) span');
const boxes = Array.from(document.querySelectorAll('.box'));

const cardImages = [
    'cloud.png',
    'watercan.png',
    'fountain.png',
    'irrigation.png',
    'rain-catcher.png',
    'molecule-h2o.png',
];

let firstCard = null;
let secondCard = null;
let lockBoard = false;
let matchCount = 0;
let timerInterval = null;
let timeLeft = 30;
let gameActive = false;

function shuffle(array) {
    const result = array.slice();
    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
}

function updateScore() {
    if (scoreSpan) {
        scoreSpan.textContent = `${matchCount}`;
    }
}

function resetBoardState() {
    [firstCard, secondCard] = [null, null];
    lockBoard = false;
}

function resetTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
    timeLeft = 30;
    if (timerSpan) {
        timerSpan.textContent = timeLeft;
    }
}

function startTimer() {
    resetTimer();

    timerInterval = setInterval(() => {
        if (!gameActive) return;

        timeLeft -= 1;
        if (timerSpan) {
            timerSpan.textContent = timeLeft;
        }

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            timerInterval = null;
            gameActive = false;
            lockBoard = true;
            alert('Time is up! Try again.');
        }

        if (matchCount === 6) {
            clearInterval(timerInterval);
            timerInterval = null;
            gameActive = false;
            alert('You win!');
        }
    }, 1000);
}

function setBoardImages() {
    const pairImages = [...cardImages, ...cardImages];
    const shuffled = shuffle(pairImages);

    boxes.forEach((box, index) => {
        box.classList.remove('flipped', 'matched');
        box.dataset.card = shuffled[index];
        const img = box.querySelector('.back img');
        if (img) {
            img.src = `img/Icons8/${shuffled[index]}`;
        }
    });

    matchCount = 0;
    updateScore();
    resetBoardState();
}

function startGame() {
    setBoardImages();
    gameActive = true;
    lockBoard = false;
    resetTimer();
    startTimer();
}

function restartGame() {
    gameActive = false;
    resetTimer();
    setBoardImages();
}

function handleCardClick(event) {
    if (!gameActive) return;

    const card = event.currentTarget;

    if (lockBoard || card === firstCard || card.classList.contains('matched')) {
        return;
    }

    card.classList.add('flipped');

    if (!firstCard) {
        firstCard = card;
        return;
    }

    secondCard = card;
    checkForMatch();
}

function checkForMatch() {
    const isMatch = firstCard.dataset.card === secondCard.dataset.card;

    if (isMatch) {
        firstCard.classList.add('matched');
        secondCard.classList.add('matched');
        matchCount += 1;
        updateScore();
        resetBoardState();

        if (matchCount === 6) {
            gameActive = false;
            clearInterval(timerInterval);
            timerInterval = null;
            alert('You win!');
        }

        return;
    }

    lockBoard = true;
    setTimeout(() => {
        firstCard.classList.remove('flipped');
        secondCard.classList.remove('flipped');
        resetBoardState();
    }, 800);
}

function init() {
    boxes.forEach(box => box.addEventListener('click', handleCardClick));

    if (startButton) {
        startButton.addEventListener('click', startGame);
    }

    if (restartButton) {
        restartButton.addEventListener('click', restartGame);
    }

    // Initial state (board is ready but timer is not running)
    setBoardImages();
    resetTimer();
}

init();
