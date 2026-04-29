export default function CombatPrompt({ isActive, currentHp, maxHp }) {
  const safeMax = Math.max(0, maxHp ?? 0)
  const safeHp = Math.max(0, currentHp ?? 0)
  const combo = Math.max(0, safeMax - safeHp)

  return (
    <div className={`combat-prompt ${isActive ? 'is-active' : ''}`}>
      <div className="combat-prompt__title">공격하세요</div>
      <div className="combat-prompt__combo">COMBO x{combo}</div>
      <div className="combat-prompt__pips" aria-hidden="true">
        {Array.from({ length: safeMax }).map((_, index) => (
          <span key={index} className={index < safeHp ? 'is-live' : 'is-hit'} />
        ))}
      </div>
      <div className="combat-prompt__desktop">PRESS SPACE</div>
      <div className="combat-prompt__mobile">TAP SCREEN</div>
    </div>
  )
}
