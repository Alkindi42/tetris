import { BLOCK_SIZE, BOARD_COLS, TETROMINOES } from "./constants";

export class Tetromino {
  /**
   * Shape of the Tetromino.
   */
  public shape: Array<Array<number>>;

  /**
   * x coordinate.
   */
  public x: number;

  /**
   * y coordinate.
   */
  public y: number;

  /**
   * Tetromino color.
   */
  private color: string;

  /**
   * Canvas Context 2D.
   */
  private ctx: CanvasRenderingContext2D;

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
  }

  /**
   * Create a random tetromino.
   *
   * @param ctx - Canvas Context 2D.
   *
   * @returns a Tetromino.
   */
  static createRandomTetromino(ctx: CanvasRenderingContext2D): Tetromino {
    const index = Math.floor(Math.random() * TETROMINOES.length);
    const t = TETROMINOES[index];

    const tetromino = new Tetromino(ctx);

    if (t) {
      tetromino.y = 0;
      tetromino.color = t.color;
      tetromino.shape = t.shape;
      // Center the tetromino in the game board.
      tetromino.x = Math.floor((BOARD_COLS - t.shape.length) / 2);
    } else {
      console.error("No tetrimino available for index", index);
    }

    return tetromino;
  }

  /**
   * Clone Tetromino.
   *
   * @returns a new instance of the Tetromino.
   */
  public clone(): Tetromino {
    const tetromino = new Tetromino(this.ctx);

    tetromino.x = this.x;
    tetromino.y = this.y;
    tetromino.color = this.color;

    // Deep copy
    tetromino.shape = JSON.parse(JSON.stringify(this.shape));

    return tetromino;
  }

  /**
   * Move down.
   */
  public moveDown() {
    this.y += 1;
  }

  /**
   * Move left.
   */
  public moveLeft() {
    this.x -= 1;
  }

  /**
   * Move right.
   */
  public moveRight() {
    this.x += 1;
  }

  /**
   * Rotation.
   *┌─────────┬───┬───┬───┐     ┌─────────┬───┬───┬───┐
   *│ (index) │ 0 │ 1 │ 2 │     │ (index) │ 0 │ 1 │ 2 │
   *├─────────┼───┼───┼───┤     ├─────────┼───┼───┼───┤
   *│    0    │ 1 │ 0 │ 0 │  →  │    0    │ 0 │ 1 │ 0 │
   *│    1    │ 1 │ 1 │ 1 │     │    1    │ 0 │ 1 │ 0 │
   *│    2    │ 0 │ 0 │ 0 │     │    2    │ 1 │ 1 │ 0 │
   *└─────────┴───┴───┴───┘     └─────────┴───┴───┴───┘
   *
   */
  public rotate() {
    const len = this.shape.length;

    // Transpose matrix.
    for (let y = 0, rows = len; y < rows; y++) {
      for (let x = 0; x < y; x++) {
        [this.shape[y][x], this.shape[x][y]] = [
          this.shape[x][y],
          this.shape[y][x],
        ];
      }
    }

    // Reverse rows.
    for (let i = 0; i < len; i++) {
      this.shape = this.shape.reverse();
    }
  }

  /**
   * Draw the tetromino in the Canvas
   */
  public draw() {
    this.ctx.fillStyle = this.color;

    for (let y = 0; y < this.shape.length; y++) {
      for (let x = 0; x < this.shape[0].length; x++) {
        if (this.shape[y][x] > 0) {
          this.ctx.fillRect(
            x * BLOCK_SIZE + this.x * BLOCK_SIZE,
            y * BLOCK_SIZE + this.y * BLOCK_SIZE,
            BLOCK_SIZE - 2,
            BLOCK_SIZE - 2
          );
          /* this.ctx.strokeRect(
            x * BLOCK_SIZE + this.x * BLOCK_SIZE,
            y * BLOCK_SIZE + this.y * BLOCK_SIZE,
            28,
            28
          ); */
          // FIXME: this.ctx.fillRect(this.x, this.y, 1, 1);
        }
      }
    }
  }

  public drawPreview() {
    this.ctx.fillStyle = this.color;

    const BLOCK = 18;

    for (let y = 0; y < this.shape.length; y++) {
      for (let x = 0; x < this.shape[0].length; x++) {
        if (this.shape[y][x] > 0) {
          this.ctx.fillRect(
            BLOCK * x + (this.ctx.canvas.width - this.shape.length * BLOCK) / 2,
            BLOCK * y + (this.ctx.canvas.height - 2 * BLOCK) / 2,
            BLOCK - 2,
            BLOCK - 2
          );
        }
      }
    }
  }

  /**
   * Set Canvas Context 2D.
   */
  public setContext(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
  }
}
