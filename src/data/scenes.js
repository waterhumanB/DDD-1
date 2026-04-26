// 던전 파티 영입 RPG — "마왕 토벌 파티"
//
// 데이터 구조:
// - party:        현재 파티 구성 (캐릭터 ID 배열)
// - newAlly:      이번 씬에 합류하는 새 동료 (없으면 null)
// - departingAlly:이번 씬 후 이탈하는 동료 (예: 보스전 패배 후)
// - monster:      이번 씬에 등장하는 적 — { name, hp, mode: 'auto' | 'interactive', isFinalBoss }
// - moveDirection:캐릭터 화면 내 이동 방향 'left' | 'right' | 'up'
// - position:     큰 맵 좌표 (D 단계에서 카메라 경로 만들 때 사용, 지금은 메타데이터)
//
// 텍스트는 본인 워딩으로 자유롭게 수정 가능. 구조는 유지.

export const scenes = [
  {
    id: 'hometown',
    floor: 'B1F',
    title: '평원의 작은 마을',
    body:
      '반도체 회사의 평범한 엔지니어. 안정은 있었지만 갈증이 있었다. ' +
      '“마을 너머에 마왕이 있다”는 소문이 들려온다.',
    party: ['hero'],
    newAlly: null,
    departingAlly: null,
    monster: null,
    moveDirection: 'right',
    position: { x: 0, y: 0 },
    transition: '🎒 첫 출발 — 마법 길드를 향해',
  },
  {
    id: 'library',
    floor: '1F',
    title: '마법 길드 — 음유시인 합류',
    body:
      '“말로 사람의 마음을 움직이는 마법”을 다루는 마케터를 만났다. ' +
      '그는 자신의 무기, 이야기를 우리에게 빌려준다.',
    party: ['hero', 'marketer'],
    newAlly: 'marketer',
    departingAlly: null,
    monster: { name: '의심의 그림자', hp: 1, mode: 'auto', sprite: 'shadow' },
    moveDirection: 'right',
    position: { x: 1, y: 0 },
    transition: '⚒ 대장간으로',
  },
  {
    id: 'tower',
    floor: '2F',
    title: '대장간 (서울) — 대장장이 합류',
    body:
      '“코드로 도구를 만드는 자”와 합류했다. 이제 우리는 직접 무기를 만든다. ' +
      '서비스라는 이름의 도구를.',
    party: ['hero', 'marketer', 'coder'],
    newAlly: 'coder',
    departingAlly: null,
    monster: { name: '버그 슬라임', hp: 1, mode: 'auto', sprite: 'slime' },
    moveDirection: 'right',
    position: { x: 1, y: 1 },
    transition: '⚔️ 첫 거인을 만나다',
  },
  {
    id: 'boss',
    floor: '3F',
    title: '거인 보스전 — 첫 창업',
    body:
      'PT 사업이라는 거인. 헌신적인 트레이너 동료와 함께 부딪혔다. ' +
      '결과는 패배. 거인은 너무 컸다. 하지만 우리는 살아남았다.',
    party: ['hero', 'marketer', 'coder', 'trainer'],
    newAlly: 'trainer',
    departingAlly: 'trainer',
    monster: { name: '거인 — 시장의 벽', hp: 5, mode: 'interactive', sprite: 'giant' },
    moveDirection: 'left',
    position: { x: 0, y: 1 },
    transition: '🌌 정령의 신탁을 듣다',
  },
  {
    id: 'ai',
    floor: '4F',
    title: '신탁의 방 — 정령 합류',
    body:
      '미래를 미리 보는 정령, AI를 만났다. ' +
      '그는 우리에게 전에 없던 시야를 빌려준다. 이제 안개가 걷힌다.',
    party: ['hero', 'marketer', 'coder', 'ai'],
    newAlly: 'ai',
    departingAlly: null,
    monster: { name: '안개', hp: 1, mode: 'auto', sprite: 'shadow' },
    moveDirection: 'right',
    position: { x: 0, y: 2 },
    transition: '🏰 마왕성으로',
  },
  {
    id: 'final',
    floor: '5F',
    title: 'naeo.kr — 마왕성 입구',
    body:
      '한 명이 모든 걸 할 순 없다. 함께라면 다르다. ' +
      '우리는 마왕성을 향해 산을 오르기 시작한다. 모험은 지금부터다.',
    party: ['hero-final', 'marketer', 'coder', 'ai'],
    newAlly: null,
    departingAlly: null,
    monster: { name: '마왕', hp: 10, mode: 'interactive', sprite: 'demon', isFinalBoss: true },
    moveDirection: 'up',
    position: { x: 0, y: 3 },
    transition: null,
  },
]
