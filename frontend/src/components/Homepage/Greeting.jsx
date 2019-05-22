import * as React from 'react'
import '../../css/Greeting.css'
import pencilSvg from '../../images/pencil.svg'

export default function Greeting () {
  return (
    <div className="greetingContainer">
      <h1>Drawing With Friends</h1>
      <img src={pencilSvg} alt="Pencil image" className="pencilImage"/>
    </div>
  )
}
