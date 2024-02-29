/**
 * Class for the pain application window.
 */
export default class Paint {
  static paintInstances = []

  /**
   * Constructor for initializing the paint window. We init a bunch of DOM elements, such as buttons and listeners.
   * @param {number} winCount Value that init position is based on.
   */
  constructor (winCount) {
    this.newItem = document.createElement('div')
    this.newItem.classList.add('paint')
    this.newItem.setAttribute('draggable', 'true')

    const heading = document.createElement('h2')
    heading.textContent = 'Paint'
    this.newItem.appendChild(heading)

    const closeButton = document.createElement('button')
    closeButton.id = 'closeButton'
    closeButton.textContent = 'X'
    this.newItem.appendChild(closeButton)

    const brushSizeButton = document.createElement('button')
    brushSizeButton.id = 'brushSizeButton'
    this.newItem.appendChild(brushSizeButton)

    const brushColorButton = document.createElement('button')
    brushColorButton.id = 'brushColorButton'
    this.newItem.appendChild(brushColorButton)

    const erasorButton = document.createElement('button')
    erasorButton.id = 'erasorButton'
    this.newItem.appendChild(erasorButton)

    const clearPaintButton = document.createElement('button')
    clearPaintButton.id = 'clearPaintButton'
    this.newItem.appendChild(clearPaintButton)

    this.canvas = null
    this.context = null
    this.isPainting = false
    this.paintWidth = 2
    this.paintColor = 'black'
    this.paintSizeButtons = []
    this.paintColorButtons = []
    this.erasorButtons = []

    this.newItem.style.position = 'absolute'
    this.newItem.style.top = 50 + (winCount * 20) + 'px'
    this.newItem.style.left = 850 + (winCount * 20) + 'px'

    closeButton.addEventListener('click', () => { // Close button listener
      this.newItem.remove()
    })

    brushSizeButton.addEventListener('click', () => { // Brush Size Button listener
      this.hideColorButtons()
      this.hideErasorButtons()
      if (this.paintSizeButtons.length === 0) { // If its not already shown, we show options
        const brushSizeContainer = document.createElement('div')
        const brushSizes = [2, 4, 6, 8, 10, 12, 16, 20]
        brushSizes.forEach((size) => {
          const singleBrushSizeButton = document.createElement('button')
          singleBrushSizeButton.textContent = `${size}`
          singleBrushSizeButton.classList.add('singleBrushSizeConfigButton')

          singleBrushSizeButton.addEventListener('click', () => {
            this.paintWidth = size
            this.hideSizeButtons()
          })

          this.paintSizeButtons.push(singleBrushSizeButton)
          brushSizeButton.parentElement.insertBefore(singleBrushSizeButton, brushSizeButton.nextSibling)
          brushSizeContainer.appendChild(singleBrushSizeButton)
        })
        this.paintSectionDiv.appendChild(brushSizeContainer)
      } else { // If it already is open, we hide options
        this.hideSizeButtons()
      }
    })

    brushColorButton.addEventListener('click', () => { // Brush Color Button listener
      this.hideSizeButtons()
      this.hideErasorButtons()
      if (this.paintColorButtons.length === 0) { // If its not already shown, we show options
        const brushColorContainer = document.createElement('div')
        const brushColors = ['red', 'cyan', 'black', 'blue', 'green', 'yellow', 'purple', 'pink', 'lightgreen', 'orange']
        brushColors.forEach((color) => {
          const singleBrushColorButton = document.createElement('button')
          singleBrushColorButton.style.backgroundColor = `${color}`
          singleBrushColorButton.classList.add('singleBrushColorConfigButton')

          singleBrushColorButton.addEventListener('click', () => {
            this.paintColor = color
            this.hideColorButtons()
          })

          this.paintColorButtons.push(singleBrushColorButton)
          brushColorButton.parentElement.insertBefore(singleBrushColorButton, brushColorButton.nextSibling)
          brushColorContainer.appendChild(singleBrushColorButton)
        })
        this.paintSectionDiv.appendChild(brushColorContainer)
      } else { // If it already is open, we hide options
        this.hideColorButtons()
      }
    })

    erasorButton.addEventListener('click', () => { // Erasor Button listener
      this.hideSizeButtons()
      this.hideColorButtons()
      if (this.erasorButtons.length === 0) { // If its not already shown, we show options
        const erasorContainer = document.createElement('div')
        const erasorSizes = [2, 4, 6, 8, 10, 12, 16, 20, 32, 64]
        erasorSizes.forEach((size) => {
          const singleErasorSizeButton = document.createElement('button')
          singleErasorSizeButton.textContent = `${size}`
          singleErasorSizeButton.classList.add('singleErasorSizeConfigButton')

          singleErasorSizeButton.addEventListener('click', () => {
            this.paintWidth = size
            this.paintColor = 'white'
            this.hideErasorButtons()
          })

          this.erasorButtons.push(singleErasorSizeButton)
          erasorButton.parentElement.insertBefore(singleErasorSizeButton, erasorButton.nextSibling)
          erasorContainer.appendChild(singleErasorSizeButton)
        })
        this.paintSectionDiv.appendChild(erasorContainer)
      } else { // If it already is open, we hide options
        this.hideErasorButtons()
      }
    })

    clearPaintButton.addEventListener('click', () => { // Clear Paint Button listener
      this.hideSizeButtons()
      this.hideColorButtons()
      this.hideErasorButtons()
      if (this.context) {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
      }
    })

    this.newItem.addEventListener('click', () => { // Layer targeted window on top
      this.newItem.setAttribute('draggable', 'true')
      this.putOnTop()
    })

    this.newItem.addEventListener('drag', () => { // Layer targeted window on top
      this.newItem.setAttribute('draggable', 'true')
      this.putOnTop()
    })

    window.addEventListener('mouseup', () => { // Listener for if we drop the paint mouse outside the paint section
      this.isPainting = false
      this.newItem.setAttribute('draggable', 'true')
    })

    document.querySelector('main').appendChild(this.newItem)
    this.putOnTop()
    this.paintSection()
    Paint.paintInstances.push(this)
  }

