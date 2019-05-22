import React, { useState, useEffect } from 'react'
import '../css/GamePage.css'

export default props => {
  const [chatMessages, setChatMessages] = useState([])
  const [chatInputValue, setChatInputValue] = useState('')

  useEffect(() => {
    props.socket.on('chat-update', (chatMessages) => {
      setChatMessages(chatMessages)
      const chatDiv = document.getElementsByClassName('messages')[0]
      chatDiv.scrollTop = chatDiv.scrollHeight
    })

    props.socket.emit('get-chat-history')
  }, [])

  const sendMessage = (e) => {
    e.preventDefault()
    if (chatInputValue && chatInputValue.length <= 128) {
      props.socket.emit('chat', {
        name: props.playerName,
        message: chatInputValue
      })
    }
    setChatInputValue('')
  }

  return (
    <div className='chatContainer'>
      <div className='messages'>
        {chatMessages.map((message, index) => {
          return 'isSystem' in message && message.isSystem
            ? <p key={index} style={{ color: 'red' }}>
              🎨 {message.message}
            </p>
            : <p key={index}>
              {message.name}: {message.message}
            </p>
        })}
      </div>
      <form id="chat-input" onSubmit={sendMessage} >
        <input
          type="text"
          placeholder='Chat here... 128 char limit'
          onChange={(e) => { setChatInputValue(e.target.value) }}
          value={chatInputValue}
        />
        <input type="submit" value="Send"/>
      </form>
    </div>
  )
}
