import React, { useState, useEffect } from 'react'
import '../css/CreateGamePage.css'
import GamePage from './GamePage.jsx'
import socketConnect from '../utils/SocketConnect'
import generateCode from '../utils/GenerateCode'
const socket = socketConnect()

export default () => {
  const [roomCode, setRoomCode] = useState(generateCode())
  const [validRoomCode, setValidRoomCode] = useState(false)
  const [name, setName] = useState('')

  useEffect(() => {
    socket.on('room-already-exists', () => {
      setRoomCode(generateCode())
      socket.emit('create-room', { roomId: roomCode, name: name })
    })

    socket.on('confirm-valid-room-code', () => {
      setValidRoomCode(true)
    })
    return () => { socket.disconnect() }
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    socket.emit('create-room', { roomId: roomCode, name: name })
  }

  return (
    validRoomCode
      ? <GamePage roomId={roomCode} socket={socket} playerName={name}/>
      : <div className='createGameContainer'>
        <form onSubmit={handleSubmit} className='createGameForm'>
          <input type='text' placeholder='Enter your name' onChange={(e) => { setName(e.target.value.trim()) }}/>
          <input type="submit" value="Create" disabled={!name} />
        </form>
      </div>
  )
}
