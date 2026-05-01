import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import confetti from 'canvas-confetti'
import {
  EFFECT_LIFETIME_MS,
  confettiBurst,
  makeCombatBolts,
  makeImpactWord,
  makeSlash,
} from '../lib/combat.js'

const HERO_ATTACK_KEYFRAMES = [
  { x: 82, y: -64, rotation: -28, scale: 1.2, duration: 0.12 },
  { x: 112, y: -34, rotation: 24, scale: 1.16, duration: 0.08 },
  { x: 52, y: -16, rotation: 8, scale: 1.08, duration: 0.1 },
  { x: 0, y: 0, rotation: 0, scale: 1, duration: 0.16, ease: 'power2.out' },
]

function allyAttackKeyframes(direction) {
  return [
    { x: 22, y: -22, rotation: direction * 8, scale: 1.12, duration: 0.11 },
    { x: 34, y: -8, rotation: direction * -6, scale: 1.08, duration: 0.08 },
    { x: 0, y: 0, rotation: 0, scale: 1, duration: 0.18, ease: 'back.out(1.8)' },
  ]
}

const MONSTER_HIT_KEYFRAMES = [
  { x: -16, scaleX: 1.18, scaleY: 0.86, rotation: -7, filter: 'brightness(2.4) saturate(0)', duration: 0.05 },
  { x: 14, scaleX: 0.92, scaleY: 1.1, rotation: 5, filter: 'brightness(1.6) saturate(0.4)', duration: 0.06 },
  { x: -8, scaleX: 1.04, scaleY: 0.97, rotation: -2, filter: 'brightness(1.1) saturate(1)', duration: 0.07 },
  { x: 6, scaleX: 1, scaleY: 1, rotation: 1, filter: 'brightness(1)', duration: 0.07 },
  { x: 0, scaleX: 1, scaleY: 1, rotation: 0, duration: 0.05 },
]

const MONSTER_FINISHER_KEYFRAMES = [
  { x: -22, scaleX: 1.3, scaleY: 0.78, rotation: -10, filter: 'brightness(3.5) saturate(0)', duration: 0.06 },
  { x: 20, scaleX: 0.86, scaleY: 1.18, rotation: 9, filter: 'brightness(2.2) saturate(0.2)', duration: 0.07 },
  { x: -16, scaleX: 1.1, scaleY: 0.95, rotation: -5, filter: 'brightness(1.6) saturate(0.6) hue-rotate(20deg)', duration: 0.09 },
  { x: 12, scaleX: 0.96, scaleY: 1.04, rotation: 4, filter: 'brightness(1.2) saturate(0.85)', duration: 0.1 },
  { x: 0, scaleX: 1, scaleY: 1, rotation: 0, filter: 'brightness(1)', duration: 0.12 },
]

function animatePartyAttack(partyEl) {
  const members = Array.from(partyEl.querySelectorAll('.party__member'))
  members.forEach((member, index) => {
    const isHero = member.classList.contains('party__member--hero')
    const direction = index % 2 === 0 ? -1 : 1
    const delay = isHero ? 0 : 0.03 + index * 0.035

    gsap.killTweensOf(member)
    gsap.fromTo(
      member,
      { x: 0, y: 0, rotation: 0, scale: 1 },
      {
        delay,
        keyframes: isHero ? HERO_ATTACK_KEYFRAMES : allyAttackKeyframes(direction),
      }
    )
  })
}

function animateMonsterHit(monsterEl, isFinisher) {
  const keyframes = isFinisher ? MONSTER_FINISHER_KEYFRAMES : MONSTER_HIT_KEYFRAMES
  gsap.killTweensOf(monsterEl)
  gsap.fromTo(
    monsterEl,
    { x: 0, scaleX: 1, scaleY: 1, rotation: 0, filter: 'brightness(1)' },
    { keyframes, transformOrigin: '50% 100%' }
  )
  monsterEl.classList.add('monster--struck')
  if (isFinisher) monsterEl.classList.add('monster--struck-final')
  setTimeout(() => {
    monsterEl.classList.remove('monster--struck')
    monsterEl.classList.remove('monster--struck-final')
  }, isFinisher ? 480 : 320)
}

export function useCombatEffects({
  attackTrigger,
  isCombatActive,
  partyRef,
  monsterRef,
  isFinisherRef,
}) {
  const [slashes, setSlashes] = useState([])
  const [impactWords, setImpactWords] = useState([])
  const [combatBolts, setCombatBolts] = useState([])
  const lastAnimatedRef = useRef(0)
  const timeoutsRef = useRef(new Set())

  useEffect(() => {
    if (attackTrigger === 0) return
    if (lastAnimatedRef.current === attackTrigger) return
    lastAnimatedRef.current = attackTrigger

    const isFinisher = Boolean(isFinisherRef.current)

    if (isCombatActive) {
      confettiBurst(isFinisher).forEach((opts) => confetti(opts))
    }
    if (partyRef.current) animatePartyAttack(partyRef.current)
    if (monsterRef.current) animateMonsterHit(monsterRef.current, isFinisher)

    const slash = makeSlash()
    const impact = makeImpactWord(isFinisher)
    const bolts = makeCombatBolts(slash.id)

    setSlashes((prev) => [...prev, slash])
    setImpactWords((prev) => [...prev, impact])
    setCombatBolts((prev) => [...prev, ...bolts])

    const cleanup = setTimeout(() => {
      setSlashes((prev) => prev.filter((s) => s.id !== slash.id))
      setImpactWords((prev) => prev.filter((w) => w.id !== impact.id))
      setCombatBolts((prev) => prev.filter((b) => !bolts.some((nb) => nb.id === b.id)))
      timeoutsRef.current.delete(cleanup)
    }, EFFECT_LIFETIME_MS)
    timeoutsRef.current.add(cleanup)
  }, [attackTrigger, isCombatActive, partyRef, monsterRef, isFinisherRef])

  const reset = () => {
    timeoutsRef.current.forEach((id) => clearTimeout(id))
    timeoutsRef.current.clear()
    setSlashes([])
    setImpactWords([])
    setCombatBolts([])
    confetti.reset?.()
  }

  useEffect(() => () => reset(), [])

  return { slashes, impactWords, combatBolts, reset }
}
