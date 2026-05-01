import test from 'node:test'
import assert from 'node:assert/strict'
import {
  canMove,
  findNeighbor,
  indexOfScene,
  isBossDefeated,
  isBossScene,
  isReverseDirection,
  nextSceneFor,
} from './navigation.js'

const link = (sceneId, direction) => ({ sceneId, direction })

const SCENES = [
  { id: 'a', monster: null, next: link('b', 'right'), prev: null },
  { id: 'b', monster: { mode: 'auto', hp: 1 }, next: link('c', 'up'), prev: link('a', 'left') },
  { id: 'c', monster: { mode: 'boss', hp: 5 }, next: link('d', 'left'), prev: link('b', 'down') },
  { id: 'd', monster: null, next: null, prev: link('c', 'right') },
]

test('isBossScene only matches boss mode', () => {
  assert.equal(isBossScene(SCENES[0]), false)
  assert.equal(isBossScene(SCENES[1]), false)
  assert.equal(isBossScene(SCENES[2]), true)
})

test('findNeighbor follows explicit next direction', () => {
  assert.equal(findNeighbor(SCENES, 'a', 'right')?.id, 'b')
  assert.equal(findNeighbor(SCENES, 'b', 'up')?.id, 'c')
  assert.equal(findNeighbor(SCENES, 'c', 'left')?.id, 'd')
})

test('findNeighbor follows explicit prev direction', () => {
  assert.equal(findNeighbor(SCENES, 'b', 'left')?.id, 'a')
  assert.equal(findNeighbor(SCENES, 'c', 'down')?.id, 'b')
  assert.equal(findNeighbor(SCENES, 'd', 'right')?.id, 'c')
})

test('findNeighbor blocks invalid directions', () => {
  assert.equal(findNeighbor(SCENES, 'a', 'left'), null)
  assert.equal(findNeighbor(SCENES, 'a', 'up'), null)
  assert.equal(findNeighbor(SCENES, 'a', 'down'), null)
  assert.equal(findNeighbor(SCENES, 'b', 'right'), null)
  assert.equal(findNeighbor(SCENES, 'b', 'down'), null)
  assert.equal(findNeighbor(SCENES, 'd', 'up'), null)
  assert.equal(findNeighbor(SCENES, 'd', 'left'), null)
})

test('findNeighbor handles bad inputs', () => {
  assert.equal(findNeighbor(null, 'a', 'right'), null)
  assert.equal(findNeighbor(SCENES, 'missing', 'right'), null)
  assert.equal(findNeighbor(SCENES, 'a', 'invalid'), null)
})

test('canMove blocks when no neighbor', () => {
  assert.equal(canMove(SCENES, 'a', 'up'), false)
  assert.equal(canMove(SCENES, 'd', 'up'), false)
})

test('canMove allows when next/prev direction matches', () => {
  assert.equal(canMove(SCENES, 'a', 'right'), true)
  assert.equal(canMove(SCENES, 'b', 'up'), true)
  assert.equal(canMove(SCENES, 'b', 'left'), true)
})

test('canMove blocks at undefeated boss', () => {
  assert.equal(canMove(SCENES, 'c', 'left'), false)
  assert.equal(canMove(SCENES, 'c', 'left', { c: true }), true)
  assert.equal(canMove(SCENES, 'c', 'left', {}, { c: true }), true)
})

test('isBossDefeated returns true for null scene', () => {
  assert.equal(isBossDefeated(null), true)
})

test('indexOfScene returns -1 for missing scene', () => {
  assert.equal(indexOfScene(SCENES, 'missing'), -1)
  assert.equal(indexOfScene(null, 'a'), -1)
  assert.equal(indexOfScene(SCENES, 'b'), 1)
})

test('isReverseDirection identifies left/down', () => {
  assert.equal(isReverseDirection('left'), true)
  assert.equal(isReverseDirection('down'), true)
  assert.equal(isReverseDirection('right'), false)
  assert.equal(isReverseDirection('up'), false)
})

test('nextSceneFor returns the next link', () => {
  assert.deepEqual(nextSceneFor(SCENES, 'a'), { sceneId: 'b', direction: 'right' })
  assert.equal(nextSceneFor(SCENES, 'd'), null)
})
