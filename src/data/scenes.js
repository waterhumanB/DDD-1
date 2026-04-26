// 던전 씬 데이터 — 본인 스토리에 맞춰 자유롭게 수정하세요
// 각 씬은 한 층(floor)이고, characterClass는 그 시점의 전직 상태

export const scenes = [
  {
    id: 'hometown',
    floor: 'B1F',
    title: '평원의 작은 마을',
    characterClass: 'villager',
    body: '반도체 회사의 평범한 엔지니어. 안정적이지만 마음 한편엔 “이게 다인가?”라는 질문이 있었다.',
    transition: '🔮 마법서를 발견했다',
  },
  {
    id: 'library',
    floor: '1F',
    title: '비밀의 도서관',
    characterClass: 'mage',
    body: '마케팅을 독학하기 시작했다. 책과 강의로 무장한 견습 마법사. 첫 이직으로 새로운 챕터를 열었다.',
    transition: '🏙 코드의 탑이 멀리 보인다',
  },
  {
    id: 'tower',
    floor: '2F',
    title: '코드의 탑 (서울)',
    characterClass: 'coder',
    body: '“서비스를 직접 만들고 싶다.” FE 부트캠프를 거쳐 서울에서 개발자로 취업. 코드 메이지로 전직 완료.',
    transition: '⚔️ 보스의 그림자가 다가온다',
  },
  {
    id: 'boss',
    floor: '3F',
    title: '보스전 — 첫 창업',
    characterClass: 'fallen',
    body: '운동을 좋아해서 온라인 PT 사업을 공동창업했다. 결과는 폐업. 하지만 시장·기획·실행을 한 번에 배운 보스 레벨 경험치.',
    transition: '💎 전설의 무기 “AI”를 손에 넣다',
  },
  {
    id: 'ai',
    floor: '4F',
    title: 'AI 결정의 방',
    characterClass: 'ai',
    body: 'AI를 활용한 마케팅·개발을 공부하고 실무에 적용. 무기는 더 이상 하나가 아니다.',
    transition: '✨ 모든 클래스가 하나로 융합된다',
  },
  {
    id: 'final',
    floor: '5F',
    title: '현재의 모험가 — naeo.kr',
    characterClass: 'hybrid',
    body: 'AI 스타트업에서 기획 · 마케팅 · 개발을 모두 직접 한다. 한 우물을 판 게 아니라, 모은 모든 무기로 지금 싸우고 있다.',
    transition: '📮 함께 모험할 동료를 찾는 중',
  },
]
