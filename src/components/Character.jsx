import { forwardRef } from 'react'
import PixelCharacter from './PixelCharacter'

const Character = forwardRef(function Character({ characterClass }, ref) {
  return (
    <div
      ref={ref}
      className={`character character--${characterClass}`}
      aria-hidden="true"
    >
      <PixelCharacter characterClass={characterClass} />
    </div>
  )
})

export default Character
