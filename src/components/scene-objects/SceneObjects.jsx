// 씬별 오브젝트 — react-icons의 Game Icons (CC-BY 3.0).
// 출처: https://game-icons.net (delapouite, lorc 등)
// Attribution: HUD 또는 풋터에 한 번 표시.
//
// 각 오브젝트는 위치(x: 0~1, bottom: 0~100 vh) + 크기 + 색.

import {
  GiPineTree,
  GiOakLeaf,
  GiUnicorn,
  GiAnvil,
  GiHammerNails,
  GiBrokenBone,
  GiMountains,
  GiMountainCave,
  GiDragonHead,
  GiCrystalCluster,
  GiWoodenSign,
  GiCampfire,
  GiTombstone,
  GiVillage,
  GiAbstract021,
  GiSpellBook,
  GiSwordWound,
  GiStarSwirl,
  GiSunbeams,
} from 'react-icons/gi'

const ICON_KIND = {
  pine: GiPineTree,
  oak: GiOakLeaf,
  unicorn: GiUnicorn,
  anvil: GiAnvil,
  hammer: GiHammerNails,
  brokenBone: GiBrokenBone,
  mountains: GiMountains,
  cave: GiMountainCave,
  dragon: GiDragonHead,
  crystal: GiCrystalCluster,
  sign: GiWoodenSign,
  campfire: GiCampfire,
  tomb: GiTombstone,
  village: GiVillage,
  swirl: GiAbstract021,
  spell: GiSpellBook,
  sword: GiSwordWound,
  star: GiStarSwirl,
  sun: GiSunbeams,
}

// 씬별 배치 — { kind, x(0~1), y(vh from bottom), size(px), color, opacity }
const SCENE_OBJECTS = {
  'stage-01-village': [
    { kind: 'village',  x: 0.18, y: 18, size: 110, color: '#d4a373' },
    { kind: 'pine',     x: 0.85, y: 22, size: 90,  color: '#1f4a2a' },
    { kind: 'campfire', x: 0.5,  y: 14, size: 60,  color: '#ff7733' },
  ],
  'stage-02-forest': [
    { kind: 'pine', x: 0.08, y: 16, size: 130, color: '#1f4a2a' },
    { kind: 'pine', x: 0.22, y: 20, size: 100, color: '#2a5a36', opacity: 0.85 },
    { kind: 'pine', x: 0.42, y: 14, size: 110, color: '#1a3f24' },
    { kind: 'pine', x: 0.78, y: 18, size: 120, color: '#1f4a2a' },
    { kind: 'pine', x: 0.92, y: 22, size: 90,  color: '#2a5a36', opacity: 0.8 },
    { kind: 'oak',  x: 0.6,  y: 24, size: 70,  color: '#3d6a3a', opacity: 0.85 },
  ],
  'stage-03-unicorn': [
    { kind: 'unicorn', x: 0.62, y: 22, size: 130, color: '#fff' },
    { kind: 'pine',    x: 0.15, y: 18, size: 90,  color: '#3d6a4a', opacity: 0.7 },
    { kind: 'star',    x: 0.78, y: 60, size: 40,  color: '#d8a8e8' },
    { kind: 'star',    x: 0.4,  y: 70, size: 30,  color: '#ffd54a', opacity: 0.7 },
  ],
  'stage-04-guild': [
    { kind: 'spell',   x: 0.18, y: 22, size: 90,  color: '#8aa9ff' },
    { kind: 'crystal', x: 0.85, y: 22, size: 80,  color: '#d8a8e8' },
    { kind: 'star',    x: 0.5,  y: 70, size: 36,  color: '#ffd54a', opacity: 0.6 },
  ],
  'stage-05-cave-entrance': [
    { kind: 'cave', x: 0.5,  y: 16, size: 200, color: '#3a2a20' },
    { kind: 'sign', x: 0.16, y: 20, size: 80,  color: '#7a4a26' },
  ],
  'stage-06-cave-bugs': [
    { kind: 'crystal', x: 0.18, y: 18, size: 90,  color: '#9555c4' },
    { kind: 'crystal', x: 0.82, y: 22, size: 100, color: '#6a3590' },
    { kind: 'tomb',    x: 0.5,  y: 14, size: 70,  color: '#5a4a3a', opacity: 0.7 },
  ],
  'stage-07-forge': [
    { kind: 'anvil',  x: 0.5,  y: 16, size: 130, color: '#3a3a3a' },
    { kind: 'hammer', x: 0.22, y: 22, size: 80,  color: '#7a5a3a' },
    { kind: 'campfire', x: 0.78, y: 18, size: 75, color: '#ff7733' },
  ],
  'stage-08-broken-bridge': [
    { kind: 'brokenBone', x: 0.4, y: 18, size: 110, color: '#5a3a1e' },
    { kind: 'brokenBone', x: 0.65, y: 18, size: 110, color: '#5a3a1e', opacity: 0.85 },
  ],
  'stage-09-giant-boss': [
    { kind: 'sword', x: 0.5, y: 16, size: 90, color: '#a04040' },
  ],
  'stage-10-mist-forest': [
    { kind: 'pine',  x: 0.12, y: 18, size: 100, color: '#5a6478', opacity: 0.6 },
    { kind: 'pine',  x: 0.85, y: 22, size: 110, color: '#4a5468', opacity: 0.55 },
    { kind: 'swirl', x: 0.5,  y: 60, size: 100, color: '#9ab0c8', opacity: 0.5 },
  ],
  'stage-11-dragon-mountain': [
    { kind: 'mountains', x: 0.5, y: 12, size: 280, color: '#3a4458' },
    { kind: 'mountains', x: 0.18, y: 16, size: 160, color: '#2a3045', opacity: 0.7 },
    { kind: 'mountains', x: 0.82, y: 16, size: 180, color: '#2a3045', opacity: 0.7 },
  ],
  'stage-12-dragon-nest': [
    { kind: 'crystal', x: 0.28, y: 18, size: 80, color: '#9d2a66' },
    { kind: 'crystal', x: 0.72, y: 20, size: 90, color: '#7a1f50' },
    { kind: 'tomb',    x: 0.5,  y: 14, size: 70, color: '#3a1525' },
  ],
  'stage-13-dragon-fight': [
    { kind: 'dragon',   x: 0.5, y: 16, size: 200, color: '#5a0e1f' },
  ],
  'stage-14-hero-awaken': [
    { kind: 'sun',     x: 0.5, y: 60, size: 240, color: '#ffd54a', opacity: 0.6 },
    { kind: 'crystal', x: 0.3, y: 22, size: 80,  color: '#fff' },
    { kind: 'crystal', x: 0.7, y: 22, size: 80,  color: '#ff85e0' },
  ],
}

import { memo } from 'react'

function SceneObjects({ sceneId }) {
  const objects = SCENE_OBJECTS[sceneId] || []
  if (objects.length === 0) return null
  return (
    <div className="scene-objects" aria-hidden="true">
      {objects.map((obj, idx) => {
        const Icon = ICON_KIND[obj.kind]
        if (!Icon) return null
        return (
          <div
            key={idx}
            className={`scene-object scene-object--${obj.kind}`}
            style={{
              left: `${obj.x * 100}%`,
              bottom: `${obj.y}%`,
              opacity: obj.opacity ?? 1,
            }}
          >
            <Icon size={obj.size} color={obj.color} />
          </div>
        )
      })}
    </div>
  )
}

export default memo(SceneObjects)
