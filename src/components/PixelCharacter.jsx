// 12x16 픽셀 그리드 SVG 캐릭터 6종.
// 각 클래스가 본인의 커리어 단계를 표현.
// - shape-rendering: crispEdges 로 픽셀 선명도 유지
// - 모든 캐릭터가 같은 그리드/포즈를 공유해서 전직 느낌 살림

const palette = {
  outline: '#0a0612',
  skin: '#f4c79a',
  skinDark: '#c89570',
  // 클래스별
  villager: { body: '#a87a4f', accent: '#5a3a1e', detail: '#fff' },
  mage:     { body: '#6c4ab8', accent: '#3d2370', detail: '#ffd54a' },
  coder:    { body: '#3da06d', accent: '#1f5a3a', detail: '#8aa9ff' },
  fallen:   { body: '#7a2030', accent: '#3d0e18', detail: '#ff5577' },
  ai:       { body: '#d63d8a', accent: '#7a1f50', detail: '#6bff9a' },
  hybrid:   { body: '#ffd54a', accent: '#c81e5a', detail: '#6c8aff' },
}

// 픽셀 = 1 단위. viewBox 12x16 → 한 픽셀 = 6px (CSS에서 64x96 표시 시)
const Pixel = ({ x, y, w = 1, h = 1, fill }) => (
  <rect x={x} y={y} width={w} height={h} fill={fill} />
)

// 공통 머리/눈/팔/다리 — 모든 캐릭터 공유
function BaseBody({ skin, outline }) {
  return (
    <>
      {/* 머리 (3,1)~(8,5) */}
      <Pixel x={3} y={1} w={6} h={5} fill={skin} />
      <Pixel x={3} y={1} w={6} h={1} fill={outline} /> {/* 머리 윤곽 */}
      <Pixel x={2} y={2} w={1} h={3} fill={outline} />
      <Pixel x={9} y={2} w={1} h={3} fill={outline} />
      {/* 눈 */}
      <Pixel x={4} y={3} w={1} h={1} fill={outline} />
      <Pixel x={7} y={3} w={1} h={1} fill={outline} />
      {/* 입 */}
      <Pixel x={5} y={4} w={2} h={1} fill={outline} />

      {/* 목 */}
      <Pixel x={5} y={6} w={2} h={1} fill="#c89570" />

      {/* 팔 */}
      <Pixel x={1} y={8} w={1} h={4} fill={outline} />
      <Pixel x={10} y={8} w={1} h={4} fill={outline} />

      {/* 다리 */}
      <Pixel x={4} y={13} w={1} h={3} fill={outline} />
      <Pixel x={7} y={13} w={1} h={3} fill={outline} />
      {/* 신발 */}
      <Pixel x={3} y={15} w={2} h={1} fill={outline} />
      <Pixel x={7} y={15} w={2} h={1} fill={outline} />
    </>
  )
}

// 마을 주민 — 평범한 옷
function VillagerExtras() {
  const c = palette.villager
  return (
    <>
      {/* 머리카락 (단정) */}
      <Pixel x={3} y={1} w={6} h={1} fill={c.accent} />
      <Pixel x={2} y={2} w={1} h={1} fill={c.accent} />
      <Pixel x={9} y={2} w={1} h={1} fill={c.accent} />
      {/* 셔츠 */}
      <Pixel x={2} y={7} w={8} h={6} fill={c.body} />
      <Pixel x={2} y={7} w={8} h={1} fill={c.accent} /> {/* 카라 */}
      {/* 단추 */}
      <Pixel x={5} y={9} w={1} h={1} fill={c.detail} />
      <Pixel x={5} y={11} w={1} h={1} fill={c.detail} />
      {/* 바지 */}
      <Pixel x={3} y={13} w={6} h={2} fill={c.accent} />
    </>
  )
}

