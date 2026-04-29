import test from 'node:test'
import assert from 'node:assert/strict'
import { lockScrollAt, clearScrollLock, restoreLockedScroll } from './scrollLock.js'

function makeWindow(initialScrollY = 0) {
  const calls = []
  return {
    scrollY: initialScrollY,
    scrollTo(x, y) {
      calls.push([x, y])
      this.scrollY = y
    },
    calls,
  }
}

test('lockScrollAt rounds and stores explicit scroll position', () => {
  const ref = { current: null }
  lockScrollAt(ref, 412.6)
  assert.equal(ref.current, 413)
})

test('clearScrollLock resets the locked position', () => {
  const ref = { current: 200 }
  clearScrollLock(ref)
  assert.equal(ref.current, null)
})

test('restoreLockedScroll is a no-op when nothing is locked', () => {
  const ref = { current: null }
  const fakeWindow = makeWindow(0)
  global.window = fakeWindow
  restoreLockedScroll(ref)
  assert.equal(fakeWindow.calls.length, 0)
})

test('restoreLockedScroll skips if already within 1px of target', () => {
  const ref = { current: 100 }
  const fakeWindow = makeWindow(100.5)
  global.window = fakeWindow
  restoreLockedScroll(ref)
  assert.equal(fakeWindow.calls.length, 0)
})

test('restoreLockedScroll snaps back when drifted beyond 1px', () => {
  const ref = { current: 100 }
  const fakeWindow = makeWindow(150)
  global.window = fakeWindow
  restoreLockedScroll(ref)
  assert.deepEqual(fakeWindow.calls, [[0, 100]])
})
