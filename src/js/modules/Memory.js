import Timer from './Timer.js'
import Questionmark from './img/question.jpg'
import Red from './img/red.jpg'
import image1 from './img/1.jpg'
import image2 from './img/2.jpg'
import image3 from './img/3.jpg'
import image4 from './img/4.jpg'
import image5 from './img/5.jpg'
import image6 from './img/6.jpg'
import image7 from './img/7.jpg'
import image8 from './img/8.jpg'
import image9 from './img/9.jpg'
import image10 from './img/10.jpg'
import image11 from './img/11.jpg'
import image12 from './img/12.jpg'
import image13 from './img/13.jpg'
import image14 from './img/14.jpg'
import image15 from './img/15.jpg'
import image16 from './img/16.jpg'
import image17 from './img/17.jpg'

/**
 * Memory class for memory game. Exists in 4x4, 2x4 and 2x2.
 * Usable both with mouse and keyboard. When selecting picture number 2, there is a blocking timer to prevent cheat/abusing of the rules.
 * After the timer, the pictures disappear if correct, blinks red and hides again if incorrect. We keep track of time and attempts.
 */
export default class Memory {
  /**
   * Constructur for Memory. Here we pass on parameters for position and size of the memory game.
   * @param {number} winCount Parameter for init position for the new memory window.
   * @param {number} x Number of elements in x-axis.
   * @param {number} y Number of elements in y-axis.
   */
  constructor (winCount, x, y) {
    this.newItem = document.createElement('div')
    this.newItem.classList.add('memory')
    this.newItem.setAttribute('draggable', 'true')

    const heading = document.createElement('h2')
    heading.textContent = 'Memory game'
    this.newItem.appendChild(heading)

    this.pics = []
    this.gameWon = false
    this.marked = 'none'
    this.activeButtons = true
    this.attempts = 0
    this.x = x
    this.y = y

    this.images = {
      1: image1,
      2: image2,
      3: image3,
      4: image4,
      5: image5,
      6: image6,
      7: image7,
      8: image8,
      9: image9,
      10: image10,
      11: image11,
      12: image12,
      13: image13,
      14: image14,
      15: image15,
      16: image16,
      17: image17
    }

    const closeButton = document.createElement('button')
    closeButton.id = 'closeButton'
    closeButton.textContent = 'X'

    this.newItem.style.position = 'absolute'
    this.newItem.style.top = 50 + (winCount * 20) + 'px'
    this.newItem.style.left = 50 + (winCount * 20) + 'px'

    closeButton.addEventListener('click', () => { // Close button
      this.newItem.remove()
    })
    this.newItem.appendChild(closeButton)

    this.newItem.addEventListener('click', () => { // Layer targeted window on top
      this.putOnTop()
    })

    this.newItem.addEventListener('drag', () => { // Layer targeted window on top
      this.putOnTop()
    })

    document.querySelector('main').appendChild(this.newItem)
    this.putOnTop()
    this.runGame()
    this.randomNumbers = this.randomizePictures()
    this.displayed = 0
    this.guesses = []
    this.completed = []
    this.correct = 0

    this.timer = new Timer()
    this.timerElement = document.createElement('div')
    this.timerElement.classList.add('timer')
    this.newItem.appendChild(this.timerElement)
    this.timer.start()

    setInterval(() => { // Starts, updates and stops the time and attempts presented to the player
      const currentTime = this.timer.time
      if (!this.gameWon) { this.timerElement.textContent = `Time: ${currentTime} seconds. Attempts: ${this.attempts}` }
    }, 0)

    document.addEventListener('keydown', (event) => { // Keystrokes for moving marker in between pictures
      this.movemarker(event)
    })
  }

  /**
   * Function for moving the marker use to navigate with the keyboard. Switchcase with 5 cases, 4 directions and select.
   * This will not be available during the "cooldown" timer after a guess, to prevent cheat/abuse of the rules and/or spamming.
   * @param {event} event We pass on the keydown event.
   */
  movemarker (event) {
    if (!this.gameWon && this.newItem.classList.contains('focused') && this.activeButtons) {
      const keyCode = event.code
      const gridItems = this.newItem.querySelectorAll('.grid-item')

      if (this.marked === 'none') {
        this.marked = 0
      }

      switch (keyCode) {
        case 'ArrowUp':
          if (this.marked < this.x) {
            this.marked += (this.y - 1) * this.x
          } else {
            this.marked -= this.x
          }
          break
        case 'ArrowDown':
          if (this.marked >= (this.x * this.y - this.x)) {
            this.marked -= (this.y - 1) * this.x
          } else {
            this.marked += this.x
          }
          break
        case 'ArrowLeft':
          if (this.marked % this.x === 0) {
            this.marked += (this.x - 1)
          } else {
            this.marked -= 1
          }
          break
        case 'ArrowRight':
          if (((this.marked + 1) % (this.x) === 0) && this.marked !== 0) {
            this.marked -= (this.x - 1)
          } else {
            this.marked += 1
          }
          break
        case 'Enter':
          event.preventDefault()
          this.guess(this.marked, event, false)
          break
        default:
          break
      }

      gridItems.forEach((item, index) => { // Displaying where the marker is
        if (index === this.marked) {
          item.style.borderColor = 'black'
        } else if (this.completed.includes(index)) {
          item.style.borderColor = 'transparent'
        } else {
          item.style.borderColor = '#ccc'
        }
      })
    }
  }

