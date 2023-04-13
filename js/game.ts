import { GameBoard } from "./board-game";
import { KEYBOARD_KEY, POINTS_PER_LINE } from "./constants";
import { Level } from "./level";
import { Tetromino } from "./tetromino";
import { Sounds } from "./sound";

/**
 * Represents the Game.
 */
export class Game {
  /**
   * The ID value returned by window.requestAnimationFrame.
   * We need this to cancel requestAnimationFrame if the player launches another game.
   */
  private requestId = 0;

  /**
   * The game board.
   */
  private board: GameBoard;

  /**
   * The tetromino falling from the sky
   */
  private tetromino: Tetromino;

  /**
   * The next Tetromino that will fall from the sky.
   */
  private nextTetromino: Tetromino;

  /**
   * Time for animation loop.
   */
  private time: DOMHighResTimeStamp;

  /**
   * Canvas Context 2D.
   */
  private ctx: CanvasRenderingContext2D;

  /**
   * Sounds available.
   */
  private sound: Sounds;

  /**
   * Score.
   */
  private score: number;

  /**
   * Score HTML element.
   */
  private scoreHTMLElement: HTMLElement;

  /**
   * Level HTML element.
   */
  private levelHTMLElement: HTMLElement;

  /**
   * Gamepad HTML elements
   */
  private gamepadHTMLElements: NodeListOf<Element>;

  /**
   * Canvas Context 2D for the next Tetromino.
   */
  private ctxNextTetromino: CanvasRenderingContext2D;

  /**
   * Level.
   */
  private level: Level;

  /**
   * Mapping of keyboard events.
   */
  private moves = {
    [KEYBOARD_KEY.ARROW_DOWN]: (t: Tetromino) => t.moveDown(),
    [KEYBOARD_KEY.ARROW_LEFT]: (t: Tetromino) => t.moveLeft(),
    [KEYBOARD_KEY.ARROW_RIGHT]: (t: Tetromino) => t.moveRight(),
    [KEYBOARD_KEY.ARROW_UP]: (t: Tetromino) => {
      this.sound.play("rotate");
      t.rotate();
    },
  };

  constructor(
    ctx: CanvasRenderingContext2D,
    ctxNextTetromino: CanvasRenderingContext2D,
    scoreHTMLElement: HTMLSpanElement,
    levelHTMLElement: HTMLSpanElement,
    gamepadHTMLElements: NodeListOf<Element>
  ) {
    this.ctx = ctx;
    this.scoreHTMLElement = scoreHTMLElement;
    this.levelHTMLElement = levelHTMLElement;

    // Set canvas that render the next Tetromino.
    this.ctxNextTetromino = ctxNextTetromino;
    this.ctxNextTetromino.canvas.width = 4 * 20;
    this.ctxNextTetromino.canvas.height = 2 * 20;

    // Set the sound.
    this.sound = new Sounds();

    // Init and draw an empty board.
    this.board = new GameBoard(this.ctx);

    // Set and display the score.
    this.score = 0;
    this.updateUi(this.scoreHTMLElement, this.score);

    // Init the level.
    this.level = new Level();
    this.updateUi(this.levelHTMLElement, this.level.value);

    // Set the gamepad element.
    this.gamepadHTMLElements = gamepadHTMLElements;

    this.handleGamepad = this.handleGamepad.bind(this);
    this.handleKeyboard = this.handleKeyboard.bind(this);

    this.welcome();
  }

  /**
   * Display welcome screen.
   */
  private welcome() {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

    this.ctx.fillStyle = "white";
    this.ctx.font = "70px VT323";

    let text = "Tetris";
    let measureText = this.ctx.measureText(text);

    // this.ctx.fillText(text, 114, 80);
    this.ctx.fillText(
      text,
      (this.ctx.canvas.width - measureText.width) / 2,
      100
    );

    this.ctx.fillStyle = "#708552";
    this.ctx.font = "40px VT323";
    text = "Jouer";
    measureText = this.ctx.measureText(text);

    this.ctx.fillRect(
      (this.ctx.canvas.width - measureText.width - 100) / 2,

      (this.ctx.canvas.height - measureText.actualBoundingBoxAscent) / 2 - 40,
      measureText.width + 100,
      60
    );

    this.ctx.fillStyle = "white";
    this.ctx.fillText(
      text,
      (this.ctx.canvas.width - measureText.width) / 2,
      (this.ctx.canvas.height - measureText.actualBoundingBoxAscent) / 2
    );
  }

  /**
   * Reset the game.
   */
  private reset() {
    // Reset level.
    this.level = new Level();

    // Reset score.
    this.score = 0;
    this.updateUi(this.scoreHTMLElement, this.score);

    // Init and play the theme music.
    this.sound.start();

    // Remove previous listeners
    removeEventListener("keydown", this.handleKeyboard);
    this.removeGamepadEventListener();

    // If we still have a running game.
    if (this.requestId) {
      cancelAnimationFrame(this.requestId);
      this.requestId = 0;
    }

    // Reset the game board.
    this.board.setEmptyBoard();
  }

