import Chat from './modules/Chat.js'
import Movement from './modules/Movement.js'
import Memory from './modules/Memory.js'
import Paint from './modules/Paint.js'

const move = new Movement()
move.move()

let memoryWindowCount = 0
let chatWindowCount = 0
let paintWindowCount = 0

// State buttons
const memoryButton = document.getElementById('memoryButton')
const chatButton = document.getElementById('chatButton')
const paintButton = document.getElementById('paintButton')
let memoryConfigButtons = []

memoryButton.addEventListener('click', function () { // Memory game button listener
  if (memoryConfigButtons.length === 0) { // When button currently is NOT active, we show sub-buttons
    const gameConfigurations = [{ x: 4, y: 4 }, { x: 2, y: 4 }, { x: 2, y: 2 }]
    gameConfigurations.forEach((config) => {
      const newMemoryButton = document.createElement('button')
      newMemoryButton.textContent = `${config.x}x${config.y}`
      newMemoryButton.classList.add('memoryConfigButton')

      newMemoryButton.addEventListener('click', () => { // We create our selected size memory game
        const memory = new Memory(memoryWindowCount++, config.x, config.y)
        move.addDraggableElement(memory.newItem)
      })

      memoryConfigButtons.push(newMemoryButton)
      memoryButton.parentElement.insertBefore(newMemoryButton, memoryButton.nextSibling)
    })
  } else { // When button currently IS active, we hide sub-buttons
    memoryConfigButtons.forEach((button) => {
      button.remove()
    })
    memoryConfigButtons = []
  }
})

chatButton.addEventListener('click', () => { // Chat button listener
  const chat = new Chat(chatWindowCount++)
  move.addDraggableElement(chat.newItem)
})

paintButton.addEventListener('click', () => { // Paint button listener
  const paint = new Paint(paintWindowCount++)
  move.addDraggableElement(paint.newItem)
})
