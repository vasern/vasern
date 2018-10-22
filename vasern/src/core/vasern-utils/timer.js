export default class Timer {
  start() {
    this.time = Date.now();
  }

  now() {
    console.log(Date.now() - this.time);
  }
}
