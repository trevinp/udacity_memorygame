/* Memory Game Project for Udacity Javascript */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

let modal = document.querySelector(".modal");
let closeButton = document.querySelector(".close-button");

function toggleModal() {
    modal.classList.toggle("show-modal");
}

function windowOnClick(event) {
    if (event.target === modal) {
        toggleModal();
    }
}

closeButton.addEventListener("click", toggleModal);
window.addEventListener("click", windowOnClick);

// The master list of cards the user can play with on the board
let initialCards = ['fa-diamond', 'fa-diamond', 'fa-paper-plane-o', 'fa-paper-plane-o',
    'fa-anchor', 'fa-anchor', 'fa-bolt', 'fa-bolt', 'fa-cube', 'fa-cube',
    'fa-leaf', 'fa-leaf', 'fa-bicycle', 'fa-bicycle', 'fa-bomb', 'fa-bomb'];

let selectedCards = [];
let numMoves = 0;
let numStars = 4;

// Timer functionality is from https://github.com/albert-gonzalez/easytimer.js
let timerInstance = new Timer();
let totalNumCards = initialCards.length;
let numMovesElement = document.getElementById('moveCounter');
let span = document.getElementsByClassName('close')[0];

initalizeCardGame();

function initalizeCardGame() {
    buildCards(shuffle(initialCards));
    addClickEventToCards();
    addRestartEvent();
    numMovesElement.innerText = numMoves;
    timerInstance.addEventListener('secondsUpdated', e => {
        document.getElementById('elapsedTime').textContent = 'Elapsed seconds:  ' + timerInstance.getTimeValues().seconds;
    });
    timerInstance.start();
}

function addStar(star) {
    let starAdd = document.getElementById(star);
    starAdd.style.display = 'block';
}

function hideStar(star) {
    let starHide = document.getElementById(star);
    starHide.style.display = 'none';
}

function addRestartEvent() {
    // Restart funcitonality- remove cards and reinitialize
    let restart = document.getElementById('restart');
    restart.addEventListener('click', function () {
        restartGame();
    });
}

function restartGame() {
    let restartConfirm = window.confirm(
        `You are restarting the game after ${numMoves} moves and used ${timerInstance.getTimeValues().seconds} seconds.\nClick OK to CONFIRM or Cancel to dismiss.`);
    if (restartConfirm === true) {
        selectedCards = [];
        numMoves = 0;
        timerInstance.reset();
        timerInstance.start();
        numMovesElement.innerText = numMoves;
        let deck = document.getElementById('cardDeck');
        let children = deck.querySelectorAll('.card');
        for (const child of children) {
            deck.removeChild(child);
        }
        buildCards(shuffle(initialCards));
        addClickEventToCards();
        addStars();
    }
}

function addStars() {
    numStars = 4;
    for (let i = 1; i <= numStars; i++) {
        addStar('star' + i);
    }
}

function addClickEventToCards() {
    // Adds click event to cards to either show or flip the card back over
    let cards = document.querySelectorAll('.card');

    cards.forEach(function (card) {
        card.addEventListener('click', event => {
            if (!card.classList.contains('open') && !card.classList.contains('match')) {
                selectedCards.push(card);
                card.classList.add('open', 'show');
                checkForMatch();
            }
        });
    });
}

function checkForMatch() {
    if (selectedCards.length == 2) {
        // Check if cards match by checking class name of 1st and 2nd items
        let classCardName1 = selectedCards[0].firstElementChild.classList[1];
        let classCardName2 = selectedCards[1].firstElementChild.classList[1];
        if (classCardName1 === classCardName2) {
            // It matches
            cardsMatch();
            numMoves++;
            numMovesElement.innerText = numMoves;
            // See if user has finished all cards and give score if so
            let cards = document.querySelectorAll('.match');
            if (cards.length == totalNumCards) {
                let scoreInfo = document.getElementById('scoreText');
                scoreInfo.textContent = `You completed the game in ${numMoves} moves and took ${timerInstance.getTimeValues().seconds} seconds!
                    This was a ${numStars} star score out of 4.`;
                toggleModal();
                timerInstance.pause();
            }
        }
        else {
            // It does not match
            setTimeout(function () {
                resetCards();
            }, 1000);
            numMoves++;
            numMovesElement.innerText = numMoves;
            // every 4 moves remove a star until they are all gone
            if (numMoves % 4 === 0 && numStars > 1) {
                hideStar('star' + numStars);
                numStars--;
            }
        }
    }
}

function buildCards(cardList) {
    // Dynamically build card deck and add to the page

    let cardDeckFragment = new DocumentFragment();
    let deck = document.getElementById('cardDeck');
    cardDeckFragment.innerHTML = deck.innerHTML;

    for (const card of cardList) {
        let cardHTML = `<li class="card">
        <i class="fa ${card}"></i>
        </li>`;
        cardDeckFragment.innerHTML = cardDeckFragment.innerHTML + cardHTML;
    }
    deck.innerHTML = deck.innerHTML + cardDeckFragment.innerHTML;
}

function resetCards() {
    // Flip any selected cards back over
    for (const card of selectedCards) {
        card.classList.remove('open', 'show');
    }
    selectedCards = [];
}

function cardsMatch() {
    for (const card of selectedCards) {
        card.classList.add('match');
    }
    selectedCards = [];
}