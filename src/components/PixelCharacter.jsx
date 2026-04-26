// 12x16 픽셀 그리드 SVG 캐릭터 — 파티 RPG 컨셉.
// IDs: hero, hero-final, marketer, coder, trainer, ai, fallen

const palette = {
  outline: '#0a0612',
  skin: '#f4c79a',
  skinDark: '#c89570',
  hero:        { body: '#a87a4f', accent: '#5a3a1e', detail: '#fff' },
  heroFinal:   { body: '#ffd54a', accent: '#c81e5a', detail: '#6c8aff' },
  marketer:    { body: '#6c4ab8', accent: '#3d2370', detail: '#ffd54a' },
  coder:       { body: '#3da06d', accent: '#1f5a3a', detail: '#8aa9ff' },
  trainer:     { body: '#ff5577', accent: '#a01030', detail: '#ffd54a' },
  ai:          { body: '#d63d8a', accent: '#7a1f50', detail: '#6bff9a' },
  fallen:      { body: '#7a2030', accent: '#3d0e18', detail: '#ff5577' },
}

const Pixel = ({ x, y, w = 1, h = 1, fill, opacity }) => (
  <rect x={x} y={y} width={w} height={h} fill={fill} opacity={opacity} />
)

function BaseBody({ skin, outline }) {
  return (
    <>
      <Pixel x={3} y={1} w={6} h={5} fill={skin} />
      <Pixel x={3} y={1} w={6} h={1} fill={outline} />
      <Pixel x={2} y={2} w={1} h={3} fill={outline} />
      <Pixel x={9} y={2} w={1} h={3} fill={outline} />
      <Pixel x={4} y={3} w={1} h={1} fill={outline} />
      <Pixel x={7} y={3} w={1} h={1} fill={outline} />
      <Pixel x={5} y={4} w={2} h={1} fill={outline} />
      <Pixel x={5} y={6} w={2} h={1} fill="#c89570" />
      <Pixel x={1} y={8} w={1} h={4} fill={outline} />
      <Pixel x={10} y={8} w={1} h={4} fill={outline} />
      <Pixel x={4} y={13} w={1} h={3} fill={outline} />
      <Pixel x={7} y={13} w={1} h={3} fill={outline} />
      <Pixel x={3} y={15} w={2} h={1} fill={outline} />
      <Pixel x={7} y={15} w={2} h={1} fill={outline} />
    </>
  )
}

// 본인 — 모험가 시작 폼
function HeroExtras() {
  const c = palette.hero
  return (
    <>
      <Pixel x={3} y={1} w={6} h={1} fill={c.accent} />
      <Pixel x={2} y={2} w={1} h={1} fill={c.accent} />
      <Pixel x={9} y={2} w={1} h={1} fill={c.accent} />
      <Pixel x={2} y={7} w={8} h={6} fill={c.body} />
      <Pixel x={2} y={7} w={8} h={1} fill={c.accent} />
      <Pixel x={5} y={9} w={1} h={1} fill={c.detail} />
      <Pixel x={5} y={11} w={1} h={1} fill={c.detail} />
      <Pixel x={3} y={13} w={6} h={2} fill={c.accent} />
    </>
  )
}

// 본인 — 마왕성 직전 최종 폼 (왕관 + 망토 + 융합 갑옷)
function HeroFinalExtras() {
  const c = palette.heroFinal
  return (
    <>
      {/* 망토 */}
      <Pixel x={0} y={6} w={1} h={9} fill={palette.coder.body} opacity="0.7" />
      <Pixel x={11} y={6} w={1} h={9} fill={palette.marketer.body} opacity="0.7" />
      {/* 왕관 */}
      <Pixel x={3} y={-1} w={6} h={1} fill={c.body} />
      <Pixel x={3} y={0} w={1} h={1} fill={c.body} />
      <Pixel x={5} y={-2} w={2} h={1} fill={c.body} />
      <Pixel x={8} y={0} w={1} h={1} fill={c.body} />
      <Pixel x={4} y={-1} w={1} h={1} fill={c.accent} />
      <Pixel x={7} y={-1} w={1} h={1} fill={c.accent} />
      {/* 머리띠 */}
      <Pixel x={3} y={1} w={6} h={1} fill={palette.outline} />
      {/* 융합 갑옷 — 3색 띠 */}
      <Pixel x={2} y={7} w={8} h={2} fill={c.body} />
      <Pixel x={2} y={9} w={8} h={2} fill={c.accent} />
      <Pixel x={2} y={11} w={8} h={2} fill={c.detail} />
      {/* 가슴 별 */}
      <Pixel x={5} y={9} w={2} h={1} fill="#fff" />
      {/* 바지 */}
      <Pixel x={3} y={13} w={6} h={2} fill={palette.outline} />
    </>
  )
}

