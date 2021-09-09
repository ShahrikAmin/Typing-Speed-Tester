import text from './data.js';

const timerElement = document.getElementById('timer');
const textArea = document.getElementById('quoteInput');
const startButton = document.querySelector('.start-button');
const firstSpan = document.getElementById('wordnr-0');
const table = document.getElementById('table');

var currentSpan,
	numberOfSpanUsed,
	startTime,
	inGame,
	paragraph,
	correctWords,
	incorrectWords,
	correctStrokes,
	incorrectStrokes;

function onPageLoad() {
	firstSpan.textContent = 'Click "start!" to start the game and begin generating paragraphs!';
	inGame = false;
}

onPageLoad();

function renderParagraph() {
	inGame = true;
	paragraph = '';
	var maxCharacters = 75;
	currentSpan = 0;
	textArea.value = '';
	for (var i = 0; i < numberOfSpanUsed + 5; i++) {
		var spanInMaintenance = document.getElementById(`wordnr-${i}`);
		spanInMaintenance.textContent = '';
		spanInMaintenance.classList.remove('incorrect', 'correct', 'highlight');
	}
	firstSpan.classList.add('highlight');
	numberOfSpanUsed = 0;
	while (paragraph.length <= maxCharacters) {
		var randomNumber = Math.floor(Math.random() * text.length);
		paragraph += ' ' + text[randomNumber];
		document.getElementById(`wordnr-${numberOfSpanUsed}`).textContent = text[randomNumber];
		numberOfSpanUsed++;
	}
}

startButton.addEventListener('click', function (e) {
	inGame = true;
	correctWords = incorrectWords = correctStrokes = incorrectStrokes = 0;
	textArea.focus();
	table.classList.add('not-visible');
	startTimer();
	renderParagraph();
});

textArea.addEventListener('input', function (e) {
	if (e.repeat) return;
	if (inGame === false) textArea.value = '';
	if (inGame === false) return;

	const spanInUse = document.getElementById(`wordnr-${currentSpan}`);
	const nextSpan = document.getElementById(`wordnr-${currentSpan + 1}`);

	if (e.data === ' ' && textArea.value === ' ') {
		textArea.value = '';
	} else if (e.data === ' ') {
		spanInUse.classList.remove('highlight-incorrect');
		checkWord();
	} else {
		checkCharacter();
	}

	function checkWord() {
		currentSpan++;
		if (textArea.value.trim() === spanInUse.textContent) {
			spanInUse.classList.add('correct');
			spanInUse.classList.remove('incorrect');
			correctWords++;
			correctStrokes += spanInUse.textContent.length;
		} else {
			spanInUse.classList.add('incorrect');
			spanInUse.classList.remove('correct');
			incorrectWords++;
			incorrectStrokes += spanInUse.textContent.length;
		}
		textArea.value = '';
		spanInUse.classList.toggle('highlight');
		if (nextSpan.textContent === '') {
			renderParagraph();
		} else {
			nextSpan.classList.toggle('highlight');
		}
	}

	function checkCharacter() {
		for (var i = 0; i < textArea.value.length; i++) {
			if (textArea.value[i] !== spanInUse.textContent[i]) {
				spanInUse.classList.add('highlight-incorrect');
			} else {
				spanInUse.classList.remove('highlight-incorrect');
			}
		}
		if (textArea.value === '') spanInUse.classList.remove('highlight-incorrect');
	}
});

function startTimer() {
	timerElement.innerText = 60;
	startTime = new Date();

	setInterval(() => {
		if (Number(timerElement.textContent) > 0) {
			timerElement.textContent = 60 - Math.round((new Date() - startTime) / 1000);
		} else {
			calculateResults();
		}
	}, 1000);
}

function calculateResults() {
	firstSpan.textContent = 'Generating results... Click the "start!" button to restart the game!';
	firstSpan.classList.remove('highlight', 'correct', 'incorrect');
	table.classList.remove('not-visible');
	document.getElementById('correct-words').textContent = correctWords;
	document.getElementById('incorrect-words').textContent = incorrectWords;
	document.querySelector('.incorrect-result').textContent = incorrectStrokes;
	var correctResultsDisplay = document.querySelectorAll('.correct-result');
	correctResultsDisplay.forEach(function (correctWord) {
		correctWord.textContent = correctStrokes;
	});
	document.getElementById('WPM').textContent = `${Math.round(correctStrokes / 5)} WPM`;
	inGame = false;
	for (var i = 1; i < numberOfSpanUsed + 5; i++) {
		var spanInMaintenance = document.getElementById(`wordnr-${i}`);
		spanInMaintenance.classList.remove('incorrect', 'correct', 'highlight');
		spanInMaintenance.textContent = '';
	}
}
