export default function Hud({ floor, sceneIndex, totalScenes, muted, onToggleMute }) {
  return (
    <>
      <div className="hud">
        <span className="hud__panel">QUEST LOG</span>
        <span className="hud__panel">
          {floor} · {sceneIndex + 1}/{totalScenes}
        </span>
        <button
          type="button"
          className="hud__panel hud__mute"
          data-nav-skip="true"
          onClick={onToggleMute}
          aria-pressed={muted}
          aria-label={muted ? '소리 켜기' : '소리 끄기'}
        >
          {muted ? 'SOUND OFF' : 'SOUND ON'}
        </button>
      </div>
      <a
        className="attribution"
        href="https://game-icons.net"
        target="_blank"
        rel="noopener noreferrer"
        data-nav-skip="true"
      >
        Icons by game-icons.net (CC BY 3.0)
      </a>
    </>
  )
}
