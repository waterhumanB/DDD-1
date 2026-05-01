export function isBossScene(scene) {
  return scene?.monster?.mode === 'boss'
}

export function isBossDefeated(scene, completedBosses = {}, clearedMonsters = {}) {
  if (!scene) return true
  if (clearedMonsters[scene.id]) return true
  if (completedBosses[scene.id]) return true
  return false
}

export function findNeighbor(scenes, currentSceneId, direction) {
  if (!Array.isArray(scenes) || !currentSceneId || !direction) return null
  const current = scenes.find((s) => s.id === currentSceneId)
  if (!current) return null
  if (current.next && current.next.direction === direction) {
    return scenes.find((s) => s.id === current.next.sceneId) || null
  }
  if (current.prev && current.prev.direction === direction) {
    return scenes.find((s) => s.id === current.prev.sceneId) || null
  }
  return null
}

export function canMove(scenes, currentSceneId, direction, completedBosses = {}, clearedMonsters = {}) {
  const target = findNeighbor(scenes, currentSceneId, direction)
  if (!target) return false
  const current = scenes.find((s) => s.id === currentSceneId)
  if (!isBossScene(current)) return true
  return isBossDefeated(current, completedBosses, clearedMonsters)
}

export function indexOfScene(scenes, sceneId) {
  if (!Array.isArray(scenes)) return -1
  return scenes.findIndex((s) => s.id === sceneId)
}

export function isReverseDirection(direction) {
  return direction === 'left' || direction === 'down'
}

export function nextSceneFor(scenes, currentSceneId) {
  if (!Array.isArray(scenes) || !currentSceneId) return null
  const current = scenes.find((s) => s.id === currentSceneId)
  return current?.next || null
}
