import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
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
import BossChallengeButton from './components/BossChallengeButton'

export default function App() {
  const partyRef = useRef(null)
  const monsterRef = useRef(null)
  const trackRef = useRef(null)
  const surfaceRef = useRef(null)
  const combatResetRef = useRef(() => {})
  const moveRef = useRef(() => {})
  const combatActiveRef = useRef(false)
  const [activeEncounterSceneId, setActiveEncounterSceneId] = useState(null)

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

  const currentScene = scenes[game.currentSceneIndex]
  const isCombatActive = Boolean(game.activeCombatSceneId)
  const isEncounterActive = activeEncounterSceneId === currentScene?.id
  const isBattleVisualActive = isCombatActive || isEncounterActive
  useEffect(() => {
    combatActiveRef.current = isBattleVisualActive
  }, [isBattleVisualActive])
  const triggerAttackWithSound = useCallback(() => {
    playRef.current('attack')
    game.triggerAttack()
  }, [game])
  const handleEncounterChange = useCallback((active) => {
    setActiveEncounterSceneId(active ? currentScene.id : null)
  }, [currentScene.id])

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
  const isBossScene = currentScene.monster?.mode === 'boss'
  const currentBossHp = isBossScene
    ? game.bossHpMap[currentScene.id] ?? currentScene.monster.hp
    : undefined
  const showBossChallenge =
    isBossScene && !isCombatActive && !isCurrentMonsterCleared

  return (
    <div
      ref={surfaceRef}
      className={`app-shell ${isBattleVisualActive ? 'app-shell--combat' : ''} ${
        isEncounterActive ? 'app-shell--encounter' : ''
      }`}
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
        isCombatActive={isBattleVisualActive}
      />
      <Monster
        ref={monsterRef}
        monster={currentScene.monster}
        controlledHp={currentBossHp}
        onDefeat={() => {
          setActiveEncounterSceneId(null)
          character.releaseLocks()
          resetCombatEffects()
          game.handleMonsterDefeat(currentScene.id)
        }}
        isCombatActive={isCombatActive}
        isEncounterActive={isEncounterActive}
        isCleared={isCurrentMonsterCleared}
        resetKey={currentScene.id}
        onEncounterChange={handleEncounterChange}
        hideForChallenge={showBossChallenge}
      />
      <BossChallengeButton
        visible={showBossChallenge}
        onChallenge={() => game.startBossCombat(currentScene.id)}
        label={currentScene.monster?.isFinalBoss ? '최종 보스 도전!' : '도전하기'}
      />

      <BattleOverlay isCombatActive={isBattleVisualActive} attackTrigger={game.attackTrigger} />
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
            isCombatActive={
              game.activeCombatSceneId === scene.id || activeEncounterSceneId === scene.id
            }
          />
        ))}
      </main>

      <Discoveries
        items={SCENE_DISCOVERIES[currentScene.id]}
        characterX={character.x}
        characterY={character.y}
        isCombatActive={isBattleVisualActive}
      />
      <EdgeMarkers
        isCombatActive={isBattleVisualActive}
        nextDirection={currentScene.next?.direction || null}
        prevDirection={currentScene.prev?.direction || null}
        characterX={character.x}
        characterY={character.y}
      />
      <NavHint isCombatActive={isBattleVisualActive} />
      <VirtualDPad isCombatActive={isBattleVisualActive} onMoveDirect={character.moveDirect} />
    </div>
  )
}
