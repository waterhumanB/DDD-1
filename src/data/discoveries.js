// 씬별 발견 요소(discoveries) — 캐릭터가 다양한 (x, y) 위치를 탐색하면 텍스트가 드러남.
// 좌표: 0~1 (x: 좌→우, y: 상→하).
// scene__inner는 화면 중앙(y 0.35~0.7)에 위치하므로, 발견 요소는 그 영역을 피해 배치한다.

export const SCENE_DISCOVERIES = {
  'stage-01-village': [
    { x: 0.18, y: 0.18, text: 'TODO: 마을 사람 한마디' },
    { x: 0.82, y: 0.85, text: 'TODO: 멀리 보이는 마왕성' },
  ],
  'stage-02-forest': [
    { x: 0.22, y: 0.15, text: 'TODO: 숲의 첫 단서' },
    { x: 0.78, y: 0.86, text: 'TODO: 길가의 흔적' },
  ],
  'stage-03-unicorn': [
    { x: 0.5, y: 0.18, text: 'TODO: 유니콘과의 만남' },
    { x: 0.25, y: 0.85, text: 'TODO: 받은 선물의 의미' },
  ],
  'stage-04-guild': [
    { x: 0.18, y: 0.2, text: '마케터 동료의 무기 — 이야기' },
    { x: 0.82, y: 0.85, text: 'TODO: 길드의 풍경' },
  ],
  'stage-05-cave-entrance': [
    { x: 0.55, y: 0.16, text: 'TODO: 동굴 입구의 표식' },
    { x: 0.85, y: 0.86, text: 'TODO: 안쪽으로 부르는 소리' },
  ],
  'stage-06-cave-bugs': [
    { x: 0.2, y: 0.2, text: 'TODO: 시행착오의 흔적' },
    { x: 0.8, y: 0.86, text: 'TODO: 작은 깨달음' },
  ],
  'stage-07-forge': [
    { x: 0.18, y: 0.2, text: '대장장이의 도구 — 코드' },
    { x: 0.82, y: 0.86, text: 'TODO: 첫 무기 완성' },
  ],
  'stage-08-broken-bridge': [
    { x: 0.4, y: 0.18, text: 'TODO: 협동의 신호' },
    { x: 0.7, y: 0.86, text: 'TODO: 건너편 풍경' },
  ],
  'stage-09-giant-boss': [
    { x: 0.5, y: 0.16, text: '시장의 벽 — 너무 컸다' },
  ],
  'stage-10-mist-forest': [
    { x: 0.25, y: 0.2, text: 'AI — 미래를 보는 정령' },
    { x: 0.75, y: 0.85, text: 'TODO: 안개가 걷힌 풍경' },
  ],
  'stage-11-dragon-mountain': [
    { x: 0.4, y: 0.16, text: 'TODO: 정상의 단서' },
    { x: 0.7, y: 0.86, text: 'TODO: 산을 오르는 이유' },
  ],
  'stage-12-dragon-nest': [
    { x: 0.25, y: 0.18, text: 'TODO: 마지막 시험' },
    { x: 0.78, y: 0.86, text: 'TODO: 결심의 무게' },
  ],
  'stage-13-dragon-fight': [
    { x: 0.5, y: 0.15, text: 'TODO: 진행 중인 도전' },
  ],
  'stage-14-hero-awaken': [
    { x: 0.25, y: 0.18, text: 'TODO: 메시지' },
    { x: 0.75, y: 0.18, text: 'TODO: 지향점' },
  ],
}

export const PROXIMITY_THRESHOLD = 0.18

export function distance(ax, ay, bx, by) {
  const dx = ax - bx
  const dy = ay - by
  return Math.sqrt(dx * dx + dy * dy)
}

export function findActiveDiscovery(items, charX, charY) {
  if (!Array.isArray(items)) return null
  let best = null
  let bestDist = PROXIMITY_THRESHOLD
  for (const item of items) {
    const d = distance(charX, charY, item.x, item.y)
    if (d < bestDist) {
      best = item
      bestDist = d
    }
  }
  return best
}
