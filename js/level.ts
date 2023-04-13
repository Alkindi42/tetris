import { MAX_LEVEL, SPEED_IN_MS } from "./constants";

/**
 * Level.
 */
export class Level {
  /**
   * Level.
   */
  value: number;

  /**
   * Speed in ms
   */
  public speedInMs: number;

  constructor() {
    this.value = 1;
    this.speedInMs = 600;
  }

  /**
   * Get the level from the score.
   *
   * @param score - The score.
   *
   * @returns the new level.
   */
  private getLevelFromScore(score: number) {
    return Math.floor(score / 1000) + 1;
  }

  /**
   * Update and display the level if necessary.
   *
   * @param score - The score.
   */
  public updateLevel(score: number) {
    if (this.value < MAX_LEVEL) {
      const level = this.getLevelFromScore(score);

      if (level !== this.value) {
        this.value = level;
        this.speedInMs = SPEED_IN_MS[this.value - 1];
      }
    }
  }
}
