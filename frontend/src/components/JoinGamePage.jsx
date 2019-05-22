import React, { useState, useEffect } from 'react'
import '../css/JoinGamePage.css'
import GamePage from './GamePage.jsx'
import socketConnect from '../utils/SocketConnect'
const socket = socketConnect()

export default () => {
  const [validRoomCode, setValidRoomCode] = useState(false)
  const [incorrectRoomEntered, setIncorrectRoomEntered] = useState(false)
  const [formState, setFormState] = useState({ roomId: '', name: '' })

  useEffect(() => {
    socket.on('room-does-not-exist', () => {
      setValidRoomCode(false)
      setIncorrectRoomEntered(true)
    })

    socket.on('confirm-valid-room-code', () => {
      setValidRoomCode({ validRoomCode: true })
    })

    return () => { socket.disconnect() }
  }, [])

  const handleChange = (e) => {
    setFormState({ ...formState, [e.target.name]: e.target.value.trim() })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    socket.emit('join-room', { roomId: formState.roomId, name: formState.name })
  }

  if (validRoomCode) {
    return <GamePage roomId={formState.roomId} socket={socket} playerName={formState.name}/>
  }

  return (
    <div className='joinGameContainer'>
      <form onSubmit={handleSubmit}>
        {incorrectRoomEntered
          ? <p>Invalid room code Entered. Please double check and try again</p>
          : <p>Enter your room code below</p>}
        <input name="name" type='text' placeholder='Enter your name' onChange={handleChange}/>
        <input name="roomId" type='text' placeholder='Enter room code' onChange={handleChange}/>
        <input type="submit" value="Join" disabled={!formState.name || !formState.roomId}/>
      </form>
    </div>
  )
}
