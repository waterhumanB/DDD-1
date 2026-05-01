import { useEffect } from 'react'
import gsap from 'gsap'

const SLIDE_DURATION_S = 0.6

export function useSceneSlide(trackRef, scenes, sceneIndex) {
  useEffect(() => {
    if (!trackRef.current) return
    const scene = scenes?.[sceneIndex]
    if (!scene) return
    gsap.to(trackRef.current, {
      xPercent: -100 * (scene.gridX ?? sceneIndex),
      yPercent: -100 * (scene.gridY ?? 0),
      duration: SLIDE_DURATION_S,
      ease: 'power3.inOut',
      overwrite: 'auto',
    })
  }, [trackRef, scenes, sceneIndex])
}
