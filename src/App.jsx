import { useCallback, useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import { scenes } from './data/scenes'
import { useGameOrchestrator } from './hooks/useGameOrchestrator.js'
import { useCombatEffects } from './hooks/useCombatEffects.js'
import { useCombatInput } from './hooks/useCombatInput.js'
import { usePartyJump } from './hooks/usePartyJump.js'
import Scene from './components/Scene'
import Party from './components/Party'
import Monster from './components/Monster'
import Hud from './components/Hud'
import CombatPrompt from './components/CombatPrompt'
import EffectsLayer from './components/EffectsLayer'
import BattleOverlay from './components/BattleOverlay'
import ScrollHint from './components/ScrollHint'

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)

export default function App() {
  const partyRef = useRef(null)
  const monsterRef = useRef(null)
  const combatResetRef = useRef(() => {})
  const onCombatReset = useCallback(() => combatResetRef.current?.(), [])

  const game = useGameOrchestrator(scenes, { partyRef, monsterRef, onCombatReset })
  const { slashes, impactWords, combatBolts, reset: resetCombatEffects } =
    useCombatEffects({
      attackTrigger: game.attackTrigger,
      isCombatActive: Boolean(game.activeCombatSceneId),
      partyRef,
      monsterRef,
      isFinisherRef: game.isFinisherRef,
    })

  useEffect(() => {
    combatResetRef.current = resetCombatEffects
  }, [resetCombatEffects])

  useCombatInput(Boolean(game.activeCombatSceneId), game.triggerAttack)
  usePartyJump(partyRef, game.currentSceneIndex)

  const currentScene = scenes[game.currentSceneIndex]
  const isCombatActive = Boolean(game.activeCombatSceneId)
  const isCurrentMonsterCleared = Boolean(
    currentScene.monster && game.clearedMonsterMap[currentScene.id]
  )
  const currentBossHp =
    currentScene.monster?.mode === 'scroll'
      ? game.bossHpMap[currentScene.id] ?? currentScene.monster.hp
      : undefined

  return (
    <div className={`app-shell ${isCombatActive ? 'app-shell--combat' : ''}`}>
      <Hud
        floor={currentScene.floor}
        sceneIndex={game.currentSceneIndex}
        totalScenes={scenes.length}
      />

      <Party
        ref={partyRef}
        party={currentScene.party}
        newAlly={currentScene.newAlly}
        moveDirection={currentScene.moveDirection}
        sceneIndex={game.currentSceneIndex}
        attackTrigger={game.attackTrigger}
        isCombatActive={isCombatActive}
      />
      <Monster
        ref={monsterRef}
        monster={currentScene.monster}
        controlledHp={currentBossHp}
        onDefeat={() => {
          resetCombatEffects()
          game.handleMonsterDefeat(currentScene.id)
        }}
        isCombatActive={isCombatActive}
        isCleared={isCurrentMonsterCleared}
        resetKey={currentScene.id}
      />

      <BattleOverlay isCombatActive={isCombatActive} attackTrigger={game.attackTrigger} />
      <CombatPrompt
        isActive={isCombatActive}
        currentHp={currentBossHp}
        maxHp={currentScene.monster?.hp}
      />
      <EffectsLayer
        slashes={slashes}
        impactWords={impactWords}
        combatBolts={combatBolts}
      />

      <main>
        {scenes.map((scene, idx) => (
          <Scene
            key={scene.id}
            ref={(el) => (game.sceneRefs.current[idx] = el)}
            scene={scene}
            index={idx}
            isCombatActive={game.activeCombatSceneId === scene.id}
          />
        ))}
      </main>

      <ScrollHint hidden={game.hasScrolled} />
    </div>
  )
}