// 마케터 — 음유시인/매혹 마법사 (뾰족모자 + 별 + 지팡이)
function MarketerExtras() {
  const c = palette.marketer
  return (
    <>
      <Pixel x={5} y={-2} w={2} h={1} fill={c.body} />
      <Pixel x={4} y={-1} w={4} h={1} fill={c.body} />
      <Pixel x={3} y={0} w={6} h={1} fill={c.body} />
      <Pixel x={2} y={1} w={8} h={1} fill={c.body} />
      <Pixel x={2} y={1} w={8} h={1} fill={palette.outline} />
      <Pixel x={5} y={0} w={2} h={1} fill={c.detail} />
      <Pixel x={2} y={7} w={8} h={6} fill={c.body} />
      <Pixel x={1} y={9} w={10} h={1} fill={c.accent} />
      <Pixel x={5} y={10} w={2} h={1} fill={c.detail} />
      <Pixel x={2} y={13} w={6} h={2} fill={c.body} />
      <Pixel x={3} y={15} w={5} h={1} fill={c.accent} />
      <Pixel x={0} y={6} w={1} h={9} fill={c.accent} />
      <Pixel x={0} y={5} w={1} h={1} fill={c.detail} />
    </>
  )
}

// 개발자 — 후드 + 안경 + 노트북
function CoderExtras() {
  const c = palette.coder
  return (
    <>
      <Pixel x={2} y={0} w={8} h={2} fill={c.body} />
      <Pixel x={2} y={0} w={8} h={1} fill={c.accent} />
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
      <Pixel x={3} y={13} w={6} h={2} fill={c.accent} />
    </>
  )
}

// 트레이너 — 머리띠 + 민소매 + 덤벨 (NEW)
function TrainerExtras() {
  const c = palette.trainer
  return (
    <>
      {/* 짧은 머리 */}
      <Pixel x={3} y={1} w={6} h={1} fill={palette.outline} />
      <Pixel x={4} y={0} w={4} h={1} fill={palette.outline} />
      {/* 머리띠 (빨강) */}
      <Pixel x={2} y={2} w={8} h={1} fill={c.body} />
      <Pixel x={5} y={2} w={2} h={1} fill={c.detail} /> {/* 띠 별 */}
      {/* 민소매 셔츠 (어깨 노출) */}
      <Pixel x={3} y={7} w={6} h={5} fill={c.body} />
      <Pixel x={3} y={7} w={6} h={1} fill={c.accent} />
      {/* 어깨/팔 노출 (피부색) */}
      <Pixel x={2} y={7} w={1} h={2} fill={palette.skin} />
      <Pixel x={9} y={7} w={1} h={2} fill={palette.skin} />
      <Pixel x={1} y={9} w={1} h={3} fill={palette.skin} />
      <Pixel x={10} y={9} w={1} h={3} fill={palette.skin} />
      {/* 가슴 V 라인 */}
      <Pixel x={5} y={8} w={2} h={1} fill={c.accent} />
      <Pixel x={5} y={9} w={2} h={1} fill={c.accent} />
      {/* 짧은 바지 */}
      <Pixel x={3} y={12} w={6} h={2} fill={c.accent} />
      {/* 덤벨 (오른손) */}
      <Pixel x={11} y={11} w={1} h={2} fill={palette.outline} />
      <Pixel x={10} y={10} w={1} h={1} fill={palette.outline} />
      <Pixel x={10} y={13} w={1} h={1} fill={palette.outline} />
      <Pixel x={11} y={11} w={1} h={2} fill={c.detail} />
    </>
  )
}

// AI — 사이버 헬멧 + 바이저
function AiExtras() {
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
      <Pixel x={3} y={13} w={6} h={2} fill={c.accent} />
      <Pixel x={3} y={14} w={6} h={1} fill={c.detail} />
    </>
  )
}

// 패배 폼 — 보스전 패배 순간 일시 표시용
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
  'hero-final': HeroFinalExtras,
  marketer: MarketerExtras,
  coder: CoderExtras,
  trainer: TrainerExtras,
  ai: AiExtras,
  fallen: FallenExtras,
}

export default function PixelCharacter({ characterClass }) {
  const Extras = extrasMap[characterClass] || HeroExtras
  return (
    <svg viewBox="-1 -3 14 20" preserveAspectRatio="xMidYMid meet">
      <BaseBody skin={palette.skin} outline={palette.outline} />
      <Extras />
    </svg>
  )
}