// 마법사 — 뾰족모자 + 로브 + 별
function MageExtras() {
  const c = palette.mage
  return (
    <>
      {/* 뾰족 모자 */}
      <Pixel x={5} y={-2} w={2} h={1} fill={c.body} />
      <Pixel x={4} y={-1} w={4} h={1} fill={c.body} />
      <Pixel x={3} y={0} w={6} h={1} fill={c.body} />
      <Pixel x={2} y={1} w={8} h={1} fill={c.body} />
      <Pixel x={2} y={1} w={8} h={1} fill={palette.outline} />
      {/* 모자 별 */}
      <Pixel x={5} y={0} w={2} h={1} fill={c.detail} />
      {/* 로브 */}
      <Pixel x={2} y={7} w={8} h={6} fill={c.body} />
      <Pixel x={1} y={9} w={10} h={1} fill={c.accent} /> {/* 띠 */}
      {/* 가슴 별 */}
      <Pixel x={5} y={10} w={2} h={1} fill={c.detail} />
      {/* 로브 자락 */}
      <Pixel x={2} y={13} w={6} h={2} fill={c.body} />
      <Pixel x={3} y={15} w={5} h={1} fill={c.accent} />
      {/* 지팡이 (왼손) */}
      <Pixel x={0} y={6} w={1} h={9} fill={c.accent} />
      <Pixel x={0} y={5} w={1} h={1} fill={c.detail} />
    </>
  )
}

// 코더 — 후드 + 안경 + 노트북
function CoderExtras() {
  const c = palette.coder
  return (
    <>
      {/* 후드 */}
      <Pixel x={2} y={0} w={8} h={2} fill={c.body} />
      <Pixel x={2} y={0} w={8} h={1} fill={c.accent} />
      <Pixel x={1} y={1} w={1} h={4} fill={c.body} />
      <Pixel x={10} y={1} w={1} h={4} fill={c.body} />
      {/* 안경 (눈 위에 덮어쓰기) */}
      <Pixel x={3} y={3} w={3} h={1} fill={c.detail} />
      <Pixel x={6} y={3} w={3} h={1} fill={c.detail} />
      <Pixel x={4} y={3} w={1} h={1} fill={palette.outline} />
      <Pixel x={7} y={3} w={1} h={1} fill={palette.outline} />
      {/* 후드티 */}
      <Pixel x={2} y={7} w={8} h={6} fill={c.body} />
      <Pixel x={3} y={7} w={6} h={1} fill={c.accent} /> {/* 후드 라인 */}
      {/* 노트북 (앞에) */}
      <Pixel x={3} y={10} w={6} h={2} fill={palette.outline} />
      <Pixel x={4} y={10} w={4} h={1} fill={c.detail} />
      {/* 바지 */}
      <Pixel x={3} y={13} w={6} h={2} fill={c.accent} />
    </>
  )
}

// 패배한 모험가 — 찢어진 옷 + 눈에 X
function FallenExtras() {
  const c = palette.fallen
  return (
    <>
      {/* 흩어진 머리 */}
      <Pixel x={3} y={0} w={6} h={1} fill={c.accent} />
      <Pixel x={2} y={1} w={1} h={1} fill={c.accent} />
      <Pixel x={9} y={1} w={1} h={1} fill={c.accent} />
      <Pixel x={4} y={1} w={1} h={1} fill={c.accent} />
      <Pixel x={7} y={1} w={1} h={1} fill={c.accent} />
      {/* 눈에 X 표시 (실패의 흔적) */}
      <Pixel x={4} y={3} w={1} h={1} fill={c.detail} />
      <Pixel x={7} y={3} w={1} h={1} fill={c.detail} />
      <Pixel x={3} y={2} w={1} h={1} fill={c.detail} />
      <Pixel x={5} y={2} w={1} h={1} fill={c.detail} />
      <Pixel x={6} y={2} w={1} h={1} fill={c.detail} />
      <Pixel x={8} y={2} w={1} h={1} fill={c.detail} />
      <Pixel x={3} y={4} w={1} h={1} fill={c.detail} />
      <Pixel x={5} y={4} w={1} h={1} fill={c.detail} />
      <Pixel x={6} y={4} w={1} h={1} fill={c.detail} />
      <Pixel x={8} y={4} w={1} h={1} fill={c.detail} />
      {/* 찢어진 갑옷 */}
      <Pixel x={2} y={7} w={8} h={6} fill={c.body} />
      <Pixel x={4} y={8} w={1} h={2} fill={c.accent} /> {/* 찢김 */}
      <Pixel x={7} y={9} w={1} h={2} fill={c.accent} />
      {/* 어깨 부서짐 */}
      <Pixel x={1} y={7} w={1} h={2} fill={c.accent} />
      <Pixel x={10} y={7} w={1} h={2} fill={c.accent} />
      {/* 부러진 검 (땅에) */}
      <Pixel x={9} y={14} w={3} h={1} fill={c.detail} />
      {/* 바지 */}
      <Pixel x={3} y={13} w={6} h={2} fill={c.accent} />
    </>
  )
}

