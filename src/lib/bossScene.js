const BOSS_SCROLL_SCREENS_PER_HP = 0.75

export function getBossScrollDistance(maxHp, viewportHeight) {
  const safeHp = Math.max(1, Number(maxHp) || 1)
  const safeViewportHeight = Math.max(1, Number(viewportHeight) || 0)

  return Math.round(safeHp * safeViewportHeight * BOSS_SCROLL_SCREENS_PER_HP)
}

export function getBossHpFromProgress(maxHp, progress) {
  const safeHp = Math.max(1, Math.round(Number(maxHp) || 1))
  const clampedProgress = Math.min(1, Math.max(0, Number(progress) || 0))
  const lostHp = Math.min(safeHp, Math.floor(clampedProgress * safeHp + 1e-9))

  return Math.max(0, safeHp - lostHp)
}