  /**
   * Function for hiding all the size options.
   */
  hideSizeButtons () {
    this.paintSizeButtons.forEach((button) => {
      button.remove()
    })
    this.paintSizeButtons = []
  }

  /**
   * Function for hiding all color options.
   */
  hideColorButtons () {
    this.paintColorButtons.forEach((button) => {
      button.remove()
    })
    this.paintColorButtons = []
  }

  /**
   * Function for hiding all erasor size options.
   */
  hideErasorButtons () {
    this.erasorButtons.forEach((button) => {
      button.remove()
    })
    this.erasorButtons = []
  }

  /**
   * Function for creating the paint section with its drawing capabilities.
   */
  paintSection () {
    this.paintSectionDiv = document.createElement('div')
    this.paintSectionDiv.classList.add('paintSection')
    this.newItem.appendChild(this.paintSectionDiv)

    this.paintSectionDiv.addEventListener('mousedown', (event) => { // Listener for starting to paint
      event.stopPropagation()
      this.newItem.setAttribute('draggable', 'false')
      this.isPainting = true
      this.putOnTop()

      this.context.beginPath()
      this.context.moveTo(event.offsetX, event.offsetY)

      this.context.strokeStyle = this.paintColor
      this.context.lineWidth = this.paintWidth
    })

    this.canvas = document.createElement('canvas')
    this.canvas.width = this.paintSectionDiv.clientWidth
    this.canvas.height = this.paintSectionDiv.clientHeight
    this.paintSectionDiv.appendChild(this.canvas)

    this.context = this.canvas.getContext('2d')

    this.canvas.addEventListener('mousemove', (event) => { // Listener for moving the mouse to paint
      if (this.isPainting) {
        this.context.lineTo(event.offsetX, event.offsetY)
        this.context.stroke()
      }
    })

    this.paintSectionDiv.addEventListener('mouseleave', () => { // Listener for if we leave paintsection, then stop painting
      if (this.isPainting) {
        this.isPainting = false
        this.newItem.setAttribute('draggable', 'true')
      }
    })
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
}
