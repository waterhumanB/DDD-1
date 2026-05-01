// 14단계 스토리 — 스네이크 경로
//
// 경로: B1 →→→  ↑  ←←← 1F  ↑  →→ 2F  ↑  ←← 3F  ↑  →→ 4F  ↑  ←  5F (보스→엔딩)
//
// 데이터 구조:
// - id, floor, title, body, party, newAlly, departingAlly, monster, transition
// - gridX, gridY: 시각 위치만 (절대 배치). 네비게이션엔 사용 안 함.
// - next, prev: 명시 네비게이션 — { sceneId, direction }. 정해진 방향만 통과.
//
// 잘못된 방향 키를 누르면 차단(navBlocked 사운드).

const link = (sceneId, direction) => ({ sceneId, direction })

export const scenes = [
  {
    id: 'stage-01-village',
    floor: 'B1',
    title: '평원의 작은 마을',
    body:
      '반도체 회사 개발팀에서 일하던 평범한 직원. 안정은 있었지만 갈증이 있었다. ' +
      '"마을 너머에 마왕이 있다"는 소문이 들려온다.',
    party: ['hero'],
    newAlly: null, departingAlly: null, monster: null,
    transition: 'TODO: 다음 단계로',
    gridX: 0, gridY: 0,
    next: link('stage-02-forest', 'right'), prev: null,
  },
  {
    id: 'stage-02-forest',
    floor: 'B1',
    title: 'TODO: 2단계 — 숲 진입',
    body: 'TODO: 마을을 떠나 숲에 들어선다. 처음 만나는 작은 시련.',
    party: ['hero'],
    newAlly: null, departingAlly: null,
    monster: { name: 'TODO: 숲의 늑대', hp: 1, mode: 'auto', sprite: 'wolf' },
    transition: 'TODO',
    gridX: 1, gridY: 0,
    next: link('stage-03-unicorn', 'right'), prev: link('stage-01-village', 'left'),
  },
  {
    id: 'stage-03-unicorn',
    floor: 'B1',
    title: 'TODO: 3단계 — 유니콘과의 기연',
    body: 'TODO: 인생을 바꾼 만남. 의미 있는 단서.',
    party: ['hero'],
    newAlly: null, departingAlly: null, monster: null,
    transition: 'TODO',
    gridX: 2, gridY: 0,
    next: link('stage-04-guild', 'up'), prev: link('stage-02-forest', 'left'),
  },
  {
    id: 'stage-04-guild',
    floor: '1F',
    title: '마법 길드 — 음유시인 합류',
    body:
      '"말로 사람의 마음을 움직이는 마법"을 다루는 마케터를 만났다. ' +
      '그는 자신의 무기, 이야기를 우리에게 빌려준다.',
    party: ['marketer', 'hero'],
    newAlly: 'marketer', departingAlly: null,
    monster: { name: '의심의 그림자', hp: 1, mode: 'auto', sprite: 'shadow' },
    transition: 'TODO',
    gridX: 2, gridY: -1,
    next: link('stage-05-cave-entrance', 'left'), prev: link('stage-03-unicorn', 'down'),
  },
  {
    id: 'stage-05-cave-entrance',
    floor: '1F',
    title: 'TODO: 5단계 — 동굴 입구',
    body: 'TODO: 어둠 속으로 첫걸음.',
    party: ['marketer', 'hero'],
    newAlly: null, departingAlly: null,
    monster: { name: 'TODO: 동굴 박쥐', hp: 1, mode: 'auto', sprite: 'bat' },
    transition: 'TODO',
    gridX: 1, gridY: -1,
    next: link('stage-06-cave-bugs', 'left'), prev: link('stage-04-guild', 'right'),
  },
  {
    id: 'stage-06-cave-bugs',
    floor: '1F',
    title: 'TODO: 6단계 — 동굴 깊숙이',
    body: 'TODO: 시행착오 시기. 작은 적들과의 마찰.',
    party: ['marketer', 'hero'],
    newAlly: null, departingAlly: null,
    monster: { name: 'TODO: 동굴 적', hp: 1, mode: 'auto', sprite: 'slime' },
    transition: 'TODO',
    gridX: 0, gridY: -1,
    next: link('stage-07-forge', 'up'), prev: link('stage-05-cave-entrance', 'right'),
  },
  {
    id: 'stage-07-forge',
    floor: '2F',
    title: '대장간 (서울) — 대장장이 합류',
    body:
      '"코드로 도구를 만드는 자"와 합류했다. 이제 우리는 직접 무기를 만든다. ' +
      '서비스라는 이름의 도구를.',
    party: ['marketer', 'hero', 'coder'],
    newAlly: 'coder', departingAlly: null,
    monster: { name: '버그 슬라임', hp: 1, mode: 'auto', sprite: 'slime' },
    transition: 'TODO',
    gridX: 0, gridY: -2,
    next: link('stage-08-broken-bridge', 'right'), prev: link('stage-06-cave-bugs', 'down'),
  },
  {
    id: 'stage-08-broken-bridge',
    floor: '2F',
    title: 'TODO: 8단계 — 무너진 다리',
    body: 'TODO: 협동으로만 넘는 장애물.',
    party: ['marketer', 'hero', 'coder'],
    newAlly: null, departingAlly: null, monster: null,
    transition: 'TODO',
    gridX: 1, gridY: -2,
    next: link('stage-09-giant-boss', 'up'), prev: link('stage-07-forge', 'left'),
  },
  {
    id: 'stage-09-giant-boss',
    floor: '3F',
    title: '거인 보스전 — 첫 창업',
    body:
      'PT 사업이라는 거인. 헌신적인 트레이너 동료와 함께 부딪혔다. ' +
      '결과는 패배. 거인은 너무 컸다. 하지만 우리는 살아남았다.',
    party: ['marketer', 'hero', 'trainer', 'coder'],
    newAlly: 'trainer', departingAlly: 'trainer',
    monster: { name: '거인 — 시장의 벽', hp: 5, mode: 'boss', sprite: 'giant' },
    transition: 'TODO',
    gridX: 1, gridY: -3,
    next: link('stage-10-mist-forest', 'left'), prev: link('stage-08-broken-bridge', 'down'),
  },
  {
    id: 'stage-10-mist-forest',
    floor: '3F',
    title: '안개 숲 — 정령(AI) 합류',
    body:
      '미래를 미리 보는 정령, AI를 만났다. ' +
      '그는 우리에게 전에 없던 시야를 빌려준다. 이제 안개가 걷힌다.',
    party: ['marketer', 'hero', 'ai', 'coder'],
    newAlly: 'ai', departingAlly: null,
    monster: { name: '안개', hp: 1, mode: 'auto', sprite: 'shadow' },
    transition: 'TODO',
    gridX: 0, gridY: -3,
    next: link('stage-11-dragon-mountain', 'up'), prev: link('stage-09-giant-boss', 'right'),
  },
  {
    id: 'stage-11-dragon-mountain',
    floor: '4F',
    title: 'TODO: 11단계 — 용의 산',
    body: 'TODO: 최종 보스에 가까워지는 길.',
    party: ['marketer', 'hero', 'ai', 'coder'],
    newAlly: null, departingAlly: null, monster: null,
    transition: 'TODO',
    gridX: 0, gridY: -4,
    next: link('stage-12-dragon-nest', 'right'), prev: link('stage-10-mist-forest', 'down'),
  },
  {
    id: 'stage-12-dragon-nest',
    floor: '4F',
    title: 'TODO: 12단계 — 용의 둥지',
    body: 'TODO: 마지막 시험. 최종 결심.',
    party: ['marketer', 'hero', 'ai', 'coder'],
    newAlly: null, departingAlly: null,
    monster: { name: 'TODO: 둥지의 적', hp: 1, mode: 'auto', sprite: 'shadow' },
    transition: 'TODO',
    gridX: 1, gridY: -4,
    next: link('stage-13-dragon-fight', 'up'), prev: link('stage-11-dragon-mountain', 'left'),
  },
  {
    id: 'stage-13-dragon-fight',
    floor: '5F',
    title: 'TODO: 13단계 — 용 격퇴 (최종 보스)',
    body: 'TODO: 클라이맥스. 진행 중인 도전.',
    party: ['marketer', 'hero', 'ai', 'coder'],
    newAlly: null, departingAlly: null,
    monster: { name: 'TODO: 용', hp: 10, mode: 'boss', sprite: 'demon', isFinalBoss: true },
    transition: 'TODO',
    gridX: 1, gridY: -5,
    next: link('stage-14-hero-awaken', 'left'), prev: link('stage-12-dragon-nest', 'down'),
  },
  {
    id: 'stage-14-hero-awaken',
    floor: '5F',
    title: 'TODO: 14단계 — 용사 각성',
    body: 'TODO: 엔딩. 메시지 / 지향점.',
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
  trainer: 8, // stage-09-giant-boss
  ai: 9, // stage-10-mist-forest
}

export function levelOf(memberId, sceneIndex) {
  const join = JOIN_AT[memberId] ?? 0
  return Math.max(1, sceneIndex - join + 1)
}
