import { BLOCK_SIZE, BOARD_COLS, BOARD_ROWS, TETROMINOES } from "./constants";
import { Tetromino } from "./tetromino";

/**
 * Represents the game board.
 */
export class GameBoard {
  /**
   * Represents the game board.
   */
  public board: Array<Array<any>> = [[]];

  /**
   * Canvas Context 2D.
   */
  private ctx: CanvasRenderingContext2D;

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
    this.init();
  }

  /**
   * Init the game board.
   */
  private init() {
    this.ctx.canvas.width = BOARD_COLS * BLOCK_SIZE;
    this.ctx.canvas.height = BOARD_ROWS * BLOCK_SIZE;

    // FIXME: this.ctx.scale(BLOCK_SIZE, BLOCK_SIZE);
  }

  /**
   * Draw the game board and all the tetrominoes in it.
   */
  public draw() {
    for (let y = 0; y < BOARD_ROWS; y++) {
      for (let x = 0; x < BOARD_COLS; x++) {
        const value = this.board[y][x];

        if (value > 0) {
          const t = TETROMINOES[value - 1];

          this.ctx.fillStyle = t.color;

          this.ctx.fillRect(
            x * BLOCK_SIZE,
            y * BLOCK_SIZE,
            BLOCK_SIZE - 2,
            BLOCK_SIZE - 2
          );
          // FIXME this.ctx.strokeRect(x * BLOCK_SIZE, y * CELL_SIZE, 28, 28);
        }
      }
    }
  }

  /**
   * Clear full line.
   * If we have a full row, we need to erase it and shift all rows from the top.
   *
   * @returns the number of lines cleared.
   */
  public clearLine(): number {
    let lines = 0;

    for (let row = 0; row < BOARD_ROWS; row++) {
      if (this.board[row].every((value: number) => value > 0)) {
        lines++;

        // Remove the row.
        this.board.splice(row, 1);

        // Add row at the top.
        this.board.unshift(Array(BOARD_COLS).fill(0));
      }
    }

    return lines;
  }

  /**
   * Check if the future position of the Tetromino is valid.
   *
   * @param tetromino - The Tetromino.
   * @param translationCoord - x and y to add to the tetrimino points (translation operation)
   *
   * @returns True if the next position is valid then False.
   */
  public isValid(tetromino: Tetromino) {
    for (let y = 0, rows = tetromino.shape.length; y < rows; y++) {
      for (let x = 0, cols = tetromino.shape[0].length; x < cols; x++) {
        const XCoordinate = tetromino.x + x;
        const YCoordinate = tetromino.y + y;

        // It's not a real part of our Tetrimino, so we ignore it.
        if (tetromino.shape[y][x] === 0) {
          continue;
        }

        // Check that we are inside the game board.
        if (
          XCoordinate < 0 ||
          XCoordinate >= BOARD_COLS ||
          YCoordinate >= BOARD_ROWS
        ) {
          return false;
        }

        // Check that we are not overlapping another Tetromino.
        if (this.board[YCoordinate] && this.board[YCoordinate][XCoordinate]) {
          return false;
        }
      }
    }

    return true;
  }

  /**
   * Save the tetromino in the board (final position).
   *
   * @param tetromino - Tetromino to insert.
   */
  public save(tetromino: Tetromino) {
    for (let y = 0, row = tetromino.shape.length; y < row; y++) {
      for (let x = 0, col = tetromino.shape[0].length; x < col; x++) {
        const XCoordinate = tetromino.x + x;
        const YCoordinate = tetromino.y + y;

        if (tetromino.shape[y][x] > 0) {
          this.board[YCoordinate][XCoordinate] = tetromino.shape[y][x];
        }
      }
    }
  }

  /**
   * Reset the board to an empty board.
   */
  public setEmptyBoard() {
    this.board = Array.from({ length: BOARD_ROWS }, () =>
      Array(BOARD_COLS).fill(0)
    );
  }
}
