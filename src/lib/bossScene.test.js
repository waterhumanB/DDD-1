import test from 'node:test'
import assert from 'node:assert/strict'
import { getBossHpFromProgress, getBossScrollDistance } from './bossScene.js'

test('getBossScrollDistance scales with hp and viewport height', () => {
  assert.equal(getBossScrollDistance(5, 1000), 3750)
  assert.equal(getBossScrollDistance(10, 800), 6000)
})

test('getBossHpFromProgress only loses one hp per progress step', () => {
  assert.equal(getBossHpFromProgress(5, 0), 5)
  assert.equal(getBossHpFromProgress(5, 0.19), 5)
  assert.equal(getBossHpFromProgress(5, 0.2), 4)
  assert.equal(getBossHpFromProgress(5, 0.4), 3)
  assert.equal(getBossHpFromProgress(5, 0.8), 1)
  assert.equal(getBossHpFromProgress(5, 1), 0)
})

test('getBossHpFromProgress clamps unexpected values', () => {
  assert.equal(getBossHpFromProgress(5, -1), 5)
  assert.equal(getBossHpFromProgress(5, 2), 0)
  assert.equal(getBossHpFromProgress(0, 0.5), 1)
})

