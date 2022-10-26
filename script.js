const MYAPP = {
  gameInPlay: false,
  winCombos: [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
    [1, 4, 7],
    [2, 5, 8],
    [3, 6, 9],
    [1, 5, 9],
    [7, 5, 3],
  ],
  playerOneScore: 0,
  playerTwoScore: 0,
  timeOuts: [],
  initializeVars: function () {
    this.numFilledIn = 0;
    this.currentBoard = {
      1: "",
      2: "",
      3: "",
      4: "",
      5: "",
      6: "",
      7: "",
      8: "",
      9: "",
    };
  },
  initializeGame: function () {
    MYAPP.initializeVars();
    MYAPP.display.drawBoard();
    $(".game-choice button").click(function () {
      MYAPP.secondPlayer = MYAPP.game.gameSelection(this);
      MYAPP.display.hideGameChoice();
      MYAPP.display.showGameStarter(MYAPP.secondPlayer);
      $(".game-starter .choose-x, .game-starter .choose-o")
        .off()
        .click(MYAPP.game.firstGame);

      $(".back-button").on("click", () => {
        MYAPP.display.hideGameStarter();
        MYAPP.display.showGameChoice();
      });
    });
    $(".hard-reset").on("click", MYAPP.game.resetGame);
  },
};

MYAPP.display = {
  hideGameStarter: () => {
    $(".game-starter").fadeOut();
  },

  showGameStarter: isTwoPlayer => {
    let message;
    if (isTwoPlayer) {
      message = "Player 1 : Would you like X or O?";
    } else {
      message = "Would you like to be X or O?";
    }
    MYAPP.timeOuts.push(
      setTimeout(() => {
        $(".game-starter").fadeIn(500).children("p").text(message);
      }, 700)
    );
  },

  showGameChoice: () => {
    $(".game-choice").fadeIn(600);
  },

  hideGameChoice: () => {
    $(".game-choice").fadeOut(600);
  },

  showPlayerOnePrompt: () => {
    if (MYAPP.secondPlayer) {
      $(".player-one-turn p").text("Go Player 1!");
    } else {
      $(".player-one-turn p").text("Your turn!");
    }
    $(".player-one-turn").animate({ top: "-45px" }, 500);
  },

  hidePlayerOnePrompt: () => {
    $(".player-one-turn").animate({ top: "0" }, 500);
  },

  showPlayerTwoPrompt: () => {
    if (MYAPP.secondPlayer) {
      $(".player-two-turn p").text("Go Player 2!");
    } else {
      $(".player-two-turn p").text("Computer's turn");
    }
    $(".player-two-turn").animate({ top: "-45px" }, 500);
  },

  hidePlayerTwoPrompt: () => {
    $(".player-two-turn").animate({ top: "0" }, 500);
  },

  showDrawMessage: () => {
    MYAPP.timeOuts.push(
      setTimeout(() => {
        $(".draw-message").fadeIn(500);
      }, 1500)
    );
  },

  hideDrawMessage: () => {
    $(".draw-message").fadeOut(1000);
  },

  showLoseMessage: () => {
    MYAPP.timeOuts.push(
      setTimeout(() => {
        $(".lose-message").fadeIn(500);
      }, 1500)
    );
  },

  hideLoseMessage: () => {
    $(".lose-message").fadeOut(1000);
  },

  showWinMessage: () => {
    MYAPP.timeOuts.push(
      setTimeout(() => {
        $(".win-message")
          .fadeIn(500)
          .children("p")
          .text("Player " + MYAPP.turn + " wins!! :D ");
      }, 1500)
    );
  },

  hideWinMessage: () => {
    $(".win-message").fadeOut(1000);
  },

  drawBoard: () => {
    MYAPP.timeOuts.push(
      setTimeout(() => {
        const c = document.getElementById("myCanvas");
        const canvas = c.getContext("2d");
        canvas.strokeStyle = "#fff";

        canvas.lineWidth = 1;
        canvas.beginPath();
        canvas.moveTo(100, 0);
        canvas.lineTo(100, 146.5);
        canvas.closePath();
        canvas.stroke();
        canvas.beginPath();
        canvas.moveTo(200, 0);
        canvas.lineTo(200, 146.5);
        canvas.closePath();
        canvas.stroke();

        canvas.lineWidth = 0.5;
        canvas.beginPath();
        canvas.moveTo(4, 48.5);
        canvas.lineTo(296, 48.5);
        canvas.closePath();
        canvas.stroke();
        canvas.beginPath();
        canvas.moveTo(4, 98.5);
        canvas.lineTo(296, 98.5);
        canvas.closePath();
        canvas.stroke();
      }, 1500)
    );
  },

  resetSquares: () => {
    $(".boxes").html("");
    for (let i = 1; i <= 9; i++) {
      const box = '<li class="' + i + '"><i class="letter"><span></span></i></li>';
      $(box).appendTo($(".boxes"));
    }
  },

  showScore: () => {
    if (MYAPP.secondPlayer) {
      $(".score-1").children(".name").text("player 1");
      $(".score-2").children(".name").text("player 2");
    } else {
      $(".score-1").children(".name").text("player 1");
      $(".score-2").children(".name").text("computer");
    }
    $(".score-1, .score-2").children(".points").text("0");
    $(".score-1,.score-2, .points-divider").fadeIn();
  },
  updateScore: turn => {
    const currentScore = turn === 1 ? MYAPP.playerOneScore : MYAPP.playerTwoScore;

    $(".score-" + turn).children(".points").text(currentScore);
  },
};

