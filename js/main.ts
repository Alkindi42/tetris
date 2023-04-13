import { Game } from "./game";

/**
 * Get all HTML elements.
 */
const boardGame = document.querySelector("#board-game") as HTMLCanvasElement;
const nextTetromino = document.querySelector(
  "#next-tetromino"
) as HTMLCanvasElement;
const scoreHTMLElement = document.querySelector("#score") as HTMLSpanElement;
const levelHTMLElement = document.querySelector("#level") as HTMLSpanElement;

const gamepadHTMLElements = document.querySelectorAll("div#gamepad button");

if (boardGame && nextTetromino) {
  const ctxBoard = boardGame.getContext("2d");
  const ctxNextTetromino = nextTetromino.getContext("2d");

  if (ctxBoard && ctxNextTetromino && levelHTMLElement) {
    // Init the game.
    const game = new Game(
      ctxBoard,
      ctxNextTetromino,
      scoreHTMLElement,
      levelHTMLElement,
      gamepadHTMLElements
    );

    // Start the game.
    boardGame.addEventListener("click", () => {
      if (game.isRunning()) {
        return;
      }

      game.start();
    });
  }
}
