import test from 'node:test'
import assert from 'node:assert/strict'
import {
  PROXIMITY_THRESHOLD,
  SCENE_DISCOVERIES,
  distance,
  findActiveDiscovery,
} from './discoveries.js'

test('distance is symmetric and zero at same point', () => {
  assert.equal(distance(0.5, 0.5, 0.5, 0.5), 0)
  assert.equal(distance(0, 0, 0.3, 0.4), 0.5)
  assert.equal(distance(0.3, 0.4, 0, 0), 0.5)
})

test('findActiveDiscovery returns null when none in range', () => {
  const items = [{ x: 0.1, y: 0.1, text: 'a' }]
  assert.equal(findActiveDiscovery(items, 0.9, 0.9), null)
})

test('findActiveDiscovery returns the closest within threshold', () => {
  const a = { x: 0.3, y: 0.3, text: 'A' }
  const b = { x: 0.5, y: 0.5, text: 'B' }
  const result = findActiveDiscovery([a, b], 0.32, 0.32)
  assert.equal(result, a)
})

test('findActiveDiscovery handles empty / non-array gracefully', () => {
  assert.equal(findActiveDiscovery(null, 0.5, 0.5), null)
  assert.equal(findActiveDiscovery([], 0.5, 0.5), null)
})

test('every of the 14 stages has at least one discovery', () => {
  const ids = Object.keys(SCENE_DISCOVERIES)
  assert.equal(ids.length, 14, 'must have 14 stages')
  for (const id of ids) {
    assert.ok(
      Array.isArray(SCENE_DISCOVERIES[id]) && SCENE_DISCOVERIES[id].length > 0,
      `${id} must have discoveries`
    )
  }
})

test('all discovery coordinates are within 0..1', () => {
  for (const [id, items] of Object.entries(SCENE_DISCOVERIES)) {
    items.forEach((item, i) => {
      assert.ok(item.x >= 0 && item.x <= 1, `${id}[${i}].x out of range`)
      assert.ok(item.y >= 0 && item.y <= 1, `${id}[${i}].y out of range`)
      assert.equal(typeof item.text, 'string', `${id}[${i}].text`)
    })
  }
})

test('PROXIMITY_THRESHOLD is positive', () => {
  assert.ok(PROXIMITY_THRESHOLD > 0)
})