MYAPP.game = {
  whoStarts: () => {
    const random = Math.floor(Math.random() * 2 + 1);
    return random;
  },
  gameSelection: item => {
    if ($(item).text() === "One Player") {
      return false;
    } else {
      return true;
    }
  },
  firstGame: function () {
    MYAPP.playerOneSymbol = $(this).text();
    MYAPP.playerTwoSymbol = MYAPP.playerOneSymbol == "X" ? "O" : "X";
    MYAPP.turn = MYAPP.game.whoStarts();
    MYAPP.display.hideGameStarter();
    $("#myCanvas").animate({ opacity: "1" }, 1200);
    $(".hard-reset").fadeIn(600);
    MYAPP.display.showScore();
    MYAPP.display.resetSquares();
    MYAPP.game.play();
  },
  play: function () {
    MYAPP.gameInPlay = true;
    $(".boxes li").on("click", function () {
      MYAPP.game.playerTurn(this);
    });

    MYAPP.timeOuts.push(
      setTimeout(() => {
        if (MYAPP.turn === 1) {
          MYAPP.display.showPlayerOnePrompt();
        } else if (MYAPP.turn === 2) {
          MYAPP.display.showPlayerTwoPrompt();
        }
      }, 1500),
      setTimeout(() => {
        if (MYAPP.turn === 2 && !MYAPP.secondPlayer) {
          MYAPP.game.computerPlay();
        }
      }, 1200)
    );
  },
  playerTurn: square => {
    const symbol = MYAPP.turn === 1 ? MYAPP.playerOneSymbol : MYAPP.playerTwoSymbol;
    const box = $(square).children("i").children("span");
    if (
      box.text() === "" &&
      MYAPP.gameInPlay &&
      (MYAPP.turn === 1 || (MYAPP.turn === 2 && MYAPP.secondPlayer))
    ) {
      box.text(symbol);
      const number = $(square).attr("class");
      MYAPP.game.updateSquare(number, symbol);
      MYAPP.game.endTurn(symbol);
    }
  },
  computerPlay: () => {
    const computer = MYAPP.computer;
    // test computer move suggestion
    let boxNumber;
    if (computer.computerWhichMove(MYAPP.game) && MYAPP.turn === 2) {
      boxNumber = computer.computerWhichMove(MYAPP.game);
      const currentBox = $("." + boxNumber).children("i");

      const symbol = MYAPP.playerTwoSymbol;

      MYAPP.timeOuts.push(
        setTimeout(() => {
          currentBox.children("span").text(symbol);
          MYAPP.game.updateSquare(boxNumber, MYAPP.playerTwoSymbol);
          MYAPP.game.endTurn(symbol);
        }, 1000)
      );
    }
  },
  endTurn: symbol => {
    MYAPP.numFilledIn = MYAPP.numFilledIn + 1;
    if (MYAPP.gameInPlay) {
      if (MYAPP.game.checkWin(symbol)[0]) {
        MYAPP.game.updateScore(MYAPP.turn);
        if (MYAPP.secondPlayer) {
          MYAPP.display.showWinMessage();
        } else {
          MYAPP.turn === 1
            ? MYAPP.display.showWinMessage()
            : MYAPP.display.showLoseMessage();
        }
        MYAPP.gameInPlay = false;
        MYAPP.game.showWinningCombination();
        MYAPP.display.hidePlayerOnePrompt();
        MYAPP.display.hidePlayerTwoPrompt();
        MYAPP.game.reset();
      }
      // stop if it is a draw
      else if (MYAPP.numFilledIn >= 9) {
        MYAPP.gameInPlay = false;
        MYAPP.display.hidePlayerOnePrompt();
        MYAPP.display.hidePlayerTwoPrompt();
        MYAPP.display.showDrawMessage();
        MYAPP.turn = MYAPP.game.whoStarts();
        MYAPP.game.reset();
      } else {
        if (MYAPP.turn === 1) {
          MYAPP.display.hidePlayerOnePrompt();
          MYAPP.display.showPlayerTwoPrompt();
          MYAPP.turn = 2;
          // call computer turn if no second player
          if (!MYAPP.secondPlayer) {
            MYAPP.game.computerPlay();
          }
        } else if (MYAPP.turn === 2) {
          MYAPP.display.showPlayerOnePrompt();
          MYAPP.display.hidePlayerTwoPrompt();
          MYAPP.turn = 1;
        }
      }
    }
  },
  updateSquare: (number, symbol) => {
    MYAPP.currentBoard[number] = symbol;
  },
  checkWin: symbol => {
    const currentBoard = MYAPP.currentBoard;
    const wins = MYAPP.winCombos;
    let winningCombo = [];
    const winner = wins.some(combination => {
      let winning = true;
      for (let i = 0; i < combination.length; i++) {
        if (currentBoard[combination[i]] !== symbol) {
          winning = false;
        }
      }
      if (winning) {
        winningCombo = combination;
      }
      return winning;
    });
    return [winner, winningCombo];
  },
  showWinningCombination: () => {
    const symbol = MYAPP.turn === 1 ? MYAPP.playerOneSymbol : MYAPP.playerTwoSymbol;
    const combo = MYAPP.game.checkWin(symbol)[1];
    for (let i = 0; i < combo.length; i++) {
      const currentBox = "." + combo[i];
      // Black box and rotating test for winning combo
      $(currentBox).children("i").addClass("win").children("span").addClass("rotate");
    }
  },
  updateScore: turn => {
    turn === 1 ? (MYAPP.playerOneScore += 1) : (MYAPP.playerTwoScore += 1);

    MYAPP.display.updateScore(turn);
  },
  reset: () => {
    MYAPP.initializeVars();

    MYAPP.timeOuts.push(
      setTimeout(() => {
        MYAPP.display.hideDrawMessage();
        MYAPP.display.hideLoseMessage();
        MYAPP.display.hideWinMessage();
        $(".boxes li").fadeOut();
      }, 5000),
      setTimeout(() => {
        MYAPP.display.resetSquares();
        $(".boxes li").fadeIn();
        MYAPP.numFilledIn = 0;
      }, 6000),
      // Make sure time for next timeout is long enough to not cause problems after first game
      setTimeout(() => {
        MYAPP.gameInPlay = true;
        MYAPP.game.play();
      }, 6000)
    );
  },
  resetGame: () => {
    $("#myCanvas").css("opacity", "0");
    $(".hard-reset").fadeOut();
    $(".points-divider, .score-1, .score-2").fadeOut();
    MYAPP.playerOneScore = 0;
    MYAPP.playerTwoScore = 0;
    MYAPP.display.resetSquares();
    MYAPP.initializeVars();
    MYAPP.gameInPlay = false;
    MYAPP.playerOneSymbol = null;
    MYAPP.playerTwoSymbol = null;
    MYAPP.timeOuts.forEach(timer => {
      clearTimeout(timer);
    });
    $(".draw-message, .win-message, .lose-message").hide();
    MYAPP.display.hidePlayerOnePrompt();
    MYAPP.display.hidePlayerTwoPrompt();
    MYAPP.display.showGameChoice();
  },
};

