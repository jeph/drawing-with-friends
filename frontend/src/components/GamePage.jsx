import React, { useState, useEffect } from 'react'
import Canvas from './Canvas/CanvasWrapper.jsx'
import '../css/GamePage.css'
import Chat from './Chat.jsx'
import { Redirect } from 'react-router-dom'
import playerComparator from '../utils/PlayersComparator'

export default props => {
  const [goHome, setGoHome] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(true)
  const [gameState, setGameState] = useState({ players: [], drawer: {} })
  const [timeRemaining, setTimeRemaining] = useState(0)

  useEffect(() => {
    props.socket.on('timer-update', (timeRemaining) => {
      setTimeRemaining(timeRemaining)
    })

    props.socket.on('game-update', (gameState) => {
      setGameState(gameState)
    })

    props.socket.emit('get-game-update')
  }, [])

  const closeModal = () => {
    setIsModalOpen(false)
  }

  const startGame = e => {
    e.preventDefault()
    props.socket.emit('start-game')
  }

  const showModal = () => {
    return (
      <div className='instructionsModal'>
        <div className='instructionsModalContent'>
          <h4>{`What's This?`}</h4>
          <p>This is the staging area where you can wait for your friends to join.</p>
          <p>{`Once the room has three players (including yourself), any one can press "Start Game" to start!`}</p>
          <button onClick={closeModal}>Got it!</button>
        </div>
      </div>
    )
  }

  const renderWinners = () => {
    return (
      <ol>
        {gameState.players
          .sort(playerComparator)
          .filter((player, index) => index < 3)
          .map((player) => {
            return <li key={player.playerId}>{player.name}: {player.score}</li>
          })}
      </ol>
    )
  }

  const showWinners = () => {
    return (
      <div className='instructionsModal'>
        <div className='instructionsModalContent'>
          <h4>{`Game Over!`}</h4>
          <p>Here are the winners:</p>
          {renderWinners()}
          <button onClick={() => setGoHome(true)}>Play Again</button>
        </div>
      </div>
    )
  }

  const renderMessageBar = () => {
    const { currentWord, drawer, isGameStarted } = gameState
    return isGameStarted && drawer
      ? drawer.playerId === props.socket.id
        ? <h4>You are drawing: {currentWord}</h4>
        : <h4>{drawer.name} is currently drawing</h4>
      : <h4>Share this code with your friends: {props.roomId}</h4>
  }

  const renderDrawerIcon = playerId => {
    return gameState.drawer && playerId === gameState.drawer.playerId ? '🖌️' : ''
  }

  const renderPlayers = () => {
    return gameState.players.sort(playerComparator).map((player) => {
      return gameState.isGameStarted
        ? <p key={player.playerId}>{renderDrawerIcon(player.playerId)} {player.name}: {player.score}</p>
        : <p key={player.playerId}>{player.name}</p>
    })
  }

  const renderStartButton = () => {
    return !gameState.isGameStarted ? <button onClick={startGame}>Start Game</button> : ''
  }

  const renderTimer = () => {
    return timeRemaining > 0 ? `Time Left: ${timeRemaining}` : ''
  }

  return (
    <>
      {isModalOpen ? showModal() : ''}
      {gameState.isGameOver ? showWinners() : ''}
      {goHome ? <Redirect to="/"/> : ''}
      <div className='gamePageContainer'>
        {renderMessageBar()}
        <div className='canvasContainer'>
          <Canvas socket={props.socket}/>
        </div>
        <Chat socket={props.socket} playerName={props.playerName}/>
        <div className='playerList'>
          <div className='playerNames'>
            {renderPlayers()}
          </div>
          {renderStartButton()}
        </div>
        <h4>{renderTimer()}</h4>
      </div>
    </>
  )
}
