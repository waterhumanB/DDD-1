import { useEffect } from 'react'
import gsap from 'gsap'

export function usePartyJump(partyRef, sceneIndex) {
  useEffect(() => {
    if (!partyRef.current) return
    gsap.fromTo(
      partyRef.current,
      { y: 0 },
      {
        keyframes: [
          { y: -28, duration: 0.18 },
          { y: 0, duration: 0.28, ease: 'bounce.out' },
        ],
      }
    )
  }, [partyRef, sceneIndex])
}
