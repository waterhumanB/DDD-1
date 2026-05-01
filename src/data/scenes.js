// 14단계 스토리 — 스네이크 경로
//
// 경로: B1 →→→  ↑  ←←← 1F  ↑  →→ 2F  ↑  ←← 3F  ↑  →→ 4F  ↑  ←  5F (보스→엔딩)
//
// 데이터 구조:
// - id, floor, title, body, party, newAlly, departingAlly, monster, transition
// - gridX, gridY: 시각 위치만 (절대 배치). 네비게이션엔 사용 안 함.
// - next, prev: 명시 네비게이션 — { sceneId, direction }. 정해진 방향만 통과.

const link = (sceneId, direction) => ({ sceneId, direction })

export const scenes = [
  {
    id: 'stage-01-village',
    floor: 'B1',
    title: '평원의 작은 마을',
    body:
      '전자공학과를 나와 반도체 칩 개발팀에서 일하던 평범한 직원. ' +
      '월급은 따박따박, 영혼은 점점 사라지던 시기. ' +
      '"이대로 살면 안되겠다." 어렸을 때 막연했던 꿈, 사업이 다시 깜빡였다.',
    party: ['hero'],
    newAlly: null, departingAlly: null, monster: null,
    transition: '🌲 정보의 숲으로',
    gridX: 0, gridY: 0,
    next: link('stage-02-forest', 'right'), prev: null,
  },
  {
    id: 'stage-02-forest',
    floor: 'B1',
    title: '정보의 숲',
    body:
      '사업을 하려면 마케팅이 필요하다고 했다. 마케터가 꿈은 아니었지만, ' +
      '사업이라는 마왕을 잡으려면 무기가 필요했다. ' +
      '디지털 마케팅, 블로그, 키워드 분석. 머릿속이 키워드로 가득 찼다.',
    party: ['hero'],
    newAlly: null, departingAlly: null,
    monster: { name: '정보 과부하 늑대', hp: 1, mode: 'auto', sprite: 'wolf' },
    transition: '✨ 첫 마법의 흔적',
    gridX: 1, gridY: 0,
    next: link('stage-03-unicorn', 'right'), prev: link('stage-01-village', 'left'),
  },
  {
    id: 'stage-03-unicorn',
    floor: 'B1',
    title: '유니콘과의 기연',
    body:
      '애드센스 알림이 처음 떴을 때, 유니콘이 슬쩍 다녀갔다. ' +
      '금액은 코딱지만 했지만 분명했다. ' +
      '"아, 인터넷에서 진짜 돈이 나오는구나." 마법은 사실이었다.',
    party: ['hero'],
    newAlly: null, departingAlly: null, monster: null,
    transition: '🎤 음유시인 합류',
    gridX: 2, gridY: 0,
    next: link('stage-04-guild', 'up'), prev: link('stage-02-forest', 'left'),
  },
  {
    id: 'stage-04-guild',
    floor: '1F',
    title: '마법 길드 — 음유시인 합류',
    body:
      '철제 장식품 회사로 이직. 바이럴 마케터로 블로그·카페·인스타·밴드·페북·메타 광고까지 전부 다뤘다. ' +
      '"말로 사람의 마음을 움직이는 마법" — 음유시인의 기술이 파티에 합류했다.',
    party: ['marketer', 'hero'],
    newAlly: 'marketer', departingAlly: null,
    monster: { name: '의심의 그림자', hp: 1, mode: 'auto', sprite: 'shadow' },
    transition: '🕳 동굴 입구로',
    gridX: 2, gridY: -1,
    next: link('stage-05-cave-entrance', 'left'), prev: link('stage-03-unicorn', 'down'),
  },
  {
    id: 'stage-05-cave-entrance',
    floor: '1F',
    title: '동굴 입구 — 코로나의 어둠',
    body:
      '코로나가 마을을 덮쳤다. 회사 사업이 흔들렸다. ' +
      '"플랫폼에 종속되지 않는 나만의 서비스를 만들자." ' +
      '프론트엔드 부트캠프 등록. 동굴 입구에 발을 들였다.',
    party: ['marketer', 'hero'],
    newAlly: null, departingAlly: null,
    monster: { name: '불확실의 박쥐', hp: 1, mode: 'auto', sprite: 'bat' },
    transition: '🐛 첫 코드의 시간',
    gridX: 1, gridY: -1,
    next: link('stage-06-cave-bugs', 'left'), prev: link('stage-04-guild', 'right'),
  },
  {
    id: 'stage-06-cave-bugs',
    floor: '1F',
    title: '동굴 깊숙이 — 첫 코드',
    body:
      '부트캠프 수료, 서울 상경, 프론트엔드 개발자 입사. ' +
      'next step·개발 책·온라인 강의로 계속 공부. ' +
      '매일 새로운 버그가 "안녕"하고 인사를 건넸다.',
    party: ['marketer', 'hero'],
    newAlly: null, departingAlly: null,
    monster: { name: '404 슬라임', hp: 1, mode: 'auto', sprite: 'slime' },
    transition: '⚒ 대장간으로',
    gridX: 0, gridY: -1,
    next: link('stage-07-forge', 'up'), prev: link('stage-05-cave-entrance', 'right'),
  },
  {
    id: 'stage-07-forge',
    floor: '2F',
    title: '대장간 (서울) — 대장장이 합류',
    body:
      '이제 코드를 직접 휘두른다. 화면 위에 도구를 만들고, 서비스를 빚었다. ' +
      '"코드로 도구를 만드는 자" — 대장장이의 기술이 파티에 합류했다.',
    party: ['marketer', 'hero', 'coder'],
    newAlly: 'coder', departingAlly: null,
    monster: { name: '버그 슬라임', hp: 1, mode: 'auto', sprite: 'slime' },
    transition: '🌉 무너진 다리',
    gridX: 0, gridY: -2,
    next: link('stage-08-broken-bridge', 'right'), prev: link('stage-06-cave-bugs', 'down'),
  },
  {
    id: 'stage-08-broken-bridge',
    floor: '2F',
    title: '무너진 다리 — 운동 스타트업의 손짓',
    body:
      '운동을 좋아했다. 어느 스타트업 세미나에서 운동 서비스를 만드는 팀이 손짓했다. ' +
      '다리는 무너져 있었지만, 혼자 가는 길은 아니었다.',
    party: ['marketer', 'hero', 'coder'],
    newAlly: null, departingAlly: null, monster: null,
    transition: '⚔️ 거인을 만나다',
    gridX: 1, gridY: -2,
    next: link('stage-09-giant-boss', 'up'), prev: link('stage-07-forge', 'left'),
  },
  {
    id: 'stage-09-giant-boss',
    floor: '3F',
    title: '거인 보스전 — 첫 창업',
    body:
      '운동 서비스 팀에 개발자 겸 마케터로 합류. 공동창업자, 첫 사업. ' +
      '거인의 이름은 시장의 벽. 결과는 패배 — 투자 무산, 서비스 철수, 우리는 흩어졌다. ' +
      '하지만 살아남았다.',
    party: ['marketer', 'hero', 'coder'],
    newAlly: null, departingAlly: null,
    monster: { name: '시장의 벽', hp: 5, mode: 'boss', sprite: 'giant' },
    transition: '🌫 안개 숲으로',
    gridX: 1, gridY: -3,
    next: link('stage-10-mist-forest', 'left'), prev: link('stage-08-broken-bridge', 'down'),
  },
  {
    id: 'stage-10-mist-forest',
    floor: '3F',
    title: '안개 숲 — 정령(AI) 합류',
    body:
      '그때 GPT-3.5가 등장했다. 미래를 미리 보는 정령. ' +
      'AI라는 새 동료가 합류했다. 안개가 걷히기 시작했다.',
    party: ['marketer', 'hero', 'ai', 'coder'],
    newAlly: 'ai', departingAlly: null,
    monster: { name: '안개', hp: 1, mode: 'auto', sprite: 'shadow' },
    transition: '🏔 용의 산으로',
    gridX: 0, gridY: -3,
    next: link('stage-11-dragon-mountain', 'up'), prev: link('stage-09-giant-boss', 'right'),
  },
  {
    id: 'stage-11-dragon-mountain',
    floor: '4F',
    title: '용의 산 — 회복기',
    body:
      '프리랜서 마케터로 잘하는 걸로 돈 벌려 했다. 자동화 제휴 마케팅 시도. 수익은 미미. ' +
      '게다가 몸이 무너져 수술까지. 그러나 침대 위에서도 AI 공부는 멈추지 않았다. ' +
      '바이브코딩을 만나자 생산성이 폭발했다.',
    party: ['marketer', 'hero', 'ai', 'coder'],
    newAlly: null, departingAlly: null, monster: null,
    transition: '🥚 용의 둥지로',
    gridX: 0, gridY: -4,
    next: link('stage-12-dragon-nest', 'right'), prev: link('stage-10-mist-forest', 'down'),
  },
  {
    id: 'stage-12-dragon-nest',
    floor: '4F',
    title: '용의 둥지 — 야근의 시간',
    body:
      '마케팅 회사에서 카페 자동화 프로그램·사이트 외주. 다양한 경험이 쌓였다. ' +
      '퇴근 후엔 내 서비스를 만들었다. 잠은 사치였지만, 둥지는 점점 형태를 갖췄다.',
    party: ['marketer', 'hero', 'ai', 'coder'],
    newAlly: null, departingAlly: null,
    monster: { name: '야근의 그림자', hp: 1, mode: 'auto', sprite: 'shadow' },
    transition: '🐲 용 격퇴',
    gridX: 1, gridY: -4,
    next: link('stage-13-dragon-fight', 'up'), prev: link('stage-11-dragon-mountain', 'left'),
  },
  {
    id: 'stage-13-dragon-fight',
    floor: '5F',
    title: '용 격퇴 — naeo.kr',
    body:
      '작년 12월, AI 스타트업에 지원했다. AEO·GEO 회사. ' +
      '네이버 시장을 타겟으로 하는 naeo.kr — 기획·개발·마케팅 전부 맡았다. ' +
      '지금도 진행 중. 용을 잡는 중이다.',
    party: ['marketer', 'hero', 'ai', 'coder'],
    newAlly: null, departingAlly: null,
    monster: { name: 'naeo.kr — 네이버 시장의 용', hp: 10, mode: 'boss', sprite: 'demon', isFinalBoss: true },
    transition: '✨ 용사 각성',
    gridX: 1, gridY: -5,
    next: link('stage-14-hero-awaken', 'left'), prev: link('stage-12-dragon-nest', 'down'),
  },
  {
    id: 'stage-14-hero-awaken',
    floor: '5F',
    title: '용사 각성',
    body:
      '용을 잡으면 무엇이 남는가? 그건 다음에 알게 될 것이다. ' +
      '내 모험은 아직 끝나지 않았다.',
    party: ['marketer', 'hero', 'ai', 'coder'],
    newAlly: null, departingAlly: null, monster: null,
    transition: null,
    gridX: 0, gridY: -5,
    next: null, prev: link('stage-13-dragon-fight', 'right'),
  },
]

export const JOIN_AT = {
  hero: 0,
  marketer: 3, // stage-04-guild
  coder: 6, // stage-07-forge
  ai: 9, // stage-10-mist-forest
}

export function levelOf(memberId, sceneIndex) {
  const join = JOIN_AT[memberId] ?? 0
  return Math.max(1, sceneIndex - join + 1)
}
