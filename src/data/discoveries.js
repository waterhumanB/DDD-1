// 씬별 발견 요소(discoveries) — 캐릭터가 위치를 탐색하면 텍스트가 드러난다.
// 좌표: 0~1 (x: 좌→우, y: 상→하). 메시지 박스 영역(중앙)은 피해서 배치.

export const SCENE_DISCOVERIES = {
  'stage-01-village': [
    { x: 0.18, y: 0.62, text: '이대로 살면 안되겠다' },
    { x: 0.82, y: 0.85, text: '어딘가의 사업이라는 꿈' },
  ],
  'stage-02-forest': [
    { x: 0.22, y: 0.62, text: '키워드 분석 노트' },
    { x: 0.78, y: 0.86, text: '디지털 마케팅 책 더미' },
  ],
  'stage-03-unicorn': [
    { x: 0.45, y: 0.62, text: '애드센스 첫 입금 알림' },
    { x: 0.25, y: 0.85, text: '인터넷에서 진짜 돈이 나온다' },
  ],
  'stage-04-guild': [
    { x: 0.18, y: 0.62, text: '바이럴 마케팅의 무기 — 이야기' },
    { x: 0.82, y: 0.85, text: '메타 광고 매니저 화면' },
  ],
  'stage-05-cave-entrance': [
    { x: 0.42, y: 0.62, text: '코로나 19, 마을이 흔들리다' },
    { x: 0.85, y: 0.86, text: '부트캠프 등록 완료' },
  ],
  'stage-06-cave-bugs': [
    { x: 0.2, y: 0.62, text: 'next step 강의 수강 노트' },
    { x: 0.8, y: 0.86, text: '서울행 KTX 표' },
  ],
  'stage-07-forge': [
    { x: 0.18, y: 0.62, text: '대장장이의 도구 — 코드' },
    { x: 0.82, y: 0.86, text: '내 손으로 만든 첫 화면' },
  ],
  'stage-08-broken-bridge': [
    { x: 0.35, y: 0.62, text: '스타트업 세미나 명함' },
    { x: 0.7, y: 0.86, text: '운동 서비스 합류 제안' },
  ],
  'stage-09-giant-boss': [
    { x: 0.5, y: 0.62, text: '시장의 벽 — 너무 컸다' },
  ],
  'stage-10-mist-forest': [
    { x: 0.25, y: 0.62, text: 'GPT-3.5 — 미래를 보는 정령' },
    { x: 0.75, y: 0.85, text: '안개가 걷힌 풍경' },
  ],
  'stage-11-dragon-mountain': [
    { x: 0.38, y: 0.62, text: '바이브코딩, 생산성 폭발' },
    { x: 0.7, y: 0.86, text: '회복 중에도 멈추지 않은 공부' },
  ],
  'stage-12-dragon-nest': [
    { x: 0.25, y: 0.62, text: '카페 자동화 프로그램' },
    { x: 0.78, y: 0.86, text: '퇴근 후 만든 내 서비스' },
  ],
  'stage-13-dragon-fight': [
    { x: 0.5, y: 0.62, text: 'AEO·GEO — 네이버 시장의 용' },
  ],
  'stage-14-hero-awaken': [
    { x: 0.25, y: 0.62, text: '내 모험은 아직 끝나지 않았다' },
    { x: 0.75, y: 0.62, text: '다음 모험을 향해' },
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
