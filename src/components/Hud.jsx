export default function Hud({ floor, sceneIndex, totalScenes }) {
  return (
    <div className="hud">
      <span className="hud__panel">QUEST LOG</span>
      <span className="hud__panel">
        {floor} · {sceneIndex + 1}/{totalScenes}
      </span>
    </div>
  )
}
