/**
 * Class for managing movement of the windows.
 */
export default class Movement {
  /**
   * Function for detecting and moving drag objects.
   */
  move () {
    const draggableElements = document.querySelectorAll('.item')
    const dropZone = document.querySelector('main')

    draggableElements.forEach((draggableElement) => {
      draggableElement.addEventListener('dragstart', (event) => {
        const style = window.getComputedStyle(event.target, null)
        const offsetX = parseInt(style.getPropertyValue('left'), 10) - event.clientX
        const offsetY = parseInt(style.getPropertyValue('top'), 10) - event.clientY

        event.dataTransfer.setData('text/plain', '')
        event.target.classList.add('dragging')
        event.dataTransfer.setData('application/json', JSON.stringify({ offsetX, offsetY }))
      })
    })

    dropZone.addEventListener('dragover', (event) => { // Ensure a valid dropzone
      event.preventDefault()
    })

    dropZone.addEventListener('dragenter', (event) => { // Ensure a valid dropzone
      event.preventDefault()
    })

    dropZone.addEventListener('drop', (event) => { // Drop current element
      event.preventDefault()

      const droppedElement = document.querySelector('.dragging')
      if (droppedElement) {
        const data = JSON.parse(event.dataTransfer.getData('application/json'))
        const posX = event.clientX - dropZone.getBoundingClientRect().left - data.offsetX
        const posY = event.clientY - dropZone.getBoundingClientRect().top - data.offsetY

        droppedElement.style.left = posX + (2 * data.offsetX) + 'px'
        droppedElement.style.top = posY + (2 * data.offsetY) + 'px'

        droppedElement.classList.remove('dragging')
      }
    })
  }

  /**
   * Add a created element to allow it to be dragged.
   * @param {*} element Memory/chat/paint window element.
   */
  addDraggableElement (element) {
    element.addEventListener('dragstart', (event) => {
      const style = window.getComputedStyle(event.target, null)
      const offsetX = parseInt(style.getPropertyValue('left'), 10) - event.clientX
      const offsetY = parseInt(style.getPropertyValue('top'), 10) - event.clientY

      event.dataTransfer.setData('text/plain', '')
      event.target.classList.add('dragging')
      event.dataTransfer.setData('application/json', JSON.stringify({ offsetX, offsetY }))
    })
  }
}
