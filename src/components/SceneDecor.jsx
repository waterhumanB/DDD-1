// 씬별 분위기 장식 — 횃불, 별 등.
// 데이터로 정의 가능한 단순 장식만. 캐릭터/씬 텍스트와 분리.

const SCENE_DECOR = {
  hometown: { torches: true, stars: 12 },
  library:  { torches: true, stars: 0 },
  tower:    { torches: false, stars: 80 },
  boss:     { torches: true, stars: 0 },
  ai:       { torches: false, stars: 60 },
  final:    { torches: false, stars: 0 },
}

// 씬당 별 위치를 시드 기반으로 안정적 생성 (리렌더 시 위치 안 흔들림)
function pseudoRandom(seed) {
  let s = seed
  return () => {
    s = (s * 9301 + 49297) % 233280
    return s / 233280
  }
}

function Stars({ count, seedKey }) {
  if (count === 0) return null
  const rand = pseudoRandom(
    [...seedKey].reduce((a, c) => a + c.charCodeAt(0), 0)
  )
  const stars = Array.from({ length: count }).map((_, i) => {
    const top = (rand() * 70).toFixed(1)
    const left = (rand() * 100).toFixed(1)
    const delay = (rand() * 2).toFixed(2)
    return (
      <span
        key={i}
        style={{
          top: `${top}%`,
          left: `${left}%`,
          animationDelay: `${delay}s`,
        }}
      />
    )
  })
  return <div className="stars">{stars}</div>
}

export default function SceneDecor({ sceneId }) {
  const decor = SCENE_DECOR[sceneId]
  if (!decor) return null

  return (
    <>
      {decor.torches && (
        <>
          <div className="torch torch--left" />
          <div className="torch torch--right" />
        </>
      )}
      {decor.stars > 0 && <Stars count={decor.stars} seedKey={sceneId} />}
    </>
  )
}
