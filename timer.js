import { EVENT_NAMES } from "./constants.js";
import { messageBroker } from "./message-broker.js";

export class Timer {
  time;
  _timer;
  constructor() {
    this.time = 0;
  }

  start() {
    this._timer = setInterval(() => {
      this.time++;
      messageBroker.publish(EVENT_NAMES.timeChange, this.format(this.time));
    }, 1000);
  }

  end() {
    this.time = 0;
    clearInterval(this._timer);
    this._timer = undefined;
    messageBroker.publish(EVENT_NAMES.timeChange, this.format(this.time));
  }

  format() {
    // 00:00
    const minutes = Math.floor(this.time / 60);
    const seconds = this.time - minutes * 60;

    const displayMinutes = this._isTwoDigits(minutes)
      ? minutes.toString()
      : `0${minutes}`;

    const displaySeconds = this._isTwoDigits(seconds)
      ? seconds.toString()
      : `0${seconds}`;

    return `${displayMinutes}:${displaySeconds}`;
  }

  _isTwoDigits(number) {
    return number > 9;
  }
}
