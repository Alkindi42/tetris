/**
 * Block size
 */
export const BLOCK_SIZE = 20;

/**
 * Number of rows
 */
export const BOARD_ROWS = 28;

/**
 * Number of cols
 */
export const BOARD_COLS = 15;

/**
 * Keyboard keys
 */
export const KEYBOARD_KEY = {
  ARROW_RIGHT: "ArrowRight",
  ARROW_LEFT: "ArrowLeft",
  ARROW_UP: "ArrowUp",
  ARROW_DOWN: "ArrowDown",
};

/**
 * Information about all Tetrominoes.
 */
export const TETROMINOES = [
  {
    color: "#ff0127",
    shape: [
      [1, 0, 0],
      [1, 1, 1],
      [0, 0, 0],
    ],
  },
  {
    color: "#edebe9",
    shape: [
      [0, 0, 0, 0],
      [2, 2, 2, 2],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
  },
  {
    color: "#fbce05",
    shape: [
      [3, 3],
      [3, 3],
    ],
  },
  {
    color: "#43d562",
    shape: [
      [4, 4, 0],
      [0, 4, 4],
      [0, 0, 0],
    ],
  },
  {
    color: "#a469b6",
    shape: [
      [0, 5, 0],
      [5, 5, 5],
      [0, 0, 0],
    ],
  },
  {
    color: "#FF8C00",
    shape: [
      [0, 0, 6],
      [6, 6, 6],
      [0, 0, 0],
    ],
  },
  {
    color: "#3c77b5",
    shape: [
      [0, 7, 7],
      [7, 7, 0],
      [0, 0, 0],
    ],
  },
];

/**
 * Last possible level.
 */
export const MAX_LEVEL = 10;

/**
 * Number of points earned per cleared line.
 */
export const POINTS_PER_LINE = 100;

/**
 * Speed for each level.
 */
export const SPEED_IN_MS = [600, 500, 450, 400, 350, 300, 250, 200, 150, 100];

/**
 * Game pad.
 */
export const GAMEPAD = {
  UP: 0,
  RIGHT: 1,
  DOWN: 2,
  LEFT: 3,
};
