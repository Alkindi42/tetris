import sounds from "url:../assets/sounds/*.mp3";
import volume from "../assets/img/volume-up.svg";
import volumeMute from "../assets/img/volume-off.svg";

/**
 * Sounds.
 */
export class Sounds {
  public muted = false;

  public button: HTMLButtonElement;

  public sounds: { [key: string]: HTMLAudioElement };

  constructor() {
    this.sounds = {};

    for (let key in sounds) {
      this.sounds[key] = new Audio(sounds[key]);
    }

    this.button = document.querySelector("#sound") as HTMLButtonElement;
    this.button.addEventListener("click", this.toggleSound.bind(this));
  }

  play(name: string) {
    this.sounds[name].play();
  }

  /**
   * Init and play the theme music.
   */
  start() {
    for (let sound in this.sounds) {
      this.sounds[sound].volume = 0.3;
    }
    this.sounds["theme"].loop = true;
    this.sounds["theme"].volume = 0.1;
    this.sounds["theme"].play();
  }

  /**
   * Stop the main music (theme).
   */
  stop() {
    const themeMusic = this.sounds["theme"];

    themeMusic.pause();
    themeMusic.currentTime = 0;
  }

  /**
   * Toggle state sound.
   */
  private toggleSound() {
    this.muted = !this.muted;

    for (let sound in this.sounds) {
      this.sounds[sound].muted = this.muted;
    }

    // Replace the image about sound.
    this.button.innerHTML = this.muted
      ? `<img src="${volumeMute}" />`
      : `<img src="${volume}" />`;
  }
}
