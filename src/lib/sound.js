// 8-bit 사운드 합성기 — 외부 파일 없음, 라이선스 이슈 없음.
// Web Audio API의 OscillatorNode로 톤을 즉시 생성. 픽셀 RPG 미감과 일치.

let sharedContext = null
let userInteracted = false
export const AUDIO_READY_EVENT = 'rpg:audio-ready'

function getContext() {
  if (typeof window === 'undefined') return null
  if (sharedContext) return sharedContext
  // 첫 사용자 제스처 전에는 AudioContext 자체를 만들지 않음 (Chrome autoplay 경고 차단)
  if (!userInteracted) return null
  const Ctor = window.AudioContext || window.webkitAudioContext
  if (!Ctor) return null
  sharedContext = new Ctor()
  return sharedContext
}

export function markUserInteraction() {
  const wasInteracted = userInteracted
  userInteracted = true
  const ctx = getContext()
  if (!wasInteracted && typeof window !== 'undefined') {
    const notifyReady = () => window.dispatchEvent(new Event(AUDIO_READY_EVENT))
    if (ctx?.state === 'suspended') {
      ctx.resume().then(notifyReady).catch(() => {})
    } else {
      notifyReady()
    }
    return
  }
  if (ctx?.state === 'suspended') ctx.resume().catch(() => {})
}

export function isAudioReady() {
  return userInteracted && sharedContext?.state === 'running'
}

// 사용자 입력 전엔 no-op. 입력 후엔 ctx 생성/resume. BGM 등에서 안전하게 호출 가능.
export function resumeContext() {
  if (!userInteracted) return
  const ctx = getContext()
  if (ctx?.state === 'suspended') ctx.resume().catch(() => {})
}

export function playTone(spec, ctx = getContext()) {
  if (!ctx || ctx.state !== 'running') return
  const {
    freq = 440,
    duration = 0.1,
    type = 'square',
    volume = 0.08,
    attack = 0.005,
    slideTo,
    delay = 0,
  } = spec
  const startAt = ctx.currentTime + delay
  const stopAt = startAt + duration
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(freq, startAt)
  if (slideTo != null) {
    osc.frequency.exponentialRampToValueAtTime(Math.max(1, slideTo), stopAt)
  }
  gain.gain.setValueAtTime(0, startAt)
  gain.gain.linearRampToValueAtTime(volume, startAt + attack)
  gain.gain.exponentialRampToValueAtTime(0.0001, stopAt)
  osc.connect(gain).connect(ctx.destination)
  osc.start(startAt)
  osc.stop(stopAt + 0.02)
}

export function playSequence(specs, ctx = getContext()) {
  if (!ctx || ctx.state !== 'running') return
  let cursor = 0
  for (const spec of specs) {
    playTone({ ...spec, delay: (spec.delay ?? 0) + cursor }, ctx)
    cursor += spec.gap ?? spec.duration ?? 0.1
  }
}

// 사운드 프리셋 — 키 = 이벤트 이름, 값 = playTone/playSequence에 넘길 스펙.
export const SOUND_PRESETS = {
  step: { freq: 220, duration: 0.05, type: 'square', volume: 0.04 },
  sceneAdvance: [
    { freq: 523, duration: 0.07, type: 'triangle', volume: 0.06, gap: 0.05 },
    { freq: 784, duration: 0.1, type: 'triangle', volume: 0.06 },
  ],
  sceneRetreat: [
    { freq: 523, duration: 0.07, type: 'triangle', volume: 0.05, gap: 0.05 },
    { freq: 392, duration: 0.1, type: 'triangle', volume: 0.05 },
  ],
  navBlocked: { freq: 130, duration: 0.18, type: 'sawtooth', volume: 0.06, slideTo: 90 },
  attack: { freq: 880, duration: 0.08, type: 'square', volume: 0.07, slideTo: 220 },
  hit: { freq: 110, duration: 0.12, type: 'sawtooth', volume: 0.08 },
  bossDefeat: [
    { freq: 523, duration: 0.14, type: 'triangle', volume: 0.07, gap: 0.1 },
    { freq: 659, duration: 0.14, type: 'triangle', volume: 0.07, gap: 0.1 },
    { freq: 784, duration: 0.14, type: 'triangle', volume: 0.07, gap: 0.1 },
    { freq: 1047, duration: 0.24, type: 'triangle', volume: 0.08 },
  ],
  combatStart: { freq: 280, duration: 0.32, type: 'sawtooth', volume: 0.06, slideTo: 540 },
}

export function playSoundPreset(name, ctx = getContext()) {
  const spec = SOUND_PRESETS[name]
  if (!spec) return
  if (Array.isArray(spec)) playSequence(spec, ctx)
  else playTone(spec, ctx)
}
