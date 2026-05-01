import { useEffect, useRef } from 'react'
import { BGM_PATTERNS } from '../lib/bgm.js'
import { playTone, resumeContext } from '../lib/sound.js'

export function useBgm({ mood, muted }) {
  const activeRef = useRef(false)
  const moodRef = useRef(mood)
  const mutedRef = useRef(muted)

  useEffect(() => { moodRef.current = mood }, [mood])
  useEffect(() => { mutedRef.current = muted }, [muted])

  useEffect(() => {
    if (muted) return
    if (!mood) return
    const pattern = BGM_PATTERNS[mood]
    if (!pattern) return

    activeRef.current = true
    resumeContext()
    const noteTimers = new Set()
    let cycleTimer = null

    const fireOnce = () => {
      if (!activeRef.current) return
      if (mutedRef.current) return
      if (moodRef.current !== mood) return
      pattern.notes.forEach((note) => {
        const id = setTimeout(() => {
          noteTimers.delete(id)
          if (!activeRef.current) return
          if (mutedRef.current) return
          if (moodRef.current !== mood) return
          playTone(note)
        }, Math.max(0, note.time * 1000))
        noteTimers.add(id)
      })
    }

    const startDelay = setTimeout(() => {
      noteTimers.delete(startDelay)
      fireOnce()
      cycleTimer = setInterval(fireOnce, pattern.cycleSec * 1000)
    }, 250)
    noteTimers.add(startDelay)

    return () => {
      activeRef.current = false
      noteTimers.forEach((id) => clearTimeout(id))
      noteTimers.clear()
      if (cycleTimer) clearInterval(cycleTimer)
    }
  }, [mood, muted])
}
