export default function BossChallengeButton({ visible, onChallenge, label = '도전하기' }) {
  if (!visible) return null
  return (
    <div className="boss-challenge" role="dialog" aria-modal="false">
      <button
        type="button"
        className="boss-challenge__btn"
        data-nav-skip="true"
        onClick={onChallenge}
      >
        <span className="boss-challenge__shine" aria-hidden="true" />
        <span className="boss-challenge__label">{label}</span>
        <span className="boss-challenge__sparkle" aria-hidden="true">✦</span>
      </button>
      <div className="boss-challenge__hint">▶ 보스를 소환합니다</div>
    </div>
  )
}
