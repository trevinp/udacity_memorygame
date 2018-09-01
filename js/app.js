/*
 * Create a list that holds all of your cards
 */

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

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


/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

// The master list of cards the user can play with on the board
let initialCards = ['fa-diamond', 'fa-diamond', 'fa-paper-plane-o', 'fa-paper-plane-o',
    'fa-anchor', 'fa-anchor', 'fa-bolt', 'fa-bolt', 'fa-cube', 'fa-cube',
    'fa-leaf', 'fa-leaf', 'fa-bicycle', 'fa-bicycle', 'fa-bomb', 'fa-bomb'];

// List to hold which cards have been selected by user
let selectedCards = [];
let numMoves = 0;
let numMovesElement = document.getElementById('moveCounter');

initalizeCardGame();

function initalizeCardGame() {
    buildCards(shuffle(initialCards));
    addClickEventToCards();
    addRestartEvent();
    numMovesElement.innerText = numMoves;
}

function addRestartEvent() {
    // Restart funcitonality- remove cards and reinitialize
    let restart = document.getElementById('restart');
    restart.addEventListener('click', function () {
        selectedCards = [];
        numMoves = 0;
        let deck = document.getElementById('cardDeck');
        let children = deck.querySelectorAll('.card');
        for (const child of children) {
            deck.removeChild(child);
        }
        buildCards(shuffle(initialCards));
        addClickEventToCards();
    });
}

function addClickEventToCards() {
    // Adds click event to cards to either show or flip the card back over
    let cards = document.querySelectorAll('.card');

    cards.forEach(function (card) {
        card.addEventListener('click', function () {
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
        }
        else {
            // It does not match
            setTimeout(function () {
                resetCards();
            }, 1000);
            numMoves = numMoves + 1;
            numMovesElement.innerText = numMoves;
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