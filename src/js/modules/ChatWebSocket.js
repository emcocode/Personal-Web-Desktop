/**
 * Web Socket class for handling the web api communication.
 */
export default class ChatWebSocket {
  /**
   * Constructor that inits the Web Socket object with the server address.
   * @param {*} chat Chat element.
   */
  constructor (chat) {
    this.url = 'wss://courselab.lnu.se/message-app/socket'
    this.socket = null
    this.chat = chat
  }

  /**
   * Function for establishing a connection to the server.
   */
  connect () {
    this.socket = new WebSocket(this.url)
    this.socket.onopen = () => {
      console.log('WebSocket connection successfully established')
    }

    // Receive a message from the server. Send it to Chat.js if it is from a user.
    // Otherwise we just print in the console (heartbeats for example.)
    this.socket.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data)
        if (msg.type === 'message') {
          console.log('Message from user "' + msg.username + '": ' + msg.data)
          this.chat.updateMessages(msg)
        } else if (msg.type === 'heartbeat') {
          console.log('Heartbeat')
        } else {
          console.log('Message from server:', msg.data)
        }
      } catch (error) {
        console.log('Something went wrong with parsing message', error)
      }
    }

    this.socket.onerror = (error) => { // Error message in console
      console.error('WebSocket error:', error)
    }

    this.socket.onclose = () => { // Close message in console
      console.log('WebSocket connection closed.')
    }
  }

  /**
   * Function for sending a message to the server. Key is predefined, and so is the channel (I haven´t implemented selection)
   * @param {string} messageText Message as a string.
   * @param {string} username Senders username.
   */
  sendMessage (messageText, username) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      const message = {
        type: 'message',
        data: messageText,
        username,
        channel: 'my, not so secret, channel',
        key: 'eDBE76deU7L0H9mEBgxUKVR0VCnq0XBd'
      }
      console.log('Sending message:', messageText)
      this.socket.send(JSON.stringify(message))
    } else {
      console.error('WebSocket is not connected.')
    }
  }

  /**
   * Disconnect and close the connection to the server.
   */
  disconnect () {
    if (this.socket) {
      this.socket.close()
    }
  }
}
