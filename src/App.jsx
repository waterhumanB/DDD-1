import { useCallback, useEffect, useMemo, useRef } from 'react'
import gsap from 'gsap'
import { scenes } from './data/scenes'
import { SCENE_DISCOVERIES } from './data/discoveries'
import { SCENE_BGM } from './lib/bgm.js'
import { findNeighbor } from './lib/navigation.js'
import { useGameOrchestrator } from './hooks/useGameOrchestrator.js'
import { useCharacter } from './hooks/useCharacter.js'
import { useBgm } from './hooks/useBgm.js'
import { useCombatEffects } from './hooks/useCombatEffects.js'
import { useCombatInput } from './hooks/useCombatInput.js'
import { usePartyJump } from './hooks/usePartyJump.js'
import { useSceneSlide } from './hooks/useSceneSlide.js'
import { useSoundEffects } from './hooks/useSoundEffects.js'
import Scene from './components/Scene'
import Party from './components/Party'
import Monster from './components/Monster'
import Hud from './components/Hud'
import CombatPrompt from './components/CombatPrompt'
import EffectsLayer from './components/EffectsLayer'
import BattleOverlay from './components/BattleOverlay'
import NavHint from './components/NavHint'
import EdgeMarkers from './components/EdgeMarkers'
import VirtualDPad from './components/VirtualDPad'
import Discoveries from './components/Discoveries'

export default function App() {
  const partyRef = useRef(null)
  const monsterRef = useRef(null)
  const trackRef = useRef(null)
  const surfaceRef = useRef(null)
  const combatResetRef = useRef(() => {})
  const moveRef = useRef(() => {})
  const combatActiveRef = useRef(false)

  const onCombatReset = useCallback(() => combatResetRef.current?.(), [])
  const sound = useSoundEffects()
  const playRef = useRef(sound.play)
  playRef.current = sound.play

  const onStepSound = useCallback(() => playRef.current?.('step'), [])
  const onCharacterEdge = useCallback((direction) => moveRef.current?.(direction), [])
  const character = useCharacter({
    blockedRef: combatActiveRef,
    surfaceRef,
    onEdge: onCharacterEdge,
    onStep: onStepSound,
  })

  const onSceneChange = useCallback(
    (_idx, direction) => {
      const isReverse = direction === 'left' || direction === 'down'
      playRef.current(isReverse ? 'sceneRetreat' : 'sceneAdvance')
      character.placeAtSpawn(direction)
    },
    [character]
  )
  const onNavBlocked = useCallback(() => playRef.current('navBlocked'), [])
  const onAttackHit = useCallback(() => playRef.current('hit'), [])
  const onBossDefeat = useCallback(() => playRef.current('bossDefeat'), [])
  const onCombatStart = useCallback(() => playRef.current('combatStart'), [])

  const game = useGameOrchestrator(scenes, {
    partyRef, monsterRef, onCombatReset,
    onSceneChange, onNavBlocked, onAttackHit, onBossDefeat, onCombatStart,
  })
  moveRef.current = game.move

  const isCombatActive = Boolean(game.activeCombatSceneId)
  useEffect(() => {
    combatActiveRef.current = isCombatActive
  }, [isCombatActive])
  const triggerAttackWithSound = useCallback(() => {
    playRef.current('attack')
    game.triggerAttack()
  }, [game])

  const { slashes, impactWords, combatBolts, reset: resetCombatEffects } =
    useCombatEffects({
      attackTrigger: game.attackTrigger,
      isCombatActive,
      partyRef, monsterRef,
      isFinisherRef: game.isFinisherRef,
    })

  useEffect(() => {
    combatResetRef.current = resetCombatEffects
  }, [resetCombatEffects])

  const currentScene = scenes[game.currentSceneIndex]
  useBgm({ mood: SCENE_BGM[currentScene.id], muted: sound.muted })

  useCombatInput(isCombatActive, triggerAttackWithSound)
  usePartyJump(partyRef, game.currentSceneIndex)
  useSceneSlide(trackRef, scenes, game.currentSceneIndex)

  useEffect(() => {
    gsap.set(document.documentElement, { overflow: 'hidden' })
    gsap.set(document.body, { overflow: 'hidden', height: '100vh' })
  }, [])

  const visibleScenes = useMemo(() => {
    const ids = new Set([currentScene.id])
    for (const dir of ['left', 'right', 'up', 'down']) {
      const n = findNeighbor(scenes, currentScene.id, dir)
      if (n) ids.add(n.id)
    }
    return scenes.filter((s) => ids.has(s.id))
  }, [currentScene.id])
  const isCurrentMonsterCleared = Boolean(
    currentScene.monster && game.clearedMonsterMap[currentScene.id]
  )
  const currentBossHp =
    currentScene.monster?.mode === 'boss'
      ? game.bossHpMap[currentScene.id] ?? currentScene.monster.hp
      : undefined

  return (
    <div
      ref={surfaceRef}
      className={`app-shell ${isCombatActive ? 'app-shell--combat' : ''}`}
    >
      <Hud
        floor={currentScene.floor}
        sceneIndex={game.currentSceneIndex}
        totalScenes={scenes.length}
        muted={sound.muted}
        onToggleMute={sound.toggleMute}
      />

      <Party
        ref={partyRef}
        party={currentScene.party}
        newAlly={currentScene.newAlly}
        facing={character.facing}
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
      <EffectsLayer slashes={slashes} impactWords={impactWords} combatBolts={combatBolts} />

      <main className="scene-track" ref={trackRef}>
        {visibleScenes.map((scene) => (
          <Scene
            key={scene.id}
            scene={scene}
            index={scenes.indexOf(scene)}
            isCombatActive={game.activeCombatSceneId === scene.id}
          />
        ))}
      </main>

      <Discoveries
        items={SCENE_DISCOVERIES[currentScene.id]}
        characterX={character.x}
        characterY={character.y}
        isCombatActive={isCombatActive}
      />
      <EdgeMarkers
        isCombatActive={isCombatActive}
        nextDirection={currentScene.next?.direction || null}
        prevDirection={currentScene.prev?.direction || null}
        characterX={character.x}
        characterY={character.y}
      />
      <NavHint isCombatActive={isCombatActive} />
      <VirtualDPad isCombatActive={isCombatActive} />
    </div>
  )
}
