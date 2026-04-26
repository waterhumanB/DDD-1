// 12x16 픽셀 그리드 SVG 캐릭터 — 진화 시스템.
// 각 캐릭터는 level prop을 받아 단계별로 외형이 강해진다.

const palette = {
  outline: '#0a0612',
  skin: '#f4c79a',
  skinDark: '#c89570',
  hero:        { body: '#a87a4f', accent: '#5a3a1e', detail: '#fff' },
  marketer:    { body: '#6c4ab8', accent: '#3d2370', detail: '#ffd54a' },
  coder:       { body: '#3da06d', accent: '#1f5a3a', detail: '#8aa9ff' },
  trainer:     { body: '#ff5577', accent: '#a01030', detail: '#ffd54a' },
  ai:          { body: '#d63d8a', accent: '#7a1f50', detail: '#6bff9a' },
  fallen:      { body: '#7a2030', accent: '#3d0e18', detail: '#ff5577' },
}

const Pixel = ({ x, y, w = 1, h = 1, fill, opacity }) => (
  <rect x={x} y={y} width={w} height={h} fill={fill} opacity={opacity} />
)

function BaseBody({ skin = palette.skin, outline = palette.outline }) {
  return (
    <>
      <Pixel x={3} y={1} w={6} h={5} fill={skin} />
      <Pixel x={3} y={1} w={6} h={1} fill={outline} />
      <Pixel x={2} y={2} w={1} h={3} fill={outline} />
      <Pixel x={9} y={2} w={1} h={3} fill={outline} />
      <Pixel x={4} y={3} w={1} h={1} fill={outline} />
      <Pixel x={7} y={3} w={1} h={1} fill={outline} />
      <Pixel x={5} y={4} w={2} h={1} fill={outline} />
      <Pixel x={5} y={6} w={2} h={1} fill={palette.skinDark} />
      <Pixel x={1} y={8} w={1} h={4} fill={outline} />
      <Pixel x={10} y={8} w={1} h={4} fill={outline} />
      <Pixel x={4} y={13} w={1} h={3} fill={outline} />
      <Pixel x={7} y={13} w={1} h={3} fill={outline} />
      <Pixel x={3} y={15} w={2} h={1} fill={outline} />
      <Pixel x={7} y={15} w={2} h={1} fill={outline} />
    </>
  )
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// HERO — 6단계 진화
// L1: 평민 / L2: 견습 / L3: 모험가 / L4: 전사 / L5: 정예 / L6: 용사·왕
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function HeroExtras({ level = 1 }) {
  const c = palette.hero
  return (
    <>
      {/* 머리 / 헬멧 / 왕관 */}
      {level < 4 && (
        <>
          <Pixel x={3} y={1} w={6} h={1} fill={c.accent} />
          <Pixel x={2} y={2} w={1} h={1} fill={c.accent} />
          <Pixel x={9} y={2} w={1} h={1} fill={c.accent} />
        </>
      )}
      {level >= 4 && level < 6 && (
        <>
          <Pixel x={2} y={0} w={8} h={2} fill="#888" />
          <Pixel x={2} y={2} w={1} h={2} fill="#888" />
          <Pixel x={9} y={2} w={1} h={2} fill="#888" />
          <Pixel x={5} y={0} w={2} h={1} fill="#ffd54a" />
        </>
      )}
      {level >= 6 && (
        <>
          <Pixel x={3} y={-1} w={6} h={1} fill="#ffd54a" />
          <Pixel x={3} y={0} w={1} h={1} fill="#ffd54a" />
          <Pixel x={5} y={-2} w={2} h={1} fill="#ffd54a" />
          <Pixel x={8} y={0} w={1} h={1} fill="#ffd54a" />
          <Pixel x={4} y={-1} w={1} h={1} fill="#ff5577" />
          <Pixel x={7} y={-1} w={1} h={1} fill="#ff5577" />
          <Pixel x={3} y={1} w={6} h={1} fill={palette.outline} />
        </>
      )}

      {/* 옷 / 갑옷 */}
      {level === 1 && (
        <>
          <Pixel x={2} y={7} w={8} h={6} fill={c.body} />
          <Pixel x={2} y={7} w={8} h={1} fill={c.accent} />
          <Pixel x={5} y={9} w={1} h={1} fill={c.detail} />
          <Pixel x={5} y={11} w={1} h={1} fill={c.detail} />
          <Pixel x={3} y={13} w={6} h={2} fill={c.accent} />
        </>
      )}
      {level === 2 && (
        <>
          <Pixel x={2} y={7} w={8} h={6} fill={c.body} />
          <Pixel x={2} y={7} w={8} h={1} fill={c.accent} />
          <Pixel x={3} y={7} w={2} h={6} fill={c.accent} />
          <Pixel x={7} y={7} w={2} h={6} fill={c.accent} />
          <Pixel x={5} y={9} w={1} h={1} fill={c.detail} />
          <Pixel x={3} y={13} w={6} h={2} fill={c.accent} />
        </>
      )}
      {level === 3 && (
        <>
          <Pixel x={2} y={7} w={8} h={6} fill="#5a3a1e" />
          <Pixel x={2} y={7} w={8} h={1} fill="#3d2410" />
          <Pixel x={1} y={7} w={2} h={2} fill="#3d2410" />
          <Pixel x={9} y={7} w={2} h={2} fill="#3d2410" />
          <Pixel x={5} y={9} w={2} h={2} fill="#ffd54a" />
          <Pixel x={3} y={13} w={6} h={2} fill="#3d2410" />
        </>
      )}
      {level === 4 && (
        <>
          <Pixel x={2} y={7} w={8} h={6} fill="#aaa" />
          <Pixel x={2} y={7} w={8} h={1} fill="#555" />
          <Pixel x={1} y={7} w={2} h={3} fill="#555" />
          <Pixel x={9} y={7} w={2} h={3} fill="#555" />
          <Pixel x={5} y={9} w={2} h={2} fill="#ffd54a" />
          <Pixel x={3} y={13} w={6} h={2} fill="#555" />
        </>
      )}
      {level === 5 && (
        <>
          <Pixel x={0} y={6} w={1} h={9} fill="#aa1530" />
          <Pixel x={11} y={6} w={1} h={9} fill="#aa1530" />
          <Pixel x={2} y={7} w={8} h={6} fill="#cdd2e0" />
          <Pixel x={2} y={7} w={8} h={1} fill="#7080a0" />
          <Pixel x={1} y={7} w={2} h={3} fill="#7080a0" />
          <Pixel x={9} y={7} w={2} h={3} fill="#7080a0" />
          <Pixel x={5} y={9} w={2} h={2} fill="#ff5577" />
          <Pixel x={3} y={13} w={6} h={2} fill="#7080a0" />
        </>
      )}
      {level >= 6 && (
        <>
          <Pixel x={0} y={6} w={1} h={9} fill="#6c8aff" />
          <Pixel x={11} y={6} w={1} h={9} fill="#6c8aff" />
          <Pixel x={2} y={7} w={8} h={6} fill="#ffd54a" />
          <Pixel x={2} y={7} w={8} h={1} fill="#c81e5a" />
          <Pixel x={1} y={7} w={2} h={3} fill="#c81e5a" />
          <Pixel x={9} y={7} w={2} h={3} fill="#c81e5a" />
          <Pixel x={5} y={9} w={2} h={2} fill="#fff" />
          <Pixel x={5} y={9} w={1} h={1} fill="#ff5577" />
          <Pixel x={3} y={13} w={6} h={2} fill="#c81e5a" />
        </>
      )}

      {/* 무기 (오른손) — Lv2부터 점점 큼 */}
      {level === 2 && (
        <>
          <Pixel x={11} y={9} w={1} h={1} fill="#aaa" />
          <Pixel x={11} y={10} w={1} h={1} fill="#7a3a1e" />
        </>
      )}
      {level === 3 && (
        <>
          <Pixel x={11} y={7} w={1} h={3} fill="#bbb" />
          <Pixel x={10} y={10} w={2} h={1} fill="#7a3a1e" />
        </>
      )}
      {level === 4 && (
        <>
          <Pixel x={11} y={5} w={1} h={5} fill="#ddd" />
          <Pixel x={10} y={10} w={2} h={1} fill="#444" />
        </>
      )}
      {level === 5 && (
        <>
          <Pixel x={11} y={4} w={1} h={6} fill="#fff" />
          <Pixel x={10} y={10} w={2} h={1} fill="#7080a0" />
          <Pixel x={11} y={3} w={1} h={1} fill="#ffd54a" />
        </>
      )}
      {level >= 6 && (
        <>
          <Pixel x={11} y={3} w={1} h={7} fill="#fff" />
          <Pixel x={11} y={2} w={1} h={1} fill="#ffd54a" />
          <Pixel x={10} y={10} w={2} h={1} fill="#ffd54a" />
        </>
      )}
    </>
  )
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MARKETER — 5단계 (1F~5F)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function MarketerExtras({ level = 1 }) {
  const c = palette.marketer
  const robeColor = level >= 3 ? c.accent : c.body
  return (
    <>
      <Pixel x={5} y={-2} w={2} h={1} fill={robeColor} />
      <Pixel x={4} y={-1} w={4} h={1} fill={robeColor} />
      <Pixel x={3} y={0} w={6} h={1} fill={robeColor} />
      <Pixel x={2} y={1} w={8} h={1} fill={robeColor} />
      <Pixel x={2} y={1} w={8} h={1} fill={palette.outline} />
      <Pixel x={5} y={0} w={2} h={1} fill={c.detail} />

      <Pixel x={2} y={7} w={8} h={6} fill={robeColor} />

      {level >= 2 && <Pixel x={1} y={9} w={10} h={1} fill={c.accent} />}

      <Pixel x={5} y={10} w={2} h={1} fill={c.detail} />
      {level >= 4 && (
        <>
          <Pixel x={4} y={10} w={1} h={1} fill={c.detail} />
          <Pixel x={7} y={10} w={1} h={1} fill={c.detail} />
        </>
      )}

      <Pixel x={2} y={13} w={6} h={2} fill={robeColor} />
      <Pixel x={3} y={15} w={5} h={1} fill={c.accent} />

      <Pixel x={0} y={6} w={1} h={9} fill={c.accent} />
      <Pixel x={0} y={5} w={1} h={1} fill={c.detail} />
      {level >= 4 && (
        <>
          <Pixel x={-1} y={4} w={3} h={1} fill="#ffd54a" />
          <Pixel x={0} y={3} w={1} h={1} fill="#ffd54a" />
        </>
      )}

      {level >= 4 && (
        <>
          <Pixel x={11} y={6} w={1} h={9} fill={c.body} />
          <Pixel x={10} y={14} w={1} h={1} fill={c.body} />
        </>
      )}

      {level >= 5 && (
        <>
          <Pixel x={2} y={-3} w={1} h={1} fill="#ffd54a" />
          <Pixel x={9} y={-3} w={1} h={1} fill="#ffd54a" />
          <Pixel x={5} y={-4} w={2} h={1} fill="#ffd54a" />
        </>
      )}
    </>
  )
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CODER — 4단계 (2F~5F)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function CoderExtras({ level = 1 }) {
  const c = palette.coder
  return (
    <>
      <Pixel x={2} y={0} w={8} h={2} fill={c.body} />
      <Pixel x={2} y={0} w={8} h={1} fill={level >= 2 ? '#0f3a25' : c.accent} />
      <Pixel x={1} y={1} w={1} h={4} fill={c.body} />
      <Pixel x={10} y={1} w={1} h={4} fill={c.body} />

      <Pixel x={3} y={3} w={3} h={1} fill={c.detail} />
      <Pixel x={6} y={3} w={3} h={1} fill={c.detail} />
      <Pixel x={4} y={3} w={1} h={1} fill={palette.outline} />
      <Pixel x={7} y={3} w={1} h={1} fill={palette.outline} />

      <Pixel x={2} y={7} w={8} h={6} fill={c.body} />
      <Pixel x={3} y={7} w={6} h={1} fill={c.accent} />

      <Pixel x={3} y={10} w={6} h={2} fill={palette.outline} />
      <Pixel x={4} y={10} w={4} h={1} fill={c.detail} />

      {level >= 2 && (
        <Pixel x={3} y={9} w={6} h={1} fill={c.detail} opacity="0.5" />
      )}

      {level >= 3 && (
        <>
          <Pixel x={0} y={6} w={1} h={8} fill={c.accent} />
          <Pixel x={11} y={6} w={1} h={8} fill={c.accent} />
        </>
      )}

      {level >= 4 && (
        <>
          <Pixel x={2} y={-1} w={1} h={1} fill={c.detail} />
          <Pixel x={9} y={-1} w={1} h={1} fill={c.detail} />
          <Pixel x={5} y={-2} w={2} h={1} fill={c.detail} />
        </>
      )}

      <Pixel x={3} y={13} w={6} h={2} fill={c.accent} />
    </>
  )
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TRAINER — 1단계 (3F만)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function TrainerExtras() {
  const c = palette.trainer
  return (
    <>
      <Pixel x={3} y={1} w={6} h={1} fill={palette.outline} />
      <Pixel x={4} y={0} w={4} h={1} fill={palette.outline} />
      <Pixel x={2} y={2} w={8} h={1} fill={c.body} />
      <Pixel x={5} y={2} w={2} h={1} fill={c.detail} />
      <Pixel x={3} y={7} w={6} h={5} fill={c.body} />
      <Pixel x={3} y={7} w={6} h={1} fill={c.accent} />
      <Pixel x={2} y={7} w={1} h={2} fill={palette.skin} />
      <Pixel x={9} y={7} w={1} h={2} fill={palette.skin} />
      <Pixel x={1} y={9} w={1} h={3} fill={palette.skin} />
      <Pixel x={10} y={9} w={1} h={3} fill={palette.skin} />
      <Pixel x={5} y={8} w={2} h={1} fill={c.accent} />
      <Pixel x={5} y={9} w={2} h={1} fill={c.accent} />
      <Pixel x={3} y={12} w={6} h={2} fill={c.accent} />
      <Pixel x={11} y={11} w={1} h={2} fill={palette.outline} />
      <Pixel x={10} y={10} w={1} h={1} fill={palette.outline} />
      <Pixel x={10} y={13} w={1} h={1} fill={palette.outline} />
      <Pixel x={11} y={11} w={1} h={2} fill={c.detail} />
    </>
  )
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// AI — 2단계 (4F~5F)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function AiExtras({ level = 1 }) {
  const c = palette.ai
  return (
    <>
      <Pixel x={2} y={0} w={8} h={3} fill={c.body} />
      <Pixel x={2} y={0} w={8} h={1} fill={c.accent} />
      <Pixel x={3} y={2} w={6} h={2} fill={c.detail} />
      <Pixel x={3} y={2} w={6} h={1} fill={palette.outline} />
      <Pixel x={5} y={-2} w={1} h={2} fill={c.detail} />
      <Pixel x={4} y={-2} w={1} h={1} fill={c.body} />

      <Pixel x={2} y={7} w={8} h={6} fill={c.body} />
      <Pixel x={5} y={7} w={2} h={6} fill={c.accent} />
      <Pixel x={5} y={9} w={2} h={1} fill={c.detail} />
      <Pixel x={2} y={9} w={1} h={1} fill={c.detail} />
      <Pixel x={9} y={9} w={1} h={1} fill={c.detail} />

      {level >= 2 && (
        <>
          <Pixel x={1} y={-1} w={2} h={1} fill={c.detail} />
          <Pixel x={9} y={-1} w={2} h={1} fill={c.detail} />
          <Pixel x={5} y={-3} w={2} h={1} fill={c.detail} />
          <Pixel x={1} y={8} w={1} h={2} fill={c.detail} />
          <Pixel x={10} y={8} w={1} h={2} fill={c.detail} />
        </>
      )}

      <Pixel x={3} y={13} w={6} h={2} fill={c.accent} />
      <Pixel x={3} y={14} w={6} h={1} fill={c.detail} />
    </>
  )
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// FALLEN — 보스전 패배 임시 폼 (현재 미사용, 보존)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function FallenExtras() {
  const c = palette.fallen
  return (
    <>
      <Pixel x={3} y={0} w={6} h={1} fill={c.accent} />
      <Pixel x={2} y={1} w={1} h={1} fill={c.accent} />
      <Pixel x={9} y={1} w={1} h={1} fill={c.accent} />
      <Pixel x={4} y={3} w={1} h={1} fill={c.detail} />
      <Pixel x={7} y={3} w={1} h={1} fill={c.detail} />
      <Pixel x={2} y={7} w={8} h={6} fill={c.body} />
      <Pixel x={4} y={8} w={1} h={2} fill={c.accent} />
      <Pixel x={7} y={9} w={1} h={2} fill={c.accent} />
      <Pixel x={3} y={13} w={6} h={2} fill={c.accent} />
    </>
  )
}

const extrasMap = {
  hero: HeroExtras,
  marketer: MarketerExtras,
  coder: CoderExtras,
  trainer: TrainerExtras,
  ai: AiExtras,
  fallen: FallenExtras,
}

export default function PixelCharacter({ characterClass, level = 1 }) {
  const Extras = extrasMap[characterClass] || HeroExtras
  return (
    <svg viewBox="-2 -5 16 22" preserveAspectRatio="xMidYMid meet">
      <BaseBody />
      <Extras level={level} />
    </svg>
  )
}
