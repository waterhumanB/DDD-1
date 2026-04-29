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

const MONSTER_SHAKE_KEYFRAMES = [
  { x: -14, rotation: -3, duration: 0.04 },
  { x: 14, rotation: 3, duration: 0.04 },
  { x: -10, rotation: -2, duration: 0.04 },
  { x: 8, rotation: 2, duration: 0.04 },
  { x: 0, rotation: 0, duration: 0.06 },
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

function animateMonsterShake(monsterEl) {
  gsap.fromTo(monsterEl, { x: 0, rotation: 0 }, { keyframes: MONSTER_SHAKE_KEYFRAMES })
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
    if (monsterRef.current) animateMonsterShake(monsterRef.current)

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
