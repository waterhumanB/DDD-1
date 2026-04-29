const MIN_BOSS_PIN_DISTANCE = 1

export function getBossPinDistance(viewportHeight) {
  const safeViewportHeight = Math.max(1, Number(viewportHeight) || 0)

  return Math.max(MIN_BOSS_PIN_DISTANCE, Math.round(safeViewportHeight))
}

export function shouldLockBossScroll(
  sceneId,
  completedBosses = {},
  hpByScene = {},
  fallbackHp = 0
) {
  if (!sceneId) return false
  if (completedBosses?.[sceneId]) return false

  const hp = Number(hpByScene?.[sceneId] ?? fallbackHp)
  return hp > 0
}
