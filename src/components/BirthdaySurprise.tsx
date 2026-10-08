import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { MoveRight, RotateCcw } from 'lucide-react'

type Phase = 'idle' | 'shooting' | 'celebrating' | 'complete'

export function BirthdaySurprise({ wish }: { wish: string }) {
  const reduced = useReducedMotion()
  const [phase, setPhase] = useState<Phase>('idle')
  const [round, setRound] = useState(0)
  const celebrating = phase === 'celebrating' || phase === 'complete'
  const busy = phase === 'shooting' || phase === 'celebrating'

  function start() {
    setRound(previous => previous + 1)
    setPhase(reduced ? 'complete' : 'shooting')
  }

  return <motion.div
    className="birthday-surprise"
    role="group"
    aria-label="Birthday surprise"
    data-phase={phase}
    onViewportEnter={() => setPhase(previous => previous === 'idle' ? (reduced ? 'complete' : 'shooting') : previous)}
    viewport={{ once: true, amount: 0.5 }}
  >
    <svg key={round} className="birthday-scene" viewBox="0 0 440 400" aria-hidden="true">
      <path d="M48 120 H235" stroke="#d6b4bd" strokeWidth="1" strokeDasharray="3 9" />
      <ellipse cx="240" cy="349" rx="102" ry="9" fill="#b77a8a" opacity="0.1" />
      <motion.g
        style={{ transformOrigin: '280px 118px' }}
        animate={{ scale: celebrating && !reduced ? [1, 1.17, 0.96, 1] : 1 }}
        transition={{ duration: 0.65 }}
      >
        <path d="M280 165 C267 154 218 126 218 95 C218 57 263 48 280 79 C297 48 342 57 342 95 C342 126 293 154 280 165 Z" fill="#b26079" stroke="#97475f" strokeWidth="2" />
        <path d="M280 145 C266 133 237 115 237 96 C237 76 265 70 280 96 C295 70 323 76 323 96 C323 115 294 133 280 145 Z" fill="none" stroke="#edc3cf" strokeWidth="1.5" />
        <path d="M280 125 C273 120 265 113 265 106 C265 97 276 94 280 102 C284 94 295 97 295 106 C295 113 287 120 280 125 Z" fill="#f4d9df" />
      </motion.g>
      {!reduced && <motion.g
        className="birthday-arrow"
        initial={{ x: -140, opacity: 0 }}
        animate={phase === 'idle' ? { x: -140, opacity: 0 } : { x: 280, opacity: celebrating ? 0 : 1 }}
        transition={phase === 'shooting' ? { x: { duration: 0.95, delay: 0.25, ease: [0.45, 0, 0.8, 1] }, opacity: { duration: 0.15 } } : { duration: 0.4 }}
        onAnimationComplete={() => { if (phase === 'shooting') setPhase('celebrating') }}
      >
        <path d="M-109 119 H-10" stroke="#986144" strokeWidth="3" strokeLinecap="round" />
        <path d="M0 119 L-17 110 L-13 119 L-17 128 Z" fill="#c3995d" />
        <path d="M-85 119 L-105 104 H-119 L-103 119 L-119 134 H-105 Z" fill="#c7879b" stroke="#a66279" strokeWidth="1" />
      </motion.g>}
      {celebrating && !reduced && Array.from({ length: 12 }, (_, index) => {
        const angle = index * Math.PI / 6
        return <motion.circle key={index} cx="280" cy="118" r={index % 2 ? 2 : 3} fill={index % 2 ? '#c19b5d' : '#b26079'} initial={{ opacity: 0, x: 0, y: 0 }} animate={{ opacity: [0, 1, 0], x: Math.cos(angle) * 87, y: Math.sin(angle) * 75 }} transition={{ duration: 0.8 }} />
      })}
      <motion.g
        className="birthday-cake"
        initial={reduced ? false : { y: -190, opacity: 0 }}
        animate={celebrating ? { y: 0, opacity: 1 } : { y: -190, opacity: 0 }}
        transition={reduced ? { duration: 0 } : { y: { type: 'spring', stiffness: 130, damping: 13, delay: 0.3 }, opacity: { duration: 0.25, delay: 0.3 } }}
        onAnimationComplete={() => { if (phase === 'celebrating') setPhase('complete') }}
      >
        <ellipse cx="240" cy="343" rx="100" ry="8" fill="#d8bd9c" />
        <rect x="154" y="276" width="172" height="63" rx="7" fill="#bf8194" />
        <path d="M154 277 H326 V289 Q315 303 305 288 Q294 310 283 289 Q270 309 259 289 Q246 312 234 289 Q222 308 210 289 Q198 308 187 288 Q173 307 154 291 Z" fill="#fff3e8" />
        <path d="M165 321 H315" stroke="#e3afbf" strokeWidth="3" strokeDasharray="2 12" strokeLinecap="round" />
        <rect x="181" y="229" width="118" height="50" rx="6" fill="#e5b3c0" />
        <path d="M181 229 H299 V240 Q290 253 281 239 Q270 259 260 239 Q249 255 240 239 Q229 256 220 239 Q210 254 201 239 Q191 252 181 240 Z" fill="#fff7ef" />
        {[216, 240, 264].map((position, index) => <g key={position}>
          <rect x={position - 3} y="203" width="6" height="27" rx="2" fill={index === 1 ? '#c59e63' : '#ad6079'} />
          <path d={`M${position - 2} 209 L${position + 2} 213 M${position - 2} 217 L${position + 2} 221`} stroke="#fff3e8" strokeWidth="1.5" />
          <path className="birthday-cake-flame" style={{ animationDelay: `${index * 0.3}s`, transformOrigin: `${position}px 196px` }} d={`M${position} 183 C${position - 9} 195 ${position - 7} 202 ${position} 202 C${position + 7} 202 ${position + 9} 195 ${position} 183 Z`} fill="#d9a65c" />
        </g>)}
        <path d="M240 270 C233 266 226 262 226 256 C226 248 236 246 240 252 C244 246 254 248 254 256 C254 262 247 266 240 270 Z" fill="#a65b73" />
      </motion.g>
    </svg>
    <motion.p className="birthday-wish handwritten" initial={{ opacity: 0 }} animate={{ opacity: celebrating ? 1 : 0 }} transition={{ duration: reduced ? 0 : 0.5, delay: reduced ? 0 : 0.7 }}>{wish}</motion.p>
    <button className="icon-button birthday-replay" onClick={start} disabled={busy} aria-label={phase === 'idle' ? 'Shoot birthday arrow' : 'Replay birthday surprise'} title={phase === 'idle' ? 'Shoot birthday arrow' : 'Replay birthday surprise'}>{phase === 'idle' ? <MoveRight size={19} /> : <RotateCcw size={19} />}</button>
    <span className="sr-only" role="status">{phase === 'complete' ? `The arrow hit the heart and revealed your birthday cake. ${wish}` : ''}</span>
  </motion.div>
}