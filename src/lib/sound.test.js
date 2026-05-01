import test from 'node:test'
import assert from 'node:assert/strict'
import { SOUND_PRESETS, playSequence, playSoundPreset, playTone } from './sound.js'

function makeMockContext() {
  const log = { oscillators: [], gains: [], connections: [] }
  const ctx = {
    currentTime: 0,
    state: 'running',
    destination: { __dest: true },
    createOscillator() {
      const osc = {
        type: 'sine',
        frequency: {
          setValueAtTime(value) { osc._setFreq = value },
          exponentialRampToValueAtTime(value, time) { osc._slideTo = { value, time } },
        },
        connect(target) { log.connections.push(['osc', target]); return target },
        start(t) { osc._startAt = t },
        stop(t) { osc._stopAt = t },
      }
      log.oscillators.push(osc)
      return osc
    },
    createGain() {
      const gain = {
        gain: {
          setValueAtTime(value, time) { gain._level = value; gain._setAt = time },
          linearRampToValueAtTime(value, time) { gain._attackTo = { value, time } },
          exponentialRampToValueAtTime(value, time) { gain._releaseTo = { value, time } },
        },
        connect(target) { log.connections.push(['gain', target]); return target },
      }
      log.gains.push(gain)
      return gain
    },
  }
  return { ctx, log }
}

test('playTone wires oscillator → gain → destination with correct schedule', () => {
  const { ctx, log } = makeMockContext()
  playTone({ freq: 440, duration: 0.1, type: 'square', volume: 0.08 }, ctx)

  assert.equal(log.oscillators.length, 1)
  assert.equal(log.gains.length, 1)
  const osc = log.oscillators[0]
  assert.equal(osc.type, 'square')
  assert.equal(osc._setFreq, 440)
  assert.equal(osc._startAt, 0)
  assert.ok(Math.abs(osc._stopAt - 0.12) < 1e-6)
})

test('playTone applies slideTo as exponential frequency ramp', () => {
  const { ctx, log } = makeMockContext()
  playTone({ freq: 800, duration: 0.1, slideTo: 200 }, ctx)
  assert.deepEqual(log.oscillators[0]._slideTo, { value: 200, time: 0.1 })
})

test('playTone clamps zero or negative slideTo to a positive minimum', () => {
  const { ctx, log } = makeMockContext()
  playTone({ freq: 800, duration: 0.1, slideTo: 0 }, ctx)
  assert.equal(log.oscillators[0]._slideTo.value, 1)
})

test('playSequence schedules each spec sequentially', () => {
  const { ctx, log } = makeMockContext()
  playSequence(
    [
      { freq: 100, duration: 0.1, gap: 0.1 },
      { freq: 200, duration: 0.1, gap: 0.1 },
      { freq: 300, duration: 0.1 },
    ],
    ctx
  )
  assert.equal(log.oscillators.length, 3)
  assert.equal(log.oscillators[0]._startAt, 0)
  assert.equal(log.oscillators[1]._startAt, 0.1)
  assert.equal(log.oscillators[2]._startAt, 0.2)
})

test('playSoundPreset handles single-tone presets', () => {
  const { ctx, log } = makeMockContext()
  playSoundPreset('attack', ctx)
  assert.equal(log.oscillators.length, 1)
  assert.equal(log.oscillators[0]._setFreq, SOUND_PRESETS.attack.freq)
})

test('playSoundPreset handles sequence presets', () => {
  const { ctx, log } = makeMockContext()
  playSoundPreset('bossDefeat', ctx)
  assert.equal(log.oscillators.length, SOUND_PRESETS.bossDefeat.length)
})

test('playSoundPreset is a no-op for unknown preset names', () => {
  const { ctx, log } = makeMockContext()
  playSoundPreset('does-not-exist', ctx)
  assert.equal(log.oscillators.length, 0)
})

test('playTone is a no-op without a context', () => {
  assert.doesNotThrow(() => playTone({ freq: 440 }, null))
})
