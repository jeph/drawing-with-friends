import React, { useEffect } from 'react'
import P5 from 'p5'
import canvas from './DrawingCanvas.js'

export default React.memo((props) => {
  useEffect(() => {
    const newCanvas = new P5(canvas(props.socket), 'canvas')
    return () => newCanvas.remove()
  }, [])

  return (
    <div id="canvas"/>
  )
}, () => true)
