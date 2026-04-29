export default function BattleOverlay({ isCombatActive, attackTrigger }) {
  return (
    <div
      key={`battle-${attackTrigger}`}
      className={`battle-overlay ${isCombatActive ? 'is-active' : ''} ${
        attackTrigger > 0 ? 'is-impact' : ''
      }`}
      aria-hidden="true"
    />
  )
}
