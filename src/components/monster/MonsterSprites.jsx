// Monster sprites — react-icons Game Icons (CC-BY 3.0)
// Source: https://game-icons.net (delapouite, lorc et al.)
import {
  GiSlime,
  GiWolfHead,
  GiGiant,
  GiDevilMask,
  GiBatWing,
  GiHoodedFigure,
} from 'react-icons/gi'

function makeSprite(Icon, color) {
  return function Sprite() {
    return (
      <Icon
        className="monster__sprite"
        color={color}
        aria-hidden="true"
        focusable="false"
      />
    )
  }
}

const ShadowSprite = makeSprite(GiHoodedFigure, '#7a1f8a')
const SlimeSprite = makeSprite(GiSlime, '#6bff9a')
const GiantSprite = makeSprite(GiGiant, '#c44545')
const DemonSprite = makeSprite(GiDevilMask, '#ff3bd0')
const WolfSprite = makeSprite(GiWolfHead, '#9aa1aa')
const BatSprite = makeSprite(GiBatWing, '#5a1f8a')

export const monsterSprites = {
  shadow: ShadowSprite,
  slime: SlimeSprite,
  giant: GiantSprite,
  demon: DemonSprite,
  wolf: WolfSprite,
  bat: BatSprite,
}