// AI 사이버 — 헬멧 + 네온 글로우
function AiExtras() {
  const c = palette.ai
  return (
    <>
      {/* 사이버 헬멧 */}
      <Pixel x={2} y={0} w={8} h={3} fill={c.body} />
      <Pixel x={2} y={0} w={8} h={1} fill={c.accent} />
      {/* 바이저 (눈 영역) */}
      <Pixel x={3} y={2} w={6} h={2} fill={c.detail} />
      <Pixel x={3} y={2} w={6} h={1} fill={palette.outline} />
      {/* 헬멧 안테나 */}
      <Pixel x={5} y={-2} w={1} h={2} fill={c.detail} />
      <Pixel x={4} y={-2} w={1} h={1} fill={c.body} />
      {/* 사이버 슈트 */}
      <Pixel x={2} y={7} w={8} h={6} fill={c.body} />
      <Pixel x={5} y={7} w={2} h={6} fill={c.accent} /> {/* 중앙 라인 */}
      <Pixel x={5} y={9} w={2} h={1} fill={c.detail} /> {/* 코어 */}
      <Pixel x={2} y={9} w={1} h={1} fill={c.detail} />
      <Pixel x={9} y={9} w={1} h={1} fill={c.detail} />
      {/* 부츠 */}
      <Pixel x={3} y={13} w={6} h={2} fill={c.accent} />
      <Pixel x={3} y={14} w={6} h={1} fill={c.detail} />
    </>
  )
}

// 하이브리드 — 모든 클래스 융합 (최종 폼)
function HybridExtras() {
  const c = palette.hybrid
  return (
    <>
      {/* 망토/오라 */}
      <Pixel x={0} y={6} w={1} h={9} fill={palette.coder.body} opacity="0.7" />
      <Pixel x={11} y={6} w={1} h={9} fill={palette.mage.body} opacity="0.7" />
      {/* 왕관 */}
      <Pixel x={3} y={-1} w={6} h={1} fill={c.body} />
      <Pixel x={3} y={0} w={1} h={1} fill={c.body} />
      <Pixel x={5} y={-2} w={2} h={1} fill={c.body} />
      <Pixel x={8} y={0} w={1} h={1} fill={c.body} />
      <Pixel x={4} y={-1} w={1} h={1} fill={c.accent} />
      <Pixel x={7} y={-1} w={1} h={1} fill={c.accent} />
      {/* 머리카락 */}
      <Pixel x={3} y={1} w={6} h={1} fill={palette.outline} />
      {/* 융합 슈트 — 그라디언트 표현은 픽셀로 */}
      <Pixel x={2} y={7} w={8} h={2} fill={c.body} />        {/* 노랑 */}
      <Pixel x={2} y={9} w={8} h={2} fill={c.accent} />      {/* 분홍 */}
      <Pixel x={2} y={11} w={8} h={2} fill={c.detail} />     {/* 파랑 */}
      {/* 가슴 별 */}
      <Pixel x={5} y={9} w={2} h={1} fill="#fff" />
      {/* 바지 */}
      <Pixel x={3} y={13} w={6} h={2} fill={palette.outline} />
    </>
  )
}

const extrasMap = {
  villager: VillagerExtras,
  mage: MageExtras,
  coder: CoderExtras,
  fallen: FallenExtras,
  ai: AiExtras,
  hybrid: HybridExtras,
}

export default function PixelCharacter({ characterClass }) {
  const Extras = extrasMap[characterClass] || VillagerExtras
  return (
    <svg viewBox="-1 -3 14 20" preserveAspectRatio="xMidYMid meet">
      <BaseBody skin={palette.skin} outline={palette.outline} />
      <Extras />
    </svg>
  )
}
