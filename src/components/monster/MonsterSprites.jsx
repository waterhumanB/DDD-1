const ShadowSprite = () => (
  <svg viewBox="0 0 12 12" className="monster__sprite">
    <g shapeRendering="crispEdges">
      <rect x="3" y="2" width="6" height="1" fill="#1a0a2e" opacity="0.7" />
      <rect x="2" y="3" width="8" height="6" fill="#1a0a2e" opacity="0.9" />
      <rect x="1" y="4" width="1" height="4" fill="#1a0a2e" opacity="0.6" />
      <rect x="10" y="4" width="1" height="4" fill="#1a0a2e" opacity="0.6" />
      <rect x="3" y="9" width="2" height="1" fill="#1a0a2e" opacity="0.4" />
      <rect x="7" y="9" width="2" height="1" fill="#1a0a2e" opacity="0.4" />
      <rect x="4" y="5" width="1" height="1" fill="#ff5577" />
      <rect x="7" y="5" width="1" height="1" fill="#ff5577" />
    </g>
  </svg>
)

const SlimeSprite = () => (
  <svg viewBox="0 0 12 12" className="monster__sprite">
    <g shapeRendering="crispEdges">
      <rect x="4" y="5" width="4" height="1" fill="#6bff9a" />
      <rect x="3" y="6" width="6" height="4" fill="#6bff9a" />
      <rect x="2" y="7" width="1" height="3" fill="#6bff9a" />
      <rect x="9" y="7" width="1" height="3" fill="#6bff9a" />
      <rect x="4" y="6" width="1" height="1" fill="#fff" opacity="0.7" />
      <rect x="4" y="7" width="1" height="1" fill="#000" />
      <rect x="7" y="7" width="1" height="1" fill="#000" />
    </g>
  </svg>
)

const GiantSprite = () => (
  <svg viewBox="0 0 12 12" className="monster__sprite">
    <g shapeRendering="crispEdges">
      <rect x="2" y="4" width="8" height="7" fill="#7a3030" />
      <rect x="3" y="3" width="6" height="1" fill="#7a3030" />
      <rect x="3" y="1" width="6" height="3" fill="#a04040" />
      <rect x="2" y="2" width="1" height="2" fill="#a04040" />
      <rect x="9" y="2" width="1" height="2" fill="#a04040" />
      <rect x="4" y="2" width="1" height="1" fill="#ffd54a" />
      <rect x="7" y="2" width="1" height="1" fill="#ffd54a" />
      <rect x="4" y="3" width="1" height="1" fill="#fff" />
      <rect x="7" y="3" width="1" height="1" fill="#fff" />
      <rect x="0" y="5" width="2" height="3" fill="#7a3030" />
      <rect x="10" y="5" width="2" height="3" fill="#7a3030" />
    </g>
  </svg>
)

const DemonSprite = () => (
  <svg viewBox="-1 -2 14 14" className="monster__sprite">
    <g shapeRendering="crispEdges">
      <rect x="2" y="0" width="2" height="2" fill="#1a0a2e" />
      <rect x="8" y="0" width="2" height="2" fill="#1a0a2e" />
      <rect x="3" y="-1" width="1" height="1" fill="#1a0a2e" />
      <rect x="8" y="-1" width="1" height="1" fill="#1a0a2e" />
      <rect x="2" y="1" width="8" height="4" fill="#7a1f50" />
      <rect x="3" y="2" width="2" height="2" fill="#ffd54a" />
      <rect x="7" y="2" width="2" height="2" fill="#ffd54a" />
      <rect x="3" y="3" width="2" height="1" fill="#ff5577" />
      <rect x="7" y="3" width="2" height="1" fill="#ff5577" />
      <rect x="4" y="4" width="4" height="1" fill="#000" />
      <rect x="5" y="4" width="1" height="1" fill="#fff" />
      <rect x="6" y="4" width="1" height="1" fill="#fff" />
      <rect x="2" y="5" width="8" height="6" fill="#3d0e3a" />
      <rect x="0" y="6" width="2" height="3" fill="#3d0e3a" />
      <rect x="10" y="6" width="2" height="3" fill="#3d0e3a" />
      <rect x="5" y="7" width="2" height="1" fill="#ff5577" />
      <rect x="5" y="9" width="2" height="1" fill="#ff5577" />
    </g>
  </svg>
)

export const monsterSprites = {
  shadow: ShadowSprite,
  slime: SlimeSprite,
  giant: GiantSprite,
  demon: DemonSprite,
}
