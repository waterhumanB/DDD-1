import { useCallback, useEffect, useRef, useState } from 'react'

const SPEED_X = 1.6
const SPEED_Y = 2.4
const EDGE_RIGHT = 0.96
const EDGE_LEFT = 0.04
const EDGE_BOTTOM = 0.96
const EDGE_TOP = 0.04
const INITIAL = { x: 0.5, y: 0.85 }
const DIAGONAL = 1 / Math.sqrt(2)
const STEP_INTERVAL_MS = 320
const PROXIMITY_REACT_THRESHOLD = 0.04
const RESET_HELD = () => ({ left: false, right: false, up: false, down: false })

const KEY_TO_DIR = {
  ArrowLeft: 'left',
  ArrowRight: 'right',
  ArrowUp: 'up',
  ArrowDown: 'down',
}

export function useCharacter({ onEdge, onStep, blockedRef, surfaceRef }) {
  const [reactPos, setReactPos] = useState(INITIAL)
  const [facing, setFacing] = useState('right')
  const posRef = useRef(INITIAL)
  const reactPosRef = useRef(INITIAL)
  const heldRef = useRef(RESET_HELD())
  const lockXRef = useRef(false)
  const lockYRef = useRef(false)
  const lastStepAtRef = useRef(0)
  const frameRef = useRef(null)
  const lastTimeRef = useRef(0)
  const onEdgeRef = useRef(onEdge)
  const onStepRef = useRef(onStep)
  onEdgeRef.current = onEdge
  onStepRef.current = onStep

  const writeSurface = useCallback((x, y) => {
    const el = surfaceRef?.current
    if (!el) return
    el.style.setProperty('--character-x', String(x))
    el.style.setProperty('--character-y', String(y))
  }, [surfaceRef])

  const maybeReactSync = useCallback((x, y) => {
    const last = reactPosRef.current
    if (
      Math.abs(x - last.x) >= PROXIMITY_REACT_THRESHOLD ||
      Math.abs(y - last.y) >= PROXIMITY_REACT_THRESHOLD
    ) {
      reactPosRef.current = { x, y }
      setReactPos({ x, y })
    }
  }, [])

  const stopLoop = useCallback(() => {
    if (frameRef.current) {
      cancelAnimationFrame(frameRef.current)
      frameRef.current = null
    }
  }, [])

  const tick = useCallback(
    (now) => {
      const dt = Math.min(0.1, (now - lastTimeRef.current) / 1000)
      lastTimeRef.current = now
      if (blockedRef?.current) {
        heldRef.current = RESET_HELD()
        stopLoop()
        return
      }
      const held = heldRef.current
      let dx = (held.right ? 1 : 0) - (held.left ? 1 : 0)
      let dy = (held.down ? 1 : 0) - (held.up ? 1 : 0)
      if (dx === 0 && dy === 0) {
        stopLoop()
        return
      }
      if (dx !== 0 && dy !== 0) { dx *= DIAGONAL; dy *= DIAGONAL }
      if (now - lastStepAtRef.current >= STEP_INTERVAL_MS) {
        lastStepAtRef.current = now
        onStepRef.current?.()
      }
      const cur = posRef.current
      let nextX = cur.x + dx * SPEED_X * dt
      let nextY = cur.y + dy * SPEED_Y * dt

      if (nextX >= EDGE_RIGHT && !lockXRef.current && dx > 0) {
        lockXRef.current = true
        onEdgeRef.current?.('right')
        frameRef.current = requestAnimationFrame(tick)
        return
      }
      if (nextX <= EDGE_LEFT && !lockXRef.current && dx < 0) {
        lockXRef.current = true
        onEdgeRef.current?.('left')
        frameRef.current = requestAnimationFrame(tick)
        return
      }
      if (nextY >= EDGE_BOTTOM && !lockYRef.current && dy > 0) {
        lockYRef.current = true
        onEdgeRef.current?.('down')
        frameRef.current = requestAnimationFrame(tick)
        return
      }
      if (nextY <= EDGE_TOP && !lockYRef.current && dy < 0) {
        lockYRef.current = true
        onEdgeRef.current?.('up')
        frameRef.current = requestAnimationFrame(tick)
        return
      }
      if (nextX < EDGE_RIGHT - 0.05 && nextX > EDGE_LEFT + 0.05) lockXRef.current = false
      if (nextY < EDGE_BOTTOM - 0.05 && nextY > EDGE_TOP + 0.05) lockYRef.current = false

      nextX = Math.max(EDGE_LEFT, Math.min(EDGE_RIGHT, nextX))
      nextY = Math.max(EDGE_TOP, Math.min(EDGE_BOTTOM, nextY))
      if (nextX !== cur.x || nextY !== cur.y) {
        posRef.current = { x: nextX, y: nextY }
        writeSurface(nextX, nextY)
        maybeReactSync(nextX, nextY)
      }
      frameRef.current = requestAnimationFrame(tick)
    },
    [blockedRef, writeSurface, maybeReactSync, stopLoop]
  )

  const startLoop = useCallback(() => {
    if (frameRef.current) return
    lastTimeRef.current = performance.now()
    frameRef.current = requestAnimationFrame(tick)
  }, [tick])

  useEffect(() => {
    writeSurface(INITIAL.x, INITIAL.y)
  }, [writeSurface])

  useEffect(() => {
    const onKeyDown = (event) => {
      if (blockedRef?.current) return
      const dir = KEY_TO_DIR[event.code]
      if (!dir) return
      event.preventDefault()
      heldRef.current[dir] = true
      if (dir === 'left') setFacing('left')
      else if (dir === 'right') setFacing('right')
      startLoop()
    }
    const onKeyUp = (event) => {
      const dir = KEY_TO_DIR[event.code]
      if (!dir) return
      heldRef.current[dir] = false
    }
    const onBlur = () => { heldRef.current = RESET_HELD() }
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    window.addEventListener('blur', onBlur)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
      window.removeEventListener('blur', onBlur)
      stopLoop()
    }
  }, [blockedRef, startLoop, stopLoop])

  const placeAtSpawn = useCallback(
    (direction) => {
      // 새 방 진입 시 캐릭터를 중앙(약간 아래)에 배치
      const next = { x: INITIAL.x, y: INITIAL.y }
      posRef.current = next
      reactPosRef.current = next
      setReactPos(next)
      writeSurface(next.x, next.y)
      if (direction === 'right') setFacing('right')
      else if (direction === 'left') setFacing('left')
      lockXRef.current = false
      lockYRef.current = false
    },
    [writeSurface]
  )

  return { x: reactPos.x, y: reactPos.y, facing, placeAtSpawn }
}
