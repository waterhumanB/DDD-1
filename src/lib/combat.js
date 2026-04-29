export const COMBAT_COLORS = ['#fff7c2', '#ffd54a', '#ff5577', '#8aa9ff', '#6bff9a']
export const IMPACT_WORDS = ['SLASH', 'CRITICAL', 'BREAK', 'COMBO']
export const FINISHER_WORDS = ['FINISH', 'K.O.', 'CLEAR']

export const SCROLL_LOCK_KEYS = new Set([
  'ArrowDown',
  'ArrowUp',
  'End',
  'Home',
  'PageDown',
  'PageUp',
  'Space',
])

export const BOSS_LOCK_OFFSET = 2
export const MANUAL_STRIKE_COOLDOWN_MS = 240
export const EFFECT_LIFETIME_MS = 500
export const COMBAT_CLEANUP_DELAY_MS = 560
export const AUTO_ADVANCE_DELAY_MS = 700

export function pickImpactText(isFinisher) {
  const pool = isFinisher ? FINISHER_WORDS : IMPACT_WORDS
  return pool[Math.floor(Math.random() * pool.length)]
}

function randomId() {
  return `${Date.now()}-${Math.random()}`
}

export function makeSlash() {
  return {
    id: randomId(),
    angle: -28 + Math.random() * 56,
    top: 42 + Math.random() * 18,
    left: 50 + Math.random() * 18,
  }
}

export function makeImpactWord(isFinisher) {
  return {
    id: randomId(),
    text: pickImpactText(isFinisher),
    top: 22 + Math.random() * 16,
    left: 46 + Math.random() * 18,
    isFinisher,
  }
}

export function makeCombatBolts(seedId) {
  return [
    {
      id: `bolt-${seedId}`,
      top: 60 + Math.random() * 11,
      delay: 0,
      color: '#ffd54a',
    },
    {
      id: `support-${seedId}`,
      top: 51 + Math.random() * 12,
      delay: 0.08,
      color: '#8aa9ff',
    },
  ]
}

export function confettiBurst(isFinisher) {
  return [
    {
      particleCount: isFinisher ? 170 : 84,
      angle: 138,
      spread: isFinisher ? 110 : 72,
      startVelocity: isFinisher ? 72 : 58,
      decay: 0.86,
      gravity: 0.78,
      ticks: isFinisher ? 128 : 86,
      scalar: isFinisher ? 1.4 : 1.15,
      origin: { x: 0.76, y: 0.58 },
      colors: COMBAT_COLORS,
      shapes: ['star', 'square'],
      zIndex: 720,
      disableForReducedMotion: true,
    },
    {
      particleCount: isFinisher ? 120 : 44,
      angle: 38,
      spread: isFinisher ? 96 : 58,
      startVelocity: isFinisher ? 62 : 46,
      decay: 0.88,
      gravity: 0.72,
      ticks: isFinisher ? 110 : 72,
      scalar: isFinisher ? 1.25 : 0.92,
      origin: { x: 0.43, y: 0.7 },
      colors: COMBAT_COLORS,
      shapes: ['circle', 'square'],
      zIndex: 720,
      disableForReducedMotion: true,
    },
  ]
}
