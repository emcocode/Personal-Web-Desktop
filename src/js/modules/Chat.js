import ChatWebSocket from './ChatWebSocket.js'

/**
 * Chat class for the chat window.
 */
export default class Chat {
  static chatInstances = []

  /**
   * Constructor which inits buttons, listeners and other DOM elements.
   * @param {number} winCount Number which init position is based on.
   */
  constructor (winCount) {
    this.newItem = document.createElement('div')
    this.newItem.classList.add('chat')
    this.newItem.setAttribute('draggable', 'true')

    const heading = document.createElement('h2')
    heading.textContent = 'Chat'
    this.newItem.appendChild(heading)

    const uName = JSON.parse(window.localStorage.getItem('username'))

    const userNameDisplay = document.createElement('h4')
    userNameDisplay.id = 'userNameDisplay'
    this.newItem.appendChild(userNameDisplay)
    if (uName != null) {
      userNameDisplay.textContent = 'User: ' + uName
    }

    const closeButton = document.createElement('button')
    closeButton.id = 'closeButton'
    closeButton.textContent = 'X'
    this.newItem.appendChild(closeButton)

    const editButton = document.createElement('button')
    editButton.id = 'editButton'
    this.newItem.appendChild(editButton)
    this.editToggle = false

    const messageField = document.createElement('message')
    messageField.id = 'message'
    messageField.textContent = ''
    this.newItem.appendChild(messageField)

    this.newItem.style.position = 'absolute'
    this.newItem.style.top = 50 + (winCount * 20) + 'px'
    this.newItem.style.left = 450 + (winCount * 20) + 'px'

    closeButton.addEventListener('click', () => { // Close window listener
      this.newItem.remove()
      this.chatWebSocket.disconnect()
    })

    editButton.addEventListener('click', () => { // Edit username button listener
      if (!this.editToggle) {
        this.chatSectionDiv.style.display = 'none'
        this.createProfile()
      } else {
        if (JSON.parse(window.localStorage.getItem('username')) != null) {
          this.profile.style.display = 'none'
          this.editToggle = false
          this.chatSectionDiv.style.display = ''
        }
      }
    })

    this.newItem.addEventListener('click', () => { // Layer targeted window on top
      this.putOnTop()
    })

    this.newItem.addEventListener('drag', () => { // Layer targeted window on top
      this.putOnTop()
    })

    document.querySelector('main').appendChild(this.newItem)
    this.putOnTop()

    this.chatWebSocket = new ChatWebSocket(this)
    this.chatWebSocket.connect()

    if (uName === null) {
      this.createProfile()
    } else {
      this.chatSection()
    }
    Chat.chatInstances.push(this)
  }

  /**
   * Function that creates DOM elements for the chat section, buttons and its listeners.
   */
  chatSection () {
    this.chatSectionDiv = document.createElement('div')
    this.chatSectionDiv.classList.add('chatSection')
    this.newItem.appendChild(this.chatSectionDiv)

    const chatMessages = document.createElement('div')
    chatMessages.classList.add('chatMessages')
    this.chatSectionDiv.appendChild(chatMessages)

    const messageInput = document.createElement('textarea')
    messageInput.classList.add('messageInput')
    messageInput.style.resize = 'none'
    this.chatSectionDiv.appendChild(messageInput)

    const sendButton = document.createElement('button')
    sendButton.classList.add('sendButton')
    this.chatSectionDiv.appendChild(sendButton)

    const clearButton = document.createElement('button')
    clearButton.id = 'clearButton'
    this.newItem.appendChild(clearButton)

    sendButton.addEventListener('click', () => { // Send message listener
      const message = messageInput.value
      if (message) {
        messageInput.value = ''
        this.chatWebSocket.sendMessage(message, JSON.parse(window.localStorage.getItem('username')))
      }
    })

    messageInput.addEventListener('keydown', function (event) { // Textarea listener for ENTER (to send)
      if (event.key === 'Enter') {
        event.preventDefault()
        sendButton.click()
      }
    })

    clearButton.addEventListener('click', () => { // Listener for clear messages button
      while (chatMessages.firstChild) {
        chatMessages.removeChild(chatMessages.firstChild)
      }
    })
  }

  /**
   * Function used from ChatWebSocket to update the messages displayed when there are new sent from the server.
   * Here we present the sender, the message and the time of receiving the message.
   * @param {JSON} message Message elements containing sender, message etc.
   */
  updateMessages (message) {
    const messageContainer = document.createElement('div')
    messageContainer.classList.add('messageContainer')

    const usernameElement = document.createElement('div')
    usernameElement.textContent = message.username
    usernameElement.style.fontWeight = 'bold'
    messageContainer.appendChild(usernameElement)

    const currentTime = new Date()
    const timeString = currentTime.getHours().toString().padStart(2, '0') + ':' +
                        currentTime.getMinutes().toString().padStart(2, '0') + ':' +
                        currentTime.getSeconds().toString().padStart(2, '0')

    const messageElement = document.createElement('div')
    const timeSpan = document.createElement('span')
    timeSpan.textContent = timeString
    timeSpan.classList.add('messageTime')
    messageElement.appendChild(timeSpan)
    messageElement.append(message.data)
    messageContainer.appendChild(messageElement)

    messageContainer.classList.add('userMessage')
    this.chatSectionDiv.getElementsByClassName('chatMessages')[0].appendChild(messageContainer)

    const chatMessagesContainer = this.chatSectionDiv.getElementsByClassName('chatMessages')[0]
    chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight
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
   * Function for creating or editing the username. Here we make sure the message window isn´t displayed.
   */
  createProfile () {
    this.editToggle = true
    if (this.profile) {
      this.profile.remove()
    }

    this.profile = document.createElement('div')
    this.profile.classList.add('profile-container')
    this.newItem.appendChild(this.profile)

    const heading = document.createElement('h3')
    heading.textContent = 'Please enter your username'
    this.profile.appendChild(heading)

    const usernameInput = document.createElement('input')
    usernameInput.className = 'usernameInput'
    this.profile.appendChild(usernameInput)

    usernameInput.addEventListener('keydown', function (event) { // Listener for enter click
      if (event.key === 'Enter') {
        event.preventDefault()
        submitButton.click()
      }
    })

    const submitButton = document.createElement('button')
    submitButton.textContent = 'Submit'
    submitButton.id = 'profileSubmitButton'
    this.profile.appendChild(submitButton)

    const profileContainer = this.profile
    submitButton.addEventListener('click', () => { // Listener for clicking submit to set a (new) username
      const enteredUsername = usernameInput.value
      if (enteredUsername.length > 1 && enteredUsername.length < 15) {
        window.localStorage.setItem('username', JSON.stringify(enteredUsername))
        Chat.updateAllUsernames(enteredUsername)
        this.editToggle = false
        profileContainer.style.display = 'none'
        this.newItem.querySelector('#message').textContent = ''
        this.chatSection()
      } else {
        this.newItem.querySelector('#message').textContent = 'Username must be between 2-14 characters'
      }
    })
  }

  /**
   * Function for updating the username in all currently open windows.
   * @param {string} newUsername New username.
   */
  static updateAllUsernames (newUsername) {
    Chat.chatInstances.forEach(chatInstance => {
      const userNameDisplay = chatInstance.newItem.querySelector('#userNameDisplay')
      if (userNameDisplay) {
        userNameDisplay.textContent = 'User: ' + newUsername
      }
    })
  }
}
