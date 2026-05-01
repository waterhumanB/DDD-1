export default function NavHint({ isCombatActive }) {
  if (isCombatActive) return null
  return (
    <div className="nav-hint" aria-hidden="true">
      <div className="nav-hint__desktop">
        <div className="nav-hint__pad">
          <span className="nav-hint__row">
            <span className="nav-hint__cell" />
            <span className="nav-hint__cell">▲</span>
            <span className="nav-hint__cell" />
          </span>
          <span className="nav-hint__row">
            <span className="nav-hint__cell">◀</span>
            <span className="nav-hint__cell nav-hint__cell--center">·</span>
            <span className="nav-hint__cell">▶</span>
          </span>
          <span className="nav-hint__row">
            <span className="nav-hint__cell" />
            <span className="nav-hint__cell">▼</span>
            <span className="nav-hint__cell" />
          </span>
        </div>
        <span className="nav-hint__label">ARROW KEYS</span>
      </div>
      <div className="nav-hint__mobile">
        <span className="nav-hint__zone nav-hint__zone--left">◀ TAP</span>
        <span className="nav-hint__zone nav-hint__zone--right">TAP ▶</span>
      </div>
    </div>
  )
}
