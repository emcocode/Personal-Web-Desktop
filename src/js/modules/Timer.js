/**
 * Timer for managing time taking in the memory game.
 */
export default class Timer {
  /**
   * Inits starting values.
   */
  constructor () {
    this.time = 0
    this.timer = null
  }

  /**
   * Starting the timer.
   */
  start () {
    this.timer = setInterval(() => {
      this.time++
    }, 1000)
  }

  /**
   * Stopping the timer.
   */
  stop () {
    clearInterval(this.timer)
  }
}