  /**
   * Layers the clicked window on top of all others.
   */
  putOnTop () {
    const windows = document.querySelectorAll('.chat, .memory, .paint')
    windows.forEach((window) => {
      window.style.zIndex = '1'
      window.classList.remove('focused')
    })
    this.newItem.style.zIndex = '2'
    this.newItem.classList.add('focused')
  }

  /**
   * Function for making the guess. Here we control the selection logic and from here we use checkIfCorrect() below to verify correctness.
   * Return is only for exiting function.
   * @param {number} ix Index of the guessed picture.
   * @param {event} event Even for clicking.
   * @param {boolean} mouse Boolean to indicate whether we use the mouse or not (then keyboard).
   */
  guess (ix, event, mouse) {
    if (this.completed.includes(ix)) { // Ignoring if we click on a completed picture
      return
    }
    this.guesses[this.displayed] = ix
    this.displayed += 1

    let clickedImage
    if (mouse) {
      clickedImage = event.target.closest('.grid-item').querySelector('img')
    } else {
      const gridItems = this.newItem.querySelectorAll('.grid-item img')
      clickedImage = gridItems[ix]
    }
    clickedImage.src = this.images[this.randomNumbers[ix]]
    console.log(clickedImage)
    if (this.displayed === 1) {
      this.pics[0] = clickedImage
    } else {
      this.pics[1] = clickedImage
      if (this.guesses[0] === this.guesses[1]) { // Ignoring if we click on same picture multiple times
        this.displayed = 1
        this.guesses[1] = undefined
        return
      }
      this.checkIfCorrect()
      this.guesses = []
      this.pics = []
      this.displayed = 0
    }
  }

  /**
   * Function for comparing the two selected pictures. Here we execute the timers for "pausing" / "holding" / "countdown"
   * after guessing the second time. Here we handle the display logic.
   */
  checkIfCorrect () {
    this.attempts += 1
    const img1 = this.pics[0]
    const img2 = this.pics[1]
    const gridItems = document.querySelectorAll('.grid-item')
    gridItems.forEach((item) => { // Deactivate click events during wait
      item.style.pointerEvents = 'none'
      this.activeButtons = false
    })
    if (this.randomNumbers[this.guesses[0]] !== this.randomNumbers[this.guesses[1]]) { // Incorrect
      setTimeout(() => { // Shows a red flash after 1 sec
        img1.src = Red
        img2.src = Red
        gridItems.forEach((item) => {
          item.style.pointerEvents = 'auto'
          this.activeButtons = true
        })
      }, 1000)
      setTimeout(() => { // Hides pictures after 1.2 seconds (0.2 after red flash starts)
        img1.src = Questionmark
        img2.src = Questionmark
        gridItems.forEach((item) => {
          item.style.pointerEvents = 'auto'
        })
      }, 1200)
    } else { // Correct
      this.completed[this.correct * 2] = this.guesses[0]
      this.completed[this.correct * 2 + 1] = this.guesses[1]
      this.correct += 1
      setTimeout(() => { // Removes completed pictures after 0.8 seconds
        img1.style.display = 'none'
        img2.style.display = 'none'
        img1.closest('.grid-item').style.borderColor = 'transparent'
        img2.closest('.grid-item').style.borderColor = 'transparent'
        this.activeButtons = true
        gridItems.forEach((item) => {
          item.style.pointerEvents = 'auto'
        })
      }, 800)
      if (this.correct === ((this.x * this.y) / 2)) {
        this.gameWon = true
        this.timer.stop()
        this.timerElement.textContent = `You did it! It took: ${this.timer.time} seconds and ${this.attempts} attempts`
      }
    }
  }

  /**
   * Function for initializing the grid and its content. That is, the pictures.
   */
  runGame () {
    const gridContainer = document.createElement('div')
    gridContainer.classList.add('grid-container')

    gridContainer.style.gridTemplateColumns = `repeat(${this.x}, 1fr)`
    gridContainer.style.gridTemplateRows = `repeat(${this.y}, 1fr)`

    for (let i = 0; i < (this.x * this.y); i++) {
      const gridItem = document.createElement('div')
      gridItem.classList.add('grid-item')

      const image = document.createElement('img')
      image.src = Questionmark

      gridItem.appendChild(image)
      gridContainer.appendChild(gridItem)

      const handleClick = (ix) => {
        return (event) => {
          this.guess(ix, event, true)
        }
      }
      gridItem.addEventListener('click', handleClick(i))
    }
    this.newItem.appendChild(gridContainer)
  }

  /**
   * Function for randomizing which pictures and their positioning in the grid.
   * @returns {Array} Array which is the base for the memory picture grid.
   */
  randomizePictures () {
    const indexArray = []
    for (let i = 0; i < ((this.x * this.y) / 2); i++) {
      let picIndex = Math.floor(Math.random() * ((this.x * this.y) + 1)) + 1
      while (indexArray.includes(picIndex)) {
        picIndex = Math.floor(Math.random() * ((this.x * this.y) + 1)) + 1
      }
      for (let j = 0; j < 2; j++) {
        let slot = Math.floor(Math.random() * (this.x * this.y))
        while (indexArray[slot] !== undefined) {
          slot = Math.floor(Math.random() * (this.x * this.y))
        }
        indexArray[slot] = picIndex
      }
    }
    return indexArray
  }
}
