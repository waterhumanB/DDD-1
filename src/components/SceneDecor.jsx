import { memo } from 'react'

// 씬별 분위기 장식 — 횃불, 별 등.
// 데이터로 정의 가능한 단순 장식만. 캐릭터/씬 텍스트와 분리.

const SCENE_DECOR = {
  'stage-01-village':         { torches: true,  stars: 14 },
  'stage-02-forest':          { torches: false, stars: 0 },
  'stage-03-unicorn':         { torches: false, stars: 60 },
  'stage-04-guild':           { torches: true,  stars: 0 },
  'stage-05-cave-entrance':   { torches: true,  stars: 0 },
  'stage-06-cave-bugs':       { torches: true,  stars: 0 },
  'stage-07-forge':           { torches: true,  stars: 0 },
  'stage-08-broken-bridge':   { torches: false, stars: 36 },
  'stage-09-giant-boss':      { torches: true,  stars: 0 },
  'stage-10-mist-forest':     { torches: false, stars: 70 },
  'stage-11-dragon-mountain': { torches: false, stars: 90 },
  'stage-12-dragon-nest':     { torches: true,  stars: 0 },
  'stage-13-dragon-fight':    { torches: true,  stars: 0 },
  'stage-14-hero-awaken':     { torches: false, stars: 100 },
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

function SceneDecor({ sceneId }) {
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

export default memo(SceneDecor)
