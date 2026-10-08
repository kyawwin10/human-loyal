import { useEffect, useRef, useState } from 'react'
import { loveStory } from '../config/loveStory'

export function useMusic() {
  const audio = useRef<HTMLAudioElement | null>(null)
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(false)
  const [unavailable, setUnavailable] = useState(false)
  const [attempted, setAttempted] = useState(false)
  useEffect(() => {
    const song = new Audio()
    song.preload = 'none'
    song.loop = true
    song.volume = loveStory.music.volume
    song.onplay = () => setPlaying(true)
    song.onpause = () => setPlaying(false)
    song.onerror = () => { setUnavailable(true); setPlaying(false) }
    audio.current = song
    return () => { song.pause(); song.onplay = null; song.onpause = null; song.onerror = null; song.removeAttribute('src'); song.load() }
  }, [])
  function play() {
    if (!audio.current || !loveStory.music.enabled) return
    setAttempted(true)
    if (!audio.current.getAttribute('src')) audio.current.src = loveStory.music.src
    void audio.current.play().catch(() => { setUnavailable(true); setPlaying(false) })
  }
  function toggle() { if (playing) audio.current?.pause(); else play() }
  function toggleMute() { if (audio.current) { audio.current.muted = !muted; setMuted(!muted) } }
  return { playing, muted, unavailable, attempted, play, toggle, toggleMute }
}