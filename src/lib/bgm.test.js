import test from 'node:test'
import assert from 'node:assert/strict'
import { BGM_PATTERNS, SCENE_BGM } from './bgm.js'

test('every BGM pattern has positive cycle and at least one note', () => {
  for (const [mood, pattern] of Object.entries(BGM_PATTERNS)) {
    assert.ok(pattern.cycleSec > 0, `${mood} cycleSec must be > 0`)
    assert.ok(Array.isArray(pattern.notes), `${mood} notes must be array`)
    assert.ok(pattern.notes.length > 0, `${mood} must have notes`)
  }
})

test('every note in every pattern has valid shape', () => {
  for (const [mood, pattern] of Object.entries(BGM_PATTERNS)) {
    pattern.notes.forEach((note, i) => {
      assert.equal(typeof note.time, 'number', `${mood}[${i}] time`)
      assert.equal(typeof note.freq, 'number', `${mood}[${i}] freq`)
      assert.ok(note.freq > 0, `${mood}[${i}] freq must be positive`)
      assert.equal(typeof note.duration, 'number', `${mood}[${i}] duration`)
      assert.ok(note.duration > 0, `${mood}[${i}] duration must be positive`)
      assert.ok(note.time >= 0, `${mood}[${i}] time must be >= 0`)
    })
  }
})

test('every scene id maps to a defined BGM mood', () => {
  for (const [sceneId, mood] of Object.entries(SCENE_BGM)) {
    assert.ok(BGM_PATTERNS[mood], `${sceneId} → ${mood} must exist in BGM_PATTERNS`)
  }
})

test('all 14 stages have bgm mapping', () => {
  for (let i = 1; i <= 14; i++) {
    const stageKey = Object.keys(SCENE_BGM).find((k) => k.startsWith(`stage-${String(i).padStart(2, '0')}`))
    assert.ok(stageKey, `stage-${i} must have a bgm mapping`)
  }
})
