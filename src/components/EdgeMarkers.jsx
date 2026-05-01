const ARROW = { left: '◀', right: '▶', up: '▲', down: '▼' }

function Marker({ dir, isActive, isNext, characterX, characterY }) {
  let proximity = false
  if (dir === 'left') proximity = characterX < 0.18
  else if (dir === 'right') proximity = characterX > 0.82
  else if (dir === 'up') proximity = characterY < 0.18
  else if (dir === 'down') proximity = characterY > 0.82

  const classes = [
    'edge-marker',
    `edge-marker--${dir}`,
    isNext ? 'edge-marker--next' : 'edge-marker--prev',
    proximity ? 'is-active' : '',
  ].filter(Boolean).join(' ')

  return (
    <div className={classes} aria-hidden="true">
      <span className="edge-marker__arrow">{ARROW[dir]}</span>
      <span className="edge-marker__label">{isNext ? 'NEXT' : 'BACK'}</span>
    </div>
  )
}

export default function EdgeMarkers({
  isCombatActive,
  nextDirection,
  prevDirection,
  characterX = 0.5,
  characterY = 0.85,
}) {
  if (isCombatActive) return null
  return (
    <>
      {nextDirection && (
        <Marker
          dir={nextDirection}
          isNext={true}
          characterX={characterX}
          characterY={characterY}
        />
      )}
      {prevDirection && (
        <Marker
          dir={prevDirection}
          isNext={false}
          characterX={characterX}
          characterY={characterY}
        />
      )}
    </>
  )
}
