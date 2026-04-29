import test from 'node:test'
import assert from 'node:assert/strict'
import { getBossPinDistance, shouldLockBossScroll } from './bossScene.js'

test('getBossPinDistance keeps manual boss combat inside a stable one-screen pin range', () => {
  assert.equal(getBossPinDistance(1000), 1000)
  assert.equal(getBossPinDistance(80), 80)
  assert.equal(getBossPinDistance(0), 1)
})

test('shouldLockBossScroll only locks active undefeated bosses with hp remaining', () => {
  assert.equal(shouldLockBossScroll(null, {}, {}, 5), false)
  assert.equal(shouldLockBossScroll('boss', {}, {}, 5), true)
  assert.equal(shouldLockBossScroll('boss', {}, { boss: 2 }, 5), true)
  assert.equal(shouldLockBossScroll('boss', {}, { boss: 0 }, 5), false)
  assert.equal(shouldLockBossScroll('boss', { boss: true }, { boss: 2 }, 5), false)
})
