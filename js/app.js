// Create a list that holds all cards
const cards = [
  "diamond", "diamond",
  "paper-plane-o", "paper-plane-o",
  "anchor", "anchor",
  "bolt", "bolt",
  "cube", "cube",
  "leaf", "leaf",
  "bicycle", "bicycle",
  "bomb", "bomb"
];

// Aarray to hold opened cards
let openCards = [];

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

function game() {
  // Game variables
  let moves = 0;
  let stars = 3;
  let matchFound = 0;

  // Create each card's HTMl and add to the page
  function createCard() {
    $(".deck").empty();
    let cardList = shuffle(cards);
    for (const card of cardList) {
      $(".deck").append('<li class="card"><i class="fa fa-' + card + '"></i></li>');
    };
  }
  createCard();

  function startRunner() {
    $("#runner").css("display","inline")
    $('#runner').runner('start');
    $('#runner').runner({
      format: function(value) {
          minute = parseInt(value/1000/60);
          second = parseInt(value/1000 - minute*60);
          return (minute + ":" +second);
      }
    });
  }

  function checkWin() {
    if (matchFound === 8) {
      $("#runner").css("display","none")
      $(".win-modal").css("display","block");
      $(".win-modal .stars").text(stars);
      $(".win-modal .moves").text(moves);
      $(".win-modal .runner").text(minute + ":" + second);
    }
  }

  function addMatch() {
    openCards[0][0].classList.add("match");
    openCards[1][0].classList.add("match");
    $(openCards[0]).off('click');
    $(openCards[1]).off('click');
    openCards = [];
    matchFound += 1;
    setTimeout(checkWin,600);
  }

  function removeClasses() {
    for (let i=0; i<openCards.length; i++ ) {
      openCards[i][0].classList.remove("open","show");
    }
    openCards = [];
  }

  function decrementStars() {
    $(".stars i.fa-star").first()
    .removeClass("fa-star")
    .addClass("fa-star-o");
    stars -= 1;
  }

  function incrementMoves() {
    moves ++;
    $(".score-panel .moves").text(moves);
    if (moves === 13) {
      decrementStars();
    }
    else if (moves === 21) {
      decrementStars();
    }
  }

  function clickCard() {
    // Event listenet for cards
    $(".card").click(function() {
      // Return the function if the card is open
      if ($(this).hasClass("open show")) {
        return;
      }
      // Return if there are 2 opened cards
      if (openCards.length === 2) {
        return;
      }
      // Display the card symbol and add the card to openCards list
      $(this).addClass("open show");
      openCards.push($(this));
      // Start runner if this is the first move
      if (moves === 0) {
        startRunner();
      }
      // Check if the cards match
      if (openCards.length === 2) {
        if (openCards[0][0].firstChild.className === openCards[1][0].firstChild.className) {
          setTimeout(addMatch,300);
        } else {
          setTimeout(removeClasses,1300);
        }
        // Increment moves after checking
        incrementMoves();
      }
    });
  }
  clickCard();
}
game();
$(".restart").click(function() {
  // Close win-modal
  $(".win-modal").css("display","none");
  // Change variables
  moves = 0;
  $(".moves").text(moves);
  stars = 3;
  $(".stars").empty();
  for (let i=0; i<3; i++) {
    $(".stars").append(`<li><i class="fa fa-star"></i></li>`)
  }
  matchFound = 0;
  // Start game again
  game();
});