MYAPP.computer = {
  computerWhichMove: function () {
    let move = this.winOrBlockChoice("win")[0];
    if (!move) {
      move = this.winOrBlockChoice("block")[0];
    }
    if (!move) {
      move = this.doubleThreatChoice("win");
    }
    if (!move) {
      move = this.doubleThreatChoice("block");
    }
    if (!move) {
      move = this.firstPlay();
    }
    if (!move) {
      move = this.playCenter();
    }
    if (!move) {
      move = this.emptyCorner();
    }
    if (!move) {
      move = this.emptySide();
    }
    move = (move && MYAPP.currentBoard[move]) === "" ? move : false;
    return move;
  },

  winOrBlockChoice: (choiceType, board) => {
    board = board || MYAPP.currentBoard;
    let currentSymbol;
    let opponentSymbol;
    if (choiceType === "win") {
      currentSymbol = MYAPP.playerTwoSymbol;
      opponentSymbol = MYAPP.playerOneSymbol;
    } else if (choiceType === "block") {
      currentSymbol = MYAPP.playerOneSymbol;
      opponentSymbol = MYAPP.playerTwoSymbol;
    } else {
      return;
    }
    let moves = [];
    MYAPP.winCombos.forEach(combo => {
      let notFound = [];
      let notPlayer = true;
      for (let i = 0; i < combo.length; i++) {
        if (board[combo[i]] !== currentSymbol) {
          if (board[combo[i]] === opponentSymbol) {
            notPlayer = false;
          } else {
            notFound.push(combo[i]);
          }
        }
      }
      if (notFound.length === 1 && notPlayer) {
        const move = notFound[0];
        moves.push(move);
      }
    });
    return moves;
  },

  doubleThreatChoice: function (choiceType) {
    // use winChoice function to test a spot for double threat
    const board = MYAPP.currentBoard;
    let move;
    let currentSymbol;
    let opponentSymbol;

    if (choiceType === "win") {
      currentSymbol = MYAPP.playerTwoSymbol;
      opponentSymbol = MYAPP.playerOneSymbol;
    } else if (choiceType === "block") {
      currentSymbol = MYAPP.playerOneSymbol;
      opponentSymbol = MYAPP.playerTwoSymbol;
    }

    // forced diagonal win on 4th move prevention
    if (board[5] === currentSymbol && MYAPP.numFilledIn === 3) {
      if (
        (board[1] === opponentSymbol && board[9] === opponentSymbol) ||
        (board[3] === opponentSymbol && board[7] === opponentSymbol)
      ) {
        // Play an edge to block double threat
        move = this.emptySide();
      }
    }

    if (!move && board[5] === opponentSymbol && MYAPP.numFilledIn === 2) {
      move = this.diagonalSecondAttack();
    }

    if (!move) {
      // clone current board;
      let testBoard = $.extend({}, board);
      for (let i = 1; i <= 9; i++) {
        testBoard = $.extend({}, board);
        if (testBoard[i] === "") {
          testBoard[i] = currentSymbol;
          if (this.winOrBlockChoice(choiceType, testBoard).length >= 2) {
            move = i;
          }
        }
      }
    }
    return move || false;
  },

  diagonalSecondAttack: () => {
    const board = MYAPP.currentBoard;
    const comp = MYAPP.playerTwoSymbol;
    const corners = [1, 3, 7, 9];
    for (let i = 0; i < corners.length; i++) {
      if (board[corners[i]] === comp) {
        return 10 - corners[i];
      }
    }
  },

  firstPlay: () => {
    const board = MYAPP.currentBoard;
    const corners = [1, 3, 7, 9];
    let move;
    if (MYAPP.numFilledIn === 1) {
      // player plays center
      if (board[5] === MYAPP.playerOneSymbol) {
        const cornerNum = Math.floor(Math.random() * 4 + 1);
        move = [1, 3, 7, 9][cornerNum];
      }
      // player plays corner, play opposite corner
      else {
        for (let i = 0; i < corners.length; i++) {
          if (MYAPP.currentBoard[corners[i]] === MYAPP.playerOneSymbol) {
            move = 5;
          }
        }
      }
    } else if (MYAPP.numFilledIn === 0) {
      const cornerNum = Math.floor(Math.random() * corners.length + 1);
      move = corners[cornerNum];
    }
    return move ? move : false;
  },

  playCenter: () => {
    if (MYAPP.currentBoard[5] === "") {
      return 5;
    }
  },
  emptyCorner: () => {
    const board = MYAPP.currentBoard;
    const corners = [1, 3, 7, 9];
    let move;
    for (let i = 0; i < corners.length; i++) {
      if (board[corners[i]] === "") {
        move = corners[i];
      }
    }
    return move || false;
  },

  emptySide: () => {
    const sides = [2, 4, 6, 8];
    for (let i = 0; i < sides.length; i++) {
      if (MYAPP.currentBoard[sides[i]] === "") {
        return sides[i];
      }
    }
    return false;
  },
};

$(document).ready(() => {
  MYAPP.initializeGame();
});
