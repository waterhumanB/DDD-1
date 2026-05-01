function Marker({ dir, isNext }) {
  const classes = [
    'edge-marker',
    `edge-marker--${dir}`,
    isNext ? 'edge-marker--next' : 'edge-marker--prev',
  ].join(' ')
  return (
    <div className={classes} aria-hidden="true">
      <span className={`edge-marker__arrow edge-marker__arrow--${dir}`} />
      <span className="edge-marker__label">{isNext ? 'NEXT' : 'BACK'}</span>
    </div>
  )
}

export default function EdgeMarkers({
  isCombatActive,
  nextDirection,
  prevDirection,
}) {
  if (isCombatActive) return null
  return (
    <>
      {nextDirection && <Marker dir={nextDirection} isNext={true} />}
      {prevDirection && <Marker dir={prevDirection} isNext={false} />}
    </>
  )
}