  /**
   * Start a new game.
   */
  public start() {
    this.reset();

    // Create the tetromino (the one that falls from the sky)
    this.tetromino = Tetromino.createRandomTetromino(this.ctx);

    // Create the next tetromino.
    this.nextTetromino = Tetromino.createRandomTetromino(this.ctxNextTetromino);

    // Draw the next Tetromino.
    this.nextTetromino.draw();

    // Add event listener for keyboard.
    addEventListener("keydown", this.handleKeyboard);

    // Add event listener for the gamepad.
    this.addGamepadEventListener();

    // Launch the game animation.
    this.time = performance.now();

    // Launch the animation game.
    this.animate(this.time);
  }

  /**
   * Game over.
   */
  private gameOver() {
    this.reset();

    // Stop the main music.
    this.sound.stop();

    // Play the game over sound.
    this.sound.play("game-over");

    this.ctx.fillStyle = "black";
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

    this.ctx.fillStyle = "red";
    this.ctx.font = "30px serif";

    const text = "Game over!";
    const measureText = this.ctx.measureText(text);

    this.ctx.fillText(
      text,
      (this.ctx.canvas.width - measureText.width) / 2,
      (this.ctx.canvas.height - measureText.actualBoundingBoxAscent) / 2
    );
  }

  /**
   * Animate the game.
   */
  private animate(now: DOMHighResTimeStamp) {
    const timelapsed = now - this.time;

    if (!timelapsed || timelapsed > this.level.speedInMs) {
      // Duplicate the tetromino.
      let tetromino = this.tetromino.clone();

      // Apply the movement on the cloned tetromino.
      this.moves[KEYBOARD_KEY.ARROW_DOWN](tetromino);

      if (this.board.isValid(tetromino)) {
        this.tetromino = tetromino; // keep the Tetromino with the last position.
      } else {
        if (this.tetromino.y <= 0) {
          this.gameOver();
          return;
        }

        // Save the final position of the tetromino in the board.
        this.board.save(this.tetromino);
        this.sound.play("landed");

        // Clear full line(s).
        let lines = this.board.clearLine();

        // Compute and update the score.
        if (lines > 0) {
          if (lines === 4) {
            this.sound.play("4-lines");
          } else {
            this.sound.play("line-clear");
          }

          this.updateScore(lines);
          this.updateUi(this.scoreHTMLElement, this.score);

          // Update and display the level.
          this.level.updateLevel(this.score);
          this.updateUi(this.levelHTMLElement, this.level.value);
        }

        // Set the current Tetromino.
        this.tetromino = this.nextTetromino;
        this.tetromino.setContext(this.ctx);

        // Generate the next Tetromino.
        this.nextTetromino = Tetromino.createRandomTetromino(
          this.ctxNextTetromino
        );
      }

      this.time = performance.now();
    }

    // Clears the game board canvas before drawing the next frame.
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

    // Clears the next Tetromino canvas before drawing the next frame.
    this.ctxNextTetromino.clearRect(
      0,
      0,
      this.ctxNextTetromino.canvas.width,
      this.ctxNextTetromino.canvas.height
    );

    // Draw the game board and all the tetrominoes in it.
    this.board.draw();
    // Draw the tetromino (the one that falls from the sky)
    this.tetromino.draw();

    // Draw the next Tetromino.
    this.nextTetromino.drawPreview();

    this.requestId = window.requestAnimationFrame(this.animate.bind(this));
  }

  /**
   * Check if the game is running.
   *
   * @returns True if the game is running else False.
   */
  public isRunning() {
    return this.requestId !== 0;
  }

  /**
   * Compute and update the score from lines.
   *
   * @param score - The score.
   */
  private updateScore(lines: number) {
    this.score += lines * POINTS_PER_LINE * this.level.value;
  }

  /**
   * Update user interface.
   *
   * @param htmlElement - The htmlElement.
   * @param newValue - The new value.
   *
   * @returns the score for the lines cleared
   *
   */
  private updateUi(htmlElement: HTMLElement, newValue: number | string) {
    if (htmlElement.innerHTML != newValue.toString()) {
      htmlElement.innerHTML = newValue.toString();
    }
  }

  /**
   * Add gamepad event listener.
   */
  private addGamepadEventListener() {
    for (let i = 0; i < this.gamepadHTMLElements.length; i++) {
      this.gamepadHTMLElements[i].addEventListener(
        "mousedown",
        this.handleGamepad
      );
    }
  }

  /**
   * Remove gamepad event listener.
   */
  private removeGamepadEventListener() {
    for (let i = 0; i < this.gamepadHTMLElements.length; i++) {
      this.gamepadHTMLElements[i].removeEventListener(
        "mousedown",
        this.handleGamepad
      );
    }
  }

  /**
   * Try to move or rotate the tetromino.
   * Event comes from keyboard and the gamepad (ui).
   *
   * @param keyboardKey - The keyboard key.
   */
  private tryToMove(keyboardKey: string) {
    const move = this.moves[keyboardKey];

    if (move) {
      // Duplicate the tetromino.
      let tetromino = this.tetromino.clone();

      // Apply the movement on the cloned tetromino.
      move(tetromino);

      if (this.board.isValid(tetromino)) {
        this.sound.play("move");
        this.tetromino = tetromino;
      }
    }
  }

  /**
   * Handle keyboard events.
   */
  private handleKeyboard(event: KeyboardEvent) {
    event.preventDefault();
    this.tryToMove(event.code);
  }

  /**
   * Handle gamepad events.
   */
  private handleGamepad(event: any) {
    event.preventDefault();
    this.tryToMove(event.currentTarget.name);
  }
}
